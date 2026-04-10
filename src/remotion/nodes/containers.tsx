// Container Nodes: SceneRoot, Stack, Grid, Split, Overlay, FrameBox
// 이 파일의 렌더러는 직접 사용되지 않음 - StackRenderer가 layout 속성으로 직접 CSS 생성
// registry에서 참조만 함

import React from "react";
import type { NodeProps } from "@/types/stack-nodes";

// 컨테이너는 StackRenderer에서 children과 함께 직접 렌더링됨
// 여기서는 빈 div만 반환 (실제로 호출되지 않음)
export const ContainerPlaceholder: React.FC<NodeProps> = () => <div />;
