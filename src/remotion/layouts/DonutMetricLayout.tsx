import React from "react";
import { interpolate } from "remotion";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const DonutMetricLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, duration_frames, chunk_metadata } = scene;
  const emph = chunk_metadata?.emphasis_tokens ?? [];

  // 도넛 차트 데이터
  const chartData = scene.assets.chart_data as { percent?: number; label?: string } | null;
  const percent = chartData?.percent ?? 68;
  const metricLabel = chartData?.label ?? copy_layers.kicker ?? "";

  // 애니메이션: 퍼센트 카운트업
  const animPercent = interpolate(frame, [8, 35], [0, percent], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 도넛 SVG 파라미터
  const size = 240;
  const strokeW = 14;
  const r = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - animPercent / 100);

  // 태그 필 (emphasis tokens)
  const tags = emph.length > 0 ? emph : [];

  return (
    <SceneShell scene={scene} frame={frame} testId="donut-metric-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {/* 상단 레이블 */}
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
            <span style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 20, fontWeight: 500 }}>{copy_layers.kicker}</span>
          </MotionWrapper>
        )}

        {/* 도넛 차트 */}
        <MotionWrapper preset="popNumber" frame={frame} durationFrames={duration_frames} staggerIndex={1}>
          <div style={{ position: "relative", width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
              {/* 배경 트랙 */}
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.bgElevated} strokeWidth={strokeW} />
              {/* 진행 아크 */}
              <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={T.accent} strokeWidth={strokeW} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                style={{ filter: `drop-shadow(0 0 12px ${T.accentGlow})` }}
              />
            </svg>
            {/* 중앙 숫자 */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 64, fontWeight: 900, lineHeight: 1 }}>
                {Math.round(animPercent)}
              </span>
              <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 24, fontWeight: 600 }}>%</span>
            </div>
          </div>
        </MotionWrapper>

        {/* 헤드라인 */}
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={2}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 40, fontWeight: 800, margin: 0, textAlign: "center", whiteSpace: "pre-line" }}>
            {copy_layers.headline}
          </h2>
        </MotionWrapper>

        {/* 태그 필 */}
        {tags.length > 0 && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={3}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {tags.map((tag, i) => (
                <div key={i} style={{
                  backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`,
                  borderRadius: 20, padding: "6px 18px",
                }}>
                  <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 16, fontWeight: 600 }}>{tag}</span>
                </div>
              ))}
            </div>
          </MotionWrapper>
        )}

        {/* 서포팅 */}
        {copy_layers.supporting && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={4}>
            <p style={{ color: T.textSecondary, fontFamily: T.font, fontSize: 22, margin: 0, textAlign: "center", maxWidth: 600, whiteSpace: "pre-line" }}>
              {copy_layers.supporting}
            </p>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
