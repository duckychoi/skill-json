// /api/scenes — scene-review.html 용 GET/PUT
// scenes-v2.json ↔ scene-review 포맷 변환

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { parseSRT } from "@/services/srt-parser";

const PROJECT_ID = "rag-intro";
const DATA_DIR = path.join(process.cwd(), "data", PROJECT_ID);
const SCENES_FILE = path.join(DATA_DIR, "scenes-v2.json");
const SRT_FILE = path.join(process.cwd(), "input", "자막.srt");

interface SRTEntry {
  index: number;
  startTime: number;
  endTime: number;
  text: string;
}

interface ReviewScene {
  id: string;
  layoutType: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  subtitles: SRTEntry[];
  keywords: string[];
  intent: string;
  tone: string;
  evidence_type: string;
  density: number;
  // 원본 데이터 보존
  _original?: Record<string, unknown>;
}

// scenes-v2.json → scene-review 포맷 변환
async function loadReviewScenes(): Promise<ReviewScene[]> {
  const scenesRaw = JSON.parse(await fs.readFile(SCENES_FILE, "utf-8"));
  const srtContent = await fs.readFile(SRT_FILE, "utf-8");
  const srtEntries = parseSRT(srtContent, 30);

  // SRT 엔트리를 시간(초) 기반으로 변환
  const allSubs: SRTEntry[] = srtEntries.map((e, i) => ({
    index: i,
    startTime: e.startMs / 1000,
    endTime: e.endMs / 1000,
    text: e.text,
  }));

  return scenesRaw.map((scene: Record<string, unknown>, idx: number) => {
    const startMs = scene.start_ms as number;
    const endMs = scene.end_ms as number;
    const meta = scene.chunk_metadata as Record<string, unknown> ?? {};

    // 이 씬 범위에 해당하는 자막 찾기 (startTime 기준, 중복 방지를 위해 엄격 매칭)
    const subs = allSubs.filter(
      (s) => s.startTime * 1000 >= startMs && s.startTime * 1000 < endMs
    );

    return {
      id: `scene-${idx + 1}`,
      layoutType: (scene.layout_family as string) ?? "hero-center",
      title: subs[0]?.text?.slice(0, 30) ?? `Scene ${idx + 1}`,
      startTime: startMs / 1000,
      endTime: endMs / 1000,
      duration: (endMs - startMs) / 1000,
      subtitles: subs,
      keywords: (meta.emphasis_tokens as string[]) ?? [],
      intent: (meta.intent as string) ?? "introduce",
      tone: (meta.tone as string) ?? "neutral",
      evidence_type: (meta.evidence_type as string) ?? "none",
      density: (meta.density as number) ?? 2,
      _original: scene as Record<string, unknown>,
    };
  });
}

// scene-review 포맷 → scenes-v2.json 변환 저장
async function saveReviewScenes(reviewScenes: ReviewScene[]): Promise<number> {
  const output = reviewScenes.map((rs, idx) => {
    const startMs = Math.round(rs.startTime * 1000);
    const endMs = Math.round(rs.endTime * 1000);
    const durationFrames = Math.round((endMs - startMs) * 30 / 1000);

    // 원본 데이터가 있으면 유지, 없으면 새로 생성
    const orig = rs._original ?? {};

    return {
      id: `scene-${idx}`,
      project_id: PROJECT_ID,
      beat_index: idx,
      layout_family: rs.layoutType,
      start_ms: startMs,
      end_ms: endMs,
      duration_frames: durationFrames,
      components: [],
      copy_layers: (orig.copy_layers as Record<string, unknown>) ?? {
        kicker: null,
        headline: rs.title,
        supporting: null,
        footer_caption: null,
      },
      motion: (orig.motion as Record<string, unknown>) ?? {
        entrance: "fadeUp",
        emphasis: null,
        exit: null,
        duration_ms: endMs - startMs,
      },
      assets: (orig.assets as Record<string, unknown>) ?? {
        svg_icons: [],
        chart_type: null,
        chart_data: null,
      },
      chunk_metadata: {
        intent: rs.intent,
        tone: rs.tone,
        evidence_type: rs.evidence_type,
        emphasis_tokens: rs.keywords,
        density: rs.density,
        beat_count: 1,
      },
      narration: "",
      stack_root: (orig.stack_root as Record<string, unknown>) ?? null,
    };
  });

  await fs.writeFile(SCENES_FILE, JSON.stringify(output, null, 2), "utf-8");

  // render-props도 갱신
  const renderPropsPath = path.join(DATA_DIR, "render-props-v2.json");
  await fs.writeFile(
    renderPropsPath,
    JSON.stringify({ scenes: output }, null, 2),
    "utf-8"
  );

  return output.length;
}

export async function GET(): Promise<NextResponse> {
  try {
    const scenes = await loadReviewScenes();
    return NextResponse.json(scenes);
  } catch (err) {
    return NextResponse.json(
      { error: "씬 로드 실패: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const scenes: ReviewScene[] = await req.json();
    const count = await saveReviewScenes(scenes);
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json(
      { error: "저장 실패: " + (err as Error).message },
      { status: 500 }
    );
  }
}
