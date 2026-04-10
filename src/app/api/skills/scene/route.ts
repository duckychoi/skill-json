// @TASK P1.5-SK2-T3 - /vg-scene Scene 생성 API Route
// @SPEC beats.json + catalog -> scene-plan.json + scenes.json 생성
// @TEST tests/api/skills-scene.test.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import {
  selectBestLayout,
  scoreAllLayouts,
  type ScoringInput,
  type ScoringContext,
  type ScoringResult,
} from "@/services/scoring-engine";
import { generateSceneDSL, type DSLGeneratorInput } from "@/services/dsl-generator";
import type { Project, Scene } from "@/types/index";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface ScenePlanEntry {
  beat_index: number;
  selected_layout: string;
  score: number;
  breakdown: object;
  alternatives: Array<{ layout: string; score: number }>;
}

interface ScenePlan {
  project_id: string;
  total_beats: number;
  plans: ScenePlanEntry[];
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const SceneRequestSchema = z.object({
  project_id: z.string().min(1, "project_id는 필수입니다"),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function beatToScoringInput(beat: Beat): ScoringInput {
  return {
    intent: beat.semantic.intent,
    tone: beat.semantic.tone,
    evidenceType: beat.semantic.evidence_type,
    emphasisTokens: [...beat.semantic.emphasis_tokens],
    density: beat.semantic.density,
    hasChartData: false,
    hasIcons: false,
  };
}

// ---------------------------------------------------------------------------
// POST /api/skills/scene
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse & validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다" },
        { status: 400 }
      );
    }

    const parsed = SceneRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 검증 실패",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { project_id } = parsed.data;

    // 2. Read beats.json (required)
    const beatsPath = getProjectPath(project_id, "beats.json");
    const beats = await readJSON<Beat[]>(beatsPath);
    if (!beats || beats.length === 0) {
      return NextResponse.json(
        { error: `beats.json을 찾을 수 없거나 비어 있습니다: ${project_id}` },
        { status: 400 }
      );
    }

    // 3. Read design-tokens.json (optional, use defaults if missing)
    const designTokensPath = getProjectPath(project_id, "design-tokens.json");
    const _designTokens = await readJSON<Record<string, unknown>>(designTokensPath);
    // design-tokens are loaded for future use; defaults apply when null

    // 4. Process each beat: scoring + DSL generation
    const scoringContext: ScoringContext = {
      recentLayouts: [],
      previousLayout: null,
    };

    const plans: ScenePlanEntry[] = [];
    const scenes: Scene[] = [];

    for (const beat of beats) {
      const scoringInput = beatToScoringInput(beat);

      // 4a. Select best layout via scoring engine
      const bestResult: ScoringResult = selectBestLayout(scoringInput, { ...scoringContext });

      // 4b. Get all layout scores for alternatives
      const allResults = scoreAllLayouts(scoringInput, { ...scoringContext });
      const alternatives = allResults
        .filter((r) => r.layoutFamily !== bestResult.layoutFamily)
        .slice(0, 3)
        .map((r) => ({ layout: r.layoutFamily, score: r.score }));

      // 4c. Build scene plan entry
      plans.push({
        beat_index: beat.beat_index,
        selected_layout: bestResult.layoutFamily,
        score: bestResult.score,
        breakdown: bestResult.breakdown,
        alternatives,
      });

      // 4d. Generate Scene DSL
      const dslInput: DSLGeneratorInput = {
        beat,
        layoutFamily: bestResult.layoutFamily,
        projectId: project_id,
      };
      const scene = generateSceneDSL(dslInput);
      scenes.push(scene);

      // 4e. Update scoring context for next beat (repetition penalty tracking)
      scoringContext.previousLayout = bestResult.layoutFamily;
      scoringContext.recentLayouts = [
        ...scoringContext.recentLayouts,
        bestResult.layoutFamily,
      ].slice(-3); // Keep last 3
    }

    // 5. Write scene-plan.json
    const scenePlan: ScenePlan = {
      project_id,
      total_beats: beats.length,
      plans,
    };
    const scenePlanPath = getProjectPath(project_id, "scene-plan.json");
    await writeJSON(scenePlanPath, scenePlan);

    // 6. Write scenes.json
    const scenesPath = getProjectPath(project_id, "scenes.json");
    await writeJSON(scenesPath, scenes);

    // 7. Update project.json status to "scened"
    const projectPath = getProjectPath(project_id, "project.json");
    const project = await readJSON<Project>(projectPath);
    if (project) {
      const updatedProject: Project = {
        ...project,
        status: "scened",
        updated_at: new Date().toISOString(),
      };
      await writeJSON(projectPath, updatedProject);
    }

    // 8. Return success
    return NextResponse.json(
      {
        success: true,
        scenes_count: scenes.length,
        scene_plan_path: `data/${project_id}/scene-plan.json`,
        scenes_path: `data/${project_id}/scenes.json`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "씬 생성 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
