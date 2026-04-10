// @TASK P2-R1-T1 - Scenes 목록 조회 API
// @SPEC docs/planning/05-api-spec.md#scenes

import { NextRequest, NextResponse } from "next/server";
import { readJSON, getProjectPath } from "@/services/file-service";
import type { Project, Scene } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/scenes - 장면 목록 조회
// ─────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId } = await context.params;

    // 프로젝트 존재 확인
    const projectPath = getProjectPath(projectId, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 장면 목록 조회
    const scenesPath = getProjectPath(projectId, "scenes.json");
    const scenes = await readJSON<Scene[]>(scenesPath);

    return NextResponse.json(
      { scenes: scenes ?? [] },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "장면 목록 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
