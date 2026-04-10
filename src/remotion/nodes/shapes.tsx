// Shape Nodes: Divider, Badge, Pill, FrameBox, RectFrame, CircleFrame
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

export const DividerRenderer: React.FC<NodeProps> = ({ node }) => {
  const P = useScenePalette();
  const dir = node.layout?.direction ?? node.style?.direction ?? "horizontal";
  const isVert = dir === "vertical";
  return (
    <div style={{
      width: isVert ? (node.style?.thickness ?? 1) : "60%",
      height: isVert ? "100%" : (node.style?.thickness ?? 1),
      backgroundColor: (node.style?.color as string) ?? P.borderAccent,
      borderRadius: 1, flexShrink: 0, alignSelf: "center",
      ...(node.style as React.CSSProperties),
    }} />
  );
};

export const BadgeRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const v = node.variant ?? "subtle";
  const styles: Record<string, React.CSSProperties> = {
    accent: { backgroundColor: P.accent, color: "#FFF", border: "none" },
    outline: { backgroundColor: "transparent", color: P.accentBright, border: `1.5px solid ${P.borderAccentStrong}` },
    subtle: { backgroundColor: P.accentTint, color: P.accentBright, border: `1px solid ${P.borderAccent}` },
  };
  return (
    <span style={{
      fontFamily: T.font, fontSize: 24, fontWeight: 700,
      padding: "8px 22px", borderRadius: 10, display: "inline-block",
      letterSpacing: "0.08em", textAlign: "center",
      ...styles[v],
      ...(node.style as React.CSSProperties),
    }}>
      {d.text ?? ""}
    </span>
  );
};

export const PillRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <span style={{
      fontFamily: T.font, fontSize: 21, fontWeight: 600,
      padding: "8px 18px", borderRadius: 100,
      backgroundColor: T.bgSurface, color: P.accentBright,
      border: `1px solid ${P.borderAccent}`, display: "inline-block",
      textAlign: "center",
      ...(node.style as React.CSSProperties),
    }}>
      {d.text ?? ""}
    </span>
  );
};

export const FrameBoxRenderer: React.FC<NodeProps> = ({ node }) => {
  // FrameBox는 컨테이너처럼 동작 - StackRenderer에서 children과 함께 렌더
  return <div />;
};
