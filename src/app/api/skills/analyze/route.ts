// @TASK P1.5-SK3-T1 - /vg-analyze 스킬 (레퍼런스 분석)
// @SPEC .claude/skills/vg-analyze/SKILL.md

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  readJSON,
  writeJSON,
  listFiles,
} from "@/services/file-service";
import { z } from "zod";

// ─────────────────────────────────────────────
// 입력 스키마
// ─────────────────────────────────────────────

const AnalyzeRequestSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
  reference_images: z.array(z.string()).optional(),
});

// ─────────────────────────────────────────────
// 디자인 토큰 & 레이아웃 인터페이스
// ─────────────────────────────────────────────

interface DesignTokens {
  colors: {
    background: string;
    accent: string;
    text_primary: string;
    text_secondary: string;
    surface: string;
  };
  typography: {
    font_family: string;
    headline_size: number;
    body_size: number;
    kicker_size: number;
  };
  spacing: {
    padding: number;
    gap: number;
  };
  radii: {
    card: number;
    button: number;
  };
}

interface LayoutExemplar {
  layout_family: string;
  confidence: number;
  source_image?: string;
}

// ─────────────────────────────────────────────
// 기본 디자인 토큰 (다크 + 네온 그린)
// ─────────────────────────────────────────────

function getDefaultDesignTokens(): DesignTokens {
  return {
    colors: {
      background: "#000000",
      accent: "#00FF00",
      text_primary: "#FFFFFF",
      text_secondary: "#888888",
      surface: "#111111",
    },
    typography: {
      font_family: "Inter",
      headline_size: 64,
      body_size: 24,
      kicker_size: 18,
    },
    spacing: {
      padding: 60,
      gap: 24,
    },
    radii: {
      card: 12,
      button: 8,
    },
  };
}

// ─────────────────────────────────────────────
// 기본 레이아웃 예시 (mock)
// ─────────────────────────────────────────────

function getDefaultLayoutExemplars(
  images: string[]
): LayoutExemplar[] {
  const defaultLayouts: LayoutExemplar[] = [
    { layout_family: "hero-center", confidence: 0.85 },
    { layout_family: "split-2col", confidence: 0.72 },
    { layout_family: "grid-4x3", confidence: 0.65 },
    { layout_family: "stacked-vertical", confidence: 0.58 },
  ];

  // 이미지가 있으면 첫 번째 이미지를 source로 연결
  if (images.length > 0) {
    defaultLayouts[0].source_image = images[0];
  }

  return defaultLayouts;
}

// ─────────────────────────────────────────────
// 이미지 확장자 필터
// ─────────────────────────────────────────────

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// ─────────────────────────────────────────────
// POST /api/skills/analyze - 레퍼런스 분석
// ─────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Layer 1: 입력 검증 (Pydantic/Zod 스키마)
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 검증 실패",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { project_id, reference_images } = parsed.data;

    // Layer 2: 프로젝트 존재 확인
    const projectPath = path.join(
      process.cwd(),
      "data",
      project_id,
      "project.json"
    );
    const project = await readJSON(projectPath);
    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미지 목록 결정
    let images: string[];
    if (reference_images && reference_images.length > 0) {
      // 직접 제공된 이미지 사용
      images = reference_images;
    } else {
      // references 디렉토리에서 이미지 파일 조회
      const referencesDir = path.join(
        process.cwd(),
        "data",
        project_id,
        "references"
      );
      const allFiles = await listFiles(referencesDir);
      images = allFiles.filter(isImageFile);
    }

    // 디자인 토큰 생성 (현재 mock)
    const designTokens = getDefaultDesignTokens();

    // 레이아웃 예시 생성 (현재 mock)
    const layoutExemplars = getDefaultLayoutExemplars(images);

    // JSON 파일 저장
    const designTokensPath = path.join(
      process.cwd(),
      "data",
      project_id,
      "design-tokens.json"
    );
    const layoutExemplarsPath = path.join(
      process.cwd(),
      "data",
      project_id,
      "layout-exemplars.json"
    );

    await writeJSON(designTokensPath, designTokens);
    await writeJSON(layoutExemplarsPath, layoutExemplars);

    // Layer 4: 추적 가능한 응답
    return NextResponse.json(
      {
        success: true,
        design_tokens_path: `data/${project_id}/design-tokens.json`,
        layout_exemplars_path: `data/${project_id}/layout-exemplars.json`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "레퍼런스 분석에 실패했습니다" },
      { status: 500 }
    );
  }
}
