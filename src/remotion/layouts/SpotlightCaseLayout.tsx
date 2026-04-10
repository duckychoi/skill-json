import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const SpotlightCaseLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, components, duration_frames } = scene;

  const caseData = components.length > 0
    ? {
        category: (components[0]?.props.category as string) ?? "CASE STUDY",
        metric: (components[0]?.props.metric as string) ?? "",
        metricLabel: (components[0]?.props.metricLabel as string) ?? "",
      }
    : { category: "CASE STUDY", metric: "", metricLabel: "" };

  return (
    <SceneShell scene={scene} frame={frame} testId="spotlight-case-layout" contentPadding="60px 0 160px">
      <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        {/* 좌측 스포트라이트 */}
        <MotionWrapper preset="revealMask" frame={frame} durationFrames={duration_frames} style={{ flex: "0 0 480px" }}>
          <div data-testid="spotlight-panel" style={{
            height: "100%", backgroundColor: T.bgElevated, borderRight: `2px solid ${T.accent}`,
            padding: "80px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24,
          }}>
            <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {caseData.category}
            </span>
            {caseData.metric && (
              <span style={{ color: T.accent, fontFamily: T.font, fontSize: 72, fontWeight: 900, lineHeight: 1 }}>
                {caseData.metric}
              </span>
            )}
            {caseData.metricLabel && (
              <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 18 }}>
                {caseData.metricLabel}
              </span>
            )}
          </div>
        </MotionWrapper>

        {/* 우측 콘텐츠 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 100px 80px 80px", gap: 20 }}>
          {copy_layers.kicker && (
            <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={1}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 20, fontWeight: 600, letterSpacing: "0.1em" }}>
                {copy_layers.kicker}
              </span>
            </MotionWrapper>
          )}
          <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={2}>
            <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 56, fontWeight: 800, lineHeight: 1.15, margin: 0, whiteSpace: "pre-line" }}>
              {copy_layers.headline}
            </h2>
          </MotionWrapper>
          {copy_layers.supporting && (
            <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
              <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 24, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                {copy_layers.supporting}
              </p>
            </MotionWrapper>
          )}
        </div>
      </div>
    </SceneShell>
  );
};
