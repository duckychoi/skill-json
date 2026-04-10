// @TASK P3-S2-T1 - 렌더 출력 UI - RenderHeader
// @SPEC specs/render-output.md

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RenderStatus } from "@/types";

export interface RenderHeaderProps {
  status: RenderStatus;
}

const STATUS_CONFIG: Record<
  RenderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-surface text-foreground/60 border border-surface-border",
  },
  rendering: {
    label: "Rendering",
    className: "bg-accent/20 text-accent border border-accent/40 animate-pulse",
  },
  paused: {
    label: "Paused",
    className: "bg-surface text-foreground/60 border border-surface-border",
  },
  completed: {
    label: "Completed",
    className: "bg-accent/20 text-accent border border-accent/40",
  },
  failed: {
    label: "Failed",
    className: "bg-red-950/40 text-red-400 border border-red-800/40",
  },
};

export function RenderHeader({ status }: RenderHeaderProps) {
  const config = STATUS_CONFIG[status];

  return (
    <header
      className="h-14 border-b border-surface-border flex items-center px-4 gap-4 bg-background"
      role="banner"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 5-7 7 7 7" />
        </svg>
        <span>뒤로</span>
      </Link>

      <div className="w-px h-5 bg-surface-border" aria-hidden="true" />

      <h1 className="text-base font-semibold text-foreground">렌더 출력</h1>

      <span
        className={cn(
          "ml-auto px-2.5 py-1 rounded-full text-xs font-medium",
          config.className
        )}
      >
        {config.label}
      </span>
    </header>
  );
}
