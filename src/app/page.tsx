"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types";

interface ProjectWithScenes extends Project {
  sceneCount?: number;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithScenes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const list: ProjectWithScenes[] = data.projects ?? [];

        // 각 프로젝트의 씬 개수 가져오기
        const enriched = await Promise.all(
          list.map(async (p) => {
            try {
              const sRes = await fetch(`/api/projects/${p.id}/scenes-v2`);
              if (sRes.ok) {
                const scenes = await sRes.json();
                return { ...p, sceneCount: Array.isArray(scenes) ? scenes.length : 0 };
              }
            } catch { /* ignore */ }
            return p;
          })
        );
        setProjects(enriched);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  const formatDuration = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm font-bold">
              V
            </div>
            <h1 className="text-lg font-semibold tracking-tight">VideoGen</h1>
          </div>
          <span className="text-xs text-white/30">AI Presentation Video Generator</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Projects</h2>
          <span className="text-xs text-white/40">{projects.length} projects</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            No projects yet
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[15px] text-white/90 truncate mb-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>{p.id}</span>
                      {p.sceneCount != null && (
                        <span>{p.sceneCount} scenes</span>
                      )}
                      {p.total_duration_ms > 0 && (
                        <span>{formatDuration(p.total_duration_ms)}</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === "scened" || p.status === "rendered"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/chunk?projectId=${p.id}`}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-colors"
                    >
                      Chunk
                    </Link>
                    <Link
                      href={`/editor?projectId=${p.id}`}
                      className="px-4 py-2 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
