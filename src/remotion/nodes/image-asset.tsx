// Media Nodes: ImageAsset (PNG/JPG/GIF)
import React from "react";
import { staticFile } from "remotion";
import { Gif } from "@remotion/gif";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

export const ImageAssetRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();

  // Support both staticFile paths (e.g. "assets/thinking.gif") and full URLs
  const rawSrc: string | undefined = d.src;
  const src = rawSrc
    ? rawSrc.startsWith("http") ? rawSrc : staticFile(rawSrc)
    : undefined;
  const isGif = rawSrc?.toLowerCase().endsWith(".gif") ?? false;
  const alt: string = d.alt ?? "";
  const caption: string | undefined = d.caption;
  const objectFit: "contain" | "cover" = d.objectFit ?? "contain";
  const rounded: boolean = d.rounded ?? false;
  const showBorder: boolean = d.border ?? false;
  const showShadow: boolean = d.shadow ?? false;
  const maxHeight: number = d.maxHeight ?? 300;

  // Fade-in animation
  const enterAt: number = node.motion?.enterAt ?? 0;
  const fadeDuration: number = node.motion?.duration ?? 10;
  const localFrame = Math.max(0, frame - enterAt);
  const opacity = Math.min(1, localFrame / Math.max(1, fadeDuration));

  const borderRadius = rounded ? 16 : 0;
  const boxShadow = showShadow
    ? `0 8px 40px rgba(0, 0, 0, 0.55), 0 0 20px ${P.accentGlow}`
    : undefined;
  const border = showBorder ? `2px solid ${P.borderAccentStrong}` : undefined;

  // Placeholder when src is missing
  if (!src) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          maxHeight,
          height: maxHeight,
          width: "100%",
          borderRadius,
          border: `2px dashed ${P.borderAccentStrong}`,
          backgroundColor: P.accentTint,
          opacity,
          ...(node.style as React.CSSProperties),
        }}
      >
        <svg
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          stroke={P.accentBright}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span
          style={{
            fontFamily: T.font,
            fontSize: 14,
            color: P.accentBright,
            opacity: 0.7,
          }}
        >
          이미지 없음
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        alignSelf: "center",
        opacity,
        ...(node.style as React.CSSProperties),
      }}
    >
      <div
        style={{
          maxHeight,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius,
          border,
          boxShadow,
        }}
      >
        {isGif && src ? (
          <Gif
            src={src}
            width={node.layout?.width ? Number(node.layout.width) : undefined}
            height={maxHeight}
            fit={objectFit}
            style={{ borderRadius, display: "block", maxHeight, width: "100%" }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            style={{
              maxHeight,
              width: "100%",
              objectFit,
              borderRadius,
              display: "block",
            }}
          />
        )}
      </div>
      {caption && (
        <span
          style={{
            fontFamily: T.font,
            fontSize: 16,
            color: T.textSecondary,
            textAlign: "center",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
};
