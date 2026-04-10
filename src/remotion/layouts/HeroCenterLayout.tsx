import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { IconCircle } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const HeroCenterLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, duration_frames, chunk_metadata } = scene;
  const emph = chunk_metadata?.emphasis_tokens ?? [];

  const highlight = (text: string): React.ReactNode => {
    if (!emph.length) return text;
    const parts: React.ReactNode[] = []; let rem = text; let k = 0;
    for (const t of emph) { const i = rem.indexOf(t); if (i !== -1) { if (i > 0) parts.push(rem.slice(0, i)); parts.push(<span key={k++} style={{ color: T.textAccent }}>{t}</span>); rem = rem.slice(i + t.length); } }
    if (rem) parts.push(rem); return parts.length > 0 ? parts : text;
  };

  const icon = assets.svg_icons[0] ?? null;

  return (
    <SceneShell scene={scene} frame={frame} testId="hero-center-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
        {icon && (
          <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames}>
            <IconCircle name={icon} size={100} iconSize={50} />
          </MotionWrapper>
        )}
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={1}>
            <div style={{ backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`, borderRadius: 24, padding: "6px 20px" }}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 18, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{copy_layers.kicker}</span>
            </div>
          </MotionWrapper>
        )}
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={2}>
          <h1 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 76, fontWeight: 800, lineHeight: 1.1, margin: 0, maxWidth: 1100, whiteSpace: "pre-line" }}>{highlight(copy_layers.headline)}</h1>
        </MotionWrapper>
        {copy_layers.supporting && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
            <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 28, lineHeight: 1.5, margin: 0, maxWidth: 800, whiteSpace: "pre-line" }}>{copy_layers.supporting}</p>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
