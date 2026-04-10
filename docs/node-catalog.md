# Node Catalog — stack_root 생성 참조 가이드

## StackNode 스키마

```ts
interface StackNode {
  id: string;          // 유니크 ID (예: "h1", "card-1", "root")
  type: string;        // NODE_REGISTRY 또는 CONTAINER_TYPES의 키
  layout?: LayoutProps; // 레이아웃 속성
  style?: StyleProps;   // 스타일 오버라이드
  motion?: MotionProps; // 애니메이션
  data?: Record<string, any>; // 노드별 데이터
  children?: StackNode[]; // 컨테이너 노드만
  variant?: string;     // 노드별 변형
}
```

---

## Container Nodes (children 가짐)

### SceneRoot
- **역할**: 씬의 최상위 컨테이너. 모든 stack_root의 루트 노드.
- **layout**: `{ gap, padding }`
- **기본 스타일**: flex column, center, padding 60, scale 1.2
- 예시:
```json
{ "id": "root", "type": "SceneRoot", "layout": { "gap": 24, "padding": 60 }, "children": [...] }
```

### Stack
- **역할**: Flexbox 행/열 컨테이너
- **layout**: `{ direction: "row"|"column", gap, align, justify, wrap }`
- 예시:
```json
{ "id": "row1", "type": "Stack", "layout": { "direction": "row", "gap": 20, "align": "center" }, "children": [...] }
```

### Grid
- **역할**: CSS Grid 레이아웃
- **layout**: `{ columns, rows, gap, gapX, gapY }`
- 예시:
```json
{ "id": "grid1", "type": "Grid", "layout": { "columns": 3, "gap": 16 }, "children": [...] }
```

### Split
- **역할**: 비율 기반 2단 분할
- **layout**: `{ ratio: [number, number], gap }`
- 예시:
```json
{ "id": "split1", "type": "Split", "layout": { "ratio": [2, 3], "gap": 40 }, "children": [leftChild, rightChild] }
```

### Overlay
- **역할**: 겹치기 컨테이너 (첫 번째 child가 배경)
- **layout**: 없음 (position relative/absolute)
- 예시:
```json
{ "id": "ov1", "type": "Overlay", "children": [backgroundNode, foregroundNode] }
```

### AnchorBox
- **역할**: 절대 위치 지정
- **layout**: `{ anchor: "top-left"|"top-center"|...|"bottom-right", offsetX, offsetY, gap }`
- 예시:
```json
{ "id": "anc1", "type": "AnchorBox", "layout": { "anchor": "bottom-center", "offsetY": 20 }, "children": [...] }
```

### SafeArea
- **역할**: 안전 영역 (방송용 여백)
- **layout**: `{ paddingTop, paddingBottom, paddingLeft, paddingRight }`
- 기본: top 80, bottom 120, left/right 120

### FrameBox
- **역할**: 박스 프레임 (border + bg). 컨테이너이면서 leaf 모두 가능
- **layout**: `{ gap, padding }`
- **style**: `{ border, radius, background }`
- 예시:
```json
{ "id": "frame1", "type": "FrameBox", "layout": { "padding": 24, "gap": 12 }, "style": { "radius": 20 }, "children": [...] }
```

---

## Text Nodes

### Kicker
- **data**: `{ text: string }`
- **motion 추천**: fadeUp
- 용도: 상단 태그/라벨 (대문자, 작은 크기)
```json
{ "id": "k1", "type": "Kicker", "data": { "text": "OVERVIEW" }, "motion": { "preset": "fadeUp", "enterAt": 5, "duration": 12 } }
```

### Headline
- **data**: `{ text: string, size?: "sm"|"md"|"lg"|"xl", emphasis?: string[] }`
- **motion 추천**: fadeUp
- 크기: sm=28, md=40, lg=52, xl=68
```json
{ "id": "h1", "type": "Headline", "data": { "text": "RAG의 핵심 원리", "size": "lg", "emphasis": ["핵심"] }, "motion": { "preset": "fadeUp", "enterAt": 8, "duration": 15 } }
```

### RichText
- **data**: `{ segments: Array<{ text: string, tone?: "accent" }> }`
- 용도: 부분 강조가 필요한 본문
```json
{ "id": "rt1", "type": "RichText", "data": { "segments": [{ "text": "이것은 " }, { "text": "핵심 내용", "tone": "accent" }, { "text": "입니다" }] } }
```

### BodyText
- **data**: `{ text: string, emphasis?: string[] }`
- 용도: 일반 본문 (최소화 권장 — Badge, Icon 우선)

### BulletList
- **data**: `{ items: string[], bulletStyle?: "dot"|"check"|"dash" }`
- **motion 추천**: fadeUp
```json
{ "id": "bl1", "type": "BulletList", "data": { "items": ["첫 번째", "두 번째", "세 번째"], "bulletStyle": "check" } }
```

### StatNumber
- **data**: `{ value: string, suffix?: string, label?: string }`
- **motion 추천**: popNumber
```json
{ "id": "sn1", "type": "StatNumber", "data": { "value": "97", "suffix": "%", "label": "정확도" }, "motion": { "preset": "popNumber", "enterAt": 10, "duration": 12 } }
```

### QuoteText
- **data**: `{ text: string }`
- **motion 추천**: fadeIn
```json
{ "id": "q1", "type": "QuoteText", "data": { "text": "데이터가 답이다" } }
```

### FooterCaption
- **data**: `{ text: string }`
- 용도: 하단 작은 캡션/출처

---

## Shape Nodes

### Divider
- **layout**: `{ direction?: "horizontal"|"vertical" }`
- **style**: `{ thickness?: number, color?: string }`
```json
{ "id": "div1", "type": "Divider" }
```

### Badge
- **data**: `{ text: string }`
- **variant**: `"accent"` | `"outline"` | `"subtle"` (기본)
```json
{ "id": "b1", "type": "Badge", "data": { "text": "NEW" }, "variant": "accent" }
```

### Pill
- **data**: `{ text: string }`
- 용도: 둥근 태그
```json
{ "id": "p1", "type": "Pill", "data": { "text": "v2.0" } }
```

---

## Media Nodes

### Icon
- **data**: `{ name: string, size?: number, glow?: boolean }`
- **motion 추천**: popBadge
- 사용 가능 아이콘 (71개): brain, sparkles, book-open, search, rocket, chef-hat, alert-triangle, message-circle, refrigerator, check-circle, help-circle, message-square, quote, arrow-right, file-text, clock, database, shield, zap, target, layers, globe, code, trending-up, users, lightbulb, star, settings, lock, cloud, play, smartphone, monitor, terminal, user, user-circle, folder, folder-open, download, upload, wifi, battery, camera, music, video, image, edit, trash, refresh, share, heart, award, compass, cpu, git-branch, link, mail, mic, phone, power, send, server, thumbs-up, tool, x-circle, pie-chart, bar-chart, activity, dollar-sign, percent, hash
```json
{ "id": "ic1", "type": "Icon", "data": { "name": "brain", "size": 80, "glow": true }, "motion": { "preset": "popBadge", "enterAt": 5, "duration": 10 } }
```

### RingChart
- **data**: `{ value: number, size?: number, unit?: string, label?: string }`
- **motion**: 자체 애니메이션 (enterAt, duration 사용)
```json
{ "id": "rc1", "type": "RingChart", "data": { "value": 85, "size": 180, "unit": "%", "label": "완성도" }, "motion": { "enterAt": 10, "duration": 25 } }
```

---

## Chart Nodes

### ProgressBar
- **data**: `{ value: number, label?: string }`
- **motion**: 자체 애니메이션
```json
{ "id": "pb1", "type": "ProgressBar", "data": { "value": 75, "label": "진행률" }, "motion": { "enterAt": 10, "duration": 20 } }
```

### CompareBars
- **data**: `{ items: Array<{ label: string, value: number, subtitle?: string }>, unit?: string }`
- **motion**: 자체 애니메이션
```json
{ "id": "cb1", "type": "CompareBars", "data": { "items": [{ "label": "기존", "value": 60 }, { "label": "RAG", "value": 95 }], "unit": "%" }, "motion": { "enterAt": 8, "duration": 20 } }
```

### MiniBarChart
- **data**: `{ items: Array<{ label: string, value: number }> }`
- **motion**: 자체 애니메이션
```json
{ "id": "mbc1", "type": "MiniBarChart", "data": { "items": [{ "label": "A", "value": 30 }, { "label": "B", "value": 70 }, { "label": "C", "value": 90 }] } }
```

---

## Composite Nodes

### IconCard
- **data**: `{ icon: string, title: string, body?: string }`
- **variant**: `"default"` | `"bold"` | `"glass"` | `"outline"` | `"subtle"`
- **motion 추천**: fadeUp
```json
{ "id": "ic1", "type": "IconCard", "data": { "icon": "search", "title": "검색", "body": "관련 문서를 찾습니다" }, "variant": "default" }
```

### StatCard
- **data**: `{ value: string, label?: string }`
- **variant**: `"default"` | `"bold"` | `"glass"` | `"outline"` | `"subtle"`
```json
{ "id": "sc1", "type": "StatCard", "data": { "value": "10x", "label": "성능 향상" } }
```

### CompareCard
- **data**: `{ left: { icon?, title, subtitle?, negative? }, right: { icon?, title, subtitle?, positive? } }`
```json
{ "id": "cc1", "type": "CompareCard", "data": { "left": { "icon": "alert-triangle", "title": "기존 방식", "negative": true }, "right": { "icon": "check-circle", "title": "RAG 방식", "positive": true } } }
```

### ProcessStepCard
- **data**: `{ icon: string, step: string, title: string, desc?: string, highlighted?: boolean }`
- **variant**: `"highlighted"` — 강조 표시
```json
{ "id": "ps1", "type": "ProcessStepCard", "data": { "icon": "search", "step": "01", "title": "검색", "desc": "관련 문서 검색" } }
```

### InsightTile
- **data**: `{ title: string, index?: string }`
```json
{ "id": "it1", "type": "InsightTile", "data": { "index": "1", "title": "핵심 인사이트" } }
```

### WarningCard
- **data**: `{ icon?: string, title: string, body?: string }`
```json
{ "id": "wc1", "type": "WarningCard", "data": { "icon": "alert-triangle", "title": "주의사항", "body": "환각 응답 가능성" } }
```

---

## Connector Nodes

### ArrowConnector
- **layout/data**: `{ direction?: "right"|"down"|"column" }`
- **motion 추천**: drawConnector
```json
{ "id": "arr1", "type": "ArrowConnector", "data": { "direction": "right" } }
```

### LineConnector
- **layout**: `{ direction?: "vertical"|"horizontal"|"column" }`
```json
{ "id": "ln1", "type": "LineConnector", "layout": { "direction": "vertical" } }
```

---

## Accent Nodes

### AccentGlow
- 현재 비활성화 (빈 div 렌더)

### AccentRing
- **style/data**: `{ size?: number, thickness?: number }`
```json
{ "id": "ar1", "type": "AccentRing", "data": { "size": 180 }, "style": { "thickness": 4 } }
```

### Backplate
- **style**: `{ background?: string, radius?: number }`
- 용도: Overlay의 첫 번째 child로 배경
```json
{ "id": "bp1", "type": "Backplate", "style": { "background": "rgba(168,85,247,0.06)", "radius": 24 } }
```

### Spacer
- **layout**: `{ size?: number, axis?: "vertical"|"horizontal" }`
```json
{ "id": "sp1", "type": "Spacer", "layout": { "size": 24, "axis": "vertical" } }
```

---

## Interactive Nodes (신규)

### ChatBubble
- **data**: `{ messages: Array<{ sender: string, text: string, side: "left" | "right" }> }`
- **motion**: 자체 순차 애니메이션 (enterAt, duration 사용)
- 용도: 대화 형식 표현 (iMessage 스타일 좌/우 말풍선)
```json
{ "id": "chat1", "type": "ChatBubble", "data": { "messages": [{ "sender": "사용자", "text": "RAG가 뭔가요?", "side": "left" }, { "sender": "AI", "text": "검색 증강 생성입니다", "side": "right" }] }, "motion": { "enterAt": 10, "duration": 30 } }
```

### PhoneMockup
- **data**: `{ title?: string, content?: string, items?: string[] }`
- **motion 추천**: scaleIn
- 용도: 스마트폰 앱 화면 표현, 모바일 사례
```json
{ "id": "phone1", "type": "PhoneMockup", "data": { "title": "10분기타", "content": "스마트폰 앱", "items": ["코드 없이", "AI로 제작", "앱 출시"] }, "motion": { "preset": "scaleIn", "enterAt": 10, "duration": 15 } }
```

### MonitorMockup
- **data**: `{ title?: string, lines?: string[] }`
- **motion 추천**: scaleIn
- 용도: 데스크톱 화면, 코드 에디터, 웹앱 시각화
```json
{ "id": "mon1", "type": "MonitorMockup", "data": { "title": "VS Code", "lines": ["import { RAG } from 'ai'", "const result = await rag.query()", "console.log(result)"] }, "motion": { "preset": "scaleIn", "enterAt": 10, "duration": 15 } }
```

### TerminalBlock
- **data**: `{ title?: string, lines: string[] }`
- **motion**: 자체 순차 타이핑 애니메이션
- 용도: CLI 명령어, 터미널 실행 과정
```json
{ "id": "term1", "type": "TerminalBlock", "data": { "title": "Terminal", "lines": ["npm install ai-sdk", "npx create-rag-app", "Starting server..."] }, "motion": { "enterAt": 10, "duration": 25 } }
```

---

## Diagram Nodes (신규)

### CycleDiagram
- **data**: `{ steps: Array<{ label: string }>, centerLabel?: string, centerSublabel?: string }`
- **motion**: 자체 순차 애니메이션
- 용도: 순환 프로세스 (반복 사이클, 피드백 루프)
```json
{ "id": "cycle1", "type": "CycleDiagram", "data": { "steps": [{ "label": "입력" }, { "label": "처리" }, { "label": "출력" }, { "label": "피드백" }], "centerLabel": "RAG", "centerSublabel": "반복 개선" }, "motion": { "enterAt": 10, "duration": 30 } }
```

### FlowDiagram
- **data**: `{ steps: Array<{ title: string, subtitle?: string }> }`
- **motion**: 자체 순차 애니메이션
- 용도: 선형 프로세스 플로우 (단계별 진행)
```json
{ "id": "flow1", "type": "FlowDiagram", "data": { "steps": [{ "title": "질문 입력", "subtitle": "사용자" }, { "title": "문서 검색", "subtitle": "벡터 DB" }, { "title": "답변 생성", "subtitle": "LLM" }] }, "motion": { "enterAt": 10, "duration": 25 } }
```

### TimelineStepper
- **data**: `{ steps: Array<{ icon?: string, title: string, subtitle?: string }> }`
- **motion**: 자체 순차 애니메이션
- 용도: 수직 타임라인 (시간 순서, 진행 단계)
```json
{ "id": "tl1", "type": "TimelineStepper", "data": { "steps": [{ "icon": "search", "title": "불만 채널 탐색", "subtitle": "스스로 뒤진다" }, { "icon": "file-text", "title": "데이터 분석", "subtitle": "직접 분석한다" }, { "icon": "check-circle", "title": "결과물 제시", "subtitle": "이거 고쳐야 합니다" }] }, "motion": { "enterAt": 10, "duration": 30 } }
```

### PersonAvatar
- **data**: `{ name: string, role?: string, org?: string, variant?: "default" | "highlighted" }`
- **motion 추천**: fadeUp
- 용도: 인물 소개, 역할 표시
```json
{ "id": "person1", "type": "PersonAvatar", "data": { "name": "보리스", "role": "개발 품질 총괄", "org": "메타 → 앤트로픽", "variant": "highlighted" }, "motion": { "preset": "fadeUp", "enterAt": 10, "duration": 15 } }
```

---

## Image Node (신규)

### ImageAsset
- **data**: `{ src: string, alt?: string, caption?: string, objectFit?: "contain"|"cover", rounded?: boolean, border?: boolean, shadow?: boolean, maxHeight?: number }`
- **motion**: 자체 페이드인 애니메이션
- 용도: 외부 이미지, 투명 PNG, 브랜드 로고
```json
{ "id": "img1", "type": "ImageAsset", "data": { "src": "/images/robot.png", "alt": "AI 로봇", "caption": "AI 기반 자동화", "rounded": true, "border": true, "maxHeight": 300 }, "motion": { "enterAt": 10, "duration": 15 } }
```

---

## 모션 프리셋 (12+4종)

| 프리셋 | 효과 | 추천 용도 |
|--------|------|----------|
| `fadeUp` | opacity 0→1 + translateY 24→0 | 텍스트, 카드 |
| `popNumber` / `popBadge` | spring scale 0→1 | 숫자, 배지, 아이콘 |
| `fadeIn` | opacity 0→1 | 컨테이너, 인용 |
| `drawConnector` / `wipeBar` | spring scaleX + opacity | 커넥터, 바 |
| `slideSplit` | translateX -40→0 + opacity | 좌측 진입 |
| `slideRight` | translateX 40→0 + opacity | 우측 진입 |
| `revealMask` | clipPath inset reveal | 마스크 공개 |
| `countUp` | opacity (숫자 전용) | StatNumber |
| `pulseAccent` | scale 1→1.04→1 | 강조 반복 |
| `scaleIn` | scale 0.8→1 + opacity | 카드, 프레임 |
| `blurIn` | blur 10px→0 + opacity | 이미지, 배경 |
| `bounceUp` | spring translateY | 강조 요소 |
| `typewriter` | clipPath left→right | 텍스트 공개 |

---

## 테마 색상 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `T.bgBase` | #000000 | 기본 배경 |
| `T.bgElevated` | #0C0A14 | 카드 배경 |
| `T.bgSurface` | #14111F | 서피스 |
| `T.bgAccentSubtle` | rgba(168,85,247,0.06) | 강조 배경 |
| `T.textPrimary` | #FFFFFF | 주 텍스트 |
| `T.textSecondary` | rgba(255,255,255,0.6) | 보조 텍스트 |
| `T.textMuted` | rgba(255,255,255,0.38) | 흐린 텍스트 |
| `T.textAccent` | #C084FC | 강조 텍스트 |
| `T.accent` | #A855F7 | 메인 퍼플 |
| `T.accentBright` | #C084FC | 밝은 퍼플 |
| `T.accentVivid` | #D8B4FE | 선명 퍼플 |
| `T.accentGlow` | rgba(168,85,247,0.25) | 글로우 |
| `T.success` | #22C55E | 성공 |
| `T.successGlow` | rgba(34,197,94,0.25) | 성공 글로우 |
| `T.warning` | #F59E0B | 경고 |
| `T.warningGlow` | rgba(245,158,11,0.25) | 경고 글로우 |
| `T.info` | #3B82F6 | 정보 |
| `T.infoGlow` | rgba(59,130,246,0.25) | 정보 글로우 |

---

## 타이밍 가이드

- **FPS**: 30
- **enterAt 간격**: 10-20 프레임씩 분산
- **duration**: 애니메이션 지속 10-25 프레임
- **핵심 내용**: 전체 duration의 40% 이내 등장
- **순서**: Kicker/Badge → Headline → 본문/차트 → Footer
- **컨테이너**: motion 불필요 (children이 개별 motion)
- **총 씬 duration**: 보통 60-150 프레임 (2-5초)

---

## 다양성 규칙

1. 연속 2개 씬이 같은 컨테이너 구조 사용 금지
2. 항상 2개 이상 서로 다른 컨테이너 타입 사용
3. BodyText 최소화 → Badge, Icon, Chart 우선
4. 매 씬마다 최소 1개 비텍스트 요소 (Icon/Chart/Badge/RingChart)
5. Split, Grid, Overlay 적극 활용하여 시각적 변주
