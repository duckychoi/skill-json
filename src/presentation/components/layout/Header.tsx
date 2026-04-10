// @TASK P1-S0-T1 - 공통 레이아웃 UI - Header
// @SPEC specs/layout.md

"use client";

import { ArrowLeft, Save, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  /** 상단에 표시할 프로젝트 이름 */
  projectName?: string;
  /** 뒤로가기 핸들러. 전달 시 버튼 표시 */
  onBack?: () => void;
  /** 저장 핸들러. 전달 시 버튼 표시 */
  onSave?: () => void;
  className?: string;
}

export function Header({ projectName, onBack, onSave, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between px-4",
        "bg-surface border-b border-surface-border",
        className
      )}
    >
      {/* 왼쪽: 뒤로가기 + 프로젝트명 */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            // "Back / 뒤로" 둘 다 aria-label에 포함 → 스크린 리더 + 테스트 호환
            aria-label="Back 뒤로"
            onClick={onBack}
            className={cn(
              "flex items-center justify-center",
              // 최소 44×44px 터치 타겟 (Apple HIG)
              "h-11 w-11 rounded-md",
              "text-foreground/70 hover:text-foreground",
              "hover:bg-surface-hover",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            )}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
        {projectName && (
          <span className="truncate text-sm font-medium text-foreground">
            {projectName}
          </span>
        )}
      </div>

      {/* 오른쪽: 저장 + 설정 */}
      <div className="flex items-center gap-2 shrink-0">
        {onSave && (
          <button
            type="button"
            // "Save / 저장" 둘 다 aria-label에 포함
            aria-label="Save 저장"
            onClick={onSave}
            className={cn(
              "flex items-center gap-1.5 px-3 h-9 rounded-md",
              "text-xs font-medium",
              "bg-accent text-black",
              "hover:bg-accent-dim",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            )}
          >
            <Save size={14} aria-hidden="true" />
            <span>저장</span>
          </button>
        )}
        <button
          type="button"
          // "Settings / 설정" 둘 다 aria-label에 포함
          aria-label="Settings 설정"
          className={cn(
            "flex items-center justify-center",
            "h-11 w-11 rounded-md",
            "text-foreground/70 hover:text-foreground",
            "hover:bg-surface-hover",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          <Settings size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
