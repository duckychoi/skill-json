"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Sub {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
  startMs: number;
  endMs: number;
}

function parseSRT(raw: string): Sub[] {
  const blocks = raw.trim().replace(/\r\n/g, "\n").split(/\n\n+/);
  return blocks
    .map((block) => {
      const lines = block.trim().split("\n");
      if (lines.length < 3) return null;
      const index = parseInt(lines[0]);
      const tm = lines[1].match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );
      if (!tm) return null;
      const startMs =
        +tm[1] * 3600000 + +tm[2] * 60000 + +tm[3] * 1000 + +tm[4];
      const endMs =
        +tm[5] * 3600000 + +tm[6] * 60000 + +tm[7] * 1000 + +tm[8];
      return {
        index,
        startTime: `${tm[1]}:${tm[2]}:${tm[3]}`,
        endTime: `${tm[5]}:${tm[6]}:${tm[7]}`,
        text: lines.slice(2).join(" ").trim(),
        startMs,
        endMs,
      };
    })
    .filter(Boolean) as Sub[];
}

function msToTime(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ChunkPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";

  const [projectName, setProjectName] = useState("");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [cuts, setCuts] = useState<Set<number>>(new Set());
  const [beatLabels, setBeatLabels] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("projectId가 없습니다. URL에 ?projectId=xxx를 추가하세요.");
      setLoading(false);
      return;
    }

    // 프로젝트 정보 로드
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((p) => { if (p) setProjectName(p.name || projectId); })
      .catch(() => {});

    // SRT 로드 (projectId 기반)
    fetch(`/api/srt?projectId=${encodeURIComponent(projectId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("SRT 로드 실패");
        return r.json();
      })
      .then((d) => {
        if (d.content) {
          const parsed = parseSRT(d.content);
          setSubs(parsed);

          // 기존 chunks.json이 있으면 경계 복원
          fetch(`/api/projects/${projectId}/chunks`)
            .then((r) => r.ok ? r.json() : null)
            .then((chunks) => {
              if (chunks && Array.isArray(chunks) && chunks.length > 0) {
                const restored = new Set<number>();
                const labels = new Map<number, string>();
                chunks.forEach((c: { srt_range?: number[]; label?: string }) => {
                  if (c.srt_range && c.srt_range[0] > 1) {
                    restored.add(c.srt_range[0]);
                  }
                  if (c.srt_range && c.label) {
                    labels.set(c.srt_range[0], c.label);
                  }
                });
                if (restored.size > 0) {
                  setCuts(restored);
                  setBeatLabels(labels);
                }
              }
            })
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const toggleCut = useCallback((idx: number) => {
    setCuts((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setSaved(false);
  }, []);

  // Compute scenes from cuts
  const scenes = (() => {
    if (subs.length === 0) return [];
    const sortedCuts = [1, ...Array.from(cuts).sort((a, b) => a - b)];
    const result: { sceneIdx: number; startIdx: number; endIdx: number; subs: Sub[] }[] = [];
    for (let i = 0; i < sortedCuts.length; i++) {
      const start = sortedCuts[i];
      const end = i + 1 < sortedCuts.length ? sortedCuts[i + 1] - 1 : subs[subs.length - 1].index;
      const sceneSubs = subs.filter((s) => s.index >= start && s.index <= end);
      if (sceneSubs.length > 0) {
        result.push({ sceneIdx: result.length, startIdx: start, endIdx: end, subs: sceneSubs });
      }
    }
    return result;
  })();

  const handleExport = useCallback(async () => {
    const exportData = scenes.map((sc) => ({
      scene_index: sc.sceneIdx,
      srt_range: [sc.startIdx, sc.endIdx],
      start_ms: sc.subs[0].startMs,
      end_ms: sc.subs[sc.subs.length - 1].endMs,
      duration_s: +((sc.subs[sc.subs.length - 1].endMs - sc.subs[0].startMs) / 1000).toFixed(1),
      subtitle_count: sc.subs.length,
      text: sc.subs.map((s) => s.text).join(" "),
    }));

    try {
      const res = await fetch("/api/srt/save-chunks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, scenes: exportData }),
      });
      if (res.ok) setSaved(true);
    } catch {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectId}-chunks.json`;
      a.click();
      setSaved(true);
    }
  }, [scenes, projectId]);

  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 20, height: 20, border: "2px solid #a78bfa", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, color: "#888" }}>로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: 16, marginBottom: 12 }}>{error}</p>
          <Link href="/" style={{ color: "#a78bfa", fontSize: 14 }}>대시보드로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#111",
          borderBottom: "1px solid #333",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#888", fontSize: 14, textDecoration: "none" }}>← 대시보드</Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>씬 분할 에디터</h1>
          <span style={{ fontSize: 13, color: "#888" }}>
            {projectName || projectId} — {subs.length}개 자막
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600 }}>
            {scenes.length}개 씬
          </span>
          <button
            onClick={handleExport}
            style={{
              background: saved ? "#22c55e" : "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {saved ? "저장됨 ✓" : "저장 (JSON 내보내기)"}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ padding: "8px 24px", background: "#1a1a2e", borderBottom: "1px solid #333", fontSize: 13, color: "#888" }}>
        자막 사이를 클릭하면 씬 경계가 추가/제거됩니다. 보라색 줄 = 씬 분리 지점
      </div>

      {/* Subtitle list */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px" }}>
        {subs.map((sub, i) => {
          const isCut = cuts.has(sub.index) && sub.index > 1;
          const sceneForThis = scenes.find(
            (sc) => sub.index >= sc.startIdx && sub.index <= sc.endIdx
          );
          const isSceneStart = sceneForThis && sub.index === sceneForThis.startIdx;

          return (
            <div key={sub.index}>
              {/* Cut line */}
              {i > 0 && (
                <div
                  onClick={() => toggleCut(sub.index)}
                  style={{
                    height: isCut ? 36 : 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.15s",
                  }}
                  title={isCut ? `씬 경계 제거 (#${sub.index})` : `여기서 씬 분리 (#${sub.index})`}
                >
                  {isCut ? (
                    <div
                      style={{
                        width: "100%",
                        height: 2,
                        background: "linear-gradient(90deg, transparent, #a78bfa, #7c3aed, #a78bfa, transparent)",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "#7c3aed",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: 10,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ✂ 씬 {sceneForThis ? sceneForThis.sceneIdx + 1 : ""}{beatLabels.get(sub.index) ? ` — ${beatLabels.get(sub.index)}` : ""}
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 1,
                        background: "#222",
                      }}
                    />
                  )}
                </div>
              )}

              {/* Scene label for first sub */}
              {isSceneStart && sceneForThis && sub.index === 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      background: "#7c3aed",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 10,
                    }}
                  >
                    씬 1{beatLabels.get(1) ? ` — ${beatLabels.get(1)}` : ""}
                  </span>
                </div>
              )}

              {/* Subtitle row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: isSceneStart ? "rgba(124, 58, 237, 0.08)" : "transparent",
                }}
              >
                <span style={{ fontSize: 12, color: "#555", minWidth: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {sub.index}
                </span>
                <span style={{ fontSize: 12, color: "#666", minWidth: 80, fontVariantNumeric: "tabular-nums" }}>
                  {msToTime(sub.startMs)}
                </span>
                <span style={{ fontSize: 14, color: "#e0e0e0", flex: 1, lineHeight: 1.5 }}>
                  {sub.text}
                </span>
                <span style={{ fontSize: 11, color: "#444", minWidth: 40, textAlign: "right" }}>
                  {((sub.endMs - sub.startMs) / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#111",
          borderTop: "1px solid #333",
          padding: "12px 24px",
          display: "flex",
          gap: 8,
          fontSize: 12,
          color: "#888",
          overflowX: "auto",
          flexWrap: "wrap",
        }}
      >
        {scenes.map((sc) => {
          const dur = ((sc.subs[sc.subs.length - 1].endMs - sc.subs[0].startMs) / 1000).toFixed(0);
          const label = beatLabels.get(sc.startIdx);
          return (
            <span key={sc.sceneIdx} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "#1a1a2e", borderRadius: 4, whiteSpace: "nowrap" }}>
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>{sc.sceneIdx + 1}</span>
              <span style={{ color: "#666" }}>{dur}s</span>
              {label && <span style={{ color: "#555" }}>{label}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
