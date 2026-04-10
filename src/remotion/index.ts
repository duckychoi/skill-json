// @TASK P0-T0.2 - Remotion 엔트리포인트 (registerRoot)
// package.json scripts:
//   remotion:preview → remotion preview src/remotion/index.ts
//   remotion:render  → remotion render src/remotion/index.ts MainComposition

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
