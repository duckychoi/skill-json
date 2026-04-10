// @TASK P2-R1-T1 - Scene 분할 API
// @SPEC docs/planning/05-api-spec.md#scenes-split

import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import type { Project, Scene } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string; id: string }>;
};

/**
 * duration_frames 계산: 30fps 기준
 */
function calcDurationFrames(startMs: number, endMs: number): number {
  return Math.round(((endMs - startMs) / 1000) * 30);
}

// ─────────────────────────────────────────────
// POST /api/projects/:projectId/scenes/:id/split - 장면 분할
// ─────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId, id } = await context.params;

    // JSON 파싱
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    // split_ms 검증
    const splitMs = body.split_ms;
    if (typeof splitMs !== "number") {
      return NextResponse.json(
        { error: "split_ms는 필수 숫자 필드입니다" },
        { status: 400 }
      );
    }

    // 프로젝트 존재 확인
    const projectPath = getProjectPath(projectId, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 장면 로드
    const scenesPath = getProjectPath(projectId, "scenes.json");
    const scenes = (await readJSON<Scene[]>(scenesPath)) ?? [];

    const sceneIndex = scenes.findIndex((s) => s.id === id);
    if (sceneIndex === -1) {
      return NextResponse.json(
        { error: "장면을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const original = scenes[sceneIndex];

    // split_ms 범위 검증: start_ms < split_ms < end_ms (양 끝 제외)
    if (splitMs <= original.start_ms || splitMs >= original.end_ms) {
      return NextResponse.json(
        {
          error: `split_ms는 ${original.start_ms}보다 크고 ${original.end_ms}보다 작아야 합니다`,
        },
        { status: 400 }
      );
    }

    // 두 장면 생성
    const firstScene: Scene = {
      ...original,
      id: original.id, // 원본 ID 유지
      end_ms: splitMs,
      duration_frames: calcDurationFrames(original.start_ms, splitMs),
    };

    const secondScene: Scene = {
      ...original,
      id: crypto.randomUUID(),
      start_ms: splitMs,
      end_ms: original.end_ms,
      duration_frames: calcDurationFrames(splitMs, original.end_ms),
    };

    // 원본 장면을 두 장면으로 교체
    scenes.splice(sceneIndex, 1, firstScene, secondScene);

    // beat_index 재정렬
    scenes.forEach((scene, i) => {
      scene.beat_index = i;
    });

    await writeJSON(scenesPath, scenes);

    return NextResponse.json(
      { scenes: [firstScene, secondScene] },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "장면 분할에 실패했습니다" },
      { status: 500 }
    );
  }
}
