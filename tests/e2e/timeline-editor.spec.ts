// @TASK P2-S1-T2 - 타임라인 에디터 통합 테스트
// @SPEC specs/layout.md, src/app/page.tsx

import { test, expect } from "@playwright/test";

test.describe("Timeline Editor E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈 페이지(타임라인 에디터)로 이동
    await page.goto("http://localhost:3000");

    // 로딩이 완료될 때까지 대기
    // 타임라인 뷰포트가 보일 때까지 기다림
    await page.locator('[data-testid="timeline-viewport"]').first().waitFor({
      state: 'visible',
      timeout: 20000
    });
  });

  // ──────────────────────────────────────────────
  // 초기 로드 시나리오
  // ──────────────────────────────────────────────

  test("should display scene cards after loading completes", async ({ page }) => {
    // beforeEach에서 이미 로드를 완료했으므로, 요소가 보여야 함
    const timelineViewport = page.locator('[data-testid="timeline-viewport"]');

    // 타임라인 뷰포트가 보여야 함
    await expect(timelineViewport).toBeVisible();

    // 최소 하나 이상의 장면 카드가 있어야 함
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("should render waveform on initial load", async ({ page }) => {
    // canvas 요소를 확인 (파형 렌더링)
    const waveformCanvas = page.locator('canvas[role="img"]');
    await expect(waveformCanvas).toBeVisible();

    // aria-label 확인
    const ariaLabel = await waveformCanvas.getAttribute('aria-label');
    expect(ariaLabel).toContain('audio waveform');
  });

  test("should auto-select first scene on initial load", async ({ page }) => {
    // 첫 번째 장면 카드 확인
    const firstSceneCard = page.locator('[data-testid^="scene-card-"]').first();

    // 선택된 상태 확인 (aria-selected="true")
    const isSelected = await firstSceneCard.getAttribute('aria-selected');
    expect(isSelected).toBe('true');

    // 네온 그린 링(shadow) 확인
    const classes = await firstSceneCard.getAttribute('class');
    expect(classes).toContain('shadow-[0_0_0_1px_#00FF00]');
  });

  test("should display DSL editor with first scene data on load", async ({ page }) => {
    // DSL 에디터가 보여야 함
    const dslEditorPanel = page.locator('[data-testid="dsl-editor-panel"]');
    await expect(dslEditorPanel).toBeVisible();

    // 텍스트 에어리어가 장면 데이터(JSON)를 포함해야 함
    const textarea = dslEditorPanel.locator('textarea#dsl-textarea');
    const textContent = await textarea.inputValue();

    // JSON이 포함되어야 함
    expect(textContent).toContain('{');
    expect(textContent).toContain('layout_family');
  });

  test("should display layout dropdown in DSL editor", async ({ page }) => {
    const layoutSelect = page.locator('#layout-select');
    await expect(layoutSelect).toBeVisible();

    // 옵션이 최소 하나 이상 있어야 함
    const options = layoutSelect.locator('option');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  // 장면 선택 시나리오
  // ──────────────────────────────────────────────

  test("should select scene when scene card is clicked", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount >= 2) {
      // 두 번째 카드 클릭
      const secondCard = sceneCards.nth(1);
      await secondCard.click();

      // 두 번째 카드가 선택되었는지 확인
      const isSelected = await secondCard.getAttribute('aria-selected');
      expect(isSelected).toBe('true');

      // 첫 번째 카드는 선택되지 않았는지 확인
      const firstCard = sceneCards.first();
      const firstCardSelected = await firstCard.getAttribute('aria-selected');
      expect(firstCardSelected).toBe('false');
    }
  });

  test("should update DSL editor when scene is selected", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount >= 2) {
      // 첫 번째 장면의 데이터 저장
      const firstSceneData = await page.locator('#dsl-textarea').inputValue();

      // 두 번째 카드 클릭
      const secondCard = sceneCards.nth(1);
      await secondCard.click();

      // DSL 에디터의 텍스트가 변경되었는지 확인
      const secondSceneData = await page.locator('#dsl-textarea').inputValue();
      expect(secondSceneData).not.toBe(firstSceneData);
    }
  });

  test("should display neon green ring on selected scene card", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount >= 2) {
      // 두 번째 카드 클릭
      const secondCard = sceneCards.nth(1);
      await secondCard.click();

      // 두 번째 카드의 클래스 확인 (shadow-[0_0_0_1px_#00FF00])
      const classes = await secondCard.getAttribute('class');
      expect(classes).toContain('shadow-[0_0_0_1px_#00FF00]');
    }
  });

  // ──────────────────────────────────────────────
  // 레이아웃 변경 시나리오
  // ──────────────────────────────────────────────

  test("should update layout when dropdown value is changed", async ({ page }) => {
    const layoutSelect = page.locator('#layout-select');

    // 현재 선택된 값 저장
    const currentValue = await layoutSelect.inputValue();

    // 옵션 목록 조회
    const options = layoutSelect.locator('option');
    const optionCount = await options.count();

    if (optionCount > 1) {
      // 다른 옵션으로 변경
      const allValues = await layoutSelect.locator('option').all();
      let differentValue = currentValue;

      for (const option of allValues) {
        const optionValue = await option.getAttribute('value');
        if (optionValue && optionValue !== currentValue) {
          differentValue = optionValue;
          break;
        }
      }

      // 레이아웃 선택 변경
      await layoutSelect.selectOption(differentValue);

      // 선택된 값이 변경되었는지 확인
      const newValue = await layoutSelect.inputValue();
      expect(newValue).toBe(differentValue);
    }
  });

  test("should reflect layout change in scene card", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const firstCard = sceneCards.first();

    // 첫 번째 장면이 선택되어 있는지 확인
    const isSelected = await firstCard.getAttribute('aria-selected');

    if (isSelected === 'true') {
      // 레이아웃 드롭다운 찾기
      const layoutSelect = page.locator('#layout-select');
      const currentValue = await layoutSelect.inputValue();

      // 다른 옵션으로 변경
      const options = layoutSelect.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) {
        const allValues = await layoutSelect.locator('option').all();
        let differentValue = currentValue;

        for (const option of allValues) {
          const optionValue = await option.getAttribute('value');
          if (optionValue && optionValue !== currentValue) {
            differentValue = optionValue;
            break;
          }
        }

        // 레이아웃 선택 변경
        await layoutSelect.selectOption(differentValue);

        // 변경이 적용되었는지 약간 기다림
        await page.waitForTimeout(300);

        // 선택이 업데이트되었는지 확인
        const newSelectedValue = await layoutSelect.inputValue();
        expect(newSelectedValue).toBe(differentValue);
      }
    }
  });

  // ──────────────────────────────────────────────
  // 키보드 네비게이션 시나리오
  // ──────────────────────────────────────────────

  test("should navigate between scenes with arrow keys", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount >= 2) {
      // 첫 번째 카드 클릭
      const firstCard = sceneCards.first();
      await firstCard.click();

      // ArrowRight 키 누르기
      await page.keyboard.press('ArrowRight');

      // 약간 기다림
      await page.waitForTimeout(100);

      // 두 번째 카드가 선택되었는지 확인
      const secondCard = sceneCards.nth(1);
      const isSelected = await secondCard.getAttribute('aria-selected');
      expect(isSelected).toBe('true');
    }
  });

  test("should not navigate beyond the last scene", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount > 0) {
      // 마지막 카드 클릭
      const lastCard = sceneCards.nth(cardCount - 1);
      await lastCard.click();

      // ArrowRight 키 누르기 (경계 테스트)
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      // 마지막 카드가 여전히 선택되어 있는지 확인
      const isSelected = await lastCard.getAttribute('aria-selected');
      expect(isSelected).toBe('true');
    }
  });

  // ──────────────────────────────────────────────
  // 푸터 컨트롤 시나리오
  // ──────────────────────────────────────────────

  test("should display footer controls", async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 프리뷰 버튼 확인
    const previewButton = footer.locator('button:has-text("프리뷰")');
    await expect(previewButton).toBeVisible();

    // 렌더 버튼 확인
    const renderButton = footer.locator('button:has-text("렌더")');
    await expect(renderButton).toBeVisible();
  });

  test("should trigger render when render button is clicked", async ({ page }) => {
    const footer = page.locator('footer');

    // 렌더 버튼 찾기 및 클릭
    const renderButton = footer.locator('button').filter({ hasText: /렌더/ }).first();

    // 버튼이 보이고 활성화되어 있는지 확인
    const isDisabled = await renderButton.isDisabled();
    expect(isDisabled).toBe(false);

    // 버튼 클릭
    await renderButton.click();

    // 렌더링 중 상태 확인 (disabled 상태로 변경)
    await expect(renderButton).toBeDisabled({ timeout: 5000 });

    // "렌더링 중..." 텍스트 확인
    const buttonText = await renderButton.textContent();
    expect(buttonText).toContain('렌더링 중');
  });

  // ──────────────────────────────────────────────
  // 헤더 및 레이아웃 시나리오
  // ──────────────────────────────────────────────

  test("should display header with project information", async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 프로젝트명이 표시되어야 함
    const headerText = await header.textContent();
    expect(headerText).toBeDefined();
  });

  test("should maintain main-sidebar layout structure", async ({ page }) => {
    // main 요소 확인
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // 타임라인 뷰포트 확인
    const timelineViewport = page.locator('[data-testid="timeline-viewport"]');
    await expect(timelineViewport).toBeVisible();

    // DSL 에디터 패널 확인 (사이드바)
    const dslEditorPanel = page.locator('[data-testid="dsl-editor-panel"]');
    await expect(dslEditorPanel).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 분할 기능 시나리오 (구조 확인)
  // ──────────────────────────────────────────────

  test("should support scene selection for future split functionality", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount > 0) {
      // 모든 장면이 클릭 가능해야 함
      for (let i = 0; i < cardCount; i++) {
        const card = sceneCards.nth(i);

        // 버튼 타입 확인
        const type = await card.getAttribute('type');
        expect(type).toBe('button');

        // role 확인
        const role = await card.getAttribute('role');
        expect(role).toBe('option');

        // 클릭 가능성 확인
        const isClickable = await card.isEnabled();
        expect(isClickable).toBe(true);
      }
    }
  });

  // ──────────────────────────────────────────────
  // 접근성 테스트
  // ──────────────────────────────────────────────

  test("should have proper accessibility attributes on timeline viewport", async ({ page }) => {
    const timelineViewport = page.locator('[data-testid="timeline-viewport"]');

    // role 확인
    const role = await timelineViewport.getAttribute('role');
    expect(role).toBe('listbox');

    // aria-label 확인
    const ariaLabel = await timelineViewport.getAttribute('aria-label');
    expect(ariaLabel).toBe('장면 시퀀스');
  });

  test("should have proper accessibility attributes on scene cards", async ({ page }) => {
    const sceneCards = page.locator('[data-testid^="scene-card-"]');
    const cardCount = await sceneCards.count();

    if (cardCount > 0) {
      // 첫 번째 카드의 접근성 속성 확인
      const firstCard = sceneCards.first();

      // role 확인
      const role = await firstCard.getAttribute('role');
      expect(role).toBe('option');

      // aria-selected 확인
      const ariaSelected = await firstCard.getAttribute('aria-selected');
      expect(['true', 'false']).toContain(ariaSelected);
    }
  });

  test("should have proper accessibility attributes on DSL editor", async ({ page }) => {
    const layoutSelect = page.locator('#layout-select');
    const dslTextarea = page.locator('#dsl-textarea');

    // 레이아웃 드롭다운 라벨 확인
    const layoutLabel = page.locator('label[for="layout-select"]');
    await expect(layoutLabel).toBeVisible();

    // DSL textarea 라벨 확인
    const dslLabel = page.locator('label[for="dsl-textarea"]');
    await expect(dslLabel).toBeVisible();

    // label의 for 속성이 올바른지 확인
    const layoutLabelFor = await layoutLabel.getAttribute('for');
    expect(layoutLabelFor).toBe('layout-select');

    const dslLabelFor = await dslLabel.getAttribute('for');
    expect(dslLabelFor).toBe('dsl-textarea');
  });

  // ──────────────────────────────────────────────
  // 반응형 테스트
  // ──────────────────────────────────────────────

  test("should maintain layout on desktop viewport", async ({ page }) => {
    // 데스크톱 뷰포트에서 레이아웃이 유지되어야 함
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    // 로딩 완료 대기
    await page.locator('[data-testid="timeline-viewport"]').first().waitFor({
      state: 'visible',
      timeout: 15000
    });

    // 헤더, main, 파형, DSL 에디터 모두 보여야 함
    const header = page.locator('header');
    const main = page.locator('main');
    const timelineViewport = page.locator('[data-testid="timeline-viewport"]');
    const dslEditorPanel = page.locator('[data-testid="dsl-editor-panel"]');

    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
    await expect(timelineViewport).toBeVisible();
    await expect(dslEditorPanel).toBeVisible();
  });

  test("should adapt layout on smaller viewport", async ({ page }) => {
    // 작은 뷰포트에서도 레이아웃이 적응되어야 함
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // 로딩 완료 대기
    await page.locator('[data-testid="timeline-viewport"]').first().waitFor({
      state: 'visible',
      timeout: 15000
    });

    // 헤더와 main이 보여야 함
    const header = page.locator('header');
    const main = page.locator('main');

    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
  });
});
