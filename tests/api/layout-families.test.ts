// @TASK P1-R2-T1 - Layout Families API 테스트
// @SPEC docs/planning - 8개 레이아웃 패밀리 정적 카탈로그

import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/layout-families/route";
import { layoutFamilies } from "@/data/layout-families";
import type { LayoutFamily } from "@/data/layout-families";

describe("GET /api/layout-families", () => {
  it("should return 200 status with JSON response", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("should return exactly 8 layout families", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveLength(8);
  });

  it("should return all required layout family IDs", async () => {
    const response = await GET();
    const data: LayoutFamily[] = await response.json();
    const ids = data.map((f) => f.id);

    expect(ids).toContain("hero-center");
    expect(ids).toContain("split-2col");
    expect(ids).toContain("grid-4x3");
    expect(ids).toContain("process-horizontal");
    expect(ids).toContain("radial-focus");
    expect(ids).toContain("stacked-vertical");
    expect(ids).toContain("comparison-bars");
    expect(ids).toContain("spotlight-case");
  });

  it("each layout family should have all required fields", async () => {
    const response = await GET();
    const data: LayoutFamily[] = await response.json();

    for (const family of data) {
      expect(family).toHaveProperty("id");
      expect(family).toHaveProperty("name");
      expect(family).toHaveProperty("description");
      expect(family).toHaveProperty("preview_svg");
      expect(family).toHaveProperty("stack_variants");

      expect(typeof family.id).toBe("string");
      expect(typeof family.name).toBe("string");
      expect(typeof family.description).toBe("string");
      expect(typeof family.preview_svg).toBe("string");
      expect(Array.isArray(family.stack_variants)).toBe(true);
    }
  });

  it("preview_svg should contain valid SVG markup", async () => {
    const response = await GET();
    const data: LayoutFamily[] = await response.json();

    for (const family of data) {
      expect(family.preview_svg).toContain("<svg");
      expect(family.preview_svg).toContain("</svg>");
    }
  });

  it("stack_variants should be non-empty string arrays", async () => {
    const response = await GET();
    const data: LayoutFamily[] = await response.json();

    for (const family of data) {
      expect(family.stack_variants.length).toBeGreaterThan(0);
      for (const variant of family.stack_variants) {
        expect(typeof variant).toBe("string");
        expect(variant.length).toBeGreaterThan(0);
      }
    }
  });

  it("each layout family should have a unique id", async () => {
    const response = await GET();
    const data: LayoutFamily[] = await response.json();
    const ids = data.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("layoutFamilies data", () => {
  it("should export an array of 8 items", () => {
    expect(Array.isArray(layoutFamilies)).toBe(true);
    expect(layoutFamilies).toHaveLength(8);
  });

  it("should have correct type structure for each item", () => {
    for (const family of layoutFamilies) {
      expect(family).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        preview_svg: expect.any(String),
        stack_variants: expect.any(Array),
      });
    }
  });
});
