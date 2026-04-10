"use client";
// @TASK P3-S1-T1 - Remotion 프리뷰 UI - /preview 페이지
// @SPEC specs/preview.md

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Player } from "@remotion/player";
import type { PlayerRef } from "@remotion/player";
import { FullWidthLayout } from "@/components/layout/FullWidthLayout";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PlaybackControls } from "@/components/preview/PlaybackControls";
import { SceneNavigation } from "@/components/preview/SceneNavigation";
import { MainComposition } from "@/remotion/Composition";
import type { Scene } from "@/types";

const FPS = 30;

export default function RemotionPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // projectId: URL 파라미터 → 로컬 스토리지 순서로 fallback
  const projectId =
    searchParams.get("projectId") ??
    (typeof window !== "undefined" ? localStorage.getItem("currentProjectId") : null) ??
    null;

  // ── 데이터 상태 ──────────────────────────────────────────────────────────
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── 재생 상태 ────────────────────────────────────────────────────────────
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const playerRef = useRef<PlayerRef | null>(null);

  // ── 전체 프레임 수 계산 ──────────────────────────────────────────────────
  const totalFrames = scenes.reduce((sum, s) => sum + s.duration_frames, 0) || 1;

  // ── 데이터 페칭 ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        const [projRes, scenesRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/scenes`),
        ]);

        if (!projRes.ok || !scenesRes.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const scenesData = await scenesRes.json();
        if (!cancelled) {
          setScenes(scenesData.scenes ?? []);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "알 수 없는 오류");
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [projectId]);

  // ── 장면 이동 시 해당 장면 시작 프레임으로 seek ──────────────────────────
  const getSceneStartFrame = useCallback(
    (index: number) =>
      scenes.slice(0, index).reduce((sum, s) => sum + s.duration_frames, 0),
    [scenes]
  );

  const handlePrev = useCallback(() => {
    const idx = Math.max(0, currentSceneIndex - 1);
    setCurrentSceneIndex(idx);
    const frame = getSceneStartFrame(idx);
    setCurrentFrame(frame);
    playerRef.current?.seekTo(frame);
  }, [currentSceneIndex, getSceneStartFrame]);

  const handleNext = useCallback(() => {
    const idx = Math.min(scenes.length - 1, currentSceneIndex + 1);
    setCurrentSceneIndex(idx);
    const frame = getSceneStartFrame(idx);
    setCurrentFrame(frame);
    playerRef.current?.seekTo(frame);
  }, [currentSceneIndex, scenes.length, getSceneStartFrame]);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) {
      setIsPlaying((p) => !p);
      return;
    }
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const handleSeek = useCallback((frame: number) => {
    setCurrentFrame(frame);
    playerRef.current?.seekTo(frame);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  // ── 렌더링 ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      <PreviewHeader
        onBack={() => router.push("/")}
        onFullscreen={handleFullscreen}
        title="미리보기"
      />

      <FullWidthLayout className="flex flex-col flex-1 overflow-hidden bg-[#0a0a0a]">
        {/* 플레이어 영역 */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {isLoading && (
            <div className="text-white/50 text-sm">불러오는 중...</div>
          )}
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          {!isLoading && !error && (
            <div className="w-full max-w-5xl aspect-video">
              <Player
                ref={playerRef}
                component={MainComposition}
                inputProps={{ scenes }}
                durationInFrames={totalFrames}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={FPS}
                style={{ width: "100%", height: "100%" }}
                playbackRate={playbackRate}
                initiallyMuted={volume === 0}
              />
            </div>
          )}
        </div>

        {/* 하단 컨트롤 바 */}
        <div className="flex-shrink-0">
          {/* 장면 네비게이션 + 재생 컨트롤 */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-t border-white/10">
            <SceneNavigation
              currentSceneIndex={currentSceneIndex}
              totalScenes={Math.max(1, scenes.length)}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            <span className="text-white/40 text-xs">
              {Math.floor(currentFrame / FPS)}s / {Math.floor(totalFrames / FPS)}s
            </span>
          </div>

          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            playbackRate={playbackRate}
            onPlaybackRateChange={setPlaybackRate}
            volume={volume}
            onVolumeChange={setVolume}
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            onSeek={handleSeek}
          />
        </div>
      </FullWidthLayout>
    </div>
  );
}
