---
name: reat-chunk
description: SRT 자막 파일을 의미 단위로 분석하여 beats.json을 생성합니다.
---

# /reat-chunk - SRT 의미 청킹

SRT 자막 파일을 의미 단위로 분석하여 beats.json을 생성합니다.

## 입력
- projectId: 프로젝트 ID
- SRT 파일이 data/{projectId}/ 에 있어야 함

## 출력
- data/{projectId}/beats.json

## 사용법
/reat-chunk {projectId}

## API 엔드포인트
POST /api/skills/chunk

### Request
```json
{
  "project_id": "string"
}
```

### Response (200)
```json
{
  "success": true,
  "beats_count": 10,
  "output_path": "data/{projectId}/beats.json"
}
```

### Errors
- 400: project_id 누락, SRT 파일 없음, SRT 파싱 실패
- 404: 프로젝트 없음
- 500: 내부 서버 오류

## 처리 흐름
1. data/{projectId}/project.json에서 srt_path 읽기
2. SRT 파일 파싱 (parseSRT)
3. 각 SRT 엔트리에 대해 의미 분석 (현재 mock 휴리스틱)
4. beats.json 생성 후 data/{projectId}/beats.json에 저장
5. project.json status를 "chunked"로 업데이트

## beats.json 구조
```typescript
interface Beat {
  beat_index: number;     // 0-based 순서
  start_ms: number;       // 시작 밀리초
  end_ms: number;         // 종료 밀리초
  start_frame: number;    // 시작 프레임 (30fps)
  end_frame: number;      // 종료 프레임 (30fps)
  text: string;           // 자막 텍스트
  semantic: {
    intent: string;           // explain, compare, list, emphasize, example, define
    tone: string;             // neutral, dramatic, questioning, confident, analytical
    evidence_type: string;    // statement, statistic, quote, example, definition
    emphasis_tokens: string[]; // 강조 키워드 (최대 5개)
    density: number;          // 정보 밀도 (1-5)
  };
}
```

## 의존
- src/services/srt-parser.ts (parseSRT, SRTEntry)
- src/services/file-service.ts (readJSON, writeJSON, getProjectPath)

## 참고
- 의미 분석은 현재 텍스트 기반 휴리스틱 mock 구현
- 실제 Claude API 연동은 추후 태스크에서 구현 예정
