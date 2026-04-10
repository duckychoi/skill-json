// @TASK P2-R1-T1 - Scene 병합 API
// @SPEC docs/planning/05-api-spec.md#scenes-merge

import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import type { Project, Scene } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

/**
 * duration_frames 계산: 30fps 기준
 */
function calcDurationFrames(startMs: number, endMs: number): number {
  return Math.round(((endMs - startMs) / 1000) * 30);
}

// ─────────────────────────────────────────────
// POST /api/projects/:projectId/scenes/merge - 장면 병합
// ─────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId } = await context.params;

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

    // scene_ids 검증
    const sceneIds = body.scene_ids;
    if (!Array.isArray(sceneIds) || sceneIds.length < 2) {
      return NextResponse.json(
        { error: "scene_ids는 2개 이상의 장면 ID 배열이어야 합니다" },
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

    // 병합 대상 장면 찾기 (beat_index 순으로 정렬)
    const targetScenes: { scene: Scene; index: number }[] = [];
    for (const sceneId of sceneIds) {
      const index = scenes.findIndex((s) => s.id === sceneId);
      if (index === -1) {
        return NextResponse.json(
          { error: `장면 '${sceneId}'을(를) 찾을 수 없습니다` },
          { status: 404 }
        );
      }
      targetScenes.push({ scene: scenes[index], index });
    }

    // beat_index 기준 정렬
    targetScenes.sort((a, b) => a.scene.beat_index - b.scene.beat_index);

    // 연속성 검증: beat_index가 연속인지 확인
    for (let i = 1; i < targetScenes.length; i++) {
      const prev = targetScenes[i - 1].scene;
      const curr = targetScenes[i].scene;
      if (curr.beat_index !== prev.beat_index + 1) {
        return NextResponse.json(
          { error: "병합할 장면들이 연속적이지 않습니다" },
          { status: 400 }
        );
      }
    }

    // 병합된 장면 생성 (첫 번째 장면 기반)
    const first = targetScenes[0].scene;
    const last = targetScenes[targetScenes.length - 1].scene;

    const mergedScene: Scene = {
      ...first,
      end_ms: last.end_ms,
      duration_frames: calcDurationFrames(first.start_ms, last.end_ms),
    };

    // 병합 대상 제거 후 병합 장면 삽입
    const mergeIndices = targetScenes
      .map((t) => t.index)
      .sort((a, b) => b - a); // 역순으로 제거

    for (const idx of mergeIndices) {
      scenes.splice(idx, 1);
    }

    // 첫 번째 장면 위치에 병합 결과 삽입
    const insertAt = Math.min(...targetScenes.map((t) => t.index));
    scenes.splice(insertAt, 0, mergedScene);

    // beat_index 재정렬
    scenes.forEach((scene, i) => {
      scene.beat_index = i;
    });

    await writeJSON(scenesPath, scenes);

    return NextResponse.json(
      { scene: mergedScene },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "장면 병합에 실패했습니다" },
      { status: 500 }
    );
  }
}
