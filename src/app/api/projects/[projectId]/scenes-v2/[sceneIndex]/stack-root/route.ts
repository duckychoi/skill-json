import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";
import type { Scene } from "@/types";
import type { StackNode } from "@/types/stack-nodes";

interface RenderProps {
  scenes: Scene[];
  audioFile?: string;
  [key: string]: unknown;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneIndex: string }> }
) {
  const { projectId, sceneIndex: indexStr } = await params;
  const sceneIndex = parseInt(indexStr, 10);

  if (isNaN(sceneIndex) || sceneIndex < 0) {
    return NextResponse.json(
      { error: "Invalid scene index" },
      { status: 400 }
    );
  }

  // render-props-v2.json에서 읽고 쓰기
  const filePath = getProjectPath(projectId, "render-props-v2.json");
  const props = await readJSON<RenderProps>(filePath);

  if (!props?.scenes) {
    return NextResponse.json(
      { error: "render-props-v2.json not found" },
      { status: 404 }
    );
  }

  if (sceneIndex >= props.scenes.length) {
    return NextResponse.json(
      { error: `Scene index ${sceneIndex} out of range (max: ${props.scenes.length - 1})` },
      { status: 400 }
    );
  }

  const body = (await req.json()) as { stack_root: StackNode };
  if (!body.stack_root) {
    return NextResponse.json(
      { error: "stack_root is required" },
      { status: 400 }
    );
  }

  props.scenes[sceneIndex].stack_root = body.stack_root;
  await writeJSON(filePath, props);

  return NextResponse.json({ ok: true });
}
