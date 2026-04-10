// @TASK P2-S1-T1 - 타임라인 에디터 UI - DSLEditor
// @SPEC specs/layout.md

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Scene, LayoutFamily } from "@/types";

export interface LayoutFamilyOption {
  id: string;
  name: string;
  description: string;
}

export interface DSLEditorProps {
  scene: Scene | null;
  layoutFamilies: LayoutFamilyOption[];
  onLayoutChange: (layout: LayoutFamily) => void;
  onDslChange: (dsl: string) => void;
  className?: string;
}

export function DSLEditor({
  scene,
  layoutFamilies,
  onLayoutChange,
  onDslChange,
  className,
}: DSLEditorProps) {
  const [dslText, setDslText] = useState("");

  useEffect(() => {
    if (scene) {
      setDslText(JSON.stringify(scene, null, 2));
    } else {
      setDslText("");
    }
  }, [scene]);

  if (!scene) {
    return (
      <div
        data-testid="dsl-editor-panel"
        className={cn(
          "flex items-center justify-center h-full",
          "text-sm text-foreground/40 p-4",
          className
        )}
      >
        장면을 선택하면 편집할 수 있습니다
      </div>
    );
  }

  return (
    <div
      data-testid="dsl-editor-panel"
      className={cn(
        "flex flex-col h-full gap-3 p-4",
        className
      )}
    >
      {/* 레이아웃 선택 드롭다운 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="layout-select"
          className="text-xs font-medium text-foreground/60 uppercase tracking-wide"
        >
          레이아웃
        </label>
        <select
          id="layout-select"
          value={scene.layout_family}
          onChange={(e) => onLayoutChange(e.target.value as LayoutFamily)}
          className={cn(
            "w-full px-3 py-2 rounded-md text-sm",
            "bg-surface border border-surface-border",
            "text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
            "transition-colors duration-150",
            "[&>option]:bg-surface [&>option]:text-foreground"
          )}
        >
          {layoutFamilies.map((lf) => (
            <option key={lf.id} value={lf.id}>
              {lf.name}
            </option>
          ))}
        </select>
      </div>

      {/* JSON 편집 textarea */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        <label
          htmlFor="dsl-textarea"
          className="text-xs font-medium text-foreground/60 uppercase tracking-wide"
        >
          DSL (JSON)
        </label>
        <textarea
          id="dsl-textarea"
          value={dslText}
          onChange={(e) => {
            setDslText(e.target.value);
            onDslChange(e.target.value);
          }}
          spellCheck={false}
          className={cn(
            "flex-1 w-full min-h-[200px] p-3 rounded-md",
            "bg-black border border-surface-border",
            "text-foreground/90 font-mono text-xs leading-relaxed",
            "resize-none",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
            "transition-colors duration-150",
            "[&::-webkit-scrollbar]:w-1",
            "[&::-webkit-scrollbar-track]:bg-surface",
            "[&::-webkit-scrollbar-thumb]:bg-surface-border",
            "[&::-webkit-scrollbar-thumb]:rounded-full"
          )}
        />
      </div>
    </div>
  );
}
