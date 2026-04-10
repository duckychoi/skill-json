"use client";

import { useEffect, useState } from "react";
import type { StackNode, StyleProps } from "@/types/stack-nodes";
import { useEditorStore } from "@/stores/editor-store";
import { PropertyField } from "./shared";

/** DOM에서 선택된 노드의 computed style 속성 읽기 */
function readComputedStyle(nodeId: string): Record<string, string> {
  const el = document.querySelector(`[data-node-id="${CSS.escape(nodeId)}"]`);
  if (!el) return {};

  const hasChildNodeId = el.querySelector(":scope > [data-node-id]");
  const target = (!hasChildNodeId && el.firstElementChild) ? el.firstElementChild : el;

  const cs = window.getComputedStyle(target);

  const normPx = (v: string) => {
    if (!v || v === "none" || v === "normal" || v === "auto") return "";
    if (v.endsWith("px")) { const n = parseFloat(v); return isNaN(n) ? v : String(Math.round(n * 100) / 100); }
    return v;
  };

  // border 축약
  let border = "";
  const bw = cs.borderTopWidth, bs = cs.borderTopStyle, bc = cs.borderTopColor;
  if (bs && bs !== "none" && bw && bw !== "0px") border = `${bw} ${bs} ${bc}`;

  return {
    background: cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : "",
    color: cs.color || "",
    border,
    radius: normPx(cs.borderRadius),
    opacity: cs.opacity !== "1" ? cs.opacity : "",
    fontSize: normPx(cs.fontSize),
    fontWeight: cs.fontWeight || "",
    lineHeight: normPx(cs.lineHeight),
    textAlign: cs.textAlign || "",
    boxShadow: cs.boxShadow && cs.boxShadow !== "none" ? cs.boxShadow : "",
  };
}

interface StyleSectionProps {
  node: StackNode;
}

export function StyleSection({ node }: StyleSectionProps) {
  const { updateNodeAt } = useEditorStore();
  const scenes = useEditorStore((s) => s.scenes);
  const activeSceneIndex = useEditorStore((s) => s.activeSceneIndex);
  const style = node.style ?? {};

  const [computed, setComputed] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setComputed(readComputedStyle(node.id));
    }, 200);
    return () => clearTimeout(timer);
  }, [node.id, scenes, activeSceneIndex]);

  const updateStyle = (patch: Partial<StyleProps>) => {
    updateNodeAt(node.id, { style: { ...style, ...patch } });
  };

  const effective = (field: string) => {
    const explicit = (style as Record<string, unknown>)[field];
    if (explicit !== undefined && explicit !== null) return String(explicit);
    return computed[field] || "";
  };

  const isExplicit = (field: string) => {
    const v = (style as Record<string, unknown>)[field];
    return v !== undefined && v !== null;
  };

  const defCls = "text-white/30 italic";
  const expCls = "text-white/80";

  return (
    <div className="space-y-3">
      <EffField label="background" value={effective("background")} isDefault={!isExplicit("background")}
        onChange={(v) => updateStyle({ background: v || undefined })} />

      <EffField label="color" value={effective("color")} isDefault={!isExplicit("color")}
        onChange={(v) => updateStyle({ color: v || undefined })} />

      <EffField label="border" value={effective("border")} isDefault={!isExplicit("border")}
        onChange={(v) => updateStyle({ border: v || undefined })} />

      <EffField label="radius" value={effective("radius")} isDefault={!isExplicit("radius")}
        onChange={(v) => { const n = Number(v); updateStyle({ radius: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="opacity" value={effective("opacity")} isDefault={!isExplicit("opacity")} type="number"
        onChange={(v) => updateStyle({ opacity: v === "" ? undefined : Number(v) })} />

      <EffField label="fontSize" value={effective("fontSize")} isDefault={!isExplicit("fontSize")} type="number"
        onChange={(v) => updateStyle({ fontSize: v === "" ? undefined : Number(v) })} />

      <EffField label="fontWeight" value={effective("fontWeight")} isDefault={!isExplicit("fontWeight")}
        onChange={(v) => { const n = Number(v); updateStyle({ fontWeight: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="lineHeight" value={effective("lineHeight")} isDefault={!isExplicit("lineHeight")}
        onChange={(v) => updateStyle({ lineHeight: v === "" ? undefined : Number(v) })} />

      <PropertyField label="textAlign">
        <select
          value={effective("textAlign")}
          onChange={(e) => updateStyle({ textAlign: (e.target.value || undefined) as StyleProps["textAlign"] })}
          className={`w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] focus:border-purple-500/50 focus:outline-none ${isExplicit("textAlign") ? expCls : defCls}`}
        >
          <option value="">(none)</option>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </PropertyField>

      <EffField label="boxShadow" value={effective("boxShadow")} isDefault={!isExplicit("boxShadow")}
        onChange={(v) => updateStyle({ boxShadow: v || undefined })} />
    </div>
  );
}

function EffField({ label, value, isDefault, onChange, type = "text" }: {
  label: string; value: string; isDefault: boolean;
  onChange: (v: string) => void; type?: "text" | "number";
}) {
  return (
    <PropertyField label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] focus:border-purple-500/50 focus:outline-none ${isDefault ? "text-white/30 italic" : "text-white/80"}`}
      />
    </PropertyField>
  );
}
