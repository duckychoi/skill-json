// @TASK P1.5-SK1-T2 - /vg-chunk SRT 의미 청킹 API Route
// @SPEC specs/shared/types.yaml
// @TEST tests/api/skills-chunk.test.ts

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import { parseSRT, type SRTEntry } from "@/services/srt-parser";
import type { Project } from "@/types/index";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface BeatSemantic {
  intent: string;
  tone: string;
  evidence_type: string;
  emphasis_tokens: string[];
  density: number;
}

interface Beat {
  beat_index: number;
  start_ms: number;
  end_ms: number;
  start_frame: number;
  end_frame: number;
  text: string;
  semantic: BeatSemantic;
}

// ─────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────

const ChunkRequestSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
});

// ─────────────────────────────────────────────
// Mock 의미 분석 (휴리스틱 기반)
// 실제 Claude API 연동은 추후 태스크에서 구현
// ─────────────────────────────────────────────

function analyzeSemanticMock(text: string): BeatSemantic {
  const lower = text.toLowerCase();

  // Intent detection (heuristic)
  let intent = "explain";
  if (lower.includes("예를 들") || lower.includes("예시") || lower.includes("예컨대")) {
    intent = "example";
  } else if (lower.includes("비교") || lower.includes("반면") || lower.includes("대비")) {
    intent = "compare";
  } else if (lower.includes("첫째") || lower.includes("둘째") || lower.includes("셋째") || lower.includes("번째")) {
    intent = "list";
  } else if (lower.includes("중요") || lower.includes("핵심") || lower.includes("강조") || lower.includes("특히")) {
    intent = "emphasize";
  } else if (lower.includes("정의") || lower.includes("란") || lower.includes("이란")) {
    intent = "define";
  }

  // Tone detection (heuristic)
  let tone = "neutral";
  if (lower.includes("!") || lower.includes("놀라") || lower.includes("혁신") || lower.includes("획기적")) {
    tone = "dramatic";
  } else if (lower.includes("?") || lower.includes("일까") || lower.includes("어떨까")) {
    tone = "questioning";
  } else if (lower.includes("확실") || lower.includes("분명") || lower.includes("틀림없")) {
    tone = "confident";
  } else if (lower.includes("사실") || lower.includes("데이터") || lower.includes("통계") || lower.includes("연구")) {
    tone = "analytical";
  }

  // Evidence type detection (heuristic)
  let evidenceType = "statement";
  if (lower.includes("통계") || lower.includes("%") || lower.includes("수치") || /\d+/.test(text)) {
    evidenceType = "statistic";
  } else if (lower.includes("인용") || lower.includes("따르면") || lower.includes("말했")) {
    evidenceType = "quote";
  } else if (lower.includes("예를 들") || lower.includes("사례") || lower.includes("경우")) {
    evidenceType = "example";
  } else if (lower.includes("정의") || lower.includes("란") || lower.includes("의미")) {
    evidenceType = "definition";
  }

  // Emphasis tokens: extract nouns/keywords (simple heuristic - words > 2 chars)
  const tokens = text
    .replace(/[.,!?;:'"()\[\]{}]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);
  const emphasisTokens = tokens.slice(0, Math.min(5, tokens.length));

  // Density: based on text length and word count (1-5)
  const wordCount = tokens.length;
  let density: number;
  if (wordCount <= 3) {
    density = 1;
  } else if (wordCount <= 6) {
    density = 2;
  } else if (wordCount <= 10) {
    density = 3;
  } else if (wordCount <= 15) {
    density = 4;
  } else {
    density = 5;
  }

  return {
    intent,
    tone,
    evidence_type: evidenceType,
    emphasis_tokens: emphasisTokens,
    density,
  };
}

// ─────────────────────────────────────────────
// SRT entries -> Beat 배열 변환
// ─────────────────────────────────────────────

function entriesToBeats(entries: SRTEntry[]): Beat[] {
  return entries.map((entry, idx) => ({
    beat_index: idx,
    start_ms: entry.startMs,
    end_ms: entry.endMs,
    start_frame: entry.startFrame,
    end_frame: entry.endFrame,
    text: entry.text,
    semantic: analyzeSemanticMock(entry.text),
  }));
}

// ─────────────────────────────────────────────
// POST /api/skills/chunk
// ─────────────────────────────────────────────

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

    const parsed = ChunkRequestSchema.safeParse(body);
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

    // 2. Read project.json
    const projectPath = getProjectPath(project_id, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (!project) {
      return NextResponse.json(
        { error: `프로젝트를 찾을 수 없습니다: ${project_id}` },
        { status: 404 }
      );
    }

    // 3. Read SRT file
    let srtContent: string;
    try {
      const srtFilePath = path.join(
        process.cwd(),
        "data",
        project_id,
        project.srt_path
      );
      srtContent = await fs.readFile(srtFilePath, "utf-8");
    } catch {
      return NextResponse.json(
        { error: `SRT 파일을 읽을 수 없습니다: ${project.srt_path}` },
        { status: 400 }
      );
    }

    // 4. Parse SRT
    const entries = parseSRT(srtContent);
    if (entries.length === 0) {
      return NextResponse.json(
        { error: "SRT 파일에 유효한 자막 엔트리가 없습니다" },
        { status: 400 }
      );
    }

    // 5. Generate beats with semantic analysis
    const beats = entriesToBeats(entries);

    // 6. Write beats.json
    const beatsPath = getProjectPath(project_id, "beats.json");
    await writeJSON(beatsPath, beats);

    // 7. Update project status to "chunked"
    const updatedProject: Project = {
      ...project,
      status: "chunked",
      updated_at: new Date().toISOString(),
    };
    const updatedProjectPath = getProjectPath(project_id, "project.json");
    await writeJSON(updatedProjectPath, updatedProject);

    // 8. Return success
    return NextResponse.json(
      {
        success: true,
        beats_count: beats.length,
        output_path: `data/${project_id}/beats.json`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "청킹 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
