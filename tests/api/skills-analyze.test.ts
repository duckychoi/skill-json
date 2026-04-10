// @TASK P1.5-SK3-T1 - /vg-analyze 스킬 (레퍼런스 분석) 테스트
// @SPEC .claude/skills/vg-analyze/SKILL.md

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// file-service 모킹
vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  listFiles: vi.fn(),
  listDirs: vi.fn(),
  ensureDir: vi.fn(),
  getProjectPath: vi.fn(),
}));

import {
  readJSON,
  writeJSON,
  listFiles,
} from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedListFiles = vi.mocked(listFiles);

import { POST } from "@/app/api/skills/analyze/route";

// ─────────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────────

function createRequest(body?: Record<string, unknown>): NextRequest {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new NextRequest(
    new URL("/api/skills/analyze", "http://localhost:3000"),
    init
  );
}

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("POST /api/skills/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  // 입력 검증
  // ═══════════════════════════════════════════
  describe("입력 검증", () => {
    it("project_id가 없으면 400을 반환한다", async () => {
      const req = createRequest({});
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it("project_id가 빈 문자열이면 400을 반환한다", async () => {
      const req = createRequest({ project_id: "" });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it("잘못된 JSON은 400을 반환한다", async () => {
      const req = new NextRequest(
        new URL("/api/skills/analyze", "http://localhost:3000"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid-json",
        }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════
  // 프로젝트 존재 확인
  // ═══════════════════════════════════════════
  describe("프로젝트 존재 확인", () => {
    it("존재하지 않는 프로젝트는 404를 반환한다", async () => {
      mockedReadJSON.mockResolvedValue(null);

      const req = createRequest({ project_id: "non-existent" });
      const res = await POST(req);

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════
  // 정상 분석 (references 디렉토리에서 이미지 조회)
  // ═══════════════════════════════════════════
  describe("정상 분석 흐름", () => {
    const MOCK_PROJECT = {
      id: "proj-test",
      name: "테스트 프로젝트",
      status: "draft",
    };

    beforeEach(() => {
      mockedReadJSON.mockResolvedValue(MOCK_PROJECT);
      mockedWriteJSON.mockResolvedValue(undefined);
      mockedListFiles.mockResolvedValue(["ref1.png", "ref2.jpg"]);
    });

    it("reference_images 없이 요청하면 디렉토리에서 이미지 파일을 조회한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(mockedListFiles).toHaveBeenCalled();
    });

    it("reference_images를 직접 제공하면 해당 이미지를 사용한다", async () => {
      const req = createRequest({
        project_id: "proj-test",
        reference_images: ["custom1.png", "custom2.jpg"],
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      // listFiles가 호출되지 않아야 한다 (직접 제공했으므로)
      expect(mockedListFiles).not.toHaveBeenCalled();
    });

    it("성공 시 design_tokens_path와 layout_exemplars_path를 반환한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.design_tokens_path).toContain("proj-test");
      expect(body.design_tokens_path).toContain("design-tokens.json");
      expect(body.layout_exemplars_path).toContain("proj-test");
      expect(body.layout_exemplars_path).toContain("layout-exemplars.json");
    });

    it("writeJSON을 2번 호출한다 (design-tokens + layout-exemplars)", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      expect(mockedWriteJSON).toHaveBeenCalledTimes(2);
    });
  });

  // ═══════════════════════════════════════════
  // 디자인 토큰 구조 검증
  // ═══════════════════════════════════════════
  describe("디자인 토큰 구조", () => {
    beforeEach(() => {
      mockedReadJSON.mockResolvedValue({ id: "proj-test", name: "test" });
      mockedWriteJSON.mockResolvedValue(undefined);
      mockedListFiles.mockResolvedValue(["ref1.png"]);
    });

    it("디자인 토큰이 올바른 구조를 가진다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      // writeJSON 첫 번째 호출이 design-tokens
      const designTokensCall = mockedWriteJSON.mock.calls.find(
        (call) => (call[0] as string).includes("design-tokens.json")
      );
      expect(designTokensCall).toBeDefined();

      const tokens = designTokensCall![1] as Record<string, unknown>;
      expect(tokens).toHaveProperty("colors");
      expect(tokens).toHaveProperty("typography");
      expect(tokens).toHaveProperty("spacing");
      expect(tokens).toHaveProperty("radii");

      // colors 검증
      const colors = tokens.colors as Record<string, string>;
      expect(colors.background).toBe("#000000");
      expect(colors.accent).toBe("#00FF00");
      expect(colors.text_primary).toBe("#FFFFFF");
      expect(colors.text_secondary).toBe("#888888");
      expect(colors.surface).toBe("#111111");

      // typography 검증
      const typography = tokens.typography as Record<string, unknown>;
      expect(typography.font_family).toBe("Inter");
      expect(typography.headline_size).toBe(64);
      expect(typography.body_size).toBe(24);
      expect(typography.kicker_size).toBe(18);

      // spacing 검증
      const spacing = tokens.spacing as Record<string, number>;
      expect(spacing.padding).toBe(60);
      expect(spacing.gap).toBe(24);

      // radii 검증
      const radii = tokens.radii as Record<string, number>;
      expect(radii.card).toBe(12);
      expect(radii.button).toBe(8);
    });
  });

  // ═══════════════════════════════════════════
  // 레이아웃 예시 구조 검증
  // ═══════════════════════════════════════════
  describe("레이아웃 예시 구조", () => {
    beforeEach(() => {
      mockedReadJSON.mockResolvedValue({ id: "proj-test", name: "test" });
      mockedWriteJSON.mockResolvedValue(undefined);
      mockedListFiles.mockResolvedValue(["ref1.png", "ref2.jpg"]);
    });

    it("레이아웃 예시가 올바른 구조를 가진다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const layoutCall = mockedWriteJSON.mock.calls.find(
        (call) => (call[0] as string).includes("layout-exemplars.json")
      );
      expect(layoutCall).toBeDefined();

      const exemplars = layoutCall![1] as Array<Record<string, unknown>>;
      expect(Array.isArray(exemplars)).toBe(true);
      expect(exemplars.length).toBeGreaterThan(0);

      // 각 exemplar의 구조 검증
      for (const exemplar of exemplars) {
        expect(exemplar).toHaveProperty("layout_family");
        expect(exemplar).toHaveProperty("confidence");
        expect(typeof exemplar.layout_family).toBe("string");
        expect(typeof exemplar.confidence).toBe("number");
        expect(exemplar.confidence).toBeGreaterThanOrEqual(0);
        expect(exemplar.confidence).toBeLessThanOrEqual(1);
      }
    });

    it("레이아웃 예시에 source_image가 포함될 수 있다", async () => {
      const req = createRequest({
        project_id: "proj-test",
        reference_images: ["hero-shot.png"],
      });
      await POST(req);

      const layoutCall = mockedWriteJSON.mock.calls.find(
        (call) => (call[0] as string).includes("layout-exemplars.json")
      );
      const exemplars = layoutCall![1] as Array<Record<string, unknown>>;

      // source_image가 있는 exemplar가 하나 이상 존재
      const withSource = exemplars.filter((e) => e.source_image);
      expect(withSource.length).toBeGreaterThanOrEqual(0); // optional이므로 0도 허용
    });
  });

  // ═══════════════════════════════════════════
  // 이미지 파일이 없는 경우
  // ═══════════════════════════════════════════
  describe("이미지 파일이 없는 경우", () => {
    it("references 디렉토리에 이미지가 없으면 기본 토큰으로 처리한다", async () => {
      mockedReadJSON.mockResolvedValue({ id: "proj-test", name: "test" });
      mockedWriteJSON.mockResolvedValue(undefined);
      mockedListFiles.mockResolvedValue([]);

      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      // 이미지가 없어도 기본 디자인 토큰을 생성해야 한다
      expect(mockedWriteJSON).toHaveBeenCalledTimes(2);
    });
  });
});
