// @TASK P1.5-SK4-T1 - /vg-render Scene DSL -> mp4 렌더링 API Route
// @SPEC Scene DSL -> Remotion TSX 자동 생성 -> mp4 렌더링
// @TEST tests/api/skills-render.test.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import {
  readJSON,
  writeJSON,
  getProjectPath,
  ensureDir,
} from "@/services/file-service";
import { writeGeneratedComposition } from "@/services/remotion-builder";
import type { Project, Scene, RenderJob } from "@/types/index";

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const RenderRequestSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
});

// ---------------------------------------------------------------------------
// POST /api/skills/render
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse & validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    const parsed = RenderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 검증 실패",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { project_id } = parsed.data;

    // 2. Read scenes.json (required)
    const scenesPath = getProjectPath(project_id, "scenes.json");
    const scenes = await readJSON<Scene[]>(scenesPath);
    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        {
          error: `scenes.json을 찾을 수 없거나 비어 있습니다: ${project_id}`,
        },
        { status: 400 }
      );
    }

    // 3. Generate TSX composition via remotion-builder
    const outputDir = path.join(
      process.cwd(),
      "src",
      "generated",
      project_id
    );
    const buildResult = await writeGeneratedComposition(scenes, outputDir);

    // 4. Create RenderJob with status "rendering"
    const renderJobId = crypto.randomUUID();
    const now = new Date().toISOString();
    const expectedOutputPath = path.join(
      "output",
      project_id,
      `${project_id}.mp4`
    );

    const renderJob: RenderJob = {
      id: renderJobId,
      project_id,
      status: "rendering",
      total_frames: buildResult.totalFrames,
      rendered_frames: 0,
      started_at: now,
      completed_at: null,
      output_path: expectedOutputPath,
      file_size: null,
      logs: [
        {
          timestamp: now,
          level: "info",
          message: `렌더링 시작: TSX 생성 완료 (${buildResult.compositionFile})`,
        },
      ],
      current_scene: scenes[0]?.id ?? null,
    };

    // 5. Write render job JSON
    const renderJobsDir = path.join(
      process.cwd(),
      "data",
      project_id,
      "render-jobs"
    );
    await ensureDir(renderJobsDir);
    const renderJobPath = path.join(renderJobsDir, `${renderJobId}.json`);
    await writeJSON(renderJobPath, renderJob);

    // 6. Update project.json status to "rendered"
    const projectPath = getProjectPath(project_id, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (project) {
      const updatedProject: Project = {
        ...project,
        status: "rendered",
        updated_at: now,
      };
      await writeJSON(projectPath, updatedProject);
    }

    // 7. Return success
    // NOTE: Remotion CLI 실행은 mock 상태 (실제 npx remotion render는 추후 구현)
    return NextResponse.json(
      {
        success: true,
        render_job_id: renderJobId,
        output_path: expectedOutputPath,
        composition_file: buildResult.compositionFile,
        total_frames: buildResult.totalFrames,
        fps: buildResult.fps,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "렌더링 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
