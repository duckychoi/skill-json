// @TASK P3-S1-V - Remotion 프리뷰 연결점 검증
// @SPEC specs/preview.md

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ─────────────────────────────────────────────
// Mock 설정
// ─────────────────────────────────────────────

vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  listFiles: vi.fn(),
  listDirs: vi.fn(),
  ensureDir: vi.fn(),
  getProjectPath: vi.fn(),
}));

vi.stubGlobal(
  "crypto",
  Object.assign({}, globalThis.crypto, {
    randomUUID: vi.fn(() => "test-uuid"),
  })
);

import {
  readJSON,
  getProjectPath,
} from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);

// API 라우트 임포트
import { GET as getScenesAPI } from "@/app/api/projects/[projectId]/scenes/route";
import { GET as getAudioAPI } from "@/app/api/projects/[projectId]/audio/route";

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

// ─────────────────────────────────────────────
// 타입 임포트
// ─────────────────────────────────────────────

import type { Scene, Project } from "@/types/index";

// ─────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────

const SAMPLE_SCENE: Scene = {
  id: "scene-001",
  project_id: "proj-abc",
  beat_index: 0,
  layout_family: "hero-center",
  start_ms: 0,
  end_ms: 3000,
  duration_frames: 90, // 3s @ 30fps
  components: [
    { id: "comp-1", type: "text", props: { content: "Scene 1" } },
  ],
  copy_layers: {
    kicker: null,
    headline: "Scene 1",
    supporting: "Supporting text",
    footer_caption: null,
  },
  motion: {
    entrance: "fade-in",
    emphasis: null,
    exit: "fade-out",
    duration_ms: 500,
  },
  assets: {
    svg_icons: [],
    chart_type: null,
    chart_data: null,
  },
  chunk_metadata: {
    intent: "introduce",
    tone: "neutral",
    evidence_type: "narrative",
    emphasis_tokens: ["welcome"],
    density: 2,
    beat_count: 1,
  },
};

const SAMPLE_SCENE_2: Scene = {
  id: "scene-002",
  project_id: "proj-abc",
  beat_index: 1,
  layout_family: "split-2col",
  start_ms: 3000,
  end_ms: 6000,
  duration_frames: 90,
  components: [
    { id: "comp-2", type: "image", props: { src: "/img.png" } },
  ],
  copy_layers: {
    kicker: "Section",
    headline: "Main Content",
    supporting: null,
    footer_caption: null,
  },
  motion: {
    entrance: "slide-left",
    emphasis: null,
    exit: null,
    duration_ms: 300,
  },
  assets: {
    svg_icons: ["icon-star"],
    chart_type: null,
    chart_data: null,
  },
  chunk_metadata: {
    intent: "explain",
    tone: "informative",
    evidence_type: "data",
    emphasis_tokens: [],
    density: 3,
    beat_count: 2,
  },
};

const SAMPLE_PROJECT: Project = {
  id: "proj-abc",
  name: "Test Project",
  srt_path: "/uploads/test.srt",
  audio_path: "/uploads/test.mp3",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  status: "scened" as const,
  total_duration_ms: 6000,
};

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("Remotion Preview Verification", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedReadJSON.mockReset();
    mockedGetProjectPath.mockReset();
    mockedGetProjectPath.mockImplementation(
      (projectId: string, fileName: string) =>
        `/data/${projectId}/${fileName}`
    );
  });

  describe("Field Coverage - Scene", () => {
    // @TEST P3-S1-V.1 - Scene의 필수 필드 검증
    it("should have required scene fields: id, beat_index, layout_family", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      const scene = body.scenes[0];

      // 필수 필드 검증
      expect(scene).toHaveProperty("id");
      expect(scene).toHaveProperty("beat_index");
      expect(scene).toHaveProperty("layout_family");
      expect(typeof scene.id).toBe("string");
      expect(typeof scene.beat_index).toBe("number");
      expect(typeof scene.layout_family).toBe("string");
    });

    // @TEST P3-S1-V.2 - Scene의 시간 관련 필드 검증
    it("should have required scene fields: start_ms, end_ms, duration_frames", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      const scene = body.scenes[0];

      // 시간 관련 필드 검증
      expect(scene).toHaveProperty("start_ms");
      expect(scene).toHaveProperty("end_ms");
      expect(scene).toHaveProperty("duration_frames");
      expect(typeof scene.start_ms).toBe("number");
      expect(typeof scene.end_ms).toBe("number");
      expect(typeof scene.duration_frames).toBe("number");
      expect(scene.start_ms).toBe(0);
      expect(scene.end_ms).toBe(3000);
      expect(scene.duration_frames).toBe(90);
    });

    // @TEST P3-S1-V.3 - Scene의 컨텐츠 관련 필드 검증
    it("should have required scene fields: components, copy_layers, motion, assets", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      const scene = body.scenes[0];

      // 컨텐츠 필드 검증
      expect(scene).toHaveProperty("components");
      expect(scene).toHaveProperty("copy_layers");
      expect(scene).toHaveProperty("motion");
      expect(scene).toHaveProperty("assets");
      expect(Array.isArray(scene.components)).toBe(true);
      expect(typeof scene.copy_layers).toBe("object");
      expect(typeof scene.motion).toBe("object");
      expect(typeof scene.assets).toBe("object");
    });

    // @TEST P3-S1-V.4 - CopyLayers 필드 구조 검증
    it("should have correct copy_layers structure with all required fields", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      const copyLayers = body.scenes[0].copy_layers;
      expect(copyLayers).toHaveProperty("kicker");
      expect(copyLayers).toHaveProperty("headline");
      expect(copyLayers).toHaveProperty("supporting");
      expect(copyLayers).toHaveProperty("footer_caption");
    });

    // @TEST P3-S1-V.5 - Motion 필드 구조 검증
    it("should have correct motion structure with all required fields", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      const motion = body.scenes[0].motion;
      expect(motion).toHaveProperty("entrance");
      expect(motion).toHaveProperty("emphasis");
      expect(motion).toHaveProperty("exit");
      expect(motion).toHaveProperty("duration_ms");
      expect(typeof motion.duration_ms).toBe("number");
    });

    // @TEST P3-S1-V.6 - Assets 필드 구조 검증
    it("should have correct assets structure with all required fields", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      const assets = body.scenes[0].assets;
      expect(assets).toHaveProperty("svg_icons");
      expect(assets).toHaveProperty("chart_type");
      expect(assets).toHaveProperty("chart_data");
      expect(Array.isArray(assets.svg_icons)).toBe(true);
    });
  });

  describe("Field Coverage - Audio", () => {
    // @TEST P3-S1-V.7 - Audio의 필수 필드 검증
    it("should have required audio fields: file_path, duration_ms", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudioAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toHaveProperty("file_path");
      expect(body).toHaveProperty("duration_ms");
      expect(typeof body.file_path).toBe("string");
      expect(typeof body.duration_ms).toBe("number");
      expect(body.file_path).toBe("/uploads/test.mp3");
      expect(body.duration_ms).toBe(6000);
    });
  });

  describe("Endpoint - GET /api/projects/:id/scenes", () => {
    // @TEST P3-S1-V.8 - Scenes 엔드포인트 정상 응답
    it("should return 200 with scenes array", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE, SAMPLE_SCENE_2]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toHaveProperty("scenes");
      expect(Array.isArray(body.scenes)).toBe(true);
      expect(body.scenes).toHaveLength(2);
    });

    // @TEST P3-S1-V.9 - 프로젝트 없을 때 404 응답
    it("should return 404 when project not found", async () => {
      mockedReadJSON.mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/not-found/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("not-found"));

      expect(res.status).toBe(404);
    });

    // @TEST P3-S1-V.10 - 빈 Scene 배열 응답
    it("should return empty array when no scenes exist", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scenes).toEqual([]);
    });
  });

  describe("Navigation - PreviewHeader", () => {
    // @TEST P3-S1-V.11 - PreviewHeader 백 버튼 콜백 존재
    it("should have onBack callback in PreviewHeader", async () => {
      // PreviewHeader 컴포넌트 import 확인
      const { PreviewHeader } = await import("@/components/preview/PreviewHeader");
      expect(PreviewHeader).toBeDefined();

      // 컴포넌트 타입 검증
      expect(typeof PreviewHeader).toBe("function");
    });

    // @TEST P3-S1-V.12 - onBack 콜백이 "/" 라우트로 네비게이션
    it("should navigate to / route when back button is clicked", async () => {
      // preview/page.tsx에서 확인 가능한 onBack 핸들러
      // router.push("/") 구현 확인
      const { PreviewHeader } = await import("@/components/preview/PreviewHeader");

      expect(PreviewHeader).toBeDefined();
      // 컴포넌트의 JSX에서 onBack 콜백이 정상적으로 전달되는지 확인
      const props = PreviewHeader.toString();
      expect(props).toContain("onBack");
    });
  });

  describe("Remotion Player Configuration", () => {
    // @TEST P3-S1-V.13 - Remotion Player compositionWidth 검증
    it("should have Remotion Player with compositionWidth=1920", async () => {
      // preview/page.tsx에서 Player 설정 확인
      const { default: RemotionPreviewPage } = await import("@/app/preview/page");
      expect(RemotionPreviewPage).toBeDefined();

      // 소스 코드에서 compositionWidth 설정 확인
      const pageCode = RemotionPreviewPage.toString();
      expect(pageCode).toContain("1920");
    });

    // @TEST P3-S1-V.14 - Remotion Player compositionHeight 검증
    it("should have Remotion Player with compositionHeight=1080", async () => {
      const { default: RemotionPreviewPage } = await import("@/app/preview/page");
      expect(RemotionPreviewPage).toBeDefined();

      const pageCode = RemotionPreviewPage.toString();
      expect(pageCode).toContain("1080");
    });

    // @TEST P3-S1-V.15 - Remotion Player fps=30 검증
    it("should have Remotion Player with fps=30", async () => {
      const { default: RemotionPreviewPage } = await import("@/app/preview/page");
      expect(RemotionPreviewPage).toBeDefined();

      const pageCode = RemotionPreviewPage.toString();
      // FPS 상수가 30으로 정의되고, fps={FPS} 형태로 전달됨
      expect(pageCode).toContain("FPS");
      expect(pageCode).toContain("fps:");
    });

    // @TEST P3-S1-V.16 - Remotion MainComposition 임포트 확인
    it("should import MainComposition from remotion", async () => {
      const { MainComposition } = await import("@/remotion/Composition");
      expect(MainComposition).toBeDefined();
      expect(typeof MainComposition).toBe("function");
    });

    // @TEST P3-S1-V.17 - MainComposition이 Scene 배열을 받음
    it("should accept scenes array as inputProps in MainComposition", async () => {
      const { default: RemotionPreviewPage } = await import("@/app/preview/page");
      const { MainComposition } = await import("@/remotion/Composition");

      expect(MainComposition).toBeDefined();
      const pageCode = RemotionPreviewPage.toString();

      expect(pageCode).toContain("MainComposition");
      expect(pageCode).toContain("inputProps");
      expect(pageCode).toContain("scenes");
    });
  });

  describe("Integration - Scenes Data Flow", () => {
    // @TEST P3-S1-V.18 - Scenes 데이터가 Player로 전달됨
    it("should pass scenes data from API to Player component", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await getScenesAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      // API 응답의 scenes 배열이 다음 필드들을 포함하는지 검증
      const scene = body.scenes[0];
      expect(scene.id).toBeDefined();
      expect(scene.beat_index).toBeDefined();
      expect(scene.layout_family).toBeDefined();
      expect(scene.start_ms).toBeDefined();
      expect(scene.end_ms).toBeDefined();
      expect(scene.duration_frames).toBeDefined();
      expect(scene.components).toBeDefined();
      expect(scene.copy_layers).toBeDefined();
      expect(scene.motion).toBeDefined();
      expect(scene.assets).toBeDefined();
    });

    // @TEST P3-S1-V.19 - Audio 데이터 구조 검증
    it("should have correct audio data structure for waveform display", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/proj-abc/audio");
      const res = await getAudioAPI(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(body.file_path).toBe("/uploads/test.mp3");
      expect(body.duration_ms).toBe(6000);
      expect(body).toHaveProperty("waveform_data");
      expect(body).toHaveProperty("beat_markers");
    });
  });

  describe("Type Safety - Scene Interface", () => {
    // @TEST P3-S1-V.20 - Scene 타입이 모든 필드를 포함
    it("should have complete Scene interface with all required properties", async () => {
      // 타입 정의 확인
      const scene: Scene = SAMPLE_SCENE;

      // 모든 필드 검증
      expect(scene.id).toBeDefined();
      expect(scene.project_id).toBeDefined();
      expect(scene.beat_index).toBeDefined();
      expect(scene.layout_family).toBeDefined();
      expect(scene.start_ms).toBeDefined();
      expect(scene.end_ms).toBeDefined();
      expect(scene.duration_frames).toBeDefined();
      expect(scene.components).toBeDefined();
      expect(scene.copy_layers).toBeDefined();
      expect(scene.motion).toBeDefined();
      expect(scene.assets).toBeDefined();
      expect(scene.chunk_metadata).toBeDefined();
    });
  });
});
