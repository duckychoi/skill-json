---
name: reat-scene
description: beats.json과 scoring engine을 사용하여 scene-plan.json과 scenes.json을 생성합니다.
---

# /reat-scene - Scene DSL 생성

beats.json과 scoring engine을 사용하여 scene-plan.json과 scenes.json을 생성합니다.

## 입력
- projectId: 프로젝트 ID
- data/{projectId}/beats.json이 존재해야 함
- data/{projectId}/design-tokens.json (선택, 없으면 기본값 사용)

## 출력
- data/{projectId}/scene-plan.json
- data/{projectId}/scenes.json

## 사용법
/reat-scene {projectId}

## API 엔드포인트
POST /api/skills/scene

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
  "scenes_count": 10,
  "scene_plan_path": "data/{projectId}/scene-plan.json",
  "scenes_path": "data/{projectId}/scenes.json"
}
```

### Errors
- 400: project_id 누락, beats.json 없음/빈 배열
- 500: 내부 서버 오류

## 처리 흐름
1. data/{projectId}/beats.json 읽기 (없으면 400)
2. data/{projectId}/design-tokens.json 읽기 (없으면 기본값 사용)
3. 각 beat에 대해:
   a. scoring-engine.ts의 selectBestLayout() 호출 -> 레이아웃 선택
   b. scoreAllLayouts()로 대안 레이아웃 목록 수집
   c. dsl-generator.ts의 generateSceneDSL() 호출 -> Scene DSL 생성
   d. 이전 레이아웃 추적 (ScoringContext 업데이트)
4. **이미지 에셋 탐색** (각 씬 분석 후):
   a. 씬 내용을 분석하여 이미지가 효과적인 씬 식별
   b. `assets.image_queries[]`에 검색 쿼리 추가 (아래 기준 참고)
   c. 이미지 검색/다운로드: `npx tsx scripts/fetch-scene-images.ts data/{projectId}/scenes-v2.json`
   d. 다운로드된 이미지는 `public/images/{projectId}/`에 저장
5. scene-plan.json 저장 (각 beat별 선택된 레이아웃 + 점수 + 대안)
6. scenes.json 저장 (Scene[] 배열)
7. project.json status를 "scened"로 업데이트

## 이미지 에셋 탐색 기준

씬 분석 시 다음 조건에 해당하면 `assets.image_queries`를 추가:

| 조건 | 이미지 유형 | 예시 |
|------|------------|------|
| 특정 제품/서비스 언급 | 로고, 스크린샷 | `{"query": "OpenAI logo", "style": "icon"}` |
| 비유/은유 표현 | 일러스트레이션 | `{"query": "puzzle pieces connecting", "style": "illustration"}` |
| 실제 사례/데모 | 목업, 사진 | `{"query": "chatbot interface", "style": "photo"}` |
| 개념 시각화 필요 | 다이어그램 | `{"query": "vector database concept", "style": "illustration"}` |

### image_queries 형식
```json
{
  "assets": {
    "svg_icons": ["search", "database"],
    "image_queries": [
      {"query": "RAG pipeline diagram", "style": "illustration"},
      {"query": "vector search concept", "style": "illustration"}
    ]
  }
}
```

### 이미지 사용하지 않는 씬
- 인트로/아웃트로 (텍스트 중심)
- 체크리스트/불릿 리스트 (텍스트면 충분)
- 차트/통계 씬 (데이터 시각화가 이미 있음)
- 5초 미만 짧은 씬

### WebSearch 활용 (API 키 없을 때)
Unsplash API 키가 없으면 Claude가 직접 WebSearch로 이미지를 찾아 다운로드:
```
1. WebSearch: "{query} transparent png free"
2. 적절한 이미지 URL 선택 (라이선스 확인)
3. curl로 public/images/{projectId}/에 다운로드
4. assets.images[]에 경로 기록
```

## scene-plan.json 구조
```typescript
interface ScenePlan {
  project_id: string;
  total_beats: number;
  plans: Array<{
    beat_index: number;
    selected_layout: string;
    score: number;
    breakdown: object;
    alternatives: Array<{ layout: string; score: number }>;
  }>;
}
```

## Scoring Context 관리
- recentLayouts: 최근 3개 레이아웃 추적 (repetition penalty용)
- previousLayout: 직전 레이아웃 추적 (similarity penalty용)
- 각 beat 처리 후 context 업데이트

## 의존
- src/services/scoring-engine.ts (selectBestLayout, scoreAllLayouts)
- src/services/dsl-generator.ts (generateSceneDSL)
- src/services/file-service.ts (readJSON, writeJSON, getProjectPath)

## 참고
- scoring-engine은 순수 함수로 부작용 없음
- dsl-generator도 순수 함수로 부작용 없음
- design-tokens는 현재 로드만 하고 향후 확장 예정
