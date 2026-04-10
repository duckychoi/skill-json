"use client";

import type { StackNode } from "@/types/stack-nodes";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Box,
  Type,
  Circle,
  Image,
  BarChart2,
  Layers,
  Minus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const CONTAINER_TYPES = new Set([
  "SceneRoot", "Stack", "Grid", "Split", "Overlay",
  "AnchorBox", "SafeArea", "FrameBox",
]);

function getNodeIcon(type: string) {
  if (CONTAINER_TYPES.has(type)) return Layers;
  if (["Kicker", "Headline", "RichText", "BodyText", "BulletList", "StatNumber", "QuoteText", "FooterCaption"].includes(type)) return Type;
  if (["Divider", "Badge", "Pill"].includes(type)) return Circle;
  if (["Icon", "RingChart"].includes(type)) return Image;
  if (["ProgressBar", "CompareBars", "MiniBarChart"].includes(type)) return BarChart2;
  if (["ArrowConnector", "LineConnector"].includes(type)) return Minus;
  if (["AccentGlow", "AccentRing", "Backplate"].includes(type)) return Sparkles;
  return Box;
}

interface NodeTreeViewProps {
  root: StackNode;
}

export function NodeTreeView({ root }: NodeTreeViewProps) {
  return (
    <div className="pb-2">
      <TreeNode node={root} depth={0} />
    </div>
  );
}

function TreeNode({ node, depth }: { node: StackNode; depth: number }) {
  const { selectedNodeId, selectNode } = useEditorStore();
  const [expanded, setExpanded] = useState(depth < 2);
  const isContainer = CONTAINER_TYPES.has(node.type);
  const hasChildren = isContainer && node.children && node.children.length > 0;
  const isSelected = node.id === selectedNodeId;
  const Icon = getNodeIcon(node.type);

  return (
    <div>
      <button
        onClick={() => selectNode(node.id)}
        className={cn(
          "w-full flex items-center gap-1 px-2 py-0.5 text-left hover:bg-white/5 transition-colors",
          isSelected && "bg-purple-600/20"
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {/* 펼침 토글 */}
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-4 h-4 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight
              size={12}
              className={cn(
                "text-white/30 transition-transform",
                expanded && "rotate-90"
              )}
            />
          </span>
        ) : (
          <span className="w-4" />
        )}
        {/* 아이콘 */}
        <Icon
          size={12}
          className={cn(
            isContainer ? "text-purple-400/70" : "text-white/40"
          )}
        />
        {/* 타입 */}
        <span className="text-[11px] text-white/70 truncate">
          {node.type}
        </span>
        {/* role이 있으면 표시 */}
        {node.role && (
          <span className="text-[9px] text-white/25 truncate">
            ({node.role})
          </span>
        )}
      </button>
      {/* 자식 노드 */}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
