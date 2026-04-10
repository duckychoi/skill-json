// Shared Types - specs/shared/types.yaml 기반
// P0-T0.3에서 완성 예정 (현재는 스캐폴드)

export type ProjectStatus = "draft" | "chunked" | "scened" | "rendered";

export type LayoutFamily =
  | "hero-center"
  | "split-2col"
  | "grid-4x3"
  | "process-horizontal"
  | "radial-focus"
  | "stacked-vertical"
  | "comparison-bars"
  | "spotlight-case"
  | "donut-metric"
  | "big-number"
  | "quote-highlight";

export type RenderStatus = "pending" | "rendering" | "paused" | "completed" | "failed";

export type LogLevel = "info" | "warning" | "error";

export interface Project {
  id: string;
  name: string;
  srt_path: string;
  audio_path: string;
  created_at: string;
  updated_at: string;
  status: ProjectStatus;
  total_duration_ms: number;
}

export interface CopyLayers {
  kicker: string | null;
  headline: string;
  supporting: string | null;
  footer_caption: string | null;
}

export interface ChunkMetadata {
  intent: string;
  tone: string;
  evidence_type: string;
  emphasis_tokens: string[];
  density: number;
  beat_count: number;
}

export interface SceneComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface MotionConfig {
  entrance: string;
  emphasis: string | null;
  exit: string | null;
  duration_ms: number;
}

export interface AssetConfig {
  svg_icons: string[];
  chart_type: string | null;
  chart_data: Record<string, unknown> | null;
}

export interface Scene {
  id: string;
  project_id: string;
  beat_index: number;
  layout_family: LayoutFamily;
  start_ms: number;
  end_ms: number;
  duration_frames: number;
  components: SceneComponent[];
  copy_layers: CopyLayers;
  motion: MotionConfig;
  assets: AssetConfig;
  chunk_metadata: ChunkMetadata;
  /** 나레이션 텍스트 (하단 자막 표시용) */
  narration?: string;
  /** 개별 자막 엔트리 (시간 기반 표시용) */
  subtitles?: Array<{ startTime: number; endTime: number; text: string }>;
  /** 스택 노드 트리 (설정 시 layout_family 대신 StackRenderer 사용) */
  stack_root?: import("./stack-nodes").StackNode;
}

export interface BeatMarker {
  beat_index: number;
  time_ms: number;
  text: string;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface RenderJob {
  id: string;
  project_id: string;
  status: RenderStatus;
  total_frames: number;
  rendered_frames: number;
  started_at: string;
  completed_at: string | null;
  output_path: string | null;
  file_size: number | null;
  logs: LogEntry[];
  current_scene: string | null;
}
