// @TASK P3-S2-T1 - 렌더 출력 UI - DownloadPanel
// @SPEC specs/render-output.md

"use client";

import { cn } from "@/lib/utils";
import type { RenderJob } from "@/types";

export interface DownloadPanelProps {
  job: RenderJob | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function DownloadPanel({ job }: DownloadPanelProps) {
  if (!job || job.status !== "completed") {
    return null;
  }

  const fileSizeText = job.file_size ? formatFileSize(job.file_size) : null;
  const downloadHref = job.output_path
    ? `/api/download?path=${encodeURIComponent(job.output_path)}`
    : "#";

  return (
    <section
      className={cn(
        "flex flex-col gap-4 p-6 rounded-xl",
        "bg-accent/5 border border-accent/20"
      )}
      aria-label="다운로드"
    >
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h2 className="text-sm font-semibold text-accent">렌더 완료</h2>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-foreground/70">
          <span className="px-1.5 py-0.5 bg-surface border border-surface-border rounded text-xs font-mono uppercase">
            mp4
          </span>
          {fileSizeText && (
            <span className="text-foreground/50">{fileSizeText}</span>
          )}
        </div>

        <a
          href={downloadHref}
          download
          role="button"
          aria-label="다운로드"
          className={cn(
            "flex items-center gap-2 h-9 px-5 rounded-lg",
            "bg-accent text-background text-sm font-semibold",
            "hover:bg-accent/90 transition-colors"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          다운로드
        </a>
      </div>
    </section>
  );
}
