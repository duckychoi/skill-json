"use client";
// @TASK P3-S1-T1 - Remotion 프리뷰 UI - SceneNavigation
// @SPEC specs/preview.md

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SceneNavigationProps {
  currentSceneIndex: number;
  totalScenes: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SceneNavigation({
  currentSceneIndex,
  totalScenes,
  onPrev,
  onNext,
}: SceneNavigationProps) {
  const isFirst = currentSceneIndex === 0;
  const isLast = currentSceneIndex === totalScenes - 1;
  const current = currentSceneIndex + 1;

  return (
    <div className="flex items-center gap-3" role="navigation" aria-label="장면 탐색">
      {/* 이전 장면 */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        aria-label="이전"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* 현재 / 전체 */}
      <span className="text-sm text-white/80 tabular-nums min-w-[3rem] text-center">
        {current} / {totalScenes}
      </span>

      {/* 다음 장면 */}
      <button
        onClick={onNext}
        disabled={isLast}
        aria-label="다음"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
