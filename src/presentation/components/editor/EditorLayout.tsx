"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { EditorHeader } from "./EditorHeader";
import { SlideStrip } from "./SlideStrip";
import { SceneCanvas } from "./SceneCanvas";
import { PropertyPanel } from "./PropertyPanel";

export function EditorLayout() {
  const { undo, redo } = useEditorStore();

  // Ctrl+Z / Ctrl+Shift+Z 키보드 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 슬라이드 목록 */}
        <SlideStrip />
        {/* 중앙: 씬 캔버스 */}
        <SceneCanvas />
        {/* 우측: 속성 패널 */}
        <PropertyPanel />
      </div>
      {/* 상태바 */}
      <StatusBar />
    </div>
  );
}

function StatusBar() {
  const { activeSceneIndex, scenes, isDirty, isSaving } = useEditorStore();
  const scene = scenes[activeSceneIndex];

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-[#111] border-t border-white/10 text-xs text-white/40">
      <span>
        씬 {activeSceneIndex + 1} / {scenes.length}
        {scene && ` · ${scene.duration_frames}f`}
      </span>
      <span>
        {isSaving ? "저장 중..." : isDirty ? "변경됨 (미저장)" : "저장됨"}
      </span>
    </div>
  );
}
