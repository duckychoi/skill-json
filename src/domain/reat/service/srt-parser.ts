// @TASK P1.5-SK1-T1 - SRT 파서 + 의미 분석 엔진
// @SPEC specs/shared/types.yaml

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * 파싱된 SRT 자막 엔트리.
 * 시간 정보를 원본 문자열, 밀리초, 프레임 번호 세 가지 형태로 제공합니다.
 */
export interface SRTEntry {
  /** 자막 시퀀스 번호 (1-based) */
  index: number;
  /** 시작 타임코드 원본 "HH:MM:SS,mmm" */
  startTime: string;
  /** 종료 타임코드 원본 "HH:MM:SS,mmm" */
  endTime: string;
  /** 시작 시간 (밀리초) */
  startMs: number;
  /** 종료 시간 (밀리초) */
  endMs: number;
  /** 시작 프레임 번호 (기본 30fps) */
  startFrame: number;
  /** 종료 프레임 번호 (기본 30fps) */
  endFrame: number;
  /** 자막 텍스트 (여러 줄인 경우 \n으로 구분) */
  text: string;
}

/**
 * Claude API 의미 분석 결과를 담는 타입.
 * 실제 API 호출은 vg-chunk 스킬에서 수행합니다.
 */
export interface SemanticAnalysis {
  /** 발화 의도: "explain", "compare", "list", "emphasize" 등 */
  intent: string;
  /** 톤: "confident", "questioning", "dramatic" 등 */
  tone: string;
  /** 근거 유형: "statistic", "quote", "example", "definition" 등 */
  evidenceType: string;
  /** 강조할 키워드 목록 */
  emphasisTokens: string[];
  /** 정보 밀도 (1-5) */
  density: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_FPS = 30;

/**
 * SRT 타임코드 정규식: HH:MM:SS,mmm
 */
const TIMECODE_RE = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/;

/**
 * 타임코드 라인 정규식: start --> end (양쪽 공백 허용)
 */
const TIMECODE_LINE_RE =
  /^\s*(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})\s*$/;

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * SRT 타임코드 문자열("HH:MM:SS,mmm")을 밀리초로 변환합니다.
 *
 * @param timecode - "HH:MM:SS,mmm" 형식의 타임코드
 * @returns 밀리초 값
 * @throws 유효하지 않은 타임코드 형식인 경우
 */
export function timeCodeToMs(timecode: string): number {
  const match = timecode.trim().match(TIMECODE_RE);
  if (!match) {
    throw new Error(`Invalid SRT timecode format: "${timecode}"`);
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);

  return hours * 3_600_000 + minutes * 60_000 + seconds * 1_000 + milliseconds;
}

/**
 * 밀리초를 프레임 번호로 변환합니다 (내림 처리).
 *
 * @param ms - 밀리초 값
 * @param fps - 초당 프레임 수 (기본값 30)
 * @returns 프레임 번호 (0-based, floor)
 */
export function msToFrame(ms: number, fps: number = DEFAULT_FPS): number {
  return Math.floor((ms / 1_000) * fps);
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

/**
 * SRT 문자열을 파싱하여 SRTEntry 배열을 반환합니다.
 *
 * 지원 기능:
 * - Windows/Unix 줄바꿈 (CRLF/LF)
 * - BOM (Byte Order Mark) 제거
 * - 멀티라인 자막
 * - 잘못된 타임코드 엔트리 건너뛰기
 * - 앞뒤 공백/빈줄 무시
 *
 * @param srtContent - SRT 파일 원본 문자열
 * @param fps - 프레임 계산에 사용할 FPS (기본값 30)
 * @returns 파싱된 SRTEntry 배열
 */
export function parseSRT(
  srtContent: string,
  fps: number = DEFAULT_FPS
): SRTEntry[] {
  if (!srtContent || !srtContent.trim()) {
    return [];
  }

  // BOM 제거 + CRLF 정규화
  const normalized = srtContent.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  // 빈 줄(들)로 블록 분리
  const blocks = normalized.split(/\n\n+/).filter((b) => b.trim().length > 0);

  const entries: SRTEntry[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim().length > 0);

    // 최소 2줄 필요: 인덱스 + 타임코드 (텍스트 없을 수도 있지만 보통 있음)
    if (lines.length < 2) {
      continue;
    }

    // 첫 줄: 시퀀스 번호
    const indexLine = lines[0].trim();
    const index = parseInt(indexLine, 10);
    if (isNaN(index)) {
      continue;
    }

    // 둘째 줄: 타임코드
    const timeMatch = lines[1].match(TIMECODE_LINE_RE);
    if (!timeMatch) {
      continue; // 유효하지 않은 타임코드 -> 건너뛰기
    }

    const startTime = timeMatch[1];
    const endTime = timeMatch[2];
    const startMs = timeCodeToMs(startTime);
    const endMs = timeCodeToMs(endTime);

    // 나머지 줄: 자막 텍스트
    const text = lines
      .slice(2)
      .map((l) => l.trim())
      .join("\n");

    entries.push({
      index,
      startTime,
      endTime,
      startMs,
      endMs,
      startFrame: msToFrame(startMs, fps),
      endFrame: msToFrame(endMs, fps),
      text,
    });
  }

  return entries;
}
