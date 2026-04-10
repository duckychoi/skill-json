"use client";

import { useEditorStore } from "@/stores/editor-store";
import { SlideStripItem } from "./SlideStripItem";

export function SlideStrip() {
  const { scenes, activeSceneIndex, setActiveScene } = useEditorStore();

  return (
    <div className="w-[200px] flex-shrink-0 border-r border-white/10 bg-[#0d0d0d] overflow-y-auto">
      <div className="p-2 space-y-1">
        {scenes.map((scene, index) => (
          <SlideStripItem
            key={scene.id}
            scene={scene}
            index={index}
            isActive={index === activeSceneIndex}
            onClick={() => setActiveScene(index)}
          />
        ))}
      </div>
    </div>
  );
}
