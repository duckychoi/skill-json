// @TASK P3-R1-T1 - Render Job 생성 및 목록 조회 API
// @SPEC docs/planning/05-api-spec.md#render

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  readJSON,
  writeJSON,
  listFiles,
  getProjectPath,
} from "@/services/file-service";
import type { Project, Scene, RenderJob, LogEntry } from "@/types/index";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

/**
 * 렌더 작업 JSON 파일 경로를 반환합니다.
 * 규칙: data/{projectId}/render-jobs/{jobId}.json
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

/**
 * 렌더 작업 디렉토리 경로를 반환합니다.
 */
function getRenderJobsDir(projectId: string): string {
  return path.join(process.cwd(), "data", projectId, "render-jobs");
}

// ─────────────────────────────────────────────
// POST /api/projects/:projectId/render - 렌더링 작업 생성
// ─────────────────────────────────────────────

export async function POST(
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

    // scenes.json 읽기
    const scenesPath = getProjectPath(projectId, "scenes.json");
    const scenes = await readJSON<Scene[]>(scenesPath);
    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: "장면 데이터가 없습니다. 먼저 장면을 생성해주세요" },
        { status: 400 }
      );
    }

    // total_frames 계산: 모든 scene의 duration_frames 합산
    const totalFrames = scenes.reduce(
      (sum, scene) => sum + scene.duration_frames,
      0
    );

    const now = new Date().toISOString();
    const jobId = crypto.randomUUID();

    const initialLog: LogEntry = {
      timestamp: now,
      level: "info",
      message: `렌더링 작업 생성 (총 ${totalFrames}프레임, ${scenes.length}개 장면)`,
    };

    const renderJob: RenderJob = {
      id: jobId,
      project_id: projectId,
      status: "pending",
      total_frames: totalFrames,
      rendered_frames: 0,
      started_at: now,
      completed_at: null,
      output_path: null,
      file_size: null,
      logs: [initialLog],
      current_scene: null,
    };

    // 렌더 작업 파일 저장
    const jobPath = getRenderJobPath(projectId, jobId);
    await writeJSON(jobPath, renderJob);

    return NextResponse.json({ renderJob }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "렌더링 작업 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/render - 렌더 작업 목록 조회
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

    // 렌더 작업 파일 목록 조회
    const jobsDir = getRenderJobsDir(projectId);
    const files = await listFiles(jobsDir, ".json");

    const renderJobs: RenderJob[] = [];
    for (const file of files) {
      const jobPath = path.join(jobsDir, file);
      const job = await readJSON<RenderJob>(jobPath);
      if (job) {
        renderJobs.push(job);
      }
    }

    return NextResponse.json({ renderJobs }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "렌더 작업 목록 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
