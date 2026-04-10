import { create } from "zustand";
import type { Scene } from "@/types";
import type { StackNode } from "@/types/stack-nodes";

// ── 불변 트리 업데이트 헬퍼 ──────────────────────────────────────────────────

function updateNodeInTree(
  root: StackNode,
  nodeId: string,
  patch: Partial<StackNode>
): StackNode {
  if (root.id === nodeId) return { ...root, ...patch };
  if (!root.children) return root;
  const newChildren = root.children.map((c) =>
    updateNodeInTree(c, nodeId, patch)
  );
  // 참조 동일하면 변경 없음 → 원본 반환
  const changed = newChildren.some((c, i) => c !== root.children![i]);
  if (!changed) return root;
  return { ...root, children: newChildren };
}

function findNodeInTree(
  root: StackNode,
  nodeId: string
): StackNode | null {
  if (root.id === nodeId) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = findNodeInTree(child, nodeId);
    if (found) return found;
  }
  return null;
}

// ── 스토어 인터페이스 ────────────────────────────────────────────────────────

interface EditorState {
  // 데이터
  projectId: string | null;
  scenes: Scene[];

  // 선택
  activeSceneIndex: number;
  selectedNodeId: string | null;

  // UI
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;

  // 액션
  loadScenes: (projectId: string) => Promise<void>;
  setActiveScene: (index: number) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeAt: (nodeId: string, patch: Partial<StackNode>) => void;
  saveStackRoot: (sceneIndex: number) => Promise<void>;
  getSelectedNode: () => StackNode | null;

  // Undo/Redo
  history: Scene[][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>((set, get) => ({
  // 초기 상태
  projectId: null,
  scenes: [],
  activeSceneIndex: 0,
  selectedNodeId: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  history: [],
  historyIndex: -1,

  // ── 데이터 로드 ────────────────────────────────────────────────────────────
  loadScenes: async (projectId: string) => {
    set({ isLoading: true, projectId });
    try {
      const res = await fetch(`/api/projects/${projectId}/scenes-v2`);
      if (!res.ok) throw new Error("Failed to load scenes");
      const scenes: Scene[] = await res.json();
      set({
        scenes,
        isLoading: false,
        isDirty: false,
        activeSceneIndex: 0,
        selectedNodeId: null,
        history: [scenes],
        historyIndex: 0,
      });
    } catch {
      set({ isLoading: false, scenes: [] });
    }
  },

  // ── 씬 선택 ────────────────────────────────────────────────────────────────
  setActiveScene: (index: number) => {
    set({ activeSceneIndex: index, selectedNodeId: null });
  },

  // ── 노드 선택 ──────────────────────────────────────────────────────────────
  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  // ── 노드 속성 업데이트 ─────────────────────────────────────────────────────
  updateNodeAt: (nodeId: string, patch: Partial<StackNode>) => {
    const { scenes, activeSceneIndex, history, historyIndex } = get();
    const scene = scenes[activeSceneIndex];
    if (!scene?.stack_root) return;

    const newRoot = updateNodeInTree(scene.stack_root, nodeId, patch);
    if (newRoot === scene.stack_root) return; // 변경 없음

    const newScenes = scenes.map((s, i) =>
      i === activeSceneIndex ? { ...s, stack_root: newRoot } : s
    );

    // history에 push (현재 이후 항목 제거)
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      newScenes,
    ].slice(-MAX_HISTORY);

    set({
      scenes: newScenes,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // ── 저장 ───────────────────────────────────────────────────────────────────
  saveStackRoot: async (sceneIndex: number) => {
    const { scenes, projectId } = get();
    if (!projectId) return;
    const scene = scenes[sceneIndex];
    if (!scene?.stack_root) return;

    set({ isSaving: true });
    try {
      const res = await fetch(
        `/api/projects/${projectId}/scenes-v2/${sceneIndex}/stack-root`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stack_root: scene.stack_root }),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      set({ isSaving: false, isDirty: false });
    } catch {
      set({ isSaving: false });
    }
  },

  // ── 선택 노드 조회 ─────────────────────────────────────────────────────────
  getSelectedNode: () => {
    const { scenes, activeSceneIndex, selectedNodeId } = get();
    const scene = scenes[activeSceneIndex];
    if (!scene?.stack_root || !selectedNodeId) return null;
    return findNodeInTree(scene.stack_root, selectedNodeId);
  },

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      scenes: history[newIndex],
      historyIndex: newIndex,
      isDirty: true,
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      scenes: history[newIndex],
      historyIndex: newIndex,
      isDirty: true,
      selectedNodeId: null,
    });
  },
}));
