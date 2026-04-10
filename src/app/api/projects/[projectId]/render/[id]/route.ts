// @TASK P3-R1-T1 - Render Job 상태 조회 API
// @SPEC docs/planning/05-api-spec.md#render

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readJSON, getProjectPath } from "@/services/file-service";
import type { Project, RenderJob } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string; id: string }>;
};

/**
 * 렌더 작업 JSON 파일 경로를 반환합니다.
 */
function getRenderJobPath(projectId: string, jobId: string): string {
  return path.join(
    process.cwd(),
    "data",
    projectId,
    "render-jobs",
    `${jobId}.json`
  );
}

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/render/:id - 렌더 작업 상태 조회
// ─────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { projectId, id } = await context.params;

    // 프로젝트 존재 확인
    const projectPath = getProjectPath(projectId, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 렌더 작업 조회
    const jobPath = getRenderJobPath(projectId, id);
    const renderJob = await readJSON<RenderJob>(jobPath);
    if (!renderJob) {
      return NextResponse.json(
        { error: "렌더 작업을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ renderJob }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "렌더 작업 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
