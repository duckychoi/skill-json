---
name: reat-assets
description: public/assets/ 폴더의 이미지/GIF를 스캔하고, Claude가 시각적으로 분석하여 태그와 카테고리를 자동 생성합니다.
---
# /reat-assets — 에셋 스캔 + 태그 자동 생성

> `public/assets/` 폴더의 이미지/GIF를 스캔하고, Claude가 시각적으로 분석하여 태그와 카테고리를 자동 생성합니다.

## 트리거

- `/reat-assets` — 전체 스캔 + 태깅
- `/reat-assets refresh` — 새 파일만 태깅 (기존 태그 유지)

## 워크플로우

### Step 1: 스캔

```bash
npx tsx scripts/scan-assets.ts
```

`public/assets/` 하위의 모든 GIF/PNG/JPG/WEBP/SVG를 찾아 `public/assets/manifest.json` 기초 파일을 생성합니다. 파일명에서 자동으로 기본 태그를 추출합니다.

### Step 2: Claude 시각 분석 (핵심)

manifest.json에서 태그가 부족한 파일(≤2개 태그)을 찾아, **Read 도구로 이미지를 직접 보고** 다음을 작성합니다:

각 에셋에 대해:
1. **tags** (5~10개): 이미지의 주제, 감정, 행동, 개념을 한국어+영어로 태깅
   - 구체적 키워드: "로봇", "생각", "코딩", "돈", "성장"
   - 추상적 개념: "AI", "자동화", "혁신", "위기", "기회"
   - 감정/톤: "긍정", "경고", "중립", "흥미", "심각"
2. **category**: 대분류 (concept, tech, person, emotion, economy, nature, education, etc.)
3. **alt**: 이미지 설명 (한국어, 1줄)

### Step 3: manifest.json 저장

```json
[
  {
    "file": "assets/robot-thinking.gif",
    "filename": "robot-thinking.gif",
    "type": "gif",
    "tags": ["로봇", "사고", "AI", "인공지능", "생각", "고민", "기술", "robot", "thinking"],
    "category": "tech",
    "alt": "고민하는 로봇 애니메이션"
  },
  {
    "file": "assets/persons/boris-cherny.jpg",
    "filename": "boris-cherny.jpg",
    "type": "image",
    "tags": ["보리스 체르니", "Boris Cherny", "프로그래머", "TypeScript", "저자", "인물"],
    "category": "person",
    "alt": "보리스 체르니 (프로그래밍 TypeScript 저자)"
  }
]
```

### Step 4: 결과 리포트

```
✅ 에셋 스캔 완료
  총 12개 파일 (GIF 8, 이미지 4)
  새로 태깅: 5개
  기존 유지: 7개
  카테고리: tech(4), person(2), concept(3), emotion(3)
```

## 디렉토리 구조 (권장)

```
public/assets/
  ├── manifest.json          ← 자동 생성
  ├── thinking.gif
  ├── lightbulb.gif
  ├── coding.gif
  ├── persons/               ← 인물 사진
  │   ├── boris-cherny.jpg
  │   └── guido-van-rossum.jpg
  ├── tech/                  ← 기술 관련
  │   ├── robot-working.gif
  │   └── ai-brain.png
  └── concept/               ← 추상 개념
      ├── money-graph.gif
      └── growth-arrow.png
```

서브폴더를 사용하면 category가 자동으로 폴더명으로 설정됩니다.

## 태깅 가이드라인

### 좋은 태그 예시
- 구체적: "로봇", "뇌", "그래프", "화살표", "돈", "사람"
- 개념: "AI", "머신러닝", "성장", "비교", "프로세스"
- 감정: "긍정", "경고", "놀람", "진지"
- 도메인: "프로그래밍", "경제", "교육", "의료"

### 나쁜 태그 예시
- 너무 일반적: "이미지", "그림", "파일"
- 너무 구체적: "2024년 3월 촬영된 사무실 사진"

### 인물 태깅 필수 항목
- 이름 (한국어 + 영어)
- 직함/역할
- 관련 분야/키워드

## /reat-layout 연동

manifest.json이 존재하면 `/reat-layout`이 자동으로 씬 내용과 태그를 매칭합니다.

매칭 우선순위:
1. `narration` 텍스트에 태그가 직접 포함된 경우 (완전 일치)
2. `semantic.emphasis_tokens`와 태그 겹침
3. `semantic.intent` + `category` 유사도
4. 매칭되는 에셋이 없으면 기존 방식 (Icon, IconCard 등)으로 대체

## 주의사항

- 대용량 GIF (>5MB)는 렌더링 성능에 영향을 줄 수 있음 — 가능하면 최적화
- GIF는 `@remotion/gif` 패키지로 프레임 동기화 렌더링
- PNG/JPG는 기존 `<img>` 태그로 렌더링
- manifest.json은 Git에 커밋하여 팀 공유
