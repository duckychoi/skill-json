// @TASK P1.5-SK2-T3 - /vg-scene Skill API Route 테스트
// @SPEC beats.json + catalog -> scene-plan.json + scenes.json 생성

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  getProjectPath: vi.fn(),
}));

vi.mock("@/services/scoring-engine", () => ({
  selectBestLayout: vi.fn(),
  scoreAllLayouts: vi.fn(),
}));

vi.mock("@/services/dsl-generator", () => ({
  generateSceneDSL: vi.fn(),
}));

import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import { selectBestLayout, scoreAllLayouts } from "@/services/scoring-engine";
import { generateSceneDSL } from "@/services/dsl-generator";
import { POST } from "@/app/api/skills/scene/route";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);
const mockedSelectBestLayout = vi.mocked(selectBestLayout);
const mockedScoreAllLayouts = vi.mocked(scoreAllLayouts);
const mockedGenerateSceneDSL = vi.mocked(generateSceneDSL);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createRequest(body?: Record<string, unknown>): NextRequest {
  const init: RequestInit = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  return new NextRequest(
    new URL("http://localhost:3000/api/skills/scene"),
    init
  );
}

const SAMPLE_PROJECT = {
  id: "proj-001",
  name: "Test Project",
  srt_path: "subtitles.srt",
  audio_path: "audio.mp3",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  status: "chunked",
  total_duration_ms: 10000,
};

const SAMPLE_BEATS = [
  {
    beat_index: 0,
    start_ms: 0,
    end_ms: 3000,
    start_frame: 0,
    end_frame: 90,
    text: "인공지능은 현대 기술의 핵심입니다",
    semantic: {
      intent: "emphasize",
      tone: "confident",
      evidence_type: "statement",
      emphasis_tokens: ["인공지능", "현대", "기술", "핵심"],
      density: 2,
    },
  },
  {
    beat_index: 1,
    start_ms: 3000,
    end_ms: 6500,
    start_frame: 90,
    end_frame: 195,
    text: "딥러닝과 머신러닝을 비교해 봅시다",
    semantic: {
      intent: "compare",
      tone: "analytical",
      evidence_type: "statistic",
      emphasis_tokens: ["딥러닝", "머신러닝", "비교"],
      density: 2,
    },
  },
  {
    beat_index: 2,
    start_ms: 6500,
    end_ms: 10000,
    start_frame: 195,
    end_frame: 300,
    text: "예를 들어, GPT 모델은 자연어 처리에서 혁신적입니다",
    semantic: {
      intent: "example",
      tone: "dramatic",
      evidence_type: "example",
      emphasis_tokens: ["GPT", "모델", "자연어", "처리", "혁신적"],
      density: 3,
    },
  },
];

const SAMPLE_SCORING_RESULT = {
  layoutFamily: "hero-center",
  score: 65,
  breakdown: {
    semanticFit: 40,
    evidenceTypeFit: 0,
    rhythmFit: 15,
    assetOwnership: 10,
    recentRepetitionPenalty: 0,
    previousSimilarityPenalty: 0,
  },
};

const SAMPLE_ALL_LAYOUTS = [
  { layoutFamily: "hero-center", score: 65, breakdown: SAMPLE_SCORING_RESULT.breakdown },
  { layoutFamily: "split-2col", score: 40, breakdown: SAMPLE_SCORING_RESULT.breakdown },
  { layoutFamily: "grid-4x3", score: 20, breakdown: SAMPLE_SCORING_RESULT.breakdown },
];

const SAMPLE_SCENE = {
  id: "scene-0",
  project_id: "proj-001",
  beat_index: 0,
  layout_family: "hero-center",
  start_ms: 0,
  end_ms: 3000,
  duration_frames: 90,
  components: [
    { id: "hero-bg", type: "background", props: {} },
    { id: "hero-text", type: "text-block", props: {} },
  ],
  copy_layers: {
    kicker: null,
    headline: "인공지능은 현대 기술의 핵심입니다",
    supporting: null,
    footer_caption: null,
  },
  motion: { entrance: "fadeUp", emphasis: null, exit: null, duration_ms: 1200 },
  assets: { svg_icons: [], chart_type: null, chart_data: null },
  chunk_metadata: {
    intent: "emphasize",
    tone: "confident",
    evidence_type: "statement",
    emphasis_tokens: ["인공지능", "현대", "기술", "핵심"],
    density: 2,
    beat_count: 1,
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/skills/scene", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -- 400: Invalid request body --
  it("should return 400 when project_id is missing", async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 when body is not valid JSON", async () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/api/skills/scene"),
      {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
      }
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // -- 400: beats.json not found --
  it("should return 400 when beats.json does not exist", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json");
    mockedReadJSON.mockResolvedValueOnce(null); // beats.json not found

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("beats.json");
  });

  // -- 400: empty beats array --
  it("should return 400 when beats.json is empty array", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json");
    mockedReadJSON.mockResolvedValueOnce([]); // empty beats

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("beats");
  });

  // -- 200: Success --
  it("should return 200 with scenes_count on success", async () => {
    // getProjectPath calls: beats.json, design-tokens.json, scene-plan.json, scenes.json, project.json
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS) // beats.json
      .mockResolvedValueOnce(null) // design-tokens.json (not found, use default)
      .mockResolvedValueOnce(SAMPLE_PROJECT); // project.json for status update

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.scenes_count).toBe(3);
    expect(data.scene_plan_path).toContain("scene-plan.json");
    expect(data.scenes_path).toContain("scenes.json");
  });

  // -- scene-plan.json structure --
  it("should write scene-plan.json with correct structure", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // First writeJSON call: scene-plan.json
    expect(mockedWriteJSON).toHaveBeenCalled();
    const [planPath, planData] = mockedWriteJSON.mock.calls[0];
    expect(planPath).toContain("scene-plan.json");

    const plan = planData as Record<string, unknown>;
    expect(plan.project_id).toBe("proj-001");
    expect(plan.total_beats).toBe(3);
    expect(Array.isArray(plan.plans)).toBe(true);

    const plans = plan.plans as Array<Record<string, unknown>>;
    expect(plans).toHaveLength(3);
    expect(plans[0]).toHaveProperty("beat_index", 0);
    expect(plans[0]).toHaveProperty("selected_layout");
    expect(plans[0]).toHaveProperty("score");
    expect(plans[0]).toHaveProperty("breakdown");
    expect(plans[0]).toHaveProperty("alternatives");
  });

  // -- scenes.json structure --
  it("should write scenes.json with Scene[] array", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // Second writeJSON call: scenes.json
    const [scenesPath, scenesData] = mockedWriteJSON.mock.calls[1];
    expect(scenesPath).toContain("scenes.json");

    const scenes = scenesData as Array<Record<string, unknown>>;
    expect(scenes).toHaveLength(3);
    expect(scenes[0]).toHaveProperty("id");
    expect(scenes[0]).toHaveProperty("project_id", "proj-001");
    expect(scenes[0]).toHaveProperty("layout_family");
  });

  // -- project.json status update --
  it("should update project status to 'scened'", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // Third writeJSON call: project.json update
    expect(mockedWriteJSON).toHaveBeenCalledTimes(3);
    const [projectPath, projectData] = mockedWriteJSON.mock.calls[2];
    expect(projectPath).toContain("project.json");

    const updatedProject = projectData as Record<string, unknown>;
    expect(updatedProject.status).toBe("scened");
  });

  // -- scoring context tracking (repetition penalty) --
  it("should track recent layouts for repetition penalty across beats", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    // Return different layouts for different beats to verify context tracking
    mockedSelectBestLayout
      .mockReturnValueOnce({ layoutFamily: "hero-center", score: 65, breakdown: SAMPLE_SCORING_RESULT.breakdown })
      .mockReturnValueOnce({ layoutFamily: "split-2col", score: 55, breakdown: SAMPLE_SCORING_RESULT.breakdown })
      .mockReturnValueOnce({ layoutFamily: "grid-4x3", score: 50, breakdown: SAMPLE_SCORING_RESULT.breakdown });

    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // Verify selectBestLayout was called 3 times (once per beat)
    expect(mockedSelectBestLayout).toHaveBeenCalledTimes(3);

    // First call: no previous layout, empty recent
    const firstCallContext = mockedSelectBestLayout.mock.calls[0][1];
    expect(firstCallContext.previousLayout).toBeNull();
    expect(firstCallContext.recentLayouts).toEqual([]);

    // Second call: previous = hero-center, recent = [hero-center]
    const secondCallContext = mockedSelectBestLayout.mock.calls[1][1];
    expect(secondCallContext.previousLayout).toBe("hero-center");
    expect(secondCallContext.recentLayouts).toContain("hero-center");

    // Third call: previous = split-2col, recent includes hero-center and split-2col
    const thirdCallContext = mockedSelectBestLayout.mock.calls[2][1];
    expect(thirdCallContext.previousLayout).toBe("split-2col");
    expect(thirdCallContext.recentLayouts).toContain("hero-center");
    expect(thirdCallContext.recentLayouts).toContain("split-2col");
  });

  // -- design-tokens.json optional (uses defaults when missing) --
  it("should proceed with defaults when design-tokens.json is missing", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON
      .mockResolvedValueOnce(SAMPLE_BEATS)
      .mockResolvedValueOnce(null) // design-tokens.json missing
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    // Should succeed even without design-tokens.json
    expect(res.status).toBe(200);
  });

  // -- 500: Internal server error --
  it("should return 500 on unexpected error", async () => {
    mockedGetProjectPath.mockReturnValueOnce("/data/proj-001/beats.json");
    mockedReadJSON.mockRejectedValueOnce(new Error("Unexpected DB error"));

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  // -- scoring input construction --
  it("should construct correct ScoringInput from beat semantic data", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    // Use only one beat for clarity
    const singleBeat = [SAMPLE_BEATS[0]];
    mockedReadJSON
      .mockResolvedValueOnce(singleBeat)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue(SAMPLE_SCORING_RESULT);
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // Verify scoring input matches beat semantic
    const scoringInput = mockedSelectBestLayout.mock.calls[0][0];
    expect(scoringInput.intent).toBe("emphasize");
    expect(scoringInput.tone).toBe("confident");
    expect(scoringInput.evidenceType).toBe("statement");
    expect(scoringInput.emphasisTokens).toEqual(["인공지능", "현대", "기술", "핵심"]);
    expect(scoringInput.density).toBe(2);
  });

  // -- DSL generator input --
  it("should pass correct DSLGeneratorInput to generateSceneDSL", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/design-tokens.json")
      .mockReturnValueOnce("/data/proj-001/scene-plan.json")
      .mockReturnValueOnce("/data/proj-001/scenes.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    const singleBeat = [SAMPLE_BEATS[0]];
    mockedReadJSON
      .mockResolvedValueOnce(singleBeat)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(SAMPLE_PROJECT);

    mockedSelectBestLayout.mockReturnValue({
      ...SAMPLE_SCORING_RESULT,
      layoutFamily: "hero-center",
    });
    mockedScoreAllLayouts.mockReturnValue(SAMPLE_ALL_LAYOUTS);
    mockedGenerateSceneDSL.mockReturnValue(SAMPLE_SCENE);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    expect(mockedGenerateSceneDSL).toHaveBeenCalledTimes(1);
    const dslInput = mockedGenerateSceneDSL.mock.calls[0][0];
    expect(dslInput.beat).toEqual(singleBeat[0]);
    expect(dslInput.layoutFamily).toBe("hero-center");
    expect(dslInput.projectId).toBe("proj-001");
  });
});
