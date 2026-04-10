// @TASK P2-S1-T1 - 타임라인 에디터 UI - FooterControls
// @SPEC specs/layout.md

"use client";

import { Play, Film, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterControlsProps {
  onPreview: () => void;
  onRender: () => void;
  isRendering: boolean;
  className?: string;
}

export function FooterControls({
  onPreview,
  onRender,
  isRendering,
  className,
}: FooterControlsProps) {
  return (
    <footer
      className={cn(
        "flex items-center justify-end gap-3 px-4 py-3",
        "border-t border-surface-border bg-surface",
        className
      )}
    >
      {/* 프리뷰 버튼 */}
      <button
        type="button"
        aria-label="preview 프리뷰"
        onClick={onPreview}
        className={cn(
          "flex items-center gap-2 px-4 h-9 rounded-md",
          "text-sm font-medium",
          "bg-surface-hover text-foreground",
          "border border-surface-border",
          "hover:border-foreground/30 hover:bg-surface",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        )}
      >
        <Play size={14} aria-hidden="true" />
        <span>프리뷰</span>
      </button>

      {/* 렌더 버튼 */}
      <button
        type="button"
        aria-label="render 렌더"
        onClick={onRender}
        disabled={isRendering}
        aria-busy={isRendering}
        className={cn(
          "flex items-center gap-2 px-4 h-9 rounded-md",
          "text-sm font-medium",
          "bg-accent text-black",
          "hover:bg-accent-dim",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
        )}
      >
        {isRendering ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Film size={14} aria-hidden="true" />
        )}
        <span>{isRendering ? "렌더링 중..." : "렌더"}</span>
      </button>
    </footer>
  );
}
