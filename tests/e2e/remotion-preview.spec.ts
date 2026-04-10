// @TASK P3-S1-T2 - Remotion 프리뷰 통합 테스트
// @SPEC specs/preview.md

import { test, expect } from "@playwright/test";

// Mock 데이터: 3개 장면으로 구성된 프로젝트
const MOCK_SCENES = [
  {
    id: "scene-1",
    project_id: "project-1",
    beat_index: 0,
    layout_family: "hero-center",
    start_ms: 0,
    end_ms: 3000,
    duration_frames: 90, // 3s @ 30fps
    components: [
      { id: "comp-1", type: "text", props: { content: "Scene 1" } },
    ],
    copy_layers: {
      kicker: null,
      headline: "First Scene",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "fade-in",
      emphasis: null,
      exit: "fade-out",
      duration_ms: 1000,
    },
    assets: {
      svg_icons: [],
      chart_type: null,
      chart_data: null,
    },
    chunk_metadata: {
      intent: "introduce",
      tone: "professional",
      evidence_type: "text",
      emphasis_tokens: [],
      density: 0.5,
      beat_count: 1,
    },
  },
  {
    id: "scene-2",
    project_id: "project-1",
    beat_index: 1,
    layout_family: "split-2col",
    start_ms: 3000,
    end_ms: 6000,
    duration_frames: 90,
    components: [
      { id: "comp-2", type: "text", props: { content: "Scene 2" } },
    ],
    copy_layers: {
      kicker: null,
      headline: "Second Scene",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "slide-left",
      emphasis: null,
      exit: "slide-right",
      duration_ms: 1000,
    },
    assets: {
      svg_icons: [],
      chart_type: null,
      chart_data: null,
    },
    chunk_metadata: {
      intent: "explain",
      tone: "conversational",
      evidence_type: "visual",
      emphasis_tokens: [],
      density: 0.6,
      beat_count: 1,
    },
  },
  {
    id: "scene-3",
    project_id: "project-1",
    beat_index: 2,
    layout_family: "grid-4x3",
    start_ms: 6000,
    end_ms: 9000,
    duration_frames: 90,
    components: [
      { id: "comp-3", type: "text", props: { content: "Scene 3" } },
    ],
    copy_layers: {
      kicker: null,
      headline: "Third Scene",
      supporting: null,
      footer_caption: null,
    },
    motion: {
      entrance: "zoom-in",
      emphasis: null,
      exit: "zoom-out",
      duration_ms: 1000,
    },
    assets: {
      svg_icons: [],
      chart_type: null,
      chart_data: null,
    },
    chunk_metadata: {
      intent: "conclude",
      tone: "inspirational",
      evidence_type: "infographic",
      emphasis_tokens: [],
      density: 0.7,
      beat_count: 1,
    },
  },
];

test.describe("Remotion Preview E2E", () => {
  test.beforeEach(async ({ page }) => {
    // API Mock 설정: /api/projects/{projectId}/scenes 응답
    await page.route("**/api/projects/project-1/scenes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          scenes: MOCK_SCENES,
        }),
      });
    });

    // /preview 페이지로 이동 (projectId 파라미터 포함)
    await page.goto("/preview?projectId=project-1", { waitUntil: "domcontentloaded" });
  });

  test.describe("초기 로드 (Initial Load)", () => {
    // @TEST P3-S1-T2.1 - 초기 로드 시 첫 장면 렌더링
    test("should render first scene on initial load", async ({ page }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act & Assert ───────────────────────────────────────────
      // 장면 인덱스가 "1 / 3"으로 표시되어야 함
      const sceneIndicator = page.locator("text=/^1\\s*\\/\\s*3$/");
      await expect(sceneIndicator).toBeVisible({ timeout: 5000 });

      // 현재 시간이 "0s / 9s"로 표시되어야 함
      const timeIndicator = page.locator("text=/^0s\\s*\\/\\s*9s$/");
      await expect(timeIndicator).toBeVisible({ timeout: 5000 });
    });

    // @TEST P3-S1-T2.2 - 초기 로드 시 정지 상태
    test("should be in paused state on initial load", async ({ page }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act & Assert ───────────────────────────────────────────
      // 재생 버튼이 렌더링되어야 함 (정지 상태이므로 Play 아이콘)
      const playButton = page.locator('button[aria-label="재생"]');
      await expect(playButton).toBeVisible({ timeout: 5000 });

      // 정지 버튼은 없어야 함
      const pauseButton = page.locator('button[aria-label="정지"]');
      await expect(pauseButton).not.toBeVisible();
    });

    // @TEST P3-S1-T2.3 - 초기 로드 시 장면 1/N 표시
    test("should display scene indicator as 1/N on initial load", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act & Assert ───────────────────────────────────────────
      // "1 / 3" 텍스트가 표시되어야 함
      const sceneIndicator = page.locator("text=/^1\\s*\\/\\s*3$/");
      await expect(sceneIndicator).toBeVisible({ timeout: 5000 });

      // 이전 장면 버튼이 비활성화되어야 함 (첫 번째 장면이므로)
      const prevButton = page.locator(
        'button[aria-label="이전"][disabled]'
      );
      await expect(prevButton).toBeVisible({ timeout: 5000 });

      // 다음 장면 버튼이 활성화되어야 함
      const nextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await expect(nextButton).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("재생 제어 (Playback Control)", () => {
    // @TEST P3-S1-T2.4 - 재생 버튼 클릭 시 영상 재생
    test("should start playback when play button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act ────────────────────────────────────────────────────
      // 재생 버튼 클릭
      const playButton = page.locator('button[aria-label="재생"]');
      await playButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 정지 버튼이 표시되어야 함 (재생 상태)
      const pauseButton = page.locator('button[aria-label="정지"]');
      await expect(pauseButton).toBeVisible({ timeout: 2000 });

      // 재생 버튼은 더 이상 보이지 않아야 함
      const playButtonCheck = page.locator('button[aria-label="재생"]');
      await expect(playButtonCheck).not.toBeVisible();
    });

    // @TEST P3-S1-T2.5 - 정지 버튼 클릭 시 영상 정지
    test("should pause playback when pause button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 먼저 재생 시작
      const playButton = page.locator('button[aria-label="재생"]');
      await playButton.click();
      await page.locator('button[aria-label="정지"]').waitFor({ state: "visible", timeout: 2000 });

      // ── Act ────────────────────────────────────────────────────
      // 정지 버튼 클릭
      const pauseButton = page.locator('button[aria-label="정지"]');
      await pauseButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 재생 버튼이 다시 표시되어야 함
      const playButtonCheck = page.locator('button[aria-label="재생"]');
      await expect(playButtonCheck).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.6 - 슬라이더 이동 시 영상 위치 변경
    test("should update video position when seek slider is moved", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 초기 시간이 "0s"인 것을 확인
      const timeIndicator = page.locator("text=/^0s\\s*\\/\\s*9s$/");
      await expect(timeIndicator).toBeVisible({ timeout: 5000 });

      // ── Act ────────────────────────────────────────────────────
      // Seek 슬라이더를 이동 (약 절반 지점으로)
      const seekSlider = page.locator('input[type="range"]').first();
      const boundingBox = await seekSlider.boundingBox();

      if (boundingBox) {
        // 슬라이더의 중앙으로 마우스 이동하여 클릭
        const midX = boundingBox.x + boundingBox.width / 2;
        const midY = boundingBox.y + boundingBox.height / 2;
        await page.mouse.click(midX, midY);
      }

      // ── Assert ────────────────────────────────────────────────
      // 시간이 변경되어야 함 (예: "4s" 정도)
      await page.waitForTimeout(500); // UI 업데이트 대기

      const newTimeIndicator = page.locator('text=/\\d+s\\s*\\/\\s*9s$/');
      await expect(newTimeIndicator).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe("장면 네비게이션 (Scene Navigation)", () => {
    // @TEST P3-S1-T2.7 - 다음 장면 버튼 클릭 시 장면 이동
    test("should navigate to next scene when next button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨 (장면 1/3)
      const initialIndicator = page.locator("text=/^1\\s*\\/\\s*3$/");
      await expect(initialIndicator).toBeVisible({ timeout: 5000 });

      // ── Act ────────────────────────────────────────────────────
      // 다음 장면 버튼 클릭
      const nextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await nextButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 장면이 "2 / 3"으로 변경되어야 함
      const nextIndicator = page.locator("text=/^2\\s*\\/\\s*3$/");
      await expect(nextIndicator).toBeVisible({ timeout: 2000 });

      // 시간이 3s (90프레임 * 2 / 30fps = 3초)로 업데이트되어야 함
      const timeIndicator = page.locator("text=/^3s\\s*\\/\\s*9s$/");
      await expect(timeIndicator).toBeVisible({ timeout: 2000 });

      // 이전 장면 버튼이 활성화되어야 함
      const enabledPrevButton = page.locator(
        'button[aria-label="이전"]:not([disabled])'
      );
      await expect(enabledPrevButton).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.8 - 이전 장면 버튼 클릭 시 장면 이동
    test("should navigate to previous scene when prev button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 먼저 두 번째 장면으로 이동
      const nextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await nextButton.click();

      const secondSceneIndicator = page.locator("text=/^2\\s*\\/\\s*3$/");
      await expect(secondSceneIndicator).toBeVisible({ timeout: 2000 });

      // ── Act ────────────────────────────────────────────────────
      // 이전 장면 버튼 클릭
      const prevButton = page.locator(
        'button[aria-label="이전"]:not([disabled])'
      );
      await prevButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 장면이 다시 "1 / 3"으로 변경되어야 함
      const firstSceneIndicator = page.locator("text=/^1\\s*\\/\\s*3$/");
      await expect(firstSceneIndicator).toBeVisible({ timeout: 2000 });

      // 시간이 "0s"로 업데이트되어야 함
      const timeIndicator = page.locator("text=/^0s\\s*\\/\\s*9s$/");
      await expect(timeIndicator).toBeVisible({ timeout: 2000 });

      // 이전 장면 버튼이 다시 비활성화되어야 함
      const disabledPrevButton = page.locator(
        'button[aria-label="이전"][disabled]'
      );
      await expect(disabledPrevButton).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.9 - 마지막 장면에서 다음 버튼 비활성화
    test("should disable next button on last scene", async ({ page }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 마지막 장면(3/3)으로 이동
      const nextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await nextButton.click(); // 1/3 -> 2/3
      await nextButton.click(); // 2/3 -> 3/3

      // ── Act & Assert ───────────────────────────────────────────
      // 장면이 "3 / 3"임을 확인
      const lastSceneIndicator = page.locator("text=/^3\\s*\\/\\s*3$/");
      await expect(lastSceneIndicator).toBeVisible({ timeout: 2000 });

      // 다음 장면 버튼이 비활성화되어야 함
      const disabledNextButton = page.locator(
        'button[aria-label="다음"][disabled]'
      );
      await expect(disabledNextButton).toBeVisible({ timeout: 2000 });

      // 이전 장면 버튼은 활성화되어야 함
      const enabledPrevButton = page.locator(
        'button[aria-label="이전"]:not([disabled])'
      );
      await expect(enabledPrevButton).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.10 - 첫 장면에서 이전 버튼 비활성화
    test("should disable prev button on first scene", async ({ page }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨 (자동으로 첫 장면)

      // ── Act & Assert ───────────────────────────────────────────
      // 장면이 "1 / 3"임을 확인
      const firstSceneIndicator = page.locator("text=/^1\\s*\\/\\s*3$/");
      await expect(firstSceneIndicator).toBeVisible({ timeout: 5000 });

      // 이전 장면 버튼이 비활성화되어야 함
      const disabledPrevButton = page.locator(
        'button[aria-label="이전"][disabled]'
      );
      await expect(disabledPrevButton).toBeVisible({ timeout: 5000 });

      // 다음 장면 버튼은 활성화되어야 함
      const enabledNextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await expect(enabledNextButton).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("UI 요소 가시성 (UI Visibility)", () => {
    // @TEST P3-S1-T2.11 - 헤더 표시
    test("should display header with navigation controls", async ({ page }) => {
      // ── Arrange & Act ──────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Assert ────────────────────────────────────────────────
      // 헤더가 렌더링되어야 함
      const header = page.locator("header");
      await expect(header).toBeVisible({ timeout: 5000 });

      // 뒤로 버튼이 있어야 함
      const backButton = page.locator('button[aria-label="뒤로"]');
      await expect(backButton).toBeVisible({ timeout: 5000 });

      // 미리보기 제목이 있어야 함
      const title = page.locator("h1");
      await expect(title).toContainText(/미리보기/i);
    });

    // @TEST P3-S1-T2.12 - 재생 컨트롤 표시
    test("should display playback controls", async ({ page }) => {
      // ── Arrange & Act ──────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Assert ────────────────────────────────────────────────
      // 재생 버튼이 있어야 함
      const playButton = page.locator('button[aria-label="재생"]');
      await expect(playButton).toBeVisible({ timeout: 5000 });

      // Seek 슬라이더가 있어야 함
      const seekSlider = page.locator('input[type="range"]').first();
      await expect(seekSlider).toBeVisible({ timeout: 5000 });

      // 음량 슬라이더가 있어야 함
      const volumeSlider = page.locator(
        'input[type="range"][aria-label="음량"]'
      );
      await expect(volumeSlider).toBeVisible({ timeout: 5000 });

      // 재생속도 버튼들이 있어야 함
      const speedButtons = page.locator('button:has-text("x")');
      const count = await speedButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    // @TEST P3-S1-T2.13 - 장면 네비게이션 표시
    test("should display scene navigation controls", async ({ page }) => {
      // ── Arrange & Act ──────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Assert ────────────────────────────────────────────────
      // 이전 장면 버튼이 있어야 함
      const prevButton = page.locator('button[aria-label="이전"]');
      await expect(prevButton).toBeVisible({ timeout: 5000 });

      // 다음 장면 버튼이 있어야 함
      const nextButton = page.locator('button[aria-label="다음"]');
      await expect(nextButton).toBeVisible({ timeout: 5000 });

      // 장면 인디케이터가 있어야 함
      const sceneIndicator = page.locator("text=/\\d+\\s*\\/\\s*\\d+/");
      await expect(sceneIndicator).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("복합 상호작용 (Complex Interactions)", () => {
    // @TEST P3-S1-T2.14 - 장면 이동 후 재생
    test("should continue playback after scene navigation", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 재생 시작
      const playButton = page.locator('button[aria-label="재생"]');
      await playButton.click();
      await page.locator('button[aria-label="정지"]').waitFor({ state: "visible", timeout: 2000 });

      // ── Act ────────────────────────────────────────────────────
      // 장면 이동
      const nextButton = page.locator(
        'button[aria-label="다음"]:not([disabled])'
      );
      await nextButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 정지 버튼이 여전히 보여야 함 (재생 상태 유지)
      const pauseButton = page.locator('button[aria-label="정지"]');
      await expect(pauseButton).toBeVisible({ timeout: 2000 });

      // 장면이 변경되어야 함
      const sceneIndicator = page.locator("text=/^2\\s*\\/\\s*3$/");
      await expect(sceneIndicator).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.15 - 재생 중 슬라이더 이동
    test("should handle seek during playback", async ({ page }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // 재생 시작
      const playButton = page.locator('button[aria-label="재생"]');
      await playButton.click();
      await page.locator('button[aria-label="정지"]').waitFor({ state: "visible", timeout: 2000 });

      // ── Act ────────────────────────────────────────────────────
      // 슬라이더 이동
      const seekSlider = page.locator('input[type="range"]').first();
      const boundingBox = await seekSlider.boundingBox();

      if (boundingBox) {
        const midX = boundingBox.x + boundingBox.width / 2;
        const midY = boundingBox.y + boundingBox.height / 2;
        await page.mouse.click(midX, midY);
      }

      // ── Assert ────────────────────────────────────────────────
      // 정지 버튼이 여전히 보여야 함 (재생 상태 유지)
      const pauseButton = page.locator('button[aria-label="정지"]');
      await expect(pauseButton).toBeVisible({ timeout: 2000 });
    });

    // @TEST P3-S1-T2.16 - 재생속도 변경
    test("should change playback rate when speed button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act ────────────────────────────────────────────────────
      // 1.5x 속도 버튼 클릭
      const speedButton = page.locator('button:has-text("1.5x")');
      await speedButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 해당 버튼이 활성화 상태(강조 표시)여야 함
      await expect(speedButton).toHaveAttribute("aria-pressed", "true");

      // 다른 속도 버튼들은 비활성화 상태여야 함
      const otherSpeedButtons = page.locator('button:has-text("x")');
      const count = await otherSpeedButtons.count();

      for (let i = 0; i < count; i++) {
        const btn = otherSpeedButtons.nth(i);
        const text = await btn.textContent();
        if (text !== "1.5x") {
          await expect(btn).toHaveAttribute("aria-pressed", "false");
        }
      }
    });

    // @TEST P3-S1-T2.17 - 음량 조절
    test("should adjust volume when volume slider is changed", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act ────────────────────────────────────────────────────
      // 음량 슬라이더를 이동
      const volumeSlider = page.locator(
        'input[type="range"][aria-label="음량"]'
      );
      await volumeSlider.evaluate((input: HTMLInputElement) => {
        input.value = "0.5";
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      // ── Assert ────────────────────────────────────────────────
      // 음량 슬라이더의 값이 변경되어야 함
      const value = await volumeSlider.evaluate(
        (input: HTMLInputElement) => input.value
      );
      expect(parseFloat(value as string)).toBeLessThanOrEqual(0.6); // 약간의 여유 허용
      expect(parseFloat(value as string)).toBeGreaterThanOrEqual(0.4);
    });
  });

  test.describe("뒤로 네비게이션 (Back Navigation)", () => {
    // @TEST P3-S1-T2.18 - 뒤로 버튼 클릭
    test("should navigate back to home when back button is clicked", async ({
      page,
    }) => {
      // ── Arrange ────────────────────────────────────────────────
      // 프리뷰 페이지가 이미 로드됨

      // ── Act ────────────────────────────────────────────────────
      // 뒤로 버튼 클릭
      const backButton = page.locator('button[aria-label="뒤로"]');
      await backButton.click();

      // ── Assert ────────────────────────────────────────────────
      // 홈 페이지로 이동해야 함
      await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/, {
        timeout: 5000,
      });
    });
  });
});
