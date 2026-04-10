"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor-store";

/** DOM에서 선택된 노드의 computed CSS를 읽어 반환 */
export interface ComputedNodeStyle {
  // layout
  direction: string;
  gap: string;
  align: string;
  justify: string;
  maxWidth: string;
  width: string;
  height: string;
  padding: string;
  columns: string;
  // style
  background: string;
  color: string;
  border: string;
  radius: string;
  opacity: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  textAlign: string;
  boxShadow: string;
}

const EMPTY: ComputedNodeStyle = {
  direction: "", gap: "", align: "", justify: "",
  maxWidth: "", width: "", height: "", padding: "", columns: "",
  background: "", color: "", border: "", radius: "",
  opacity: "", fontSize: "", fontWeight: "", lineHeight: "",
  textAlign: "", boxShadow: "",
};

// CSS flexbox 값 → 에디터 표기로 변환
function normalizeAlign(v: string): string {
  if (v === "flex-start") return "start";
  if (v === "flex-end") return "end";
  return v; // center, stretch, normal 등
}

// "16px" → "16", "100%" → "100%", "none" → ""
function normalizePx(v: string): string {
  if (!v || v === "none" || v === "normal" || v === "auto") return "";
  if (v.endsWith("px")) {
    const num = parseFloat(v);
    return isNaN(num) ? v : String(Math.round(num * 100) / 100);
  }
  return v;
}

function extractComputed(el: Element): ComputedNodeStyle {
  const cs = window.getComputedStyle(el);

  // grid columns 감지
  const display = cs.display;
  let columns = "";
  if (display === "grid" || display === "inline-grid") {
    const gtc = cs.gridTemplateColumns;
    if (gtc && gtc !== "none") {
      columns = String(gtc.split(/\s+/).length);
    }
  }

  // border 축약
  let border = "";
  const bw = cs.borderTopWidth;
  const bs = cs.borderTopStyle;
  const bc = cs.borderTopColor;
  if (bs && bs !== "none" && bw && bw !== "0px") {
    border = `${bw} ${bs} ${bc}`;
  }

  // padding 축약
  const pt = normalizePx(cs.paddingTop);
  const pr = normalizePx(cs.paddingRight);
  const pb = normalizePx(cs.paddingBottom);
  const pl = normalizePx(cs.paddingLeft);
  let padding = "";
  if (pt || pr || pb || pl) {
    if (pt === pr && pr === pb && pb === pl) {
      padding = pt;
    } else if (pt === pb && pl === pr) {
      padding = `${pt}px ${pr}px`;
    } else {
      padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
    }
  }

  return {
    direction: cs.flexDirection === "row" ? "row" : cs.flexDirection === "column" ? "column" : "",
    gap: normalizePx(cs.gap) || normalizePx(cs.rowGap),
    align: normalizeAlign(cs.alignItems),
    justify: normalizeAlign(cs.justifyContent),
    maxWidth: normalizePx(cs.maxWidth),
    width: normalizePx(cs.width),
    height: normalizePx(cs.height),
    padding,
    columns,
    background: cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : "",
    color: cs.color || "",
    border,
    radius: normalizePx(cs.borderRadius),
    opacity: cs.opacity !== "1" ? cs.opacity : "",
    fontSize: normalizePx(cs.fontSize),
    fontWeight: cs.fontWeight || "",
    lineHeight: normalizePx(cs.lineHeight),
    textAlign: cs.textAlign || "",
    boxShadow: cs.boxShadow && cs.boxShadow !== "none" ? cs.boxShadow : "",
  };
}

export function useComputedNodeStyle(): ComputedNodeStyle {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const scenes = useEditorStore((s) => s.scenes);
  const activeSceneIndex = useEditorStore((s) => s.activeSceneIndex);
  const [computed, setComputed] = useState<ComputedNodeStyle>(EMPTY);

  useEffect(() => {
    if (!selectedNodeId) {
      setComputed(EMPTY);
      return;
    }

    // Player DOM 렌더 후 약간의 지연
    const timer = setTimeout(() => {
      const el = document.querySelector(
        `[data-node-id="${CSS.escape(selectedNodeId)}"]`
      );
      if (!el) {
        setComputed(EMPTY);
        return;
      }

      // leaf 노드 판별: 자식 중 data-node-id가 없으면 leaf
      const hasChildNodeId = el.querySelector(":scope > [data-node-id]");
      const isLeaf = !hasChildNodeId;

      if (isLeaf && el.firstElementChild) {
        // leaf: display:contents wrapper 또는 motion wrapper → 첫 자식(실제 컴포넌트)에서 읽기
        setComputed(extractComputed(el.firstElementChild));
      } else {
        // container: data-node-id 요소 자체가 실제 컨테이너
        setComputed(extractComputed(el));
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedNodeId, scenes, activeSceneIndex]);

  return computed;
}
