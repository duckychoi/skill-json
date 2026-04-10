#!/usr/bin/env node
/**
 * 전체 씬 enterAt 갭 문제 일괄 수정 (v6)
 * 전략:
 *   1. 헤더 노드(Badge/Kicker/Headline/Icon/Divider/AccentRing)는 항상 0~24프레임에 빠르게 고정
 *   2. 콘텐츠 노드만 headerEnd~70% 구간에 sqrt 가중 배분
 *   3. 갭 정상 씬은 DFS 트리 순서 강제만 적용
 */
const fs = require("fs");

const scenesPath = process.argv[2];
if (!scenesPath) { console.error("Usage: node fix-all-enterAt-gaps.js <scenes-v2.json>"); process.exit(1); }
const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf-8"));

const GAP_THRESHOLD = 150; // 5초

const HEADER_TYPES = new Set([
  "Badge", "Icon", "Kicker", "Headline", "Divider", "AccentRing",
]);

function isHeaderNode(node) {
  return HEADER_TYPES.has(node.type);
}

function collectMotionNodes(node, list = []) {
  if (node.motion?.enterAt !== undefined) list.push(node);
  if (node.children) node.children.forEach(c => collectMotionNodes(c, list));
  return list;
}

function analyzeGaps(values, dur) {
  if (values.length < 2) return { maxGap: 0, deadTail: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 1; i < sorted.length; i++)
    maxGap = Math.max(maxGap, sorted[i] - sorted[i - 1]);
  const deadTail = dur - sorted[sorted.length - 1];
  return { maxGap, deadTail };
}

let gapFixCount = 0;
let orderFixCount = 0;

scenes.forEach(s => {
  const dur = s.duration_frames;
  if (!s.stack_root) return;
  const dfsNodes = collectMotionNodes(s.stack_root);
  if (dfsNodes.length < 2) return;

  const values = dfsNodes.map(n => n.motion.enterAt);
  const before = analyzeGaps(values, dur);
  const ts = (s.start_ms / 1000 / 60 | 0) + ':' + ((s.start_ms / 1000 % 60) | 0).toString().padStart(2, '0');

  if (before.maxGap > GAP_THRESHOLD || before.deadTail > GAP_THRESHOLD) {
    // === 헤더/콘텐츠 분리 ===
    let headerCount = 0;
    for (let i = 0; i < dfsNodes.length; i++) {
      if (isHeaderNode(dfsNodes[i])) headerCount = i + 1;
      else break;
    }
    if (headerCount === 0) headerCount = 1;

    const HEADER_STAGGER = 8; // 헤더 간 8프레임(0.27초) 간격

    // 헤더: 0, 8, 16, 24... 빠르게 연달아
    for (let i = 0; i < headerCount; i++) {
      dfsNodes[i].motion.enterAt = i * HEADER_STAGGER;
    }

    // 콘텐츠: headerEnd ~ 70% 구간에 sqrt 가중 배분
    const contentNodes = dfsNodes.slice(headerCount);
    if (contentNodes.length > 0) {
      const headerEndFrame = headerCount * HEADER_STAGGER + 12; // 헤더 끝 + 12프레임 여유
      const targetEnd = Math.round(dur * 0.70);

      contentNodes.forEach((node, i) => {
        const t = contentNodes.length === 1 ? 0 : i / (contentNodes.length - 1);
        node.motion.enterAt = Math.round(headerEndFrame + Math.sqrt(t) * (targetEnd - headerEndFrame));
      });
    }

    const afterValues = dfsNodes.map(n => n.motion.enterAt);
    const after = analyzeGaps(afterValues, dur);
    console.log(`[균등] beat=${s.beat_index} (${ts}) gap:${(before.maxGap/30).toFixed(1)}→${(after.maxGap/30).toFixed(1)}s tail:${(before.deadTail/30).toFixed(1)}→${(after.deadTail/30).toFixed(1)}s [H:${headerCount} C:${dfsNodes.length - headerCount}]`);
    gapFixCount++;
  } else {
    // === 갭 정상 → DFS 트리 순서만 강제 ===
    const sorted = [...values].sort((a, b) => a - b);
    let changed = false;
    dfsNodes.forEach((node, i) => {
      if (node.motion.enterAt !== sorted[i]) {
        node.motion.enterAt = sorted[i];
        changed = true;
      }
    });
    if (changed) {
      console.log(`[순서] beat=${s.beat_index} (${ts}) enterAt → 트리 순서로 재정렬`);
      orderFixCount++;
    }
  }
});

// === 최종 패스: 컨테이너 enterAt을 첫 자식과 동일하게 맞춤 ===
// FrameBox, Split, Grid, Stack 등 컨테이너가 children보다 먼저 나오면 빈 카드가 보임
const CONTAINER_TYPES = new Set([
  "FrameBox", "Split", "Grid", "Stack", "Overlay", "AnchorBox", "SafeArea",
]);

let containerFixCount = 0;

function syncContainerEnterAt(node) {
  if (!node.children || node.children.length === 0) return;

  // 재귀: 자식 먼저 처리
  node.children.forEach(c => syncContainerEnterAt(c));

  // SceneRoot는 건너뜀
  if (node.type === "SceneRoot") return;

  // 컨테이너 노드이고 motion.enterAt이 있으면
  if (CONTAINER_TYPES.has(node.type) && node.motion && node.motion.enterAt !== undefined) {
    // 첫 번째 자식 중 motion이 있는 것의 enterAt을 찾음
    let firstChildEnterAt = Infinity;
    function findMinEnterAt(n) {
      if (n.motion && n.motion.enterAt !== undefined) {
        firstChildEnterAt = Math.min(firstChildEnterAt, n.motion.enterAt);
      }
      if (n.children) n.children.forEach(c => findMinEnterAt(c));
    }
    node.children.forEach(c => findMinEnterAt(c));

    if (firstChildEnterAt < Infinity && node.motion.enterAt < firstChildEnterAt) {
      node.motion.enterAt = firstChildEnterAt;
      containerFixCount++;
    }
  }
}

scenes.forEach(s => {
  if (s.stack_root) syncContainerEnterAt(s.stack_root);
});

if (containerFixCount > 0) {
  console.log(`[컨테이너] ${containerFixCount}개 컨테이너 enterAt → 첫 자식과 동기화`);
}

fs.writeFileSync(scenesPath, JSON.stringify(scenes, null, 2));
console.log(`\n✅ ${gapFixCount}개 씬 균등 배분, ${orderFixCount}개 씬 트리 순서 정렬, ${containerFixCount}개 컨테이너 동기화 완료`);
