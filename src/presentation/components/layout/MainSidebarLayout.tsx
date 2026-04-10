// @TASK P1-S0-T1 - 공통 레이아웃 UI - MainSidebarLayout
// @SPEC specs/layout.md

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MainSidebarLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

/**
 * 좌 70% (main) / 우 30% (sidebar) 분할 레이아웃.
 * 모바일(md 미만)에서는 세로 스택으로 전환됩니다.
 */
export function MainSidebarLayout({
  main,
  sidebar,
  className,
}: MainSidebarLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full min-h-0 flex-1",
        className
      )}
    >
      {/* Main: 70% */}
      <main className="flex-[7] min-w-0 overflow-auto bg-background">
        {main}
      </main>

      {/* Sidebar: 30% */}
      <aside
        aria-label="Sidebar"
        className={cn(
          "flex-[3] min-w-0 overflow-auto",
          "bg-surface border-t border-surface-border",
          "md:border-t-0 md:border-l md:border-surface-border"
        )}
      >
        {sidebar}
      </aside>
    </div>
  );
}
