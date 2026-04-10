// Composite Nodes: IconCard, StatCard, CompareCard, ProcessStepCard, InsightTile, WarningCard
// Premium dark-tech styling with gradients, glows, glass effects
import React from "react";
import type { NodeProps, StackNode } from "@/types/stack-nodes";
import { IconCircle } from "../common/SvgIcons";
import { T, useScenePalette } from "../common/theme";

// ---------------------------------------------------------------------------
// Panel base — transparent bg + visible border stroke (reference style)
// ---------------------------------------------------------------------------
const panelBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  position: "relative" as const,
  overflow: "hidden" as const,
};

/** Top-edge neon accent glow */
function PanelAccent({ color = T.accentBright }: { color?: string }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      boxShadow: `0 0 12px ${color}40, 0 0 24px ${color}20`,
      borderRadius: 1, pointerEvents: "none",
    }} />
  );
}

// ---------------------------------------------------------------------------
// Variant system
// ---------------------------------------------------------------------------
function getVariantStyle(node: StackNode, P: { accentBright: string; accentGlow: string; borderAccentStrong: string }): React.CSSProperties {
  const v = node.variant ?? "default";

  switch (v) {
    case "bold":
      return {
        border: `2px solid ${P.accentBright}`,
        boxShadow: `0 0 20px ${P.accentGlow}`,
      };
    case "glass":
      return {
        background: "rgba(255,255,255,0.04)",
        border: "1.5px solid rgba(255,255,255,0.12)",
      };
    case "outline":
      return {
        background: "transparent",
        border: `1.5px solid ${P.borderAccentStrong}`,
      };
    case "subtle":
      return {
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(255,255,255,0.08)`,
      };
    default:
      return {};
  }
}

// Clamp text to N lines
const lineClamp = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
});

// ---------------------------------------------------------------------------
// IconCard
// ---------------------------------------------------------------------------
export const IconCardRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const sm = d.size === "sm";
  const iconSz = sm ? 48 : 67;
  const iconInner = sm ? 24 : 34;
  const titleFz = sm ? 22 : 30;
  const bodyFz = sm ? 16 : 20;
  const pad = sm ? 16 : 25;
  const gap = sm ? 8 : 12;
  return (
    <div style={{
      ...panelBase,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap, padding: (node.style?.padding as number) ?? pad, borderRadius: sm ? 12 : 16,
      textAlign: "center", width: "100%", height: "100%", minWidth: 0,
      boxSizing: "border-box" as const,
      ...getVariantStyle(node, P),
      ...(node.style as React.CSSProperties),
    }}>
      <PanelAccent color={P.accentBright} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: sm ? 6 : 10, width: "100%" }}>
        <IconCircle name={d.icon ?? "sparkles"} size={iconSz} iconSize={iconInner}
          bgColor={P.accentTint} borderColor={P.accent} />
        <span style={{
          fontFamily: T.font, fontSize: titleFz, fontWeight: 700, color: T.textPrimary,
          wordBreak: "keep-all",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          width: "100%",
          lineHeight: 1.18,
          ...lineClamp(2),
        }}>
          {d.title ?? ""}
        </span>
        <span style={{
          fontFamily: T.font, fontSize: bodyFz, color: T.textSecondary,
          lineHeight: 1.5,
          width: "100%",
          minHeight: "1.5em",
          opacity: d.body ? 0.82 : 0,
          ...lineClamp(2),
        }}>
          {d.body ?? "\u00A0"}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
export const StatCardRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <div style={{
      ...panelBase,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, padding: (node.style?.padding as number) ?? 32, borderRadius: 16,
      textAlign: "center", width: "100%",
      ...getVariantStyle(node, P),
      ...(node.style as React.CSSProperties),
    }}>
      <PanelAccent color={P.accentBright} />
      <span style={{
        fontFamily: T.font, fontSize: 75, fontWeight: 900, color: P.accentBright,
        textShadow: `0 0 36px ${P.accentGlow}, 0 4px 14px rgba(0,0,0,0.6)`,
        lineHeight: 1,
      }}>
        {d.value ?? "0"}
      </span>
      <span style={{
        fontFamily: T.font, fontSize: 20, color: T.textSecondary, opacity: d.label ? 0.8 : 0,
        minHeight: "1.3em",
      }}>
        {d.label ?? "\u00A0"}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CompareCard
// ---------------------------------------------------------------------------
export const CompareCardRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const left = d.left ?? {};
  const right = d.right ?? {};
  return (
    <div style={{
      display: "flex", gap: 28, alignItems: "stretch",
      width: "100%", maxWidth: 880,
      ...(node.style as React.CSSProperties),
    }}>
      {/* Left — negative side */}
      <div style={{
        ...panelBase,
        flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        gap: 10, padding: 22, borderRadius: 14,
        border: `1.5px solid ${left.negative ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.15)"}`,
      }}>
        {left.icon && <IconCircle name={left.icon} size={43} iconSize={22}
          bgColor={left.negative ? "rgba(239,68,68,0.12)" : T.bgSurface}
          borderColor={left.negative ? "rgba(239,68,68,0.35)" : T.borderDefault} />}
        <span style={{
          fontFamily: T.font, fontSize: 22, fontWeight: 700, textAlign: "center",
          color: left.negative ? "#EF4444" : T.textPrimary,
          lineHeight: 1.3, ...lineClamp(2),
        }}>
          {left.negative ? "✕ " : ""}{left.title ?? left.label ?? ""}
        </span>
        <span style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, textAlign: "center", minHeight: "1.3em", opacity: left.subtitle ? 1 : 0 }}>
          {left.subtitle ?? "\u00A0"}
        </span>
      </div>
      {/* Right — positive side */}
      <div style={{
        ...panelBase,
        flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        gap: 10, padding: 22, borderRadius: 14,
        border: `1.5px solid ${right.positive ? P.accentBright : "rgba(255,255,255,0.15)"}`,
        boxShadow: right.positive ? `0 0 16px ${P.accentGlow}` : "none",
      }}>
        {right.icon && <IconCircle name={right.icon} size={43} iconSize={22}
          bgColor={P.accentTint} borderColor={P.accentBright} />}
        <span style={{
          fontFamily: T.font, fontSize: 22, fontWeight: 700, textAlign: "center",
          color: right.positive ? P.accentBright : T.textPrimary,
          lineHeight: 1.3, ...lineClamp(2),
        }}>
          {right.positive ? "✓ " : ""}{right.title ?? right.label ?? ""}
        </span>
        <span style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, textAlign: "center", minHeight: "1.3em", opacity: right.subtitle ? 1 : 0 }}>
          {right.subtitle ?? "\u00A0"}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ProcessStepCard
// ---------------------------------------------------------------------------
export const ProcessStepCardRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const highlighted = d.highlighted ?? (node.variant === "highlighted");
  const baseVariant = (!highlighted && node.variant && node.variant !== "highlighted") ? getVariantStyle(node, P) : {};
  return (
    <div style={{
      ...panelBase,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, padding: (node.style?.padding as number) ?? 22, borderRadius: 16,
      textAlign: "center", width: "100%",
      border: highlighted ? `2px solid ${P.accentBright}` : panelBase.border,
      boxShadow: highlighted ? `0 0 16px ${P.accentGlow}` : "none",
      ...baseVariant,
      ...(node.style as React.CSSProperties),
    }}>
      <PanelAccent color={highlighted ? P.accentBright : P.accentDim} />
      <IconCircle name={d.icon ?? "sparkles"} size={49} iconSize={24}
        bgColor={highlighted ? P.accentTint : T.bgSurface}
        borderColor={highlighted ? P.accentBright : "rgba(255,255,255,0.12)"} />
      <span style={{
        fontFamily: T.font, fontSize: 19, fontWeight: 700,
        color: P.accentBright, letterSpacing: "0.12em",
        textShadow: `0 0 10px ${P.accentGlow}`,
      }}>
        STEP {d.step ?? ""}
      </span>
      <span style={{
        fontFamily: T.font, fontSize: 30, fontWeight: 700, color: T.textPrimary,
        wordBreak: "keep-all", textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        lineHeight: 1.18, ...lineClamp(2),
      }}>
        {d.title ?? ""}
      </span>
      <span style={{
        fontFamily: T.font, fontSize: 20, color: T.textSecondary, lineHeight: 1.5,
        opacity: d.desc ? 0.8 : 0, minHeight: "1.5em", ...lineClamp(2),
      }}>
        {d.desc ?? "\u00A0"}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// InsightTile
// ---------------------------------------------------------------------------
/** Inline SVG arrow icon for InsightTile index */
function InlineSvgArrow({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      style={{ flexShrink: 0, marginRight: 6, verticalAlign: "middle" }}>
      <path d="M4 12h14m0 0l-5-5m5 5l-5 5" stroke={color}
        strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ARROW_PATTERNS = /^(->|→|=>|==>|-->|──>)$/;

export const InsightTileRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const isArrowIndex = d.index && ARROW_PATTERNS.test(d.index.trim());
  return (
    <div style={{
      ...panelBase,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "18px 32px", borderRadius: 12, maxWidth: 1100,
      fontFamily: T.font, fontSize: 27, fontWeight: 600,
      color: T.textPrimary, textAlign: "center",
      ...getVariantStyle(node, P),
      ...(node.style as React.CSSProperties),
    }}>
      <PanelAccent color={P.accentBright} />
      {d.index && (isArrowIndex
        ? <InlineSvgArrow color={P.accentBright} />
        : <span style={{ color: P.accentBright, marginRight: 8, textShadow: `0 0 8px ${P.accentGlow}` }}>{d.index}</span>
      )}
      {d.title ?? ""}
    </div>
  );
};

// ---------------------------------------------------------------------------
// WarningCard
// ---------------------------------------------------------------------------
export const WarningCardRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const isVariant = node.variant && node.variant !== "default";
  return (
    <div style={{
      ...panelBase,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 12, padding: (node.style?.padding as number) ?? 25, borderRadius: 16,
      backgroundColor: "rgba(239,68,68,0.06)",
      border: `1px solid rgba(239,68,68,0.3)`,
      textAlign: "center", width: "100%", maxWidth: 880,
      ...(isVariant ? getVariantStyle(node, P) : {}),
      ...(node.style as React.CSSProperties),
    }}>
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
        background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)",
        borderRadius: 1, pointerEvents: "none",
      }} />
      <IconCircle name={d.icon ?? "alert-triangle"} size={49} iconSize={24}
        bgColor="rgba(239,68,68,0.12)" borderColor="rgba(239,68,68,0.35)" />
      <span style={{
        fontFamily: T.font, fontSize: 30, fontWeight: 700, color: T.textPrimary,
        wordBreak: "keep-all", textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        lineHeight: 1.18,
      }}>
        {d.title ?? ""}
      </span>
      {d.body && (
        <span style={{ fontFamily: T.font, fontSize: 20, color: T.textSecondary, opacity: 0.8, lineHeight: 1.5 }}>
          {d.body}
        </span>
      )}
    </div>
  );
};
