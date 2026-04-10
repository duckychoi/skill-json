// @TASK P2-S1-T1 - 타임라인 에디터 UI - SceneCard
// @SPEC specs/layout.md

"use client";

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { Scene } from "@/types";

export interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/** 레이아웃 패밀리별 아이콘 SVG (간단한 박스 다이어그램) */
function LayoutIcon({ family }: { family: string }) {
  const icons: Record<string, ReactElement> = {
    "hero-center": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="5" width="12" height="8" rx="0.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    "split-2col": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="9" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="2" width="9" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "grid-4x3": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="9" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="2" width="9" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="10" width="9" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="10" width="9" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "process-horizontal": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <circle cx="5" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" />
        <line x1="15" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "radial-focus": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="7" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    "stacked-vertical": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="18" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="7" width="18" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="12" width="18" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "comparison-bars": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <rect x="3" y="8" width="8" height="8" rx="0.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="4" width="8" height="12" rx="0.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "spotlight-case": (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2" y1="9" x2="4" y2="9" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  };

  return icons[family] ?? (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SceneCard({ scene, isSelected, onClick, className }: SceneCardProps) {
  const startFormatted = formatMs(scene.start_ms);
  const endFormatted = formatMs(scene.end_ms);

  return (
    <button
      type="button"
      role="option"
      data-testid={`scene-card-${scene.id}`}
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1.5",
        "w-28 min-w-[7rem] shrink-0 p-2.5",
        "rounded-lg border bg-surface",
        "text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isSelected
          ? "border-accent shadow-[0_0_0_1px_#00FF00]"
          : "border-surface-border hover:border-surface-hover",
        className
      )}
    >
      {/* 레이아웃 아이콘 */}
      <span
        className={cn(
          "text-foreground/50",
          isSelected && "text-accent"
        )}
      >
        <LayoutIcon family={scene.layout_family} />
      </span>

      {/* 레이아웃 이름 */}
      <span className="text-[10px] font-medium text-foreground/70 truncate w-full leading-none">
        {scene.layout_family}
      </span>

      {/* 시간 범위 */}
      <span className="text-[10px] text-foreground/50 leading-none">
        {startFormatted} – {endFormatted}
      </span>

      {/* 비트 인덱스 */}
      <span className={cn(
        "text-[9px] font-mono px-1 py-0.5 rounded",
        "bg-surface-hover text-foreground/40",
        isSelected && "bg-accent/10 text-accent"
      )}>
        #{scene.beat_index}
      </span>
    </button>
  );
}
