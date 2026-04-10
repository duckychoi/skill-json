// Node Registry - type string → React component
import type React from "react";
import type { NodeProps } from "@/types/stack-nodes";

import { ContainerPlaceholder } from "./containers";
import {
  KickerRenderer, HeadlineRenderer, RichTextRenderer, BodyTextRenderer,
  BulletListRenderer, StatNumberRenderer, QuoteTextRenderer, FooterCaptionRenderer,
} from "./text";
import { DividerRenderer, BadgeRenderer, PillRenderer, FrameBoxRenderer } from "./shapes";
import { IconRenderer, RingChartRenderer } from "./media";
import {
  IconCardRenderer, StatCardRenderer, CompareCardRenderer,
  ProcessStepCardRenderer, InsightTileRenderer, WarningCardRenderer,
} from "./composites";
import { ArrowConnectorRenderer, LineConnectorRenderer } from "./connectors";
import { AccentGlowRenderer, AccentRingRenderer, BackplateRenderer, SpacerRenderer } from "./accents";
import { ProgressBarRenderer, CompareBarsRenderer, MiniBarChartRenderer } from "./charts";
import { ImageAssetRenderer } from "./image-asset";
import {
  ChatBubbleRenderer, PhoneMockupRenderer,
  MonitorMockupRenderer, TerminalBlockRenderer,
} from "./interactive";
import {
  CycleDiagramRenderer, FlowDiagramRenderer,
  TimelineStepperRenderer, PersonAvatarRenderer,
} from "./diagrams";
import {
  ScatterPlotRenderer, DataTableRenderer, StructuredDiagramRenderer,
} from "./data-viz";

export const NODE_REGISTRY: Record<string, React.FC<NodeProps>> = {
  // Text
  Kicker: KickerRenderer,
  Headline: HeadlineRenderer,
  RichText: RichTextRenderer,
  BodyText: BodyTextRenderer,
  BulletList: BulletListRenderer,
  StatNumber: StatNumberRenderer,
  QuoteText: QuoteTextRenderer,
  FooterCaption: FooterCaptionRenderer,

  // Shapes
  Divider: DividerRenderer,
  Badge: BadgeRenderer,
  Pill: PillRenderer,
  FrameBox: FrameBoxRenderer,

  // Media
  Icon: IconRenderer,
  RingChart: RingChartRenderer,
  ImageAsset: ImageAssetRenderer,

  // Charts
  ProgressBar: ProgressBarRenderer,
  CompareBars: CompareBarsRenderer,
  MiniBarChart: MiniBarChartRenderer,

  // Composites
  IconCard: IconCardRenderer,
  StatCard: StatCardRenderer,
  CompareCard: CompareCardRenderer,
  ProcessStepCard: ProcessStepCardRenderer,
  InsightTile: InsightTileRenderer,
  WarningCard: WarningCardRenderer,

  // Connectors
  ArrowConnector: ArrowConnectorRenderer,
  LineConnector: LineConnectorRenderer,

  // Accents
  AccentGlow: AccentGlowRenderer,
  AccentRing: AccentRingRenderer,
  Backplate: BackplateRenderer,

  // Utility
  Spacer: SpacerRenderer,

  // Interactive
  ChatBubble: ChatBubbleRenderer,
  PhoneMockup: PhoneMockupRenderer,
  MonitorMockup: MonitorMockupRenderer,
  TerminalBlock: TerminalBlockRenderer,

  // Diagrams
  CycleDiagram: CycleDiagramRenderer,
  FlowDiagram: FlowDiagramRenderer,
  TimelineStepper: TimelineStepperRenderer,
  PersonAvatar: PersonAvatarRenderer,

  // Data Visualization
  ScatterPlot: ScatterPlotRenderer,
  DataTable: DataTableRenderer,
  StructuredDiagram: StructuredDiagramRenderer,
};

// 컨테이너 타입 (children을 직접 렌더하는 노드)
export const CONTAINER_TYPES = new Set([
  "SceneRoot", "Stack", "Grid", "Split", "Overlay",
  "AnchorBox", "SafeArea", "FrameBox",
  "ScatterLayout",
]);
