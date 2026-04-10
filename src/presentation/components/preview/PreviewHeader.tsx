"use client";
// @TASK P3-S1-T1 - Remotion 프리뷰 UI - PreviewHeader
// @SPEC specs/preview.md

import { ArrowLeft, Maximize2 } from "lucide-react";

export interface PreviewHeaderProps {
  onBack: () => void;
  onFullscreen?: () => void;
  title?: string;
}

export function PreviewHeader({
  onBack,
  onFullscreen,
  title = "미리보기",
}: PreviewHeaderProps) {
  return (
    <header
      role="banner"
      className="flex items-center justify-between h-14 px-4 bg-[#0a0a0a] border-b border-white/10 flex-shrink-0"
    >
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        aria-label="뒤로"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm">뒤로</span>
      </button>

      {/* 제목 */}
      <h1 className="text-sm font-semibold text-white">{title}</h1>

      {/* 전체화면 */}
      <button
        onClick={onFullscreen}
        aria-label="전체화면"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Maximize2 className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm sr-only">전체화면</span>
      </button>
    </header>
  );
}
