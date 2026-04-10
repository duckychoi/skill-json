// @TASK P3-S2-T1 - 렌더 출력 UI 구현
// @SPEC specs/render-output.md

"use client";

import { useEffect, useState, useCallback } from "react";
import { FullWidthLayout } from "@/components/layout";
import {
  RenderHeader,
  RenderProgress,
  RenderLog,
  DownloadPanel,
} from "@/components/render";
import type { RenderJob } from "@/types";

const POLL_INTERVAL_MS = 500;

// 개발 환경용 mock 데이터 (실제 API 연동 전 fallback)
const MOCK_PROJECT_ID = "demo-project";
const MOCK_JOB_ID = "demo-job";

async function fetchRenderJob(
  projectId: string,
  jobId: string
): Promise<RenderJob> {
  const res = await fetch(`/api/projects/${projectId}/render/${jobId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function startRender(projectId: string): Promise<RenderJob> {
  const res = await fetch(`/api/projects/${projectId}/render`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function pauseRender(projectId: string, jobId: string): Promise<void> {
  await fetch(`/api/projects/${projectId}/render/${jobId}/pause`, {
    method: "PUT",
  });
}

async function cancelRender(projectId: string, jobId: string): Promise<void> {
  await fetch(`/api/projects/${projectId}/render/${jobId}/cancel`, {
    method: "PUT",
  });
}

const TERMINAL_STATUSES = new Set(["completed", "failed"]);

export default function RenderOutputPage() {
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 프로젝트/잡 ID 파싱
  const [projectId, setProjectId] = useState(MOCK_PROJECT_ID);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get("projectId") ?? MOCK_PROJECT_ID;
      const jid = params.get("jobId") ?? null;
      setProjectId(pid);
      setJobId(jid);
    }
  }, []);

  // 렌더 시작 (jobId 없을 때)
  const handleStartRender = useCallback(async () => {
    try {
      const job = await startRender(projectId);
      setRenderJob(job);
      setJobId(job.id);
      setIsPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "렌더 시작 실패");
    }
  }, [projectId]);

  // 폴링
  useEffect(() => {
    if (!jobId) return;
    if (renderJob && TERMINAL_STATUSES.has(renderJob.status)) return;

    setIsPolling(true);
    const timer = setInterval(async () => {
      try {
        const job = await fetchRenderJob(projectId, jobId);
        setRenderJob(job);
        if (TERMINAL_STATUSES.has(job.status)) {
          clearInterval(timer);
          setIsPolling(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "폴링 오류");
        clearInterval(timer);
        setIsPolling(false);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      setIsPolling(false);
    };
  }, [jobId, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePause = useCallback(async () => {
    if (!jobId) return;
    try {
      await pauseRender(projectId, jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "일시정지 실패");
    }
  }, [projectId, jobId]);

  const handleCancel = useCallback(async () => {
    if (!jobId) return;
    try {
      await cancelRender(projectId, jobId);
      setIsPolling(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "취소 실패");
    }
  }, [projectId, jobId]);

  const status = renderJob?.status ?? "pending";

  return (
    <div className="flex flex-col h-screen bg-background">
      <RenderHeader status={status} />

      <FullWidthLayout className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* 에러 배너 */}
          {error && (
            <div
              role="alert"
              className="p-4 bg-red-950/40 border border-red-800/40 rounded-xl text-red-400 text-sm"
            >
              {error}
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-2 underline hover:no-underline"
                aria-label="에러 닫기"
              >
                닫기
              </button>
            </div>
          )}

          {/* 렌더 시작 안내 (잡 없을 때) */}
          {!renderJob && !jobId && (
            <div className="flex flex-col items-center gap-6 py-16">
              <p className="text-foreground/50 text-sm">렌더링을 시작하려면 버튼을 클릭하세요.</p>
              <button
                type="button"
                onClick={handleStartRender}
                className="h-11 px-8 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                렌더링 시작
              </button>
            </div>
          )}

          {/* 진행률 */}
          {renderJob && (
            <RenderProgress
              job={renderJob}
              onPause={handlePause}
              onCancel={handleCancel}
            />
          )}

          {/* 다운로드 패널 (완료 시) */}
          {renderJob && <DownloadPanel job={renderJob} />}

          {/* 로그 */}
          {renderJob && renderJob.logs.length > 0 && (
            <div className="h-64">
              <RenderLog logs={renderJob.logs} />
            </div>
          )}

          {/* 폴링 인디케이터 */}
          {isPolling && (
            <p className="text-xs text-foreground/30 text-center" aria-live="polite">
              상태를 실시간으로 업데이트 중...
            </p>
          )}
        </div>
      </FullWidthLayout>
    </div>
  );
}
