// @TASK P2-S1-T1 - 타임라인 에디터 UI - TimelineViewport
// @SPEC specs/layout.md

"use client";

import { cn } from "@/lib/utils";
import type { Scene } from "@/types";
import { SceneCard } from "./SceneCard";

export interface TimelineViewportProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSceneSelect: (sceneId: string) => void;
  className?: string;
}

export function TimelineViewport({
  scenes,
  selectedSceneId,
  onSceneSelect,
  className,
}: TimelineViewportProps) {
  if (scenes.length === 0) {
    return (
      <div
        data-testid="timeline-viewport"
        className={cn(
          "flex items-center justify-center h-28",
          "text-sm text-foreground/40",
          className
        )}
      >
        장면이 없습니다
      </div>
    );
  }

  return (
    <div
      data-testid="timeline-viewport"
      role="listbox"
      aria-label="장면 시퀀스"
      className={cn(
        "flex flex-row gap-2 overflow-x-auto overflow-y-hidden",
        "px-4 py-3 min-h-[7rem]",
        // 스크롤바 스타일 (webkit)
        "[&::-webkit-scrollbar]:h-1",
        "[&::-webkit-scrollbar-track]:bg-surface",
        "[&::-webkit-scrollbar-thumb]:bg-surface-border",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        className
      )}
    >
      {scenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          isSelected={scene.id === selectedSceneId}
          onClick={() => onSceneSelect(scene.id)}
        />
      ))}
    </div>
  );
}
