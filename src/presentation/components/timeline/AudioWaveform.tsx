// @TASK P2-S1-T1 - 타임라인 에디터 UI - AudioWaveform
// @SPEC specs/layout.md

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { BeatMarker } from "@/types";

export interface AudioWaveformProps {
  waveform: number[];
  beatMarkers: BeatMarker[];
  currentTimeMs: number;
  durationMs: number;
  className?: string;
}

export function AudioWaveform({
  waveform,
  beatMarkers,
  currentTimeMs,
  durationMs,
  className,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (waveform.length === 0) return;

    // 파형 그리기
    const barWidth = Math.max(1, width / waveform.length);
    const midY = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7;

    waveform.forEach((amplitude, i) => {
      const x = i * barWidth;
      const barH = Math.max(2, amplitude * (height * 0.8));
      ctx.fillStyle = "#00FF00";
      ctx.globalAlpha = 0.5 + amplitude * 0.5;
      ctx.fillRect(x, midY - barH / 2, Math.max(1, barWidth - 0.5), barH);
    });

    ctx.globalAlpha = 1;

    // 비트 마커 그리기
    if (durationMs > 0) {
      beatMarkers.forEach((marker) => {
        const x = (marker.time_ms / durationMs) * width;
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
    }

    ctx.globalAlpha = 1;

    // 플레이헤드 그리기
    if (durationMs > 0) {
      const headX = (currentTimeMs / durationMs) * width;
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.moveTo(headX, 0);
      ctx.lineTo(headX, height);
      ctx.stroke();
    }
  }, [waveform, beatMarkers, currentTimeMs, durationMs]);

  return (
    <div
      className={cn("relative w-full", className)}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="audio waveform with beat markers"
        width={800}
        height={72}
        className="w-full h-full block bg-surface rounded"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
