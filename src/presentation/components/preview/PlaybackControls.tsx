"use client";
// @TASK P3-S1-T1 - Remotion 프리뷰 UI - PlaybackControls
// @SPEC specs/preview.md

import { Play, Pause, Volume2 } from "lucide-react";

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentFrame: number;
  totalFrames: number;
  onSeek: (frame: number) => void;
}

const PLAYBACK_RATES = [0.5, 1, 1.5, 2] as const;

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  playbackRate,
  onPlaybackRateChange,
  volume,
  onVolumeChange,
  currentFrame,
  totalFrames,
  onSeek,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 bg-[#0a0a0a] border-t border-white/10">
      {/* Seek 슬라이더 */}
      <input
        type="range"
        aria-label="탐색"
        min={0}
        max={totalFrames}
        value={currentFrame}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full h-1 accent-[#c8ff00] cursor-pointer"
      />

      {/* 컨트롤 행 */}
      <div className="flex items-center justify-between gap-4">
        {/* 재생/정지 버튼 */}
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? "정지" : "재생"}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c8ff00] text-black hover:bg-[#b8ef00] transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* 재생속도 버튼들 */}
        <div className="flex items-center gap-1" role="group" aria-label="재생속도">
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              onClick={() => onPlaybackRateChange(rate)}
              aria-pressed={playbackRate === rate}
              className={[
                "px-2 py-1 rounded text-xs font-medium transition-colors",
                playbackRate === rate
                  ? "bg-[#c8ff00] text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20",
              ].join(" ")}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* 음량 슬라이더 */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white/60" aria-hidden="true" />
          <input
            type="range"
            aria-label="음량"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 h-1 accent-[#c8ff00] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
