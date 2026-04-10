"use client";

import { useEffect, useState } from "react";
import type { StackNode, LayoutProps } from "@/types/stack-nodes";
import { useEditorStore } from "@/stores/editor-store";
import { PropertyField } from "./shared";

/** DOM에서 선택된 노드의 computed layout 속성 읽기 */
function readComputedLayout(nodeId: string): Record<string, string> {
  const el = document.querySelector(`[data-node-id="${CSS.escape(nodeId)}"]`);
  if (!el) return {};

  // leaf 판별: 자식 중 data-node-id가 없으면 leaf
  const hasChildNodeId = el.querySelector(":scope > [data-node-id]");
  const target = (!hasChildNodeId && el.firstElementChild) ? el.firstElementChild : el;

  const cs = window.getComputedStyle(target);

  const normPx = (v: string) => {
    if (!v || v === "none" || v === "normal" || v === "auto") return "";
    if (v.endsWith("px")) { const n = parseFloat(v); return isNaN(n) ? v : String(Math.round(n * 100) / 100); }
    return v;
  };
  const normAlign = (v: string) => v === "flex-start" ? "start" : v === "flex-end" ? "end" : v;

  // padding 축약
  const pt = normPx(cs.paddingTop), pr = normPx(cs.paddingRight);
  const pb = normPx(cs.paddingBottom), pl = normPx(cs.paddingLeft);
  let padding = "";
  if (pt || pr || pb || pl) {
    if (pt === pr && pr === pb && pb === pl) padding = pt;
    else if (pt === pb && pl === pr) padding = `${pt} ${pr}`;
    else padding = `${pt} ${pr} ${pb} ${pl}`;
  }

  // grid columns
  let columns = "";
  if (cs.display === "grid" || cs.display === "inline-grid") {
    const gtc = cs.gridTemplateColumns;
    if (gtc && gtc !== "none") columns = String(gtc.split(/\s+/).length);
  }

  return {
    direction: cs.flexDirection === "row" ? "row" : cs.flexDirection === "column" ? "column" : "",
    gap: normPx(cs.gap) || normPx(cs.rowGap),
    align: normAlign(cs.alignItems),
    justify: normAlign(cs.justifyContent),
    maxWidth: normPx(cs.maxWidth),
    width: normPx(cs.width),
    height: normPx(cs.height),
    padding,
    columns,
  };
}

interface LayoutSectionProps {
  node: StackNode;
}

export function LayoutSection({ node }: LayoutSectionProps) {
  const { updateNodeAt } = useEditorStore();
  const scenes = useEditorStore((s) => s.scenes);
  const activeSceneIndex = useEditorStore((s) => s.activeSceneIndex);
  const layout = node.layout ?? {};

  const [computed, setComputed] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setComputed(readComputedLayout(node.id));
    }, 200);
    return () => clearTimeout(timer);
  }, [node.id, scenes, activeSceneIndex]);

  const updateLayout = (patch: Partial<LayoutProps>) => {
    updateNodeAt(node.id, { layout: { ...layout, ...patch } });
  };

  const effective = (field: string) => {
    const explicit = (layout as Record<string, unknown>)[field];
    if (explicit !== undefined && explicit !== null) return String(explicit);
    return computed[field] || "";
  };

  const isExplicit = (field: string) => {
    const v = (layout as Record<string, unknown>)[field];
    return v !== undefined && v !== null;
  };

  const defCls = "text-white/30 italic";
  const expCls = "text-white/80";

  return (
    <div className="space-y-3">
      <PropertyField label="direction">
        <select
          value={effective("direction")}
          onChange={(e) => updateLayout({ direction: (e.target.value || undefined) as LayoutProps["direction"] })}
          className={`w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] focus:border-purple-500/50 focus:outline-none ${isExplicit("direction") ? expCls : defCls}`}
        >
          <option value="">(none)</option>
          <option value="row">row</option>
          <option value="column">column</option>
        </select>
      </PropertyField>

      <EffField label="gap" value={effective("gap")} isDefault={!isExplicit("gap")} type="number"
        onChange={(v) => updateLayout({ gap: v === "" ? undefined : Number(v) || undefined })} />

      <PropertyField label="align">
        <select
          value={effective("align")}
          onChange={(e) => updateLayout({ align: (e.target.value || undefined) as LayoutProps["align"] })}
          className={`w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] focus:border-purple-500/50 focus:outline-none ${isExplicit("align") ? expCls : defCls}`}
        >
          <option value="">(none)</option>
          <option value="start">start</option>
          <option value="center">center</option>
          <option value="end">end</option>
          <option value="stretch">stretch</option>
        </select>
      </PropertyField>

      <PropertyField label="justify">
        <select
          value={effective("justify")}
          onChange={(e) => updateLayout({ justify: (e.target.value || undefined) as LayoutProps["justify"] })}
          className={`w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] focus:border-purple-500/50 focus:outline-none ${isExplicit("justify") ? expCls : defCls}`}
        >
          <option value="">(none)</option>
          <option value="start">start</option>
          <option value="center">center</option>
          <option value="end">end</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
        </select>
      </PropertyField>

      <EffField label="maxWidth" value={effective("maxWidth")} isDefault={!isExplicit("maxWidth")}
        onChange={(v) => { const n = Number(v); updateLayout({ maxWidth: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="width" value={effective("width")} isDefault={!isExplicit("width")}
        onChange={(v) => { const n = Number(v); updateLayout({ width: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="height" value={effective("height")} isDefault={!isExplicit("height")}
        onChange={(v) => { const n = Number(v); updateLayout({ height: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="padding" value={effective("padding")} isDefault={!isExplicit("padding")}
        onChange={(v) => { const n = Number(v); updateLayout({ padding: v === "" ? undefined : isNaN(n) ? v : n }); }} />

      <EffField label="columns" value={effective("columns")} isDefault={!isExplicit("columns")} type="number"
        onChange={(v) => updateLayout({ columns: v === "" ? undefined : Number(v) || undefined })} />

      <EffField label="rows" value={String(layout.rows ?? "")} isDefault={!isExplicit("rows")} type="number"
        onChange={(v) => updateLayout({ rows: v === "" ? undefined : Number(v) || undefined })} />
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
