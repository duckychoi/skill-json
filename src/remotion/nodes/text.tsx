// Text Nodes: Kicker, Headline, RichText, BodyText, BulletList, StatNumber, QuoteText, FooterCaption
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

function highlightTokens(text: string, tokens: string[] = [], accentColor: string): React.ReactNode {
  if (!tokens.length) return text;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    tokens.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export const KickerRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <span
      style={{
        fontFamily: T.font,
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: P.accentBright,
        backgroundColor: P.accentTint,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "6px 18px",
        borderRadius: 6,
        border: `1px solid ${P.accent}`,
        boxShadow: `0 0 16px ${P.accentGlow}`,
        display: "inline-block",
        textAlign: "center",
        textShadow: `0 0 10px ${P.accentGlow}`,
        ...(node.style as React.CSSProperties),
      }}
    >
      {d.text ?? ""}
    </span>
  );
};

const HEADLINE_SIZES: Record<string, number> = {
  sm: 39,
  md: 49,
  lg: 59,
  xl: 67,
};

export const HeadlineRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const fontSize = HEADLINE_SIZES[d.size ?? "lg"] ?? 36;
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize,
        fontWeight: 800,
        lineHeight: 1.18,
        color: T.textPrimary,
        whiteSpace: "pre-line",
        textAlign: "center",
        wordBreak: "keep-all",
        overflowWrap: "break-word",
        width: "100%",
        textShadow: `0 4px 32px rgba(0,0,0,0.8), 0 0 20px ${P.accentGlow}`,
        letterSpacing: "-0.02em",
        ...(node.style as React.CSSProperties),
      }}
    >
      {highlightTokens(d.text ?? "", d.emphasis, P.accentBright)}
    </div>
  );
};

export const RichTextRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const segments: Array<{ text: string; tone?: string }> = d.segments ?? [];
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: "center",
        color: T.textSecondary,
        ...(node.style as React.CSSProperties),
      }}
    >
      {segments.map((seg, i) => (
        <span
          key={i}
          style={{
            color: seg.tone === "accent" ? P.accentBright : T.textSecondary,
            fontWeight: seg.tone === "accent" ? 700 : 500,
          }}
        >
          {seg.text}
        </span>
      ))}
    </div>
  );
};

export const BodyTextRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize: 23,
        fontWeight: 400,
        lineHeight: 1.55,
        color: T.textSecondary,
        whiteSpace: "pre-line",
        textAlign: "center",
        wordBreak: "keep-all",
        overflowWrap: "break-word",
        ...(node.style as React.CSSProperties),
      }}
    >
      {highlightTokens(d.text ?? "", d.emphasis, P.accentBright)}
    </div>
  );
};

export const BulletListRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const items: string[] = d.items ?? [];
  const bulletStyle = d.bulletStyle ?? "dot";
  const bullet =
    bulletStyle === "check" ? "✓" : bulletStyle === "dash" ? "–" : "•";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        ...(node.style as React.CSSProperties),
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "baseline", gap: 8 }}
        >
          <span
            style={{
              color: P.accentBright,
              fontSize: 19,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {bullet}
          </span>
          <span
            style={{
              fontFamily: T.font,
              fontSize: 23,
              color: T.textSecondary,
              lineHeight: 1.5,
              wordBreak: "keep-all",
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatNumberRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        ...(node.style as React.CSSProperties),
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily: T.font,
            fontSize: 83,
            fontWeight: 900,
            color: T.textPrimary,
            lineHeight: 1,
            textShadow: `0 0 50px ${P.accentGlow}, 0 4px 16px rgba(0,0,0,0.4)`,
          }}
        >
          {d.value ?? "0"}
        </span>
        {d.suffix && (
          <span
            style={{
              fontFamily: T.font,
              fontSize: 27,
              fontWeight: 700,
              color: P.accentVivid,
              marginLeft: 4,
            }}
          >
            {d.suffix}
          </span>
        )}
      </div>
      {d.label && (
        <span
          style={{
            fontFamily: T.font,
            fontSize: 20,
            color: T.textSecondary,
            textAlign: "center",
          }}
        >
          {d.label}
        </span>
      )}
    </div>
  );
};

export const QuoteTextRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize: 30,
        fontWeight: 600,
        fontStyle: "italic",
        lineHeight: 1.4,
        color: T.textPrimary,
        textAlign: "center",
        textShadow: `0 2px 16px rgba(0,0,0,0.5), 0 0 14px ${P.accentGlow}`,
        ...(node.style as React.CSSProperties),
      }}
    >
      <span
        style={{
          color: P.accentBright,
          fontSize: 34,
          verticalAlign: "top",
          lineHeight: 0.5,
          marginRight: 4,
        }}
      >
        &ldquo;
      </span>
      {d.text ?? ""}
      <span
        style={{
          color: P.accentBright,
          fontSize: 34,
          verticalAlign: "bottom",
          lineHeight: 0.5,
          marginLeft: 4,
        }}
      >
        &rdquo;
      </span>
    </div>
  );
};

export const FooterCaptionRenderer: React.FC<NodeProps> = ({ node }) => {
  const d = node.data ?? {};
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize: 19,
        fontWeight: 500,
        color: T.textMuted,
        textAlign: "center",
        ...(node.style as React.CSSProperties),
      }}
    >
      {d.text ?? ""}
    </div>
  );
};
