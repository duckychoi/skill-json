---
name: reat-analyze
description: 레퍼런스 이미지를 분석하여 디자인 토큰과 레이아웃 패턴을 추출합니다.
---

# /reat-analyze - 레퍼런스 분석

레퍼런스 이미지를 분석하여 디자인 토큰과 레이아웃 패턴을 추출합니다.

## 입력
- projectId: 프로젝트 ID
- reference_images: 레퍼런스 이미지 경로 배열 (data/{projectId}/references/)

## 출력
- data/{projectId}/design-tokens.json
- data/{projectId}/layout-exemplars.json

## API
POST /api/skills/analyze

### Request
```json
{
  "project_id": "string",
  "reference_images": ["string"] // optional
}
```

### Response
```json
{
  "success": true,
  "design_tokens_path": "data/{projectId}/design-tokens.json",
  "layout_exemplars_path": "data/{projectId}/layout-exemplars.json"
}
```

## 현재 구현 (Mock)
- 실제 이미지 분석은 Claude Vision API 통합 전까지 mock
- 기본 디자인 토큰: 다크 테마 + 네온 그린 액센트
- 레이아웃 분석: 기본 layout families 반환
