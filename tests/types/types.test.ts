// @TASK P0-T0.3 - TypeScript 타입/인터페이스 + Zod 스키마 테스트
// @SPEC specs/shared/types.yaml

import { describe, it, expect } from "vitest";
import {
  ProjectCreateSchema,
  ProjectUpdateSchema,
  SceneUpdateSchema,
  RenderJobCreateSchema,
} from "@/types/schemas";
import type {
  Project,
  Scene,
  RenderJob,
  CopyLayers,
  ChunkMetadata,
  MotionConfig,
  AssetConfig,
  SceneComponent,
  BeatMarker,
  LogEntry,
} from "@/types/index";

// ─────────────────────────────────────────────
// ProjectCreateSchema
// ─────────────────────────────────────────────

describe("ProjectCreateSchema", () => {
  it("유효한 입력을 수용한다", () => {
    const input = {
      name: "My Video Project",
      srt_path: "/uploads/subtitle.srt",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("name이 빈 문자열이면 실패한다", () => {
    const input = {
      name: "",
      srt_path: "/uploads/subtitle.srt",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("name이 누락되면 실패한다", () => {
    const input = {
      srt_path: "/uploads/subtitle.srt",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("srt_path가 누락되면 실패한다", () => {
    const input = {
      name: "My Video Project",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("audio_path가 누락되면 실패한다", () => {
    const input = {
      name: "My Video Project",
      srt_path: "/uploads/subtitle.srt",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("name이 200자를 초과하면 실패한다", () => {
    const input = {
      name: "a".repeat(201),
      srt_path: "/uploads/subtitle.srt",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("name이 200자이면 성공한다", () => {
    const input = {
      name: "a".repeat(200),
      srt_path: "/uploads/subtitle.srt",
      audio_path: "/uploads/audio.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("파싱 결과에 올바른 데이터가 포함된다", () => {
    const input = {
      name: "Test Project",
      srt_path: "/uploads/test.srt",
      audio_path: "/uploads/test.mp3",
    };
    const result = ProjectCreateSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Test Project");
      expect(result.data.srt_path).toBe("/uploads/test.srt");
      expect(result.data.audio_path).toBe("/uploads/test.mp3");
    }
  });
});

// ─────────────────────────────────────────────
// ProjectUpdateSchema
// ─────────────────────────────────────────────

describe("ProjectUpdateSchema", () => {
  it("빈 객체도 수용한다 (모든 필드 optional)", () => {
    const result = ProjectUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("name만 업데이트할 수 있다", () => {
    const result = ProjectUpdateSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Updated Name");
    }
  });

  it("status만 업데이트할 수 있다", () => {
    const result = ProjectUpdateSchema.safeParse({ status: "rendered" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("rendered");
    }
  });

  it("유효하지 않은 status 값은 실패한다", () => {
    const result = ProjectUpdateSchema.safeParse({ status: "invalid-status" });
    expect(result.success).toBe(false);
  });

  it("모든 status 열거형 값을 수용한다", () => {
    const statuses = ["draft", "chunked", "scened", "rendered"] as const;
    for (const status of statuses) {
      const result = ProjectUpdateSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("name이 빈 문자열이면 실패한다", () => {
    const result = ProjectUpdateSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("name이 200자를 초과하면 실패한다", () => {
    const result = ProjectUpdateSchema.safeParse({ name: "a".repeat(201) });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// SceneUpdateSchema
// ─────────────────────────────────────────────

describe("SceneUpdateSchema", () => {
  it("빈 객체도 수용한다 (모든 필드 optional)", () => {
    const result = SceneUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("layout_family만 업데이트할 수 있다", () => {
    const result = SceneUpdateSchema.safeParse({ layout_family: "hero-center" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.layout_family).toBe("hero-center");
    }
  });

  it("유효하지 않은 layout_family는 실패한다", () => {
    const result = SceneUpdateSchema.safeParse({ layout_family: "invalid-layout" });
    expect(result.success).toBe(false);
  });

  it("모든 layout_family 열거형 값을 수용한다", () => {
    const layouts = [
      "hero-center",
      "split-2col",
      "grid-4x3",
      "process-horizontal",
      "radial-focus",
      "stacked-vertical",
      "comparison-bars",
      "spotlight-case",
    ] as const;
    for (const layout of layouts) {
      const result = SceneUpdateSchema.safeParse({ layout_family: layout });
      expect(result.success).toBe(true);
    }
  });

  it("copy_layers를 업데이트할 수 있다", () => {
    const result = SceneUpdateSchema.safeParse({
      copy_layers: {
        headline: "Updated Headline",
        kicker: null,
        supporting: "Supporting text",
        footer_caption: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it("copy_layers.headline이 누락되면 실패한다", () => {
    const result = SceneUpdateSchema.safeParse({
      copy_layers: {
        kicker: null,
        supporting: null,
        footer_caption: null,
      },
    });
    expect(result.success).toBe(false);
  });

  it("copy_layers.headline이 빈 문자열이면 실패한다", () => {
    const result = SceneUpdateSchema.safeParse({
      copy_layers: {
        headline: "",
        kicker: null,
        supporting: null,
        footer_caption: null,
      },
    });
    expect(result.success).toBe(false);
  });

  it("motion 설정을 업데이트할 수 있다", () => {
    const result = SceneUpdateSchema.safeParse({
      motion: {
        entrance: "fade-in",
        emphasis: null,
        exit: "slide-up",
        duration_ms: 300,
      },
    });
    expect(result.success).toBe(true);
  });

  it("motion.duration_ms가 음수이면 실패한다", () => {
    const result = SceneUpdateSchema.safeParse({
      motion: {
        entrance: "fade-in",
        emphasis: null,
        exit: null,
        duration_ms: -100,
      },
    });
    expect(result.success).toBe(false);
  });

  it("motion.duration_ms가 0이면 실패한다", () => {
    const result = SceneUpdateSchema.safeParse({
      motion: {
        entrance: "fade-in",
        emphasis: null,
        exit: null,
        duration_ms: 0,
      },
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// RenderJobCreateSchema
// ─────────────────────────────────────────────

describe("RenderJobCreateSchema", () => {
  it("유효한 입력을 수용한다", () => {
    const input = {
      project_id: "proj-123",
    };
    const result = RenderJobCreateSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("project_id가 누락되면 실패한다", () => {
    const result = RenderJobCreateSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("project_id가 빈 문자열이면 실패한다", () => {
    const result = RenderJobCreateSchema.safeParse({ project_id: "" });
    expect(result.success).toBe(false);
  });

  it("파싱 결과에 올바른 project_id가 포함된다", () => {
    const input = { project_id: "proj-abc-123" };
    const result = RenderJobCreateSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.project_id).toBe("proj-abc-123");
    }
  });
});

// ─────────────────────────────────────────────
// 타입 호환성 테스트 (컴파일 타임 검증)
// ─────────────────────────────────────────────

describe("타입 호환성", () => {
  it("Project 타입이 올바른 구조를 갖는다", () => {
    const project: Project = {
      id: "proj-1",
      name: "Test Project",
      srt_path: "/test.srt",
      audio_path: "/test.mp3",
      created_at: "2026-03-10T00:00:00Z",
      updated_at: "2026-03-10T00:00:00Z",
      status: "draft",
      total_duration_ms: 60000,
    };
    expect(project.id).toBe("proj-1");
    expect(project.status).toBe("draft");
  });

  it("Scene 타입이 올바른 구조를 갖는다", () => {
    const scene: Scene = {
      id: "scene-1",
      project_id: "proj-1",
      beat_index: 0,
      layout_family: "hero-center",
      start_ms: 0,
      end_ms: 3000,
      duration_frames: 90,
      components: [],
      copy_layers: {
        kicker: null,
        headline: "Main Headline",
        supporting: null,
        footer_caption: null,
      },
      motion: {
        entrance: "fade-in",
        emphasis: null,
        exit: null,
        duration_ms: 300,
      },
      assets: {
        svg_icons: [],
        chart_type: null,
        chart_data: null,
      },
      chunk_metadata: {
        intent: "inform",
        tone: "neutral",
        evidence_type: "statistic",
        emphasis_tokens: ["key", "point"],
        density: 3,
        beat_count: 2,
      },
    };
    expect(scene.layout_family).toBe("hero-center");
    expect(scene.copy_layers.headline).toBe("Main Headline");
  });

  it("RenderJob 타입이 올바른 구조를 갖는다", () => {
    const renderJob: RenderJob = {
      id: "job-1",
      project_id: "proj-1",
      status: "pending",
      total_frames: 900,
      rendered_frames: 0,
      started_at: "2026-03-10T00:00:00Z",
      completed_at: null,
      output_path: null,
      file_size: null,
      logs: [],
      current_scene: null,
    };
    expect(renderJob.status).toBe("pending");
    expect(renderJob.completed_at).toBeNull();
  });

  it("LogEntry 타입이 올바른 level 값을 갖는다", () => {
    const logEntry: LogEntry = {
      timestamp: "2026-03-10T00:00:00Z",
      level: "info",
      message: "Render started",
    };
    expect(logEntry.level).toBe("info");
  });

  it("BeatMarker 타입이 올바른 구조를 갖는다", () => {
    const beatMarker: BeatMarker = {
      beat_index: 0,
      time_ms: 1000,
      text: "First beat",
    };
    expect(beatMarker.beat_index).toBe(0);
  });

  it("SceneComponent 타입이 올바른 구조를 갖는다", () => {
    const component: SceneComponent = {
      id: "comp-1",
      type: "text",
      props: { content: "Hello", fontSize: 24 },
    };
    expect(component.type).toBe("text");
  });
});
