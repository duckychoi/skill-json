// Connector Nodes: ArrowConnector, LineConnector
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

export const ArrowConnectorRenderer: React.FC<NodeProps> = ({ node }) => {
  const P = useScenePalette();
  const dir = node.layout?.direction ?? node.data?.direction ?? "right";
  const isDown = dir === "down" || dir === "column";
  const size = 28;

  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: isDown ? "4px 0" : "0 4px",
    alignSelf: "center",
  };

  return (
    <div style={wrapStyle}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={isDown ? { transform: "rotate(90deg)" } : undefined}
      >
        <path
          d="M4 12h14m0 0l-5-5m5 5l-5 5"
          stroke={P.accentBright}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const LineConnectorRenderer: React.FC<NodeProps> = ({ node }) => {
  const P = useScenePalette();
  const dir = node.layout?.direction ?? "vertical";
  const isVert = dir === "vertical" || dir === "column";
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0,
    }}>
      {isVert ? (
        <div style={{ width: 2, height: 32, backgroundColor: P.borderAccent, borderRadius: 1 }} />
      ) : (
        <div style={{ width: 32, height: 2, backgroundColor: P.borderAccent, borderRadius: 1 }} />
      )}
    </div>
  );
};
