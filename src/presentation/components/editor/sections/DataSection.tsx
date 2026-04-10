"use client";

import { useState, useEffect } from "react";
import type { StackNode } from "@/types/stack-nodes";
import { useEditorStore } from "@/stores/editor-store";

interface DataSectionProps {
  node: StackNode;
}

export function DataSection({ node }: DataSectionProps) {
  const { updateNodeAt } = useEditorStore();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 노드 변경 시 JSON 텍스트 동기화
  useEffect(() => {
    setJsonText(JSON.stringify(node.data ?? {}, null, 2));
    setError(null);
  }, [node.id, node.data]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      updateNodeAt(node.id, { data: parsed });
      setError(null);
    } catch (e) {
      setError("유효하지 않은 JSON");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-white/40 font-medium">
          data (JSON)
        </label>
        <button
          onClick={handleApply}
          className="text-[10px] px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 transition-colors"
        >
          적용
        </button>
      </div>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="w-full h-48 bg-black/40 border border-white/10 rounded text-[11px] text-white/80 p-2 font-mono resize-y focus:border-purple-500/50 focus:outline-none"
        spellCheck={false}
      />
      {error && (
        <div className="text-[10px] text-red-400">{error}</div>
      )}
    </div>
  );
}
