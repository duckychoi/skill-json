#!/usr/bin/env node
/**
 * 콘텐츠 부족 씬에 InsightTile 자동 삽입
 * 조건: 콘텐츠 노드 ≤2개 + 15초 이상
 * 자막 중간 지점에서 핵심 문구를 뽑아 InsightTile 생성
 */
const fs = require("fs");
const path = require("path");

const scenesPath = process.argv[2];
if (!scenesPath) { console.error("Usage: node pad-sparse-scenes.js <scenes-v2.json>"); process.exit(1); }
const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf-8"));

const HEADER = new Set(["Badge","Kicker","Pill","Headline","Divider",
  "AccentGlow","AccentRing","Backplate","Overlay"]);

function collectMotionNodes(node, list = []) {
  if (node.motion?.enterAt !== undefined) list.push(node);
  if (node.children) node.children.forEach(c => collectMotionNodes(c, list));
  return list;
}

function countContent(node) {
  const nodes = collectMotionNodes(node);
  return nodes.filter(n => !HEADER.has(n.type)).length;
}

// 자막에서 특정 시간대의 문구 추출
function getSubtitleAt(subs, sceneStartSec, targetPct, sceneDur) {
  const targetSec = sceneStartSec + (sceneDur / 30) * targetPct;
  let best = null, bestDist = Infinity;
  subs.forEach(sub => {
    const mid = (sub.startTime + sub.endTime) / 2;
    const dist = Math.abs(mid - targetSec);
    if (dist < bestDist) { bestDist = dist; best = sub; }
  });
  return best?.text || null;
}

let padCount = 0;

scenes.forEach(s => {
  const dur = s.duration_frames;
  if (!s.stack_root) return;
  const cc = countContent(s.stack_root);
  if (cc > 2 || dur <= 450) return;

  const sceneStartSec = s.start_ms / 1000;

  // 40%와 65% 지점의 자막을 InsightTile로 삽입
  const tiles = [];
  const pcts = cc <= 1 ? [0.30, 0.50, 0.70] : [0.40, 0.65];

  const usedTexts = new Set();
  pcts.forEach((pct, idx) => {
    const text = getSubtitleAt(s.subtitles, sceneStartSec, pct, dur);
    if (!text) return;

    // 텍스트 길이 제한 (InsightTile에 맞게)
    const trimmed = text.length > 40 ? text.substring(0, 38) + '…' : text;

    // 중복 텍스트 방지: 이미 사용된 텍스트는 건너뜀
    if (usedTexts.has(trimmed)) return;
    usedTexts.add(trimmed);

    tiles.push({
      id: `pad-insight-${s.beat_index}-${idx}`,
      type: "InsightTile",
      data: { index: "·", title: trimmed },
      motion: { preset: "fadeUp", enterAt: Math.round(dur * pct), duration: 12 }
    });
  });

  if (tiles.length === 0) return;

  // SceneRoot의 children 끝에 삽입
  s.stack_root.children.push(...tiles);

  const ts = (sceneStartSec/60|0)+':'+((sceneStartSec%60)|0).toString().padStart(2,'0');
  console.log(`beat=${s.beat_index} (${ts}) +${tiles.length} InsightTile (${cc}→${cc+tiles.length} content nodes)`);
  padCount++;
});

fs.writeFileSync(scenesPath, JSON.stringify(scenes, null, 2));
console.log(`\n✅ ${padCount}개 씬에 InsightTile 삽입 완료`);
