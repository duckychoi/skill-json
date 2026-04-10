"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Player } from "@remotion/player";
import type { PlayerRef } from "@remotion/player";
import { useEditorStore } from "@/stores/editor-store";
import { SingleSceneComposition } from "@/remotion/SingleSceneComposition";

const FPS = 30;

export function SceneCanvas() {
  const { scenes, activeSceneIndex, selectedNodeId, selectNode } =
    useEditorStore();
  const scene = scenes[activeSceneIndex];

  const playerRef = useRef<PlayerRef>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  const durationFrames = scene?.duration_frames || 90;

  // 씬 전환 시에만 Player 리마운트 (속성 수정 시에는 props 업데이트로 처리)
  const playerKey = `canvas-${activeSceneIndex}-${scene?.id ?? "none"}`;

  // ── 프레임 스크러버 ───────────────────────────────────────────────────────
  const handleFrameChange = useCallback(
    (frame: number) => {
      setCurrentFrame(frame);
      playerRef.current?.seekTo(frame);
      playerRef.current?.pause();
    },
    []
  );

  // ── 씬 변경 시 프레임 리셋 + 일정 프레임 진행 (요소 표시) ──────────────────
  useEffect(() => {
    const initFrame = Math.min(20, durationFrames - 1);
    setCurrentFrame(initFrame);
    // Player 마운트 후 약간의 지연
    const timer = setTimeout(() => {
      playerRef.current?.seekTo(initFrame);
      playerRef.current?.pause();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSceneIndex, durationFrames]);

  // ── 캔버스 클릭 → 노드 선택 ───────────────────────────────────────────────
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      let target = e.target as HTMLElement;
      while (target && target !== e.currentTarget) {
        const nodeId = target.getAttribute("data-node-id");
        if (nodeId) {
          selectNode(nodeId);
          return;
        }
        target = target.parentElement!;
      }
      // 빈 영역 클릭 → 선택 해제
      selectNode(null);
    },
    [selectNode]
  );

  // ── 선택 노드 하이라이트 ───────────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // 이전 하이라이트 제거
    container
      .querySelectorAll("[data-editor-highlight]")
      .forEach((el) => {
        (el as HTMLElement).style.outline = "";
        (el as HTMLElement).style.outlineOffset = "";
        el.removeAttribute("data-editor-highlight");
      });

    // 선택 노드에 하이라이트 적용
    if (selectedNodeId) {
      const el = container.querySelector(
        `[data-node-id="${CSS.escape(selectedNodeId)}"]`
      );
      if (el) {
        (el as HTMLElement).style.outline = "3px solid #9945FF";
        (el as HTMLElement).style.outlineOffset = "2px";
        el.setAttribute("data-editor-highlight", "true");
      }
    }
  }, [selectedNodeId, scenes, activeSceneIndex, currentFrame]);

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
        씬을 선택해주세요
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* 캔버스 영역 */}
      <div
        ref={canvasRef}
        className="flex-1 flex items-center justify-center p-6 overflow-hidden cursor-crosshair"
        onClick={handleCanvasClick}
      >
        <div
          className="w-full max-h-full aspect-video shadow-2xl"
          style={{ maxWidth: "calc(100vh * 16 / 9 - 120px)" }}
        >
          <Player
            key={playerKey}
            ref={playerRef}
            component={SingleSceneComposition}
            inputProps={{ scene }}
            durationInFrames={durationFrames}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={FPS}
            style={{ width: "100%", height: "100%" }}
            controls={false}
            clickToPlay={false}
            autoPlay={false}
            loop={false}
            numberOfSharedAudioTags={0}
          />
        </div>
      </div>

      {/* 프레임 스크러버 */}
      <div className="px-4 py-2 border-t border-white/10 flex items-center gap-3">
        <span className="text-[10px] text-white/40 tabular-nums w-10">
          {currentFrame}f
        </span>
        <input
          type="range"
          min={0}
          max={durationFrames - 1}
          value={currentFrame}
          onChange={(e) => handleFrameChange(Number(e.target.value))}
          className="flex-1 h-1 accent-purple-500 cursor-pointer"
        />
        <span className="text-[10px] text-white/40 tabular-nums w-10 text-right">
          {durationFrames}f
        </span>
      </div>
    </div>
  );
}
