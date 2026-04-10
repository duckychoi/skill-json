import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { readJSON } from "@/services/file-service";

interface ChunkScene {
  scene_index: number;
  srt_range: [number, number];
  start_ms: number;
  end_ms: number;
  duration_s: number;
  subtitle_count: number;
  text: string;
}

interface Beat {
  beat_index: number;
  start_ms: number;
  end_ms: number;
  start_frame: number;
  end_frame: number;
  text: string;
  semantic: {
    intent: string;
    tone: string;
    evidence_type: string;
    emphasis_tokens: string[];
    density: number;
  };
}

interface ScenesV2Entry {
  id: string;
  project_id: string;
  beat_index: number;
  layout_family: string;
  start_ms: number;
  end_ms: number;
  duration_frames: number;
  components: unknown[];
  copy_layers: {
    kicker: string | null;
    headline: string;
    supporting: string | null;
    footer_caption: string | null;
  };
  motion: {
    entrance: string;
    emphasis: string | null;
    exit: string | null;
    duration_ms: number;
  };
  assets: {
    svg_icons: string[];
    chart_type: string | null;
    chart_data: unknown | null;
  };
  chunk_metadata: {
    intent: string;
    tone: string;
    evidence_type: string;
    emphasis_tokens: string[];
    density: number;
    beat_count: number;
  };
  subtitles: Array<{ startTime: number; endTime: number; text: string }>;
  narration: string;
}

const FPS = 30;

function pickIcons(text: string): string[] {
  const iconMap: [RegExp, string][] = [
    [/AI|인공지능|모델/, "brain"],
    [/코드|코딩|개발/, "code"],
    [/설계|아키텍처|구조/, "layers"],
    [/가치|핵심|중요/, "sparkles"],
    [/경고|주의|위험/, "alertTriangle"],
    [/철학|사상|생각/, "lightbulb"],
    [/노동|임금|월급/, "briefcase"],
    [/도구|기술|기계/, "tool"],
    [/사람|인간|개발자/, "users"],
    [/질문|물음/, "helpCircle"],
    [/검색|찾/, "search"],
    [/비교|대비|반면/, "gitCompare"],
    [/목록|리스트|정리/, "list"],
    [/시간|기간|날/, "clock"],
    [/돈|비용|가격|단가/, "dollarSign"],
    [/보호|방어|해자/, "shield"],
    [/성장|축적|쌓/, "trendingUp"],
    [/관계|신뢰|팀/, "heart"],
  ];

  const icons: string[] = [];
  for (const [re, icon] of iconMap) {
    if (re.test(text) && icons.length < 2) icons.push(icon);
  }
  if (icons.length === 0) icons.push("sparkles");
  return icons;
}

function extractHeadline(text: string): string {
  // 첫 문장에서 핵심 키워드 25자 이내 추출
  const sentences = text.split(/[.?!]\s*/);
  const first = sentences[0] || text;
  if (first.length <= 25) return first;
  // 25자까지 자르고 단어 경계에서 끊기
  const truncated = first.slice(0, 25);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated;
}

function guessIntent(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("예를 들") || lower.includes("예시")) return "example";
  if (lower.includes("비교") || lower.includes("반면")) return "compare";
  if (lower.includes("첫째") || lower.includes("둘째") || lower.includes("셋째")) return "list";
  if (lower.includes("중요") || lower.includes("핵심") || lower.includes("특히")) return "emphasize";
  if (lower.includes("정의") || lower.includes("란") || lower.includes("이란")) return "define";
  return "explain";
}

function guessLayout(intent: string, density: number): string {
  switch (intent) {
    case "compare": return "split-2col";
    case "list": return density > 3 ? "grid-4x3" : "stacked-vertical";
    case "example": return "spotlight-case";
    case "emphasize": return "hero-center";
    case "define": return "radial-focus";
    default: return "stacked-vertical";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, scenes } = body as {
      project_id: string;
      scenes: ChunkScene[];
    };

    if (!project_id || !scenes) {
      return NextResponse.json(
        { error: "project_id와 scenes 필요" },
        { status: 400 }
      );
    }

    const outDir = path.join(process.cwd(), "data", project_id);
    await fs.mkdir(outDir, { recursive: true });

    // 1. chunks.json 저장
    const chunksPath = path.join(outDir, "chunks.json");
    await fs.writeFile(chunksPath, JSON.stringify(scenes, null, 2), "utf-8");

    // 2. beats.json 읽기 (subtitle 정보용)
    const beatsPath = path.join(outDir, "beats.json");
    const beats = await readJSON<Beat[]>(beatsPath);

    // 3. scenes-v2.json 생성
    const scenesV2: ScenesV2Entry[] = scenes.map((chunk, idx) => {
      const durationMs = chunk.end_ms - chunk.start_ms;
      const durationFrames = Math.round((durationMs / 1000) * FPS);

      // 해당 씬에 속하는 beats 추출
      const sceneBeats = beats
        ? beats.filter((b) => b.start_ms >= chunk.start_ms && b.end_ms <= chunk.end_ms + 100)
        : [];

      // subtitle 배열 생성
      const subtitles = sceneBeats.map((b) => ({
        startTime: (b.start_ms - chunk.start_ms) / 1000,
        endTime: (b.end_ms - chunk.start_ms) / 1000,
        text: b.text,
      }));

      // 의미 분석 (첫 beat 기준 또는 전체 텍스트)
      const fullText = chunk.text;
      const intent = sceneBeats.length > 0 ? sceneBeats[0].semantic.intent : guessIntent(fullText);
      const tone = sceneBeats.length > 0 ? sceneBeats[0].semantic.tone : "neutral";
      const evidenceType = sceneBeats.length > 0 ? sceneBeats[0].semantic.evidence_type : "statement";
      const emphasisTokens = sceneBeats.length > 0
        ? sceneBeats[0].semantic.emphasis_tokens
        : fullText.split(/\s+/).filter((t) => t.length > 2).slice(0, 5);
      const density = Math.min(5, Math.max(1, Math.ceil(chunk.subtitle_count / 3)));

      const layoutFamily = guessLayout(intent, density);
      const icons = pickIcons(fullText);
      const headline = extractHeadline(fullText);

      return {
        id: `scene-${idx}`,
        project_id,
        beat_index: idx,
        layout_family: layoutFamily,
        start_ms: chunk.start_ms,
        end_ms: chunk.end_ms,
        duration_frames: durationFrames,
        components: [],
        copy_layers: {
          kicker: idx === 0 ? "INTRO" : null,
          headline,
          supporting: null,
          footer_caption: null,
        },
        motion: {
          entrance: "fadeUp",
          emphasis: null,
          exit: null,
          duration_ms: durationMs,
        },
        assets: {
          svg_icons: icons,
          chart_type: null,
          chart_data: null,
        },
        chunk_metadata: {
          intent,
          tone,
          evidence_type: evidenceType,
          emphasis_tokens: emphasisTokens,
          density,
          beat_count: sceneBeats.length,
        },
        subtitles,
        narration: fullText,
      };
    });

    // 4. scenes-v2.json 저장
    const scenesV2Path = path.join(outDir, "scenes-v2.json");
    await fs.writeFile(
      scenesV2Path,
      JSON.stringify(scenesV2, null, 2),
      "utf-8"
    );

    // 5. project.json 상태 업데이트
    const projPath = path.join(outDir, "project.json");
    const projRaw = await fs.readFile(projPath, "utf-8").catch(() => null);
    if (projRaw) {
      const proj = JSON.parse(projRaw);
      proj.status = "scened";
      proj.updated_at = new Date().toISOString();
      proj.total_duration_ms = scenes[scenes.length - 1]?.end_ms || 0;
      await fs.writeFile(projPath, JSON.stringify(proj, null, 2), "utf-8");
    }

    return NextResponse.json({
      success: true,
      chunks_path: `data/${project_id}/chunks.json`,
      scenes_v2_path: `data/${project_id}/scenes-v2.json`,
      scenes_count: scenesV2.length,
    });
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
