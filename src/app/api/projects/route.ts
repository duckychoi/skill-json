// @TASK P1-R1-T1 - Project 목록 조회 & 생성 API
// @SPEC docs/planning/05-api-spec.md#projects

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  readJSON,
  writeJSON,
  listDirs,
  getProjectPath,
} from "@/services/file-service";
import { ProjectCreateSchema } from "@/types/schemas";
import type { Project } from "@/types/index";

// ─────────────────────────────────────────────
// GET /api/projects - 프로젝트 목록 조회
// ─────────────────────────────────────────────

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const dirNames = await listDirs(dataDir);

    const projects: Project[] = [];
    for (const dirName of dirNames) {
      const filePath = getProjectPath(dirName, "project.json");
      const project = await readJSON<Project>(filePath);
      if (project) {
        projects.push(project);
      }
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "프로젝트 목록 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/projects - 프로젝트 생성
// ─────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    const parsed = ProjectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 검증 실패",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, srt_path, audio_path } = parsed.data;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const project: Project = {
      id,
      name,
      srt_path,
      audio_path,
      created_at: now,
      updated_at: now,
      status: "draft",
      total_duration_ms: 0,
    };

    const filePath = getProjectPath(id, "project.json");
    await writeJSON(filePath, project);

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "프로젝트 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
