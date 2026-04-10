// Remotion 메인 컴포지션 — SceneRenderer + Audio + SubtitleBar

import React from "react";
import { AbsoluteFill, Audio, Series, staticFile, useCurrentFrame } from "remotion";
import type { Scene } from "@/types";
import { SceneRenderer } from "./common/SceneRenderer";
import { T } from "./common/theme";

export interface MainCompositionProps {
  scenes: Scene[];
  audioSrc?: string;
}

export const MainComposition: React.FC<MainCompositionProps> = ({
  scenes,
  audioSrc,
}) => {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: T.textAccent,
            fontFamily: "Inter, sans-serif",
            fontSize: 32,
          }}
        >
          No scenes loaded
        </span>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 오디오 트랙 */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      <Series>
        {scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.duration_frames}
            name={`Scene-${scene.beat_index}`}
          >
            <SceneSequenceWrapper scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

const SceneSequenceWrapper: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  return <SceneRenderer scene={scene} frame={frame} />;
};
