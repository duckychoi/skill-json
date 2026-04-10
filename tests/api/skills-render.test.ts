// @TASK P1.5-SK4-T1 - /vg-render Skill API Route 테스트
// @SPEC Scene DSL -> Remotion TSX -> mp4 렌더링

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  getProjectPath: vi.fn(),
  ensureDir: vi.fn(),
}));

vi.mock("@/services/remotion-builder", () => ({
  writeGeneratedComposition: vi.fn(),
}));

// Mock child_process.exec for Remotion CLI (will be mocked, not actually called)
vi.mock("child_process", () => ({
  exec: vi.fn((_cmd: string, cb: (err: Error | null, result: { stdout: string; stderr: string }) => void) => {
    cb(null, { stdout: "Rendered successfully", stderr: "" });
  }),
}));

import {
  readJSON,
  writeJSON,
  getProjectPath,
  ensureDir,
} from "@/services/file-service";
import { writeGeneratedComposition } from "@/services/remotion-builder";
import { POST } from "@/app/api/skills/render/route";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);
const mockedEnsureDir = vi.mocked(ensureDir);
const mockedWriteGenerated = vi.mocked(writeGeneratedComposition);

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
    new URL("http://localhost:3000/api/skills/render"),
    init
  );
}

const SAMPLE_PROJECT = {
  id: "proj-abc",
  name: "Test Project",
  srt_path: "data/proj-abc/input.srt",
  audio_path: "data/proj-abc/audio.mp3",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  status: "scened",
  total_duration_ms: 10000,
};

const SAMPLE_SCENES = [
  {
    id: "scene-001",
    project_id: "proj-abc",
    beat_index: 0,
    layout_family: "hero-center",
    start_ms: 0,
    end_ms: 3000,
    duration_frames: 90,
    components: [],
    copy_layers: {
      kicker: null,
      headline: "Test Headline",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "fade-in",
      emphasis: null,
      exit: null,
      duration_ms: 500,
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
      kicker: null,
      headline: "Second Scene",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "slide-left",
      emphasis: null,
      exit: null,
      duration_ms: 500,
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
  },
];

const SAMPLE_BUILD_RESULT = {
  outputDir: "src/generated/proj-abc",
  compositionFile: "src/generated/proj-abc/Composition.tsx",
  totalFrames: 210,
  fps: 30,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/skills/render", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -- 400: Missing project_id --
  it("should return 400 when project_id is missing", async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  // -- 400: Invalid JSON --
  it("should return 400 when body is not valid JSON", async () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/api/skills/render"),
      {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
      }
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // -- 400: scenes.json not found --
  it("should return 400 when scenes.json does not exist", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-abc/scenes.json");
    mockedReadJSON.mockResolvedValue(null);

    const req = createRequest({ project_id: "proj-abc" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("scenes.json");
  });

  // -- 400: empty scenes --
  it("should return 400 when scenes.json is empty array", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-abc/scenes.json");
    mockedReadJSON.mockResolvedValue([]);

    const req = createRequest({ project_id: "proj-abc" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // -- 200: Success --
  it("should return 200 with render_job_id on success", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("scenes.json")) return SAMPLE_SCENES;
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });
    mockedWriteGenerated.mockResolvedValue(SAMPLE_BUILD_RESULT);
    mockedWriteJSON.mockResolvedValue(undefined);
    mockedEnsureDir.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-abc" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.render_job_id).toBeDefined();
    expect(typeof data.render_job_id).toBe("string");
    expect(data.output_path).toBeDefined();
  });

  // -- TSX generation --
  it("should call writeGeneratedComposition with scenes and output dir", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("scenes.json")) return SAMPLE_SCENES;
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });
    mockedWriteGenerated.mockResolvedValue(SAMPLE_BUILD_RESULT);
    mockedWriteJSON.mockResolvedValue(undefined);
    mockedEnsureDir.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-abc" });
    await POST(req);

    expect(mockedWriteGenerated).toHaveBeenCalledTimes(1);
    const [scenes, outputDir] = mockedWriteGenerated.mock.calls[0];
    expect(scenes).toEqual(SAMPLE_SCENES);
    expect(outputDir).toContain("proj-abc");
  });

  // -- RenderJob creation --
  it("should write a render job JSON file with status rendering", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("scenes.json")) return SAMPLE_SCENES;
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });
    mockedWriteGenerated.mockResolvedValue(SAMPLE_BUILD_RESULT);
    mockedWriteJSON.mockResolvedValue(undefined);
    mockedEnsureDir.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-abc" });
    await POST(req);

    // At least one writeJSON call should be a render job
    const renderJobCall = mockedWriteJSON.mock.calls.find(
      ([path]) => String(path).includes("render-job")
    );
    expect(renderJobCall).toBeDefined();
    const renderJob = renderJobCall![1] as Record<string, unknown>;
    expect(renderJob.status).toBe("rendering");
    expect(renderJob.project_id).toBe("proj-abc");
    expect(renderJob.total_frames).toBe(210);
  });

  // -- Project status update --
  it("should update project.json status to rendered", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("scenes.json")) return SAMPLE_SCENES;
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });
    mockedWriteGenerated.mockResolvedValue(SAMPLE_BUILD_RESULT);
    mockedWriteJSON.mockResolvedValue(undefined);
    mockedEnsureDir.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-abc" });
    await POST(req);

    // Find the writeJSON call that updates project.json
    const projectUpdateCall = mockedWriteJSON.mock.calls.find(
      ([path]) => String(path).includes("project.json")
    );
    expect(projectUpdateCall).toBeDefined();
    const updatedProject = projectUpdateCall![1] as Record<string, unknown>;
    expect(updatedProject.status).toBe("rendered");
  });

  // -- 500: Internal error --
  it("should return 500 on unexpected error", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-abc/scenes.json");
    mockedReadJSON.mockRejectedValue(new Error("Unexpected error"));

    const req = createRequest({ project_id: "proj-abc" });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});
