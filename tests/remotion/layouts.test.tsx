// @TASK P2-R3-T1 - 8개 레이아웃 패밀리 Remotion 컴포넌트
// @SPEC docs/planning/02-trd.md
// TDD_MODE: RED_FIRST

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ──────────────────────────────────────────────
// Remotion mock (jsdom 환경에서 remotion hooks 모킹)
// ──────────────────────────────────────────────
vi.mock("remotion", () => ({
  useCurrentFrame: vi.fn(() => 0),
  useVideoConfig: vi.fn(() => ({ fps: 30, width: 1920, height: 1080, durationInFrames: 90 })),
  interpolate: vi.fn((value: number, input: number[], output: number[]) => {
    if (value <= input[0]) return output[0];
    if (value >= input[input.length - 1]) return output[output.length - 1];
    const idx = input.findIndex((v) => v > value) - 1;
    const t = (value - input[idx]) / (input[idx + 1] - input[idx]);
    return output[idx] + t * (output[idx + 1] - output[idx]);
  }),
  spring: vi.fn(() => 1),
  AbsoluteFill: ({ children, style, ...rest }: { children: React.ReactNode; style?: React.CSSProperties; [key: string]: unknown }) => (
    <div data-testid={(rest["data-testid"] as string) ?? "absolute-fill"} style={style} {...(rest as Record<string, unknown>)}>
      {children}
    </div>
  ),
  Sequence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ──────────────────────────────────────────────
// 테스트용 Scene fixture
// ──────────────────────────────────────────────
import type { Scene } from "@/types";

const makeScene = (overrides: Partial<Scene> = {}): Scene => ({
  id: "scene-001",
  project_id: "proj-001",
  beat_index: 0,
  layout_family: "hero-center",
  start_ms: 0,
  end_ms: 3000,
  duration_frames: 90,
  components: [],
  copy_layers: {
    kicker: "Test Kicker",
    headline: "Test Headline",
    supporting: "Supporting text here",
    footer_caption: "Footer caption",
  },
  motion: {
    entrance: "fadeUp",
    emphasis: null,
    exit: null,
    duration_ms: 3000,
  },
  assets: {
    svg_icons: [],
    chart_type: null,
    chart_data: null,
  },
  chunk_metadata: {
    intent: "inform",
    tone: "neutral",
    evidence_type: "statement",
    emphasis_tokens: [],
    density: 0.5,
    beat_count: 1,
  },
  ...overrides,
});

// ──────────────────────────────────────────────
// 1. CopyLayerRenderer
// ──────────────────────────────────────────────
describe("CopyLayerRenderer", () => {
  it("renders headline", async () => {
    const { CopyLayerRenderer } = await import(
      "@/remotion/common/CopyLayerRenderer"
    );
    const copyLayers = {
      kicker: "KICKER",
      headline: "Big Headline",
      supporting: "Supporting text",
      footer_caption: "Footer",
    };
    render(<CopyLayerRenderer copyLayers={copyLayers} />);
    expect(screen.getByText("Big Headline")).toBeInTheDocument();
  });

  it("renders kicker when provided", async () => {
    const { CopyLayerRenderer } = await import(
      "@/remotion/common/CopyLayerRenderer"
    );
    const copyLayers = {
      kicker: "MY KICKER",
      headline: "Headline",
      supporting: null,
      footer_caption: null,
    };
    render(<CopyLayerRenderer copyLayers={copyLayers} />);
    expect(screen.getByText("MY KICKER")).toBeInTheDocument();
  });

  it("does not render kicker when null", async () => {
    const { CopyLayerRenderer } = await import(
      "@/remotion/common/CopyLayerRenderer"
    );
    const copyLayers = {
      kicker: null,
      headline: "Headline Only",
      supporting: null,
      footer_caption: null,
    };
    render(<CopyLayerRenderer copyLayers={copyLayers} />);
    expect(screen.queryByTestId("copy-kicker")).not.toBeInTheDocument();
  });

  it("renders supporting text when provided", async () => {
    const { CopyLayerRenderer } = await import(
      "@/remotion/common/CopyLayerRenderer"
    );
    const copyLayers = {
      kicker: null,
      headline: "Headline",
      supporting: "This is supporting text",
      footer_caption: null,
    };
    render(<CopyLayerRenderer copyLayers={copyLayers} />);
    expect(screen.getByText("This is supporting text")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 2. MotionWrapper
// ──────────────────────────────────────────────
describe("MotionWrapper", () => {
  it("renders children", async () => {
    const { MotionWrapper } = await import("@/remotion/common/MotionWrapper");
    render(
      <MotionWrapper preset="fadeUp" frame={0} durationFrames={30}>
        <div data-testid="child">Content</div>
      </MotionWrapper>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("supports all 10 motion presets without error", async () => {
    const { MotionWrapper } = await import("@/remotion/common/MotionWrapper");
    const presets = [
      "fadeUp",
      "popNumber",
      "staggerChildren",
      "drawConnector",
      "pulseAccent",
      "wipeBar",
      "countUp",
      "slideSplit",
      "revealMask",
      "popBadge",
    ] as const;

    for (const preset of presets) {
      const { unmount } = render(
        <MotionWrapper preset={preset} frame={15} durationFrames={30}>
          <span>{preset}</span>
        </MotionWrapper>
      );
      expect(screen.getByText(preset)).toBeInTheDocument();
      unmount();
    }
  });

  it("applies opacity style", async () => {
    const { MotionWrapper } = await import("@/remotion/common/MotionWrapper");
    const { container } = render(
      <MotionWrapper preset="fadeUp" frame={0} durationFrames={30}>
        <span>text</span>
      </MotionWrapper>
    );
    // frame=0 이므로 opacity는 0이거나 래퍼 div에 style이 있어야 함
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.style).toBeDefined();
  });
});

// ──────────────────────────────────────────────
// 3. AssetRenderer
// ──────────────────────────────────────────────
describe("AssetRenderer", () => {
  it("renders without crashing when no assets", async () => {
    const { AssetRenderer } = await import("@/remotion/common/AssetRenderer");
    const assets = { svg_icons: [], chart_type: null, chart_data: null };
    const { container } = render(<AssetRenderer assets={assets} />);
    expect(container).toBeTruthy();
  });

  it("renders svg icon placeholder when icons provided", async () => {
    const { AssetRenderer } = await import("@/remotion/common/AssetRenderer");
    const assets = {
      svg_icons: ["arrow-right", "check-circle"],
      chart_type: null,
      chart_data: null,
    };
    render(<AssetRenderer assets={assets} />);
    expect(screen.getByTestId("asset-svg-arrow-right")).toBeInTheDocument();
  });

  it("renders bar chart when chart_type is bar", async () => {
    const { AssetRenderer } = await import("@/remotion/common/AssetRenderer");
    const assets = {
      svg_icons: [],
      chart_type: "bar",
      chart_data: {
        labels: ["A", "B", "C"],
        values: [10, 20, 30],
      },
    };
    render(<AssetRenderer assets={assets} />);
    expect(screen.getByTestId("asset-chart-bar")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 4. Layout Components
// ──────────────────────────────────────────────

describe("HeroCenterLayout", () => {
  it("renders headline", async () => {
    const { HeroCenterLayout } = await import(
      "@/remotion/layouts/HeroCenterLayout"
    );
    const scene = makeScene({ layout_family: "hero-center" });
    render(<HeroCenterLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders kicker", async () => {
    const { HeroCenterLayout } = await import(
      "@/remotion/layouts/HeroCenterLayout"
    );
    const scene = makeScene({ layout_family: "hero-center" });
    render(<HeroCenterLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Kicker")).toBeInTheDocument();
  });

  it("renders data-testid hero-center-layout", async () => {
    const { HeroCenterLayout } = await import(
      "@/remotion/layouts/HeroCenterLayout"
    );
    const scene = makeScene({ layout_family: "hero-center" });
    render(<HeroCenterLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("hero-center-layout")).toBeInTheDocument();
  });
});

describe("Split2ColLayout", () => {
  it("renders headline", async () => {
    const { Split2ColLayout } = await import(
      "@/remotion/layouts/Split2ColLayout"
    );
    const scene = makeScene({ layout_family: "split-2col" });
    render(<Split2ColLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders data-testid split-2col-layout", async () => {
    const { Split2ColLayout } = await import(
      "@/remotion/layouts/Split2ColLayout"
    );
    const scene = makeScene({ layout_family: "split-2col" });
    render(<Split2ColLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("split-2col-layout")).toBeInTheDocument();
  });

  it("renders left and right columns", async () => {
    const { Split2ColLayout } = await import(
      "@/remotion/layouts/Split2ColLayout"
    );
    const scene = makeScene({ layout_family: "split-2col" });
    render(<Split2ColLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("split-col-left")).toBeInTheDocument();
    expect(screen.getByTestId("split-col-right")).toBeInTheDocument();
  });
});

describe("Grid4x3Layout", () => {
  it("renders data-testid grid-4x3-layout", async () => {
    const { Grid4x3Layout } = await import(
      "@/remotion/layouts/Grid4x3Layout"
    );
    const scene = makeScene({ layout_family: "grid-4x3" });
    render(<Grid4x3Layout scene={scene} frame={0} />);
    expect(screen.getByTestId("grid-4x3-layout")).toBeInTheDocument();
  });

  it("renders headline", async () => {
    const { Grid4x3Layout } = await import(
      "@/remotion/layouts/Grid4x3Layout"
    );
    const scene = makeScene({ layout_family: "grid-4x3" });
    render(<Grid4x3Layout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders grid cells", async () => {
    const { Grid4x3Layout } = await import(
      "@/remotion/layouts/Grid4x3Layout"
    );
    const scene = makeScene({ layout_family: "grid-4x3" });
    render(<Grid4x3Layout scene={scene} frame={0} />);
    const cells = screen.getAllByTestId(/grid-cell-/);
    expect(cells.length).toBeGreaterThan(0);
  });
});

describe("ProcessHorizontalLayout", () => {
  it("renders data-testid process-horizontal-layout", async () => {
    const { ProcessHorizontalLayout } = await import(
      "@/remotion/layouts/ProcessHorizontalLayout"
    );
    const scene = makeScene({ layout_family: "process-horizontal" });
    render(<ProcessHorizontalLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("process-horizontal-layout")).toBeInTheDocument();
  });

  it("renders headline", async () => {
    const { ProcessHorizontalLayout } = await import(
      "@/remotion/layouts/ProcessHorizontalLayout"
    );
    const scene = makeScene({ layout_family: "process-horizontal" });
    render(<ProcessHorizontalLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders step items", async () => {
    const { ProcessHorizontalLayout } = await import(
      "@/remotion/layouts/ProcessHorizontalLayout"
    );
    const scene = makeScene({ layout_family: "process-horizontal" });
    render(<ProcessHorizontalLayout scene={scene} frame={0} />);
    const steps = screen.getAllByTestId(/process-step-/);
    expect(steps.length).toBeGreaterThan(0);
  });
});

describe("RadialFocusLayout", () => {
  it("renders data-testid radial-focus-layout", async () => {
    const { RadialFocusLayout } = await import(
      "@/remotion/layouts/RadialFocusLayout"
    );
    const scene = makeScene({ layout_family: "radial-focus" });
    render(<RadialFocusLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("radial-focus-layout")).toBeInTheDocument();
  });

  it("renders headline in center", async () => {
    const { RadialFocusLayout } = await import(
      "@/remotion/layouts/RadialFocusLayout"
    );
    const scene = makeScene({ layout_family: "radial-focus" });
    render(<RadialFocusLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders center circle", async () => {
    const { RadialFocusLayout } = await import(
      "@/remotion/layouts/RadialFocusLayout"
    );
    const scene = makeScene({ layout_family: "radial-focus" });
    render(<RadialFocusLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("radial-center")).toBeInTheDocument();
  });
});

describe("StackedVerticalLayout", () => {
  it("renders data-testid stacked-vertical-layout", async () => {
    const { StackedVerticalLayout } = await import(
      "@/remotion/layouts/StackedVerticalLayout"
    );
    const scene = makeScene({ layout_family: "stacked-vertical" });
    render(<StackedVerticalLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("stacked-vertical-layout")).toBeInTheDocument();
  });

  it("renders headline", async () => {
    const { StackedVerticalLayout } = await import(
      "@/remotion/layouts/StackedVerticalLayout"
    );
    const scene = makeScene({ layout_family: "stacked-vertical" });
    render(<StackedVerticalLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders stack cards", async () => {
    const { StackedVerticalLayout } = await import(
      "@/remotion/layouts/StackedVerticalLayout"
    );
    const scene = makeScene({ layout_family: "stacked-vertical" });
    render(<StackedVerticalLayout scene={scene} frame={0} />);
    const cards = screen.getAllByTestId(/stack-card-/);
    expect(cards.length).toBeGreaterThan(0);
  });
});

describe("ComparisonBarsLayout", () => {
  it("renders data-testid comparison-bars-layout", async () => {
    const { ComparisonBarsLayout } = await import(
      "@/remotion/layouts/ComparisonBarsLayout"
    );
    const scene = makeScene({ layout_family: "comparison-bars" });
    render(<ComparisonBarsLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("comparison-bars-layout")).toBeInTheDocument();
  });

  it("renders headline", async () => {
    const { ComparisonBarsLayout } = await import(
      "@/remotion/layouts/ComparisonBarsLayout"
    );
    const scene = makeScene({ layout_family: "comparison-bars" });
    render(<ComparisonBarsLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders left and right bar columns", async () => {
    const { ComparisonBarsLayout } = await import(
      "@/remotion/layouts/ComparisonBarsLayout"
    );
    const scene = makeScene({ layout_family: "comparison-bars" });
    render(<ComparisonBarsLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("bars-left")).toBeInTheDocument();
    expect(screen.getByTestId("bars-right")).toBeInTheDocument();
  });
});

describe("SpotlightCaseLayout", () => {
  it("renders data-testid spotlight-case-layout", async () => {
    const { SpotlightCaseLayout } = await import(
      "@/remotion/layouts/SpotlightCaseLayout"
    );
    const scene = makeScene({ layout_family: "spotlight-case" });
    render(<SpotlightCaseLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("spotlight-case-layout")).toBeInTheDocument();
  });

  it("renders headline", async () => {
    const { SpotlightCaseLayout } = await import(
      "@/remotion/layouts/SpotlightCaseLayout"
    );
    const scene = makeScene({ layout_family: "spotlight-case" });
    render(<SpotlightCaseLayout scene={scene} frame={0} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders spotlight panel", async () => {
    const { SpotlightCaseLayout } = await import(
      "@/remotion/layouts/SpotlightCaseLayout"
    );
    const scene = makeScene({ layout_family: "spotlight-case" });
    render(<SpotlightCaseLayout scene={scene} frame={0} />);
    expect(screen.getByTestId("spotlight-panel")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 5. SceneRenderer (공통 라우터)
// ──────────────────────────────────────────────
describe("SceneRenderer", () => {
  const layoutFamilies = [
    "hero-center",
    "split-2col",
    "grid-4x3",
    "process-horizontal",
    "radial-focus",
    "stacked-vertical",
    "comparison-bars",
    "spotlight-case",
  ] as const;

  for (const family of layoutFamilies) {
    it(`routes ${family} to correct layout component`, async () => {
      const { SceneRenderer } = await import(
        "@/remotion/common/SceneRenderer"
      );
      const scene = makeScene({ layout_family: family });
      const { container } = render(<SceneRenderer scene={scene} frame={0} />);
      expect(container).toBeTruthy();
      expect(container.firstChild).not.toBeNull();
    });
  }

  it("renders fallback for unknown layout_family", async () => {
    const { SceneRenderer } = await import(
      "@/remotion/common/SceneRenderer"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scene = makeScene({ layout_family: "unknown-layout" as any });
    render(<SceneRenderer scene={scene} frame={0} />);
    expect(screen.getByTestId("scene-renderer-fallback")).toBeInTheDocument();
  });
});
