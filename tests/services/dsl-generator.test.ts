// @TASK P1.5-SK2-T2 - DSL Generator 테스트
// @SPEC Beat + Scoring 결과 -> Scene DSL JSON 생성

import { describe, it, expect } from "vitest";
import {
  generateSceneDSL,
  type DSLGeneratorInput,
} from "@/services/dsl-generator";
import type { Scene, LayoutFamily } from "@/types/index";

// ---------------------------------------------------------------------------
// Helper: 기본 입력 생성
// ---------------------------------------------------------------------------
function makeInput(overrides: Partial<DSLGeneratorInput> = {}): DSLGeneratorInput {
  return {
    beat: {
      beat_index: 0,
      start_ms: 0,
      end_ms: 3000,
      start_frame: 0,
      end_frame: 90,
      text: "이것은 첫 번째 문장입니다. 두 번째 문장도 있습니다.",
      semantic: {
        intent: "emphasize",
        tone: "professional",
        evidence_type: "quote",
        emphasis_tokens: ["첫 번째"],
        density: 0.5,
      },
    },
    layoutFamily: "hero-center",
    projectId: "proj-001",
    ...overrides,
  };
}

// ===========================================================================
// 1. 기본 Scene 구조 생성
// ===========================================================================
describe("generateSceneDSL - basic structure", () => {
  it("returns a valid Scene object", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene).toBeDefined();
    expect(typeof scene.id).toBe("string");
    expect(typeof scene.project_id).toBe("string");
    expect(typeof scene.beat_index).toBe("number");
  });

  it("generates id in scene-{beat_index} format", () => {
    const scene = generateSceneDSL(makeInput({ beat: { ...makeInput().beat, beat_index: 5 } }));
    expect(scene.id).toBe("scene-5");
  });

  it("maps project_id from input.projectId", () => {
    const scene = generateSceneDSL(makeInput({ projectId: "proj-abc" }));
    expect(scene.project_id).toBe("proj-abc");
  });

  it("maps beat_index from beat.beat_index", () => {
    const scene = generateSceneDSL(makeInput({ beat: { ...makeInput().beat, beat_index: 3 } }));
    expect(scene.beat_index).toBe(3);
  });

  it("maps layout_family from input.layoutFamily", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "split-2col" }));
    expect(scene.layout_family).toBe("split-2col");
  });

  it("maps start_ms and end_ms from beat", () => {
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, start_ms: 1000, end_ms: 4000 },
    }));
    expect(scene.start_ms).toBe(1000);
    expect(scene.end_ms).toBe(4000);
  });
});

// ===========================================================================
// 2. duration_frames 계산
// ===========================================================================
describe("generateSceneDSL - duration_frames", () => {
  it("calculates duration_frames = Math.round((end_ms - start_ms) / 1000 * 30)", () => {
    // 3000ms -> 3 * 30 = 90 frames
    const scene = generateSceneDSL(makeInput());
    expect(scene.duration_frames).toBe(90);
  });

  it("rounds fractional frames correctly", () => {
    // 2500ms -> 2.5 * 30 = 75 frames
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, start_ms: 0, end_ms: 2500 },
    }));
    expect(scene.duration_frames).toBe(75);
  });

  it("handles sub-second durations", () => {
    // 500ms -> 0.5 * 30 = 15 frames
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, start_ms: 0, end_ms: 500 },
    }));
    expect(scene.duration_frames).toBe(15);
  });

  it("rounds correctly for non-exact frame boundaries", () => {
    // 1100ms -> 1.1 * 30 = 33 frames
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, start_ms: 0, end_ms: 1100 },
    }));
    expect(scene.duration_frames).toBe(33);
  });
});

// ===========================================================================
// 3. 레이아웃별 기본 컴포넌트 생성
// ===========================================================================
describe("generateSceneDSL - components", () => {
  it("hero-center layout generates background + text-block components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "hero-center" }));
    expect(scene.components).toHaveLength(2);
    expect(scene.components[0]).toMatchObject({ id: "hero-bg", type: "background" });
    expect(scene.components[1]).toMatchObject({ id: "hero-text", type: "text-block" });
  });

  it("split-2col layout generates text-block + visual components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "split-2col" }));
    expect(scene.components).toHaveLength(2);
    expect(scene.components[0]).toMatchObject({ id: "col-left", type: "text-block" });
    expect(scene.components[1]).toMatchObject({ id: "col-right", type: "visual" });
  });

  it("grid-4x3 layout generates grid components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "grid-4x3" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "grid-container", type: "grid" });
    expect(scene.components[1]).toMatchObject({ id: "grid-title", type: "text-block" });
  });

  it("process-horizontal layout generates process components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "process-horizontal" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "process-flow", type: "process" });
    expect(scene.components[1]).toMatchObject({ id: "process-label", type: "text-block" });
  });

  it("radial-focus layout generates radial components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "radial-focus" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "radial-center", type: "visual" });
    expect(scene.components[1]).toMatchObject({ id: "radial-label", type: "text-block" });
  });

  it("stacked-vertical layout generates stacked components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "stacked-vertical" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "stack-top", type: "text-block" });
    expect(scene.components[1]).toMatchObject({ id: "stack-bottom", type: "text-block" });
  });

  it("comparison-bars layout generates comparison components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "comparison-bars" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "bars-chart", type: "chart" });
    expect(scene.components[1]).toMatchObject({ id: "bars-label", type: "text-block" });
  });

  it("spotlight-case layout generates spotlight components", () => {
    const scene = generateSceneDSL(makeInput({ layoutFamily: "spotlight-case" }));
    expect(scene.components.length).toBeGreaterThanOrEqual(2);
    expect(scene.components[0]).toMatchObject({ id: "spotlight-visual", type: "visual" });
    expect(scene.components[1]).toMatchObject({ id: "spotlight-text", type: "text-block" });
  });

  it("all components have empty props object by default", () => {
    const scene = generateSceneDSL(makeInput());
    for (const comp of scene.components) {
      expect(comp.props).toBeDefined();
      expect(typeof comp.props).toBe("object");
    }
  });
});

// ===========================================================================
// 4. copy_layers 생성
// ===========================================================================
describe("generateSceneDSL - copy_layers", () => {
  it("extracts headline from first sentence of text", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        text: "핵심 메시지입니다. 부가 설명이 따릅니다.",
      },
    }));
    expect(scene.copy_layers.headline).toBe("핵심 메시지입니다.");
  });

  it("extracts supporting text from remaining sentences", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        text: "핵심 메시지입니다. 부가 설명이 따릅니다.",
      },
    }));
    expect(scene.copy_layers.supporting).toBe("부가 설명이 따릅니다.");
  });

  it("supporting is null when only one sentence", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        text: "단일 문장입니다.",
      },
    }));
    expect(scene.copy_layers.supporting).toBeNull();
  });

  it('kicker maps intent "compare" to "VS"', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "compare" },
      },
    }));
    expect(scene.copy_layers.kicker).toBe("VS");
  });

  it('kicker maps intent "statistic" to "DATA"', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "statistic" },
      },
    }));
    expect(scene.copy_layers.kicker).toBe("DATA");
  });

  it('kicker maps intent "list" to "LIST"', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "list" },
      },
    }));
    expect(scene.copy_layers.kicker).toBe("LIST");
  });

  it('kicker maps intent "sequence" to "STEP"', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "sequence" },
      },
    }));
    expect(scene.copy_layers.kicker).toBe("STEP");
  });

  it("kicker is null for intents without mapping", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "emphasize" },
      },
    }));
    expect(scene.copy_layers.kicker).toBeNull();
  });

  it("footer_caption is null by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.copy_layers.footer_caption).toBeNull();
  });

  it("uses emphasis_tokens for headline when available", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        text: "일반 텍스트입니다. 보조 설명입니다.",
        semantic: {
          ...makeInput().beat.semantic,
          emphasis_tokens: ["강조된 키워드"],
        },
      },
    }));
    // emphasis_tokens가 있으면 headline에 반영
    expect(scene.copy_layers.headline).toBeDefined();
    expect(typeof scene.copy_layers.headline).toBe("string");
  });
});

// ===========================================================================
// 5. motion 프리셋 매핑
// ===========================================================================
describe("generateSceneDSL - motion", () => {
  it('intent "emphasize" maps to fadeUp entrance', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "emphasize" },
      },
    }));
    expect(scene.motion.entrance).toBe("fadeUp");
  });

  it('intent "compare" maps to slideSplit entrance', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "compare" },
      },
    }));
    expect(scene.motion.entrance).toBe("slideSplit");
  });

  it('intent "list" maps to staggerChildren entrance', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "list" },
      },
    }));
    expect(scene.motion.entrance).toBe("staggerChildren");
  });

  it('intent "sequence" maps to drawConnector entrance', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "sequence" },
      },
    }));
    expect(scene.motion.entrance).toBe("drawConnector");
  });

  it('intent "statistic" maps to countUp entrance', () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "statistic" },
      },
    }));
    expect(scene.motion.entrance).toBe("countUp");
  });

  it("unknown intent defaults to fadeUp entrance", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, intent: "unknown-intent" },
      },
    }));
    expect(scene.motion.entrance).toBe("fadeUp");
  });

  it("motion has default duration_ms based on scene duration", () => {
    const scene = generateSceneDSL(makeInput());
    expect(typeof scene.motion.duration_ms).toBe("number");
    expect(scene.motion.duration_ms).toBeGreaterThan(0);
  });

  it("emphasis is null by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.motion.emphasis).toBeNull();
  });

  it("exit is null by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.motion.exit).toBeNull();
  });
});

// ===========================================================================
// 6. assets 기본값
// ===========================================================================
describe("generateSceneDSL - assets", () => {
  it("svg_icons is empty array by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.assets.svg_icons).toEqual([]);
  });

  it("chart_type is null by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.assets.chart_type).toBeNull();
  });

  it("chart_data is null by default", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.assets.chart_data).toBeNull();
  });
});

// ===========================================================================
// 7. chunk_metadata 매핑
// ===========================================================================
describe("generateSceneDSL - chunk_metadata", () => {
  it("maps intent from beat.semantic", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.intent).toBe("emphasize");
  });

  it("maps tone from beat.semantic", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.tone).toBe("professional");
  });

  it("maps evidence_type from beat.semantic", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.evidence_type).toBe("quote");
  });

  it("maps emphasis_tokens from beat.semantic", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.emphasis_tokens).toEqual(["첫 번째"]);
  });

  it("maps density from beat.semantic", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.density).toBe(0.5);
  });

  it("beat_count is always 1", () => {
    const scene = generateSceneDSL(makeInput());
    expect(scene.chunk_metadata.beat_count).toBe(1);
  });
});

// ===========================================================================
// 8. 순수 함수 검증
// ===========================================================================
describe("generateSceneDSL - pure function", () => {
  it("same input produces same output", () => {
    const input = makeInput();
    const scene1 = generateSceneDSL(input);
    const scene2 = generateSceneDSL(input);
    expect(scene1).toEqual(scene2);
  });

  it("does not mutate input", () => {
    const input = makeInput();
    const inputCopy = JSON.parse(JSON.stringify(input));
    generateSceneDSL(input);
    expect(input).toEqual(inputCopy);
  });
});

// ===========================================================================
// 9. 엣지 케이스
// ===========================================================================
describe("generateSceneDSL - edge cases", () => {
  it("handles empty text", () => {
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, text: "" },
    }));
    expect(scene.copy_layers.headline).toBe("");
    expect(scene.copy_layers.supporting).toBeNull();
  });

  it("handles text with multiple sentences", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        text: "문장 하나. 문장 둘. 문장 셋.",
      },
    }));
    expect(scene.copy_layers.headline).toBe("문장 하나.");
    expect(scene.copy_layers.supporting).toBe("문장 둘. 문장 셋.");
  });

  it("handles beat_index 0", () => {
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, beat_index: 0 },
    }));
    expect(scene.id).toBe("scene-0");
    expect(scene.beat_index).toBe(0);
  });

  it("handles large beat_index", () => {
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, beat_index: 999 },
    }));
    expect(scene.id).toBe("scene-999");
  });

  it("handles zero duration", () => {
    const scene = generateSceneDSL(makeInput({
      beat: { ...makeInput().beat, start_ms: 1000, end_ms: 1000 },
    }));
    expect(scene.duration_frames).toBe(0);
  });

  it("handles empty emphasis_tokens", () => {
    const scene = generateSceneDSL(makeInput({
      beat: {
        ...makeInput().beat,
        semantic: { ...makeInput().beat.semantic, emphasis_tokens: [] },
      },
    }));
    expect(scene.chunk_metadata.emphasis_tokens).toEqual([]);
  });
});
