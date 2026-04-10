import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { IconCircle } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const Split2ColLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, duration_frames, chunk_metadata } = scene;
  const emph = chunk_metadata?.emphasis_tokens ?? [];
  const icons = assets.svg_icons;

  const highlight = (text: string): React.ReactNode => {
    if (!emph.length) return text;
    const parts: React.ReactNode[] = []; let rem = text; let k = 0;
    for (const t of emph) { const i = rem.indexOf(t); if (i !== -1) { if (i > 0) parts.push(rem.slice(0, i)); parts.push(<span key={k++} style={{ color: T.textAccent }}>{t}</span>); rem = rem.slice(i + t.length); } }
    if (rem) parts.push(rem); return parts.length > 0 ? parts : text;
  };

  const lines = (copy_layers.supporting ?? "").split("\n").filter(l => l.trim());
  const leftText = lines[0] ?? "";
  const rightText = lines.slice(1).join("\n") || leftText;

  return (
    <SceneShell scene={scene} frame={frame} testId="split-2col-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* 헤더 블록 */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          {copy_layers.kicker && (
            <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 18, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>{copy_layers.kicker}</span>
            </MotionWrapper>
          )}
          <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "slideSplit"} frame={frame} durationFrames={duration_frames} staggerIndex={0.5}>
            <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 52, fontWeight: 800, lineHeight: 1.15, margin: "8px 0 0", whiteSpace: "pre-line" }}>{highlight(copy_layers.headline)}</h2>
          </MotionWrapper>
        </div>

        {/* 구분선 */}
        <MotionWrapper preset="drawConnector" frame={frame} durationFrames={duration_frames} staggerIndex={1}>
          <div style={{ width: 500, height: 1, backgroundColor: T.borderDefault, margin: "12px 0 28px" }} />
        </MotionWrapper>

        {/* 양쪽 카드 */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center" }}>
          {/* 좌 */}
          <div data-testid="split-col-left" style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "0 24px" }}>
            <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames} staggerIndex={2}>
              <IconCircle name={icons[0] ?? "brain"} size={88} iconSize={44} bgColor={T.bgElevated} borderColor={T.borderDefault} />
            </MotionWrapper>
            <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
              <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 20, lineHeight: 1.6, whiteSpace: "pre-line" }}>{leftText}</span>
            </MotionWrapper>
          </div>

          {/* 세로 구분선 */}
          <div style={{ width: 1, height: 160, backgroundColor: T.borderDefault, flexShrink: 0 }} />

          {/* 우 */}
          <div data-testid="split-col-right" style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "0 24px" }}>
            <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames} staggerIndex={2}>
              <IconCircle name={icons[1] ?? icons[0] ?? "check-circle"} size={88} iconSize={44} bgColor={T.accentTint} borderColor={T.accent} />
            </MotionWrapper>
            <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
              <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 20, lineHeight: 1.6, whiteSpace: "pre-line" }}>{rightText}</span>
            </MotionWrapper>
          </div>
        </div>

        {/* Footer */}
        {copy_layers.footer_caption && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={4}>
            <div style={{ backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`, borderRadius: 12, padding: "8px 24px", marginTop: 20 }}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 18, fontWeight: 500 }}>{copy_layers.footer_caption}</span>
            </div>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
