// @TASK P2-S1-T1 - 타임라인 에디터 UI 구현
// @SPEC specs/layout.md

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";

// --- Mock fetch ---
const mockProject = {
  id: "proj-1",
  name: "테스트 프로젝트",
  srt_path: "/srt/test.srt",
  audio_path: "/audio/test.mp3",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  status: "scened" as const,
  total_duration_ms: 30000,
};

const mockScenes = [
  {
    id: "scene-1",
    project_id: "proj-1",
    beat_index: 0,
    layout_family: "hero-center" as const,
    start_ms: 0,
    end_ms: 5000,
    duration_frames: 150,
    components: [],
    copy_layers: {
      kicker: null,
      headline: "첫 번째 장면",
      supporting: null,
      footer_caption: null,
    },
    motion: { entrance: "fade-in", emphasis: null, exit: null, duration_ms: 300 },
    assets: { svg_icons: [], chart_type: null, chart_data: null },
    chunk_metadata: {
      intent: "intro",
      tone: "neutral",
      evidence_type: "statement",
      emphasis_tokens: [],
      density: 0.5,
      beat_count: 1,
    },
  },
  {
    id: "scene-2",
    project_id: "proj-1",
    beat_index: 1,
    layout_family: "split-2col" as const,
    start_ms: 5000,
    end_ms: 10000,
    duration_frames: 150,
    components: [],
    copy_layers: {
      kicker: null,
      headline: "두 번째 장면",
      supporting: null,
      footer_caption: null,
    },
    motion: { entrance: "slide-in", emphasis: null, exit: null, duration_ms: 300 },
    assets: { svg_icons: [], chart_type: null, chart_data: null },
    chunk_metadata: {
      intent: "body",
      tone: "neutral",
      evidence_type: "statistic",
      emphasis_tokens: [],
      density: 0.7,
      beat_count: 2,
    },
  },
];

const mockAudio = {
  waveform: new Array(100).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.5 + 0.5),
  beat_markers: [
    { beat_index: 0, time_ms: 0, text: "Beat 1" },
    { beat_index: 1, time_ms: 5000, text: "Beat 2" },
  ],
};

const mockLayoutFamilies = [
  { id: "hero-center", name: "Hero Center", description: "중앙 영웅 레이아웃" },
  { id: "split-2col", name: "Split 2Col", description: "2열 분할 레이아웃" },
  { id: "grid-4x3", name: "Grid 4x3", description: "4x3 그리드" },
  { id: "process-horizontal", name: "Process H", description: "수평 프로세스" },
  { id: "radial-focus", name: "Radial Focus", description: "방사형 포커스" },
  { id: "stacked-vertical", name: "Stacked V", description: "수직 스택" },
  { id: "comparison-bars", name: "Comparison Bars", description: "비교 막대" },
  { id: "spotlight-case", name: "Spotlight Case", description: "스포트라이트" },
];

// Canvas mock
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    globalAlpha: 1,
    canvas: { width: 800, height: 100 },
  })) as unknown as HTMLCanvasElement["getContext"];

  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/projects/") && url.includes("/scenes")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockScenes),
      });
    }
    if (url.includes("/api/projects/") && url.includes("/audio")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAudio),
      });
    }
    if (url.includes("/api/projects/")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });
    }
    if (url.includes("/api/layout-families")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLayoutFamilies),
      });
    }
    return Promise.reject(new Error(`Unknown URL: ${url}`));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================================
// 1. TimelineViewport 컴포넌트 테스트
// ============================================================
describe("TimelineViewport", () => {
  it("scenes 배열을 받아 SceneCard 목록을 수평 스크롤로 렌더링한다", async () => {
    const { TimelineViewport } = await import(
      "@/components/timeline/TimelineViewport"
    );
    render(
      <TimelineViewport
        scenes={mockScenes}
        selectedSceneId={null}
        onSceneSelect={vi.fn()}
      />
    );
    // SceneCard는 role="option"으로 렌더링됨 (listbox 내부)
    const cards = screen.getAllByRole("option");
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it("selectedSceneId가 있을 때 해당 SceneCard에 selected 속성이 적용된다", async () => {
    const { TimelineViewport } = await import(
      "@/components/timeline/TimelineViewport"
    );
    render(
      <TimelineViewport
        scenes={mockScenes}
        selectedSceneId="scene-1"
        onSceneSelect={vi.fn()}
      />
    );
    const selectedCard = screen.getByTestId("scene-card-scene-1");
    expect(selectedCard).toHaveAttribute("aria-selected", "true");
  });

  it("빈 scenes 배열일 때 빈 상태 메시지를 표시한다", async () => {
    const { TimelineViewport } = await import(
      "@/components/timeline/TimelineViewport"
    );
    render(
      <TimelineViewport
        scenes={[]}
        selectedSceneId={null}
        onSceneSelect={vi.fn()}
      />
    );
    expect(screen.getByText(/장면이 없습니다/i)).toBeInTheDocument();
  });
});

// ============================================================
// 2. SceneCard 컴포넌트 테스트
// ============================================================
describe("SceneCard", () => {
  it("레이아웃 아이콘, 시간, 비트 인덱스를 표시한다", async () => {
    const { SceneCard } = await import("@/components/timeline/SceneCard");
    render(
      <SceneCard
        scene={mockScenes[0]}
        isSelected={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText("hero-center")).toBeInTheDocument();
    expect(screen.getByText(/0:00/)).toBeInTheDocument();
    expect(screen.getByText(/Beat 0|beat_index: 0|#0/i)).toBeInTheDocument();
  });

  it("isSelected=true일 때 네온 그린 보더 클래스가 적용된다", async () => {
    const { SceneCard } = await import("@/components/timeline/SceneCard");
    render(
      <SceneCard
        scene={mockScenes[0]}
        isSelected={true}
        onClick={vi.fn()}
      />
    );
    const card = screen.getByTestId("scene-card-scene-1");
    expect(card.className).toMatch(/border-accent|border-\[#00FF00\]/);
  });

  it("클릭 시 onClick 핸들러가 호출된다", async () => {
    const { SceneCard } = await import("@/components/timeline/SceneCard");
    const onClick = vi.fn();
    render(
      <SceneCard
        scene={mockScenes[0]}
        isSelected={false}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByTestId("scene-card-scene-1"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("aria-selected 속성이 isSelected 값과 일치한다", async () => {
    const { SceneCard } = await import("@/components/timeline/SceneCard");
    const { rerender } = render(
      <SceneCard
        scene={mockScenes[0]}
        isSelected={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByTestId("scene-card-scene-1")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    rerender(
      <SceneCard
        scene={mockScenes[0]}
        isSelected={true}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByTestId("scene-card-scene-1")).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

// ============================================================
// 3. AudioWaveform 컴포넌트 테스트
// ============================================================
describe("AudioWaveform", () => {
  it("canvas 엘리먼트를 렌더링한다", async () => {
    const { AudioWaveform } = await import(
      "@/components/timeline/AudioWaveform"
    );
    render(
      <AudioWaveform
        waveform={mockAudio.waveform}
        beatMarkers={mockAudio.beat_markers}
        currentTimeMs={0}
        durationMs={30000}
      />
    );
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("role=img과 aria-label이 지정된다", async () => {
    const { AudioWaveform } = await import(
      "@/components/timeline/AudioWaveform"
    );
    render(
      <AudioWaveform
        waveform={mockAudio.waveform}
        beatMarkers={mockAudio.beat_markers}
        currentTimeMs={0}
        durationMs={30000}
      />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("waveform")
    );
  });

  it("빈 waveform 배열이어도 에러 없이 렌더링된다", async () => {
    const { AudioWaveform } = await import(
      "@/components/timeline/AudioWaveform"
    );
    expect(() =>
      render(
        <AudioWaveform
          waveform={[]}
          beatMarkers={[]}
          currentTimeMs={0}
          durationMs={0}
        />
      )
    ).not.toThrow();
  });
});

// ============================================================
// 4. DSLEditor 컴포넌트 테스트
// ============================================================
describe("DSLEditor", () => {
  it("레이아웃 선택 드롭다운과 JSON 편집 textarea를 렌더링한다", async () => {
    const { DSLEditor } = await import("@/components/timeline/DSLEditor");
    render(
      <DSLEditor
        scene={mockScenes[0]}
        layoutFamilies={mockLayoutFamilies}
        onLayoutChange={vi.fn()}
        onDslChange={vi.fn()}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("layoutFamilies 8개 옵션이 드롭다운에 표시된다", async () => {
    const { DSLEditor } = await import("@/components/timeline/DSLEditor");
    render(
      <DSLEditor
        scene={mockScenes[0]}
        layoutFamilies={mockLayoutFamilies}
        onLayoutChange={vi.fn()}
        onDslChange={vi.fn()}
      />
    );
    const select = screen.getByRole("combobox");
    const options = select.querySelectorAll("option");
    expect(options.length).toBe(8);
  });

  it("scene이 null일 때 빈 상태 메시지를 표시한다", async () => {
    const { DSLEditor } = await import("@/components/timeline/DSLEditor");
    render(
      <DSLEditor
        scene={null}
        layoutFamilies={mockLayoutFamilies}
        onLayoutChange={vi.fn()}
        onDslChange={vi.fn()}
      />
    );
    expect(screen.getByText(/장면을 선택/i)).toBeInTheDocument();
  });

  it("레이아웃 변경 시 onLayoutChange가 호출된다", async () => {
    const { DSLEditor } = await import("@/components/timeline/DSLEditor");
    const onLayoutChange = vi.fn();
    render(
      <DSLEditor
        scene={mockScenes[0]}
        layoutFamilies={mockLayoutFamilies}
        onLayoutChange={onLayoutChange}
        onDslChange={vi.fn()}
      />
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "split-2col" } });
    expect(onLayoutChange).toHaveBeenCalledWith("split-2col");
  });
});

// ============================================================
// 5. FooterControls 컴포넌트 테스트
// ============================================================
describe("FooterControls", () => {
  it("프리뷰 버튼과 렌더 버튼을 렌더링한다", async () => {
    const { FooterControls } = await import(
      "@/components/timeline/FooterControls"
    );
    render(
      <FooterControls
        onPreview={vi.fn()}
        onRender={vi.fn()}
        isRendering={false}
      />
    );
    expect(
      screen.getByRole("button", { name: /preview|프리뷰/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /render|렌더/i })
    ).toBeInTheDocument();
  });

  it("isRendering=true일 때 렌더 버튼이 비활성화된다", async () => {
    const { FooterControls } = await import(
      "@/components/timeline/FooterControls"
    );
    render(
      <FooterControls
        onPreview={vi.fn()}
        onRender={vi.fn()}
        isRendering={true}
      />
    );
    const renderBtn = screen.getByRole("button", { name: /render|렌더/i });
    expect(renderBtn).toBeDisabled();
  });

  it("프리뷰 클릭 시 onPreview가 호출된다", async () => {
    const { FooterControls } = await import(
      "@/components/timeline/FooterControls"
    );
    const onPreview = vi.fn();
    render(
      <FooterControls
        onPreview={onPreview}
        onRender={vi.fn()}
        isRendering={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /preview|프리뷰/i }));
    expect(onPreview).toHaveBeenCalledTimes(1);
  });

  it("렌더 클릭 시 onRender가 호출된다", async () => {
    const { FooterControls } = await import(
      "@/components/timeline/FooterControls"
    );
    const onRender = vi.fn();
    render(
      <FooterControls
        onPreview={vi.fn()}
        onRender={onRender}
        isRendering={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /render|렌더/i }));
    expect(onRender).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// 6. 메인 페이지 통합 테스트
// ============================================================
describe("TimelineEditorPage (메인 페이지)", () => {
  it("로딩 상태를 초기에 표시한다", async () => {
    // fetch를 지연시켜 로딩 상태 테스트
    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}) // 영원히 pending
    );
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    // 로딩 인디케이터 또는 스켈레톤
    expect(
      screen.getByRole("status") ||
        document.querySelector("[data-testid='loading']") ||
        screen.queryByText(/loading|로딩/i)
    ).toBeTruthy();
  });

  it("데이터 로딩 후 TimelineViewport와 DSLEditor를 렌더링한다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("timeline-viewport")).toBeInTheDocument();
    });
    expect(screen.getByTestId("dsl-editor-panel")).toBeInTheDocument();
  });

  it("Header에 프로젝트 이름이 표시된다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(screen.getByText("테스트 프로젝트")).toBeInTheDocument();
    });
  });

  it("SceneCard 클릭 시 selectedSceneId가 업데이트된다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-1")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("scene-card-scene-1"));
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-1")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("키보드 → 로 다음 장면이 선택된다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-1")).toBeInTheDocument();
    });
    // 첫 번째 장면 선택
    fireEvent.click(screen.getByTestId("scene-card-scene-1"));
    // 오른쪽 화살표로 다음 장면
    fireEvent.keyDown(document, { key: "ArrowRight" });
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-2")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("키보드 ← 로 이전 장면이 선택된다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-2")).toBeInTheDocument();
    });
    // 두 번째 장면 선택 후 왼쪽 화살표
    fireEvent.click(screen.getByTestId("scene-card-scene-2"));
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    await waitFor(() => {
      expect(screen.getByTestId("scene-card-scene-1")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("FooterControls의 프리뷰/렌더 버튼이 렌더링된다", async () => {
    const { default: TimelineEditorPage } = await import("@/app/page");
    render(<TimelineEditorPage />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /preview|프리뷰/i })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /render|렌더/i })
    ).toBeInTheDocument();
  });
});
