// @TASK P3-R1-T1 - Render Job API 테스트
// @SPEC docs/planning/05-api-spec.md#render

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// file-service 모킹
vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  listFiles: vi.fn(),
  listDirs: vi.fn(),
  ensureDir: vi.fn(),
  getProjectPath: vi.fn(),
}));

// crypto.randomUUID 모킹
vi.stubGlobal(
  "crypto",
  Object.assign({}, globalThis.crypto, {
    randomUUID: vi.fn(() => "render-job-uuid"),
  })
);

import {
  readJSON,
  writeJSON,
  getProjectPath,
} from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);

// 라우트 핸들러 임포트
import {
  POST as createRenderJob,
  GET as listRenderJobs,
} from "@/app/api/projects/[projectId]/render/route";
import { GET as getRenderJob } from "@/app/api/projects/[projectId]/render/[id]/route";
import { PUT as pauseRenderJob } from "@/app/api/projects/[projectId]/render/[id]/pause/route";
import { PUT as cancelRenderJob } from "@/app/api/projects/[projectId]/render/[id]/cancel/route";

import type { Project, Scene, RenderJob } from "@/types/index";

// ─────────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────────

function createRequest(
  method: string,
  url: string,
  body?: Record<string, unknown>
): NextRequest {
  const init: RequestInit = { method };
  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), init);
}

function createProjectIdContext(projectId: string) {
  return { params: Promise.resolve({ projectId }) };
}

function createRenderContext(projectId: string, id: string) {
  return { params: Promise.resolve({ projectId, id }) };
}

const SAMPLE_PROJECT: Project = {
  id: "proj-abc",
  name: "Test Project",
  srt_path: "data/proj-abc/input.srt",
  audio_path: "data/proj-abc/audio.mp3",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  status: "scened",
  total_duration_ms: 10000,
};

const SAMPLE_SCENES: Scene[] = [
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

const SAMPLE_RENDER_JOB: RenderJob = {
  id: "render-job-uuid",
  project_id: "proj-abc",
  status: "rendering",
  total_frames: 210,
  rendered_frames: 50,
  started_at: "2026-01-01T00:00:00.000Z",
  completed_at: null,
  output_path: null,
  file_size: null,
  logs: [
    {
      timestamp: "2026-01-01T00:00:00.000Z",
      level: "info",
      message: "렌더링 시작",
    },
  ],
  current_scene: "scene-001",
};

// ─────────────────────────────────────────────
// POST /api/projects/:projectId/render - 렌더링 작업 생성
// ─────────────────────────────────────────────

describe("POST /api/projects/:projectId/render", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("렌더링 작업을 생성하고 201을 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("scenes.json")) return SAMPLE_SCENES;
      return null;
    });
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest(
      "POST",
      "http://localhost:3000/api/projects/proj-abc/render"
    );
    const res = await createRenderJob(req, createProjectIdContext("proj-abc"));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.renderJob).toBeDefined();
    expect(data.renderJob.id).toBe("render-job-uuid");
    expect(data.renderJob.project_id).toBe("proj-abc");
    expect(data.renderJob.status).toBe("pending");
    expect(data.renderJob.total_frames).toBe(210); // 90 + 120
    expect(data.renderJob.rendered_frames).toBe(0);
    expect(data.renderJob.logs).toHaveLength(1);
    expect(data.renderJob.logs[0].level).toBe("info");
    expect(data.renderJob.logs[0].message).toContain("렌더링 작업 생성");

    // writeJSON이 올바른 경로로 호출되었는지 확인
    expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
    const writtenPath = mockedWriteJSON.mock.calls[0][0];
    expect(writtenPath).toContain("render-jobs");
    expect(writtenPath).toContain("render-job-uuid.json");
  });

  it("프로젝트가 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockResolvedValue(null);

    const req = createRequest(
      "POST",
      "http://localhost:3000/api/projects/no-exist/render"
    );
    const res = await createRenderJob(req, createProjectIdContext("no-exist"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it("scenes.json이 없으면 400을 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null; // scenes.json not found
    });

    const req = createRequest(
      "POST",
      "http://localhost:3000/api/projects/proj-abc/render"
    );
    const res = await createRenderJob(req, createProjectIdContext("proj-abc"));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("scenes가 비어있으면 400을 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("scenes.json")) return [];
      return null;
    });

    const req = createRequest(
      "POST",
      "http://localhost:3000/api/projects/proj-abc/render"
    );
    const res = await createRenderJob(req, createProjectIdContext("proj-abc"));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/render - 렌더 작업 목록 조회
// ─────────────────────────────────────────────

describe("GET /api/projects/:projectId/render", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("렌더 작업 목록을 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return SAMPLE_RENDER_JOB;
      return null;
    });

    // listFiles mock 필요
    const { listFiles } = await import("@/services/file-service");
    const mockedListFiles = vi.mocked(listFiles);
    mockedListFiles.mockResolvedValue(["render-job-uuid.json"]);

    const req = createRequest(
      "GET",
      "http://localhost:3000/api/projects/proj-abc/render"
    );
    const res = await listRenderJobs(req, createProjectIdContext("proj-abc"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.renderJobs).toBeDefined();
    expect(data.renderJobs).toHaveLength(1);
    expect(data.renderJobs[0].id).toBe("render-job-uuid");
  });

  it("프로젝트가 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockResolvedValue(null);

    const req = createRequest(
      "GET",
      "http://localhost:3000/api/projects/no-exist/render"
    );
    const res = await listRenderJobs(req, createProjectIdContext("no-exist"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// GET /api/projects/:projectId/render/:id - 렌더 작업 상태 조회
// ─────────────────────────────────────────────

describe("GET /api/projects/:projectId/render/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("렌더 작업 상태를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return SAMPLE_RENDER_JOB;
      return null;
    });

    const req = createRequest(
      "GET",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid"
    );
    const res = await getRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.renderJob).toBeDefined();
    expect(data.renderJob.id).toBe("render-job-uuid");
    expect(data.renderJob.status).toBe("rendering");
    expect(data.renderJob.rendered_frames).toBe(50);
  });

  it("프로젝트가 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockResolvedValue(null);

    const req = createRequest(
      "GET",
      "http://localhost:3000/api/projects/no-exist/render/render-job-uuid"
    );
    const res = await getRenderJob(
      req,
      createRenderContext("no-exist", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it("렌더 작업이 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null; // render job not found
    });

    const req = createRequest(
      "GET",
      "http://localhost:3000/api/projects/proj-abc/render/no-exist"
    );
    const res = await getRenderJob(
      req,
      createRenderContext("proj-abc", "no-exist")
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// PUT /api/projects/:projectId/render/:id/pause - 렌더 일시 정지
// ─────────────────────────────────────────────

describe("PUT /api/projects/:projectId/render/:id/pause", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rendering 상태의 작업을 paused로 변경한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return { ...SAMPLE_RENDER_JOB };
      return null;
    });
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid/pause"
    );
    const res = await pauseRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.renderJob.status).toBe("paused");
    expect(data.renderJob.logs.length).toBeGreaterThan(1);

    // writeJSON이 호출되었는지 확인
    expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
  });

  it("rendering이 아닌 상태에서는 409를 반환한다", async () => {
    const pendingJob: RenderJob = {
      ...SAMPLE_RENDER_JOB,
      status: "pending",
    };

    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return pendingJob;
      return null;
    });

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid/pause"
    );
    const res = await pauseRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBeDefined();
  });

  it("렌더 작업이 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/no-exist/pause"
    );
    const res = await pauseRenderJob(
      req,
      createRenderContext("proj-abc", "no-exist")
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// PUT /api/projects/:projectId/render/:id/cancel - 렌더 취소
// ─────────────────────────────────────────────

describe("PUT /api/projects/:projectId/render/:id/cancel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("작업을 failed 상태로 변경하고 취소 로그를 추가한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return { ...SAMPLE_RENDER_JOB };
      return null;
    });
    mockedWriteJSON.mockResolvedValue(undefined);

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid/cancel"
    );
    const res = await cancelRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.renderJob.status).toBe("failed");

    // 취소 로그 확인
    const cancelLog = data.renderJob.logs.find(
      (log: { message: string }) => log.message.includes("사용자 취소")
    );
    expect(cancelLog).toBeDefined();
    expect(cancelLog.level).toBe("warning");

    expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
  });

  it("이미 completed 상태이면 409를 반환한다", async () => {
    const completedJob: RenderJob = {
      ...SAMPLE_RENDER_JOB,
      status: "completed",
      completed_at: "2026-01-01T01:00:00.000Z",
    };

    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return completedJob;
      return null;
    });

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid/cancel"
    );
    const res = await cancelRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBeDefined();
  });

  it("이미 failed 상태이면 409를 반환한다", async () => {
    const failedJob: RenderJob = {
      ...SAMPLE_RENDER_JOB,
      status: "failed",
    };

    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      if (filePath.includes("render-job-uuid.json")) return failedJob;
      return null;
    });

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/render-job-uuid/cancel"
    );
    const res = await cancelRenderJob(
      req,
      createRenderContext("proj-abc", "render-job-uuid")
    );
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBeDefined();
  });

  it("렌더 작업이 없으면 404를 반환한다", async () => {
    mockedGetProjectPath.mockImplementation(
      (pid: string, file: string) => `/data/${pid}/${file}`
    );
    mockedReadJSON.mockImplementation(async (filePath: string) => {
      if (filePath.includes("project.json")) return SAMPLE_PROJECT;
      return null;
    });

    const req = createRequest(
      "PUT",
      "http://localhost:3000/api/projects/proj-abc/render/no-exist/cancel"
    );
    const res = await cancelRenderJob(
      req,
      createRenderContext("proj-abc", "no-exist")
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});
