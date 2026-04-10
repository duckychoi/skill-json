# 코딩 컨벤션 (Coding Standards)

## 개요

newVideoGen 프로젝트의 일관성 있는 코드 품질을 위한 TypeScript, React, 파일 구조 컨벤션을 정의합니다.

---

## 📝 TypeScript 코딩 스타일

### 1. 파일 헤더 주석

모든 파일 최상단에 다음 형식의 주석 작성:

```typescript
/**
 * @file 파일 목적을 한 줄로 설명
 * @description 상세 설명 (필요시)
 * @module src/components/Timeline
 * @requires react, zustand
 * @author Claude
 * @created 2026-03-10
 */
```

### 2. 변수 선언

```typescript
// ✅ Good: const 우선
const userName = "John";
const userId: number = 123;

// ✅ Good: 명확한 타입 어노테이션
const items: string[] = [];
const config: Record<string, unknown> = {};

// ❌ Bad: var 사용
var userName = "John";

// ❌ Bad: any 사용
const config: any = {};
```

### 3. 함수 선언

#### 기본 규칙

```typescript
// ✅ Good: 명시적 반환 타입
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: 화살표 함수 (콜백 또는 핸들러)
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  console.log("clicked");
};

// ✅ Good: 제네릭 타입
function getItemById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

// ❌ Bad: 반환 타입 미지정
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### JSDoc 주석

```typescript
/**
 * 두 수를 더합니다
 *
 * @param a 첫 번째 수
 * @param b 두 번째 수
 * @returns 합계
 *
 * @example
 * const result = add(2, 3); // 5
 */
function add(a: number, b: number): number {
  return a + b;
}
```

### 4. 인터페이스 & 타입

```typescript
// ✅ Good: 명확한 네이밍 (Props 접미사)
interface TimelineProps {
  scenes: SceneType[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}

// ✅ Good: 선택적 필드는 ? 사용
interface Config {
  name: string;
  description?: string;
  isActive?: boolean;
}

// ✅ Good: 유니온 타입
type LayoutFamily =
  | "hero-center"
  | "split-2col"
  | "grid-4x3"
  | "process-horizontal"
  | "radial-focus"
  | "stacked-vertical"
  | "comparison-bars"
  | "spotlight-case";

// ✅ Good: readonly 사용 (불변성)
interface Beat {
  readonly beatIndex: number;
  readonly timeStart: string;
  text: string;
}

// ❌ Bad: any 사용
interface TimelineProps {
  scenes: any[];
}
```

### 5. 열거형 (Enums)

```typescript
// ✅ Good: 문자열 enum (더 명확)
enum Intent {
  Assertion = "assertion",
  Comparison = "comparison",
  CaseStudy = "case-study",
  Warning = "warning",
  Process = "process",
  Summary = "summary",
}

// ✅ Good: const enum (성능)
const enum Density {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// ❌ Bad: 숫자 enum (보기 어려움)
enum Intent {
  Assertion = 0,
  Comparison = 1,
}
```

### 6. 에러 처리

```typescript
// ✅ Good: try-catch 사용
async function fetchData(url: string): Promise<Data> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetch failed:", error.message);
    }
    throw error;
  }
}

// ✅ Good: 커스텀 에러 클래스
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ❌ Bad: 무시
try {
  await fetchData(url);
} catch (error) {
  // 무시
}
```

### 7. 비동기 처리

```typescript
// ✅ Good: async/await
async function loadScene(sceneId: string): Promise<Scene> {
  try {
    const response = await fetch(`/api/scenes/${sceneId}`);
    const data = await response.json();
    return data as Scene;
  } catch (error) {
    console.error("Failed to load scene:", error);
    throw error;
  }
}

// ✅ Good: Promise.all (병렬 처리)
const [scenes, beats] = await Promise.all([
  fetchScenes(),
  fetchBeats(),
]);

// ❌ Bad: 콜백 지옥
fetchData(url, (err, data) => {
  if (!err) {
    processData(data, (err2, result) => {
      // ...
    });
  }
});
```

---

## ⚛️ React 컴포넌트 스타일

### 1. 함수형 컴포넌트 (반드시 사용)

```typescript
// ✅ Good: 함수형 컴포넌트
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

### 2. Props 정의

```typescript
// ✅ Good: Props 인터페이스로 분리
interface TimelineProps {
  scenes: SceneType[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onSplitScene?: (beatIndex: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  scenes,
  selectedSceneId,
  onSelectScene,
  onSplitScene,
}) => {
  // ...
};

// ❌ Bad: Props를 인라인 정의
export const Timeline: React.FC<{
  scenes: any[];
  onSelect: any;
}> = ({ scenes, onSelect }) => {
  // ...
};
```

### 3. 이벤트 핸들러

```typescript
// ✅ Good: 명시적 이벤트 타입
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  // ...
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const value = e.currentTarget.value;
  // ...
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  // ...
};

// ❌ Bad: 이벤트 타입 미지정
const handleClick = (e) => {
  e.preventDefault();
};
```

### 4. Hooks 사용

```typescript
// ✅ Good: useState + 명시적 타입
const [count, setCount] = React.useState<number>(0);

const [scenes, setScenes] = React.useState<SceneType[]>([]);

// ✅ Good: useCallback 사용 (최적화)
const handleSelectScene = React.useCallback(
  (id: string) => {
    setSelectedSceneId(id);
  },
  []
);

// ✅ Good: useEffect 의존성 명시
React.useEffect(() => {
  loadScenes();
}, [projectId]); // projectId 변경시만 실행

// ❌ Bad: 의존성 배열 생략
React.useEffect(() => {
  loadScenes();
}); // 매번 실행 (무한 루프 위험)
```

### 5. 조건부 렌더링

```typescript
// ✅ Good: 명확한 조건부 렌더링
return (
  <div>
    {isLoading ? (
      <LoadingSpinner />
    ) : isError ? (
      <ErrorMessage error={error} />
    ) : (
      <Content data={data} />
    )}
  </div>
);

// ✅ Good: && 연산자 (요소 표시/숨김)
return (
  <div>
    {isSaved && <SuccessMessage />}
  </div>
);

// ❌ Bad: 논리 오류
return (
  <div>
    {isLoading && <LoadingSpinner />}
    {isLoading && <Content />} {/* 로딩 중일 때도 표시됨 */}
  </div>
);
```

---

## 📁 파일 & 폴더 네이밍

### 1. 폴더 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                 # S1: 타임라인 에디터
│   ├── preview/
│   │   └── page.tsx             # S2: 프리뷰
│   ├── render/
│   │   └── page.tsx             # S3: 렌더 출력
│   └── api/
│       ├── skills/
│       │   ├── chunk/route.ts
│       │   ├── scene/route.ts
│       │   └── render/route.ts
│       └── projects/route.ts
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                      # ShadCN UI (복사본)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── typography/              # 타이포그래피 컴포넌트
│   │   ├── Kicker.tsx
│   │   ├── Headline.tsx
│   │   ├── SupportingText.tsx
│   │   └── ...
│   ├── charts/                  # 차트 컴포넌트
│   │   ├── BarCompare.tsx
│   │   ├── RingChart.tsx
│   │   └── ...
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── HeroCenter.tsx
│   │   ├── SplitCompare.tsx
│   │   └── ...
│   ├── Timeline.tsx             # 페이지 레벨 컴포넌트
│   ├── SceneCard.tsx
│   ├── DSLEditor.tsx
│   ├── RemotionPlayer.tsx
│   ├── RenderProgress.tsx
│   └── ...
│
├── dsl/                         # DSL 스키마 & 검증
│   ├── scene.schema.ts
│   ├── beat.schema.ts
│   └── catalog.schema.ts
│
├── hooks/                       # React 커스텀 훅
│   ├── useProject.ts
│   ├── useScenes.ts
│   └── useAudioSync.ts
│
├── store/                       # Zustand 상태 관리
│   ├── project.store.ts
│   ├── editor.store.ts
│   └── render.store.ts
│
├── utils/                       # 유틸리티 함수
│   ├── scoring.ts               # 장면 선택 점수 계산
│   ├── dsl-generator.ts         # Scene DSL 생성
│   ├── layout-engine.ts         # 레이아웃 계산
│   ├── remotion-builder.ts      # Remotion TSX 생성
│   └── format.ts                # 포맷팅 함수
│
├── types/                       # TypeScript 타입 정의
│   ├── scene.ts
│   ├── beat.ts
│   ├── skill.ts
│   └── index.ts
│
├── styles/
│   ├── globals.css
│   ├── tailwind.config.ts
│   └── theme.css
│
├── motions/                     # 애니메이션 프리셋
│   ├── fadeUp.ts
│   ├── popNumber.ts
│   └── ...
│
└── constants.ts                 # 전역 상수
```

### 2. 파일 네이밍 규칙

| 종류 | 규칙 | 예시 |
|------|------|------|
| **React 컴포넌트** | PascalCase | `Timeline.tsx`, `SceneCard.tsx` |
| **페이지 컴포넌트** | PascalCase | `page.tsx` (Next.js 관례) |
| **유틸리티 함수** | camelCase | `scoring.ts`, `formatTime.ts` |
| **상수** | UPPER_SNAKE_CASE | `LAYOUT_FAMILIES.ts`, `API_ENDPOINTS.ts` |
| **타입 정의** | PascalCase | `scene.ts`, `beat.ts` |
| **Zustand store** | camelCase + .store | `project.store.ts` |
| **훅** | camelCase + use | `useProject.ts`, `useScenes.ts` |

### 3. 임포트 순서

```typescript
// 1. 외부 라이브러리
import React from "react";
import { useRouter } from "next/navigation";

// 2. 내부 모듈 (절대 경로 @ 프리픽스)
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProject";
import { projectStore } from "@/store/project.store";

// 3. 타입 정의
import type { SceneType, Beat } from "@/types/scene";

// 4. 스타일
import styles from "./Timeline.module.css";
```

---

## Scene DSL 작성 규칙

### 1. Scene DSL 구조

```typescript
// ✅ Good: 완전한 Scene DSL
const scene: SceneDsl = {
  id: "scene-001",
  beatIndex: 0,
  layoutFamily: "hero-center",
  durationMs: 5000,
  durationFrames: 150,
  fps: 30,
  width: 1920,
  height: 1080,
  backgroundColor: "#000000",
  components: [
    {
      id: "kicker",
      type: "Kicker",
      content: "새로운 시대",
      position: { x: "50%", y: "20%", anchor: "center" },
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: 500,
      color: "#00FF00",
      animation: {
        type: "fadeUp",
        durationFrames: 30,
        delayFrames: 0,
        easing: "easeInOutQuad",
      },
    },
    // ... 더 많은 컴포넌트
  ],
  audioAlignment: {
    beatIndex: 0,
    beatStartFrame: 0,
    beatEndFrame: 150,
    beatText: "AI가 콘텐츠를 변화시키고 있습니다",
  },
};
```

### 2. 위치 지정 규칙

```typescript
// ✅ Good: 백분율 사용 (반응형)
position: { x: "50%", y: "50%", anchor: "center" }

// ✅ Good: 절대값 (픽셀)
position: { x: 960, y: 540, anchor: "center" }

// ✅ Good: 혼합
position: { x: "50%", y: 540, anchor: "center" }

// ❌ Bad: vw/vh 단위 (Remotion에서 미지원)
position: { x: "50vw", y: "50vh" }
```

### 3. 색상 정의

```typescript
// ✅ Good: 16진수 RGB
color: "#00FF00"
color: "#FFFFFF"

// ✅ Good: design-tokens 참조
color: designTokens.colors.primary

// ❌ Bad: 이름 사용
color: "green"
color: "white"
```

---

## Claude Code 스킬 작성 규칙

### 1. 스킬 폴더 구조

```
.claude/
└── skills/
    ├── reat-analyze/
    │   ├── SKILL.md          # 스킬 정의
    │   └── index.ts          # 구현
    ├── reat-catalog/
    │   ├── SKILL.md
    │   └── index.ts
    ├── reat-chunk/
    │   ├── SKILL.md
    │   └── index.ts
    ├── reat-scene/
    │   ├── SKILL.md
    │   └── index.ts
    └── reat-render/
        ├── SKILL.md
        └── index.ts
```

### 2. SKILL.md 템플릿

```markdown
# /reat-chunk (스킬 이름)

## 목적
SRT 자막 파일을 의미 청킹하여 beats.json 생성

## 입력 (Input)

### 파라미터
- srtFile: 입력 SRT 파일 경로
- audioFile: 오디오 파일 경로 (mp3/wav)
- fps: 초당 프레임 수 (기본값: 30)

### 스키마
```json
{
  "srtFile": "string (파일 경로)",
  "audioFile": "string (파일 경로)",
  "fps": "number (30 또는 60)"
}
```

## 출력 (Output)

### 파일
- beats.json (의미 청킹 결과)

### 스키마
```json
{
  "beats": [
    {
      "beatIndex": "number",
      "timeStart": "string (HH:MM:SS,mmm)",
      "text": "string",
      "intent": "assertion | comparison | ...",
      "tone": "emphasis | explanation | ...",
      "evidenceType": "statistic | quotation | ...",
      "density": "low | medium | high",
      "beatCount": "number"
    }
  ]
}
```

## 의존성
- Node.js 18+
- Claude API

## 실행 예시
```bash
npx claude skill invoke reat-chunk \
  --srt-file input.srt \
  --audio-file input.mp3 \
  --fps 30
```
```

### 3. 스킬 구현 템플릿

```typescript
// .claude/skills/reat-chunk/index.ts

import { readFileSync } from "fs";
import { parse as parseSrt } from "subtitle";
import Anthropic from "@anthropic-ai/sdk";

interface ChunkRequest {
  srtFile: string;
  audioFile: string;
  fps: number;
}

interface Beat {
  beatIndex: number;
  timeStart: string;
  timeEnd: string;
  frameStart: number;
  frameEnd: number;
  text: string;
  intent: string;
  tone: string;
  evidenceType: string;
  emphasisTokens: string[];
  density: string;
  beatCount: number;
}

export async function chunk(request: ChunkRequest): Promise<{ beats: Beat[] }> {
  // 1. SRT 파일 파싱
  const srtContent = readFileSync(request.srtFile, "utf-8");
  const subtitles = parseSrt(srtContent);

  // 2. Claude API로 의미 분석
  const client = new Anthropic();

  const beats: Beat[] = [];

  for (let i = 0; i < subtitles.length; i++) {
    const subtitle = subtitles[i];

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `다음 자막 텍스트를 분석하고 JSON 형식으로 응답해주세요:

텍스트: "${subtitle.data.text}"

다음 정보를 추출해주세요:
- intent: assertion | comparison | case-study | warning | process | summary
- tone: emphasis | explanation | proof | twist | neutral
- evidenceType: statistic | quotation | visualization | process
- emphasisTokens: 강조할 키워드 배열
- density: low | medium | high (정보 밀도)
- beatCount: 애니메이션 비트 수 (1-3)

JSON 형식으로만 응답해주세요.`,
        },
      ],
    });

    const analysis = JSON.parse(
      response.content[0].type === "text" ? response.content[0].text : "{}"
    );

    const timeStart = formatTime(subtitle.data.start);
    const timeEnd = formatTime(subtitle.data.end);
    const frameStart = msToFrames(subtitle.data.start, request.fps);
    const frameEnd = msToFrames(subtitle.data.end, request.fps);

    beats.push({
      beatIndex: i,
      timeStart,
      timeEnd,
      frameStart,
      frameEnd,
      text: subtitle.data.text,
      intent: analysis.intent,
      tone: analysis.tone,
      evidenceType: analysis.evidenceType,
      emphasisTokens: analysis.emphasisTokens || [],
      density: analysis.density,
      beatCount: analysis.beatCount || 1,
    });
  }

  return { beats };
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}
```

---

## Git 커밋 컨벤션

### 1. 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. Type 정의

| Type | 의미 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 | `feat(editor): add scene splitting feature` |
| `fix` | 버그 수정 | `fix(timeline): fix scene card alignment issue` |
| `docs` | 문서 수정 | `docs: update API specification` |
| `style` | 코드 스타일 (기능 변화 없음) | `style: format DSL editor component` |
| `refactor` | 코드 리팩토링 | `refactor(scoring): optimize layout matching algorithm` |
| `test` | 테스트 추가/수정 | `test(scene): add scene selection tests` |
| `chore` | 빌드, 설정 등 | `chore: update dependencies` |

### 3. Scope 정의

- `editor`: 타임라인 에디터 (S1)
- `preview`: Remotion 프리뷰 (S2)
- `render`: 렌더링 출력 (S3)
- `skills`: Claude Code 스킬
- `components`: React 컴포넌트
- `store`: Zustand 상태 관리
- `types`: TypeScript 타입 정의
- `utils`: 유틸리티 함수
- `api`: API 라우트

### 4. 예시 커밋 메시지

```
feat(editor): implement scene card selection with highlight

- Add visual feedback when scene is selected
- Update right panel DSL editor on selection
- Support keyboard navigation (arrow keys)

Closes #123

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 5. 커밋 팁

```bash
# ✅ Good: 의미 있는 커밋 메시지
git commit -m "feat(editor): add template selector to scene card"

# ✅ Good: 상세 바디 포함
git commit -m "feat(editor): add template selector to scene card

- Add dropdown menu with 8 layout families
- Auto-update DSL on template change
- Add preview of selected template"

# ❌ Bad: 모호한 메시지
git commit -m "fix stuff"

# ❌ Bad: 너무 길거나 복잡한 커밋
git commit -m "add multiple features and fix bugs and update docs"
```

---

## ESLint & Prettier 설정

### .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### .prettierrc.json

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

---

## 테스트 작성 규칙

### 1. 파일 네이밍

```
Timeline.tsx → Timeline.test.tsx
Timeline.tsx → Timeline.spec.ts
```

### 2. 테스트 구조

```typescript
import { render, screen } from "@testing-library/react";
import { Timeline } from "./Timeline";

describe("Timeline Component", () => {
  describe("렌더링", () => {
    it("장면 카드를 올바르게 렌더링해야 함", () => {
      const scenes = [
        { id: "scene-1", beatIndex: 0, layoutFamily: "hero-center" },
      ];

      render(<Timeline scenes={scenes} onSelectScene={() => {}} />);

      expect(screen.getByText("Scene 1")).toBeInTheDocument();
    });
  });

  describe("인터랙션", () => {
    it("장면 카드 클릭 시 onSelectScene 콜백 호출", () => {
      const handleSelect = jest.fn();
      const scenes = [{ id: "scene-1", beatIndex: 0 }];

      render(<Timeline scenes={scenes} onSelectScene={handleSelect} />);

      const card = screen.getByRole("button", { name: /scene/i });
      card.click();

      expect(handleSelect).toHaveBeenCalledWith("scene-1");
    });
  });
});
```

---

## 성능 최적화 가이드

### 1. React 렌더링 최적화

```typescript
// ✅ Good: 불필요한 리렌더링 방지
const SceneCard = React.memo(
  ({ scene, onSelect }: SceneCardProps) => {
    return (
      <Card onClick={() => onSelect(scene.id)}>
        {scene.layoutFamily}
      </Card>
    );
  }
);

// ✅ Good: useCallback으로 함수 메모이제이션
const handleSelect = React.useCallback((id: string) => {
  setSelectedSceneId(id);
}, []);

// ✅ Good: useMemo로 계산 최적화
const totalFrames = React.useMemo(() => {
  return scenes.reduce((sum, scene) => sum + scene.durationFrames, 0);
}, [scenes]);
```

### 2. 번들 크기 최적화

```typescript
// ✅ Good: 동적 임포트
const RemotionPlayer = React.lazy(() => import("./RemotionPlayer"));

// ✅ Good: 트리 쉐이킹 (named exports 사용)
export const Button = () => {};
export const Card = () => {};

// ❌ Bad: default export (트리 쉐이킹 불가)
export default { Button, Card };
```

---

## 참고 문헌

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

## 참조

- 아키텍처: `04-architecture.md`
- 화면 설계: `06-screens.md`
- 기술 스택: `03-tech-stack.md`
