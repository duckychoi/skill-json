import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { readJSON, getProjectPath } from "@/services/file-service";
import type { Project } from "@/types/index";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const file = req.nextUrl.searchParams.get("file");

  let filePath: string;

  if (projectId) {
    // projectId 기반: data/{projectId}/project.json에서 srt_path 읽기
    const project = await readJSON<Project>(getProjectPath(projectId, "project.json"));
    if (!project) {
      return NextResponse.json({ error: `프로젝트를 찾을 수 없습니다: ${projectId}` }, { status: 404 });
    }
    filePath = path.join(process.cwd(), "data", projectId, project.srt_path);
  } else if (file) {
    // 레거시: input/ 폴더에서 직접 읽기
    const safeName = path.basename(file);
    filePath = path.join(process.cwd(), "input", safeName);
  } else {
    return NextResponse.json({ error: "projectId 또는 file 파라미터가 필요합니다" }, { status: 400 });
  }

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "SRT 파일을 찾을 수 없습니다" }, { status: 404 });
  }
}
