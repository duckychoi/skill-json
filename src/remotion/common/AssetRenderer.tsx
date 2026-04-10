// @TASK P2-R3-T1 - AssetRenderer
// @SPEC docs/planning/02-trd.md
// SVG 아이콘, 차트 데이터 렌더링 공통 컴포넌트

import React from "react";
import type { AssetConfig } from "@/types";
import { T } from "./theme";

interface AssetRendererProps {
  assets: AssetConfig;
  /** 차트 너비 (px) */
  chartWidth?: number;
  /** 차트 높이 (px) */
  chartHeight?: number;
}

// ──────────────────────────────────────────────
// 인라인 SVG 아이콘 렌더러
// ──────────────────────────────────────────────
const SvgIconPlaceholder: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div
      data-testid={`asset-svg-${name}`}
      style={{
        width: 48,
        height: 48,
        backgroundColor: "#222222",
        borderRadius: 8,
        border: "1px solid #333333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke={T.accentBright}
        strokeWidth="2"
      >
        {/* 범용 아이콘 placeholder: 원 안에 이름 첫 글자 */}
        <circle cx="12" cy="12" r="10" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="10"
          fill={T.accentBright}
          stroke="none"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          {name.charAt(0).toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

// ──────────────────────────────────────────────
// 바 차트 렌더러
// ──────────────────────────────────────────────
interface BarChartData {
  labels: string[];
  values: number[];
}

const BarChart: React.FC<{ data: BarChartData; width: number; height: number }> = ({
  data,
  width,
  height,
}) => {
  const maxValue = Math.max(...data.values, 1);
  const barWidth = (width - 40) / data.labels.length - 8;

  return (
    <svg
      data-testid="asset-chart-bar"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {data.values.map((value, i) => {
        const barHeight = (value / maxValue) * (height - 60);
        const x = 20 + i * (barWidth + 8);
        const y = height - 40 - barHeight;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={T.accentBright}
              rx={4}
            />
            <text
              x={x + barWidth / 2}
              y={height - 20}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.7)"
              fontFamily="Inter, sans-serif"
            >
              {data.labels[i]}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="12"
              fill="#FFFFFF"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ──────────────────────────────────────────────
// AssetRenderer 메인 컴포넌트
// ──────────────────────────────────────────────
export const AssetRenderer: React.FC<AssetRendererProps> = ({
  assets,
  chartWidth = 600,
  chartHeight = 400,
}) => {
  const hasAssets =
    assets.svg_icons.length > 0 ||
    (assets.chart_type !== null && assets.chart_data !== null);

  if (!hasAssets) {
    return <div data-testid="asset-renderer-empty" />;
  }

  return (
    <div data-testid="asset-renderer" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* SVG 아이콘 렌더링 */}
      {assets.svg_icons.length > 0 && (
        <div
          data-testid="asset-icons-container"
          style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          {assets.svg_icons.map((iconName) => (
            <SvgIconPlaceholder key={iconName} name={iconName} />
          ))}
        </div>
      )}

      {/* 차트 렌더링 */}
      {assets.chart_type === "bar" && assets.chart_data && (
        <BarChart
          data={assets.chart_data as unknown as BarChartData}
          width={chartWidth}
          height={chartHeight}
        />
      )}

      {assets.chart_type === "line" && assets.chart_data && (
        <svg
          data-testid="asset-chart-line"
          width={chartWidth}
          height={chartHeight}
        />
      )}

      {assets.chart_type === "pie" && assets.chart_data && (
        <svg
          data-testid="asset-chart-pie"
          width={chartHeight}
          height={chartHeight}
        />
      )}
    </div>
  );
};
