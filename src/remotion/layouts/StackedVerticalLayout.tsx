import React from "react";
import type { Scene } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { SvgIcon } from "../common/SvgIcons";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

export const StackedVerticalLayout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, assets, duration_frames } = scene;
  const icons = assets.svg_icons;

  const parseItems = (text: string | null): string[] => {
    if (!text) return [];
    return text.split("\n").filter(l => l.trim()).map(l => l.replace(/^[①②③④⑤\d.)\s]+/, "").trim());
  };

  const items = parseItems(copy_layers.supporting);
  if (items.length === 0) items.push("항목 1", "항목 2");

  return (
    <SceneShell scene={scene} frame={frame} testId="stacked-vertical-layout">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {copy_layers.kicker && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames}>
            <div style={{ backgroundColor: T.accentTint, border: `1px solid ${T.borderAccent}`, borderRadius: 24, padding: "5px 18px" }}>
              <span style={{ color: T.textAccent, fontFamily: T.font, fontSize: 16, fontWeight: 600, letterSpacing: "0.1em" }}>
                {copy_layers.kicker}
              </span>
            </div>
          </MotionWrapper>
        )}

        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames} staggerIndex={0.5}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 44, fontWeight: 800, margin: "8px 0 0", textAlign: "center" }}>
            {copy_layers.headline}
          </h2>
        </MotionWrapper>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 28 }}>
          {items.map((item, i) => (
            <MotionWrapper key={i} preset="staggerChildren" frame={frame} durationFrames={duration_frames} staggerIndex={i + 1}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "8px 0" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    backgroundColor: T.accentTint, border: `2px solid ${T.accent}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <SvgIcon name={icons[i] ?? icons[0] ?? "check-circle"} size={24} />
                  </div>
                  <span style={{
                    color: i === items.length - 1 ? T.accentBright : T.textPrimary,
                    fontFamily: T.font, fontSize: 24, fontWeight: 700,
                  }}>
                    {item}
                  </span>
                </div>
                {i < items.length - 1 && (
                  <div style={{ width: 2, height: 20, backgroundColor: T.borderAccent, marginLeft: 23 }} />
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>

        {copy_layers.footer_caption && (
          <MotionWrapper preset="fadeUp" frame={frame} durationFrames={duration_frames} staggerIndex={items.length + 1}>
            <span style={{ color: T.textMuted, fontFamily: T.font, fontSize: 18, marginTop: 16 }}>
              {copy_layers.footer_caption}
            </span>
          </MotionWrapper>
        )}
      </div>
    </SceneShell>
  );
};
