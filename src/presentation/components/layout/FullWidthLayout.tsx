// @TASK P1-S0-T1 - 공통 레이아웃 UI - FullWidthLayout
// @SPEC specs/layout.md

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FullWidthLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * 전체 너비 레이아웃.
 * 헤더 없이 콘텐츠를 화면 전체에 배치할 때 사용합니다.
 */
export function FullWidthLayout({ children, className }: FullWidthLayoutProps) {
  return (
    <div
      className={cn("w-full min-h-0 flex-1 overflow-auto bg-background", className)}
    >
      {children}
    </div>
  );
}
