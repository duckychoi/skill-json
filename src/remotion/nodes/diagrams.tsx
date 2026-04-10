// Diagram Nodes: CycleDiagram, FlowDiagram, TimelineStepper, PersonAvatar
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";
import { SvgIcon } from "../common/SvgIcons";

// ---------------------------------------------------------------------------
// CycleDiagramRenderer
// Circular process diagram with 3-6 numbered steps arranged in a circle
// ---------------------------------------------------------------------------
export const CycleDiagramRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const steps: Array<{ label: string }> = d.steps ?? [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
  ];
  const centerLabel: string = d.centerLabel ?? "";
  const centerSublabel: string = d.centerSublabel ?? "";
  const count = Math.max(3, Math.min(6, steps.length));

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 24;
  const localFrame = Math.max(0, frame - enterAt);

  // Each step appears sequentially
  const stepDur = dur / count;

  const SIZE = 400;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const ORBIT_R = 130;    // center of step circles on orbit
  const STEP_R = 30;      // radius of each step circle
  const CENTER_R = 62;    // radius of center circle

  // Curved arrow path between two points on the circle
  // Draws a clockwise arc from one step center to the next, offset outward slightly
  function arcBetween(fromIdx: number, toIdx: number): string {
    const angle1 = (2 * Math.PI * fromIdx) / count - Math.PI / 2;
    const angle2 = (2 * Math.PI * toIdx) / count - Math.PI / 2;
    const arrowR = ORBIT_R - STEP_R - 4;
    const x1 = CX + arrowR * Math.cos(angle1);
    const y1 = CY + arrowR * Math.sin(angle1);
    const x2 = CX + arrowR * Math.cos(angle2);
    const y2 = CY + arrowR * Math.sin(angle2);
    // Use the arc between the points along a slightly tighter circle
    const sweep = 1; // clockwise
    return `M ${x1} ${y1} A ${arrowR} ${arrowR} 0 0 ${sweep} ${x2} ${y2}`;
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...(node.style as React.CSSProperties),
    }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: "visible" }}
      >
        {/* Orbit ring — faint background circle */}
        <circle
          cx={CX}
          cy={CY}
          r={ORBIT_R}
          fill="none"
          stroke={T.borderDefault}
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />

        {/* Curved arrows between steps */}
        {steps.slice(0, count).map((_, i) => {
          const nextI = (i + 1) % count;
          const stepVisible = localFrame >= i * stepDur + stepDur * 0.6;
          if (!stepVisible) return null;
          const path = arcBetween(i, nextI);
          const angle2 = (2 * Math.PI * nextI) / count - Math.PI / 2;
          const arrowR = ORBIT_R - STEP_R - 4;
          // Arrowhead tip
          const tipX = CX + arrowR * Math.cos(angle2);
          const tipY = CY + arrowR * Math.sin(angle2);
          // Tangent direction at tip (perpendicular to radius)
          const tangentAngle = angle2 + Math.PI / 2;
          const aw = 6;
          const ah = 8;
          const ax1 = tipX - aw * Math.cos(tangentAngle - 0.4) - ah * Math.cos(angle2);
          const ay1 = tipY - aw * Math.sin(tangentAngle - 0.4) - ah * Math.sin(angle2);
          const ax2 = tipX + aw * Math.cos(tangentAngle + 0.4) - ah * Math.cos(angle2);
          const ay2 = tipY + aw * Math.sin(tangentAngle + 0.4) - ah * Math.sin(angle2);
          return (
            <g key={`arrow-${i}`} opacity={0.55}>
              <path
                d={path}
                fill="none"
                stroke={P.borderAccent}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <polygon
                points={`${tipX},${tipY} ${ax1},${ay1} ${ax2},${ay2}`}
                fill={P.borderAccent}
              />
            </g>
          );
        })}

        {/* Center circle */}
        <circle
          cx={CX}
          cy={CY}
          r={CENTER_R}
          fill={T.bgSurface}
          stroke={P.borderAccent}
          strokeWidth={2}
        />
        <circle
          cx={CX}
          cy={CY}
          r={CENTER_R}
          fill="none"
          stroke={P.accentGlow}
          strokeWidth={16}
        />
        {centerLabel && (
          <text
            x={CX}
            y={centerSublabel ? CY - 4 : CY + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={T.font}
            fontSize={18}
            fontWeight={700}
            fill={T.textPrimary}
          >
            {centerLabel}
          </text>
        )}
        {centerSublabel && (
          <text
            x={CX}
            y={CY + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={T.font}
            fontSize={12}
            fill={T.textMuted}
          >
            {centerSublabel}
          </text>
        )}

        {/* Step circles + labels */}
        {steps.slice(0, count).map((step, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const sx = CX + ORBIT_R * Math.cos(angle);
          const sy = CY + ORBIT_R * Math.sin(angle);

          // Label position: push outward from center
          const labelR = ORBIT_R + STEP_R + 22;
          const lx = CX + labelR * Math.cos(angle);
          const ly = CY + labelR * Math.sin(angle);

          const stepProgress = Math.min(1, Math.max(0, (localFrame - i * stepDur) / stepDur));
          const isActive = stepProgress > 0;
          const isFull = stepProgress >= 1;

          const circleColor = isActive ? P.accentBright : T.bgElevated;
          const borderColor = isActive ? P.accentBright : "rgba(255,255,255,0.18)";
          const glowOpacity = isFull ? 1 : stepProgress;

          return (
            <g key={i} opacity={isActive ? 1 : 0.35}>
              {/* Glow ring */}
              {isActive && (
                <circle
                  cx={sx}
                  cy={sy}
                  r={STEP_R + 6}
                  fill="none"
                  stroke={P.accentGlow}
                  strokeWidth={10}
                  opacity={glowOpacity * 0.6}
                />
              )}
              {/* Step circle */}
              <circle
                cx={sx}
                cy={sy}
                r={STEP_R}
                fill={isActive ? P.accentTint : T.bgElevated}
                stroke={borderColor}
                strokeWidth={2}
              />
              {/* Step number */}
              <text
                x={sx}
                y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={T.font}
                fontSize={15}
                fontWeight={700}
                fill={isActive ? P.accentBright : T.textMuted}
              >
                {i + 1}
              </text>
              {/* Label text */}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={T.font}
                fontSize={13}
                fontWeight={600}
                fill={isActive ? T.textPrimary : T.textMuted}
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// FlowDiagramRenderer
// Linear flow: boxes connected by arrows
// ---------------------------------------------------------------------------
export const FlowDiagramRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const steps: Array<{ title: string; subtitle?: string }> = d.steps ?? [
    { title: "Step 1" },
    { title: "Step 2" },
    { title: "Step 3" },
  ];

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 24;
  const localFrame = Math.max(0, frame - enterAt);
  const stepDur = dur / steps.length;

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      flexWrap: "nowrap",
      width: "100%",
      ...(node.style as React.CSSProperties),
    }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const stepProgress = Math.min(1, Math.max(0, (localFrame - i * stepDur) / stepDur));
        const isVisible = stepProgress > 0;
        const arrowVisible = isVisible && i < steps.length - 1;

        return (
          <React.Fragment key={i}>
            {/* Step box */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "16px 20px",
              borderRadius: 12,
              minWidth: 110,
              maxWidth: 180,
              flex: "1 1 0",
              background: isLast
                ? P.accentTint
                : "rgba(255,255,255,0.05)",
              border: isLast
                ? `2px solid ${P.accentBright}`
                : `1.5px solid rgba(255,255,255,0.14)`,
              boxShadow: isLast ? `0 0 18px ${P.accentGlow}` : "none",
              opacity: isVisible ? 1 : 0,
              textAlign: "center",
              transition: "opacity 0.1s",
            }}>
              {/* Step number badge */}
              <div style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isLast ? P.accentBright : "rgba(255,255,255,0.1)",
                color: isLast ? T.bgBase : T.textMuted,
                fontFamily: T.font,
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{
                fontFamily: T.font,
                fontSize: 16,
                fontWeight: 700,
                color: isLast ? P.accentBright : T.textPrimary,
                lineHeight: 1.25,
                wordBreak: "keep-all",
              }}>
                {step.title}
              </span>
              {step.subtitle && (
                <span style={{
                  fontFamily: T.font,
                  fontSize: 12,
                  color: T.textMuted,
                  lineHeight: 1.4,
                }}>
                  {step.subtitle}
                </span>
              )}
            </div>

            {/* Arrow connector */}
            {arrowVisible && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: "0 6px",
                opacity: stepProgress,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12h14m0 0l-5-5m5 5l-5 5"
                    stroke={P.accentBright}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.6}
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// TimelineStepperRenderer
// Vertical timeline with icon circles connected by a line
// ---------------------------------------------------------------------------
export const TimelineStepperRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const rawSteps: Array<Record<string, unknown>> = d.steps ?? [
    { title: "Step 1" },
    { title: "Step 2" },
    { title: "Step 3" },
  ];
  // label/desc도 title/subtitle로 호환
  const steps = rawSteps.map((s) => ({
    icon: s.icon as string | undefined,
    title: (s.title ?? s.label ?? "") as string,
    subtitle: (s.subtitle ?? s.desc) as string | undefined,
  }));

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 24;
  const localFrame = Math.max(0, frame - enterAt);
  const stepDur = dur / steps.length;

  const ICON_SIZE = 38;
  const LINE_OFFSET = ICON_SIZE / 2; // horizontal center of the icon column

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
      position: "relative",
      ...(node.style as React.CSSProperties),
    }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const stepProgress = Math.min(1, Math.max(0, (localFrame - i * stepDur) / stepDur));
        const isVisible = stepProgress > 0;

        return (
          <div key={i} style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            opacity: isVisible ? 1 : 0,
          }}>
            {/* Left column: icon + vertical line */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: ICON_SIZE,
              flexShrink: 0,
              marginRight: 16,
            }}>
              {/* Icon circle */}
              <div style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isLast ? P.accentTint : "rgba(255,255,255,0.10)",
                border: isLast
                  ? `2px solid ${P.accentBright}`
                  : `1.5px solid rgba(255,255,255,0.30)`,
                boxShadow: isLast ? `0 0 12px ${P.accentGlow}` : "none",
                flexShrink: 0,
                zIndex: 1,
                position: "relative",
              }}>
                {step.icon ? (
                  <SvgIcon
                    name={step.icon}
                    size={20}
                    color={isLast ? P.accentBright : "rgba(255,255,255,0.85)"}
                  />
                ) : (
                  // Numbered circle fallback
                  <span style={{
                    fontFamily: T.font,
                    fontSize: 14,
                    fontWeight: 700,
                    color: isLast ? P.accentBright : T.textMuted,
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              {/* Vertical connecting line (not on last item) */}
              {!isLast && (
                <div style={{
                  flex: 1,
                  width: 2,
                  background: `linear-gradient(to bottom, ${P.borderAccent}, rgba(255,255,255,0.06))`,
                  borderRadius: 1,
                  marginTop: 4,
                  minHeight: 28,
                }} />
              )}
            </div>

            {/* Right column: text content */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingBottom: isLast ? 0 : 24,
              paddingTop: 4,
              gap: 4,
              flex: 1,
              minWidth: 0,
            }}>
              <span style={{
                fontFamily: T.font,
                fontSize: 18,
                fontWeight: 700,
                color: isLast ? P.accentBright : "#ffffff",
                lineHeight: 1.3,
                wordBreak: "keep-all",
              }}>
                {step.title}
              </span>
              {step.subtitle && (
                <span style={{
                  fontFamily: T.font,
                  fontSize: 14,
                  color: T.textSecondary,
                  lineHeight: 1.5,
                }}>
                  {step.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PersonAvatarRenderer
// Person silhouette SVG with name and role
// ---------------------------------------------------------------------------
export const PersonAvatarRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const name: string = d.name ?? "";
  const role: string = d.role ?? "";
  const org: string = d.org ?? "";
  const isHighlighted = (d.variant ?? node.variant ?? "default") === "highlighted";

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 18;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur);

  // SVG avatar dimensions
  const AW = 90;
  const AH = 90;
  const headCX = AW / 2;
  const headCY = 30;
  const headR = 20;
  // Shoulders: arc from below the head downward
  const shoulderY = headCY + headR + 8;
  const shoulderW = 36;
  const shoulderH = 18;

  const ringColor = isHighlighted ? P.accentBright : "rgba(255,255,255,0.18)";
  const glowShadow = isHighlighted ? `0 0 20px ${P.accentGlow}` : "none";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      opacity: progress,
      ...(node.style as React.CSSProperties),
    }}>
      {/* Avatar SVG */}
      <div style={{
        position: "relative",
        width: AW + 16,
        height: AH + 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${ringColor}`,
          boxShadow: glowShadow,
        }} />
        <svg
          width={AW}
          height={AH}
          viewBox={`0 0 ${AW} ${AH}`}
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Background circle */}
          <circle
            cx={AW / 2}
            cy={AH / 2}
            r={AH / 2}
            fill={isHighlighted ? P.accentTint : T.bgSurface}
          />
          {/* Head */}
          <circle
            cx={headCX}
            cy={headCY}
            r={headR}
            fill={isHighlighted ? P.accentBright : "rgba(255,255,255,0.55)"}
          />
          {/* Shoulders (ellipse arc) */}
          <ellipse
            cx={headCX}
            cy={shoulderY + shoulderH}
            rx={shoulderW}
            ry={shoulderH}
            fill={isHighlighted ? P.accentBright : "rgba(255,255,255,0.45)"}
            clipPath={`url(#clip-avatar-${node.id})`}
          />
          <defs>
            <clipPath id={`clip-avatar-${node.id}`}>
              {/* Clip to only show the top half of the shoulders ellipse */}
              <rect x={0} y={shoulderY} width={AW} height={AH - shoulderY} />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Name */}
      {name && (
        <span style={{
          fontFamily: T.font,
          fontSize: 17,
          fontWeight: 700,
          color: isHighlighted ? P.accentBright : T.textPrimary,
          textAlign: "center",
          textShadow: isHighlighted ? `0 0 10px ${P.accentGlow}` : "none",
          lineHeight: 1.2,
          maxWidth: 140,
          wordBreak: "keep-all",
        }}>
          {name}
        </span>
      )}

      {/* Role */}
      {role && (
        <span style={{
          fontFamily: T.font,
          fontSize: 13,
          color: T.textMuted,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 140,
        }}>
          {role}
        </span>
      )}

      {/* Org */}
      {org && (
        <span style={{
          fontFamily: T.font,
          fontSize: 11,
          color: T.textMuted,
          textAlign: "center",
          opacity: 0.65,
          maxWidth: 140,
        }}>
          {org}
        </span>
      )}
    </div>
  );
};
