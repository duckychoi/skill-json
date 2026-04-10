import { NextRequest, NextResponse } from "next/server";
import { readJSON, getProjectPath } from "@/services/file-service";
import type { Scene } from "@/types";

interface RenderProps {
  scenes: Scene[];
  audioFile?: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // render-props-v2.json에서 scenes 읽기 (실제 렌더 데이터와 동일)
  const propsPath = getProjectPath(projectId, "render-props-v2.json");
  const props = await readJSON<RenderProps>(propsPath);

  if (props?.scenes) {
    return NextResponse.json(props.scenes);
  }

  // fallback: scenes-v2.json
  const filePath = getProjectPath(projectId, "scenes-v2.json");
  const scenes = await readJSON<Scene[]>(filePath);

  if (!scenes) {
    return NextResponse.json(
      { error: "No scenes data found" },
      { status: 404 }
    );
  }

  return NextResponse.json(scenes);
}
