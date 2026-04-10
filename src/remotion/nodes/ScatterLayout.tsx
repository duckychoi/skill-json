// ScatterLayout - 자식 노드를 원형/나선/랜덤 패턴으로 산재 배치하는 컨테이너
// deterministic 위치 계산: Math.random() 사용 금지, index 기반 seed 사용

import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import type { StackNode } from "@/types/stack-nodes";
import { SvgIcon } from "../common/SvgIcons";
import { T, useScenePalette } from "../common/theme";

// ---------------------------------------------------------------------------
// 타입
// ---------------------------------------------------------------------------

export interface ScatterLayoutData {
  pattern: "orbit" | "random" | "spiral";
  radius?: number;
  centerIcon?: string;
  centerSize?: number;
  centerLabel?: string;
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-random: index + seed 기반
// Remotion은 매 프레임 재렌더하므로 Math.random() 사용 금지
// ---------------------------------------------------------------------------

function seededOffset(index: number, salt: number, scale: number): number {
  // 단순 LCG (Linear Congruential Generator) 기반 deterministic noise
  const val = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return (val - Math.floor(val) - 0.5) * 2 * scale;
}

// ---------------------------------------------------------------------------
// 패턴별 위치 계산
// ---------------------------------------------------------------------------

function getOrbitPosition(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  // 12시 방향(-π/2)에서 시작, 시계 방향 등간격
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function getRandomPosition(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  // orbit 기반 + deterministic 오프셋으로 불규칙성 추가
  const base = getOrbitPosition(index, total, radius, cx, cy);
  const jitterX = seededOffset(index, 1, radius * 0.22);
  const jitterY = seededOffset(index, 2, radius * 0.22);
  return {
    x: base.x + jitterX,
    y: base.y + jitterY,
  };
}

function getSpiralPosition(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  // 나선: 인덱스가 증가할수록 반경도 점진적으로 증가
  const t = total <= 1 ? 0 : index / (total - 1);
  const r = radius * (0.55 + 0.45 * t);
  // 2바퀴 회전
  const angle = 2 * Math.PI * 2 * t - Math.PI / 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function getChildPosition(
  pattern: ScatterLayoutData["pattern"],
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  switch (pattern) {
    case "random":
      return getRandomPosition(index, total, radius, cx, cy);
    case "spiral":
      return getSpiralPosition(index, total, radius, cx, cy);
    case "orbit":
    default:
      return getOrbitPosition(index, total, radius, cx, cy);
  }
}

// ---------------------------------------------------------------------------
// ScatterLayoutRenderer
// StackRenderer가 ScatterLayout 컨테이너를 감지하면 이 컴포넌트로 분기
// ---------------------------------------------------------------------------

interface ScatterLayoutRendererProps {
  node: StackNode;
  frame: number;
  durationFrames: number;
  renderChild: (child: StackNode, index: number) => React.ReactNode;
}

export const ScatterLayoutRenderer: React.FC<ScatterLayoutRendererProps> = ({
  node,
  frame,
  renderChild,
}) => {
  const { fps } = useVideoConfig();
  const P = useScenePalette();
  const d = (node.data ?? {}) as ScatterLayoutData;

  const pattern: ScatterLayoutData["pattern"] = d.pattern ?? "orbit";
  const radius: number = d.radius ?? 200;
  const centerIcon: string | undefined = d.centerIcon;
  const centerSize: number = d.centerSize ?? 80;
  const centerLabel: string | undefined = d.centerLabel;

  // 컨테이너 치수
  const L = node.layout ?? {};
  const S = node.style ?? {};
  const containerW: number = typeof L.width === "number" ? L.width : 600;
  const containerH: number = typeof L.height === "number" ? L.height : 400;
  const cx = containerW / 2;
  const cy = containerH / 2;

  // 모션
  const enterAt = node.motion?.enterAt ?? 0;
  const motionDur = node.motion?.duration ?? 20;
  const preset = node.motion?.preset ?? "";
  const localFrame = Math.max(0, frame - enterAt);

  // 컨테이너 전체 등장 애니메이션
  let containerOpacity = 1;
  let containerTransform = "none";
  if (preset === "fadeIn" || preset === "staggerChildren") {
    containerOpacity = interpolate(localFrame, [0, motionDur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (preset === "scaleIn") {
    const sc = interpolate(localFrame, [0, motionDur], [0.8, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    containerOpacity = interpolate(localFrame, [0, motionDur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    containerTransform = `scale(${sc})`;
  } else if (preset === "fadeUp") {
    const ty = interpolate(localFrame, [0, motionDur], [24, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    containerOpacity = interpolate(localFrame, [0, motionDur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    containerTransform = `translateY(${ty}px)`;
  }

  const children = node.children ?? [];
  const total = children.length;

  // 중앙 아이콘 등장
  const centerSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.7 },
  });
  const centerScale = Math.min(1, centerSpring);

  // 자식 노드 stagger: 중앙 이후 순차 등장
  const staggerDelay = 4; // 프레임 단위 stagger 간격

  return (
    <div
      data-node-id={node.id}
      style={{
        position: "relative",
        flexShrink: 0,
        opacity: containerOpacity,
        transform: containerTransform,
        ...(S as React.CSSProperties),
        // style의 width/height가 덮어써도 containerW/H를 최종 값으로 고정
        width: containerW,
        height: containerH,
      }}
    >
      {/* 궤도 링 (orbit 패턴일 때 시각적 가이드) */}
      {pattern === "orbit" && (
        <svg
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          width={containerW}
          height={containerH}
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={T.borderDefault}
            strokeWidth={1}
            strokeDasharray="4 8"
            opacity={0.5}
          />
        </svg>
      )}

      {/* 중앙 아이콘 */}
      {(centerIcon || centerLabel) && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${centerScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          {/* 중앙 글로우 배경 */}
          <div
            style={{
              position: "absolute",
              width: centerSize + 40,
              height: centerSize + 40,
              borderRadius: "50%",
              background: P.accentGlow,
              filter: "blur(16px)",
              opacity: 0.6,
            }}
          />
          {/* 중앙 원형 프레임 */}
          <div
            style={{
              position: "relative",
              width: centerSize + 20,
              height: centerSize + 20,
              borderRadius: "50%",
              background: T.bgSurface,
              border: `2px solid ${P.borderAccentStrong}`,
              boxShadow: `0 0 24px ${P.accentGlow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {centerIcon && (
              <SvgIcon name={centerIcon} size={centerSize} color={P.accentBright} />
            )}
          </div>
          {/* 중앙 라벨 */}
          {centerLabel && (
            <span
              style={{
                fontFamily: T.font,
                fontSize: 14,
                fontWeight: 700,
                color: P.accentBright,
                textAlign: "center",
                textShadow: `0 0 10px ${P.accentGlow}`,
                whiteSpace: "nowrap",
                position: "relative",
              }}
            >
              {centerLabel}
            </span>
          )}
        </div>
      )}

      {/* 자식 노드들 — position:absolute로 산재 배치 */}
      {children.map((child, i) => {
        const pos = getChildPosition(pattern, i, total, radius, cx, cy);

        // 각 자식의 stagger 등장
        const childEnterFrame = staggerDelay * i;
        const childLocalFrame = Math.max(0, localFrame - childEnterFrame);
        const childSpring = spring({
          frame: childLocalFrame,
          fps,
          config: { damping: 14, stiffness: 110, mass: 0.65 },
        });
        const childScale = Math.min(1, childSpring);
        const childOpacity = interpolate(childLocalFrame, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={child.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${childScale})`,
              opacity: childOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {renderChild(child, i)}
          </div>
        );
      })}
    </div>
  );
};
