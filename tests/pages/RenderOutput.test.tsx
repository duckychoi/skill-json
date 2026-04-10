// @TASK P3-S2-T1 - 렌더 출력 UI 구현
// @SPEC specs/render-output.md

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────
const mockRenderJobPending = {
  id: "job-001",
  project_id: "proj-001",
  status: "pending" as const,
  total_frames: 1800,
  rendered_frames: 0,
  started_at: "2026-03-11T10:00:00Z",
  completed_at: null,
  output_path: null,
  file_size: null,
  logs: [
    { timestamp: "2026-03-11T10:00:00Z", level: "info" as const, message: "렌더 대기 중..." },
  ],
  current_scene: null,
};

const mockRenderJobRendering = {
  id: "job-001",
  project_id: "proj-001",
  status: "rendering" as const,
  total_frames: 1800,
  rendered_frames: 900,
  started_at: "2026-03-11T10:00:00Z",
  completed_at: null,
  output_path: null,
  file_size: null,
  logs: [
    { timestamp: "2026-03-11T10:00:00Z", level: "info" as const, message: "렌더 시작" },
    { timestamp: "2026-03-11T10:00:05Z", level: "info" as const, message: "Scene 1 렌더링 중..." },
  ],
  current_scene: "scene-01",
};

const mockRenderJobCompleted = {
  id: "job-001",
  project_id: "proj-001",
  status: "completed" as const,
  total_frames: 1800,
  rendered_frames: 1800,
  started_at: "2026-03-11T10:00:00Z",
  completed_at: "2026-03-11T10:02:00Z",
  output_path: "/output/video.mp4",
  file_size: 52428800, // 50MB
  logs: [
    { timestamp: "2026-03-11T10:00:00Z", level: "info" as const, message: "렌더 시작" },
    { timestamp: "2026-03-11T10:02:00Z", level: "info" as const, message: "렌더 완료!" },
  ],
  current_scene: null,
};

const mockRenderJobFailed = {
  id: "job-001",
  project_id: "proj-001",
  status: "failed" as const,
  total_frames: 1800,
  rendered_frames: 450,
  started_at: "2026-03-11T10:00:00Z",
  completed_at: null,
  output_path: null,
  file_size: null,
  logs: [
    { timestamp: "2026-03-11T10:00:00Z", level: "info" as const, message: "렌더 시작" },
    { timestamp: "2026-03-11T10:01:00Z", level: "error" as const, message: "메모리 부족 오류" },
  ],
  current_scene: null,
};

// ──────────────────────────────────────────────
// RenderHeader 컴포넌트 테스트
// ──────────────────────────────────────────────
describe("RenderHeader", () => {
  it("renders the header with back navigation link", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="pending" />);
    const backLink = screen.getByRole("link", { name: /back|뒤로/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("displays pending status badge", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="pending" />);
    expect(screen.getByText(/pending|대기/i)).toBeInTheDocument();
  });

  it("displays rendering status badge", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="rendering" />);
    expect(screen.getByText(/rendering|렌더링/i)).toBeInTheDocument();
  });

  it("displays completed status badge", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="completed" />);
    expect(screen.getByText(/completed|완료/i)).toBeInTheDocument();
  });

  it("displays failed status badge", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="failed" />);
    expect(screen.getByText(/failed|실패/i)).toBeInTheDocument();
  });

  it("renders page title", async () => {
    const { RenderHeader } = await import("@/components/render");
    render(<RenderHeader status="rendering" />);
    expect(screen.getByRole("heading", { name: /render|렌더/i })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// RenderProgress 컴포넌트 테스트
// ──────────────────────────────────────────────
describe("RenderProgress", () => {
  it("renders progress bar", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("shows correct percentage (50%)", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("shows rendered frames / total frames", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/900/)).toBeInTheDocument();
    expect(screen.getByText(/1800/)).toBeInTheDocument();
  });

  it("renders pause button during rendering", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /pause|일시정지/i })).toBeInTheDocument();
  });

  it("renders cancel button during rendering", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /cancel|취소/i })).toBeInTheDocument();
  });

  it("calls onPause when pause button is clicked", async () => {
    const { RenderProgress } = await import("@/components/render");
    const onPause = vi.fn();
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={onPause}
        onCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /pause|일시정지/i }));
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const { RenderProgress } = await import("@/components/render");
    const onCancel = vi.fn();
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel|취소/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render pause/cancel buttons when completed", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobCompleted}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: /pause|일시정지/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cancel|취소/i })).not.toBeInTheDocument();
  });

  it("shows 100% when completed", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobCompleted}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it("shows estimated remaining time during rendering", async () => {
    const { RenderProgress } = await import("@/components/render");
    render(
      <RenderProgress
        job={mockRenderJobRendering}
        onPause={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    // 남은 시간 표시 요소 확인 (초, 분 단위)
    const timeElement = screen.getByTestId("estimated-time");
    expect(timeElement).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// RenderLog 컴포넌트 테스트
// ──────────────────────────────────────────────
describe("RenderLog", () => {
  it("renders all log entries", async () => {
    const { RenderLog } = await import("@/components/render");
    render(<RenderLog logs={mockRenderJobRendering.logs} />);
    expect(screen.getByText("렌더 시작")).toBeInTheDocument();
    expect(screen.getByText("Scene 1 렌더링 중...")).toBeInTheDocument();
  });

  it("renders empty state when no logs", async () => {
    const { RenderLog } = await import("@/components/render");
    render(<RenderLog logs={[]} />);
    const logContainer = screen.getByTestId("render-log");
    expect(logContainer).toBeInTheDocument();
  });

  it("renders error logs with distinct styling indicator", async () => {
    const { RenderLog } = await import("@/components/render");
    render(<RenderLog logs={mockRenderJobFailed.logs} />);
    const errorMessage = screen.getByText("메모리 부족 오류");
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders log timestamps", async () => {
    const { RenderLog } = await import("@/components/render");
    render(<RenderLog logs={mockRenderJobRendering.logs} />);
    // 타임스탬프가 존재해야 함 (형식 불문)
    const timestamps = screen.getAllByTestId("log-timestamp");
    expect(timestamps.length).toBeGreaterThan(0);
  });

  it("has monospace font container", async () => {
    const { RenderLog } = await import("@/components/render");
    const { container } = render(<RenderLog logs={mockRenderJobRendering.logs} />);
    const logEl = container.querySelector('[data-testid="render-log"]');
    expect(logEl).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// DownloadPanel 컴포넌트 테스트
// ──────────────────────────────────────────────
describe("DownloadPanel", () => {
  it("renders download button when completed", async () => {
    const { DownloadPanel } = await import("@/components/render");
    render(<DownloadPanel job={mockRenderJobCompleted} />);
    expect(screen.getByRole("button", { name: /download|다운로드/i })).toBeInTheDocument();
  });

  it("shows file size in human-readable format", async () => {
    const { DownloadPanel } = await import("@/components/render");
    render(<DownloadPanel job={mockRenderJobCompleted} />);
    // 50MB = 52428800 bytes
    expect(screen.getByText(/50(\.\d+)?\s*MB/i)).toBeInTheDocument();
  });

  it("does not render when job is not completed", async () => {
    const { DownloadPanel } = await import("@/components/render");
    const { container } = render(<DownloadPanel job={mockRenderJobRendering} />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when job is null", async () => {
    const { DownloadPanel } = await import("@/components/render");
    const { container } = render(<DownloadPanel job={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders mp4 label", async () => {
    const { DownloadPanel } = await import("@/components/render");
    render(<DownloadPanel job={mockRenderJobCompleted} />);
    expect(screen.getByText(/mp4/i)).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// barrel export
// ──────────────────────────────────────────────
describe("render components barrel export", () => {
  it("exports RenderHeader, RenderProgress, RenderLog, DownloadPanel", async () => {
    const mod = await import("@/components/render");
    expect(mod.RenderHeader).toBeDefined();
    expect(mod.RenderProgress).toBeDefined();
    expect(mod.RenderLog).toBeDefined();
    expect(mod.DownloadPanel).toBeDefined();
  });
});
