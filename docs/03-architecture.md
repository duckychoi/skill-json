# newVideoGen 아키텍처

> 프로젝트의 기술 스택, 시스템 구조, 핵심 설계 결정, 개발 과정을 기술합니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 영상 렌더링 | Remotion 4 (React → mp4) |
| 프레임워크 | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, Radix UI |
| 상태 관리 | Zustand 5 |
| 데이터 저장 | 파일 시스템 (`data/{projectId}/*.json`) |
| 타입 | TypeScript (strict mode) |
| AI 대본 생성 | Claude Code Skills (`/reat-script`) |
| AI 레이아웃 | Claude Code Skills (`/reat-layout`) |
| TTS 음성 | ElevenLabs API (multilingual_v2, 음성 클론 지원) |
| GIF 렌더링 | @remotion/gif (프레임 동기화 GIF 애니메이션) |
| 에셋 매칭 | manifest.json 태그 기반 자동 매칭 (`/reat-assets`) |
| 캐릭터 시스템 | character.json 기반 포즈 자동 선택 + SceneShell 오버레이 |
| 데이터 시각화 | ScatterPlot, DataTable, StructuredDiagram (30개 leaf 노드) |
| 테스트 | Vitest, Playwright |
| 런타임 | Node.js, zsh (macOS) |

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App (3001)                     │
│  ┌──────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │ 대시보드   │  │ 청크 에디터   │  │  씬 에디터          │  │
│  │ /         │  │ /chunk      │  │  /scene-editor     │  │
│  └────┬─────┘  └──────┬──────┘  └─────────┬──────────┘  │
│       │               │                    │              │
│  ┌────▼───────────────▼────────────────────▼──────────┐  │
│  │              API Routes (/api/*)                     │  │
│  │  projects · scenes · scenes-v2 · render · srt       │  │
│  │  skills/chunk · skills/scene · skills/render        │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                   │
│  ┌────────────────────▼───────────────────────────────┐  │
│  │           File Service (src/services/)              │  │
│  │  readJSON · writeJSON · listDirs · getProjectPath   │  │
│  └────────────────────┬───────────────────────────────┘  │
└───────────────────────│──────────────────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │    data/{projectId}/        │
          │  project.json               │
          │  beats.json                 │
          │  chunks.json                │
          │  scenes-v2.json             │
          │  render-props-v2.json       │
          └─────────────┬──────────────┘
                        │
┌───────────────────────│──────────────────────────────────┐
│                       ▼                                   │
│              Remotion Render Engine                        │
│  ┌─────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Root.tsx │→ │Composition.tsx│→ │ SceneRenderer.tsx │    │
│  └─────────┘  └──────────────┘  └────────┬─────────┘    │
│                                          │               │
│               ┌──────────────────────────▼────────┐      │
│               │         SceneShell.tsx             │      │
│               │  ┌────────────────────────────┐   │      │
│               │  │    StackRenderer.tsx        │   │      │
│               │  │  (재귀 노드 트리 렌더링)      │   │      │
│               │  └────────────────────────────┘   │      │
│               │  ┌────────────────────────────┐   │      │
│               │  │    SubtitleBar.tsx          │   │      │
│               │  │  (하단 자막 오버레이)         │   │      │
│               │  └────────────────────────────┘   │      │
│               └───────────────────────────────────┘      │
│                                                           │
│               output/{projectId}.mp4                      │
└───────────────────────────────────────────────────────────┘
```

---

## 핵심 설계 결정

### 1. StackNode 재귀 트리

모든 씬의 레이아웃은 **StackNode 트리** 하나로 표현됩니다.

```
SceneRoot (flex column, center)
  ├── Kicker
  ├── Headline
  ├── Grid (columns: 3)
  │   ├── IconCard
  │   ├── IconCard
  │   └── IconCard
  └── BodyText
```

**왜 이 구조인가?**
- 렌더러가 단 하나 (`StackRenderer.tsx`): 새 레이아웃 추가 시 코드 변경 불필요
- 노드 타입만 추가하면 자유롭게 조합 가능
- JSON으로 표현되므로 AI(Claude)가 직접 생성 가능
- 컨테이너 9종 × leaf 27종 = 무한 조합

### 2. 파일 시스템 기반 데이터

데이터베이스 없이 `data/{projectId}/*.json`으로 모든 데이터를 관리합니다.

**장점:**
- 설정 불필요, 즉시 시작
- JSON 파일 직접 편집 가능
- Git으로 버전 관리 가능
- 스크립트에서 바로 읽기/쓰기

### 3. AI 레이아웃 생성 (Claude Skills)

레이아웃을 코드나 템플릿으로 생성하지 않고, Claude가 씬 내용을 이해하고 직접 JSON 트리를 작성합니다.

**2단계 매칭 알고리즘:**
1. 씬의 intent/tone/density → 20개 아키타입(A~Z) 중 최적 선택
2. 아키타입 → REF 70종 레퍼런스 라이브러리에서 구체적 기법 참조
3. 노드 조합 + 모션 + 스타일 → stack_root JSON 출력

### 4. 에셋 매칭 시스템

`public/assets/`에 이미지/GIF를 넣고 `/reat-assets`를 실행하면, Claude가 각 파일을 직접 보고 태그를 생성합니다. 이 태그는 `manifest.json`에 저장되며, `/reat-layout` 시 씬 내용과 자동 매칭됩니다.

**매칭 알고리즘:**
1. 씬 `narration` 텍스트에서 manifest `tags` 직접 포함 여부 확인
2. `semantic.emphasis_tokens`와 `tags` 교집합 계산
3. 매칭 점수 = (일치 태그 수) / (전체 태그 수) — 0.2 이상이면 후보
4. 동일 에셋 연속 3씬 사용 금지
5. 매칭 에셋 없으면 기존 방식(Icon, IconCard)으로 대체

**지원 형식:**
- **GIF**: `@remotion/gif`로 프레임 동기화 애니메이션 재생
- **PNG/JPG/WEBP**: 정적 `<img>` 태그 렌더링
- **외부 URL**: `https://...` 직접 로드 가능

**왜 이 구조인가?**
- Unsplash API로는 특정 인물/도서/제품 이미지를 가져올 수 없음
- 수동으로 준비한 에셋을 태그 기반으로 자동 배치하는 하이브리드 방식
- Claude가 이미지를 직접 보고 태깅하므로 파일명에 의존하지 않음

### 5. 후처리 파이프라인

AI 생성물의 품질을 프로그래밍적으로 보정하는 4단계 파이프라인:

| 단계 | 스크립트 | 역할 |
|------|---------|------|
| ① | `sync-enterAt.ts` | 자막 키워드 ↔ 노드 텍스트 매칭으로 등장 타이밍 정밀 조정 |
| ② | `optimize-layout.ts` | 콘텐츠 높이 추정 → gap/maxWidth 자동 조정 |
| ③ | `pad-sparse-scenes.js` | 빈 화면 방지 (콘텐츠 ≤2 + 15초 이상 씬에 InsightTile 삽입) |
| ④ | `fix-all-enterAt-gaps.js` | 5초 이상 공백 재분배 + 컨테이너 enterAt 동기화 |

### 6. 테마와 팔레트 순환

다크 테마 기반으로 3개 팔레트가 씬마다 순환합니다.

```typescript
// theme.ts
SCENE_PALETTES = [
  { name: "Electric Violet", accent: "#9945FF" },   // 씬 0, 3, 6, ...
  { name: "Neon Fuchsia",    accent: "#E040FB" },   // 씬 1, 4, 7, ...
  { name: "Cyber Indigo",    accent: "#7C4DFF" },   // 씬 2, 5, 8, ...
];
```

배경: `#000000` / 텍스트: `#FFFFFF` / 보조: `rgba(255,255,255,0.6)`

---

## 노드 시스템 상세

### 컨테이너 노드 (9종)

| 타입 | CSS 전략 | 특이사항 |
|------|---------|---------|
| `SceneRoot` | flex column, center | padding `60px 120px 140px`, `width: 100%` 필수 |
| `Stack` | flex, direction/align/justify/gap | `width: 100%` 필수 |
| `Grid` | CSS Grid, `repeat(N, 1fr)` | columns 속성 |
| `Split` | flex row, ratio → `flex: N 1 0%` | justify/align center 강제 |
| `Overlay` | relative, 첫 자식 absolute 배경 | 나머지 자식은 relative |
| `AnchorBox` | absolute, 9방향 앵커 | topLeft~bottomRight |
| `SafeArea` | padding 80/120/120/120 | 안전 영역 확보 |
| `FrameBox` | border + padding 래퍼 | leaf/container 이중 역할 |
| `ScatterLayout` | 절대 좌표 배치 | 자유 배치용 |

### Leaf 노드 (27종)

**텍스트 (8):** Kicker, Headline, RichText, BodyText, BulletList, StatNumber, QuoteText, FooterCaption

**도형 (4):** Divider, Badge, Pill, FrameBox

**미디어 (3):** Icon, RingChart, ImageAsset (PNG/JPG/GIF 지원, `@remotion/gif` 연동)

**차트 (3):** ProgressBar, CompareBars, MiniBarChart

**복합 카드 (6):** IconCard, StatCard, CompareCard, ProcessStepCard, InsightTile, WarningCard

**커넥터 (2):** ArrowConnector, LineConnector

**악센트 (3):** AccentGlow, AccentRing, Backplate

**인터랙티브 (4):** ChatBubble, PhoneMockup, MonitorMockup, TerminalBlock

**다이어그램 (4):** CycleDiagram, FlowDiagram, TimelineStepper, PersonAvatar

**유틸리티 (1):** Spacer

### 모션 프리셋 (14종)

| 프리셋 | 효과 |
|--------|------|
| `fadeUp` | 아래→위 페이드 인 |
| `fadeIn` | 단순 페이드 인 |
| `popNumber` | 숫자 팝업 |
| `popBadge` | 뱃지 팝업 |
| `staggerChildren` | 자식 순차 등장 |
| `drawConnector` | 선 그리기 |
| `wipeBar` | 바 와이프 |
| `slideSplit` | 분할 슬라이드 |
| `slideRight` | 오른쪽 슬라이드 |
| `revealMask` | 마스크 공개 |
| `countUp` | 숫자 카운트업 |
| `pulseAccent` | 펄스 악센트 |
| `scaleIn` | 스케일 인 |
| `blurIn` | 블러 인 |

---

## 디렉토리 구조 상세

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 프로젝트 대시보드
│   ├── chunk/page.tsx            # 청크 에디터
│   ├── scene-editor/page.tsx     # 씬 에디터
│   └── api/                      # API Routes (파일 시스템 CRUD)
│       ├── projects/             # 프로젝트 CRUD
│       ├── srt/                  # SRT 파싱, 청크 저장
│       ├── skills/               # chunk/scene/render/analyze/catalog
│       └── layout-families/      # 레이아웃 패밀리 목록
│
├── remotion/                     # Remotion 영상 렌더링
│   ├── index.ts                  # registerRoot 진입점
│   ├── Root.tsx                  # Composition 등록
│   ├── Composition.tsx           # Series + Audio + Scene 조립
│   ├── common/                   # 공통 모듈
│   │   ├── StackRenderer.tsx     # 재귀 노드 렌더러 (핵심)
│   │   ├── SceneRenderer.tsx     # 씬 라우터 (v2 → StackRenderer)
│   │   ├── SceneShell.tsx        # 씬 프레임 (배경 + 자막)
│   │   ├── SubtitleBar.tsx       # 하단 자막 오버레이
│   │   ├── theme.ts              # 테마 + 팔레트 순환
│   │   ├── SvgIcons.tsx          # 50+ SVG 아이콘 라이브러리
│   │   └── motions.ts            # 14종 모션 프리셋
│   ├── nodes/                    # 개별 노드 컴포넌트
│   │   ├── registry.ts           # NODE_REGISTRY (27개 leaf)
│   │   └── *.tsx                 # 각 노드 구현
│   └── layouts/                  # 레거시 레이아웃 (v1)
│
├── services/                     # 비즈니스 로직
│
├── public/
│   ├── assets/                   # 이미지/GIF 에셋 라이브러리
│   │   ├── manifest.json         # 에셋 태그/카테고리 (자동 생성)
│   │   ├── persons/              # 인물 사진
│   │   ├── tech/                 # 기술 관련
│   │   └── concept/              # 추상 개념
│   └── {이름}.mp3                 # Remotion staticFile용 오디오
│   └── file-service.ts           # 파일 시스템 CRUD
│
├── stores/                       # Zustand 스토어
│
├── components/                   # 공통 UI 컴포넌트
│
├── types/                        # TypeScript 타입
│   ├── index.ts                  # Project, Scene, CopyLayers 등
│   └── stack-nodes.ts            # StackNode, LayoutProps, StyleProps 등
│
└── data/
    └── layout-families.ts        # 11개 레이아웃 패밀리 정의
```

---

## 개발 과정 (Evolution)

### Phase 1: 레거시 레이아웃 시스템

초기에는 11개 고정 `layout_family`를 사용했습니다.

```
hero-center, split-left, split-right, triple-column,
process-steps, comparison, quote-highlight, stat-focus,
icon-grid, timeline, checklist
```

각 패밀리마다 전용 React 컴포넌트(`src/remotion/layouts/`)가 있었고, 새 디자인 추가 시 컴포넌트를 매번 만들어야 했습니다.

### Phase 2: StackNode 트리 도입

레거시 패밀리의 한계를 극복하기 위해 **StackNode 재귀 트리**를 도입했습니다.

- 하나의 `StackRenderer`가 모든 레이아웃을 렌더링
- 노드 타입만 등록하면 무한 조합 가능
- `SceneRenderer`에서 `stack_root` 존재 여부로 v1/v2 분기

### Phase 3: Claude Skills + REF 라이브러리

AI(Claude)가 직접 `stack_root` JSON을 생성하도록 스킬 시스템을 구축했습니다.

- 20개 아키타입(A~Z)으로 씬 의미를 레이아웃에 매핑
- 70종 REF 레퍼런스 라이브러리로 구체적 디자인 패턴 제공
- 4단계 후처리 파이프라인으로 AI 결과물 품질 보정

### Phase 4: 노드 확장 + 품질 개선

실제 프로젝트(rag3, value-labor) 제작 과정에서 발견된 문제를 해결하며 시스템을 개선했습니다.

- **노드 확장**: 초기 15개 → 현재 27개 leaf + 9개 container
- **아이콘 확장**: 50+ SVG 인라인 아이콘
- **자막 타이밍 수정**: 상대/절대 타이밍 자동 감지
- **data 형식 치트시트**: 빈 카드 문제 방지를 위한 스킬 내 정확한 형식 명시
- **후처리 고도화**: sync-enterAt v4 (키워드 매칭), fix-all-enterAt-gaps v6 (√t 가중 배분)

### Phase 5: 에셋 시스템 + GIF 지원

Unsplash로 해결할 수 없는 특정 인물/제품/커스텀 이미지를 위한 에셋 시스템을 도입했습니다.

- **`@remotion/gif` 통합**: GIF 애니메이션을 프레임 동기화로 렌더링
- **`/reat-assets` 스킬**: Claude가 이미지를 직접 보고 태그/카테고리/설명 자동 생성
- **manifest.json 기반 매칭**: 씬 자막 키워드 ↔ 에셋 태그 자동 매칭
- **하이브리드 접근**: 수동 준비 에셋 + AI 자동 태깅 + AI 자동 배치

### Phase 6: 캐릭터 시스템 + 데이터 시각화 노드

교육 영상에 캐릭터가 양념처럼 등장하는 시스템과 고급 시각화 노드를 추가했습니다.

- **캐릭터 오버레이**: `character.json`으로 프로젝트별 캐릭터 정의 (8~9포즈)
- **SceneShell 통합**: 콘텐츠 밖 화면 가장자리에 절대 좌표 배치
- **포즈 자동 선택**: 씬의 intent에 따라 pointing/thinking/surprised 등 자동 선택
- **3개 데이터 시각화 노드**: ScatterPlot(2D 좌표 공간), DataTable(다중 행 비교), StructuredDiagram(계층 구조)
- **`/reat-slides` 스킬**: 목차만으로 슬라이드 영상 생성 (SRT/MP3 불필요)

### Phase 7: End-to-End 자동화 (대본 → 음성 → 영상)

SRT/MP3 없이 주제 텍스트만으로 전체 영상을 자동 생성하는 파이프라인을 구축했습니다.

- **`/reat-script` 스킬**: Claude가 주제 분석 → 챕터 구조 설계 → 구어체 대본 작성
- **`/reat-voice` 스킬**: ElevenLabs TTS API로 MP3 + SRT 자동 생성
- **음성 클론**: 본인 목소리 mp3 샘플로 ElevenLabs 음성 복제
- **타임스탬프**: 글자별 타임스탬프 → 문장 단위 SRT 자동 변환
- **전체 흐름**: `/reat-script` → `/reat-voice` → `/reat-new` → `/reat-layout` → `/reat-render`

---

## CSS 핵심 규칙

프로젝트 전체에 걸쳐 지켜야 하는 CSS 규칙들입니다.

| 규칙 | 이유 |
|------|------|
| SceneRoot: `alignItems: "center"` | `stretch`하면 inline-block 요소가 깨짐 |
| 컨테이너: `width: "100%"` | 없으면 콘텐츠 크기로 축소됨 |
| 단일 카드: `maxWidth ≤ 520px` | 화면 가득 차면 레이아웃이 어색해짐 |
| SubtitleBar: `zIndex: 10` | 콘텐츠 위에 자막이 표시되어야 함 |
| SceneRoot gap: `max 28` | 과도한 간격 방지 |

---

## 프로젝트 목록

| ID | 이름 | 상태 |
|----|------|------|
| `proj-1` | 초기 테스트 프로젝트 | rendered |
| `rag-intro` | RAG 소개 | rendered |
| `rag3` | RAG 심화 | rendered |
| `value-labor` | 가치 노동 — AI 시대의 생존 전략 | rendered (캐릭터 포함) |
| `project-intro` | newVideoGen 프로젝트 소개 슬라이드 | rendered (/reat-slides) |
| `ai-coding-future` | AI와 코딩의 미래 | 제작 중 (E2E 자동화) |
