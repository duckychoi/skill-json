// @TASK P0-T0.4 - 파일 시스템 서비스 레이어 (JSON 파일 기반 CRUD)
// @SPEC specs/shared/types.yaml

import fs from "fs/promises";
import path from "path";

/**
 * JSON 파일을 읽어서 파싱합니다.
 * 파일이 존재하지 않거나 파싱에 실패하면 null을 반환합니다.
 */
export async function readJSON<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * 데이터를 JSON 파일로 씁니다.
 * 부모 디렉토리가 없으면 자동으로 생성합니다.
 * 2-space indent로 포맷팅합니다.
 */
export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * 디렉토리 내 파일 목록을 반환합니다.
 * pattern이 주어지면 해당 확장자로 필터링합니다.
 * 디렉토리가 없으면 빈 배열을 반환합니다.
 * 하위 디렉토리는 포함하지 않습니다.
 */
export async function listFiles(
  dir: string,
  pattern?: string
): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    let files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);

    if (pattern) {
      files = files.filter((name) => name.endsWith(pattern));
    }

    return files;
  } catch {
    return [];
  }
}

/**
 * 디렉토리 내 하위 디렉토리 목록을 반환합니다.
 * 디렉토리가 없으면 빈 배열을 반환합니다.
 */
export async function listDirs(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * 디렉토리를 재귀적으로 생성합니다.
 * 이미 존재해도 에러를 발생시키지 않습니다.
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * 프로젝트 데이터 파일 경로를 반환합니다.
 * 규칙: data/{projectId}/{filename}
 */
export type ProjectFileName =
  | "project.json"
  | "scenes.json"
  | "scenes-v2.json"
  | "render-props-v2.json"
  | "beats.json"
  | "scene-plan.json"
  | "design-tokens.json"
  | "layout-exemplars.json"
  | "catalog.json";

export function getProjectPath(
  projectId: string,
  fileName: ProjectFileName
): string {
  return path.join(process.cwd(), "data", projectId, fileName);
}
