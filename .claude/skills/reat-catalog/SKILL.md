---
name: reat-catalog
description: 레이아웃 카탈로그, Scene DSL 복사 레이어 스키마, 모션 프리셋 카탈로그를 생성합니다.
---

# /reat-catalog - 카탈로그 생성

레이아웃 카탈로그, Scene DSL 복사 레이어 스키마, 모션 프리셋 카탈로그를 생성합니다.

## 입력
- project_id: 프로젝트 ID

## 출력
- data/{projectId}/catalog.json

## API
POST /api/skills/catalog

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
  "catalog_path": "data/{projectId}/catalog.json"
}
```

### Errors
- 400: project_id 누락, 잘못된 JSON
- 500: 내부 서버 오류

## 처리 흐름
1. data/{projectId}/layout-exemplars.json 읽기 (없으면 기본값)
2. data/{projectId}/design-tokens.json 읽기 (없으면 기본값)
3. catalog.json 생성:
   - 8개 레이아웃 (intent/tone/evidence 매핑 포함)
   - 10개 모션 프리셋
   - copy_layer_schema (4개 레이어)
4. data/{projectId}/catalog.json에 저장

## catalog.json 구조

### layouts (8개)
| id | intents | tones | evidence_types |
|----|---------|-------|----------------|
| hero-center | emphasize, introduce | confident, dramatic | quote, definition |
| split-2col | compare, contrast | analytical, balanced | statistic, example |
| grid-4x3 | list, enumerate | organized, comprehensive | example, statistic |
| process-horizontal | sequence, timeline | methodical, progressive | example, definition |
| radial-focus | focus, highlight | intense, spotlight | quote, statistic |
| stacked-vertical | stack, layer | structured, hierarchical | statement, definition |
| comparison-bars | compare, statistic | analytical, data-driven | statistic, example |
| spotlight-case | case-study, example | narrative, persuasive | quote, example |

### motion_presets (10개)
fadeUp, popNumber, staggerChildren, drawConnector, pulseAccent, wipeBar, countUp, slideSplit, revealMask, popBadge

### copy_layer_schema
```typescript
{
  kicker: { max_length: 30, optional: true },
  headline: { max_length: 60, optional: false },
  supporting: { max_length: 120, optional: true },
  footer_caption: { max_length: 40, optional: true }
}
```

## 의존
- src/services/file-service.ts (readJSON, writeJSON, getProjectPath)
- src/data/layout-families.ts (layoutFamilies)
