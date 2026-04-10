// StackRenderer - 재귀적 스택 노드 트리 렌더러
// enterAt 기반 개별 애니메이션 타이밍

import React from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import type { StackNode, LayoutProps } from "@/types/stack-nodes";
import { NODE_REGISTRY, CONTAINER_TYPES } from "../nodes/registry";
import type { MotionPreset } from "./MotionWrapper";
import { SceneThemeContext, getPaletteForScene } from "./theme";
import { ScatterLayoutRenderer } from "../nodes/ScatterLayout";

interface StackRendererProps {
  node: StackNode;
  frame: number;
  durationFrames: number;
  subtitles?: Array<{ startTime: number; endTime: number; text: string }>;
  sceneStartSec?: number;
  nodeIndex?: number;
  totalSiblings?: number;
  sceneIndex?: number;
}

// ---------------------------------------------------------------------------
// Motion: enterAt 기반 개별 애니메이션
// ---------------------------------------------------------------------------

function computeMotionStyle(
  preset: string,
  localFrame: number,
  duration: number,
  fps: number,
): React.CSSProperties {
  const d = Math.max(duration, 1);
  const ease = { easing: Easing.out(Easing.cubic) };
  const clampOpts = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    ...ease,
  };

  switch (preset) {
    case "fadeUp": {
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      const ty = interpolate(localFrame, [0, d], [24, 0], clampOpts);
      return { opacity, transform: `translateY(${ty}px)` };
    }
    case "popNumber":
    case "popBadge": {
      const scale = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, stiffness: 120, mass: 0.8 },
      });
      const opacity = interpolate(localFrame, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        ...ease,
      });
      return { opacity, transform: `scale(${scale})` };
    }
    case "staggerChildren":
    case "fadeIn": {
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      return { opacity };
    }
    case "drawConnector":
    case "wipeBar": {
      const progress = spring({
        frame: localFrame,
        fps,
        config: { damping: 15, stiffness: 80, mass: 0.6 },
      });
      const opacity = interpolate(localFrame, [0, Math.min(d, 8)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {
        transform: `scaleX(${progress})`,
        transformOrigin: "left center",
        opacity,
      };
    }
    case "slideSplit": {
      const tx = interpolate(localFrame, [0, d], [-40, 0], clampOpts);
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      return { opacity, transform: `translateX(${tx}px)` };
    }
    case "slideRight": {
      const tx = interpolate(localFrame, [0, d], [40, 0], clampOpts);
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      return { opacity, transform: `translateX(${tx}px)` };
    }
    case "revealMask": {
      const clip = interpolate(localFrame, [0, d], [0, 100], clampOpts);
      return { clipPath: `inset(0 ${100 - clip}% 0 0)` };
    }
    case "countUp": {
      const opacity = interpolate(localFrame, [0, 8], [0, 1], clampOpts);
      return { opacity };
    }
    case "pulseAccent": {
      const easeInOut = { easing: Easing.inOut(Easing.sin) };
      const scale = interpolate(localFrame, [0, 15, 30], [1, 1.04, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        ...easeInOut,
      });
      return { transform: `scale(${scale})` };
    }
    case "scaleIn": {
      const sc = interpolate(localFrame, [0, d], [0.8, 1], clampOpts);
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      return { opacity, transform: `scale(${sc})` };
    }
    case "blurIn": {
      const blur = interpolate(localFrame, [0, d], [10, 0], clampOpts);
      const opacity = interpolate(localFrame, [0, d], [0, 1], clampOpts);
      return { opacity, filter: `blur(${blur}px)` };
    }
    case "bounceUp": {
      const ty = spring({
        frame: localFrame,
        fps,
        config: { damping: 10, stiffness: 150, mass: 0.6 },
      });
      const opacity = interpolate(localFrame, [0, 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${(1 - ty) * 30}px)` };
    }
    case "typewriter": {
      const clip = interpolate(localFrame, [0, d], [0, 100], clampOpts);
      return { clipPath: `inset(0 ${100 - clip}% 0 0)` };
    }
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Container CSS from layout props
// ---------------------------------------------------------------------------

function getContainerCSS(node: StackNode): React.CSSProperties {
  const L = node.layout ?? {};
  const S = node.style ?? {};

  switch (node.type) {
    case "SceneRoot":
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        flex: 1,
        gap: L.gap ?? 24,
        padding: L.padding ?? "60px 120px 140px",
        textAlign: "center",
        wordBreak: "keep-all" as const,
        overflowWrap: "break-word" as const,
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    case "Stack":
      return {
        display: "flex",
        flexDirection: L.direction === "row" ? "row" : "column",
        alignItems: cssAlign(L.align ?? "center"),
        justifyContent: cssJustify(L.justify ?? "center"),
        gap: L.gap ?? 16,
        flexWrap: L.wrap ? "wrap" : "nowrap",
        textAlign: "center",
        width: L.width ?? "100%",
        maxWidth: L.maxWidth ?? "100%",
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    case "Grid": {
      const cols = L.columns ?? 2;
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: L.gap ?? 28,
        justifyContent: "center",
        alignItems: "stretch",
        width: L.width ?? "100%",
        maxWidth: L.maxWidth ?? 1200,
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    }
    case "Split": {
      return {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "stretch",
        justifyContent: "center",
        gap: L.gap ?? 40,
        width: L.width ?? "100%",
        maxWidth: L.maxWidth ?? 1100,
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    }
    case "Overlay":
      return {
        position: "relative",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    case "FrameBox":
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: L.gap ?? 16,
        padding: L.padding ?? 24,
        border: (S.border as string) ?? `1.5px solid rgba(255, 255, 255, 0.15)`,
        borderRadius: (S.radius as number) ?? 16,
        background: (S.background as string) ?? "transparent",
        width: L.width ?? "fit-content",
        maxWidth: L.maxWidth ?? "100%",
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    case "AnchorBox": {
      const anchorCSS = anchorToCSS(
        L.anchor ?? "bottom-center",
        L.offsetX ?? 0,
        L.offsetY ?? 0,
      );
      return {
        position: "absolute",
        ...anchorCSS,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: L.gap ?? 8,
        ...(S as React.CSSProperties),
      };
    }
    case "SafeArea":
      return {
        paddingTop: L.paddingTop ?? 80,
        paddingBottom: L.paddingBottom ?? 120,
        paddingLeft: L.paddingLeft ?? 120,
        paddingRight: L.paddingRight ?? 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        ...(S as React.CSSProperties),
      };
    default:
      return {};
  }
}

function cssAlign(a: string): string {
  const m: Record<string, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };
  return m[a] ?? "center";
}

function cssJustify(j: string): string {
  const m: Record<string, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    "space-between": "space-between",
    "space-around": "space-around",
  };
  return m[j] ?? "center";
}

function anchorToCSS(
  anchor: string,
  ox: number,
  oy: number,
): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    "top-left": { top: oy, left: ox },
    "top-center": {
      top: oy,
      left: "50%",
      transform: `translateX(calc(-50% + ${ox}px))`,
    },
    "top-right": { top: oy, right: -ox },
    "center-left": {
      top: "50%",
      left: ox,
      transform: `translateY(calc(-50% + ${oy}px))`,
    },
    center: {
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
    },
    "center-right": {
      top: "50%",
      right: -ox,
      transform: `translateY(calc(-50% + ${oy}px))`,
    },
    "bottom-left": { bottom: -oy, left: ox },
    "bottom-center": {
      bottom: -oy,
      left: "50%",
      transform: `translateX(calc(-50% + ${ox}px))`,
    },
    "bottom-right": { bottom: -oy, right: -ox },
  };
  return map[anchor] ?? map["center"];
}

// ---------------------------------------------------------------------------
// Recursive Renderer
// ---------------------------------------------------------------------------

const RenderNode: React.FC<StackRendererProps> = ({
  node,
  frame,
  durationFrames,
  subtitles,
  sceneStartSec = 0,
  nodeIndex = 0,
  totalSiblings = 1,
}) => {
  const { fps } = useVideoConfig();
  const isContainer = CONTAINER_TYPES.has(node.type);
  const isOverlay = node.type === "Overlay";

  // Use node's explicit enterAt if defined; otherwise keep 0 (instant)
  // sync-enterAt.ts handles subtitle timing in JSON — no dynamic override here
  const enterAt = node.motion?.enterAt ?? 0;

  const motionDuration = node.motion?.duration ?? 15;
  const preset = node.motion?.preset ?? "";
  const localFrame = frame - enterAt;

  const motionStyle = preset
    ? computeMotionStyle(preset, Math.max(0, localFrame), motionDuration, fps)
    : {};

  // ScatterLayout: position:absolute 기반 산재 배치 컨테이너
  if (node.type === "ScatterLayout") {
    return (
      <ScatterLayoutRenderer
        node={node}
        frame={frame}
        durationFrames={durationFrames}
        renderChild={(child, i) => (
          <RenderNode
            key={child.id}
            node={child}
            frame={frame}
            durationFrames={durationFrames}
            subtitles={subtitles}
            sceneStartSec={sceneStartSec}
            nodeIndex={i}
            totalSiblings={node.children?.length ?? 1}
          />
        )}
      />
    );
  }

  // Container nodes
  if (isContainer) {
    const containerCSS = getContainerCSS(node);
    const children = node.children ?? [];

    const isSplit = node.type === "Split";
    const splitRatios = isSplit ? (node.layout?.ratio ?? [1, 1]) : [];
    const isRowStack = node.type === "Stack" && (node.layout?.direction === "row");

    const renderedChildren = children.map((child, i) => {
      const childNode = (
        <RenderNode
          key={child.id}
          node={child}
          frame={frame}
          durationFrames={durationFrames}
          subtitles={subtitles}
          sceneStartSec={sceneStartSec}
          nodeIndex={i}
          totalSiblings={children.length}
        />
      );

      if (isSplit) {
        const ratio = splitRatios[i] ?? 1;
        return (
          <div
            key={child.id}
            style={{
              flex: `${ratio} 1 0%`,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            {childNode}
          </div>
        );
      }

      // Row Stack: flex wrapper to prevent motion wrapper width:100% from breaking layout
      if (isRowStack) {
        const childStyle = (child.style ?? {}) as Record<string, unknown>;
        const FIXED_LEAF = new Set([
          "ArrowConnector", "LineConnector", "Icon", "Badge", "Pill",
          "Divider", "Kicker", "FooterCaption",
        ]);
        const isFixed =
          FIXED_LEAF.has(child.type) ||
          childStyle.flexShrink === 0;
        const isChildContainer = CONTAINER_TYPES.has(child.type);
        // Fixed: no grow/shrink. Container: grow to fill. Leaf content: natural size, can shrink.
        const flex = isFixed ? "0 0 auto" : isChildContainer ? "1 1 0%" : "0 1 auto";
        return (
          <div
            key={child.id}
            style={{
              flex,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            {childNode}
          </div>
        );
      }

      // Grid: no wrapper — CSS Grid align-items:stretch handles equal height

      return childNode;
    });

    const content = isOverlay ? (
      <div data-node-id={node.id} style={containerCSS}>
        {renderedChildren.map((child, i) => (
          <div
            key={i}
            style={
              i === 0
                ? { position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }
                : {
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }
            }
          >
            {child}
          </div>
        ))}
      </div>
    ) : (
      <div data-node-id={node.id} style={containerCSS}>{renderedChildren}</div>
    );

    if (preset) {
      return (
        <div
          style={{
            ...motionStyle,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content}
        </div>
      );
    }

    return content;
  }

  // Leaf nodes
  const Component = NODE_REGISTRY[node.type];
  if (!Component) {
    return (
      <div
        data-node-id={node.id}
        style={{
          color: "#FF4444",
          fontFamily: "Inter",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        Unknown: {node.type}
      </div>
    );
  }

  // absolute 위치 노드: 모션 래퍼에서 position을 처리하고 내부에선 제거
  const nodeStyle = (node.style ?? {}) as Record<string, unknown>;
  const isAbsolute = nodeStyle.position === "absolute";
  let renderNode = node;
  if (isAbsolute && preset) {
    const { position, ...restStyle } = nodeStyle;
    renderNode = { ...node, style: restStyle };
  }

  const rendered = (
    <Component node={renderNode} frame={frame} durationFrames={durationFrames} />
  );

  // leaf layout 치수: node.layout에 명시된 width/height/maxWidth를 래퍼에 적용
  const leafLayout = node.layout ?? {};
  const leafWidth = leafLayout.width;
  const leafHeight = leafLayout.height;
  const leafMaxWidth = leafLayout.maxWidth;

  if (preset) {
    if (isAbsolute) {
      return (
        <div
          data-node-id={node.id}
          style={{
            ...motionStyle,
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {rendered}
        </div>
      );
    }
    return (
      <div
        data-node-id={node.id}
        style={{
          ...motionStyle,
          width: leafWidth ?? "100%",
          height: leafHeight,
          maxWidth: leafMaxWidth,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {rendered}
      </div>
    );
  }

  // layout 치수가 있으면 실제 박스로 래핑, 없으면 display:contents 유지
  const hasLeafDims = leafWidth != null || leafHeight != null || leafMaxWidth != null;
  if (hasLeafDims) {
    return (
      <div
        data-node-id={node.id}
        style={{ width: leafWidth, height: leafHeight, maxWidth: leafMaxWidth }}
      >
        {rendered}
      </div>
    );
  }

  return <div data-node-id={node.id} style={{ display: "contents" }}>{rendered}</div>;
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const StackRenderer: React.FC<StackRendererProps> = ({
  node,
  frame,
  durationFrames,
  subtitles,
  sceneStartSec,
  sceneIndex,
}) => {
  const palette = getPaletteForScene(sceneIndex ?? 0);
  return (
    <SceneThemeContext.Provider value={palette}>
      <RenderNode
        node={node}
        frame={frame}
        durationFrames={durationFrames}
        subtitles={subtitles}
        sceneStartSec={sceneStartSec}
        nodeIndex={0}
        totalSiblings={1}
      />
    </SceneThemeContext.Provider>
  );
};
