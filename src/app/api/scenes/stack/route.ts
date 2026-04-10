// /api/scenes/stack — Stack tree composition API
// POST: compose a stack tree from a template key + input
// GET:  list available template keys with descriptions

import { NextRequest, NextResponse } from "next/server";
import {
  composeWithTemplate,
  resetIdCounter,
  resetRecentTemplates,
} from "@/services/stack-composer";
import type { ComposeInput } from "@/services/stack-composer";

// ---------------------------------------------------------------------------
// Template catalogue
// ---------------------------------------------------------------------------

const TEMPLATE_CATALOGUE: Record<string, string> = {
  introduceCenter:   "중앙 인트로 — Icon + Headline + BodyText",
  explainDefinition: "정의 설명 — Headline + Split[BulletList, Icon+Badge]",
  explainDramatic:   "강조 설명 — Kicker + RingChart/Icon + Headline",
  compareExample:    "비교 예시 — Headline + Split[IconCard A, IconCard B]",
  listDefinition:    "순서 정의 — Kicker + Headline + ProcessStepCard×N + Arrow",
  listExample:       "목록 예시 — Kicker + Headline + Grid[IconCard×N]",
  emphasizeQuote:    "인용 강조 — Icon(quote) + Headline + Divider + CompareCard",
  emphasizeGlow:     "글로우 강조 — Overlay[AccentGlow + Icon + Headline]",
};

const VALID_KEYS = new Set(Object.keys(TEMPLATE_CATALOGUE));

// ---------------------------------------------------------------------------
// GET  /api/scenes/stack
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  const templates = Object.entries(TEMPLATE_CATALOGUE).map(
    ([key, description]) => ({ key, description }),
  );
  return NextResponse.json({ templates });
}

// ---------------------------------------------------------------------------
// POST /api/scenes/stack
// ---------------------------------------------------------------------------

interface PostBody {
  templateKey: string;
  input: ComposeInput;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: PostBody = await req.json();
    const { templateKey, input } = body;

    // --- validation ---
    if (!templateKey || typeof templateKey !== "string") {
      return NextResponse.json(
        { error: "templateKey is required and must be a string" },
        { status: 400 },
      );
    }

    if (!VALID_KEYS.has(templateKey)) {
      return NextResponse.json(
        {
          error: `Invalid templateKey "${templateKey}". Must be one of: ${[...VALID_KEYS].join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (!input || typeof input !== "object") {
      return NextResponse.json(
        { error: "input (ComposeInput) is required" },
        { status: 400 },
      );
    }

    // --- reset state ---
    resetIdCounter();
    resetRecentTemplates();

    // --- compose ---
    const stackRoot = composeWithTemplate(templateKey, input);

    if (!stackRoot) {
      return NextResponse.json(
        { error: "Failed to compose stack tree" },
        { status: 500 },
      );
    }

    return NextResponse.json({ stack_root: stackRoot });
  } catch (err) {
    return NextResponse.json(
      { error: "Stack composition failed: " + (err as Error).message },
      { status: 500 },
    );
  }
}
