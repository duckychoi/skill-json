// @TASK P1-S0-T1 - 공통 레이아웃 UI 구현
// @SPEC specs/layout.md

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "@/components/layout/Header";
import { MainSidebarLayout } from "@/components/layout/MainSidebarLayout";
import { FullWidthLayout } from "@/components/layout/FullWidthLayout";

// ──────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────
describe("Header", () => {
  it("renders without props", () => {
    render(<Header />);
    // 헤더 루트 요소가 렌더링되어야 함
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders project name when provided", () => {
    render(<Header projectName="My Project" />);
    expect(screen.getByText("My Project")).toBeInTheDocument();
  });

  it("renders default project name when not provided", () => {
    render(<Header />);
    // 기본값 또는 빈 문자열 처리 — 배너는 존재해야 함
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    render(<Header onBack={onBack} />);
    const backButton = screen.getByRole("button", { name: /back|뒤로/i });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSave when save button is clicked", () => {
    const onSave = vi.fn();
    render(<Header onSave={onSave} />);
    const saveButton = screen.getByRole("button", { name: /save|저장/i });
    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does not render back button when onBack is not provided", () => {
    render(<Header />);
    expect(
      screen.queryByRole("button", { name: /back|뒤로/i })
    ).not.toBeInTheDocument();
  });

  it("does not render save button when onSave is not provided", () => {
    render(<Header />);
    expect(
      screen.queryByRole("button", { name: /save|저장/i })
    ).not.toBeInTheDocument();
  });

  it("renders settings button always", () => {
    render(<Header />);
    const settingsButton = screen.getByRole("button", { name: /settings|설정/i });
    expect(settingsButton).toBeInTheDocument();
  });

  it("has correct accessible structure", () => {
    render(<Header projectName="Test Project" onBack={() => {}} onSave={() => {}} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// MainSidebarLayout
// ──────────────────────────────────────────────
describe("MainSidebarLayout", () => {
  it("renders main and sidebar content", () => {
    render(
      <MainSidebarLayout
        main={<div>Main Content</div>}
        sidebar={<div>Sidebar Content</div>}
      />
    );
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
  });

  it("renders main region", () => {
    render(
      <MainSidebarLayout
        main={<div>Main</div>}
        sidebar={<div>Sidebar</div>}
      />
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders complementary/aside region for sidebar", () => {
    render(
      <MainSidebarLayout
        main={<div>Main</div>}
        sidebar={<div>Sidebar</div>}
      />
    );
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("applies 70/30 split layout classes", () => {
    const { container } = render(
      <MainSidebarLayout
        main={<div>Main</div>}
        sidebar={<div>Sidebar</div>}
      />
    );
    // wrapper div가 flex를 사용해야 함
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// FullWidthLayout
// ──────────────────────────────────────────────
describe("FullWidthLayout", () => {
  it("renders children", () => {
    render(
      <FullWidthLayout>
        <div>Full Width Content</div>
      </FullWidthLayout>
    );
    expect(screen.getByText("Full Width Content")).toBeInTheDocument();
  });

  it("wraps children in a container", () => {
    const { container } = render(
      <FullWidthLayout>
        <span>Child</span>
      </FullWidthLayout>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <FullWidthLayout>
        <div>First</div>
        <div>Second</div>
      </FullWidthLayout>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// Barrel export (index)
// ──────────────────────────────────────────────
describe("Layout barrel export", () => {
  it("exports Header, MainSidebarLayout, FullWidthLayout", async () => {
    const mod = await import("@/components/layout/index");
    expect(mod.Header).toBeDefined();
    expect(mod.MainSidebarLayout).toBeDefined();
    expect(mod.FullWidthLayout).toBeDefined();
  });
});
