// Stack Node Type System - 사용자 스펙 준수
// 모든 객체는 동일한 공통 스키마, type만 다름

// ---------------------------------------------------------------------------
// Layout / Style / Motion Props
// ---------------------------------------------------------------------------

export interface LayoutProps {
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  direction?: "row" | "column";
  gap?: number;
  gapX?: number;
  gapY?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  wrap?: boolean;
  columns?: number;
  rows?: number;
  ratio?: number[];
  anchor?: "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
  offsetX?: number;
  offsetY?: number;
  size?: number;
  axis?: "horizontal" | "vertical";
  maxWidth?: number | string;
}

export interface StyleProps {
  background?: string;
  color?: string;
  border?: string;
  radius?: number | string;
  opacity?: number;
  fontSize?: number;
  fontWeight?: number | string;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  thickness?: number;
  blur?: number;
  size?: number;
  boxShadow?: string;
  [key: string]: unknown;
}

export interface MotionProps {
  preset?: string;
  enterAt?: number;   // 등장 시작 프레임 (씬 내 상대)
  duration?: number;   // 애니메이션 지속 프레임
}

// ---------------------------------------------------------------------------
// StackNode - 모든 객체의 단일 타입
// ---------------------------------------------------------------------------

export interface StackNode {
  id: string;
  type: string;
  role?: string;
  layout?: LayoutProps;
  style?: StyleProps;
  motion?: MotionProps;
  data?: Record<string, any>;
  children?: StackNode[];
  condition?: string;
  variant?: string;
  zIndex?: number;
}

// ---------------------------------------------------------------------------
// Node Categories (참조용)
// ---------------------------------------------------------------------------

export type NodeCategory =
  | "container"
  | "text"
  | "shape"
  | "media"
  | "chart"
  | "composite"
  | "connector"
  | "accent"
  | "utility";

// Container: SceneRoot, Stack, Grid, Split, Overlay, AnchorBox, SafeArea, FrameBox, ScatterLayout
// Text: Kicker, Headline, RichText, BodyText, FooterCaption, BulletList, NumberList, QuoteText, StatNumber
// Shape: RectFrame, CircleFrame, Pill, Divider, Badge, HighlightMark
// Media: Icon, SvgSymbol, BrandLogo, ImageAsset, ScreenshotCard, DeviceMockup
// Chart: ProgressBar, CompareBars, RingChart, MiniBarChart, MetricGrid, TimelineChart
// Composite: IconCard, StatCard, CompareCard, ProcessStepCard, InsightTile, WarningCard, CaseStudyCard
// Connector: ArrowConnector, LineConnector, LoopConnector, BracketGroup
// Accent: AccentGlow, AccentDot, AccentRing, Backplate
// Utility: Spacer, AutoFitBox, ConditionalBlock, RepeatGroup, MotionSlot

export interface NodeProps {
  node: StackNode;
  frame: number;
  durationFrames: number;
}
