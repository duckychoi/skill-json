// @TASK P3-S1-T1 - Remotion 프리뷰 UI
// @SPEC specs/preview.md

import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ────────────────────────────────────────────────────────────────────────────
// @remotion/player mock
// ────────────────────────────────────────────────────────────────────────────
vi.mock("@remotion/player", () => ({
  Player: vi.fn(({ inputProps }: { inputProps?: { scenes?: unknown[] } }) => (
    <div
      data-testid="remotion-player"
      data-scenes={JSON.stringify(inputProps?.scenes ?? [])}
    >
      Remotion Player Mock
    </div>
  )),
  PlayerRef: {},
}));

// next/navigation mock
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), back: vi.fn() })),
  useSearchParams: vi.fn(() => ({ get: vi.fn((k: string) => (k === "projectId" ? "proj-1" : null)) })),
}));

// fetch mock
const mockProject = {
  id: "proj-1",
  name: "Test Project",
  status: "scened",
  total_duration_ms: 10000,
};

const mockScenes = [
  {
    id: "scene-1",
    project_id: "proj-1",
    beat_index: 0,
    layout_family: "hero-center",
    start_ms: 0,
    end_ms: 3000,
    duration_frames: 90,
    components: [],
    copy_layers: { kicker: null, headline: "Scene 1", supporting: null, footer_caption: null },
    motion: { entrance: "fade", emphasis: null, exit: null, duration_ms: 500 },
    assets: { svg_icons: [], chart_type: null, chart_data: null },
    chunk_metadata: { intent: "intro", tone: "formal", evidence_type: "stat", emphasis_tokens: [], density: 0.5, beat_count: 1 },
  },
  {
    id: "scene-2",
    project_id: "proj-1",
    beat_index: 1,
    layout_family: "split-2col",
    start_ms: 3000,
    end_ms: 7000,
    duration_frames: 120,
    components: [],
    copy_layers: { kicker: null, headline: "Scene 2", supporting: null, footer_caption: null },
    motion: { entrance: "slide", emphasis: null, exit: null, duration_ms: 500 },
    assets: { svg_icons: [], chart_type: null, chart_data: null },
    chunk_metadata: { intent: "body", tone: "formal", evidence_type: "stat", emphasis_tokens: [], density: 0.5, beat_count: 1 },
  },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => {
    if (url.includes("/api/projects/proj-1/scenes")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ scenes: mockScenes }) });
    }
    if (url.includes("/api/projects/proj-1")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ project: mockProject }) });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  }));
});

// ────────────────────────────────────────────────────────────────────────────
// Component imports (after mocks)
// ────────────────────────────────────────────────────────────────────────────
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PlaybackControls } from "@/components/preview/PlaybackControls";
import { SceneNavigation } from "@/components/preview/SceneNavigation";
import RemotionPreviewPage from "@/app/preview/page";

// ────────────────────────────────────────────────────────────────────────────
// PreviewHeader Tests
// ────────────────────────────────────────────────────────────────────────────
describe("PreviewHeader", () => {
  it("renders with title", () => {
    const onBack = vi.fn();
    render(<PreviewHeader onBack={onBack} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders back button that triggers onBack", () => {
    const onBack = vi.fn();
    render(<PreviewHeader onBack={onBack} />);
    const backBtn = screen.getByRole("button", { name: /뒤로|back/i });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders fullscreen button", () => {
    render(<PreviewHeader onBack={vi.fn()} />);
    const fullscreenBtn = screen.getByRole("button", { name: /전체화면|fullscreen/i });
    expect(fullscreenBtn).toBeInTheDocument();
  });

  it("calls onFullscreen when fullscreen button is clicked", () => {
    const onFullscreen = vi.fn();
    render(<PreviewHeader onBack={vi.fn()} onFullscreen={onFullscreen} />);
    fireEvent.click(screen.getByRole("button", { name: /전체화면|fullscreen/i }));
    expect(onFullscreen).toHaveBeenCalledTimes(1);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// PlaybackControls Tests
// ────────────────────────────────────────────────────────────────────────────
describe("PlaybackControls", () => {
  const defaultProps = {
    isPlaying: false,
    onPlayPause: vi.fn(),
    playbackRate: 1,
    onPlaybackRateChange: vi.fn(),
    volume: 1,
    onVolumeChange: vi.fn(),
    currentFrame: 0,
    totalFrames: 300,
    onSeek: vi.fn(),
  };

  it("renders play button when not playing", () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByRole("button", { name: /재생|play/i })).toBeInTheDocument();
  });

  it("renders pause button when playing", () => {
    render(<PlaybackControls {...defaultProps} isPlaying={true} />);
    expect(screen.getByRole("button", { name: /정지|pause/i })).toBeInTheDocument();
  });

  it("calls onPlayPause when play button is clicked", () => {
    const onPlayPause = vi.fn();
    render(<PlaybackControls {...defaultProps} onPlayPause={onPlayPause} />);
    fireEvent.click(screen.getByRole("button", { name: /재생|play/i }));
    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("renders playback rate buttons (0.5x, 1x, 1.5x, 2x)", () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByText("0.5x")).toBeInTheDocument();
    expect(screen.getByText("1x")).toBeInTheDocument();
    expect(screen.getByText("1.5x")).toBeInTheDocument();
    expect(screen.getByText("2x")).toBeInTheDocument();
  });

  it("calls onPlaybackRateChange when rate button is clicked", () => {
    const onPlaybackRateChange = vi.fn();
    render(<PlaybackControls {...defaultProps} onPlaybackRateChange={onPlaybackRateChange} />);
    fireEvent.click(screen.getByText("2x"));
    expect(onPlaybackRateChange).toHaveBeenCalledWith(2);
  });

  it("highlights active playback rate", () => {
    render(<PlaybackControls {...defaultProps} playbackRate={1.5} />);
    const activeBtn = screen.getByText("1.5x");
    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("renders volume slider", () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByRole("slider", { name: /volume|음량/i })).toBeInTheDocument();
  });

  it("renders seek slider", () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByRole("slider", { name: /seek|탐색/i })).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// SceneNavigation Tests
// ────────────────────────────────────────────────────────────────────────────
describe("SceneNavigation", () => {
  const defaultProps = {
    currentSceneIndex: 0,
    totalScenes: 3,
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  it("displays current scene and total (1/3)", () => {
    render(<SceneNavigation {...defaultProps} />);
    expect(screen.getByText(/1\s*\/\s*3/)).toBeInTheDocument();
  });

  it("renders prev and next buttons", () => {
    render(<SceneNavigation {...defaultProps} currentSceneIndex={1} />);
    expect(screen.getByRole("button", { name: /이전|prev/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다음|next/i })).toBeInTheDocument();
  });

  it("disables prev button on first scene", () => {
    render(<SceneNavigation {...defaultProps} currentSceneIndex={0} />);
    const prevBtn = screen.getByRole("button", { name: /이전|prev/i });
    expect(prevBtn).toBeDisabled();
  });

  it("disables next button on last scene", () => {
    render(<SceneNavigation {...defaultProps} currentSceneIndex={2} totalScenes={3} />);
    const nextBtn = screen.getByRole("button", { name: /다음|next/i });
    expect(nextBtn).toBeDisabled();
  });

  it("calls onPrev when prev button is clicked", () => {
    const onPrev = vi.fn();
    render(<SceneNavigation {...defaultProps} currentSceneIndex={1} onPrev={onPrev} />);
    fireEvent.click(screen.getByRole("button", { name: /이전|prev/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = vi.fn();
    render(<SceneNavigation {...defaultProps} onNext={onNext} />);
    fireEvent.click(screen.getByRole("button", { name: /다음|next/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("updates display when currentSceneIndex changes", () => {
    const { rerender } = render(<SceneNavigation {...defaultProps} currentSceneIndex={0} />);
    expect(screen.getByText(/1\s*\/\s*3/)).toBeInTheDocument();
    rerender(<SceneNavigation {...defaultProps} currentSceneIndex={2} />);
    expect(screen.getByText(/3\s*\/\s*3/)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// RemotionPreviewPage Integration Tests
// ────────────────────────────────────────────────────────────────────────────
describe("RemotionPreviewPage", () => {
  it("renders the preview page with header", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders Remotion Player area", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    expect(screen.getByTestId("remotion-player")).toBeInTheDocument();
  });

  it("renders playback controls", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    // play 또는 pause 버튼이 있어야 함
    expect(
      screen.getByRole("button", { name: /재생|play|정지|pause/i })
    ).toBeInTheDocument();
  });

  it("renders scene navigation", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    // 이전/다음 버튼이 있어야 함
    expect(screen.getByRole("button", { name: /이전|prev/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다음|next/i })).toBeInTheDocument();
  });

  it("loads scenes and shows scene count", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    // 씬 로드 후 1/2 표시
    expect(await screen.findByText(/1\s*\/\s*2/)).toBeInTheDocument();
  });

  it("navigates to next scene", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    await screen.findByText(/1\s*\/\s*2/);
    const nextBtn = screen.getByRole("button", { name: /다음|next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument();
  });

  it("prev button is disabled on first scene", async () => {
    await act(async () => {
      render(<RemotionPreviewPage />);
    });
    await screen.findByText(/1\s*\/\s*2/);
    expect(screen.getByRole("button", { name: /이전|prev/i })).toBeDisabled();
  });
});
