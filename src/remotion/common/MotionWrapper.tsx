// @TASK P2-R3-T1 - MotionWrapper
// @SPEC docs/planning/02-trd.md
// 10개 모션 프리셋을 적용하는 래퍼 컴포넌트
// Remotion의 interpolate() / spring() 활용

import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";

export type MotionPreset =
  | "fadeUp"
  | "popNumber"
  | "staggerChildren"
  | "drawConnector"
  | "pulseAccent"
  | "wipeBar"
  | "countUp"
  | "slideSplit"
  | "revealMask"
  | "popBadge";

interface MotionWrapperProps {
  children: React.ReactNode;
  preset: MotionPreset;
  frame: number;
  durationFrames: number;
  /** stagger 지연 (staggerChildren 전용, ms 단위) */
  staggerIndex?: number;
  style?: React.CSSProperties;
}

function computeStyle(
  preset: MotionPreset,
  frame: number,
  durationFrames: number,
  fps: number,
  staggerIndex = 0
): React.CSSProperties {
  const entranceEnd = Math.min(durationFrames * 0.4, 20);
  const staggerOffset = staggerIndex * 3;
  const f = Math.max(0, frame - staggerOffset);

  switch (preset) {
    case "fadeUp": {
      const opacity = interpolate(f, [0, entranceEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const translateY = interpolate(f, [0, entranceEnd], [40, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${translateY}px)` };
    }

    case "popNumber": {
      const scale = spring({ frame: f, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
      const opacity = interpolate(f, [0, 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})`, display: "inline-block" };
    }

    case "staggerChildren": {
      const opacity = interpolate(f, [0, entranceEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const translateY = interpolate(f, [0, entranceEnd], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${translateY}px)` };
    }

    case "drawConnector": {
      const scaleX = interpolate(f, [0, entranceEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { transform: `scaleX(${scaleX})`, transformOrigin: "left center" };
    }

    case "pulseAccent": {
      const scale = interpolate(f, [0, 10, 20], [1, 1.05, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { transform: `scale(${scale})` };
    }

    case "wipeBar": {
      const scaleX = spring({ frame: f, fps, config: { damping: 15, stiffness: 100 } });
      return { transform: `scaleX(${scaleX})`, transformOrigin: "left center" };
    }

    case "countUp": {
      const opacity = interpolate(f, [0, 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity };
    }

    case "slideSplit": {
      const translateX = interpolate(f, [0, entranceEnd], [-60, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(f, [0, entranceEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateX(${translateX}px)` };
    }

    case "revealMask": {
      const clipProgress = interpolate(f, [0, entranceEnd], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { clipPath: `inset(0 ${100 - clipProgress}% 0 0)` };
    }

    case "popBadge": {
      const scale = spring({
        frame: f,
        fps,
        config: { damping: 6, stiffness: 300, mass: 0.3 },
      });
      const opacity = interpolate(f, [0, 3], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})`, display: "inline-block" };
    }

    default:
      return {};
  }
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  preset,
  frame,
  durationFrames,
  staggerIndex = 0,
  style,
}) => {
  const { fps } = useVideoConfig();
  const motionStyle = computeStyle(preset, frame, durationFrames, fps, staggerIndex);

  return (
    <div
      data-testid={`motion-wrapper-${preset}`}
      style={{ ...motionStyle, ...style }}
    >
      {children}
    </div>
  );
};
