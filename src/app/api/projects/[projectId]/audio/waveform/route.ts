// @TASK P2-R2-T1 - Waveform API (파형 데이터만)
// @SPEC specs/shared/types.yaml

import { NextRequest, NextResponse } from "next/server";
import { readJSON, getProjectPath } from "@/services/file-service";
import type { Project } from "@/types/index";
import { generateMockWaveform } from "../waveform-utils";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/audio/waveform - 파형 데이터만
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

    // audio_path 확인
    if (!project.audio_path) {
      return NextResponse.json(
        { error: "오디오 파일이 설정되지 않았습니다" },
        { status: 404 }
      );
    }

    // Mock 파형 데이터 생성
    const waveformData = generateMockWaveform(project.total_duration_ms);

    return NextResponse.json(
      {
        project_id: projectId,
        duration_ms: project.total_duration_ms,
        waveform_data: waveformData,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "파형 데이터 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
