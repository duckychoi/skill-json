// @TASK P3-S2-T1 - 렌더 출력 UI - RenderLog
// @SPEC specs/render-output.md

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { LogEntry, LogLevel } from "@/types";

export interface RenderLogProps {
  logs: LogEntry[];
}

const LEVEL_STYLE: Record<LogLevel, string> = {
  info: "text-foreground/70",
  warning: "text-yellow-400",
  error: "text-red-400",
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info: "[INFO]",
  warning: "[WARN]",
  error: "[ERR ]",
};

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", { hour12: false });
  } catch {
    return iso;
  }
}

export function RenderLog({ logs }: RenderLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 로그가 추가될 때 자동 스크롤
  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === "function") {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div
      data-testid="render-log"
      className="flex flex-col h-full min-h-0 bg-surface rounded-xl border border-surface-border overflow-hidden"
      aria-label="렌더 로그"
    >
      <div className="px-4 py-2 border-b border-surface-border flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
          Log
        </span>
        <span className="ml-auto text-xs text-foreground/30">{logs.length} entries</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5">
        {logs.length === 0 && (
          <span className="text-foreground/30 italic">로그 없음</span>
        )}
        {logs.map((entry, idx) => (
          <div
            key={idx}
            className={cn("flex gap-2 leading-relaxed", LEVEL_STYLE[entry.level])}
          >
            <span
              data-testid="log-timestamp"
              className="shrink-0 text-foreground/30"
            >
              {formatTimestamp(entry.timestamp)}
            </span>
            <span className="shrink-0 text-foreground/40">
              {LEVEL_PREFIX[entry.level]}
            </span>
            <span className={cn(LEVEL_STYLE[entry.level])}>{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
