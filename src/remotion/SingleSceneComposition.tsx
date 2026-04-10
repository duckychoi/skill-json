import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Scene } from "@/types";
import { SceneRenderer } from "./common/SceneRenderer";

export interface SingleSceneProps {
  scene: Scene;
}

export const SingleSceneComposition: React.FC<SingleSceneProps> = ({
  scene,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <SceneRenderer scene={scene} frame={frame} />
    </AbsoluteFill>
  );
};
