// @TASK P1.5-SK3-T2 - /vg-catalog 스킬 (카탈로그 생성)
// @SPEC .claude/skills/vg-catalog/SKILL.md
// @TEST tests/api/skills-catalog.test.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import { layoutFamilies } from "@/data/layout-families";

// ─────────────────────────────────────────────
// 입력 스키마
// ─────────────────────────────────────────────

const CatalogRequestSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
});

// ─────────────────────────────────────────────
// Catalog 인터페이스
// ─────────────────────────────────────────────

interface CatalogLayout {
  id: string;
  name: string;
  recommended_intents: string[];
  recommended_tones: string[];
  evidence_types: string[];
  max_components: number;
}

interface MotionPreset {
  id: string;
  name: string;
  description: string;
  css_properties: string[];
  duration_ms: number;
}

interface CopyLayerField {
  max_length: number;
  optional: boolean;
}

interface Catalog {
  layouts: CatalogLayout[];
  motion_presets: MotionPreset[];
  copy_layer_schema: {
    kicker: CopyLayerField;
    headline: CopyLayerField;
    supporting: CopyLayerField;
    footer_caption: CopyLayerField;
  };
}

// ─────────────────────────────────────────────
// 레이아웃별 추천 intent/tone/evidence 매핑
// ─────────────────────────────────────────────

const LAYOUT_METADATA: Record<
  string,
  {
    recommended_intents: string[];
    recommended_tones: string[];
    evidence_types: string[];
    max_components: number;
  }
> = {
  "hero-center": {
    recommended_intents: ["emphasize", "introduce"],
    recommended_tones: ["confident", "dramatic"],
    evidence_types: ["quote", "definition"],
    max_components: 3,
  },
  "split-2col": {
    recommended_intents: ["compare", "contrast"],
    recommended_tones: ["analytical", "balanced"],
    evidence_types: ["statistic", "example"],
    max_components: 4,
  },
  "grid-4x3": {
    recommended_intents: ["list", "enumerate"],
    recommended_tones: ["organized", "comprehensive"],
    evidence_types: ["example", "statistic"],
    max_components: 12,
  },
  "process-horizontal": {
    recommended_intents: ["sequence", "timeline"],
    recommended_tones: ["methodical", "progressive"],
    evidence_types: ["example", "definition"],
    max_components: 6,
  },
  "radial-focus": {
    recommended_intents: ["focus", "highlight"],
    recommended_tones: ["intense", "spotlight"],
    evidence_types: ["quote", "statistic"],
    max_components: 5,
  },
  "stacked-vertical": {
    recommended_intents: ["stack", "layer"],
    recommended_tones: ["structured", "hierarchical"],
    evidence_types: ["statement", "definition"],
    max_components: 6,
  },
  "comparison-bars": {
    recommended_intents: ["compare", "statistic"],
    recommended_tones: ["analytical", "data-driven"],
    evidence_types: ["statistic", "example"],
    max_components: 8,
  },
  "spotlight-case": {
    recommended_intents: ["case-study", "example"],
    recommended_tones: ["narrative", "persuasive"],
    evidence_types: ["quote", "example"],
    max_components: 4,
  },
};

// ─────────────────────────────────────────────
// 10개 모션 프리셋 정의
// ─────────────────────────────────────────────

const MOTION_PRESETS: MotionPreset[] = [
  {
    id: "fadeUp",
    name: "Fade Up",
    description: "아래에서 위로 페이드인하며 등장",
    css_properties: ["opacity", "transform"],
    duration_ms: 600,
  },
  {
    id: "popNumber",
    name: "Pop Number",
    description: "숫자가 팝업 효과로 강조되며 등장",
    css_properties: ["opacity", "transform", "scale"],
    duration_ms: 400,
  },
  {
    id: "staggerChildren",
    name: "Stagger Children",
    description: "자식 요소들이 순차적으로 등장",
    css_properties: ["opacity", "transform"],
    duration_ms: 800,
  },
  {
    id: "drawConnector",
    name: "Draw Connector",
    description: "연결선이 그려지듯 나타남",
    css_properties: ["stroke-dashoffset", "stroke-dasharray"],
    duration_ms: 1000,
  },
  {
    id: "pulseAccent",
    name: "Pulse Accent",
    description: "강조 요소가 맥동 효과로 주목을 끔",
    css_properties: ["opacity", "scale", "box-shadow"],
    duration_ms: 500,
  },
  {
    id: "wipeBar",
    name: "Wipe Bar",
    description: "바 차트가 좌에서 우로 채워짐",
    css_properties: ["width", "opacity"],
    duration_ms: 700,
  },
  {
    id: "countUp",
    name: "Count Up",
    description: "숫자가 0에서 목표값까지 카운트업",
    css_properties: ["opacity"],
    duration_ms: 1200,
  },
  {
    id: "slideSplit",
    name: "Slide Split",
    description: "화면이 분할되며 콘텐츠가 슬라이드",
    css_properties: ["transform", "clip-path"],
    duration_ms: 600,
  },
  {
    id: "revealMask",
    name: "Reveal Mask",
    description: "마스크가 벗겨지며 콘텐츠가 드러남",
    css_properties: ["clip-path", "opacity"],
    duration_ms: 800,
  },
  {
    id: "popBadge",
    name: "Pop Badge",
    description: "뱃지가 튀어나오듯 등장",
    css_properties: ["opacity", "transform", "scale"],
    duration_ms: 350,
  },
];

// ─────────────────────────────────────────────
// Copy Layer 스키마 정의
// ─────────────────────────────────────────────

const COPY_LAYER_SCHEMA: Catalog["copy_layer_schema"] = {
  kicker: { max_length: 30, optional: true },
  headline: { max_length: 60, optional: false },
  supporting: { max_length: 120, optional: true },
  footer_caption: { max_length: 40, optional: true },
};

// ─────────────────────────────────────────────
// 카탈로그 빌더
// ─────────────────────────────────────────────

function buildCatalog(): Catalog {
  const layouts: CatalogLayout[] = layoutFamilies.map((family) => {
    const meta = LAYOUT_METADATA[family.id] ?? {
      recommended_intents: [],
      recommended_tones: [],
      evidence_types: [],
      max_components: 4,
    };

    return {
      id: family.id,
      name: family.name,
      recommended_intents: meta.recommended_intents,
      recommended_tones: meta.recommended_tones,
      evidence_types: meta.evidence_types,
      max_components: meta.max_components,
    };
  });

  return {
    layouts,
    motion_presets: MOTION_PRESETS,
    copy_layer_schema: COPY_LAYER_SCHEMA,
  };
}

// ─────────────────────────────────────────────
// POST /api/skills/catalog - 카탈로그 생성
// ─────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Layer 1: 입력 검증
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    const parsed = CatalogRequestSchema.safeParse(body);
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

    // Layer 2: 기존 데이터 읽기 (없으면 기본값 사용)
    const layoutExemplarsPath = getProjectPath(project_id, "layout-exemplars.json");
    const designTokensPath = getProjectPath(project_id, "design-tokens.json");

    // 파일 존재 여부 확인 (결과는 카탈로그 빌드에 활용 가능하지만,
    // 현재는 정적 카탈로그를 생성하므로 존재 여부만 확인)
    await readJSON(layoutExemplarsPath);
    await readJSON(designTokensPath);

    // Layer 3: 카탈로그 생성
    const catalog = buildCatalog();

    // Layer 4: catalog.json 저장
    const catalogPath = getProjectPath(project_id, "catalog.json");
    await writeJSON(catalogPath, catalog);

    return NextResponse.json(
      {
        success: true,
        catalog_path: `data/${project_id}/catalog.json`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "카탈로그 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
