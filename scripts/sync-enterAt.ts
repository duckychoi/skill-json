/**
 * sync-enterAt.ts  v4 — 의미 기반 타이밍 동기화
 *
 * 자막 텍스트 ↔ 노드 데이터를 키워드 매칭하여
 * "이 대사가 나올 때 해당 노드가 등장"하도록 enterAt을 계산.
 *
 * 핵심 원칙:
 *   1. 헤더 그룹 (Badge/Kicker/Headline/Divider)은 씬 초반 빠르게 등장
 *   2. 콘텐츠 노드는 자막 키워드 매칭 → 해당 자막 시점에 등장
 *   3. 매칭 실패 시 순서 기반 보간 (인접 매칭 노드 사이에 배치)
 *   4. 최소 간격 보장으로 동시 등장 방지
 *
 * 사용법:
 *   npx tsx scripts/sync-enterAt.ts data/rag-intro/scenes-v2.json
 */

import * as fs from "fs";

const FPS = 30;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MotionDef {
  preset?: string;
  enterAt?: number;
  duration?: number;
}

interface StackNode {
  id: string;
  type: string;
  data?: Record<string, unknown>;
  motion?: MotionDef;
  children?: StackNode[];
  [key: string]: unknown;
}

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

interface Scene {
  id: string;
  start_ms: number;
  end_ms: number;
  duration_frames: number;
  stack_root?: StackNode;
  subtitles?: Subtitle[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 헤더 vs 콘텐츠 분류
// ---------------------------------------------------------------------------
const HEADER_TYPES = new Set([
  "Badge", "Icon", "Kicker", "Headline", "Divider", "AccentRing",
]);

function isHeaderNode(node: StackNode): boolean {
  return HEADER_TYPES.has(node.type);
}

// ---------------------------------------------------------------------------
// DFS: animated 노드 수집 (등장 순서)
// ---------------------------------------------------------------------------
function collectAnimatedNodes(node: StackNode): StackNode[] {
  const result: StackNode[] = [];

  function walk(n: StackNode) {
    if (n.motion?.preset) {
      result.push(n);
    }
    if (n.children) {
      for (const child of n.children) {
        walk(child);
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      walk(child);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// 노드 텍스트 추출 (children 재귀 포함)
// ---------------------------------------------------------------------------
function extractNodeText(node: StackNode): string {
  const parts: string[] = [];

  function collect(n: StackNode) {
    const d = (n.data ?? {}) as Record<string, unknown>;
    for (const key of ["text", "title", "body", "label", "desc", "step"]) {
      if (typeof d[key] === "string") parts.push(d[key] as string);
    }
    if (d.value !== undefined) parts.push(String(d.value));

    // Array items (BulletList, CompareBars 등)
    if (Array.isArray(d.items)) {
      for (const item of d.items) {
        if (typeof item === "string") parts.push(item);
        else if (item?.label) parts.push(item.label);
        else if (item?.title) parts.push(item.title);
      }
    }

    // CompareCard left/right
    for (const side of ["left", "right"]) {
      const s = d[side] as Record<string, unknown> | undefined;
      if (s?.title) parts.push(s.title as string);
      if (s?.label) parts.push(s.label as string);
      if (s?.subtitle) parts.push(s.subtitle as string);
    }

    // Recurse into children (container 노드의 자식 텍스트도 수집)
    if (n.children) {
      for (const child of n.children) collect(child);
    }
  }

  collect(node);
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// 키워드 추출
// ---------------------------------------------------------------------------
function extractKeywords(text: string): string[] {
  const clean = text
    .replace(/\n/g, " ")
    .replace(/[✕✓→↑↓↗=•·\-–—|:;,.\[\](){}'"「」『』""''/\\]/g, " ");
  const tokens = clean.split(/\s+/).filter((t) => t.length >= 2);
  return [...new Set(tokens)];
}

// ---------------------------------------------------------------------------
// 매칭 점수: 노드 키워드가 자막 텍스트에 포함되는 정도
// ---------------------------------------------------------------------------
function matchScore(nodeKeywords: string[], subtitleText: string): number {
  let score = 0;
  for (const kw of nodeKeywords) {
    if (subtitleText.includes(kw)) {
      score += kw.length; // 긴 키워드 매칭 = 높은 신뢰도
    }
  }
  return score;
}

// ---------------------------------------------------------------------------
// 분배 알고리즘 v4: 의미 기반 매칭
// ---------------------------------------------------------------------------
function distributeNodes(
  nodes: StackNode[],
  subtitles: Subtitle[],
  sceneStartSec: number,
  sceneDurationFrames: number,
): { matchLog: string[] } {
  const matchLog: string[] = [];
  if (nodes.length === 0) return { matchLog };

  const maxEnterFrame = Math.max(
    0,
    Math.min(sceneDurationFrames - 15, Math.floor(sceneDurationFrames * 0.85)),
  );

  // ── 1. 헤더 / 콘텐츠 분리 ──
  let headerCount = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (isHeaderNode(nodes[i])) headerCount = i + 1;
    else break;
  }
  if (headerCount === 0) headerCount = 1;

  const headers = nodes.slice(0, headerCount);
  const contents = nodes.slice(headerCount);

  // ── 2. 자막 프레임 계산 ──
  const subFrames = subtitles.map((s) =>
    Math.max(0, Math.round((s.startTime - sceneStartSec) * FPS)),
  );

  // ── 3. 헤더 타이밍: 첫 콘텐츠 등장 전까지 빠르게 캐스케이드 ──
  // 두 번째 자막 시점 또는 1초를 deadline으로 사용
  const headerDeadline =
    subFrames.length >= 2
      ? Math.min(subFrames[1], FPS * 2)
      : Math.min(subFrames[0] ?? FPS, FPS * 2);

  const headerStagger = Math.max(
    6,
    Math.min(12, Math.floor(Math.max(headerDeadline, 18) / (headers.length + 1))),
  );

  for (let i = 0; i < headers.length; i++) {
    headers[i].motion!.enterAt = i * headerStagger;
  }

  if (contents.length === 0) return { matchLog };

  const headerEndFrame = headers.length * headerStagger;
  const MIN_GAP = contents.length >= 6 ? 10 : 15;

  // ── 4. 콘텐츠: 의미 매칭 ──
  interface Assignment {
    nodeIdx: number;
    frame: number;
    matched: boolean;
    matchedSubIdx: number;
    score: number;
  }

  const assignments: Assignment[] = [];

  for (let ni = 0; ni < contents.length; ni++) {
    const node = contents[ni];
    const nodeText = extractNodeText(node);
    const keywords = extractKeywords(nodeText);

    if (keywords.length === 0) {
      assignments.push({
        nodeIdx: ni,
        frame: -1,
        matched: false,
        matchedSubIdx: -1,
        score: 0,
      });
      continue;
    }

    let bestScore = 0;
    let bestSubIdx = -1;

    for (let si = 0; si < subtitles.length; si++) {
      const score = matchScore(keywords, subtitles[si].text);
      if (score > bestScore) {
        bestScore = score;
        bestSubIdx = si;
      }
    }

    // 최소 3자 이상 매칭 (한글 2글자 단어 하나 정도)
    if (bestScore >= 3 && bestSubIdx >= 0) {
      // 자막 시작보다 앞서 등장 (15프레임 ≈ 0.5초) — 비트감 향상
      const frame = Math.max(headerEndFrame, subFrames[bestSubIdx] - 15);
      assignments.push({
        nodeIdx: ni,
        frame,
        matched: true,
        matchedSubIdx: bestSubIdx,
        score: bestScore,
      });

      // 매칭된 키워드 추출 (로깅용)
      const matchedKws = keywords.filter((kw) => subtitles[bestSubIdx].text.includes(kw));
      matchLog.push(
        `    [C] ${node.type} "${nodeText.slice(0, 20)}..." → sub[${bestSubIdx}] "${subtitles[bestSubIdx].text.slice(0, 25)}..." (score=${bestScore}, kw=[${matchedKws.slice(0, 3).join(",")}])`,
      );
    } else {
      assignments.push({
        nodeIdx: ni,
        frame: -1,
        matched: false,
        matchedSubIdx: -1,
        score: 0,
      });
      matchLog.push(
        `    [C] ${node.type} "${nodeText.slice(0, 20)}..." → no match (best=${bestScore})`,
      );
    }
  }

  // ── 5. 미매칭 노드 → 인접 매칭 노드 사이에 보간 ──
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].matched) continue;

    // 앞쪽에서 가장 가까운 매칭 노드
    let prevFrame = headerEndFrame;
    for (let j = i - 1; j >= 0; j--) {
      if (assignments[j].frame >= 0) {
        prevFrame = assignments[j].frame;
        break;
      }
    }

    // 뒤쪽에서 가장 가까운 매칭 노드
    let nextFrame = maxEnterFrame;
    for (let j = i + 1; j < assignments.length; j++) {
      if (assignments[j].matched) {
        nextFrame = assignments[j].frame;
        break;
      }
    }

    // 미매칭 연속 구간의 위치에 따라 균등 분배
    let unmatchedStart = i;
    let unmatchedEnd = i;
    while (unmatchedEnd + 1 < assignments.length && !assignments[unmatchedEnd + 1].matched) {
      unmatchedEnd++;
    }

    const count = unmatchedEnd - unmatchedStart + 1;
    const step = Math.max(MIN_GAP, Math.floor((nextFrame - prevFrame) / (count + 1)));

    for (let k = 0; k < count; k++) {
      assignments[unmatchedStart + k].frame = Math.min(
        prevFrame + (k + 1) * step,
        maxEnterFrame,
      );
    }

    // Skip the rest of this unmatched group
    i = unmatchedEnd;
  }

  // ── 6. 순서 보장 + 최소 간격 강제 ──
  // 원래 노드 순서는 유지하면서 monotonic increase 보장
  for (let i = 0; i < assignments.length; i++) {
    const a = assignments[i];
    a.frame = Math.max(headerEndFrame, Math.min(a.frame, maxEnterFrame));

    if (i > 0) {
      const prevFrame = assignments[i - 1].frame;
      if (a.frame < prevFrame + MIN_GAP) {
        a.frame = Math.min(prevFrame + MIN_GAP, maxEnterFrame);
      }
    }
  }

  // ── 7. 적용 ──
  for (const a of assignments) {
    contents[a.nodeIdx].motion!.enterAt = a.frame;
  }

  return { matchLog };
}

// ---------------------------------------------------------------------------
// 메인 처리
// ---------------------------------------------------------------------------
function syncEnterAt(scenesPath: string): void {
  const raw = fs.readFileSync(scenesPath, "utf-8");
  let scenes: Scene[];

  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    scenes = parsed;
  } else if (parsed.scenes) {
    scenes = parsed.scenes;
  } else {
    throw new Error("Unknown format");
  }

  let totalUpdated = 0;

  for (const scene of scenes) {
    if (!scene.stack_root) continue;
    if (!scene.subtitles || scene.subtitles.length === 0) continue;

    const sceneStartSec = scene.start_ms / 1000;
    const nodes = collectAnimatedNodes(scene.stack_root);

    if (nodes.length === 0) continue;

    const before = nodes.map((n) => ({
      id: n.id,
      enterAt: n.motion?.enterAt,
    }));

    const { matchLog } = distributeNodes(
      nodes,
      scene.subtitles,
      sceneStartSec,
      scene.duration_frames,
    );

    const after = nodes.map((n) => ({
      id: n.id,
      enterAt: n.motion?.enterAt,
    }));

    let changed = 0;
    for (let i = 0; i < before.length; i++) {
      if (before[i].enterAt !== after[i].enterAt) {
        changed++;
      }
    }

    if (changed > 0) {
      console.log(
        `${scene.id}: ${changed}/${nodes.length} nodes updated ` +
          `(${scene.subtitles.length} subs, ${scene.duration_frames} frames)`,
      );
      // 헤더/콘텐츠 enterAt 변경 상세
      for (let i = 0; i < nodes.length; i++) {
        const b = before[i].enterAt ?? 0;
        const a = after[i].enterAt ?? 0;
        const nodeType = nodes[i].type;
        const isH = isHeaderNode(nodes[i]) ? "H" : "C";
        if (b !== a) {
          console.log(
            `    [${isH}] ${nodeType}: ${b} → ${a} (${(a / FPS).toFixed(1)}s)`,
          );
        }
      }
      // 의미 매칭 로그
      if (matchLog.length > 0) {
        console.log("    ── semantic matches ──");
        for (const log of matchLog) console.log(log);
      }
      totalUpdated += changed;
    }
  }

  const output = Array.isArray(parsed) ? scenes : { ...parsed, scenes };
  fs.writeFileSync(scenesPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(
    `\nTotal: ${totalUpdated} enterAt values updated in ${scenesPath}`,
  );
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: npx tsx scripts/sync-enterAt.ts <scenes-file.json>");
  process.exit(1);
}

for (const file of args) {
  console.log(`\n=== Processing: ${file} ===`);
  syncEnterAt(file);
}
