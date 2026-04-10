// Data Visualization Nodes: ScatterPlot, DataTable, StructuredDiagram
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

// ---------------------------------------------------------------------------
// ScatterPlot — 2D 좌표 공간 시각화
// data: { axisX: {label, negative?}, axisY?: {label, negative?},
//         center?: {label, radius}, points: [{label, x, y, group?}],
//         connections?: "center"|"chain"|"none" }
// ---------------------------------------------------------------------------
export const ScatterPlotRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 30;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / Math.max(1, dur));

  const axisX = d.axisX ?? {};
  const axisY = d.axisY ?? {};
  const center = d.center;
  const points: Array<{ label: string; x: number; y: number; group?: string }> = d.points ?? [];
  const connections: string = d.connections ?? "center";

  const W = 700;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const margin = 60;

  function toPixel(x: number, y: number): [number, number] {
    return [
      cx + x * (W / 2 - margin),
      cy - y * (H / 2 - margin),
    ];
  }

  const groupColors: Record<string, string> = {};
  const colorPalette = [P.accentBright, "#22C55E", "#F59E0B", "#3B82F6", "#E040FB"];
  let colorIdx = 0;
  points.forEach(p => {
    if (p.group && !groupColors[p.group]) {
      groupColors[p.group] = colorPalette[colorIdx % colorPalette.length];
      colorIdx++;
    }
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      opacity: progress, alignSelf: "center",
      ...(node.style as React.CSSProperties),
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {/* Grid lines */}
        <line x1={margin} y1={cy} x2={W - margin + 20} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={cx} y1={margin - 20} x2={cx} y2={H - margin} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {/* Axis arrows */}
        <polygon points={`${W - margin + 20},${cy} ${W - margin + 10},${cy - 6} ${W - margin + 10},${cy + 6}`} fill="rgba(255,255,255,0.4)" />
        <polygon points={`${cx},${margin - 20} ${cx - 6},${margin - 10} ${cx + 6},${margin - 10}`} fill="rgba(255,255,255,0.4)" />

        {/* Axis labels */}
        {axisX.label && (
          <text x={W - margin + 10} y={cy - 16} fill={P.accentBright} fontSize={16} fontWeight={700} fontFamily={T.font} textAnchor="end">
            {axisX.label}
          </text>
        )}
        {axisX.negative && (
          <text x={margin} y={cy - 16} fill={P.accentBright} fontSize={16} fontWeight={700} fontFamily={T.font} textAnchor="start">
            {axisX.negative}
          </text>
        )}
        {axisY.label && (
          <text x={cx + 12} y={margin - 8} fill={P.accentBright} fontSize={16} fontWeight={700} fontFamily={T.font} textAnchor="start">
            {axisY.label}
          </text>
        )}

        {/* Center circle */}
        {center && (
          <>
            <circle cx={cx} cy={cy} r={(center.radius ?? 60) * progress} fill="none" stroke={P.accentBright} strokeWidth={1.5} opacity={0.4} />
            <circle cx={cx} cy={cy} r={(center.radius ?? 60) * 0.5 * progress} fill={`${P.accentBright}15`} stroke={P.accentBright} strokeWidth={1} opacity={0.3} />
            {center.label && (
              <text x={cx} y={cy + 5} fill={P.accentBright} fontSize={14} fontFamily={T.font} textAnchor="middle" opacity={0.7}>
                {center.label}
              </text>
            )}
          </>
        )}

        {/* Connection lines */}
        {points.map((p, i) => {
          const [px, py] = toPixel(p.x * progress, p.y * progress);
          const color = p.group ? (groupColors[p.group] ?? P.accentBright) : P.accentBright;

          if (connections === "center") {
            return <line key={`line-${i}`} x1={cx} y1={cy} x2={px} y2={py} stroke={color} strokeWidth={1} opacity={0.35 * progress} />;
          }
          if (connections === "chain" && i > 0) {
            const [prevX, prevY] = toPixel(points[i - 1].x * progress, points[i - 1].y * progress);
            return <line key={`line-${i}`} x1={prevX} y1={prevY} x2={px} y2={py} stroke={color} strokeWidth={1.5} opacity={0.5 * progress} />;
          }
          return null;
        })}

        {/* Points + labels */}
        {points.map((p, i) => {
          const [px, py] = toPixel(p.x * progress, p.y * progress);
          const color = p.group ? (groupColors[p.group] ?? P.accentBright) : P.accentBright;
          const delay = i * 3;
          const pointProgress = Math.min(1, Math.max(0, (localFrame - delay) / Math.max(1, dur * 0.6)));

          return (
            <g key={`point-${i}`} opacity={pointProgress}>
              <circle cx={px} cy={py} r={6} fill={color} />
              <circle cx={px} cy={py} r={10} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
              <text x={px} y={py - 14} fill={T.textPrimary} fontSize={14} fontWeight={600} fontFamily={T.font} textAnchor="middle">
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Scatter background dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const sx = margin + 30 + (i * 53) % (W - margin * 2);
          const sy = margin + 20 + (i * 37 + 17) % (H - margin * 2);
          return <circle key={`bg-${i}`} cx={sx} cy={sy} r={3} fill="rgba(255,255,255,0.1)" />;
        })}
      </svg>

      {/* Group legend */}
      {Object.keys(groupColors).length > 1 && (
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {Object.entries(groupColors).map(([name, color]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSecondary }}>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// DataTable — 다중 행 비교 테이블
// data: { columns: [{title, accent?}], rows: [{left, right, highlight?}],
//         footers?: [string] }
// ---------------------------------------------------------------------------
export const DataTableRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / Math.max(1, dur));

  const columns: Array<{ title: string; accent?: string }> = d.columns ?? [];
  const rows: Array<{ left: string; right: string; highlight?: string }> = d.rows ?? [];
  const footers: string[] = d.footers ?? [];

  const colCount = columns.length || 2;
  const leftAccent = columns[0]?.accent === "primary" ? P.accentBright : "rgba(255,255,255,0.5)";
  const rightAccent = columns[1]?.accent === "primary" ? P.accentBright : (columns[1]?.accent === "secondary" ? "rgba(255,255,255,0.5)" : P.accentBright);

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 0, width: "100%", maxWidth: 900,
      alignSelf: "center", borderRadius: 16, overflow: "hidden",
      border: "1.5px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.03)",
      opacity: progress,
      ...(node.style as React.CSSProperties),
    }}>
      {/* Column headers */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        {columns.map((col, i) => (
          <div key={i} style={{
            flex: 1, padding: "14px 20px", textAlign: "center",
            borderRight: i < colCount - 1 ? "1px dashed rgba(255,255,255,0.1)" : "none",
          }}>
            <span style={{
              fontFamily: T.font, fontSize: 20, fontWeight: 700,
              color: i === 0 ? leftAccent : rightAccent,
            }}>
              {col.title}
            </span>
          </div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, ri) => {
        const rowDelay = ri * 4;
        const rowProgress = Math.min(1, Math.max(0, (localFrame - rowDelay) / Math.max(1, dur * 0.7)));
        const isHighlightLeft = row.highlight === "left";
        const isHighlightRight = row.highlight === "right";

        return (
          <div key={ri} style={{
            display: "flex",
            borderBottom: ri < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            opacity: rowProgress,
          }}>
            <div style={{
              flex: 1, padding: "12px 20px",
              borderRight: "1px dashed rgba(255,255,255,0.1)",
              background: isHighlightLeft ? `${leftAccent}12` : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: T.font, fontSize: 17, textAlign: "center",
                color: isHighlightLeft ? leftAccent : T.textSecondary,
                fontWeight: isHighlightLeft ? 600 : 400,
              }}>
                {row.left}
              </span>
            </div>
            <div style={{
              flex: 1, padding: "12px 20px",
              background: isHighlightRight ? `${rightAccent}12` : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: T.font, fontSize: 17, textAlign: "center",
                color: isHighlightRight ? rightAccent : T.textSecondary,
                fontWeight: isHighlightRight ? 600 : 400,
              }}>
                {row.right}
              </span>
            </div>
          </div>
        );
      })}

      {/* Footers */}
      {footers.length > 0 && (
        <div style={{
          display: "flex", borderTop: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {footers.map((ft, i) => (
            <div key={i} style={{
              flex: 1, padding: "10px 20px", textAlign: "center",
              borderRight: i < footers.length - 1 ? "1px dashed rgba(255,255,255,0.1)" : "none",
            }}>
              <span style={{
                fontFamily: T.font, fontSize: 14, color: T.textMuted,
              }}>
                {ft}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// StructuredDiagram — 다층 구조 다이어그램
// data: { layers: [{ label?, items: [string], style?: "card"|"box",
//          dividers?: [{at, label, style?}], warnings?: [{at, text}] }],
//          arrows?: [{from, to}], footer?: string }
// ---------------------------------------------------------------------------
export const StructuredDiagramRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 24;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / Math.max(1, dur));

  interface LayerDivider { at: number; label?: string; style?: string }
  interface LayerWarning { at: number; text: string }
  interface Layer {
    label?: string;
    items: string[];
    style?: string;
    dividers?: LayerDivider[];
    warnings?: LayerWarning[];
    highlight?: number;
  }

  const layers: Layer[] = d.layers ?? [];
  const arrows: Array<{ from: number; to: number }> = d.arrows ?? [];
  const footer: string = d.footer ?? "";

  const itemStyle = (layerStyle: string | undefined, idx: number, highlight?: number): React.CSSProperties => {
    const isHighlight = highlight === idx;
    if (layerStyle === "card") {
      return {
        flex: 1, padding: "16px 14px", borderRadius: 12, textAlign: "center" as const,
        background: isHighlight ? `${P.accentBright}18` : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${isHighlight ? P.accentBright : "rgba(255,255,255,0.15)"}`,
        position: "relative" as const,
      };
    }
    return {
      flex: 1, padding: "12px 14px", textAlign: "center" as const,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 6,
    };
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 0, width: "100%", maxWidth: 900,
      alignSelf: "center", opacity: progress, position: "relative",
      ...(node.style as React.CSSProperties),
    }}>
      {layers.map((layer, li) => {
        const layerDelay = li * 8;
        const layerProgress = Math.min(1, Math.max(0, (localFrame - layerDelay) / Math.max(1, dur * 0.7)));

        return (
          <React.Fragment key={li}>
            {/* Arrow between layers */}
            {arrows.some(a => a.from === li - 1 && a.to === li) && (
              <div style={{
                display: "flex", justifyContent: "center", padding: "6px 0",
                opacity: layerProgress,
              }}>
                <svg width={24} height={28} viewBox="0 0 24 28">
                  <line x1={12} y1={0} x2={12} y2={20} stroke={P.accentBright} strokeWidth={1.5} strokeDasharray="4,3" />
                  <polygon points="12,28 7,20 17,20" fill={P.accentBright} opacity={0.7} />
                </svg>
              </div>
            )}

            <div style={{ opacity: layerProgress, marginBottom: li < layers.length - 1 && !arrows.some(a => a.from === li && a.to === li + 1) ? 16 : 0 }}>
              {/* Layer label */}
              {layer.label && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: T.font, fontSize: 15, color: T.textMuted, fontWeight: 500 }}>
                    {layer.label}
                  </span>
                </div>
              )}

              {/* Items row */}
              <div style={{ display: "flex", gap: 12, position: "relative" }}>
                {layer.items.map((item, ii) => (
                  <div key={ii} style={itemStyle(layer.style, ii, layer.highlight)}>
                    <span style={{
                      fontFamily: T.font, fontSize: 16,
                      color: layer.highlight === ii ? P.accentBright : T.textPrimary,
                      fontWeight: layer.highlight === ii ? 700 : 400,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}

                {/* Dividers (dashed vertical lines) */}
                {layer.dividers?.map((div, di) => {
                  const leftPct = ((div.at + 1) / layer.items.length) * 100;
                  return (
                    <React.Fragment key={`div-${di}`}>
                      <div style={{
                        position: "absolute", left: `${leftPct}%`, top: -8, bottom: -8,
                        borderLeft: `2px ${div.style === "dashed" ? "dashed" : "solid"} ${P.accentBright}50`,
                        transform: "translateX(-1px)",
                      }} />
                      {div.label && (
                        <span style={{
                          position: "absolute", left: `${leftPct}%`, top: -24,
                          transform: "translateX(-50%)",
                          fontFamily: T.font, fontSize: 12, color: P.accentBright, fontWeight: 600,
                        }}>
                          {div.label}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Warnings */}
              {layer.warnings?.map((warn, wi) => {
                const leftPct = ((warn.at + 0.5) / layer.items.length) * 100;
                return (
                  <div key={`warn-${wi}`} style={{
                    position: "relative", marginTop: 4,
                  }}>
                    <span style={{
                      position: "absolute", left: `${leftPct}%`, transform: "translateX(-50%)",
                      fontFamily: T.font, fontSize: 13, color: "#F59E0B", fontWeight: 600,
                    }}>
                      {warn.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}

      {/* Footer */}
      {footer && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{
            fontFamily: T.font, fontSize: 18, fontWeight: 600,
            color: P.accentBright, opacity: 0.85,
          }}>
            {footer}
          </span>
        </div>
      )}
    </div>
  );
};
