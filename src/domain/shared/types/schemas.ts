// @TASK P0-T0.3 - Zod 스키마 (API 입력 검증용)
// @SPEC specs/shared/types.yaml

import { z } from "zod";

// ─────────────────────────────────────────────
// 공통 열거형 스키마
// ─────────────────────────────────────────────

export const ProjectStatusSchema = z.enum([
  "draft",
  "chunked",
  "scened",
  "rendered",
]);

export const LayoutFamilySchema = z.enum([
  "hero-center",
  "split-2col",
  "grid-4x3",
  "process-horizontal",
  "radial-focus",
  "stacked-vertical",
  "comparison-bars",
  "spotlight-case",
]);

export const RenderStatusSchema = z.enum([
  "pending",
  "rendering",
  "paused",
  "completed",
  "failed",
]);

export const LogLevelSchema = z.enum(["info", "warning", "error"]);

// ─────────────────────────────────────────────
// 공통 중첩 스키마
// ─────────────────────────────────────────────

export const CopyLayersSchema = z.object({
  kicker: z.string().nullable(),
  headline: z.string().min(1, "headline은 필수 항목입니다"),
  supporting: z.string().nullable(),
  footer_caption: z.string().nullable(),
});

export const MotionConfigSchema = z.object({
  entrance: z.string().min(1, "entrance 애니메이션은 필수입니다"),
  emphasis: z.string().nullable(),
  exit: z.string().nullable(),
  duration_ms: z
    .number()
    .int("duration_ms는 정수여야 합니다")
    .positive("duration_ms는 양수여야 합니다"),
});

export const AssetConfigSchema = z.object({
  svg_icons: z.array(z.string()),
  chart_type: z.string().nullable(),
  chart_data: z.record(z.unknown()).nullable(),
});

export const ChunkMetadataSchema = z.object({
  intent: z.string().min(1),
  tone: z.string().min(1),
  evidence_type: z.string().min(1),
  emphasis_tokens: z.array(z.string()),
  density: z.number().int().min(1).max(5),
  beat_count: z.number().int().nonnegative(),
});

export const SceneComponentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.unknown()),
});

export const LogEntrySchema = z.object({
  timestamp: z.string().min(1),
  level: LogLevelSchema,
  message: z.string().min(1),
});

// ─────────────────────────────────────────────
// ProjectCreateSchema
// POST /api/projects 입력 검증
// ─────────────────────────────────────────────

export const ProjectCreateSchema = z.object({
  name: z
    .string()
    .min(1, "프로젝트 이름은 필수입니다")
    .max(200, "프로젝트 이름은 200자 이하여야 합니다"),
  srt_path: z.string().min(1, "SRT 파일 경로는 필수입니다"),
  audio_path: z.string().min(1, "오디오 파일 경로는 필수입니다"),
});

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;

// ─────────────────────────────────────────────
// ProjectUpdateSchema
// PATCH /api/projects/:id 입력 검증
// ─────────────────────────────────────────────

export const ProjectUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "프로젝트 이름은 빈 문자열일 수 없습니다")
      .max(200, "프로젝트 이름은 200자 이하여야 합니다"),
    status: ProjectStatusSchema,
  })
  .partial();

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

// ─────────────────────────────────────────────
// SceneUpdateSchema
// PATCH /api/scenes/:id 입력 검증
// ─────────────────────────────────────────────

export const SceneUpdateSchema = z
  .object({
    layout_family: LayoutFamilySchema,
    copy_layers: CopyLayersSchema,
    motion: MotionConfigSchema,
    assets: AssetConfigSchema,
  })
  .partial();

export type SceneUpdateInput = z.infer<typeof SceneUpdateSchema>;

// ─────────────────────────────────────────────
// RenderJobCreateSchema
// POST /api/render-jobs 입력 검증
// ─────────────────────────────────────────────

export const RenderJobCreateSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
});

export type RenderJobCreateInput = z.infer<typeof RenderJobCreateSchema>;
