// @TASK P2-R1-T1 - Scenes API 테스트
// @SPEC docs/planning/05-api-spec.md#scenes

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
    randomUUID: vi.fn(() => "scene-new-uuid"),
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
import { GET as listScenes } from "@/app/api/projects/[projectId]/scenes/route";
import {
  GET as getScene,
  PUT as updateScene,
  DELETE as deleteScene,
} from "@/app/api/projects/[projectId]/scenes/[id]/route";
import { POST as splitScene } from "@/app/api/projects/[projectId]/scenes/[id]/split/route";
import { POST as mergeScenes } from "@/app/api/projects/[projectId]/scenes/merge/route";

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

function createSceneContext(projectId: string, id: string) {
  return { params: Promise.resolve({ projectId, id }) };
}

import type { Scene } from "@/types/index";

const SAMPLE_SCENE: Scene = {
  id: "scene-001",
  project_id: "proj-abc",
  beat_index: 0,
  layout_family: "hero-center",
  start_ms: 0,
  end_ms: 3000,
  duration_frames: 90, // Math.round((3000 - 0) / 1000 * 30)
  components: [
    { id: "comp-1", type: "text", props: { content: "Hello" } },
  ],
  copy_layers: {
    kicker: null,
    headline: "Opening Scene",
    supporting: "Welcome to the video",
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

const SAMPLE_SCENE_3: Scene = {
  id: "scene-003",
  project_id: "proj-abc",
  beat_index: 2,
  layout_family: "grid-4x3",
  start_ms: 6000,
  end_ms: 9000,
  duration_frames: 90,
  components: [],
  copy_layers: {
    kicker: null,
    headline: "Closing Scene",
    supporting: null,
    footer_caption: "Thank you",
  },
  motion: {
    entrance: "zoom-in",
    emphasis: null,
    exit: "fade-out",
    duration_ms: 400,
  },
  assets: {
    svg_icons: [],
    chart_type: null,
    chart_data: null,
  },
  chunk_metadata: {
    intent: "conclude",
    tone: "warm",
    evidence_type: "narrative",
    emphasis_tokens: [],
    density: 1,
    beat_count: 1,
  },
};

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

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("Scenes API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedReadJSON.mockReset();
    mockedWriteJSON.mockReset();
    mockedGetProjectPath.mockReset();
    mockedGetProjectPath.mockImplementation(
      (projectId: string, fileName: string) =>
        `/data/${projectId}/${fileName}`
    );
  });

  // ═══════════════════════════════════════════
  // GET /api/projects/:projectId/scenes - 장면 목록 조회
  // ═══════════════════════════════════════════
  describe("GET /api/projects/:projectId/scenes", () => {
    it("장면 목록을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT) // project.json
        .mockResolvedValueOnce([SAMPLE_SCENE, SAMPLE_SCENE_2]); // scenes.json

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await listScenes(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scenes).toHaveLength(2);
      expect(body.scenes[0].id).toBe("scene-001");
      expect(body.scenes[1].id).toBe("scene-002");
    });

    it("장면이 없으면 빈 배열을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(null); // scenes.json 없음

      const req = createRequest("GET", "/api/projects/proj-abc/scenes");
      const res = await listScenes(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scenes).toEqual([]);
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null); // project.json 없음

      const req = createRequest("GET", "/api/projects/not-found/scenes");
      const res = await listScenes(req, createProjectIdContext("not-found"));

      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════
  // GET /api/projects/:projectId/scenes/:id - 장면 상세 조회
  // ═══════════════════════════════════════════
  describe("GET /api/projects/:projectId/scenes/:id", () => {
    it("존재하는 장면을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE, SAMPLE_SCENE_2]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes/scene-001");
      const res = await getScene(req, createSceneContext("proj-abc", "scene-001"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.id).toBe("scene-001");
      expect(body.layout_family).toBe("hero-center");
    });

    it("존재하지 않는 장면은 404를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("GET", "/api/projects/proj-abc/scenes/not-found");
      const res = await getScene(req, createSceneContext("proj-abc", "not-found"));

      expect(res.status).toBe(404);
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null);

      const req = createRequest("GET", "/api/projects/not-found/scenes/scene-001");
      const res = await getScene(req, createSceneContext("not-found", "scene-001"));

      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════
  // PUT /api/projects/:projectId/scenes/:id - 장면 수정 (DSL 편집)
  // ═══════════════════════════════════════════
  describe("PUT /api/projects/:projectId/scenes/:id", () => {
    it("layout_family를 수정한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("PUT", "/api/projects/proj-abc/scenes/scene-001", {
        layout_family: "split-2col",
      });

      const res = await updateScene(req, createSceneContext("proj-abc", "scene-001"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.layout_family).toBe("split-2col");
      expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
    });

    it("copy_layers를 수정한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);
      mockedWriteJSON.mockResolvedValue(undefined);

      const newCopyLayers = {
        kicker: "Updated",
        headline: "New Headline",
        supporting: "New supporting text",
        footer_caption: null,
      };

      const req = createRequest("PUT", "/api/projects/proj-abc/scenes/scene-001", {
        copy_layers: newCopyLayers,
      });

      const res = await updateScene(req, createSceneContext("proj-abc", "scene-001"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.copy_layers.headline).toBe("New Headline");
    });

    it("motion을 수정한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("PUT", "/api/projects/proj-abc/scenes/scene-001", {
        motion: {
          entrance: "slide-right",
          emphasis: "pulse",
          exit: null,
          duration_ms: 700,
        },
      });

      const res = await updateScene(req, createSceneContext("proj-abc", "scene-001"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.motion.entrance).toBe("slide-right");
    });

    it("잘못된 layout_family는 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest("PUT", "/api/projects/proj-abc/scenes/scene-001", {
        layout_family: "invalid-layout",
      });

      const res = await updateScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });

    it("존재하지 않는 장면은 404를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("PUT", "/api/projects/proj-abc/scenes/not-found", {
        layout_family: "split-2col",
      });

      const res = await updateScene(req, createSceneContext("proj-abc", "not-found"));
      expect(res.status).toBe(404);
    });

    it("잘못된 JSON은 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = new NextRequest(
        new URL("/api/projects/proj-abc/scenes/scene-001", "http://localhost:3000"),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: "invalid-json",
        }
      );

      const res = await updateScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════
  // DELETE /api/projects/:projectId/scenes/:id - 장면 삭제
  // ═══════════════════════════════════════════
  describe("DELETE /api/projects/:projectId/scenes/:id", () => {
    it("장면을 삭제하고 beat_index를 재정렬한다", async () => {
      const scenes = [
        { ...SAMPLE_SCENE, beat_index: 0 },
        { ...SAMPLE_SCENE_2, beat_index: 1 },
        { ...SAMPLE_SCENE_3, beat_index: 2 },
      ];
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(scenes);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest("DELETE", "/api/projects/proj-abc/scenes/scene-002");
      const res = await deleteScene(req, createSceneContext("proj-abc", "scene-002"));

      expect(res.status).toBe(204);

      // writeJSON에 전달된 scenes 배열 검증
      const writtenScenes = mockedWriteJSON.mock.calls[0][1] as Scene[];
      expect(writtenScenes).toHaveLength(2);
      expect(writtenScenes[0].id).toBe("scene-001");
      expect(writtenScenes[0].beat_index).toBe(0);
      expect(writtenScenes[1].id).toBe("scene-003");
      expect(writtenScenes[1].beat_index).toBe(1); // 재정렬됨
    });

    it("존재하지 않는 장면은 404를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest("DELETE", "/api/projects/proj-abc/scenes/not-found");
      const res = await deleteScene(req, createSceneContext("proj-abc", "not-found"));

      expect(res.status).toBe(404);
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null);

      const req = createRequest("DELETE", "/api/projects/not-found/scenes/scene-001");
      const res = await deleteScene(req, createSceneContext("not-found", "scene-001"));

      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════
  // POST /api/projects/:projectId/scenes/:id/split - 장면 분할
  // ═══════════════════════════════════════════
  describe("POST /api/projects/:projectId/scenes/:id/split", () => {
    it("장면을 시간 기준으로 두 장면으로 분할한다", async () => {
      // scene-001: 0ms ~ 3000ms 를 1500ms 기준으로 분할
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }, { ...SAMPLE_SCENE_2 }]);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        { split_ms: 1500 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scenes).toHaveLength(2);

      // 첫 번째 분할 장면: 0ms ~ 1500ms
      expect(body.scenes[0].start_ms).toBe(0);
      expect(body.scenes[0].end_ms).toBe(1500);
      expect(body.scenes[0].duration_frames).toBe(Math.round(1500 / 1000 * 30)); // 45
      expect(body.scenes[0].beat_index).toBe(0);

      // 두 번째 분할 장면: 1500ms ~ 3000ms
      expect(body.scenes[1].start_ms).toBe(1500);
      expect(body.scenes[1].end_ms).toBe(3000);
      expect(body.scenes[1].duration_frames).toBe(Math.round(1500 / 1000 * 30)); // 45
      expect(body.scenes[1].beat_index).toBe(1);

      // 이후 장면의 beat_index가 재정렬됨
      const writtenScenes = mockedWriteJSON.mock.calls[0][1] as Scene[];
      expect(writtenScenes).toHaveLength(3); // 2 (분할) + 1 (scene-002)
      expect(writtenScenes[2].id).toBe("scene-002");
      expect(writtenScenes[2].beat_index).toBe(2); // 재정렬됨
    });

    it("split_ms가 start_ms보다 작으면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        { split_ms: -100 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });

    it("split_ms가 end_ms보다 크면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        { split_ms: 5000 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });

    it("split_ms가 start_ms와 같으면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        { split_ms: 0 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });

    it("split_ms가 end_ms와 같으면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        { split_ms: 3000 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });

    it("존재하지 않는 장면은 404를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/not-found/split",
        { split_ms: 1500 }
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "not-found"));
      expect(res.status).toBe(404);
    });

    it("split_ms가 누락되면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([{ ...SAMPLE_SCENE }]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/scene-001/split",
        {}
      );

      const res = await splitScene(req, createSceneContext("proj-abc", "scene-001"));
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════
  // POST /api/projects/:projectId/scenes/merge - 장면 병합
  // ═══════════════════════════════════════════
  describe("POST /api/projects/:projectId/scenes/merge", () => {
    it("연속된 두 장면을 하나로 병합한다", async () => {
      const scenes = [
        { ...SAMPLE_SCENE },   // 0-3000
        { ...SAMPLE_SCENE_2 }, // 3000-6000
        { ...SAMPLE_SCENE_3 }, // 6000-9000
      ];
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(scenes);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        { scene_ids: ["scene-001", "scene-002"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scene).toBeDefined();
      expect(body.scene.start_ms).toBe(0);
      expect(body.scene.end_ms).toBe(6000);
      expect(body.scene.duration_frames).toBe(Math.round(6000 / 1000 * 30)); // 180
      expect(body.scene.beat_index).toBe(0);

      // 전체 scenes 배열 검증
      const writtenScenes = mockedWriteJSON.mock.calls[0][1] as Scene[];
      expect(writtenScenes).toHaveLength(2); // 1 (병합) + 1 (scene-003)
      expect(writtenScenes[1].id).toBe("scene-003");
      expect(writtenScenes[1].beat_index).toBe(1); // 재정렬됨
    });

    it("3개 장면을 하나로 병합한다", async () => {
      const scenes = [
        { ...SAMPLE_SCENE },   // 0-3000
        { ...SAMPLE_SCENE_2 }, // 3000-6000
        { ...SAMPLE_SCENE_3 }, // 6000-9000
      ];
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(scenes);
      mockedWriteJSON.mockResolvedValue(undefined);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        { scene_ids: ["scene-001", "scene-002", "scene-003"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.scene.start_ms).toBe(0);
      expect(body.scene.end_ms).toBe(9000);
      expect(body.scene.duration_frames).toBe(Math.round(9000 / 1000 * 30)); // 270
    });

    it("비연속 장면은 400을 반환한다", async () => {
      const scenes = [
        { ...SAMPLE_SCENE },   // 0-3000, beat_index: 0
        { ...SAMPLE_SCENE_2 }, // 3000-6000, beat_index: 1
        { ...SAMPLE_SCENE_3 }, // 6000-9000, beat_index: 2
      ];
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce(scenes);

      // scene-001과 scene-003은 비연속 (scene-002가 중간에 있음)
      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        { scene_ids: ["scene-001", "scene-003"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      expect(res.status).toBe(400);
    });

    it("scene_ids가 1개 이하면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        { scene_ids: ["scene-001"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      expect(res.status).toBe(400);
    });

    it("존재하지 않는 scene_id가 있으면 404를 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        { scene_ids: ["scene-001", "not-found"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      expect(res.status).toBe(404);
    });

    it("scene_ids가 누락되면 400을 반환한다", async () => {
      mockedReadJSON
        .mockResolvedValueOnce(SAMPLE_PROJECT)
        .mockResolvedValueOnce([SAMPLE_SCENE]);

      const req = createRequest(
        "POST",
        "/api/projects/proj-abc/scenes/merge",
        {}
      );

      const res = await mergeScenes(req, createProjectIdContext("proj-abc"));
      expect(res.status).toBe(400);
    });

    it("프로젝트가 없으면 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValueOnce(null);

      const req = createRequest(
        "POST",
        "/api/projects/not-found/scenes/merge",
        { scene_ids: ["scene-001", "scene-002"] }
      );

      const res = await mergeScenes(req, createProjectIdContext("not-found"));
      expect(res.status).toBe(404);
    });
  });
});
