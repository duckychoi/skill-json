// @TASK P0-T0.4 - 파일 시스템 서비스 레이어 테스트
// @SPEC specs/shared/types.yaml

// vitest node 환경 사용 (fs/promises 필요)
// @vitest-environment node

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import {
  readJSON,
  writeJSON,
  listFiles,
  ensureDir,
  getProjectPath,
} from "@/services/file-service";
import type { Project, Scene } from "@/types";

const TEST_DATA_DIR = path.join(process.cwd(), "tmp-test-data");

describe("file-service", () => {
  beforeEach(async () => {
    // 테스트용 임시 디렉토리 생성
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
  });

  afterEach(async () => {
    // 테스트용 임시 디렉토리 삭제
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  // ─── readJSON ────────────────────────────────────────────

  describe("readJSON", () => {
    it("should read and parse a valid JSON file", async () => {
      const filePath = path.join(TEST_DATA_DIR, "test.json");
      const data = { id: "proj-1", name: "Test Project" };
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");

      const result = await readJSON<{ id: string; name: string }>(filePath);
      expect(result).toEqual(data);
    });

    it("should return null when file does not exist", async () => {
      const filePath = path.join(TEST_DATA_DIR, "nonexistent.json");
      const result = await readJSON<Project>(filePath);
      expect(result).toBeNull();
    });

    it("should return null for invalid JSON content", async () => {
      const filePath = path.join(TEST_DATA_DIR, "invalid.json");
      await fs.writeFile(filePath, "{ broken json !!!", "utf-8");

      const result = await readJSON<Project>(filePath);
      expect(result).toBeNull();
    });

    it("should preserve generic type structure", async () => {
      const filePath = path.join(TEST_DATA_DIR, "project.json");
      const project: Project = {
        id: "proj-1",
        name: "My Project",
        srt_path: "/data/proj-1/sub.srt",
        audio_path: "/data/proj-1/audio.mp3",
        created_at: "2026-03-10T00:00:00Z",
        updated_at: "2026-03-10T00:00:00Z",
        status: "draft",
        total_duration_ms: 60000,
      };
      await fs.writeFile(filePath, JSON.stringify(project), "utf-8");

      const result = await readJSON<Project>(filePath);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("proj-1");
      expect(result!.status).toBe("draft");
      expect(result!.total_duration_ms).toBe(60000);
    });
  });

  // ─── writeJSON ───────────────────────────────────────────

  describe("writeJSON", () => {
    it("should write data as formatted JSON", async () => {
      const filePath = path.join(TEST_DATA_DIR, "output.json");
      const data = { id: "proj-2", name: "Written Project" };

      await writeJSON(filePath, data);

      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      expect(parsed).toEqual(data);
      // 포맷팅 확인 (pretty-print with 2 spaces)
      expect(raw).toContain("\n");
    });

    it("should create parent directories if they do not exist", async () => {
      const filePath = path.join(TEST_DATA_DIR, "nested", "deep", "file.json");
      const data = { key: "value" };

      await writeJSON(filePath, data);

      const result = await readJSON<{ key: string }>(filePath);
      expect(result).toEqual(data);
    });

    it("should overwrite existing file", async () => {
      const filePath = path.join(TEST_DATA_DIR, "overwrite.json");
      await writeJSON(filePath, { version: 1 });
      await writeJSON(filePath, { version: 2 });

      const result = await readJSON<{ version: number }>(filePath);
      expect(result).toEqual({ version: 2 });
    });

    it("should write typed data correctly", async () => {
      const filePath = path.join(TEST_DATA_DIR, "typed.json");
      const project: Project = {
        id: "proj-typed",
        name: "Typed Project",
        srt_path: "/srt",
        audio_path: "/audio",
        created_at: "2026-03-10T00:00:00Z",
        updated_at: "2026-03-10T00:00:00Z",
        status: "chunked",
        total_duration_ms: 120000,
      };

      await writeJSON<Project>(filePath, project);

      const result = await readJSON<Project>(filePath);
      expect(result).toEqual(project);
    });
  });

  // ─── listFiles ───────────────────────────────────────────

  describe("listFiles", () => {
    it("should list all files in a directory", async () => {
      await fs.writeFile(path.join(TEST_DATA_DIR, "a.json"), "{}");
      await fs.writeFile(path.join(TEST_DATA_DIR, "b.json"), "{}");
      await fs.writeFile(path.join(TEST_DATA_DIR, "c.txt"), "hello");

      const files = await listFiles(TEST_DATA_DIR);
      expect(files).toHaveLength(3);
      expect(files).toContain("a.json");
      expect(files).toContain("b.json");
      expect(files).toContain("c.txt");
    });

    it("should filter files by pattern (extension)", async () => {
      await fs.writeFile(path.join(TEST_DATA_DIR, "a.json"), "{}");
      await fs.writeFile(path.join(TEST_DATA_DIR, "b.json"), "{}");
      await fs.writeFile(path.join(TEST_DATA_DIR, "c.txt"), "hello");

      const jsonFiles = await listFiles(TEST_DATA_DIR, ".json");
      expect(jsonFiles).toHaveLength(2);
      expect(jsonFiles).toContain("a.json");
      expect(jsonFiles).toContain("b.json");
      expect(jsonFiles).not.toContain("c.txt");
    });

    it("should return empty array for nonexistent directory", async () => {
      const files = await listFiles(path.join(TEST_DATA_DIR, "nope"));
      expect(files).toEqual([]);
    });

    it("should return empty array for empty directory", async () => {
      const emptyDir = path.join(TEST_DATA_DIR, "empty");
      await fs.mkdir(emptyDir, { recursive: true });

      const files = await listFiles(emptyDir);
      expect(files).toEqual([]);
    });

    it("should not include subdirectories in results", async () => {
      await fs.mkdir(path.join(TEST_DATA_DIR, "subdir"), { recursive: true });
      await fs.writeFile(path.join(TEST_DATA_DIR, "file.json"), "{}");

      const files = await listFiles(TEST_DATA_DIR);
      expect(files).toContain("file.json");
      expect(files).not.toContain("subdir");
    });
  });

  // ─── ensureDir ───────────────────────────────────────────

  describe("ensureDir", () => {
    it("should create a directory recursively", async () => {
      const deepDir = path.join(TEST_DATA_DIR, "a", "b", "c");
      await ensureDir(deepDir);

      const stat = await fs.stat(deepDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it("should not throw if directory already exists", async () => {
      const dir = path.join(TEST_DATA_DIR, "existing");
      await fs.mkdir(dir, { recursive: true });

      await expect(ensureDir(dir)).resolves.toBeUndefined();
    });
  });

  // ─── getProjectPath ──────────────────────────────────────

  describe("getProjectPath", () => {
    it("should return correct project.json path", () => {
      const result = getProjectPath("proj-abc", "project.json");
      expect(result).toMatch(/data[/\\]proj-abc[/\\]project.json$/);
    });

    it("should return correct scenes.json path", () => {
      const result = getProjectPath("proj-abc", "scenes.json");
      expect(result).toMatch(/data[/\\]proj-abc[/\\]scenes.json$/);
    });

    it("should return correct beats.json path", () => {
      const result = getProjectPath("proj-abc", "beats.json");
      expect(result).toMatch(/data[/\\]proj-abc[/\\]beats.json$/);
    });

    it("should return correct scene-plan.json path", () => {
      const result = getProjectPath("proj-abc", "scene-plan.json");
      expect(result).toMatch(/data[/\\]proj-abc[/\\]scene-plan.json$/);
    });
  });
});
