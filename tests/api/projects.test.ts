// @TASK P1-R1-T1 - Project API 테스트
// @SPEC docs/planning/05-api-spec.md

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
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
    randomUUID: vi.fn(() => "test-uuid-1234"),
  })
);

import {
  readJSON,
  writeJSON,
  listDirs,
  getProjectPath,
} from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedListDirs = vi.mocked(listDirs);
const mockedGetProjectPath = vi.mocked(getProjectPath);

// 라우트 핸들러 임포트 (구현 전이므로 테스트는 실패해야 함)
import { GET as listProjects, POST as createProject } from "@/app/api/projects/route";
import {
  GET as getProject,
  PUT as updateProject,
} from "@/app/api/projects/[id]/route";

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

function createContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

const SAMPLE_PROJECT = {
  id: "proj-abc",
  name: "테스트 프로젝트",
  srt_path: "/uploads/test.srt",
  audio_path: "/uploads/test.mp3",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  status: "draft" as const,
  total_duration_ms: 0,
};

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("Project API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  // GET /api/projects - 프로젝트 목록 조회
  // ═══════════════════════════════════════════
  describe("GET /api/projects", () => {
    it("프로젝트가 없으면 빈 배열을 반환한다", async () => {
      mockedListDirs.mockResolvedValue([]);

      const req = createRequest("GET", "/api/projects");
      const res = await listProjects(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toEqual({ projects: [] });
    });

    it("프로젝트가 있으면 목록을 반환한다", async () => {
      // data/ 하위 디렉토리 목록을 반환하도록 모킹
      mockedListDirs.mockResolvedValue(["proj-abc"]);
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);

      const req = createRequest("GET", "/api/projects");
      const res = await listProjects(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.projects).toHaveLength(1);
      expect(body.projects[0].name).toBe("테스트 프로젝트");
    });

    it("읽기 실패한 프로젝트는 건너뛴다", async () => {
      mockedListDirs.mockResolvedValue(["proj-abc", "proj-broken"]);
      mockedGetProjectPath.mockImplementation((id: string) =>
        `/data/${id}/project.json`
      );
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects");
      const res = await listProjects(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.projects).toHaveLength(1);
    });
  });

  // ═══════════════════════════════════════════
  // GET /api/projects/:id - 프로젝트 상세 조회
  // ═══════════════════════════════════════════
  describe("GET /api/projects/:id", () => {
    it("존재하는 프로젝트를 반환한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue(SAMPLE_PROJECT);

      const req = createRequest("GET", "/api/projects/proj-abc");
      const res = await getProject(req, createContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.id).toBe("proj-abc");
      expect(body.name).toBe("테스트 프로젝트");
    });

    it("존재하지 않는 프로젝트는 404를 반환한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/not-found/project.json");
      mockedReadJSON.mockResolvedValue(null);

      const req = createRequest("GET", "/api/projects/not-found");
      const res = await getProject(req, createContext("not-found"));

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════
  // POST /api/projects - 프로젝트 생성
  // ═══════════════════════════════════════════
  describe("POST /api/projects", () => {
    it("유효한 입력으로 프로젝트를 생성한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/test-uuid-1234/project.json");
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("POST", "/api/projects", {
        name: "새 프로젝트",
        srt_path: "/uploads/new.srt",
        audio_path: "/uploads/new.mp3",
      });

      const res = await createProject(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.id).toBe("test-uuid-1234");
      expect(body.name).toBe("새 프로젝트");
      expect(body.status).toBe("draft");
      expect(body.total_duration_ms).toBe(0);
      expect(body.created_at).toBeDefined();
      expect(body.updated_at).toBeDefined();

      // writeJSON이 호출되었는지 확인
      expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
    });

    it("name이 없으면 400을 반환한다", async () => {
      const req = createRequest("POST", "/api/projects", {
        srt_path: "/uploads/new.srt",
        audio_path: "/uploads/new.mp3",
      });

      const res = await createProject(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it("srt_path가 없으면 400을 반환한다", async () => {
      const req = createRequest("POST", "/api/projects", {
        name: "새 프로젝트",
        audio_path: "/uploads/new.mp3",
      });

      const res = await createProject(req);
      expect(res.status).toBe(400);
    });

    it("audio_path가 없으면 400을 반환한다", async () => {
      const req = createRequest("POST", "/api/projects", {
        name: "새 프로젝트",
        srt_path: "/uploads/new.srt",
      });

      const res = await createProject(req);
      expect(res.status).toBe(400);
    });

    it("빈 name은 400을 반환한다", async () => {
      const req = createRequest("POST", "/api/projects", {
        name: "",
        srt_path: "/uploads/new.srt",
        audio_path: "/uploads/new.mp3",
      });

      const res = await createProject(req);
      expect(res.status).toBe(400);
    });

    it("빈 body는 400을 반환한다", async () => {
      const req = new NextRequest(
        new URL("/api/projects", "http://localhost:3000"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid-json",
        }
      );

      const res = await createProject(req);
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════
  // PUT /api/projects/:id - 프로젝트 수정
  // ═══════════════════════════════════════════
  describe("PUT /api/projects/:id", () => {
    it("name을 수정한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue({ ...SAMPLE_PROJECT });
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("PUT", "/api/projects/proj-abc", {
        name: "수정된 이름",
      });

      const res = await updateProject(req, createContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.name).toBe("수정된 이름");
      expect(body.updated_at).not.toBe(SAMPLE_PROJECT.updated_at);
    });

    it("status를 수정한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue({ ...SAMPLE_PROJECT });
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("PUT", "/api/projects/proj-abc", {
        status: "chunked",
      });

      const res = await updateProject(req, createContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.status).toBe("chunked");
    });

    it("존재하지 않는 프로젝트는 404를 반환한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/not-found/project.json");
      mockedReadJSON.mockResolvedValue(null);

      const req = createRequest("PUT", "/api/projects/not-found", {
        name: "업데이트",
      });

      const res = await updateProject(req, createContext("not-found"));
      expect(res.status).toBe(404);
    });

    it("잘못된 status 값은 400을 반환한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue({ ...SAMPLE_PROJECT });

      const req = createRequest("PUT", "/api/projects/proj-abc", {
        status: "invalid-status",
      });

      const res = await updateProject(req, createContext("proj-abc"));
      expect(res.status).toBe(400);
    });

    it("빈 name은 400을 반환한다", async () => {
      mockedGetProjectPath.mockReturnValue("/data/proj-abc/project.json");
      mockedReadJSON.mockResolvedValue({ ...SAMPLE_PROJECT });

      const req = createRequest("PUT", "/api/projects/proj-abc", {
        name: "",
      });

      const res = await updateProject(req, createContext("proj-abc"));
      expect(res.status).toBe(400);
    });
  });
});
