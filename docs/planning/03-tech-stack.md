# 기술 스택 상세 분석

## 개요

newVideoGen은 **Claude Code 스킬 + Next.js 웹 에디터 + Remotion 렌더링**의 3층 구조로 설계되었습니다. 각 기술 선택의 이유, 장단점, 트레이드오프를 정리했습니다.

---

## 🏗️ 아키텍처 계층

```
┌─────────────────────────────────────────┐
│  Layer 1: 프론트엔드 (웹 에디터)        │
│  Next.js + React + ShadCN UI + Tailwind │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│  Layer 2: 중간 표현 (DSL)                │
│  Scene DSL (JSON)                       │
│  beats.json, scene-plan.json            │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│  Layer 3: AI 스킬 + 렌더링               │
│  Claude Code Skills + Remotion          │
│  TypeScript 구현                        │
└─────────────────────────────────────────┘
```

---

## 1. 프론트엔드: Next.js 14+ (App Router)

### 선택 이유

| 기준 | Next.js | 대안 (Vite) | 대안 (Remix) |
|------|---------|-----------|-----------|
| **SSR/SSG 지원** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ |
| **개발 경험** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **파일 기반 라우팅** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ |
| **API 라우트** | ⭐⭐⭐⭐⭐ | 별도 필요 | 통합 가능 |
| **이미지 최적화** | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| **학습 곡선** | 낮음 | 낮음 | 중간 |
| **번들 크기** | 중간 | 작음 | 중간 |

### 선택 기준

- **File-based Routing**: `app/` 디렉토리로 화면별 자동 라우팅
- **API Routes**: `/reat-chunk`, `/reat-scene` 등 스킬 호출 엔드포인트
- **Middleware**: 인증, 파일 경로 검증
- **Image Optimization**: 레이아웃 프리뷰 이미지 최적화

### 버전

```json
{
  "next": "^14.0.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

### 주요 기능

| 기능 | 사용 범위 |
|------|----------|
| **App Router** | `/`, `/preview`, `/render` |
| **API Routes** | `api/skills/*` (스킬 호출) |
| **Server Components** | 레이아웃 페칭, 파일 I/O |
| **Client Components** | Timeline, SceneCard, DSLEditor, RemotionPlayer |
| **Image Optimization** | 프리뷰 썸네일 |

---

## 2. UI 프레임워크: ShadCN UI + Tailwind CSS

### 선택 이유

#### ShadCN UI vs Material UI vs Chakra UI

| 기준 | ShadCN | Material UI | Chakra UI |
|------|--------|-----------|-----------|
| **자유도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tailwind 통합** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **다크 모드** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **번들 크기** | 작음 | 중간 | 중간 |
| **커스터마이징** | 쉬움 | 어려움 | 중간 |
| **타입스크립트** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 왜 ShadCN인가?

1. **Radix UI 기반**: 접근성(A11y) 우수
2. **Headless**: 완전 커스터마이징 가능
3. **복사 기반**: node_modules 오염 없음
4. **Tailwind 네이티브**: 스타일 커스터마이징 간편
5. **다크 모드 쉬움**: `next-themes` 통합

### 주요 컴포넌트

```
ShadCN UI Components:
├── Button
├── Card
├── Tabs
├── Dialog
├── Slider
├── Dropdown Menu
├── Select
├── Input
├── Textarea
├── ScrollArea
├── Tooltip
└── Badge
```

### Tailwind CSS 색상 팔레트

```tailwind
/* 프로젝트 기본 색상 */
dark bg-black
text-white
accent color: #00FF00 (네온 그린)

/* 커스텀 토큰 */
@apply bg-gradient-to-r from-gray-900 to-black
```

---

## 3. 비디오 렌더링: Remotion 4+

### 선택 이유

#### Remotion vs FFmpeg vs Adobe XD API

| 기준 | Remotion | FFmpeg | WebGL |
|------|----------|--------|-------|
| **React 통합** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ |
| **선언적 문법** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ |
| **개발 속도** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **성능** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **학습 곡선** | 낮음 | 가파름 | 가파름 |
| **프리뷰** | ⭐⭐⭐⭐⭐ | 없음 | 있음 |
| **비용** | 무료 | 무료 | 무료 |

### 왜 Remotion인가?

1. **React 컴포넌트로 영상 정의**: `<Composition>`
2. **실시간 프리뷰**: Player API
3. **타입 안전**: TypeScript 네이티브
4. **자동 프레임 렌더링**: `useFrame()` hook
5. **서버 렌더링 가능**: Node.js 환경에서 mp4 생성

### 주요 API

```typescript
// 컴포지션 정의
<Composition
  id="Scene-1"
  component={SceneComponent}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>

// 프레임별 애니메이션
const { frame } = useVideoConfig();
const opacity = interpolate(frame, [0, 30], [0, 1]);

// 플레이어 통합
<Player
  component={SceneComponent}
  durationInFrames={150}
  fps={30}
/>
```

### 버전

```json
{
  "remotion": "^4.0.0"
}
```

---

## 4. 중간 표현 (DSL): JSON Schema

### Scene DSL 예시

```json
{
  "id": "scene-001",
  "layoutFamily": "hero-center",
  "durationFrames": 120,
  "fps": 30,
  "components": [
    {
      "id": "kicker",
      "type": "Kicker",
      "content": "주요 포인트",
      "position": { "x": "center", "y": "20%" },
      "animation": {
        "type": "fadeUp",
        "durationFrames": 30,
        "delayFrames": 0,
        "easing": "easeInOutQuad"
      }
    },
    {
      "id": "headline",
      "type": "Headline",
      "content": "AI가 만드는 영상의 미래",
      "fontSize": 64,
      "position": { "x": "center", "y": "50%" },
      "animation": {
        "type": "popNumber",
        "durationFrames": 40,
        "delayFrames": 30,
        "easing": "easeOutBounce"
      }
    },
    {
      "id": "supporting",
      "type": "SupportingText",
      "content": "Scene DSL로 선언적으로 정의된 비디오 구조",
      "position": { "x": "center", "y": "70%" },
      "animation": {
        "type": "fadeUp",
        "durationFrames": 30,
        "delayFrames": 60,
        "easing": "easeInOutQuad"
      }
    }
  ],
  "audioAlignment": {
    "beatIndex": 2,
    "beatStartFrame": 0,
    "beatEndFrame": 120
  }
}
```

### beats.json 예시

```json
{
  "filename": "example.srt",
  "beats": [
    {
      "beatIndex": 0,
      "timeStart": "00:00:00,000",
      "timeEnd": "00:00:05,000",
      "text": "AI가 콘텐츠를 변화시키고 있습니다",
      "intent": "assertion",
      "tone": "emphasis",
      "evidenceType": "statistic",
      "emphasisTokens": ["AI", "변화"],
      "density": "high",
      "beatCount": 2
    },
    {
      "beatIndex": 1,
      "timeStart": "00:00:05,000",
      "timeEnd": "00:00:10,000",
      "text": "세 가지 주요 트렌드를 살펴보겠습니다",
      "intent": "process",
      "tone": "neutral",
      "evidenceType": "process",
      "emphasisTokens": ["세 가지", "트렌드"],
      "density": "medium",
      "beatCount": 1
    }
  ]
}
```

### scene-plan.json 예시

```json
{
  "projectId": "video-001",
  "filename": "example.srt",
  "totalDuration": "00:10:30",
  "scenes": [
    {
      "beatIndex": 0,
      "selectedLayoutFamily": "hero-center",
      "scoreBreakdown": {
        "semanticFit": 38,
        "evidenceTypeFit": 18,
        "rhythmFit": 14,
        "assetOwnership": 10,
        "recentRepetitionPenalty": -24,
        "previousSimilarityPenalty": -20
      },
      "finalScore": 56,
      "dslFile": "scene-001.json"
    }
  ]
}
```

---

## 5. Claude Code 스킬 시스템

### 5개 핵심 스킬

#### 5.1 `/reat-analyze` (기반, 1회성)

**목적**: 레퍼런스 영상 이미지 분석 → 디자인 토큰 추출

**입력**:
```
reference/
├── layout-1.png (hero-center)
├── layout-2.png (split-2col)
├── ...
└── layout-8.png (spotlight-case)
```

**출력**:
```json
{
  "design-tokens.json": {
    "colors": { "primary": "#00FF00", "background": "#000000" },
    "typography": { "headlineFont": "Inter", "headlineSize": 64 },
    "spacing": { "gutter": 16, "sectionPadding": 48 }
  },
  "layout-exemplars.json": {
    "layouts": [
      {
        "id": "hero-center",
        "characteristicElements": ["large headline", "centered layout"],
        "useCases": ["assertion", "statistic"]
      }
    ]
  }
}
```

#### 5.2 `/reat-catalog` (기반, 1회성)

**목적**: 레이아웃 카탈로그 + Scene DSL 스키마 생성

**입력**:
- `layout-exemplars.json`

**출력**:
```
catalog.json:
{
  "layoutFamilies": [
    {
      "id": "hero-center",
      "name": "대형 숫자/텍스트 중앙 배치",
      "components": ["Kicker", "Headline", "SupportingText"],
      "motionPresets": ["fadeUp", "popNumber"],
      "recommendedFor": ["assertion", "statistic"],
      "thumbnailDims": { "width": 1920, "height": 1080 }
    },
    ...
  ],
  "sceneDslSchema": { ... },
  "motionPresets": { ... }
}
```

#### 5.3 `/reat-chunk` (영상별)

**목적**: SRT 자막 → 의미 청킹 + beats.json 생성

**입력**:
```
input.srt
```

**출력**:
```json
beats.json
```

**구현**: Claude API (문맥 분석 + intent/tone/evidenceType/density 추출)

#### 5.4 `/reat-scene` (영상별)

**목적**: beats.json + 카탈로그 → 장면 선택 + Scene DSL 생성

**입력**:
- `beats.json`
- `catalog.json`
- `design-tokens.json`

**출력**:
```
scene-plan.json (전체 계획)
scene-001.json  (Scene DSL)
scene-002.json
...
```

**구현**: 제약 기반 변주 시스템
```
최종 점수 = 의미적합도(40)
          + 증거타입적합도(20)
          + 리듬적합도(15)
          + 자산보유(10)
          - 최근중복패널티(25)
          - 직전유사도(20)
```

#### 5.5 `/reat-render` (영상별)

**목적**: Scene DSL → Remotion TSX → mp4 렌더링

**입력**:
- `scene-*.json` (편집된 DSL)
- `audio.mp3`

**출력**:
```
output.mp4
```

**구현**:
1. Scene DSL 파싱
2. Remotion TSX 컴포넌트 생성
3. 스택 레이아웃 엔진 (좌표 계산)
4. Remotion 렌더러로 mp4 생성

---

## 6. 개발 언어: TypeScript

### 선택 이유

| 기준 | TypeScript | JavaScript |
|------|-----------|-----------|
| **타입 안전성** | ⭐⭐⭐⭐⭐ | ❌ |
| **IDE 지원** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **리팩토링** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **런타임 에러** | 적음 | 많음 |
| **학습 곡선** | 중간 | 낮음 |

### 컴파일 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@motions/*": ["src/motions/*"],
      "@dsl/*": ["src/dsl/*"]
    }
  }
}
```

---

## 7. 패키지 관리: pnpm

### 선택 이유

| 기준 | pnpm | npm | yarn |
|------|------|-----|------|
| **속도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **디스크 사용** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **monorepo** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **워크스페이스** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 주요 의존성

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "shadcn-ui": "latest",
    "tailwindcss": "^3.4.0",
    "remotion": "^4.0.0",
    "next-themes": "^0.3.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## 8. 상태 관리: Zustand

### 선택 이유

| 기준 | Zustand | Redux | Context API |
|------|---------|-------|-------------|
| **번들 크기** | ⭐⭐⭐⭐⭐ | ⭐⭐ | N/A |
| **학습 곡선** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **성능** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **DevTools** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |

### 사용 예시

```typescript
import { create } from 'zustand';

interface ProjectStore {
  scenes: SceneType[];
  selectedSceneId: string | null;
  setScenes: (scenes: SceneType[]) => void;
  selectScene: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  scenes: [],
  selectedSceneId: null,
  setScenes: (scenes) => set({ scenes }),
  selectScene: (id) => set({ selectedSceneId: id }),
}));
```

---

## 9. 폼/검증: Zod + React Hook Form

### 선택 이유

- **Zod**: TypeScript-first 스키마 검증
- **React Hook Form**: 최소한의 리렌더링, 성능 우수

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const sceneSchema = z.object({
  id: z.string(),
  layoutFamily: z.enum([
    'hero-center',
    'split-2col',
    'grid-4x3',
    'process-horizontal',
    'radial-focus',
    'stacked-vertical',
    'comparison-bars',
    'spotlight-case',
  ]),
  durationFrames: z.number().positive(),
});

type Scene = z.infer<typeof sceneSchema>;

const { register, handleSubmit } = useForm<Scene>({
  resolver: zodResolver(sceneSchema),
});
```

---

## 10. 테스트: Vitest + React Testing Library

### 선택 이유

| 기준 | Vitest | Jest |
|------|--------|------|
| **속도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Vite 통합** | ⭐⭐⭐⭐⭐ | ❌ |
| **설정** | 간단 | 복잡 |
| **ESM 지원** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 11. 기타 개발 도구

| 도구 | 목적 | 버전 |
|------|------|------|
| **Prettier** | 코드 포매팅 | ^3.1.0 |
| **ESLint** | 린트 | ^8.55.0 |
| **Git Hooks** | husky + lint-staged | 최신 |
| **Docker** | 배포/개발 환경 | 필요시 |

---

## 12. 환경 변수 (.env.local)

```env
# 프로젝트 설정
NEXT_PUBLIC_PROJECT_NAME=newVideoGen
NEXT_PUBLIC_PROJECT_VERSION=0.1.0

# Claude API
CLAUDE_API_KEY=sk-...

# 파일 경로
PROJECT_ROOT=/Users/futurewave/Documents/dev/newVideoGen
MEDIA_OUTPUT_PATH=./output/

# Remotion 설정
REMOTION_OUTPUT_MP4_PATH=./output/videos/
REMOTION_FPS=30
REMOTION_WIDTH=1920
REMOTION_HEIGHT=1080

# 개발 설정
NODE_ENV=development
DEBUG=newVideoGen:*
```

---

## 13. 성능 최적화 전략

### 번들 최적화

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['shadcn-ui'],
  },
};
```

### 렌더링 성능

- Server Components로 API 호출 (client waterfall 방지)
- Suspense 경계 설정 (점진적 로딩)
- Image lazy loading
- Code splitting (동적 import)

---

## 참조

- 아키텍처: `04-architecture.md`
- API 명세: `05-api-spec.md`
- 화면 설계: `06-screens.md`
- 코딩 컨벤션: `07-coding-convention.md`
