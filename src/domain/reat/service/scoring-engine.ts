// @TASK P1.5-SK2-T1 - Scoring Engine (제약 기반 레이아웃 점수 계산)
// @SPEC 8개 레이아웃 패밀리에 대해 intent/evidenceType/rhythm/asset 기반 점수 산정

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScoringInput {
  intent: string;
  tone: string;
  evidenceType: string;
  emphasisTokens: string[];
  density: number;
  hasChartData: boolean;
  hasIcons: boolean;
}

export interface ScoringContext {
  recentLayouts: string[]; // 최근 3개 레이아웃
  previousLayout: string | null;
}

export interface ScoreBreakdown {
  semanticFit: number;
  evidenceTypeFit: number;
  rhythmFit: number;
  assetOwnership: number;
  recentRepetitionPenalty: number;
  previousSimilarityPenalty: number;
}

export interface ScoringResult {
  layoutFamily: string;
  score: number;
  breakdown: ScoreBreakdown;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAYOUT_FAMILY_IDS = [
  "hero-center",
  "split-2col",
  "grid-4x3",
  "process-horizontal",
  "radial-focus",
  "stacked-vertical",
  "comparison-bars",
  "spotlight-case",
] as const;

/**
 * semanticFit mapping: intent keywords -> layout family ID
 * comparison-bars requires both intent="compare" AND evidenceType="statistic"
 * (handled separately in calcSemanticFit)
 */
const SEMANTIC_FIT_MAP: Record<string, string> = {
  emphasize: "hero-center",
  introduce: "hero-center",
  compare: "split-2col",
  contrast: "split-2col",
  list: "grid-4x3",
  enumerate: "grid-4x3",
  sequence: "process-horizontal",
  timeline: "process-horizontal",
  focus: "radial-focus",
  highlight: "radial-focus",
  stack: "stacked-vertical",
  layer: "stacked-vertical",
  "case-study": "spotlight-case",
  example: "spotlight-case",
};

/**
 * evidenceTypeFit mapping: evidenceType -> matching layout families
 */
const EVIDENCE_TYPE_FIT_MAP: Record<string, string[]> = {
  statistic: ["comparison-bars", "grid-4x3"],
  quote: ["hero-center", "spotlight-case"],
  example: ["spotlight-case", "split-2col"],
  definition: ["hero-center", "stacked-vertical"],
};

// ---------------------------------------------------------------------------
// Score calculation functions (pure)
// ---------------------------------------------------------------------------

function calcSemanticFit(
  layoutId: string,
  intent: string,
  evidenceType: string
): number {
  // Special case: comparison-bars requires intent="compare" + evidenceType="statistic"
  if (layoutId === "comparison-bars") {
    return intent === "compare" && evidenceType === "statistic" ? 40 : 0;
  }

  // When intent is "compare" and evidenceType is "statistic",
  // split-2col should NOT get semanticFit (comparison-bars takes priority)
  if (
    layoutId === "split-2col" &&
    (intent === "compare" || intent === "contrast") &&
    evidenceType === "statistic"
  ) {
    // split-2col still matches "compare" intent even with statistic evidenceType
    // The spec says split-2col matches "compare","contrast" -> 40
    return 40;
  }

  const matchedLayout = SEMANTIC_FIT_MAP[intent];
  return matchedLayout === layoutId ? 40 : 0;
}

function calcEvidenceTypeFit(
  layoutId: string,
  evidenceType: string
): number {
  const matchingLayouts = EVIDENCE_TYPE_FIT_MAP[evidenceType];
  if (!matchingLayouts) return 0;
  return matchingLayouts.includes(layoutId) ? 20 : 0;
}

function calcRhythmFit(
  layoutId: string,
  previousLayout: string | null
): number {
  if (previousLayout === null) return 15;
  return layoutId !== previousLayout ? 15 : 0;
}

function calcAssetOwnership(input: ScoringInput): number {
  return input.hasChartData || input.hasIcons ? 10 : 0;
}

function calcRecentRepetitionPenalty(
  layoutId: string,
  recentLayouts: string[]
): number {
  return recentLayouts.includes(layoutId) ? 25 : 0;
}

function calcPreviousSimilarityPenalty(
  layoutId: string,
  previousLayout: string | null
): number {
  if (previousLayout === null) return 0;
  return layoutId === previousLayout ? 20 : 0;
}

// ---------------------------------------------------------------------------
// Scoring for a single layout
// ---------------------------------------------------------------------------

function scoreLayout(
  layoutId: string,
  input: ScoringInput,
  context: ScoringContext
): ScoringResult {
  const breakdown: ScoreBreakdown = {
    semanticFit: calcSemanticFit(layoutId, input.intent, input.evidenceType),
    evidenceTypeFit: calcEvidenceTypeFit(layoutId, input.evidenceType),
    rhythmFit: calcRhythmFit(layoutId, context.previousLayout),
    assetOwnership: calcAssetOwnership(input),
    recentRepetitionPenalty: calcRecentRepetitionPenalty(
      layoutId,
      context.recentLayouts
    ),
    previousSimilarityPenalty: calcPreviousSimilarityPenalty(
      layoutId,
      context.previousLayout
    ),
  };

  const score =
    breakdown.semanticFit +
    breakdown.evidenceTypeFit +
    breakdown.rhythmFit +
    breakdown.assetOwnership -
    breakdown.recentRepetitionPenalty -
    breakdown.previousSimilarityPenalty;

  return { layoutFamily: layoutId, score, breakdown };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 8개 레이아웃 패밀리에 대해 점수를 계산하고 내림차순 정렬하여 반환합니다.
 * 순수 함수 - 부작용 없음.
 */
export function scoreAllLayouts(
  input: ScoringInput,
  context: ScoringContext
): ScoringResult[] {
  const results = LAYOUT_FAMILY_IDS.map((id) =>
    scoreLayout(id, input, context)
  );
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * 최고 점수를 받은 레이아웃 1개를 반환합니다.
 * 순수 함수 - 부작용 없음.
 */
export function selectBestLayout(
  input: ScoringInput,
  context: ScoringContext
): ScoringResult {
  const results = scoreAllLayouts(input, context);
  return results[0];
}
