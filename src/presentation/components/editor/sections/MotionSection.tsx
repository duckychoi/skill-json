"use client";

import type { StackNode, MotionProps } from "@/types/stack-nodes";
import { useEditorStore } from "@/stores/editor-store";
import { SelectField, NumberField } from "./shared";

const MOTION_PRESETS = [
  "",
  "fadeUp",
  "fadeIn",
  "popNumber",
  "popBadge",
  "staggerChildren",
  "drawConnector",
  "wipeBar",
  "slideSplit",
  "slideRight",
  "revealMask",
  "countUp",
  "pulseAccent",
  "scaleIn",
  "blurIn",
  "bounceUp",
  "typewriter",
];

interface MotionSectionProps {
  node: StackNode;
}

export function MotionSection({ node }: MotionSectionProps) {
  const { updateNodeAt } = useEditorStore();
  const motion = node.motion ?? {};

  const updateMotion = (patch: Partial<MotionProps>) => {
    updateNodeAt(node.id, { motion: { ...motion, ...patch } });
  };

  return (
    <div className="space-y-3">
      <SelectField
        label="preset"
        value={motion.preset ?? ""}
        options={MOTION_PRESETS}
        onChange={(v) => updateMotion({ preset: v || undefined })}
      />
      <NumberField
        label="enterAt (frame)"
        value={motion.enterAt}
        min={0}
        onChange={(v) => updateMotion({ enterAt: v })}
      />
      <NumberField
        label="duration (frames)"
        value={motion.duration}
        min={1}
        onChange={(v) => updateMotion({ duration: v })}
      />
    </div>
  );
}
