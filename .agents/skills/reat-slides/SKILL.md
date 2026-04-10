---
name: reat-slides
description: 텍스트 개요(목차)만 입력하면 Remotion 기반 슬라이드 영상을 자동 생성합니다. SRT/MP3 없이 동작합니다.
---
# /reat-slides — 슬라이드 영상 생성

> 텍스트 개요(목차)만 입력하면 Remotion 기반 슬라이드 영상을 자동 생성합니다.
> SRT/MP3 없이 동작합니다.

## 트리거

```
/reat-slides {제목}
/reat-slides {projectId}   # 기존 프로젝트 슬라이드 재생성
```

## 입력 형식

사용자가 다음 중 하나를 제공합니다:

### A. 인라인 목차 (대화에서 직접)
```
/reat-slides "AI 시대의 교육"

1. 타이틀: AI 시대의 교육
2. 현재 교육의 문제점
3. AI가 바꾸는 학습 경험
4. 개인화 학습의 가능성
5. 실제 사례 3가지
6. 기술 스택 소개
7. 시작하기
```

### B. 마크다운 파일 참조
```
/reat-slides docs/presentation-outline.md
```

### C. 제목만 (Claude가 목차 자동 생성)
```
/reat-slides "newVideoGen 프로젝트 소개"
```
→ Claude가 프로젝트 코드를 분석하여 자동으로 슬라이드 구성

---

## 워크플로우

### Step 1: 슬라이드 구조 계획

목차를 분석하여 각 슬라이드의 **유형**을 결정합니다:

| 슬라이드 유형 | 용도 | 권장 아키타입 |
|-------------|------|-------------|
| title | 타이틀/표지 | A(히어로) — AccentGlow + Headline + Pill |
| overview | 개요/목차 | I(스텝카드) — ProcessStepCard 나열 |
| concept | 개념 설명 | D(3열Grid) — IconCard × 3 |
| comparison | 비교/대비 | C(VS대비) — Split + CompareCard |
| process | 절차/흐름 | E(프로세스) — FlowDiagram 또는 ArrowConnector |
| stats | 수치/통계 | R(번호+바) — StatCard + ProgressBar |
| quote | 인용/강조 | H(인용문) — QuoteText + Divider |
| demo | 코드/터미널 | W(터미널) — TerminalBlock |
| timeline | 연대기/순서 | Y(TimelineStepper) |
| gallery | 이미지 모음 | Split/Grid + ImageAsset |
| closing | 마무리/CTA | A(히어로) — Headline + TerminalBlock + Pill |

### Step 2: 프로젝트 + scenes-v2.json 생성

```bash
# 프로젝트 디렉토리 생성
data/{projectId}/
  ├── project.json          # { id, name, status: "rendered" }
  └── scenes-v2.json        # 슬라이드별 stack_root
```

**project.json** (audioSrc 없음):
```json
{
  "id": "my-slides",
  "name": "슬라이드 제목",
  "srt_path": "",
  "audio_path": "",
  "status": "rendered",
  "total_duration_ms": 0
}
```

### Step 3: 각 슬라이드의 stack_root 생성

`/reat-layout`의 아키타입 카탈로그(A~Z)와 REF 라이브러리를 **동일하게** 참조합니다.

#### 슬라이드 기본 설정

| 항목 | 값 |
|------|-----|
| duration_frames | 슬라이드당 **120~150프레임** (4~5초) |
| subtitles | `[]` (빈 배열 — 자막 없음) |
| narration | `""` |
| audioSrc | 생략 (render-props에서 제외) |

#### 씬 JSON 템플릿
```json
{
  "id": "{projectId}-s{번호:02d}",
  "project_id": "{projectId}",
  "beat_index": [{번호}],
  "layout_family": "hero-center",
  "start_ms": 0,
  "end_ms": 5000,
  "duration_frames": 150,
  "components": [],
  "copy_layers": { "headline": "슬라이드 제목" },
  "subtitles": [],
  "narration": "",
  "stack_root": { /* 아키타입 기반 생성 */ }
}
```

### Step 4: render-props-v2.json 생성 + 렌더링

```javascript
// render-props-v2.json — audioSrc 없음
{
  "projectId": "{projectId}",
  "scenes": [ /* scenes-v2.json 전체 */ ]
}
```

```bash
npx remotion render MainComposition output/reat/{projectId}.mp4 \
  --props=data/{projectId}/render-props-v2.json \
  --concurrency=4
```

---

## 슬라이드 디자인 규칙

### 레이아웃 규칙 (/reat-layout과 동일)

1. **연속 3개 슬라이드 같은 아키타입 금지**
2. **최소 5종 이상 아키타입 사용** (10슬라이드 기준)
3. **매 슬라이드 최소 1개 비텍스트 요소** (Icon/Chart/Badge)
4. **단일 카드 maxWidth ≤ 520px**
5. **컨테이너(Stack/Grid/Split) width: "100%" 필수**
6. **SceneRoot gap max 28**

### 슬라이드 전용 규칙

7. **첫 슬라이드는 반드시 title 유형** — AccentGlow + Headline + 부제
8. **마지막 슬라이드는 반드시 closing 유형** — CTA 또는 요약
9. **enterAt 간격: 8~12프레임** — 영상보다 빠른 등장 (읽기 시간 충분)
10. **텍스트 밀도 제한**: 슬라이드당 최대 50단어 (키워드 중심)
11. **아이콘 적극 활용**: 모든 개념에 SvgIcon 매칭
12. **색상 팔레트 순환**: 3색(Violet→Fuchsia→Indigo) 자동 적용

### 모션 가이드

| 요소 | 권장 preset | enterAt 간격 |
|------|------------|-------------|
| Kicker/Badge | fadeUp | 0 |
| Headline | fadeUp | 8~10 |
| Divider | fadeIn | 16~20 |
| 메인 콘텐츠 | staggerChildren / fadeUp | 22~30 |
| 하단 보조 | fadeIn | 50~60 |

---

## 에셋 매칭 (선택)

`public/assets/manifest.json`이 존재하면 `/reat-layout`과 동일한 태그 매칭 규칙으로 이미지/GIF를 배치합니다.

슬라이드 목차 텍스트의 키워드와 manifest tags를 비교하여 관련 에셋을 자동 선택합니다.

---

## 노드 data 형식 치트시트

`/reat-layout`의 치트시트를 **동일하게** 따릅니다. 아래는 슬라이드에서 자주 쓰는 노드:

```
IconCard:
  data: { icon: "sparkles", title: "제목", body: "설명 텍스트" }

ProcessStepCard:
  data: { step: 1, title: "단계명", desc: "설명" }

StatCard:
  data: { value: "99%", label: "정확도", icon: "trendingUp" }

TerminalBlock:
  data: { title: "Terminal", lines: ["string1", "string2"] }

ChatBubble:
  data: { speaker: "User", text: "내용", align: "right" }

FlowDiagram:
  data: { nodes: [{id,label}], edges: [{from,to}] }

CompareCard:
  data: { left: {icon,title,subtitle,negative}, right: {icon,title,subtitle,positive} }

QuoteText:
  data: { text: "인용문", author: "출처" }
```

---

## 출력 예시

```
✅ 슬라이드 생성 완료
  프로젝트: data/my-slides/
  슬라이드: 12개 (총 60초)
  아키타입: A, D, C, E, I, W, H, R, Y, K, D, A
  렌더링: output/my-slides.mp4 (4.2MB)
```

---

## 체크리스트

- [ ] 첫 슬라이드 = title 유형
- [ ] 마지막 슬라이드 = closing 유형
- [ ] 연속 3개 같은 아키타입 없음
- [ ] 슬라이드당 50단어 이내
- [ ] 모든 IconCard에 body 필드 (desc 아님)
- [ ] 모든 CompareCard에 left/right 필드
- [ ] 모든 TerminalBlock.lines가 string[]
- [ ] 컨테이너에 width: "100%"
- [ ] render-props에 audioSrc 없음
