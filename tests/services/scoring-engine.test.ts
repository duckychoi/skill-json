// @TASK P1.5-SK2-T1 - Scoring Engine 테스트
// @SPEC docs/planning - 점수 계산 엔진 (제약 기반 레이아웃 선택)

import { describe, it, expect } from "vitest";
import {
  scoreAllLayouts,
  selectBestLayout,
  type ScoringInput,
  type ScoringContext,
  type ScoringResult,
} from "@/services/scoring-engine";

// ---------------------------------------------------------------------------
// Helper: 기본 입력 생성
// ---------------------------------------------------------------------------
function makeInput(overrides: Partial<ScoringInput> = {}): ScoringInput {
  return {
    intent: "emphasize",
    tone: "professional",
    evidenceType: "quote",
    emphasisTokens: [],
    density: 0.5,
    hasChartData: false,
    hasIcons: false,
    ...overrides,
  };
}

function makeContext(overrides: Partial<ScoringContext> = {}): ScoringContext {
  return {
    recentLayouts: [],
    previousLayout: null,
    ...overrides,
  };
}

const ALL_LAYOUT_IDS = [
  "hero-center",
  "split-2col",
  "grid-4x3",
  "process-horizontal",
  "radial-focus",
  "stacked-vertical",
  "comparison-bars",
  "spotlight-case",
];

// ===========================================================================
// 1. scoreAllLayouts - 기본 동작
// ===========================================================================
describe("scoreAllLayouts", () => {
  it("returns exactly 8 ScoringResult items", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    expect(results).toHaveLength(8);
  });

  it("returns results sorted by score descending", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("includes all 8 layout families", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    const ids = results.map((r) => r.layoutFamily).sort();
    expect(ids).toEqual([...ALL_LAYOUT_IDS].sort());
  });

  it("each result has a valid breakdown object", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    for (const r of results) {
      expect(r.breakdown).toBeDefined();
      expect(typeof r.breakdown.semanticFit).toBe("number");
      expect(typeof r.breakdown.evidenceTypeFit).toBe("number");
      expect(typeof r.breakdown.rhythmFit).toBe("number");
      expect(typeof r.breakdown.assetOwnership).toBe("number");
      expect(typeof r.breakdown.recentRepetitionPenalty).toBe("number");
      expect(typeof r.breakdown.previousSimilarityPenalty).toBe("number");
    }
  });

  it("score equals sum of breakdown components", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    for (const r of results) {
      const { breakdown: b } = r;
      const expected =
        b.semanticFit +
        b.evidenceTypeFit +
        b.rhythmFit +
        b.assetOwnership -
        b.recentRepetitionPenalty -
        b.previousSimilarityPenalty;
      expect(r.score).toBe(expected);
    }
  });
});

// ===========================================================================
// 2. semanticFit (40 points)
// ===========================================================================
describe("semanticFit scoring", () => {
  it('intent "emphasize" gives hero-center 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "emphasize" }),
      makeContext()
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    expect(hero.breakdown.semanticFit).toBe(40);
  });

  it('intent "compare" gives split-2col 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "compare" }),
      makeContext()
    );
    const split = results.find((r) => r.layoutFamily === "split-2col")!;
    expect(split.breakdown.semanticFit).toBe(40);
  });

  it('intent "list" gives grid-4x3 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "list" }),
      makeContext()
    );
    const grid = results.find((r) => r.layoutFamily === "grid-4x3")!;
    expect(grid.breakdown.semanticFit).toBe(40);
  });

  it('intent "sequence" gives process-horizontal 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "sequence" }),
      makeContext()
    );
    const proc = results.find(
      (r) => r.layoutFamily === "process-horizontal"
    )!;
    expect(proc.breakdown.semanticFit).toBe(40);
  });

  it('intent "focus" gives radial-focus 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "focus" }),
      makeContext()
    );
    const radial = results.find((r) => r.layoutFamily === "radial-focus")!;
    expect(radial.breakdown.semanticFit).toBe(40);
  });

  it('intent "stack" gives stacked-vertical 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "stack" }),
      makeContext()
    );
    const stacked = results.find(
      (r) => r.layoutFamily === "stacked-vertical"
    )!;
    expect(stacked.breakdown.semanticFit).toBe(40);
  });

  it('intent "compare" + evidenceType "statistic" gives comparison-bars 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "compare", evidenceType: "statistic" }),
      makeContext()
    );
    const bars = results.find((r) => r.layoutFamily === "comparison-bars")!;
    expect(bars.breakdown.semanticFit).toBe(40);
  });

  it('intent "case-study" gives spotlight-case 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "case-study" }),
      makeContext()
    );
    const spot = results.find((r) => r.layoutFamily === "spotlight-case")!;
    expect(spot.breakdown.semanticFit).toBe(40);
  });

  it("non-matching intent gives 0 semanticFit", () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown" }),
      makeContext()
    );
    for (const r of results) {
      expect(r.breakdown.semanticFit).toBe(0);
    }
  });

  // Alternate synonyms
  it('intent "introduce" gives hero-center 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "introduce" }),
      makeContext()
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    expect(hero.breakdown.semanticFit).toBe(40);
  });

  it('intent "contrast" gives split-2col 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "contrast" }),
      makeContext()
    );
    const split = results.find((r) => r.layoutFamily === "split-2col")!;
    expect(split.breakdown.semanticFit).toBe(40);
  });

  it('intent "enumerate" gives grid-4x3 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "enumerate" }),
      makeContext()
    );
    const grid = results.find((r) => r.layoutFamily === "grid-4x3")!;
    expect(grid.breakdown.semanticFit).toBe(40);
  });

  it('intent "timeline" gives process-horizontal 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "timeline" }),
      makeContext()
    );
    const proc = results.find(
      (r) => r.layoutFamily === "process-horizontal"
    )!;
    expect(proc.breakdown.semanticFit).toBe(40);
  });

  it('intent "highlight" gives radial-focus 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "highlight" }),
      makeContext()
    );
    const radial = results.find((r) => r.layoutFamily === "radial-focus")!;
    expect(radial.breakdown.semanticFit).toBe(40);
  });

  it('intent "layer" gives stacked-vertical 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "layer" }),
      makeContext()
    );
    const stacked = results.find(
      (r) => r.layoutFamily === "stacked-vertical"
    )!;
    expect(stacked.breakdown.semanticFit).toBe(40);
  });

  it('intent "example" gives spotlight-case 40 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "example" }),
      makeContext()
    );
    const spot = results.find((r) => r.layoutFamily === "spotlight-case")!;
    expect(spot.breakdown.semanticFit).toBe(40);
  });
});

// ===========================================================================
// 3. evidenceTypeFit (20 points)
// ===========================================================================
describe("evidenceTypeFit scoring", () => {
  it('evidenceType "statistic" gives comparison-bars and grid-4x3 20 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "statistic" }),
      makeContext()
    );
    const bars = results.find((r) => r.layoutFamily === "comparison-bars")!;
    const grid = results.find((r) => r.layoutFamily === "grid-4x3")!;
    expect(bars.breakdown.evidenceTypeFit).toBe(20);
    expect(grid.breakdown.evidenceTypeFit).toBe(20);
  });

  it('evidenceType "quote" gives hero-center and spotlight-case 20 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "quote" }),
      makeContext()
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    const spot = results.find((r) => r.layoutFamily === "spotlight-case")!;
    expect(hero.breakdown.evidenceTypeFit).toBe(20);
    expect(spot.breakdown.evidenceTypeFit).toBe(20);
  });

  it('evidenceType "example" gives spotlight-case and split-2col 20 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "example" }),
      makeContext()
    );
    const spot = results.find((r) => r.layoutFamily === "spotlight-case")!;
    const split = results.find((r) => r.layoutFamily === "split-2col")!;
    expect(spot.breakdown.evidenceTypeFit).toBe(20);
    expect(split.breakdown.evidenceTypeFit).toBe(20);
  });

  it('evidenceType "definition" gives hero-center and stacked-vertical 20 points', () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "definition" }),
      makeContext()
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    const stacked = results.find(
      (r) => r.layoutFamily === "stacked-vertical"
    )!;
    expect(hero.breakdown.evidenceTypeFit).toBe(20);
    expect(stacked.breakdown.evidenceTypeFit).toBe(20);
  });

  it("non-matching evidenceType gives 0", () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "unknown-type" }),
      makeContext()
    );
    for (const r of results) {
      expect(r.breakdown.evidenceTypeFit).toBe(0);
    }
  });
});

// ===========================================================================
// 4. rhythmFit (15 points)
// ===========================================================================
describe("rhythmFit scoring", () => {
  it("gives 15 when previousLayout is null (no previous)", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: null })
    );
    for (const r of results) {
      expect(r.breakdown.rhythmFit).toBe(15);
    }
  });

  it("gives 15 for a layout different from previousLayout", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: "hero-center" })
    );
    const split = results.find((r) => r.layoutFamily === "split-2col")!;
    expect(split.breakdown.rhythmFit).toBe(15);
  });

  it("gives 0 for the same layout as previousLayout", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: "hero-center" })
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    expect(hero.breakdown.rhythmFit).toBe(0);
  });
});

// ===========================================================================
// 5. assetOwnership (10 points)
// ===========================================================================
describe("assetOwnership scoring", () => {
  it("gives 10 when hasChartData is true", () => {
    const results = scoreAllLayouts(
      makeInput({ hasChartData: true }),
      makeContext()
    );
    for (const r of results) {
      expect(r.breakdown.assetOwnership).toBe(10);
    }
  });

  it("gives 10 when hasIcons is true", () => {
    const results = scoreAllLayouts(
      makeInput({ hasIcons: true }),
      makeContext()
    );
    for (const r of results) {
      expect(r.breakdown.assetOwnership).toBe(10);
    }
  });

  it("gives 0 when hasChartData and hasIcons are both false", () => {
    const results = scoreAllLayouts(
      makeInput({ hasChartData: false, hasIcons: false }),
      makeContext()
    );
    for (const r of results) {
      expect(r.breakdown.assetOwnership).toBe(0);
    }
  });
});

// ===========================================================================
// 6. recentRepetitionPenalty (-25 points)
// ===========================================================================
describe("recentRepetitionPenalty scoring", () => {
  it("penalizes -25 when layout is in recentLayouts", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ recentLayouts: ["hero-center", "split-2col", "grid-4x3"] })
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    expect(hero.breakdown.recentRepetitionPenalty).toBe(25);
  });

  it("no penalty when layout is not in recentLayouts", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ recentLayouts: ["hero-center", "split-2col", "grid-4x3"] })
    );
    const proc = results.find(
      (r) => r.layoutFamily === "process-horizontal"
    )!;
    expect(proc.breakdown.recentRepetitionPenalty).toBe(0);
  });

  it("no penalty when recentLayouts is empty", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ recentLayouts: [] })
    );
    for (const r of results) {
      expect(r.breakdown.recentRepetitionPenalty).toBe(0);
    }
  });
});

// ===========================================================================
// 7. previousSimilarityPenalty (-20 points)
// ===========================================================================
describe("previousSimilarityPenalty scoring", () => {
  it("penalizes -20 when layout equals previousLayout", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: "hero-center" })
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    expect(hero.breakdown.previousSimilarityPenalty).toBe(20);
  });

  it("no penalty when layout differs from previousLayout", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: "hero-center" })
    );
    const split = results.find((r) => r.layoutFamily === "split-2col")!;
    expect(split.breakdown.previousSimilarityPenalty).toBe(0);
  });

  it("no penalty when previousLayout is null", () => {
    const results = scoreAllLayouts(
      makeInput(),
      makeContext({ previousLayout: null })
    );
    for (const r of results) {
      expect(r.breakdown.previousSimilarityPenalty).toBe(0);
    }
  });
});

// ===========================================================================
// 8. selectBestLayout
// ===========================================================================
describe("selectBestLayout", () => {
  it("returns the highest-scoring layout", () => {
    const best = selectBestLayout(
      makeInput({ intent: "emphasize", evidenceType: "quote" }),
      makeContext()
    );
    expect(best.layoutFamily).toBe("hero-center");
    // semanticFit=40 + evidenceTypeFit=20 + rhythmFit=15 + asset=0 = 75
    expect(best.score).toBe(75);
  });

  it("avoids recently-used layouts", () => {
    const best = selectBestLayout(
      makeInput({ intent: "emphasize", evidenceType: "quote" }),
      makeContext({
        recentLayouts: ["hero-center"],
        previousLayout: "hero-center",
      })
    );
    // hero-center would get: 40+20+0+0 - 25 - 20 = 15
    // spotlight-case: 0+20+15+0 - 0 - 0 = 35
    expect(best.layoutFamily).not.toBe("hero-center");
  });

  it("returns a valid ScoringResult with breakdown", () => {
    const best = selectBestLayout(makeInput(), makeContext());
    expect(best.layoutFamily).toBeDefined();
    expect(typeof best.score).toBe("number");
    expect(best.breakdown).toBeDefined();
  });
});

// ===========================================================================
// 9. Integration / edge cases
// ===========================================================================
describe("integration and edge cases", () => {
  it("maximum possible score is 85 (40+20+15+10)", () => {
    // Best case: semanticFit + evidenceTypeFit + rhythmFit + assetOwnership
    const best = selectBestLayout(
      makeInput({
        intent: "emphasize",
        evidenceType: "quote",
        hasChartData: true,
      }),
      makeContext()
    );
    expect(best.score).toBe(85);
  });

  it("minimum possible score is negative when all penalties apply", () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "random-unknown", evidenceType: "unknown" }),
      makeContext({
        recentLayouts: ["hero-center"],
        previousLayout: "hero-center",
      })
    );
    const hero = results.find((r) => r.layoutFamily === "hero-center")!;
    // 0 + 0 + 0 + 0 - 25 - 20 = -45
    expect(hero.score).toBe(-45);
  });

  it("comparison-bars gets semanticFit=40 only when intent=compare AND evidenceType=statistic", () => {
    // Only intent "compare" without statistic: split-2col gets 40, comparison-bars should NOT get 40 for semanticFit
    const results = scoreAllLayouts(
      makeInput({ intent: "compare", evidenceType: "quote" }),
      makeContext()
    );
    const bars = results.find((r) => r.layoutFamily === "comparison-bars")!;
    // comparison-bars requires compare + statistic for semanticFit
    expect(bars.breakdown.semanticFit).toBe(0);
  });

  it("handles empty string intent gracefully", () => {
    const results = scoreAllLayouts(
      makeInput({ intent: "" }),
      makeContext()
    );
    expect(results).toHaveLength(8);
    for (const r of results) {
      expect(r.breakdown.semanticFit).toBe(0);
    }
  });

  it("all scores are finite numbers", () => {
    const results = scoreAllLayouts(makeInput(), makeContext());
    for (const r of results) {
      expect(Number.isFinite(r.score)).toBe(true);
    }
  });
});
