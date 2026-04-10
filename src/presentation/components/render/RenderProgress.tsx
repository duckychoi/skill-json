// @TASK P3-S2-T1 - 렌더 출력 UI - RenderProgress
// @SPEC specs/render-output.md

"use client";

import { cn } from "@/lib/utils";
import type { RenderJob } from "@/types";

export interface RenderProgressProps {
  job: RenderJob;
  onPause: () => void;
  onCancel: () => void;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}초`;
  }
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}분 ${remaining}초`;
}

function estimateRemainingSeconds(job: RenderJob): number | null {
  if (job.rendered_frames === 0) return null;
  const elapsedMs =
    new Date().getTime() - new Date(job.started_at).getTime();
  const framesPerMs = job.rendered_frames / elapsedMs;
  const remainingFrames = job.total_frames - job.rendered_frames;
  if (framesPerMs <= 0) return null;
  return remainingFrames / framesPerMs / 1000;
}

const isActive = (status: RenderJob["status"]) =>
  status === "rendering" || status === "pending" || status === "paused";

export function RenderProgress({ job, onPause, onCancel }: RenderProgressProps) {
  const percent =
    job.total_frames > 0
      ? Math.round((job.rendered_frames / job.total_frames) * 100)
      : 0;

  const remainingSec = estimateRemainingSeconds(job);
  const active = isActive(job.status);

  return (
    <section
      className="flex flex-col gap-4 p-6 bg-surface rounded-xl border border-surface-border"
      aria-label="렌더 진행률"
    >
      {/* 진행률 바 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/60">진행률</span>
          <span className="font-mono font-semibold text-foreground">
            {percent}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`렌더 진행률 ${percent}%`}
          className="w-full h-2.5 bg-surface-border rounded-full overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              job.status === "failed"
                ? "bg-red-500"
                : "bg-[#00FF00]",
              job.status === "rendering" && "animate-pulse"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 프레임 카운트 */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground/60">프레임</span>
        <span className="font-mono text-foreground">
          <span>{job.rendered_frames}</span>
          <span className="text-foreground/40 mx-1">/</span>
          <span>{job.total_frames}</span>
        </span>
      </div>

      {/* 예상 남은 시간 */}
      <div
        className="flex items-center justify-between text-sm"
      >
        <span className="text-foreground/60">예상 남은 시간</span>
        <span
          data-testid="estimated-time"
          className="font-mono text-foreground"
        >
          {job.status === "completed"
            ? "완료"
            : job.status === "failed"
            ? "-"
            : remainingSec !== null
            ? formatDuration(remainingSec)
            : "계산 중..."}
        </span>
      </div>

      {/* 현재 씬 */}
      {job.current_scene && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/60">현재 씬</span>
          <span className="font-mono text-accent text-xs">{job.current_scene}</span>
        </div>
      )}

      {/* 버튼 (활성 상태일 때만 표시) */}
      {active && (
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onPause}
            aria-label="일시정지"
            className={cn(
              "flex-1 h-9 px-4 rounded-lg text-sm font-medium",
              "bg-surface-hover border border-surface-border",
              "text-foreground/80 hover:text-foreground",
              "hover:border-foreground/30 transition-colors"
            )}
          >
            일시정지
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="취소"
            className={cn(
              "flex-1 h-9 px-4 rounded-lg text-sm font-medium",
              "bg-red-950/30 border border-red-800/40",
              "text-red-400 hover:text-red-300",
              "hover:border-red-600/60 transition-colors"
            )}
          >
            취소
          </button>
        </div>
      )}
    </section>
  );
}
