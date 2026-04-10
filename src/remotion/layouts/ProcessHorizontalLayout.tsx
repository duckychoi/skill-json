import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { IconCircle } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const ProcessHorizontalLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, components, duration_frames } = scene;
  const icons = assets.svg_icons;

  const steps = components.length > 0
    ? components.map((c, i) => ({
        label: (c.props.label as string) ?? (c.props.title as string) ?? `Step ${i + 1}`,
        description: (c.props.description as string) ?? "",
        icon: icons[i] ?? null,
      }))
    : [
        { label: "질문", description: "사용자가 질문", icon: icons[0] ?? "help-circle" },
        { label: "검색", description: "관련 자료 탐색", icon: icons[1] ?? "search" },
        { label: "생성", description: "답변 생성", icon: icons[2] ?? "message-square" },
      ];

  return (
    <SceneShell scene={scene} frame={frame} testId="process-horizontal-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
            <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 18, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {copy_layers.kicker}
            </span>
          </MotionWrapper>
        )}

        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={0.5}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 48, fontWeight: 800, margin: "8px 0 0", textAlign: "center" }}>
            {copy_layers.headline}
          </h2>
        </MotionWrapper>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 36 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <MotionWrapper preset="staggerChildren" frame={frame} durationFrames={duration_frames} staggerIndex={i * 2 + 1}>
                <div data-testid={`process-step-${i}`} style={{
                  backgroundColor: T.bgElevated, border: `1px solid ${T.borderDefault}`, borderRadius: 20,
                  padding: "28px 24px", width: 200,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
                }}>
                  {step.icon && (
                    <IconCircle name={step.icon} size={64} iconSize={32}
                      bgColor={i === steps.length - 1 ? T.accentTint : T.bgSurface}
                      borderColor={i === steps.length - 1 ? T.accent : T.borderDefault}
                    />
                  )}
                  <span style={{ color: T.accentBright, fontFamily: T.font, fontSize: 14, fontWeight: 700 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 20, fontWeight: 700 }}>
                    {step.label}
                  </span>
                  {step.description && (
                    <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 15 }}>
                      {step.description}
                    </span>
                  )}
                </div>
              </MotionWrapper>

              {i < steps.length - 1 && (
                <MotionWrapper preset="drawConnector" frame={frame} durationFrames={duration_frames} staggerIndex={i * 2 + 2}>
                  <div style={{ padding: "0 16px" }}>
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                      <line x1="0" y1="12" x2="28" y2="12" stroke={T.borderDefault} strokeWidth="2" />
                      <path d="M24 6l8 6-8 6" stroke={T.textMuted} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </MotionWrapper>
              )}
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
