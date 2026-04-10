// @TASK P3-R1-T1 - Render Job 취소 API
// @SPEC docs/planning/05-api-spec.md#render

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import type { Project, RenderJob } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string; id: string }>;
};

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
// PUT /api/projects/:projectId/render/:id/cancel - 렌더 취소
// ─────────────────────────────────────────────

export async function PUT(
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

    // completed 또는 failed 상태에서는 취소 불가
    if (renderJob.status === "completed" || renderJob.status === "failed") {
      return NextResponse.json(
        {
          error: `현재 상태(${renderJob.status})에서는 취소할 수 없습니다`,
        },
        { status: 409 }
      );
    }

    // 상태 변경
    renderJob.status = "failed";
    renderJob.completed_at = new Date().toISOString();
    renderJob.logs.push({
      timestamp: new Date().toISOString(),
      level: "warning",
      message: "사용자 취소",
    });

    await writeJSON(jobPath, renderJob);

    return NextResponse.json({ renderJob }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "렌더 취소에 실패했습니다" },
      { status: 500 }
    );
  }
}
