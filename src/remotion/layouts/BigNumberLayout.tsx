import React from "react";
import { interpolate } from "remotion";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const BigNumberLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, duration_frames, chunk_metadata } = scene;
  const emph = chunk_metadata?.emphasis_tokens ?? [];

  // 빅넘버 데이터
  const chartData = scene.assets.chart_data as { number?: string; suffix?: string; bars?: { label: string; value: number }[] } | null;
  const bigNum = chartData?.number ?? copy_layers.headline.match(/\d+/)?.[0] ?? "01";
  const suffix = chartData?.suffix ?? "";
  const bars = chartData?.bars ?? [];

  const highlight = (text: string): React.ReactNode => {
    if (!emph.length) return text;
    const parts: React.ReactNode[] = []; let rem = text; let k = 0;
    for (const t of emph) { const i = rem.indexOf(t); if (i !== -1) { if (i > 0) parts.push(rem.slice(0, i)); parts.push(<span key={k++} style={{ color: T.accentBright }}>{t}</span>); rem = rem.slice(i + t.length); } }
    if (rem) parts.push(rem); return parts.length > 0 ? parts : text;
  };

  return (
    <SceneShell scene={scene} frame={frame} testId="big-number-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {/* 킥커 */}
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
            <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 20, fontWeight: 500 }}>{copy_layers.kicker}</span>
          </MotionWrapper>
        )}

        {/* 빅 넘버 */}
        <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames} staggerIndex={0.5}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 120, fontWeight: 900, lineHeight: 1 }}>{bigNum}</span>
            {suffix && <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 36, fontWeight: 600 }}>{suffix}</span>}
          </div>
        </MotionWrapper>

        {/* 헤드라인 (빅넘버 아래) */}
        <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={1.5}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 40, fontWeight: 800, margin: 0, textAlign: "center", whiteSpace: "pre-line" }}>
            {highlight(copy_layers.headline)}
          </h2>
        </MotionWrapper>

        {/* 구분선 */}
        {(bars.length > 0 || copy_layers.supporting) && (
          <MotionWrapper preset="drawConnector" frame={frame} durationFrames={duration_frames} staggerIndex={2}>
            <div style={{ width: 400, height: 1, backgroundColor: T.borderDefault, margin: "8px 0" }} />
          </MotionWrapper>
        )}

        {/* 미니 바 차트 */}
        {bars.length > 0 && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={2.5}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
              {bars.map((bar, i) => {
                const h = interpolate(frame, [12 + i * 2, 30 + i * 2], [0, bar.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 32, height: h, borderRadius: 4,
                      backgroundColor: i === bars.length - 1 ? T.accent : T.bgElevated,
                    }} />
                    <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 11 }}>{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </MotionWrapper>
        )}

        {/* 서포팅 */}
        {copy_layers.supporting && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
            <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 24, margin: 0, textAlign: "center", whiteSpace: "pre-line" }}>
              {highlight(copy_layers.supporting)}
            </p>
          </MotionWrapper>
        )}

        {/* 풋터 */}
        {copy_layers.footer_caption && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={4}>
            <div style={{ backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`, borderRadius: 20, padding: "6px 18px", marginTop: 4 }}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 17, fontWeight: 500 }}>{copy_layers.footer_caption}</span>
            </div>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
