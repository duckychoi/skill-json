// @TASK P2-R2-T1 - 파형 데이터 생성 유틸리티
// @SPEC specs/shared/types.yaml

/**
 * Mock 파형 데이터를 생성합니다.
 * 실제 오디오 파형 분석은 추후 Web Audio API 또는 ffprobe로 대체 예정.
 *
 * @param durationMs - 오디오 총 길이 (밀리초)
 * @param samplesPerSecond - 초당 샘플 수 (기본: 100)
 * @returns 0~1 범위로 정규화된 파형 데이터 배열
 */
export function generateMockWaveform(
  durationMs: number,
  samplesPerSecond: number = 100
): number[] {
  const totalSamples = Math.max(
    1,
    Math.round((durationMs / 1000) * samplesPerSecond)
  );

  const waveform: number[] = [];

  for (let i = 0; i < totalSamples; i++) {
    // 결정론적 패턴: sin + cos 조합으로 자연스러운 파형 생성
    const t = i / totalSamples;
    const value =
      0.5 +
      0.3 * Math.sin(2 * Math.PI * 3 * t) +
      0.15 * Math.cos(2 * Math.PI * 7 * t) +
      0.05 * Math.sin(2 * Math.PI * 13 * t);

    // 0~1 범위로 클램핑
    waveform.push(Math.max(0, Math.min(1, value)));
  }

  return waveform;
}
