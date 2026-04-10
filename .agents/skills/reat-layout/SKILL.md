---
name: reat-layout
description: AI 레이아웃 생성 — Claude가 직접 stack_root JSON 트리를 생성하여 36+ 노드를 자유 조합합니다.
---

# /reat-layout — AI 레이아웃 생성

Claude가 직접 stack_root JSON 트리를 생성하여 36+ 노드를 자유 조합합니다.

## 호출

```
/reat-layout {projectId}          # 전체 씬
/reat-layout {projectId} --scene 3  # 특정 씬만
```

## 워크플로우

### 1. 데이터 로드 (항상 최신 파일 기준)
```
Read: data/{projectId}/scenes-v2.json   ← 사용자가 chunk 에디터에서 편집했을 수 있음
Read: docs/node-catalog.md
Read: docs/layout-strategy.md           ← REF 활용 전략 + 카테고리 인덱스
```

**중요:** scenes-v2.json은 사용자가 chunk 에디터에서 씬 경계를 변경했을 수 있습니다.
씬 개수, 각 씬의 duration_frames, narration, subtitles 등이 초기 자동 생성 시점과 다를 수 있으므로
**반드시 현재 파일을 읽고 그 내용 기준으로 레이아웃을 생성**해야 합니다.

### 2. 씬 분석 (각 씬마다)
각 씬에서 다음을 추출:
- `copy_layers`: kicker, headline, supporting, footer_caption
- `chunk_metadata`: intent, tone, evidence_type, density, emphasis_tokens
- `assets`: svg_icons[], chart_data
- `duration_frames`: 씬 길이 (프레임)

### 3. REF 라이브러리 기반 2단계 매칭

**1단계 — 아키타입 선택** (A~Z 대분류)

씬의 `chunk_metadata.intent`로 아키타입 후보를 좁힌다:

| intent | 1차 아키타입 후보 |
|--------|-----------------|
| compare | C(VS대비), O(CompareCard), 또는 REF 이항대비 계열 |
| list | D(3열Grid), I(스텝카드), J(체크리스트) |
| sequence | E(프로세스), P(타임라인), Y(TimelineStepper) |
| define | B(풀블리드), K(단일카드), 또는 REF 히어로 계열 |
| emphasize | A(히어로), G(Warning), H(인용) |
| example | F(FrameBox), L(Split), V(디바이스) |

**2단계 — REF 기법 적용** (세부 시각 기법)

아키타입이 정해진 후, `docs/layout-reference-library.md`의 REF에서 세부 기법을 차용한다.
**REF 카테고리 빠른 참조:**

| 카테고리 | REF 번호 | 핵심 기법 |
|---------|---------|----------|
| 이항 대비 | 003, 048, 060, 066, 067, 069 | Split + 색상 코딩 (gray vs green) |
| 3열 나열 | 004, 047, 052, 068 | Grid/Stack(row) + 카드 반복 |
| 프로세스 흐름 | 005, 051, 054, 058, 064, 065 | ArrowConnector + 순차 노드 |
| 수치/통계 | 055, 057, 063, 068 | StatNumber + ProgressBar + RingChart |
| 히어로 임팩트 | 045, 050, 053, 070 | 큰 아이콘/이미지 + 키워드 Headline |
| 목업/일러스트 | 059, 060, 061, 069 | FrameBox 안에 노드 조합으로 UI 모사 |
| 리스트/체크 | 046, 052, 062 | BulletList + ProcessStepCard + Badge |
| 테이블/행 반복 | 067 | Stack(row) 반복 + Divider 행구분 |
| 이미지 활용 | 049, 070 | ImageAsset (원형/사각) + border |
| 태그/칩 클러스터 | 047, 061, 066 | Pill 클러스터, stagger pop-in |
| 모션 특수 | 057(spin-ring), 061(stagger), 069(slide-right) | 비표준 모션 |

필요한 REF를 `Read: docs/layout-reference-library.md`에서 해당 섹션만 참조한다.

### 4. REF 창의적 재조합 (필수)

**REF는 시각 어휘이지 복사 템플릿이 아니다.** 반드시 아래 규칙을 따른다:

#### 4A. 패턴 태그 분해 — 부분만 차용

REF 하나를 통째로 쓰지 않는다. 기법 단위로 분해하여 자유 조합:
```
예: REF-067의 [comparison-table] + REF-068의 [progressbar-meter] = 새로운 레이아웃
예: REF-070의 [circular-image] + REF-053의 [equation-headline] = 새로운 히어로
```

#### 4B. 변주 필수 — 최소 1가지 변경

같은 구조라도 반드시 변주를 적용:

| 변주 축 | 예시 |
|---------|------|
| 색상 반전 | gray좌+green우 → green좌+amber우 |
| 방향 전환 | 수평 → 수직, 좌→우 → 우→좌 |
| 비율 변경 | Split 1:1 → 1:2, 3열 → 2열/4열 |
| 모션 교체 | scale-in → fade-in, slide-up |
| 크기 스케일 | Icon 80px → 120px 또는 40px |
| 요소 증감 | 3카드 → 2카드+InsightTile |

#### 4C. 내용 재해석

REF의 원본 내용(Claude Code, 토큰 등)이 아닌 **현재 씬의 narration에서 키워드를 새로 추출**.
구조적 패턴만 가져오고, 텍스트·아이콘·색상은 현재 맥락에 맞게 재구성.

### 5. stack_root JSON 트리 직접 구성

**핵심 원칙:**
- 아키타입(A~Z) + REF 기법을 조합하되, 어느 것도 그대로 복사하지 않음
- 27개 leaf 노드 + 8개 컨테이너를 자유 조합
- 내용에 맞는 최적의 레이아웃 생성
- **구조 다양성이 최우선** — 연속 3개 씬이 같은 패턴 금지

---

## 레이아웃 아키타입 카탈로그 (20가지)

### A. 히어로 오버레이
```
Overlay → Backplate + Stack(column,center) [Icon(120,glow) + Headline(xl)]
```
용도: 인트로/아웃트로. 최소 요소, 최대 임팩트.

### B. 풀블리드 임팩트
```
SceneRoot(padding 큼) → Badge + Headline(xl,emphasis) + FooterCaption
```
용도: 핵심 메시지, 한 줄 임팩트.

### C. 좌우 VS 대비 (중앙 수직선)
```
SceneRoot → Kicker + Headline + Split(1:1) [
  FrameBox(border=red)[Icon(✕) + Headline(sm) + BulletList]
  | VerticalDivider(LineConnector direction=vertical)
  | FrameBox(border=accent)[Icon(✓) + Headline(sm) + BulletList]
]
```
용도: 나쁜/좋은, 이전/이후, A vs B 대비. **반드시 중앙에 수직 구분선.**

### D. 3열 Grid (카드)
```
SceneRoot → Badge + Headline + Grid(3col) [IconCard×3 또는 StatCard×3]
```
용도: 분류, 3요소 나열. 카드 maxWidth: 320.

### E. 수평 프로세스 플로우 (SVG 화살표)
```
SceneRoot → Kicker + Headline + Stack(row, maxWidth:700, gap:16) [
  Stack(col,center,gap:8)[Icon + BodyText(키워드)]
  ArrowConnector
  Stack(col,center,gap:8)[Icon + BodyText(키워드)]
  ArrowConnector
  Stack(col,center,gap:8)[Icon + BodyText(키워드)]
]
```
용도: 파이프라인, 변환 과정. **maxWidth:700 필수, gap:16.**

### F. FrameBox 카드 + InsightTile
```
SceneRoot → Kicker + Headline + FrameBox(maxWidth:700)[Icon + BodyText] + InsightTile
```
용도: 문제제기, 핵심 포인트 강조.

### G. Warning 강조
```
SceneRoot → Badge + Headline + WarningCard(maxWidth:700) + InsightTile
```
용도: 경고, 주의사항.

### H. 인용문 중심
```
SceneRoot → Pill + QuoteText(큰 인용문) + Divider + FooterCaption
```
용도: 핵심 인용, 좋은 예시.

### I. 수직 스텝카드 (번호 리스트)
```
SceneRoot → Badge + Headline + Stack(col,gap:16,maxWidth:700) [
  ProcessStepCard(step=1,maxWidth:700)
  ProcessStepCard(step=2,maxWidth:700)
  ProcessStepCard(step=3,maxWidth:700)
]
```
용도: 순서 있는 단계.

### J. 체크리스트
```
SceneRoot → Kicker + Headline + BulletList(check) + FooterCaption
```
용도: 정리, 체크항목.

### K. 단일 IconCard 집중
```
SceneRoot → Badge + Headline + IconCard(maxWidth:600,variant=bold)
```
용도: 단일 개념 설명.

### L. Split 비대칭 (시각 + 텍스트)
```
SceneRoot → Kicker + Headline + Split(ratio=[1,2]) [
  Icon(size=100) 또는 RingChart
  | Stack(col)[BulletList 또는 BodyText]
]
```
용도: 좌 시각 / 우 텍스트 분리형.

### M. 수평 바 비교 (CompareBars/ProgressBar)
```
SceneRoot → Badge + Headline + CompareBars(maxWidth:800) + FooterCaption
```
용도: 수치 비교, 데이터 시각화.

### N. RichText + Pill 태그 조합
```
SceneRoot → Stack(row,gap:12)[Pill×2~3] + Headline + RichText + InsightTile
```
용도: 키워드 강조, 개념 소개.

### O. 좌우 비교 (CompareCard)
```
SceneRoot → Kicker + Headline + CompareCard(maxWidth:800)
```
용도: 간단한 이항 비교.

### P. 수직 타임라인 (연결선 + 아이콘)
```
SceneRoot → Kicker + Headline + Stack(col,gap:8,maxWidth:700) [
  Stack(row,gap:16)[Icon(28) + BodyText("단계 1 키워드")]
  LineConnector(direction=vertical)
  Stack(row,gap:16)[Icon(28) + BodyText("단계 2 키워드")]
  LineConnector(direction=vertical)
  Stack(row,gap:16)[Icon(28) + BodyText("단계 3 키워드")]
]
```
용도: 순서 흐름, 진단 단계. **수직선이 연결.**

### Q. 도넛 차트 + 태그 배열
```
SceneRoot → Badge + Headline + RingChart(value,label,size:200) + Stack(row,gap:12)[Pill×3~5] + FooterCaption
```
용도: 통계, 비율. 차트 아래 태그로 구성요소 표시.

### R. 번호 헤더 + 바 비교
```
SceneRoot → StatNumber(value="01",size=xl) + Headline + ProgressBar(maxWidth:800) + ProgressBar + FooterCaption
```
용도: 챕터 번호 + 수치 비교.

### S. 아이콘 + 3열 키워드 카드
```
SceneRoot → Badge + Icon(size:80,glow) + Headline + Grid(3col) [
  FrameBox(sm)[BodyText("라벨: 값")]×3
]
```
용도: 요약, 3개 키워드 제시.

### T. 미니멀 전환 (챕터 마커)
```
SceneRoot(padding:큼) → Icon(size:100,glow) + Badge("N번째 주제") + BodyText(키워드)
```
용도: 섹션 전환, 짧은 씬.

### U. 채팅 대화 (ChatBubble)
```
SceneRoot → Kicker + Headline + ChatBubble(maxWidth:600) + FooterCaption
```
용도: 사용자-AI 대화, 질문-답변, 인터뷰 형식.

### V. 디바이스 목업 + 설명 (PhoneMockup/MonitorMockup)
```
SceneRoot → Badge + Headline + Split(ratio=[1,2]) [
  PhoneMockup(title,content,items)
  | Stack(col)[BodyText + BulletList]
]
```
용도: 앱 소개, 실제 사례, 제품 데모. MonitorMockup으로 대체 가능.

### W. 터미널 코드 블록 (TerminalBlock)
```
SceneRoot → Kicker + Headline + TerminalBlock(maxWidth:700) + InsightTile
```
용도: CLI 명령어, 코드 실행, 기술 데모.

### X. 순환 사이클 (CycleDiagram)
```
SceneRoot → Badge + Headline + CycleDiagram(4steps,centerLabel) + FooterCaption
```
용도: 반복 프로세스, 피드백 루프, 순환 구조 설명.

### Y. 수직 타임라인 v2 (TimelineStepper)
```
SceneRoot → Kicker + Headline + TimelineStepper(maxWidth:700) + InsightTile
```
용도: 시간순 진행, 단계별 과정. P(수직 타임라인)보다 시각적으로 풍부.

### Z. 인물 프로필 + 플로우 (PersonAvatar + FlowDiagram)
```
SceneRoot → Kicker + Headline + Stack(row,gap:40) [
  PersonAvatar(name,role,org)
  | FlowDiagram(steps)
] + FooterCaption
```
용도: 인물 소개 + 경력/이동 경로, 사례 연구.

---

## enterAt 순차 등장 규칙 (필수)

**핵심: 자막보다 0.5초 앞서 요소가 빠르게 등장해야 한다. 느리면 안 된다.**

```
enterAt 간격 규칙:
- 형제 노드 간 최소 간격: 20프레임 (0.67초)
- 최대 간격: 45프레임 (1.5초)
- 헤더 그룹 (Badge/Kicker + Headline): 0 ~ 24프레임 (빠르게)
- 메인 콘텐츠 시작: 36프레임 이후 (헤더 등장 후 바로)
- 메인 콘텐츠 각 요소: 20~30프레임 간격으로 빠르게 순차
- 테일 (FooterCaption/InsightTile): 콘텐츠 마지막 + 20프레임

예시 (8초 = 240프레임 씬):
  Badge:       enterAt 0
  Headline:    enterAt 12
  IconCard 1:  enterAt 36
  IconCard 2:  enterAt 60
  IconCard 3:  enterAt 84
  FooterCaption: enterAt 108
```

**절대 금지:**
- 전체 요소 enterAt이 0~30 범위에 몰리는 것
- Grid/Stack children이 동시에 나오는 것 (각각 20프레임 간격)
- 마지막 요소의 enterAt > duration_frames × 0.6
- **컨테이너(FrameBox/Split/Grid)가 children보다 먼저 등장하는 것** — 빈 카드가 보임
  - 컨테이너의 enterAt은 반드시 첫 자식의 enterAt과 동일하게 설정

**enterAt 시각 순서:**
- DFS 트리 순서를 따름 (위쪽 → 아래쪽)
- 형제 노드는 좌→우, 위→아래 순서

---

## 카드/컴포넌트 너비 규칙 (필수)

| 컴포넌트 | maxWidth |
|----------|----------|
| 단일 카드 (IconCard, WarningCard, ProcessStepCard) | 400~520 |
| CompareCard | 800 |
| CompareBars, ProgressBar | 800 |
| Split 컨테이너 | 1000~1100 |
| Grid(3col) 전체 | 1100, 개별 카드 280~320 |
| InsightTile | 600 |
| FrameBox (컨테이너) | 600 (width: fit-content) |
| Stack(row) 프로세스 플로우 | 700 |
| StatCard (Grid 안) | 280 |
| ChatBubble | 520 |
| PhoneMockup | 200 (고정) |
| MonitorMockup | 400 (고정) |
| TerminalBlock | 600 |
| CycleDiagram | 400 (고정) |
| FlowDiagram | 800 |
| TimelineStepper | 600 |
| PersonAvatar | 120 (고정) |

**화면 전체 너비(1920px)로 카드가 늘어나면 안 된다. 단일 카드 maxWidth 520 초과 금지.**

**추가 너비/정렬 규칙:**
- SceneRoot 직계 children인 독립 카드(IconCard, WarningCard, FrameBox 등)는 반드시 `maxWidth` 명시 (위 표 참조)
- `maxWidth` 없이 카드를 놓으면 화면 전체 너비(1920px)로 늘어남 → 절대 금지
- Split/비교 컨테이너는 반드시 `justify: "center"`, `align: "center"` 설정 — 좌우 대비가 화면 중앙 기준으로 나뉘어야 함
- 형제 카드 간 gap은 최대 24px — 24 초과 금지 (너무 멀리 떨어지면 안 됨)
- SceneRoot gap도 최대 28px (sparse 씬이라도 32 이상 금지)

---

## FrameBox 컨테이너 활용 규칙 (필수)

**FrameBox는 반드시 컨테이너로 사용한다.** children이 없는 leaf FrameBox는 렌더링이 안 됨.

### 중첩 카드 패턴 (card > card > card)
FrameBox는 테두리+배경이 있는 컨테이너. 내부에 다른 노드를 넣어 깊이감을 만든다.

```
FrameBox(maxWidth:600, border:accent) [
  Icon + Headline(sm) + BodyText
]
```

### 활용 예시
```
# 단일 정보 카드
FrameBox(maxWidth:520)[Icon(28) + BodyText("핵심 개념")]

# 비교 씬에서 좌/우 카드
Split [
  FrameBox(border:red)[Icon(x) + Headline(sm) + BulletList]
  | FrameBox(border:accent)[Icon(check) + Headline(sm) + BulletList]
]

# 그리드 안 카드
Grid(3col) [
  FrameBox[Icon + BodyText] × 3
]
```

### 다양성 규칙 추가
- **21씬 기준 최소 3씬에 FrameBox 컨테이너 사용** (중첩 카드 스타일)
- FrameBox를 leaf로 사용하면 안 됨 — IconCard로 대체할 것

---

## 간격(gap) 규칙 (필수)

### SceneRoot gap
- sparse (콘텐츠 높이 <400px): `gap: 20~28` (28 초과 금지)
- 보통 (400~600px): `gap: 18~24`
- 빽빽 (>600px): `gap: 12~20`

### 컨테이너 내부 gap
- Stack(row) 내 아이콘+텍스트: `gap: 12~16` (24 이상 금지)
- Stack(col) 내 아이콘+텍스트: `gap: 8~12`
- Grid 내 카드 간: `gap: 16~24` (24 초과 금지)
- Split 내부: `gap: 16~24`
- 형제 카드 간: 최대 24px — **카드가 멀리 떨어지면 안 됨**

### 절대 금지
- SceneRoot gap > 28
- 컨테이너 gap > 24
- 카드 간 gap > 24

---

## 화살표 렌더링 규칙 (필수)

**텍스트 화살표 금지.** 모든 화살표는 전용 노드를 사용:
- 수평 화살표: `ArrowConnector` (SVG path 기반)
- 수직 연결선: `LineConnector(direction=vertical)`
- 텍스트 내 화살표 필요시: 유니코드 `→` 사용 가능하나, 별도 노드 선호

---

## 키워드 중심 텍스트 원칙 (필수)

화면 텍스트는 나레이션(자막)의 **핵심 키워드만** 표시. 문장을 그대로 옮기지 않는다.

| 노드 타입 | 최대 글자수 | 형태 |
|----------|-----------|------|
| Headline | 25자 (2줄) | 키워드형 |
| BodyText | 15자 | 키워드 구 1개 |
| BulletList 항목 | 10자/항목 | 명사·키워드만 |
| IconCard body | 15자 | 한 줄 개념 |
| WarningCard body | 20자 | 한 줄 경고 |
| InsightTile | 15자 | 한 줄 인사이트 |
| FooterCaption | 20자 | 한 줄 테이크어웨이 |
| QuoteText | 25자 | 짧은 인용 |
| ProcessStepCard desc | 10자 | 키워드만 |
| RichText 전체 | 20자 | accent 세그먼트 포함 |

---

## 다양성 규칙 (필수)

### 기본 규칙
1. **연속 씬 구조 금지**: 연속 3개 씬이 같은 아키타입 금지
2. **컨테이너 다양성**: 전체에서 최소 5종 이상 아키타입 사용
3. **비텍스트 필수**: 매 씬 최소 1개 Icon/Chart/Badge/RingChart
4. **BodyText 최소화**: Badge, Pill, BulletList, IconCard로 대체
5. **style 변주**: variant, background, border 등 시각 변주
6. **차트 활용**: 49씬 기준 최소 5씬에 CompareBars/ProgressBar/RingChart/MiniBarChart
7. **Split/VS 활용**: 비교 씬에는 반드시 Split 또는 CompareCard 사용 (Stack column으로 대체 금지)
8. **수직 타임라인**: 순서 있는 과정 설명에 P(수직 타임라인) 아키타입 적극 활용
9. **새 노드 활용**: 49씬 기준 최소 3씬에 Interactive/Diagram 노드 사용 (ChatBubble, PhoneMockup, TerminalBlock, CycleDiagram, FlowDiagram, TimelineStepper, PersonAvatar)
10. **이미지 활용**: `assets.images[]`에 이미지가 있으면 ImageAsset 노드로 배치 (아래 ImageAsset 배치 규칙 참고)

### REF 라이브러리 활용 규칙 (추가)
11. **REF 복사 금지**: REF의 stack_root JSON을 그대로 복사하지 않는다. 구조적 패턴만 참조
12. **카테고리 분산**: 20씬 기준 최소 8개 다른 REF 카테고리 참조
13. **동일 REF 재사용 금지**: 같은 REF 번호를 2회 이상 직접 참조 금지
14. **변주 필수**: REF에서 기법을 차용할 때 색상/방향/비율/모션 중 최소 1가지 변경
15. **교대 패턴**: 같은 카테고리 내에서 다른 REF를 교대 사용
    - 이항 대비: REF-066(카드+Pill) ↔ REF-067(테이블) ↔ REF-069(비포/애프터)
    - 프로세스: REF-005(수평) ↔ REF-051(허브) ↔ REF-064(팬아웃) 순환
    - 히어로: REF-053(아이콘) ↔ REF-070(이미지) ↔ REF-050(SVG) 교대
16. **크로스 카테고리 조합 권장**: 서로 다른 REF에서 기법을 섞어 새로운 레이아웃 생성
    - 예: REF-067의 `[comparison-table]` + REF-068의 `[progressbar-meter]`
    - 예: REF-070의 `[circular-image]` + REF-053의 `[equation-headline]`

---

## 에셋 매칭 규칙 (manifest.json 연동)

`public/assets/manifest.json`이 존재하면, 각 씬의 자막/키워드와 에셋 태그를 자동 매칭합니다.

### 매칭 알고리즘
1. 씬의 `narration` 텍스트에서 manifest의 `tags`가 직접 포함되는지 확인 (완전 일치)
2. 씬의 `semantic.emphasis_tokens`와 `tags` 교집합 계산
3. 매칭 점수 = (일치 태그 수) / (전체 태그 수) — 0.2 이상이면 후보
4. 후보 중 가장 높은 점수의 에셋을 선택
5. **동일 에셋이 연속 3씬 이상 사용 금지** — 차순위 후보로 대체
6. 매칭 에셋이 없으면 기존 방식(Icon, IconCard 등)으로 대체

### 매칭된 에셋 배치 방법
- `type: "gif"` → ImageAsset 노드 (GIF 애니메이션 자동 재생)
- `type: "image"` → ImageAsset 노드 (정적 이미지)
- `category: "person"` → Split 좌이미지+우텍스트 패턴 권장
- `category: "concept"` → 센터 이미지+캡션 또는 Overlay 배경 권장

### ImageAsset GIF 데이터 형식
```json
{
  "type": "ImageAsset",
  "data": {
    "src": "assets/robot-thinking.gif",
    "alt": "고민하는 로봇",
    "objectFit": "contain",
    "rounded": true,
    "maxHeight": 280
  },
  "style": { "maxWidth": 400 }
}
```

---

## ImageAsset 배치 규칙

씬의 `assets.images[]`에 이미지가 있으면 ImageAsset 노드로 배치합니다.

### ImageAsset 데이터 형식
```json
{
  "type": "ImageAsset",
  "data": {
    "src": "images/rag3/vector-search.jpg",
    "alt": "벡터 검색 개념도",
    "caption": "벡터 공간에서의 유사도 검색",
    "objectFit": "contain",
    "rounded": true,
    "shadow": true,
    "maxHeight": 280
  },
  "style": { "maxWidth": 500 }
}
```

### 배치 패턴
| 패턴 | 구조 | 용도 |
|------|------|------|
| Split 좌이미지+우텍스트 | `Split([1,1.5]) [ImageAsset \| Stack(col)[Headline+BodyText]]` | 제품/개념 설명 |
| 센터 이미지+캡션 | `SceneRoot → Headline + ImageAsset(centered) + FooterCaption` | 시각 자료 중심 |
| Grid 이미지 카드 | `Grid(2col) [ImageAsset×2]` + InsightTile | 비교/대조 |

### src 경로 규칙
- **로컬 파일**: `"images/{projectId}/filename.jpg"` → Remotion `staticFile()` 자동 처리
- **외부 URL**: `"https://..."` → 직접 로드 (CORS 주의)
- **src 없음**: 자동으로 점선 플레이스홀더 표시

### 이미지가 없는 씬
`assets.images`가 비어 있거나 `source: "placeholder"`만 있으면 ImageAsset 대신 기존 노드(Icon, IconCard 등)로 대체합니다.

---

## 캐릭터 오버레이 시스템

`data/{projectId}/character.json`이 존재하면, 일부 씬에 캐릭터를 자동 배치합니다.

### character.json 형식
```json
{
  "name": "코디",
  "poses": {
    "default":   "assets/characters/cody/default.png",
    "pointing":  "assets/characters/cody/pointing.png",
    "thinking":  "assets/characters/cody/thinking.gif",
    "surprised": "assets/characters/cody/surprised.png",
    "happy":     "assets/characters/cody/happy.png",
    "explaining":"assets/characters/cody/explaining.png",
    "warning":   "assets/characters/cody/warning.png",
    "thumbsUp":  "assets/characters/cody/thumbsup.png"
  },
  "position": "bottomRight",
  "size": 200,
  "frequency": 0.3
}
```

### 등장 규칙

**frequency** — 전체 씬 중 캐릭터가 등장하는 비율 (0.2~0.4 권장)
- 0.3 = 10씬 중 3씬에 등장
- 매 씬 등장하면 피로감 → 핵심 포인트에만 배치
- **연속 2씬 등장 금지** — 반드시 1씬 이상 쉬기

**포즈 선택 기준:**
| 씬 intent/상황 | 포즈 | 말풍선 예시 |
|---------------|------|------------|
| define/explain (핵심 개념) | pointing | "이 부분이 중요해요!" |
| compare/question | thinking | "어떤 차이가 있을까요?" |
| emphasize (수치/통계) | surprised | "이렇게나 많다니!" |
| warn | warning | "주의하세요!" |
| example/positive | happy | (말풍선 없음) |
| sequence 완료/마무리 | thumbsUp | "잘 따라오셨어요!" |
| 일반 설명 | explaining | (말풍선 없음) |
| 인트로/전환 | default | (말풍선 없음) |

**말풍선은 50% 확률** — 캐릭터가 등장할 때 항상 말풍선이 있으면 부담스러움.

### 배치 구조 (stack_root 내)

캐릭터는 SceneRoot의 **마지막 자식**으로 AnchorBox에 배치:

```json
{
  "type": "AnchorBox",
  "layout": { "anchor": "bottomRight" },
  "motion": { "preset": "fadeUp", "enterAt": 40, "duration": 20 },
  "children": [
    {
      "type": "ImageAsset",
      "data": {
        "src": "assets/characters/cody/pointing.png",
        "alt": "코디 - 가리키는 포즈",
        "objectFit": "contain",
        "maxHeight": 200
      },
      "style": { "maxWidth": 180 }
    }
  ]
}
```

**말풍선 있는 경우:**
```json
{
  "type": "AnchorBox",
  "layout": { "anchor": "bottomRight" },
  "motion": { "preset": "fadeUp", "enterAt": 40, "duration": 20 },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "column", "align": "center", "gap": 8 },
      "children": [
        {
          "type": "ChatBubble",
          "data": { "speaker": "", "text": "이 부분이 중요해요!", "align": "left" },
          "style": { "maxWidth": 200, "fontSize": 16 }
        },
        {
          "type": "ImageAsset",
          "data": { "src": "assets/characters/cody/pointing.png", "objectFit": "contain", "maxHeight": 200 },
          "style": { "maxWidth": 180 }
        }
      ]
    }
  ]
}
```

### 위치 옵션
| position | 용도 |
|----------|------|
| `bottomRight` | 기본값, 대부분의 씬에서 자연스러움 |
| `bottomLeft` | Split 레이아웃에서 우측에 콘텐츠가 많을 때 |
| `right` | 세로 중앙, 텍스트 위주 씬에서 |

### enterAt 규칙
- 캐릭터는 **메인 콘텐츠보다 늦게** 등장 (enterAt = 씬 duration의 30~50%)
- 말풍선은 캐릭터보다 10프레임 뒤에 등장

---

## 주요 노드 data 형식 치트시트 (필수 — 이 형식을 반드시 따를 것)

```
IconCard:
  data: { icon: "sparkles", title: "제목", body: "설명 텍스트" }
  ⚠ body 필드 필수! title/desc가 아님

CompareCard:
  data: {
    left: { icon: "alert-triangle", title: "기존 방식", subtitle: "설명", negative: true },
    right: { icon: "check-circle", title: "새 방식", subtitle: "설명", positive: true }
  }
  ⚠ left/right 구조 필수! label/items/variant가 아님

StatCard:
  data: { value: "10x", label: "성능 향상" }

ProcessStepCard:
  data: { step: 1, title: "단계명", description: "설명" }

WarningCard:
  data: { title: "경고 제목", body: "경고 내용" }

ChatBubble:
  data: { messages: [{ sender: "사용자", text: "질문", side: "left" }, { sender: "AI", text: "답변", side: "right" }] }

TerminalBlock:
  data: { title: "Terminal", lines: ["$ npm install", "added 100 packages"] }
  ⚠ lines는 string[] 필수! {text,type} 객체 배열이 아님

PersonAvatar:
  data: { name: "이름", role: "역할", org: "조직", imageUrl?: "url" }

CycleDiagram:
  data: { steps: ["단계1", "단계2", "단계3", "단계4"], centerLabel: "중심" }

FlowDiagram:
  data: { steps: [{ label: "단계1", icon?: "code" }, { label: "단계2" }] }

TimelineStepper:
  data: { steps: [{ year: "2020", title: "이벤트", description?: "설명" }] }

CompareBars:
  data: { items: [{ label: "A", value: 80, color?: "#39FF14" }, { label: "B", value: 30 }] }

ProgressBar:
  data: { value: 75, label: "진행률", maxLabel?: "100%" }

RingChart:
  data: { value: 65, label: "비율", size?: 200 }

BulletList:
  data: { items: ["항목1", "항목2", "항목3"], variant?: "check" }

RichText:
  data: { segments: [{ text: "일반 ", type: "normal" }, { text: "강조", type: "accent" }] }

InsightTile:
  data: { index: "→", title: "인사이트 한 줄" }

Icon:
  data: { name: "sparkles", size: 80, glow?: true }

Headline:
  data: { text: "제목 텍스트", size: "lg", emphasis?: ["강조 단어"] }

BodyText:
  data: { text: "본문 텍스트" }

ScatterPlot:
  data: {
    axisX: { label: "경제학", negative: "심리학" },
    axisY: { label: "이론" },
    center: { label: "맥락", radius: 60 },
    points: [
      { label: "금리", x: 0.4, y: 0.6, group: "경제학" },
      { label: "파블로프", x: -0.7, y: -0.4, group: "심리학" }
    ],
    connections: "center"  // "center" | "chain" | "none"
  }
  용도: 2D 의미 좌표 공간, 개념 간 관계, 벡터 시각화
  maxWidth 700~900 권장

DataTable:
  data: {
    columns: [
      { title: "일반 DB", accent: "secondary" },
      { title: "벡터 DB", accent: "primary" }
    ],
    rows: [
      { left: "이름 = '홍길동'", right: "[0.82, -0.15, ...]" },
      { left: "홍길동  ✓", right: "98.2%", highlight: "right" }
    ],
    footers: ["정확한 매칭", "유사도 검색"]
  }
  용도: 다중 행 비교, 데이터 대조표, 기능 비교
  maxWidth 800~900 권장

StructuredDiagram:
  data: {
    layers: [
      { label: "원본", items: ["문단A", "문단B", "문단C"],
        dividers: [{ at: 1, label: "500자", style: "dashed" }] },
      { label: "", items: ["청크1", "청크2", "청크3"],
        style: "card", highlight: 1,
        warnings: [{ at: 0.5, text: "문장 잘림!" }] }
    ],
    arrows: [{ from: 0, to: 1 }],
    footer: "정보 손실 발생"
  }
  용도: 계층 구조 비교, 프로세스 변환, 데이터 흐름
  maxWidth 800~900 권장
```

---

## 검증 (5단계 이후)

각 생성된 stack_root에 대해:
- [ ] 모든 type이 NODE_REGISTRY 또는 CONTAINER_TYPES에 존재
- [ ] 새 노드 type이 NODE_REGISTRY에 존재 (ChatBubble, PhoneMockup, MonitorMockup, TerminalBlock, CycleDiagram, FlowDiagram, TimelineStepper, PersonAvatar, ImageAsset)
- [ ] id가 트리 내 유니크
- [ ] Headline → data.text 필수, Icon → data.name 필수 등
- [ ] enterAt ∈ [0, duration_frames]
- [ ] enterAt이 DFS 트리 순서와 일치
- [ ] **형제 노드 enterAt 최소 간격 30프레임**
- [ ] 트리 깊이 ≤ 6
- [ ] children 빈 배열 아님
- [ ] 단일 카드 maxWidth ≤ 700
- [ ] 프로세스 플로우 Stack(row) maxWidth ≤ 700
- [ ] 텍스트 글자수 제한 준수

### 6. 저장

```
Edit: data/{projectId}/scenes-v2.json  — 각 씬의 stack_root 교체
```

### 7. 후처리 파이프라인 (필수)

저장 후 반드시 순서대로 실행:

```bash
# ① 자막 타이밍에 enterAt 동기화
npx tsx scripts/sync-enterAt.ts data/{projectId}/scenes-v2.json

# ② 높이 기반 gap/maxWidth 자동 조정
npx tsx scripts/optimize-layout.ts data/{projectId}/scenes-v2.json

# ③ 콘텐츠 부족 씬에 InsightTile 자동 삽입 (≤2 콘텐츠 노드 + >15초)
node scripts/pad-sparse-scenes.js data/{projectId}/scenes-v2.json

# ④ 전체 enterAt 갭 재분배 (15%~80% 균등, 최대 갭 ~7초)
node scripts/fix-all-enterAt-gaps.js data/{projectId}/scenes-v2.json
```

### 8. render-props 동기화

```
Edit: data/{projectId}/render-props-v2.json — scenes 배열 동기
```

## 주의사항

- stack-composer.ts는 변경하지 않음 (fallback으로 유지)
- SceneRenderer.tsx는 변경하지 않음 (stack_root 있으면 자동 사용)
- NODE_REGISTRY의 27개 렌더러를 모두 활용
- 씬의 duration_frames를 반드시 확인하고 enterAt이 초과하지 않도록
- **텍스트로 화살표 표현 금지** — ArrowConnector/LineConnector 노드 사용
