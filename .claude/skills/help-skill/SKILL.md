---
name: help-skill
description: 이 프로젝트의 모든 스킬 목록과 사용법을 HTML로 생성하여 브라우저에서 띄웁니다.
---
# /help-skill — 스킬 명령어 레퍼런스

> 이 프로젝트의 모든 스킬 목록과 사용법을 HTML로 생성하여 브라우저에서 띄웁니다.

## 실행 원칙

**사용자에게 확인 없이 모든 단계를 자동으로 실행한다.**

## 트리거

```
/help-skill
/help-skill --open   # 브라우저 자동 오픈
```

## 워크플로우

### Step 1: 스킬 목록 자동 수집

HTML을 생성하기 전에 **반드시** `.claude/skills/` 하위의 모든 `SKILL.md` 파일을 읽어 최신 스킬 목록을 수집한다.

```bash
# 모든 SKILL.md 경로 확인
ls .claude/skills/*/SKILL.md
```

각 SKILL.md에서 frontmatter의 `name`과 `description` 필드를 추출한다:
- `name` → 스킬 ID 및 `/name` 명령어
- `description` → 카드 설명 (한국어)
- 프리픽스로 카테고리 자동 분류:
  - `reat-*` → 영상
  - `pixl-*` → 픽셀
  - `pptx-*` → PPT
  - `obsi-*` → 문서
  - `down-*` → SNS
  - 나머지 → 기타

수집한 스킬 목록과 아래 **스킬 데이터**를 병합한다. 동일 id가 있으면 아래 데이터 우선(상세 examples 포함).
SKILL.md에만 있고 아래 데이터에 없는 스킬은 name/description만으로 카드를 생성한다.

### Step 2: HTML 파일 생성

`D:/product/skill-json/temp/skill-help.html` 파일을 생성한다.
항상 Step 1에서 수집한 최신 목록으로 새로 생성한다.

### Step 2: 브라우저 오픈

```bash
start "" "D:/product/skill-json/temp/skill-help.html"
```

## HTML 구성 규칙

- 다크 테마 (#0d0d0d 배경, #00ff88 네온그린 액센트)
- 상단 검색바: 실시간 필터링 (스킬명/설명/태그)
- 카테고리 탭: 전체 / 영상(reat-*) / PPT / 픽셀(pixl-*) / SNS / 문서 / 기타
- 각 카드: 명령어, 한줄 설명, 예시 코드블록, 태그
- 반응형 그리드 레이아웃

## 스킬 데이터 (최신 기준)

아래 데이터를 HTML에 임베드한다:

```json
[
  {
    "id": "down-video",
    "cmd": "/down-video",
    "category": "SNS",
    "desc": "Instagram, Threads, YouTube 영상을 플랫폼별 폴더에 키워드 제목으로 저장",
    "tags": ["instagram", "threads", "youtube", "download"],
    "examples": [
      "/down-video \"https://www.youtube.com/watch?v=xxxx\"",
      "/down-video \"https://www.instagram.com/reel/xxxx/\"",
      "/down-video \"https://www.threads.com/@user/post/xxxx\""
    ]
  },
  {
    "id": "pptx-generate",
    "cmd": "/pptx-generate",
    "category": "PPT",
    "desc": "PDF/이미지를 PPT 네이티브 도형/텍스트 요소로 재현한 .pptx 생성",
    "tags": ["pptx", "pdf", "powerpoint", "presentation"],
    "examples": [
      "/pptx-generate input/pptx/slide.pdf",
      "/pptx-generate input/pptx/slide.png"
    ]
  },
  {
    "id": "reat-script",
    "cmd": "/reat-script",
    "category": "영상",
    "desc": "주제/키워드 → 교육 영상용 대본(script.json + script.md) 자동 생성",
    "tags": ["script", "대본", "tts", "영상"],
    "examples": [
      "/reat-script \"AI 시대의 가치 노동\"",
      "/reat-script \"RAG 검색의 원리\" --tone casual --length 10m",
      "/reat-script docs/topic-outline.md"
    ]
  },
  {
    "id": "reat-voice",
    "cmd": "/reat-voice",
    "category": "영상",
    "desc": "script.json → ElevenLabs TTS로 MP3 + SRT 자막 자동 생성",
    "tags": ["tts", "voice", "mp3", "srt", "elevenlabs"],
    "examples": [
      "/reat-voice {projectId}",
      "/reat-voice {projectId} --preview",
      "/reat-voice --list"
    ]
  },
  {
    "id": "reat-new",
    "cmd": "/reat-new",
    "category": "영상",
    "desc": "input/ 폴더의 mp3+srt 감지 → 프로젝트 생성 + reat-chunk/scene 자동 실행",
    "tags": ["project", "init", "mp3", "srt"],
    "examples": [
      "/reat-new",
      "input/ 폴더에 mp3+srt 파일을 넣으면 자동 감지"
    ]
  },
  {
    "id": "reat-chunk",
    "cmd": "/reat-chunk",
    "category": "영상",
    "desc": "SRT 자막 파일을 의미 단위로 분석하여 beats.json 생성",
    "tags": ["srt", "beats", "chunk", "분석"],
    "examples": [
      "/reat-chunk {projectId}"
    ]
  },
  {
    "id": "reat-scene",
    "cmd": "/reat-scene",
    "category": "영상",
    "desc": "beats.json → scoring engine으로 scene-plan.json + scenes.json 생성",
    "tags": ["scene", "beats", "dsl"],
    "examples": [
      "/reat-scene {projectId}"
    ]
  },
  {
    "id": "reat-assets",
    "cmd": "/reat-assets",
    "category": "영상",
    "desc": "public/assets/ 폴더 스캔 → Claude 시각 분석으로 태그/카테고리 자동 생성",
    "tags": ["assets", "tag", "image", "gif"],
    "examples": [
      "/reat-assets",
      "/reat-assets refresh"
    ]
  },
  {
    "id": "reat-layout",
    "cmd": "/reat-layout",
    "category": "영상",
    "desc": "씬 계획 → Claude가 36+ 노드 조합 stack_root JSON 트리 생성 (핵심 AI 판단)",
    "tags": ["layout", "json", "stack", "remotion"],
    "examples": [
      "/reat-layout {projectId}",
      "/reat-layout {projectId} --scene 3"
    ]
  },
  {
    "id": "reat-render",
    "cmd": "/reat-render",
    "category": "영상",
    "desc": "scenes-v2.json + render-props-v2.json → Remotion으로 MP4 렌더링",
    "tags": ["render", "mp4", "remotion", "video"],
    "examples": [
      "/reat-render {projectId}"
    ]
  },
  {
    "id": "reat-slides",
    "cmd": "/reat-slides",
    "category": "영상",
    "desc": "텍스트 목차만으로 Remotion 기반 슬라이드 영상 자동 생성 (SRT/MP3 불필요)",
    "tags": ["slides", "presentation", "remotion"],
    "examples": [
      "/reat-slides \"AI 시대의 교육\"",
      "/reat-slides {projectId}"
    ]
  },
  {
    "id": "reat-analyze",
    "cmd": "/reat-analyze",
    "category": "영상",
    "desc": "레퍼런스 이미지 분석 → 디자인 토큰 + 레이아웃 패턴 추출",
    "tags": ["design", "token", "analyze", "reference"],
    "examples": [
      "/reat-analyze {projectId}"
    ]
  },
  {
    "id": "reat-catalog",
    "cmd": "/reat-catalog",
    "category": "영상",
    "desc": "레이아웃 카탈로그 + Scene DSL 스키마 + 모션 프리셋 카탈로그 생성",
    "tags": ["catalog", "dsl", "motion", "layout"],
    "examples": [
      "/reat-catalog {projectId}"
    ]
  },
  {
    "id": "pixl-charactor",
    "cmd": "/pixl-charactor",
    "category": "픽셀",
    "desc": "사진/이미지 → 128x128 2D 픽셀 게임 캐릭터 변환 (배경제거 + 색상 양자화)",
    "tags": ["pixel", "character", "sprite", "pixelart"],
    "examples": [
      "/pixl-charactor path/to/photo.png",
      "/pixl-charactor photo.webp --pixel 3 --colors 16",
      "/pixl-charactor photo.png --pixel 1 --colors 32 --no-outline"
    ]
  },
  {
    "id": "pixl-attack",
    "cmd": "/pixl-attack",
    "category": "픽셀",
    "desc": "픽셀 캐릭터 → 6프레임 공격 애니메이션 스프라이트 시트 생성",
    "tags": ["pixel", "animation", "attack", "sprite"],
    "examples": [
      "/pixl-attack character.png \"몽둥이로 때리기\"",
      "/pixl-attack character.png \"마법 발사\" --frames 8",
      "/pixl-attack character.png \"검 휘두르기\" --direction east"
    ]
  },
  {
    "id": "pixl-runany",
    "cmd": "/pixl-runany",
    "category": "픽셀",
    "desc": "픽셀 캐릭터 → 8프레임 걷기/달리기 루프 애니메이션 스프라이트 시트 생성",
    "tags": ["pixel", "animation", "walk", "run", "sprite"],
    "examples": [
      "/pixl-runany character.png",
      "/pixl-runany character.png --motion run",
      "/pixl-runany character.png --direction south --motion walk"
    ]
  },
  {
    "id": "shot-wrighter",
    "cmd": "/shot-wrighter",
    "category": "기타",
    "desc": "슈퍼말순 스타일 동물 쇼츠 대본 자동 생성 (50~60초 분량)",
    "tags": ["shorts", "script", "animal", "youtube"],
    "examples": [
      "/shot-wrighter \"강아지 미용실\" --animal 강아지",
      "/shot-wrighter \"고양이 카페 알바\" --animal 고양이",
      "/shot-wrighter \"동물병원 첫 방문\" --animal 강아지 --mood 긴장"
    ]
  },
  {
    "id": "hwpx-skill",
    "cmd": "/hwpx-skill",
    "category": "문서",
    "desc": "HWPX 한글 문서 생성·읽기·편집. 보고서/공문/기안문/회의록 등 생성",
    "tags": ["hwpx", "한글", "word", "document", "보고서"],
    "examples": [
      "/hwpx-skill \"분기 보고서 작성\"",
      "/hwpx-skill \"공문 템플릿으로 기안문 생성\""
    ]
  },
  {
    "id": "auto-research",
    "cmd": "/auto-research",
    "category": "기타",
    "desc": "대상 스킬을 무한 실험 루프로 자율 개선 (평가 지표 기반 SKILL.md 자동 고도화)",
    "tags": ["research", "optimize", "skill", "loop"],
    "examples": [
      "/auto-research pptx-generate",
      "/auto-research reat-layout",
      "/auto-research shot-wrighter --max-rounds 10"
    ]
  }
]
```
