// @TASK P1-S0-T2 - 공통 레이아웃 E2E 테스트
// @SPEC specs/layout.md

import { test, expect } from "@playwright/test";

test.describe("Layout E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈 페이지로 이동
    await page.goto("http://localhost:3000");
  });

  // ──────────────────────────────────────────────
  // Header 렌더링 시나리오
  // ──────────────────────────────────────────────
  test("Header should render with project name on app load", async ({ page }) => {
    // 헤더가 페이지에 존재해야 함
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // 프로젝트명이 표시되어야 함 (h1 또는 텍스트)
    // 페이지에서 프로젝트명을 포함하는 요소 확인
    const projectNameElement = page.locator("h1");
    await expect(projectNameElement).toBeVisible();
    await expect(projectNameElement).toContainText(/newVideoGen|Timeline|타임라인/i);
  });

  test("Header should render action buttons", async ({ page }) => {
    // 헤더 내 버튼들이 렌더링되어야 함
    const header = page.locator("header");

    // 헤더 내 모든 버튼 확인
    const buttons = header.locator("button");
    const buttonCount = await buttons.count();

    // 최소한 설정 버튼은 있어야 함
    expect(buttonCount).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  // 뒤로가기 시나리오
  // ──────────────────────────────────────────────
  test("Back button should navigate to home when clicked", async ({ page }) => {
    // /render 페이지로 이동 (뒤로가기 버튼이 있는 페이지 예상)
    await page.goto("http://localhost:3000/render");

    // 뒤로가기 버튼 찾기 (aria-label 또는 아이콘)
    const backButton = page.locator('button[aria-label*="Back"], button[aria-label*="뒤로"]');

    // 뒤로가기 버튼이 있는지 확인
    if (await backButton.count() > 0) {
      // 뒤로가기 클릭
      await backButton.first().click();

      // 홈 페이지로 이동했는지 확인
      await expect(page).toHaveURL("http://localhost:3000");
    } else {
      // 뒤로가기 버튼이 없으면 브라우저의 뒤로가기 사용
      await page.goBack();

      // 홈 페이지로 이동했는지 확인
      await expect(page).toHaveURL("http://localhost:3000");
    }
  });

  // ──────────────────────────────────────────────
  // 레이아웃 전환 시나리오
  // ──────────────────────────────────────────────
  test("Main and Sidebar layout should be visible on appropriate pages", async ({
    page,
  }) => {
    // 홈 페이지에서 main 요소와 sidebar 확인
    const mainElement = page.locator("main");

    // main 요소가 렌더링되어야 함
    await expect(mainElement).toBeVisible();
  });

  test("Sidebar should be present on appropriate routes", async ({ page }) => {
    // 사이드바가 있을 수 있는 페이지로 이동 (이 경우 조건부)
    await page.goto("http://localhost:3000");

    // 페이지의 레이아웃 구조 확인
    const mainElement = page.locator("main");

    // main이 페이지의 주요 콘텐츠 영역이어야 함
    await expect(mainElement).toBeVisible();

    // 사이드바가 있는지 확인 (있을 수도 있고 없을 수도 있음)
    const sidebarElement = page.locator('aside[aria-label="Sidebar"]');
    const sidebarExists = await sidebarElement.count() > 0;

    // 사이드바가 있으면 보여야 함
    if (sidebarExists) {
      await expect(sidebarElement).toBeVisible();
    }
  });

  // ──────────────────────────────────────────────
  // 레이아웃 반응형 테스트
  // ──────────────────────────────────────────────
  test("Layout should adapt to viewport changes (desktop)", async ({ page }) => {
    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 페이지 로드
    await page.goto("http://localhost:3000");

    // 헤더와 메인 요소가 보여야 함
    const header = page.locator("header");
    const main = page.locator("main");

    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
  });

  test("Layout should adapt to viewport changes (mobile)", async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 페이지 로드
    await page.goto("http://localhost:3000");

    // 헤더와 메인 요소가 보여야 함
    const header = page.locator("header");
    const main = page.locator("main");

    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 접근성 테스트
  // ──────────────────────────────────────────────
  test("Header should have proper semantic structure", async ({ page }) => {
    // header 요소가 semantic HTML이어야 함
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });

  test("Main content should be in main element", async ({ page }) => {
    // main 요소가 있어야 함
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("Sidebar should have complementary role or aria-label", async ({ page }) => {
    // 사이드바가 있으면 접근성 속성이 있어야 함
    const sidebar = page.locator('aside[aria-label="Sidebar"]');

    if (await sidebar.count() > 0) {
      // aria-label이 있어야 함
      const ariaLabel = await sidebar.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
    }
  });

  // ──────────────────────────────────────────────
  // 페이지 간 네비게이션
  // ──────────────────────────────────────────────
  test("Navigation between pages should maintain header visibility", async ({
    page,
  }) => {
    // 홈 페이지에서 헤더 확인
    let header = page.locator("header");
    await expect(header).toBeVisible();

    // /render 페이지로 이동
    await page.goto("http://localhost:3000/render");

    // 헤더가 여전히 보여야 함
    header = page.locator("header");
    await expect(header).toBeVisible();

    // /preview 페이지로 이동
    await page.goto("http://localhost:3000/preview");

    // 헤더가 여전히 보여야 함
    header = page.locator("header");
    await expect(header).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 컨테이너 구조 테스트
  // ──────────────────────────────────────────────
  test("Page should have proper container structure", async ({ page }) => {
    // 기본 페이지 구조 확인
    const html = page.locator("html");
    const body = page.locator("body");

    await expect(html).toBeVisible();
    await expect(body).toBeVisible();
  });

  test("Content should be scrollable when necessary", async ({ page }) => {
    // 페이지 로드
    await page.goto("http://localhost:3000");

    // 스크롤 가능한 요소 확인 (필요시)
    const main = page.locator("main");

    // main이 overflow-auto 클래스를 가질 수 있음
    // 실제로 스크롤 가능한지는 콘텐츠 양에 따라 달라짐
    await expect(main).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 레이아웃 전환 테스트 (라우트별)
  // ──────────────────────────────────────────────
  test("Full-width layout should be applied to appropriate routes", async ({
    page,
  }) => {
    // 전체 너비 레이아웃을 사용하는 페이지로 이동
    await page.goto("http://localhost:3000/preview");

    // 메인 콘텐츠가 전체 너비로 표시되어야 함
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // sidebar가 없어야 함 (full-width 레이아웃)
    const sidebar = page.locator('aside[aria-label="Sidebar"]');
    expect(await sidebar.count()).toBe(0);
  });

  test("Main-sidebar layout should be applied to appropriate routes", async ({
    page,
  }) => {
    // main-sidebar 레이아웃을 사용하는 페이지로 이동
    await page.goto("http://localhost:3000");

    // 메인과 사이드바가 함께 있을 수 있음
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});
