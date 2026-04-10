// Media Nodes: Icon, RingChart
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { SvgIcon, IconCircle } from "../common/SvgIcons";
import { T, useScenePalette } from "../common/theme";

export const IconRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const name = d.name ?? "sparkles";
  const size = d.size ?? node.style?.size ?? 80;
  const glow = d.glow ?? false;

  if (glow) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignSelf: "center",
          filter: `drop-shadow(0 0 24px ${P.accentGlow})`,
          ...(node.style as React.CSSProperties),
        }}
      >
        <IconCircle
          name={name}
          size={(size as number) + 20}
          iconSize={(size as number) * 0.6}
          bgColor={P.accentTint}
          borderColor={P.accent}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignSelf: "center",
        ...(node.style as React.CSSProperties),
      }}
    >
      <SvgIcon name={name} size={size as number} color={P.accentBright} />
    </div>
  );
};

export const RingChartRenderer: React.FC<NodeProps> = ({
  node,
  frame,
  durationFrames,
}) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const size = d.size ?? 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetPercent = d.value ?? 100;

  const enterAt = node.motion?.enterAt ?? 0;
  const animDuration = node.motion?.duration ?? 30;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / animDuration);
  const currentPercent = progress * targetPercent;
  const dashOffset = circumference * (1 - currentPercent / 100);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        ...(node.style as React.CSSProperties),
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={T.bgSurface}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={P.accentBright}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${P.accentGlow})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: T.font,
            fontSize: size * 0.28,
            fontWeight: 900,
            color: P.accentBright,
          }}
        >
          {Math.round(currentPercent)}
        </span>
        <span
          style={{
            fontFamily: T.font,
            fontSize: size * 0.1,
            fontWeight: 600,
            color: P.accentBright,
          }}
        >
          {d.unit ?? "%"}
        </span>
        {d.label && (
          <span
            style={{
              fontFamily: T.font,
              fontSize: size * 0.08,
              color: T.textSecondary,
              marginTop: 4,
            }}
          >
            {d.label}
          </span>
        )}
      </div>
    </div>
  );
};
