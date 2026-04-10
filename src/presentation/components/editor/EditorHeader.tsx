"use client";

import { useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";
import { ArrowLeft, Undo2, Redo2, Save } from "lucide-react";

export function EditorHeader() {
  const router = useRouter();
  const {
    projectId,
    isDirty,
    isSaving,
    activeSceneIndex,
    saveStackRoot,
    undo,
    redo,
    history,
    historyIndex,
  } = useEditorStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10">
      {/* 좌: 뒤로가기 + 프로젝트명 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="뒤로"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-medium text-white/80">
          {projectId ?? "에디터"}
        </span>
      </div>

      {/* 우: Undo / Redo / 저장 */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
          title="실행 취소 (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
          title="다시 실행 (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-2" />
        <button
          onClick={() => saveStackRoot(activeSceneIndex)}
          disabled={!isDirty || isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-40 transition-colors"
        >
          <Save size={14} />
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
