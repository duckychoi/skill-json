import React from "react";
import { interpolate } from "remotion";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

interface BarRowProps {
  label: string; sublabel?: string; value: string;
  widthPercent: number; color: string; frame: number; durationFrames: number; index: number;
}

const BarRow: React.FC<BarRowProps> = ({ label, sublabel, value, widthPercent, color, frame, durationFrames, index }) => {
  const entranceEnd = Math.min(durationFrames * 0.5, 25);
  const delay = index * 4;
  const animWidth = interpolate(frame, [delay, entranceEnd + delay], [0, widthPercent], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <MotionWrapper preset="staggerChildren" frame={frame} durationFrames={durationFrames} staggerIndex={index}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <span style={{ color: color === T.accent ? T.accentBright : T.textPrimary, fontFamily: T.font, fontSize: 22, fontWeight: 700 }}>
            {label}
          </span>
          {sublabel && (
            <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 16 }}>{sublabel}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 40, backgroundColor: T.bgElevated, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ width: `${animWidth}%`, height: "100%", backgroundColor: color, borderRadius: 6 }} />
          </div>
          <span style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 28, fontWeight: 800, minWidth: 80, textAlign: "right" }}>
            {value}
          </span>
        </div>
      </div>
    </MotionWrapper>
  );
};

export const ComparisonBarsLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, duration_frames } = scene;

  const chartData = scene.assets.chart_data as {
    bars?: { label: string; sublabel?: string; value: string; percent: number; color?: string }[];
  } | null;

  const bars = chartData?.bars ?? [
    { label: "Before", value: "65%", percent: 65, color: T.borderDefault },
    { label: "After", value: "93%", percent: 93, color: T.accent },
  ];

  return (
    <SceneShell scene={scene} frame={frame} testId="comparison-bars-layout">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
            <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 20, display: "block", marginBottom: 8 }}>
              {copy_layers.kicker}
            </span>
          </MotionWrapper>
        )}
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={0.5}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 48, fontWeight: 800, margin: 0 }}>
            {copy_layers.headline}
          </h2>
        </MotionWrapper>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {bars.map((bar, i) => (
          <BarRow key={i} label={bar.label} sublabel={bar.sublabel} value={bar.value}
            widthPercent={bar.percent} color={bar.color ?? (i === 0 ? T.borderDefault : T.accent)}
            frame={frame} durationFrames={duration_frames} index={i + 1} />
        ))}
      </div>

      {copy_layers.supporting && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={bars.length + 2}>
            <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 22 }}>{copy_layers.supporting}</span>
          </MotionWrapper>
        </div>
      )}
    </SceneShell>
  );
};
