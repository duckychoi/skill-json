"use client";

import { useMemo } from "react";
import { Player } from "@remotion/player";
import { useEditorStore } from "@/stores/editor-store";
import { SingleSceneComposition } from "@/remotion/SingleSceneComposition";

const FPS = 30;

export function ScenePreview() {
  const { scenes, activeSceneIndex } = useEditorStore();
  const scene = scenes[activeSceneIndex];

  // scene 변경 시 Player를 리마운트하기 위한 key
  const playerKey = useMemo(
    () => `${activeSceneIndex}-${scene?.id ?? "none"}`,
    [activeSceneIndex, scene?.id]
  );

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
        씬을 선택해주세요
      </div>
    );
  }

  const durationFrames = scene.duration_frames || 90;

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <div className="w-full max-w-4xl aspect-video">
        <Player
          key={playerKey}
          component={SingleSceneComposition}
          inputProps={{ scene }}
          durationInFrames={durationFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          style={{ width: "100%", height: "100%" }}
          controls
          loop
          autoPlay={false}
        />
      </div>
    </div>
  );
}
