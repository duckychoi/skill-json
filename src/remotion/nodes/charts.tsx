// Chart Nodes: ProgressBar, CompareBars, MiniBarChart
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

export const ProgressBarRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const value = d.value ?? 50;
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur) * value;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6, width: "80%", alignSelf: "center",
      ...(node.style as React.CSSProperties),
    }}>
      {d.label && (
        <span style={{ fontFamily: T.font, fontSize: 19, color: T.textSecondary, textAlign: "center" }}>
          {d.label}
        </span>
      )}
      <div style={{
        width: "100%", height: 17, borderRadius: 10,
        backgroundColor: T.bgSurface, overflow: "hidden",
      }}>
        <div style={{
          width: `${progress}%`, height: "100%", borderRadius: 10,
          backgroundColor: P.accentBright,
          boxShadow: `0 0 8px ${P.accentGlow}`,
        }} />
      </div>
    </div>
  );
};

export const CompareBarsRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const items: Array<{ label: string; value: number; subtitle?: string }> = d.items ?? [];
  const unit = d.unit ?? "";
  const maxVal = Math.max(...items.map(i => i.value), 1);
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur);

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14, width: "65%", maxWidth: 700, alignSelf: "center",
      ...(node.style as React.CSSProperties),
    }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const barWidth = (item.value / maxVal) * 100 * progress;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: T.font, fontSize: 20, fontWeight: 600, color: isLast ? P.accentBright : T.textPrimary }}>
                {item.label}
              </span>
              {item.subtitle && (
                <span style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted }}>{item.subtitle}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                flex: 1, height: 17, borderRadius: 10,
                backgroundColor: T.bgSurface, overflow: "hidden",
              }}>
                <div style={{
                  width: `${barWidth}%`, height: "100%", borderRadius: 10,
                  backgroundColor: isLast ? P.accentBright : T.textMuted,
                  boxShadow: isLast ? `0 0 8px ${P.accentGlow}` : "none",
                }} />
              </div>
              <span style={{
                fontFamily: T.font, fontSize: 22, fontWeight: 700, minWidth: 50, textAlign: "right",
                color: isLast ? P.accentBright : T.textPrimary,
              }}>
                {Math.round(item.value * progress)}{unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MiniBarChartRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const items: Array<{ label: string; value: number }> = d.items ?? [];
  const maxVal = Math.max(...items.map(i => i.value), 1);
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 15;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur);

  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "flex-end", justifyContent: "center",
      height: 220, alignSelf: "center",
      ...(node.style as React.CSSProperties),
    }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const barH = (item.value / maxVal) * 190 * progress;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 44, height: barH, borderRadius: 6,
              backgroundColor: isLast ? P.accentBright : T.textMuted,
            }} />
            <span style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
