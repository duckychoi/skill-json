// @TASK P1.5-SK2-T2 - DSL Generator (Scene DSL 생성기)
// @SPEC Beat + Scoring 결과 -> Scene DSL JSON 생성
// @TEST tests/services/dsl-generator.test.ts

import type {
  Scene,
  LayoutFamily,
  SceneComponent,
  CopyLayers,
  MotionConfig,
  AssetConfig,
  ChunkMetadata,
} from "@/types/index";
import { composeStackTree } from "./stack-composer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DSLGeneratorInput {
  beat: {
    beat_index: number;
    start_ms: number;
    end_ms: number;
    start_frame: number;
    end_frame: number;
    text: string;
    semantic: {
      intent: string;
      tone: string;
      evidence_type: string;
      emphasis_tokens: string[];
      density: number;
    };
  };
  layoutFamily: string; // scoring engine 결과
  projectId: string;
}

// ---------------------------------------------------------------------------
// Constants: 레이아웃별 기본 컴포넌트 템플릿
// ---------------------------------------------------------------------------

const LAYOUT_COMPONENTS: Record<string, Array<{ id: string; type: string }>> = {
  "hero-center": [
    { id: "hero-bg", type: "background" },
    { id: "hero-text", type: "text-block" },
  ],
  "split-2col": [
    { id: "col-left", type: "text-block" },
    { id: "col-right", type: "visual" },
  ],
  "grid-4x3": [
    { id: "grid-container", type: "grid" },
    { id: "grid-title", type: "text-block" },
  ],
  "process-horizontal": [
    { id: "process-flow", type: "process" },
    { id: "process-label", type: "text-block" },
  ],
  "radial-focus": [
    { id: "radial-center", type: "visual" },
    { id: "radial-label", type: "text-block" },
  ],
  "stacked-vertical": [
    { id: "stack-top", type: "text-block" },
    { id: "stack-bottom", type: "text-block" },
  ],
  "comparison-bars": [
    { id: "bars-chart", type: "chart" },
    { id: "bars-label", type: "text-block" },
  ],
  "spotlight-case": [
    { id: "spotlight-visual", type: "visual" },
    { id: "spotlight-text", type: "text-block" },
  ],
};

// ---------------------------------------------------------------------------
// Constants: intent -> motion entrance 매핑
// ---------------------------------------------------------------------------

const MOTION_ENTRANCE_MAP: Record<string, string> = {
  emphasize: "fadeUp",
  compare: "slideSplit",
  contrast: "slideSplit",
  list: "staggerChildren",
  enumerate: "staggerChildren",
  sequence: "drawConnector",
  timeline: "drawConnector",
  statistic: "countUp",
};

const DEFAULT_MOTION_ENTRANCE = "fadeUp";

// ---------------------------------------------------------------------------
// Constants: intent -> kicker 매핑
// ---------------------------------------------------------------------------

const KICKER_MAP: Record<string, string> = {
  compare: "VS",
  contrast: "VS",
  statistic: "DATA",
  list: "LIST",
  enumerate: "LIST",
  sequence: "STEP",
  timeline: "STEP",
};

// ---------------------------------------------------------------------------
// Internal helpers (pure)
// ---------------------------------------------------------------------------

function buildComponents(layoutFamily: string): SceneComponent[] {
  const template = LAYOUT_COMPONENTS[layoutFamily];
  if (!template) {
    // Fallback: unknown layout gets hero-center components
    return LAYOUT_COMPONENTS["hero-center"].map((c) => ({
      id: c.id,
      type: c.type,
      props: {},
    }));
  }
  return template.map((c) => ({
    id: c.id,
    type: c.type,
    props: {},
  }));
}

/**
 * 텍스트를 문장 단위로 분리합니다.
 * 마침표(.), 느낌표(!), 물음표(?) 뒤에서 분리합니다.
 */
function splitSentences(text: string): string[] {
  if (!text.trim()) return [];
  // Split on sentence-ending punctuation followed by space or end
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences;
}

function buildCopyLayers(
  text: string,
  semantic: DSLGeneratorInput["beat"]["semantic"]
): CopyLayers {
  const sentences = splitSentences(text);
  const headline = sentences.length > 0 ? sentences[0] : "";
  const supporting =
    sentences.length > 1 ? sentences.slice(1).join(" ") : null;
  const kicker = KICKER_MAP[semantic.intent] ?? null;

  return {
    kicker,
    headline,
    supporting,
    footer_caption: null,
  };
}

function buildMotion(intent: string, durationMs: number): MotionConfig {
  const entrance = MOTION_ENTRANCE_MAP[intent] ?? DEFAULT_MOTION_ENTRANCE;
  // Default motion duration: 40% of scene duration, clamped 300-1500ms
  const motionDuration = Math.max(300, Math.min(1500, Math.round(durationMs * 0.4)));

  return {
    entrance,
    emphasis: null,
    exit: null,
    duration_ms: motionDuration,
  };
}

function buildAssets(): AssetConfig {
  return {
    svg_icons: [],
    chart_type: null,
    chart_data: null,
  };
}

function buildChunkMetadata(
  semantic: DSLGeneratorInput["beat"]["semantic"]
): ChunkMetadata {
  return {
    intent: semantic.intent,
    tone: semantic.tone,
    evidence_type: semantic.evidence_type,
    emphasis_tokens: [...semantic.emphasis_tokens],
    density: semantic.density,
    beat_count: 1,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Beat + Scoring 결과로부터 Scene DSL JSON을 생성합니다.
 * 순수 함수 - 부작용 없음, 파일 I/O 없음.
 */
export function generateSceneDSL(input: DSLGeneratorInput): Scene {
  const { beat, layoutFamily, projectId } = input;
  const durationMs = beat.end_ms - beat.start_ms;

  return {
    id: `scene-${beat.beat_index}`,
    project_id: projectId,
    beat_index: beat.beat_index,
    layout_family: layoutFamily as LayoutFamily,
    start_ms: beat.start_ms,
    end_ms: beat.end_ms,
    duration_frames: Math.round((durationMs / 1000) * 30),
    components: buildComponents(layoutFamily),
    copy_layers: buildCopyLayers(beat.text, beat.semantic),
    motion: buildMotion(beat.semantic.intent, durationMs),
    assets: buildAssets(),
    chunk_metadata: buildChunkMetadata(beat.semantic),
  };
}

/**
 * v2: Stack 트리 기반 Scene DSL 생성.
 * stack-composer로 StackNode 트리를 생성하여 scene.stack_root에 삽입.
 * layout_family는 fallback으로 함께 설정.
 */
export function generateSceneDSLv2(
  input: DSLGeneratorInput & {
    svgIcons?: string[];
    chartData?: Record<string, unknown> | null;
    narration?: string;
  }
): Scene {
  const base = generateSceneDSL(input);

  // Compose stack tree
  const stackRoot = composeStackTree({
    layout_family: input.layoutFamily,
    intent: input.beat.semantic.intent,
    evidence_type: input.beat.semantic.evidence_type,
    tone: input.beat.semantic.tone,
    density: input.beat.semantic.density,
    copy_layers: base.copy_layers,
    emphasis_tokens: input.beat.semantic.emphasis_tokens,
    svg_icons: input.svgIcons ?? base.assets.svg_icons,
    chart_data: input.chartData ?? base.assets.chart_data,
  });

  return {
    ...base,
    stack_root: stackRoot,
    assets: {
      ...base.assets,
      svg_icons: input.svgIcons ?? base.assets.svg_icons,
    },
    ...(input.narration ? { narration: input.narration } : {}),
  };
}
