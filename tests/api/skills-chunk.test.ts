// @TASK P1.5-SK1-T2 - /vg-chunk Skill API Route 테스트
// @SPEC specs/shared/types.yaml

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import type { SRTEntry } from "@/services/srt-parser";

// ─────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────

vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  getProjectPath: vi.fn(),
}));

vi.mock("@/services/srt-parser", () => ({
  parseSRT: vi.fn(),
}));

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}));

import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import { parseSRT } from "@/services/srt-parser";
import fs from "fs/promises";
import { POST } from "@/app/api/skills/chunk/route";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);
const mockedParseSRT = vi.mocked(parseSRT);
const mockedReadFile = vi.mocked(fs.readFile);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function createRequest(body?: Record<string, unknown>): NextRequest {
  const init: RequestInit = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  return new NextRequest(
    new URL("http://localhost:3000/api/skills/chunk"),
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
  status: "draft",
  total_duration_ms: 10000,
};

const SAMPLE_SRT_ENTRIES: SRTEntry[] = [
  {
    index: 1,
    startTime: "00:00:00,000",
    endTime: "00:00:03,000",
    startMs: 0,
    endMs: 3000,
    startFrame: 0,
    endFrame: 90,
    text: "인공지능은 현대 기술의 핵심입니다",
  },
  {
    index: 2,
    startTime: "00:00:03,000",
    endTime: "00:00:06,500",
    startMs: 3000,
    endMs: 6500,
    startFrame: 90,
    endFrame: 195,
    text: "특히 딥러닝 기술이 크게 발전했습니다",
  },
  {
    index: 3,
    startTime: "00:00:06,500",
    endTime: "00:00:10,000",
    startMs: 6500,
    endMs: 10000,
    startFrame: 195,
    endFrame: 300,
    text: "예를 들어, GPT 모델은 자연어 처리에서 혁신적입니다",
  },
];

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe("POST /api/skills/chunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 400: Invalid request body ──
  it("should return 400 when project_id is missing", async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 when body is not valid JSON", async () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/api/skills/chunk"),
      {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
      }
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // ── 404: Project not found ──
  it("should return 404 when project does not exist", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-001/project.json");
    mockedReadJSON.mockResolvedValue(null);

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain("프로젝트");
  });

  // ── 400: SRT file not found ──
  it("should return 400 when SRT file cannot be read", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-001/project.json");
    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("SRT");
  });

  // ── 400: Empty SRT ──
  it("should return 400 when SRT file yields zero entries", async () => {
    mockedGetProjectPath.mockReturnValue("/data/proj-001/project.json");
    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockResolvedValue("" as never);
    mockedParseSRT.mockReturnValue([]);

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("SRT");
  });

  // ── 200: Success ──
  it("should return 200 with beats_count on success", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/project.json") // read project
      .mockReturnValueOnce("/data/proj-001/beats.json")   // write beats
      .mockReturnValueOnce("/data/proj-001/project.json"); // update project

    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockResolvedValue("fake srt content" as never);
    mockedParseSRT.mockReturnValue(SAMPLE_SRT_ENTRIES);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.beats_count).toBe(3);
    expect(data.output_path).toContain("beats.json");
  });

  // ── beats.json structure ──
  it("should generate beats with correct Beat structure", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/project.json")
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockResolvedValue("fake srt content" as never);
    mockedParseSRT.mockReturnValue(SAMPLE_SRT_ENTRIES);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // writeJSON should be called twice: beats.json + project.json update
    expect(mockedWriteJSON).toHaveBeenCalledTimes(2);

    // First call: beats.json
    const [beatsPath, beatsData] = mockedWriteJSON.mock.calls[0];
    expect(beatsPath).toContain("beats.json");

    const beats = beatsData as Array<Record<string, unknown>>;
    expect(beats).toHaveLength(3);

    // Verify Beat structure
    const beat = beats[0] as Record<string, unknown>;
    expect(beat).toHaveProperty("beat_index", 0);
    expect(beat).toHaveProperty("start_ms", 0);
    expect(beat).toHaveProperty("end_ms", 3000);
    expect(beat).toHaveProperty("start_frame", 0);
    expect(beat).toHaveProperty("end_frame", 90);
    expect(beat).toHaveProperty("text", "인공지능은 현대 기술의 핵심입니다");
    expect(beat).toHaveProperty("semantic");

    const semantic = beat.semantic as Record<string, unknown>;
    expect(semantic).toHaveProperty("intent");
    expect(semantic).toHaveProperty("tone");
    expect(semantic).toHaveProperty("evidence_type");
    expect(semantic).toHaveProperty("emphasis_tokens");
    expect(semantic).toHaveProperty("density");
    expect(typeof semantic.intent).toBe("string");
    expect(typeof semantic.tone).toBe("string");
    expect(typeof semantic.evidence_type).toBe("string");
    expect(Array.isArray(semantic.emphasis_tokens)).toBe(true);
    expect(typeof semantic.density).toBe("number");
    expect(semantic.density).toBeGreaterThanOrEqual(1);
    expect(semantic.density).toBeLessThanOrEqual(5);
  });

  // ── project.json status update ──
  it("should update project status to 'chunked'", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/project.json")
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockResolvedValue("fake srt content" as never);
    mockedParseSRT.mockReturnValue(SAMPLE_SRT_ENTRIES);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    // Second writeJSON call: project.json update
    const [projectPath, projectData] = mockedWriteJSON.mock.calls[1];
    expect(projectPath).toContain("project.json");

    const updatedProject = projectData as Record<string, unknown>;
    expect(updatedProject.status).toBe("chunked");
  });

  // ── beat_index ordering ──
  it("should assign sequential beat_index starting from 0", async () => {
    mockedGetProjectPath
      .mockReturnValueOnce("/data/proj-001/project.json")
      .mockReturnValueOnce("/data/proj-001/beats.json")
      .mockReturnValueOnce("/data/proj-001/project.json");

    mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);
    mockedReadFile.mockResolvedValue("fake srt content" as never);
    mockedParseSRT.mockReturnValue(SAMPLE_SRT_ENTRIES);
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest({ project_id: "proj-001" });
    await POST(req);

    const beats = mockedWriteJSON.mock.calls[0][1] as Array<Record<string, unknown>>;
    beats.forEach((beat, idx) => {
      expect(beat.beat_index).toBe(idx);
    });
  });
});
