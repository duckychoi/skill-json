import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { SvgIcon } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const QuoteHighlightLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, duration_frames, chunk_metadata } = scene;
  const emph = chunk_metadata?.emphasis_tokens ?? [];
  const icon = assets.svg_icons[0] ?? "quote";

  // supporting 텍스트를 ✕/✓ 라인으로 파싱
  const lines = (copy_layers.supporting ?? "").split("\n").filter(l => l.trim());
  const hasMarkers = lines.some(l => /[✕✗✓✔×]/.test(l));

  const highlight = (text: string): React.ReactNode => {
    if (!emph.length) return text;
    const parts: React.ReactNode[] = []; let rem = text; let k = 0;
    for (const t of emph) { const i = rem.indexOf(t); if (i !== -1) { if (i > 0) parts.push(rem.slice(0, i)); parts.push(<span key={k++} style={{ color: T.accentBright, fontWeight: 800 }}>{t}</span>); rem = rem.slice(i + t.length); } }
    if (rem) parts.push(rem); return parts.length > 0 ? parts : text;
  };

  return (
    <SceneShell scene={scene} frame={frame} testId="quote-highlight-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {/* 아이콘 */}
        <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames}>
          <SvgIcon name={icon} size={64} />
        </MotionWrapper>

        {/* 메인 인용문 */}
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={1}>
          <h1 style={{
            color: T.textPrimary, fontFamily: T.font, fontSize: 56, fontWeight: 800,
            lineHeight: 1.2, margin: 0, textAlign: "center", maxWidth: 900, whiteSpace: "pre-line",
          }}>
            {highlight(copy_layers.headline)}
          </h1>
        </MotionWrapper>

        {/* ✕/✓ 비교 라인 또는 일반 서포팅 */}
        {hasMarkers ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {lines.map((line, i) => {
              const isPositive = /[✓✔✅]/.test(line);
              const isNegative = /[✕✗×❌]/.test(line);
              const cleanText = line.replace(/[✕✗✓✔×❌✅]\s*/, "");
              return (
                <MotionWrapper key={i} preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={i + 2}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      backgroundColor: isPositive ? T.accentTint : isNegative ? "rgba(255,60,60,0.08)" : T.bgElevated,
                      border: `2px solid ${isPositive ? T.accent : isNegative ? "rgba(255,60,60,0.4)" : T.borderDefault}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 18, color: isPositive ? T.accentBright : isNegative ? "#FF6B6B" : T.textMuted }}>
                        {isPositive ? "✓" : isNegative ? "✕" : "·"}
                      </span>
                    </div>
                    <span style={{
                      color: isPositive ? T.accentBright : isNegative ? T.textMuted : T.textSecondary,
                      fontFamily: T.font, fontSize: 26, fontWeight: isPositive ? 700 : 400,
                      textDecoration: isNegative ? "line-through" : "none",
                      opacity: isNegative ? 0.6 : 1,
                    }}>
                      {cleanText}
                    </span>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        ) : copy_layers.supporting ? (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={2}>
            <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 26, margin: 0, textAlign: "center", maxWidth: 700, whiteSpace: "pre-line", lineHeight: 1.5 }}>
              {highlight(copy_layers.supporting)}
            </p>
          </MotionWrapper>
        ) : null}

        {/* 풋터 */}
        {copy_layers.footer_caption && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={lines.length + 2}>
            <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 18, marginTop: 8 }}>{copy_layers.footer_caption}</span>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
