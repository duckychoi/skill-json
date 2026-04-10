// @TASK P2-R2-T1 - Audio API 테스트 (파형 + 비트 마커)
// @SPEC specs/shared/types.yaml#BeatMarker

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

import {
  readJSON,
  getProjectPath,
} from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);

// 라우트 핸들러 임포트
import { GET as getAudio } from "@/app/api/projects/[projectId]/audio/route";
import { GET as getWaveform } from "@/app/api/projects/[projectId]/audio/waveform/route";

// ─────────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────────

function createRequest(method: string, url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), { method });
}

function createProjectIdContext(projectId: string) {
  return { params: Promise.resolve({ projectId }) };
}

// ─────────────────────────────────────────────
// 테스트 데이터
// ─────────────────────────────────────────────

const SAMPLE_PROJECT = {
  id: "proj-abc",
  name: "Test Project",
  srt_path: "/uploads/test.srt",
  audio_path: "/uploads/test.mp3",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  status: "scened" as const,
  total_duration_ms: 9000,
};

const SAMPLE_BEATS = [
  { beat_index: 0, time_ms: 0, text: "첫 번째 자막입니다." },
  { beat_index: 1, time_ms: 3000, text: "두 번째 자막입니다." },
  { beat_index: 2, time_ms: 6000, text: "세 번째 자막입니다." },
];

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("Audio API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedReadJSON.mockReset();
    mockedGetProjectPath.mockReset();
    mockedGetProjectPath.mockImplementation(
      (projectId: string, fileName: string) =>
        `/data/${projectId}/${fileName}`
    );
  });

  // ═══════════════════════════════════════════
  // GET /api/projects/:projectId/audio - 파형 + 비트 마커
  // ═══════════════════════════════════════════
  describe("GET /api/projects/:projectId/audio", () => {
    it("프로젝트의 오디오 정보 (파형 + 비트 마커)를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT) // project.json
        .mockResolvedValueOnce(SAMPLE_BEATS);  // beats.json

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudio(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.project_id).toBe("proj-abc");
      expect(body.file_path).toBe("/uploads/test.mp3");
      expect(body.duration_ms).toBe(9000);
      expect(body.waveform_data).toBeDefined();
      expect(Array.isArray(body.waveform_data)).toBe(true);
      expect(body.waveform_data.length).toBeGreaterThan(0);
      // 파형 데이터는 0~1 범위
      body.waveform_data.forEach((v: number) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
      expect(body.beat_markers).toEqual(SAMPLE_BEATS);
    });

    it("beats.json이 없으면 빈 beat_markers를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT) // project.json
        .mockResolvedValueOnce(null);          // beats.json 없음

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudio(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.project_id).toBe("proj-abc");
      expect(body.beat_markers).toEqual([]);
      expect(body.waveform_data).toBeDefined();
      expect(Array.isArray(body.waveform_data)).toBe(true);
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null); // project.json 없음

      const req = createRequest("GET", "/api/projects/not-found/audio");
      const res = await getAudio(req, createProjectIdContext("not-found"));
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.error).toBeDefined();
    });

    it("audio_path가 없는 프로젝트는 404를 반환한다", async () => {
      const projectWithoutAudio = {
        ...SAMPLE_PROJECT,
        audio_path: "",
      };
      mockedReadJSON.mockResolvedValueOnce(projectWithoutAudio);

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudio(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.error).toBeDefined();
    });

    it("파형 데이터 크기는 duration에 비례한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT) // project.json (9000ms)
        .mockResolvedValueOnce(SAMPLE_BEATS);

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudio(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      // 샘플링 레이트: ~100 samples/sec -> 9초 = ~900 샘플
      // 허용 범위: 대략적으로 duration_ms 기반
      expect(body.waveform_data.length).toBeGreaterThanOrEqual(10);
    });

    it("내부 에러 시 500을 반환한다", async () => {
      mockedReadJSON.mockRejectedValueOnce(new Error("disk error"));

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudio(req, createProjectIdContext("proj-abc"));

      expect(res.status).toBe(500);
    });
  });

  // ═══════════════════════════════════════════
  // GET /api/projects/:projectId/audio/waveform - 파형 데이터만
  // ═══════════════════════════════════════════
  describe("GET /api/projects/:projectId/audio/waveform", () => {
    it("파형 데이터만 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(SAMPLE_PROJECT); // project.json

      const req = createRequest("GET", "/api/projects/proj-abc/audio/waveform");
      const res = await getWaveform(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.project_id).toBe("proj-abc");
      expect(body.duration_ms).toBe(9000);
      expect(body.waveform_data).toBeDefined();
      expect(Array.isArray(body.waveform_data)).toBe(true);
      expect(body.waveform_data.length).toBeGreaterThan(0);
      // beat_markers가 없어야 한다
      expect(body.beat_markers).toBeUndefined();
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/not-found/audio/waveform");
      const res = await getWaveform(req, createProjectIdContext("not-found"));

      expect(res.status).toBe(404);
    });

    it("audio_path가 없으면 404를 반환한다", async () => {
      const projectWithoutAudio = {
        ...SAMPLE_PROJECT,
        audio_path: "",
      };
      mockedReadJSON.mockResolvedValueOnce(projectWithoutAudio);

      const req = createRequest("GET", "/api/projects/proj-abc/audio/waveform");
      const res = await getWaveform(req, createProjectIdContext("proj-abc"));

      expect(res.status).toBe(404);
    });

    it("파형 데이터는 0~1 범위로 정규화되어 있다", async () => {
      mockedReadJSON.mockResolvedValueOnce(SAMPLE_PROJECT);

      const req = createRequest("GET", "/api/projects/proj-abc/audio/waveform");
      const res = await getWaveform(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      body.waveform_data.forEach((v: number) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    });

    it("내부 에러 시 500을 반환한다", async () => {
      mockedReadJSON.mockRejectedValueOnce(new Error("disk error"));

      const req = createRequest("GET", "/api/projects/proj-abc/audio/waveform");
      const res = await getWaveform(req, createProjectIdContext("proj-abc"));

      expect(res.status).toBe(500);
    });
  });
});
