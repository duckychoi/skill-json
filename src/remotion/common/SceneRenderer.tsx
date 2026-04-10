// @TASK P2-R3-T1 - SceneRenderer
// @SPEC docs/planning/02-trd.md
// layout_family에 따라 올바른 레이아웃 컴포넌트로 라우팅하는 공통 렌더러

import React from "react";
import { AbsoluteFill } from "remotion";
import type { Scene } from "@/types";
import { StackRenderer } from "./StackRenderer";
import { SceneShell, removeCharacterFromTree } from "./SceneShell";
import { HeroCenterLayout } from "../layouts/HeroCenterLayout";
import { Split2ColLayout } from "../layouts/Split2ColLayout";
import { Grid4x3Layout } from "../layouts/Grid4x3Layout";
import { ProcessHorizontalLayout } from "../layouts/ProcessHorizontalLayout";
import { RadialFocusLayout } from "../layouts/RadialFocusLayout";
import { StackedVerticalLayout } from "../layouts/StackedVerticalLayout";
import { ComparisonBarsLayout } from "../layouts/ComparisonBarsLayout";
import { SpotlightCaseLayout } from "../layouts/SpotlightCaseLayout";
import { DonutMetricLayout } from "../layouts/DonutMetricLayout";
import { BigNumberLayout } from "../layouts/BigNumberLayout";
import { QuoteHighlightLayout } from "../layouts/QuoteHighlightLayout";

interface SceneRendererProps {
  scene: Scene;
  frame: number;
}

const FallbackLayout: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div
    data-testid="scene-renderer-fallback"
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <span
      style={{
        color: "#FF4444",
        fontFamily: "Inter, sans-serif",
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      Unknown Layout: {scene.layout_family}
    </span>
    <span
      style={{
        color: "rgba(255, 255, 255, 0.5)",
        fontFamily: "Inter, sans-serif",
        fontSize: 18,
      }}
    >
      {scene.copy_layers.headline}
    </span>
  </div>
);

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  frame,
}) => {
  // Stack node tree → SceneShell로 감싸서 SubtitleBar 포함
  // 캐릭터 AnchorBox는 SceneShell이 오버레이로 렌더하므로 트리에서 제거
  if (scene.stack_root) {
    const cleanedRoot = removeCharacterFromTree(scene.stack_root);
    return (
      <SceneShell
        scene={scene}
        frame={frame}
        testId="scene-stack-renderer"
        contentPadding="0"
      >
        <StackRenderer
          node={cleanedRoot}
          frame={frame}
          durationFrames={scene.duration_frames}
          subtitles={scene.subtitles}
          sceneStartSec={scene.start_ms / 1000}
          sceneIndex={scene.beat_index}
        />
      </SceneShell>
    );
  }

  switch (scene.layout_family) {
    case "hero-center":
      return <HeroCenterLayout scene={scene} frame={frame} />;

    case "split-2col":
      return <Split2ColLayout scene={scene} frame={frame} />;

    case "grid-4x3":
      return <Grid4x3Layout scene={scene} frame={frame} />;

    case "process-horizontal":
      return <ProcessHorizontalLayout scene={scene} frame={frame} />;

    case "radial-focus":
      return <RadialFocusLayout scene={scene} frame={frame} />;

    case "stacked-vertical":
      return <StackedVerticalLayout scene={scene} frame={frame} />;

    case "comparison-bars":
      return <ComparisonBarsLayout scene={scene} frame={frame} />;

    case "spotlight-case":
      return <SpotlightCaseLayout scene={scene} frame={frame} />;

    case "donut-metric":
      return <DonutMetricLayout scene={scene} frame={frame} />;

    case "big-number":
      return <BigNumberLayout scene={scene} frame={frame} />;

    case "quote-highlight":
      return <QuoteHighlightLayout scene={scene} frame={frame} />;

    default:
      return <FallbackLayout scene={scene} />;
  }
};
