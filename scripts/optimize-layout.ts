/**
 * optimize-layout.ts -- 씬별 콘텐츠 높이 분석 + 레이아웃(gap, maxWidth) 최적화
 *
 * 문제:
 *   카드가 있는 씬에서 콘텐츠가 화면의 40%만 차지하고 60%가 빈 공간.
 *   프레임 1920x1080, 하단 자막 바 감안 시 실제 콘텐츠 영역 ~ 860px.
 *
 * 전략:
 *   1. 각 씬의 stack_root를 DFS로 순회하며 leaf 노드 높이를 추정
 *   2. 컨테이너 유형에 따라 세로(sum) / 가로(max) 합산
 *   3. 총 높이에 따라 SceneRoot gap, 컨테이너 gap, maxWidth를 조정
 *
 * 원칙:
 *   - layout 값만 조정, motion / data / children은 절대 변경하지 않음
 *   - stack_root.layout이 없으면 생성
 *
 * 사용법:
 *   npx tsx scripts/optimize-layout.ts data/rag-intro/scenes-v2.json
 */

import * as fs from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LayoutProps {
  padding?: string | number;
  gap?: number;
  gapX?: number;
  gapY?: number;
  direction?: "row" | "column";
  align?: string;
  justify?: string;
  columns?: number;
  rows?: number;
  ratio?: number[];
  maxWidth?: number | string;
  width?: number | string;
  [key: string]: unknown;
}

interface StackNode {
  id: string;
  type: string;
  layout?: LayoutProps;
  style?: Record<string, unknown>;
  data?: Record<string, unknown>;
  motion?: Record<string, unknown>;
  children?: StackNode[];
  [key: string]: unknown;
}

interface Scene {
  id: string;
  stack_root?: StackNode;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 프레임 상수
// ---------------------------------------------------------------------------
const FRAME_HEIGHT = 1080;
const SUBTITLE_BAR_HEIGHT = 220; // 자막 바 + 하단 여백
const AVAILABLE_HEIGHT = FRAME_HEIGHT - SUBTITLE_BAR_HEIGHT; // ~860px

// ---------------------------------------------------------------------------
// Leaf 노드 유형별 예상 높이 (px)
// ---------------------------------------------------------------------------
const NODE_HEIGHT_MAP: Record<string, number> = {
  Badge: 45,
  Kicker: 45,
  Pill: 45,
  Headline: 80,
  Divider: 4,
  IconCard: 170,
  ProcessStepCard: 200,
  StatCard: 150,
  StatNumber: 120,
  BodyText: 60,
  RichText: 60,
  QuoteText: 100,
  CompareCard: 200,
  InsightTile: 60,
  WarningCard: 180,
  RingChart: 200,
  MiniBarChart: 160,
  Icon: 80,
  AccentRing: 80,
  ArrowConnector: 20,
  LineConnector: 20,
  LoopConnector: 20,
  BracketGroup: 20,
  FooterCaption: 40,
  Spacer: 0,
};

// 동적 높이 (items 개수에 따라 달라지는 노드)
function getDynamicHeight(node: StackNode): number | null {
  const data = node.data as Record<string, unknown> | undefined;
  if (!data) return null;

  switch (node.type) {
    case "BulletList":
    case "NumberList": {
      const items = data.items as unknown[] | undefined;
      const count = items?.length ?? 3;
      return count * 45;
    }
    case "CompareBars": {
      const items = data.items as unknown[] | undefined;
      const count = items?.length ?? 2;
      return count * 50;
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 컨테이너 유형 판별
// ---------------------------------------------------------------------------
const CONTAINER_TYPES = new Set([
  "SceneRoot",
  "Stack",
  "Grid",
  "Split",
  "Overlay",
  "AnchorBox",
  "SafeArea",
  "FrameBox",
]);

function isContainer(node: StackNode): boolean {
  return CONTAINER_TYPES.has(node.type);
}

// ---------------------------------------------------------------------------
// 높이 계산 (재귀 DFS)
// ---------------------------------------------------------------------------
function estimateHeight(node: StackNode): number {
  // Leaf 노드
  if (!node.children || node.children.length === 0) {
    const dynamic = getDynamicHeight(node);
    if (dynamic !== null) return dynamic;
    return NODE_HEIGHT_MAP[node.type] ?? 60; // 알 수 없는 노드 → 60px 기본
  }

  // 컨테이너 노드
  const childHeights = node.children.map((c) => estimateHeight(c));
  const gap = node.layout?.gap ?? 0;

  switch (node.type) {
    // 가로 배치 → max(children)
    case "Grid":
    case "Split":
      return Math.max(...childHeights);

    // Overlay → 가장 큰 자식 (겹치므로)
    case "Overlay":
    case "AnchorBox":
      return Math.max(...childHeights);

    // Stack: direction에 따라
    case "Stack": {
      const dir = node.layout?.direction ?? "column";
      if (dir === "row") {
        return Math.max(...childHeights);
      }
      // column: 세로 합산 + gap
      return (
        childHeights.reduce((a, b) => a + b, 0) +
        gap * (childHeights.length - 1)
      );
    }

    // SceneRoot, SafeArea, FrameBox → column처럼 합산
    default: {
      return (
        childHeights.reduce((a, b) => a + b, 0) +
        gap * (childHeights.length - 1)
      );
    }
  }
}

// ---------------------------------------------------------------------------
// SceneRoot padding에서 top + bottom 추출
// ---------------------------------------------------------------------------
function extractVerticalPadding(padding: string | number | undefined): number {
  if (padding === undefined) return 0;
  if (typeof padding === "number") return padding * 2;

  // CSS shorthand: "60px 140px 160px" → top=60, bottom=160
  const parts = String(padding)
    .split(/\s+/)
    .map((p) => parseInt(p, 10));

  if (parts.length === 1) return (parts[0] || 0) * 2;
  if (parts.length === 2) return (parts[0] || 0) * 2; // top=bottom
  if (parts.length === 3) return (parts[0] || 0) + (parts[2] || 0); // top + bottom
  if (parts.length === 4) return (parts[0] || 0) + (parts[2] || 0); // top + bottom

  return 0;
}

// ---------------------------------------------------------------------------
// 레이아웃 최적화 로직
// ---------------------------------------------------------------------------
interface OptimizationResult {
  sceneId: string;
  contentHeight: number;
  availableContentHeight: number;
  fillRatio: number;
  changes: string[];
}

function optimizeScene(scene: Scene): OptimizationResult | null {
  const root = scene.stack_root;
  if (!root) return null;

  // layout이 없으면 생성
  if (!root.layout) {
    root.layout = {};
  }

  const changes: string[] = [];
  const vertPad = extractVerticalPadding(root.layout.padding);
  const availableContentHeight = AVAILABLE_HEIGHT - vertPad;

  // 콘텐츠 높이 추정 (SceneRoot 자체의 children 합산)
  const childHeights = (root.children || []).map((c) => estimateHeight(c));
  const currentGap = root.layout.gap ?? 20;
  const contentHeight =
    childHeights.reduce((a, b) => a + b, 0) +
    currentGap * Math.max(0, childHeights.length - 1);

  const fillRatio = contentHeight / availableContentHeight;

  // ── 1. SceneRoot gap 조정 ──
  let newRootGap: number;
  if (contentHeight < 400) {
    // sparse: gap 적당히 (너무 벌리지 않음)
    newRootGap = clamp(24, 20, 28);
  } else if (contentHeight < 600) {
    // 보통: gap 적당히
    newRootGap = clamp(22, 18, 24);
  } else {
    // 빽빽: gap 줄이기
    newRootGap = clamp(16, 12, 20);
  }

  if (root.layout.gap !== newRootGap) {
    changes.push(`SceneRoot gap: ${root.layout.gap ?? "none"} -> ${newRootGap}`);
    root.layout.gap = newRootGap;
  }

  // ── 2. 독립 카드/FrameBox maxWidth 강제 (SceneRoot 직계 children) ──
  enforceStandaloneCardMaxWidth(root, changes);

  // ── 3. 하위 컨테이너 순회 (Grid, Split, Stack) ──
  walkContainers(root, contentHeight, changes);

  return {
    sceneId: scene.id,
    contentHeight: Math.round(contentHeight),
    availableContentHeight: Math.round(availableContentHeight),
    fillRatio: Math.round(fillRatio * 100) / 100,
    changes,
  };
}

function walkContainers(
  node: StackNode,
  totalContentHeight: number,
  changes: string[],
): void {
  if (!node.children) return;

  for (const child of node.children) {
    if (!isContainer(child)) continue;

    // layout이 없으면 생성
    if (!child.layout) {
      child.layout = {};
    }

    const childCount = child.children?.length ?? 0;

    switch (child.type) {
      case "Grid": {
        // Grid maxWidth 조정
        const cols = child.layout.columns ?? 2;
        let targetMaxWidth: number;
        if (cols <= 2) targetMaxWidth = 900;
        else if (cols === 3) targetMaxWidth = 1100;
        else targetMaxWidth = 1200;

        const currentMaxWidth = getMaxWidth(child);
        if (currentMaxWidth !== targetMaxWidth) {
          setMaxWidth(child, targetMaxWidth);
          changes.push(
            `${child.type}(${child.id}) maxWidth: ${currentMaxWidth ?? "none"} -> ${targetMaxWidth} (cols=${cols})`,
          );
        }

        // Grid gap 조정
        adjustContainerGap(child, totalContentHeight, changes);
        break;
      }

      case "Split": {
        // Split maxWidth 조정
        let targetMaxWidth: number;
        if (childCount <= 2) targetMaxWidth = 900;
        else targetMaxWidth = 1100;

        const currentMaxWidth = getMaxWidth(child);
        if (currentMaxWidth !== targetMaxWidth) {
          setMaxWidth(child, targetMaxWidth);
          changes.push(
            `${child.type}(${child.id}) maxWidth: ${currentMaxWidth ?? "none"} -> ${targetMaxWidth} (children=${childCount})`,
          );
        }

        // Split 중앙 정렬 강제 (비교 레이아웃은 항상 가운데 기준)
        if (!child.layout!.justify || child.layout!.justify !== "center") {
          changes.push(
            `${child.type}(${child.id}) justify: ${child.layout!.justify ?? "none"} -> center`,
          );
          child.layout!.justify = "center";
        }
        if (!child.layout!.align || child.layout!.align !== "center") {
          changes.push(
            `${child.type}(${child.id}) align: ${child.layout!.align ?? "none"} -> center`,
          );
          child.layout!.align = "center";
        }

        // Split gap 조정
        adjustContainerGap(child, totalContentHeight, changes);
        break;
      }

      case "Stack": {
        // Stack 내부 gap도 콘텐츠 밀도에 따라 조정
        adjustContainerGap(child, totalContentHeight, changes);
        break;
      }
    }

    // 재귀: 하위 컨테이너 순회
    walkContainers(child, totalContentHeight, changes);
  }
}

// ---------------------------------------------------------------------------
// 독립 카드 maxWidth 강제 (SceneRoot 직계 children)
// ---------------------------------------------------------------------------
const STANDALONE_CARD_TYPES = new Set([
  "IconCard", "WarningCard", "ProcessStepCard", "StatCard",
  "CompareCard", "InsightTile", "FrameBox", "ChatBubble",
  "TerminalBlock", "TimelineStepper", "FlowDiagram",
]);

const STANDALONE_MAX_WIDTH_LIMIT: Record<string, number> = {
  IconCard: 520,
  WarningCard: 600,
  ProcessStepCard: 520,
  StatCard: 400,
  InsightTile: 600,
  FrameBox: 600,
  ChatBubble: 520,
  TerminalBlock: 600,
  TimelineStepper: 600,
  FlowDiagram: 800,
  CompareCard: 800,
};

function enforceStandaloneCardMaxWidth(
  root: StackNode,
  changes: string[],
): void {
  if (!root.children) return;

  for (const child of root.children) {
    if (!STANDALONE_CARD_TYPES.has(child.type)) continue;

    const limit = STANDALONE_MAX_WIDTH_LIMIT[child.type] ?? 600;
    const currentMw = getMaxWidth(child);

    if (currentMw === null || currentMw > limit) {
      setMaxWidth(child, limit);
      changes.push(
        `${child.type}(${child.id}) standalone maxWidth: ${currentMw ?? "none"} -> ${limit}`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 컨테이너 gap 조정
// ---------------------------------------------------------------------------
function adjustContainerGap(
  node: StackNode,
  totalContentHeight: number,
  changes: string[],
): void {
  if (!node.layout) return;
  const currentGap = node.layout.gap;
  if (currentGap === undefined) return; // gap이 명시되지 않은 컨테이너는 건드리지 않음

  let newGap: number;
  if (totalContentHeight < 400) {
    // sparse: 컨테이너 gap 적당히 (너무 벌리지 않음)
    newGap = clamp(currentGap, 16, 24);
  } else if (totalContentHeight < 600) {
    // 보통: 유지
    newGap = clamp(currentGap, 14, 24);
  } else {
    // 빽빽: 줄이기
    newGap = Math.min(currentGap, Math.round(currentGap * 0.85));
    newGap = clamp(newGap, 10, 20);
  }

  if (newGap !== currentGap) {
    changes.push(
      `${node.type}(${node.id}) gap: ${currentGap} -> ${newGap}`,
    );
    node.layout.gap = newGap;
  }
}

// ---------------------------------------------------------------------------
// maxWidth 헬퍼 (layout 또는 style 양쪽에 있을 수 있음)
// ---------------------------------------------------------------------------
function getMaxWidth(node: StackNode): number | null {
  const layoutMw = node.layout?.maxWidth;
  const styleMw = node.style?.maxWidth;
  const val = layoutMw ?? styleMw;
  if (val === undefined || val === null) return null;
  return typeof val === "number" ? val : parseInt(String(val), 10) || null;
}

function setMaxWidth(node: StackNode, value: number): void {
  // layout에 설정 (primary)
  if (!node.layout) node.layout = {};
  node.layout.maxWidth = value;

  // style에도 있으면 동기화
  if (node.style?.maxWidth !== undefined) {
    node.style.maxWidth = value;
  }
}

// ---------------------------------------------------------------------------
// Util
// ---------------------------------------------------------------------------
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ---------------------------------------------------------------------------
// 메인 처리
// ---------------------------------------------------------------------------
function optimizeLayout(scenesPath: string): void {
  const raw = fs.readFileSync(scenesPath, "utf-8");
  const parsed = JSON.parse(raw);

  let scenes: Scene[];
  if (Array.isArray(parsed)) {
    scenes = parsed;
  } else if (parsed.scenes) {
    scenes = parsed.scenes;
  } else {
    throw new Error("Unknown format: expected array or { scenes: [...] }");
  }

  console.log(`\nAnalyzing ${scenes.length} scenes...\n`);
  console.log(
    `Frame: ${FRAME_HEIGHT}px, Subtitle bar: ~${SUBTITLE_BAR_HEIGHT}px, Available: ~${AVAILABLE_HEIGHT}px\n`,
  );
  console.log("─".repeat(80));

  let totalChanges = 0;

  for (const scene of scenes) {
    const result = optimizeScene(scene);
    if (!result) continue;

    const density =
      result.contentHeight < 400
        ? "SPARSE"
        : result.contentHeight < 600
          ? "NORMAL"
          : "DENSE";

    const fillPct = Math.round(result.fillRatio * 100);
    const filled = clamp(Math.round(fillPct / 5), 0, 20);
    const bar = "█".repeat(filled) + "░".repeat(20 - filled);

    console.log(
      `${result.sceneId}: height=${result.contentHeight}px / ${result.availableContentHeight}px ` +
        `(${fillPct}%) [${bar}] ${density}`,
    );

    if (result.changes.length > 0) {
      for (const c of result.changes) {
        console.log(`  -> ${c}`);
      }
      totalChanges += result.changes.length;
    }
  }

  console.log("─".repeat(80));
  console.log(`\nTotal: ${totalChanges} layout adjustments across ${scenes.length} scenes`);

  // 저장
  const output = Array.isArray(parsed) ? scenes : { ...parsed, scenes };
  fs.writeFileSync(scenesPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(`Saved: ${scenesPath}\n`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: npx tsx scripts/optimize-layout.ts <scenes-file.json>");
  console.log("Example: npx tsx scripts/optimize-layout.ts data/rag-intro/scenes-v2.json");
  process.exit(1);
}

for (const file of args) {
  console.log(`\n=== optimize-layout: ${file} ===`);
  optimizeLayout(file);
}
