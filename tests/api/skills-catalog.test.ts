// @TASK P1.5-SK3-T2 - /vg-catalog 스킬 (카탈로그 생성) 테스트
// @SPEC .claude/skills/vg-catalog/SKILL.md

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ─────────────────────────────────────────────
// file-service 모킹
// ─────────────────────────────────────────────
vi.mock("@/services/file-service", () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  listFiles: vi.fn(),
  listDirs: vi.fn(),
  ensureDir: vi.fn(),
  getProjectPath: vi.fn((projectId: string, fileName: string) => {
    return `/mock/data/${projectId}/${fileName}`;
  }),
}));

import { readJSON, writeJSON, getProjectPath } from "@/services/file-service";

const mockedReadJSON = vi.mocked(readJSON);
const mockedWriteJSON = vi.mocked(writeJSON);
const mockedGetProjectPath = vi.mocked(getProjectPath);

import { POST } from "@/app/api/skills/catalog/route";

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
    new URL("/api/skills/catalog", "http://localhost:3000"),
    init
  );
}

// ─────────────────────────────────────────────
// Mock 데이터
// ─────────────────────────────────────────────

const MOCK_LAYOUT_EXEMPLARS = [
  { layout_family: "hero-center", confidence: 0.85 },
  { layout_family: "split-2col", confidence: 0.72 },
  { layout_family: "grid-4x3", confidence: 0.65 },
  { layout_family: "stacked-vertical", confidence: 0.58 },
];

const MOCK_DESIGN_TOKENS = {
  colors: {
    background: "#000000",
    accent: "#00FF00",
    text_primary: "#FFFFFF",
    text_secondary: "#888888",
    surface: "#111111",
  },
  typography: {
    font_family: "Inter",
    headline_size: 64,
    body_size: 24,
    kicker_size: 18,
  },
  spacing: { padding: 60, gap: 24 },
  radii: { card: 12, button: 8 },
};

// ─────────────────────────────────────────────
// 테스트 시작
// ─────────────────────────────────────────────

describe("POST /api/skills/catalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedWriteJSON.mockResolvedValue(undefined);
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
        new URL("/api/skills/catalog", "http://localhost:3000"),
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
  // 정상 카탈로그 생성 (layout-exemplars + design-tokens 존재)
  // ═══════════════════════════════════════════
  describe("정상 카탈로그 생성", () => {
    beforeEach(() => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) {
          return MOCK_LAYOUT_EXEMPLARS;
        }
        if (filePath.includes("design-tokens.json")) {
          return MOCK_DESIGN_TOKENS;
        }
        return null;
      });
    });

    it("성공 시 200과 catalog_path를 반환한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.catalog_path).toContain("proj-test");
      expect(body.catalog_path).toContain("catalog.json");
    });

    it("writeJSON으로 catalog.json을 저장한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      expect(mockedWriteJSON).toHaveBeenCalledTimes(1);
      const writeCall = mockedWriteJSON.mock.calls[0];
      expect(writeCall[0]).toContain("catalog.json");
    });
  });

  // ═══════════════════════════════════════════
  // 기본값 폴백 (파일 없을 때)
  // ═══════════════════════════════════════════
  describe("기본값 폴백", () => {
    it("layout-exemplars.json이 없으면 기본 레이아웃으로 카탈로그를 생성한다", async () => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) return null;
        if (filePath.includes("design-tokens.json")) return MOCK_DESIGN_TOKENS;
        return null;
      });

      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("design-tokens.json이 없으면 기본 토큰으로 카탈로그를 생성한다", async () => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) return MOCK_LAYOUT_EXEMPLARS;
        if (filePath.includes("design-tokens.json")) return null;
        return null;
      });

      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("두 파일 모두 없어도 기본값으로 카탈로그를 생성한다", async () => {
      mockedReadJSON.mockResolvedValue(null);

      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ═══════════════════════════════════════════
  // 카탈로그 구조 검증 - layouts
  // ═══════════════════════════════════════════
  describe("카탈로그 layouts 구조", () => {
    beforeEach(() => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) return MOCK_LAYOUT_EXEMPLARS;
        if (filePath.includes("design-tokens.json")) return MOCK_DESIGN_TOKENS;
        return null;
      });
    });

    it("8개 레이아웃이 카탈로그에 포함된다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<Record<string, unknown>>;
      };
      expect(catalog.layouts).toHaveLength(8);
    });

    it("각 레이아웃이 올바른 필드를 가진다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<Record<string, unknown>>;
      };

      for (const layout of catalog.layouts) {
        expect(layout).toHaveProperty("id");
        expect(layout).toHaveProperty("name");
        expect(layout).toHaveProperty("recommended_intents");
        expect(layout).toHaveProperty("recommended_tones");
        expect(layout).toHaveProperty("evidence_types");
        expect(layout).toHaveProperty("max_components");
        expect(typeof layout.id).toBe("string");
        expect(typeof layout.name).toBe("string");
        expect(Array.isArray(layout.recommended_intents)).toBe(true);
        expect(Array.isArray(layout.recommended_tones)).toBe(true);
        expect(Array.isArray(layout.evidence_types)).toBe(true);
        expect(typeof layout.max_components).toBe("number");
      }
    });

    it("hero-center 레이아웃에 올바른 intent/tone 매핑이 있다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<{
          id: string;
          recommended_intents: string[];
          recommended_tones: string[];
        }>;
      };

      const heroCenter = catalog.layouts.find((l) => l.id === "hero-center");
      expect(heroCenter).toBeDefined();
      expect(heroCenter!.recommended_intents).toContain("emphasize");
      expect(heroCenter!.recommended_intents).toContain("introduce");
      expect(heroCenter!.recommended_tones).toContain("confident");
      expect(heroCenter!.recommended_tones).toContain("dramatic");
    });

    it("split-2col 레이아웃에 올바른 intent/tone 매핑이 있다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<{
          id: string;
          recommended_intents: string[];
          recommended_tones: string[];
        }>;
      };

      const split2col = catalog.layouts.find((l) => l.id === "split-2col");
      expect(split2col).toBeDefined();
      expect(split2col!.recommended_intents).toContain("compare");
      expect(split2col!.recommended_intents).toContain("contrast");
      expect(split2col!.recommended_tones).toContain("analytical");
      expect(split2col!.recommended_tones).toContain("balanced");
    });

    it("comparison-bars 레이아웃에 statistic evidence_type이 있다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<{
          id: string;
          evidence_types: string[];
        }>;
      };

      const compBars = catalog.layouts.find((l) => l.id === "comparison-bars");
      expect(compBars).toBeDefined();
      expect(compBars!.evidence_types).toContain("statistic");
    });

    it("모든 8개 레이아웃 ID가 존재한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        layouts: Array<{ id: string }>;
      };
      const ids = catalog.layouts.map((l) => l.id);

      const expectedIds = [
        "hero-center",
        "split-2col",
        "grid-4x3",
        "process-horizontal",
        "radial-focus",
        "stacked-vertical",
        "comparison-bars",
        "spotlight-case",
      ];

      for (const id of expectedIds) {
        expect(ids).toContain(id);
      }
    });
  });

  // ═══════════════════════════════════════════
  // 카탈로그 구조 검증 - motion_presets
  // ═══════════════════════════════════════════
  describe("카탈로그 motion_presets 구조", () => {
    beforeEach(() => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) return MOCK_LAYOUT_EXEMPLARS;
        if (filePath.includes("design-tokens.json")) return MOCK_DESIGN_TOKENS;
        return null;
      });
    });

    it("10개 모션 프리셋이 포함된다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        motion_presets: Array<Record<string, unknown>>;
      };
      expect(catalog.motion_presets).toHaveLength(10);
    });

    it("각 모션 프리셋이 올바른 필드를 가진다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        motion_presets: Array<Record<string, unknown>>;
      };

      for (const preset of catalog.motion_presets) {
        expect(preset).toHaveProperty("id");
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("description");
        expect(preset).toHaveProperty("css_properties");
        expect(preset).toHaveProperty("duration_ms");
        expect(typeof preset.id).toBe("string");
        expect(typeof preset.name).toBe("string");
        expect(typeof preset.description).toBe("string");
        expect(Array.isArray(preset.css_properties)).toBe(true);
        expect(typeof preset.duration_ms).toBe("number");
        expect(preset.duration_ms).toBeGreaterThan(0);
      }
    });

    it("모든 10개 모션 프리셋 ID가 존재한다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        motion_presets: Array<{ id: string }>;
      };
      const ids = catalog.motion_presets.map((p) => p.id);

      const expectedIds = [
        "fadeUp",
        "popNumber",
        "staggerChildren",
        "drawConnector",
        "pulseAccent",
        "wipeBar",
        "countUp",
        "slideSplit",
        "revealMask",
        "popBadge",
      ];

      for (const id of expectedIds) {
        expect(ids).toContain(id);
      }
    });
  });

  // ═══════════════════════════════════════════
  // 카탈로그 구조 검증 - copy_layer_schema
  // ═══════════════════════════════════════════
  describe("카탈로그 copy_layer_schema 구조", () => {
    beforeEach(() => {
      mockedReadJSON.mockImplementation(async (filePath: string) => {
        if (filePath.includes("layout-exemplars.json")) return MOCK_LAYOUT_EXEMPLARS;
        if (filePath.includes("design-tokens.json")) return MOCK_DESIGN_TOKENS;
        return null;
      });
    });

    it("copy_layer_schema에 4개 레이어가 있다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        copy_layer_schema: Record<string, unknown>;
      };

      expect(catalog.copy_layer_schema).toHaveProperty("kicker");
      expect(catalog.copy_layer_schema).toHaveProperty("headline");
      expect(catalog.copy_layer_schema).toHaveProperty("supporting");
      expect(catalog.copy_layer_schema).toHaveProperty("footer_caption");
    });

    it("각 copy layer가 max_length와 optional 필드를 가진다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        copy_layer_schema: Record<
          string,
          { max_length: number; optional: boolean }
        >;
      };

      const layers = ["kicker", "headline", "supporting", "footer_caption"];
      for (const layer of layers) {
        const schema = catalog.copy_layer_schema[layer];
        expect(typeof schema.max_length).toBe("number");
        expect(schema.max_length).toBeGreaterThan(0);
        expect(typeof schema.optional).toBe("boolean");
      }
    });

    it("headline은 필수(optional: false)이고 kicker는 선택(optional: true)이다", async () => {
      const req = createRequest({ project_id: "proj-test" });
      await POST(req);

      const catalog = mockedWriteJSON.mock.calls[0][1] as {
        copy_layer_schema: Record<
          string,
          { max_length: number; optional: boolean }
        >;
      };

      expect(catalog.copy_layer_schema.headline.optional).toBe(false);
      expect(catalog.copy_layer_schema.kicker.optional).toBe(true);
    });
  });

  // ═══════════════════════════════════════════
  // 에러 처리
  // ═══════════════════════════════════════════
  describe("에러 처리", () => {
    it("writeJSON이 실패하면 500을 반환한다", async () => {
      mockedReadJSON.mockResolvedValue(null);
      mockedWriteJSON.mockRejectedValue(new Error("disk full"));

      const req = createRequest({ project_id: "proj-test" });
      const res = await POST(req);

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });
  });
});
