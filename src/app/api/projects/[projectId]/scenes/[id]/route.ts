// @TASK P2-R1-T1 - Scene 상세 조회, 수정, 삭제 API
// @SPEC docs/planning/05-api-spec.md#scenes-id

import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import { SceneUpdateSchema } from "@/types/schemas";
import type { Project, Scene } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string; id: string }>;
};

/**
 * 프로젝트와 장면 목록을 로드합니다.
 * 프로젝트가 없으면 { error: 404 }를 반환합니다.
 */
async function loadProjectAndScenes(projectId: string): Promise<
  | { project: Project; scenes: Scene[]; scenesPath: string }
  | { error: NextResponse }
> {
  const projectPath = getProjectPath(projectId, "project.json");
  const project = await readJSON<Project>(projectPath);
  if (!project) {
    return {
      error: NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다" },
        { status: 404 }
      ),
    };
  }

  const scenesPath = getProjectPath(projectId, "scenes.json");
  const scenes = (await readJSON<Scene[]>(scenesPath)) ?? [];

  return { project, scenes, scenesPath };
}

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/scenes/:id - 장면 상세 조회
// ─────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId, id } = await context.params;
    const result = await loadProjectAndScenes(projectId);
    if ("error" in result) return result.error;

    const scene = result.scenes.find((s) => s.id === id);
    if (!scene) {
      return NextResponse.json(
        { error: "장면을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(scene, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "장면 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/projects/:projectId/scenes/:id - 장면 수정 (DSL 편집)
// ─────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId, id } = await context.params;

    // JSON 파싱
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    // 입력 검증
    const parsed = SceneUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 검증 실패",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await loadProjectAndScenes(projectId);
    if ("error" in result) return result.error;

    const { scenes, scenesPath } = result;
    const sceneIndex = scenes.findIndex((s) => s.id === id);
    if (sceneIndex === -1) {
      return NextResponse.json(
        { error: "장면을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 장면 업데이트
    const updated: Scene = {
      ...scenes[sceneIndex],
      ...parsed.data,
    };
    scenes[sceneIndex] = updated;

    await writeJSON(scenesPath, scenes);

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "장면 수정에 실패했습니다" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/projects/:projectId/scenes/:id - 장면 삭제
// ─────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId, id } = await context.params;
    const result = await loadProjectAndScenes(projectId);
    if ("error" in result) return result.error;

    const { scenes, scenesPath } = result;
    const sceneIndex = scenes.findIndex((s) => s.id === id);
    if (sceneIndex === -1) {
      return NextResponse.json(
        { error: "장면을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 장면 삭제
    scenes.splice(sceneIndex, 1);

    // beat_index 재정렬
    scenes.forEach((scene, i) => {
      scene.beat_index = i;
    });

    await writeJSON(scenesPath, scenes);

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "장면 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
