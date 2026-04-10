import React from "react";
import type { Scene, SceneComponent } from "@/types";
import { SceneShell } from "../common/SceneShell";
import { MotionWrapper } from "../common/MotionWrapper";
import { T } from "../common/theme";

interface LayoutProps { scene: Scene; frame: number; }

const GridCell: React.FC<{
  component?: SceneComponent; index: number; frame: number; durationFrames: number;
}> = ({ component, index, frame, durationFrames }) => {
  const title = component
    ? (component.props.title as string) ?? `${String(index + 1).padStart(2, "0")}`
    : String(index + 1).padStart(2, "0");

  return (
    <MotionWrapper preset="staggerChildren" frame={frame} durationFrames={durationFrames} staggerIndex={index}>
      <div data-testid={`grid-cell-${index}`} style={{
        backgroundColor: T.bgElevated, border: `1px solid ${T.borderDefault}`, borderRadius: 12,
        padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56,
      }}>
        <span style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 18, fontWeight: 600 }}>
          {title}
        </span>
      </div>
    </MotionWrapper>
  );
};

export const Grid4x3Layout: React.FC<LayoutProps> = ({ scene, frame }) => {
  const { copy_layers, motion, components, duration_frames } = scene;
  const COLS = 4;
  const ROWS = 3;
  const totalCells = COLS * ROWS;

  return (
    <SceneShell scene={scene} frame={frame} testId="grid-4x3-layout">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <MotionWrapper preset={(motion.entrance as Parameters<typeof MotionWrapper>[0]["preset"]) ?? "fadeUp"} frame={frame} durationFrames={duration_frames}>
          <h2 style={{ color: T.textPrimary, fontFamily: T.font, fontSize: 48, fontWeight: 800, margin: 0 }}>
            {copy_layers.headline}
          </h2>
        </MotionWrapper>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: 12, flex: 1, maxWidth: 900, margin: "0 auto", width: "100%",
      }}>
        {Array.from({ length: totalCells }).map((_, i) => (
          <GridCell key={i} component={components[i]} index={i} frame={frame} durationFrames={duration_frames} />
        ))}
      </div>
    </SceneShell>
  );
};
