"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { LayoutSection } from "./sections/LayoutSection";
import { StyleSection } from "./sections/StyleSection";
import { MotionSection } from "./sections/MotionSection";
import { DataSection } from "./sections/DataSection";

const TABS = ["Layout", "Style", "Motion", "Data"] as const;
type Tab = (typeof TABS)[number];

export function NodePropertyEditor() {
  const [activeTab, setActiveTab] = useState<Tab>("Layout");
  const node = useEditorStore((s) => s.getSelectedNode());

  if (!node) {
    return (
      <div className="p-4 text-white/30 text-xs">노드를 찾을 수 없습니다</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 노드 타입 헤더 */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="text-xs font-medium text-white/80">{node.type}</div>
        <div className="text-[10px] text-white/30">{node.id}</div>
      </div>

      {/* 탭 바 */}
      <div className="flex border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-medium transition-colors",
              activeTab === tab
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "Layout" && <LayoutSection node={node} />}
        {activeTab === "Style" && <StyleSection node={node} />}
        {activeTab === "Motion" && <MotionSection node={node} />}
        {activeTab === "Data" && <DataSection node={node} />}
      </div>
    </div>
  );
}
