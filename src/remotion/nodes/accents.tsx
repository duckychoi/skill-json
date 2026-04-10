// Accent Nodes: AccentGlow, AccentDot, AccentRing, Backplate
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { useScenePalette } from "../common/theme";

export const AccentGlowRenderer: React.FC<NodeProps> = () => {
  // 광원 효과 비활성화 — 빈 요소 렌더
  return <div style={{ display: "none" }} />;
};

export const AccentRingRenderer: React.FC<NodeProps> = ({ node }) => {
  const P = useScenePalette();
  const size = node.style?.size ?? node.data?.size ?? 180;
  const thickness = node.style?.thickness ?? 4;
  return (
    <div style={{
      width: size as number, height: size as number, borderRadius: "50%",
      border: `${thickness}px solid ${P.accentBright}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      alignSelf: "center", flexShrink: 0,
      boxShadow: `0 0 20px ${P.accentGlow}`,
    }} />
  );
};

export const BackplateRenderer: React.FC<NodeProps> = ({ node }) => {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: (node.style?.background as string) ?? "transparent",
      border: `1px solid rgba(255, 255, 255, 0.06)`,
      borderRadius: (node.style?.radius as number) ?? 24,
      pointerEvents: "none",
    }} />
  );
};

export const SpacerRenderer: React.FC<NodeProps> = ({ node }) => {
  const size = node.layout?.size ?? 24;
  const axis = node.layout?.axis ?? "vertical";
  return (
    <div style={{
      width: axis === "horizontal" ? size : "auto",
      height: axis === "vertical" ? size : "auto",
      flexShrink: 0,
    }} />
  );
};
