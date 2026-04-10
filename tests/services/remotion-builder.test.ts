// @TASK P1.5-SK4-T1 - remotion-builder 서비스 테스트
// @SPEC Scene DSL -> Remotion TSX 자동 생성

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { Scene } from "@/types/index";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("fs/promises", () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}));

import fs from "fs/promises";
const mockedMkdir = vi.mocked(fs.mkdir);
const mockedWriteFile = vi.mocked(fs.writeFile);

import {
  generateCompositionTSX,
  writeGeneratedComposition,
} from "@/services/remotion-builder";

// ---------------------------------------------------------------------------
// Test Data
// ---------------------------------------------------------------------------

const SAMPLE_SCENES: Scene[] = [
  {
    id: "scene-001",
    project_id: "proj-abc",
    beat_index: 0,
    layout_family: "hero-center",
    start_ms: 0,
    end_ms: 3000,
    duration_frames: 90,
    components: [
      { id: "hero-bg", type: "background", props: { color: "#000" } },
      { id: "hero-text", type: "text-block", props: {} },
    ],
    copy_layers: {
      kicker: null,
      headline: "AI is the future",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "fadeUp",
      emphasis: null,
      exit: null,
      duration_ms: 1200,
    },
    assets: { svg_icons: [], chart_type: null, chart_data: null },
    chunk_metadata: {
      intent: "emphasize",
      tone: "confident",
      evidence_type: "statement",
      emphasis_tokens: ["AI", "future"],
      density: 2,
      beat_count: 1,
    },
  },
  {
    id: "scene-002",
    project_id: "proj-abc",
    beat_index: 1,
    layout_family: "split-2col",
    start_ms: 3000,
    end_ms: 7000,
    duration_frames: 120,
    components: [],
    copy_layers: {
      kicker: "Compare",
      headline: "Deep Learning vs ML",
      supporting: "Key differences",
      footer_caption: null,
    },
    motion: {
      entrance: "slideLeft",
      emphasis: null,
      exit: null,
      duration_ms: 800,
    },
    assets: { svg_icons: ["brain"], chart_type: null, chart_data: null },
    chunk_metadata: {
      intent: "compare",
      tone: "analytical",
      evidence_type: "statistic",
      emphasis_tokens: ["Deep Learning", "ML"],
      density: 2,
      beat_count: 1,
    },
  },
];

// ---------------------------------------------------------------------------
// Tests: generateCompositionTSX
// ---------------------------------------------------------------------------

describe("generateCompositionTSX", () => {
  it("should return a string containing valid TSX structure", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(typeof tsx).toBe("string");
    expect(tsx.length).toBeGreaterThan(0);
  });

  it("should include Remotion imports (AbsoluteFill, Series)", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(tsx).toContain("AbsoluteFill");
    expect(tsx).toContain("Series");
    expect(tsx).toContain('from "remotion"');
  });

  it("should include SceneRenderer import", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(tsx).toContain("SceneRenderer");
    expect(tsx).toContain("SceneRenderer");
  });

  it("should inline the scenes data as JSON", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    // Should contain scene IDs inlined
    expect(tsx).toContain("scene-001");
    expect(tsx).toContain("scene-002");
    // Should contain project_id
    expect(tsx).toContain("proj-abc");
  });

  it("should export a GeneratedComposition component", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(tsx).toContain("GeneratedComposition");
    expect(tsx).toMatch(/export\s+(const|function)\s+GeneratedComposition/);
  });

  it("should use Series.Sequence with durationInFrames from each scene", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(tsx).toContain("Series.Sequence");
    expect(tsx).toContain("durationInFrames");
  });

  it("should contain auto-generated header comment", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    expect(tsx).toContain("Auto-generated");
  });

  it("should handle empty scenes array", () => {
    const tsx = generateCompositionTSX([]);

    expect(typeof tsx).toBe("string");
    expect(tsx).toContain("GeneratedComposition");
    expect(tsx).toContain("AbsoluteFill");
  });

  it("should calculate total frames from all scenes", () => {
    const tsx = generateCompositionTSX(SAMPLE_SCENES);

    // Total: 90 + 120 = 210
    expect(tsx).toContain("210");
  });
});

// ---------------------------------------------------------------------------
// Tests: writeGeneratedComposition
// ---------------------------------------------------------------------------

describe("writeGeneratedComposition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create output directory recursively", async () => {
    const result = await writeGeneratedComposition(
      SAMPLE_SCENES,
      "/tmp/test-output"
    );

    expect(mockedMkdir).toHaveBeenCalledWith(
      expect.stringContaining("/tmp/test-output"),
      { recursive: true }
    );
  });

  it("should write a .tsx file to the output directory", async () => {
    const result = await writeGeneratedComposition(
      SAMPLE_SCENES,
      "/tmp/test-output"
    );

    expect(mockedWriteFile).toHaveBeenCalled();
    const [filePath, content] = mockedWriteFile.mock.calls[0];
    expect(String(filePath)).toMatch(/\.tsx$/);
    expect(String(content)).toContain("GeneratedComposition");
  });

  it("should return RemotionBuildResult with correct fields", async () => {
    const result = await writeGeneratedComposition(
      SAMPLE_SCENES,
      "/tmp/test-output"
    );

    expect(result).toHaveProperty("outputDir", "/tmp/test-output");
    expect(result).toHaveProperty("compositionFile");
    expect(result.compositionFile).toMatch(/\.tsx$/);
    expect(result).toHaveProperty("totalFrames", 210); // 90 + 120
    expect(result).toHaveProperty("fps", 30);
  });

  it("should calculate totalFrames as sum of all scene duration_frames", async () => {
    const result = await writeGeneratedComposition(
      SAMPLE_SCENES,
      "/tmp/test-output"
    );

    expect(result.totalFrames).toBe(90 + 120);
  });

  it("should default fps to 30", async () => {
    const result = await writeGeneratedComposition(
      SAMPLE_SCENES,
      "/tmp/test-output"
    );

    expect(result.fps).toBe(30);
  });

  it("should handle single scene", async () => {
    const result = await writeGeneratedComposition(
      [SAMPLE_SCENES[0]],
      "/tmp/test-output"
    );

    expect(result.totalFrames).toBe(90);
  });
});
