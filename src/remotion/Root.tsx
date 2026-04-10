// @TASK P0-T0.2 - Remotion 루트 컴포지션
// @SPEC specs/shared/types.yaml

import React from "react";
import { Composition } from "remotion";
import type { ComponentType } from "react";
import type { MainCompositionProps } from "./Composition";
import { MainComposition } from "./Composition";
import type { Scene } from "@/types";

/**
 * Remotion Root 컴포넌트.
 * 모든 Scene 배열을 순차 렌더링하는 MainComposition을 등록합니다.
 * durationInFrames는 렌더 시 실제 Scene 합산 값으로 동적 변경 가능하며,
 * 기본값은 300프레임(30fps × 10초)입니다.
 *
 * Remotion의 Composition 컴포넌트는 Props 타입 인자로
 * `Record<string, unknown>` 제약을 요구합니다.
 * `Scene[]`은 이 제약을 구조적으로 충족하지 않으므로
 * `ComponentType<Record<string, unknown>>`로 캐스팅합니다.
 */

const defaultScenes: Scene[] = [];

// Remotion Composition Props 제약(Record<string, unknown>)을 위한 캐스트.
// Scene[]은 Record<string, unknown>을 구조적으로 만족하지 않으므로
// unknown을 경유하는 이중 캐스트를 사용합니다.
const TypedMainComposition = MainComposition as unknown as ComponentType<
  Record<string, unknown>
>;

/**
 * Scene 배열의 총 프레임 수를 계산합니다.
 * scenes가 비어 있으면 기본 300프레임을 반환합니다.
 */
const calculateDuration = (scenes: Scene[]): number => {
  if (!scenes || scenes.length === 0) return 300;
  return scenes.reduce((sum, s) => sum + s.duration_frames, 0);
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainComposition"
        component={TypedMainComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={
          { scenes: defaultScenes } as unknown as Record<string, unknown>
        }
        calculateMetadata={async ({ props }) => {
          const p = props as unknown as MainCompositionProps;
          return {
            durationInFrames: calculateDuration(p.scenes),
          };
        }}
      />
    </>
  );
};

// 외부에서 Props 타입 참조용 재수출
export type { MainCompositionProps };
