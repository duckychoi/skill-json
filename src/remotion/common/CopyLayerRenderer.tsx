// @TASK P2-R3-T1 - CopyLayerRenderer
// @SPEC docs/planning/02-trd.md
// copy_layers 객체를 렌더링하는 공통 컴포넌트

import React from "react";
import type { CopyLayers } from "@/types";
import { T } from "./theme";

interface CopyLayerRendererProps {
  copyLayers: CopyLayers;
  /** kicker 텍스트 스타일 오버라이드 */
  kickerStyle?: React.CSSProperties;
  /** headline 텍스트 스타일 오버라이드 */
  headlineStyle?: React.CSSProperties;
  /** supporting 텍스트 스타일 오버라이드 */
  supportingStyle?: React.CSSProperties;
  /** footer_caption 텍스트 스타일 오버라이드 */
  footerStyle?: React.CSSProperties;
}

const defaultStyles = {
  kicker: {
    color: T.textAccent,
    fontFamily: "Inter, sans-serif",
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: 16,
  },
  headline: {
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    fontSize: 72,
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 24,
  },
  supporting: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "Inter, sans-serif",
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  footer: {
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: "Inter, sans-serif",
    fontSize: 20,
    fontWeight: 400,
  },
};

export const CopyLayerRenderer: React.FC<CopyLayerRendererProps> = ({
  copyLayers,
  kickerStyle,
  headlineStyle,
  supportingStyle,
  footerStyle,
}) => {
  return (
    <div data-testid="copy-layer-renderer" style={{ display: "flex", flexDirection: "column" }}>
      {copyLayers.kicker && (
        <span
          data-testid="copy-kicker"
          style={{ ...defaultStyles.kicker, ...kickerStyle }}
        >
          {copyLayers.kicker}
        </span>
      )}

      <span
        data-testid="copy-headline"
        style={{ ...defaultStyles.headline, ...headlineStyle }}
      >
        {copyLayers.headline}
      </span>

      {copyLayers.supporting && (
        <span
          data-testid="copy-supporting"
          style={{ ...defaultStyles.supporting, ...supportingStyle }}
        >
          {copyLayers.supporting}
        </span>
      )}

      {copyLayers.footer_caption && (
        <span
          data-testid="copy-footer"
          style={{ ...defaultStyles.footer, ...footerStyle }}
        >
          {copyLayers.footer_caption}
        </span>
      )}
    </div>
  );
};
