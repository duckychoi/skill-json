import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/services/file-service";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const chunksPath = path.join(process.cwd(), "data", projectId, "chunks.json");
  const chunks = await readJSON<unknown[]>(chunksPath);

  if (!chunks) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(chunks, { status: 200 });
}
