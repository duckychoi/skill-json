import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { SvgIcon } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const RadialFocusLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, duration_frames } = scene;
  const icon = assets.svg_icons[0] ?? "alert-triangle";

  return (
    <SceneShell scene={scene} frame={frame} testId="radial-focus-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "popNumber"} frame={frame} durationFrames={duration_frames}>
          <div data-testid="radial-center" style={{
            width: 160, height: 160, borderRadius: "50%",
            border: `2px solid ${T.accent}`, backgroundColor: T.accentTint,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 50px ${T.accentGlow}, inset 0 0 25px ${T.accentTint}`,
          }}>
            <SvgIcon name={icon} size={80} />
          </div>
        </MotionWrapper>

        <MotionWrapper preset="popBadge" frame={frame} durationFrames={duration_frames} staggerIndex={1}>
          <div style={{ backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`, borderRadius: 32, padding: "10px 28px", display: "flex", alignItems: "center", gap: 10 }}>
            {copy_layers.kicker && <span style={{ color: T.accentVivid, fontFamily: T.font, fontSize: 26, fontWeight: 800 }}>{copy_layers.kicker}</span>}
            <span style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 26 }}>{copy_layers.headline.split("\n")[0]}</span>
          </div>
        </MotionWrapper>

        {copy_layers.headline.includes("\n") && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={2}>
            <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 48, fontWeight: 800, margin: 0, textAlign: "center" }}>{copy_layers.headline.split("\n").slice(1).join("\n")}</h2>
          </MotionWrapper>
        )}

        {copy_layers.supporting && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
            <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 24, lineHeight: 1.5, margin: 0, textAlign: "center", maxWidth: 600, whiteSpace: "pre-line" }}>{copy_layers.supporting}</p>
          </MotionWrapper>
        )}

        {copy_layers.footer_caption && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={4}>
            <div style={{ backgroundColor: T.bgElevated, border: `1px solid ${T.borderDefault}`, borderRadius: 20, padding: "6px 18px" }}>
              <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 17 }}>{copy_layers.footer_caption}</span>
            </div>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
