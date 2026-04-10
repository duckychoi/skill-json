"use client";

import type { Scene } from "@/types";
import { cn } from "@/lib/utils";

interface SlideStripItemProps {
  scene: Scene;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const LAYOUT_ICONS: Record<string, string> = {
  "hero-center": "H",
  "split-2col": "S",
  "grid-4x3": "G",
  "process-horizontal": "P",
  "radial-focus": "R",
  "stacked-vertical": "V",
  "comparison-bars": "C",
  "spotlight-case": "L",
  "donut-metric": "D",
  "big-number": "N",
  "quote-highlight": "Q",
};

export function SlideStripItem({
  scene,
  index,
  isActive,
  onClick,
}: SlideStripItemProps) {
  const layoutIcon = LAYOUT_ICONS[scene.layout_family] ?? "?";
  const headline =
    scene.copy_layers?.headline?.slice(0, 30) ?? `씬 ${index}`;
  const hasStackRoot = !!scene.stack_root;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-2 rounded-md transition-colors group",
        isActive
          ? "bg-purple-600/20 border border-purple-500/40"
          : "hover:bg-white/5 border border-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        {/* 인덱스 */}
        <span className="text-[10px] text-white/30 w-5 text-right flex-shrink-0">
          {index}
        </span>
        {/* 레이아웃 아이콘 */}
        <span
          className={cn(
            "w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0",
            hasStackRoot
              ? "bg-purple-600/30 text-purple-300"
              : "bg-white/10 text-white/40"
          )}
        >
          {layoutIcon}
        </span>
        {/* 헤드라인 */}
        <span className="text-[11px] text-white/60 truncate leading-tight">
          {headline}
        </span>
      </div>
      {/* 프레임 정보 */}
      <div className="flex items-center gap-1 mt-1 ml-7">
        <span className="text-[9px] text-white/25">
          {scene.duration_frames}f
        </span>
      </div>
    </button>
  );
}
