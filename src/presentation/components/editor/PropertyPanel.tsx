"use client";

import { useEditorStore } from "@/stores/editor-store";
import { NodeTreeView } from "./NodeTreeView";
import { NodePropertyEditor } from "./NodePropertyEditor";

export function PropertyPanel() {
  const { scenes, activeSceneIndex, selectedNodeId } = useEditorStore();
  const scene = scenes[activeSceneIndex];
  const stackRoot = scene?.stack_root;

  return (
    <div className="w-[320px] flex-shrink-0 border-l border-white/10 bg-[#0d0d0d] flex flex-col overflow-hidden">
      {!stackRoot ? (
        <div className="flex-1 flex items-center justify-center text-white/30 text-xs px-4 text-center">
          이 씬에는 stack_root가 없습니다.
        </div>
      ) : (
        <>
          {/* 노드 트리 */}
          <div className="border-b border-white/10 max-h-[40%] overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              Node Tree
            </div>
            <NodeTreeView root={stackRoot} />
          </div>
          {/* 속성 편집기 */}
          <div className="flex-1 overflow-y-auto">
            {selectedNodeId ? (
              <NodePropertyEditor />
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-xs">
                노드를 선택하세요
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
