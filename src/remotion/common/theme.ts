// Design System - 바이올렛 네온 다크 테마
// 형광 바이올렛 3색 로테이션 브랜딩
import { createContext, useContext } from "react";

export const T = {
  // Background (바이올렛 틴트)
  bgBase: "#000000",
  bgElevated: "#0D0A15",
  bgSurface: "#150F22",
  bgAccentSubtle: "rgba(153, 69, 255, 0.06)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textMuted: "rgba(255, 255, 255, 0.38)",
  textAccent: "#BB86FC",

  // Accent (Electric Violet — 기본 팔레트 0 기준)
  accent: "#9945FF",
  accentBright: "#BB86FC",
  accentVivid: "#D4B8FF",
  accentDim: "#7B2FD6",
  accentGlow: "rgba(153, 69, 255, 0.28)",
  accentTint: "rgba(153, 69, 255, 0.10)",

  // Semantic
  success: "#22C55E",
  successGlow: "rgba(34, 197, 94, 0.25)",
  warning: "#F59E0B",
  warningGlow: "rgba(245, 158, 11, 0.25)",
  info: "#3B82F6",
  infoGlow: "rgba(59, 130, 246, 0.25)",

  // Border
  borderDefault: "rgba(255, 255, 255, 0.08)",
  borderAccent: "rgba(153, 69, 255, 0.45)",
  borderAccentStrong: "#9945FF",

  // Font
  font: "Inter, sans-serif",
} as const;

// ---------------------------------------------------------------------------
// Scene-level palette: 씬별 강조색 로테이션
// ---------------------------------------------------------------------------
export interface ScenePalette {
  accent: string;
  accentBright: string;
  accentVivid: string;
  accentDim: string;
  accentGlow: string;
  accentTint: string;
  borderAccent: string;
  borderAccentStrong: string;
}

export const SCENE_PALETTES: ScenePalette[] = [
  { // Electric Violet — 순수 바이올렛 형광 (코어 브랜드)
    accent: "#9945FF", accentBright: "#BB86FC", accentVivid: "#D4B8FF",
    accentDim: "#7B2FD6", accentGlow: "rgba(153,69,255,0.28)",
    accentTint: "rgba(153,69,255,0.10)", borderAccent: "rgba(153,69,255,0.45)",
    borderAccentStrong: "#9945FF",
  },
  { // Neon Fuchsia — 따뜻한 핑크-바이올렛 형광
    accent: "#E040FB", accentBright: "#F06EFF", accentVivid: "#F5A8FF",
    accentDim: "#B300D9", accentGlow: "rgba(224,64,251,0.28)",
    accentTint: "rgba(224,64,251,0.10)", borderAccent: "rgba(224,64,251,0.45)",
    borderAccentStrong: "#E040FB",
  },
  { // Cyber Indigo — 시원한 블루-바이올렛 형광
    accent: "#7C4DFF", accentBright: "#B388FF", accentVivid: "#D1C4E9",
    accentDim: "#651FFF", accentGlow: "rgba(124,77,255,0.28)",
    accentTint: "rgba(124,77,255,0.10)", borderAccent: "rgba(124,77,255,0.45)",
    borderAccentStrong: "#7C4DFF",
  },
];

export const SceneThemeContext = createContext<ScenePalette>(SCENE_PALETTES[0]);

export function useScenePalette(): ScenePalette {
  return useContext(SceneThemeContext);
}

export function getPaletteForScene(i: number): ScenePalette {
  return SCENE_PALETTES[i % SCENE_PALETTES.length];
}
