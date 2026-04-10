# API 명세 (Claude Code 스킬 + DSL 스키마)

## 개요

newVideoGen은 전통적 REST API가 아닌 **Claude Code 스킬 기반 아키텍처**입니다. 각 스킬의 입출력 스펙과 중간 표현(DSL) 스키마를 정의합니다.

---

## 🎯 스킬 API 명세

### 1. /reat-analyze (기반, 1회성)

**목적**: 레퍼런스 이미지 분석 → 디자인 토큰 추출

#### 요청

```bash
POST /api/skills/analyze
```

**Request Body**:
```json
{
  "imageFolder": "/path/to/reference/images",
  "metadataFile": "/path/to/reference/metadata.json",
  "layoutFamilyCount": 8
}
```

**metadata.json 형식**:
```json
{
  "images": [
    {
      "filename": "hero-center-1.png",
      "layoutFamily": "hero-center",
      "description": "대형 숫자 중앙 배치",
      "components": ["kicker", "headline", "supporting"]
    },
    {
      "filename": "split-2col-1.png",
      "layoutFamily": "split-2col",
      "description": "2열 비교 레이아웃",
      "components": ["left-content", "right-content"]
    }
  ]
}
```

#### 응답

**Response 200 OK**:
```json
{
  "status": "success",
  "designTokens": {
    "colors": {
      "primary": "#00FF00",
      "background": "#000000",
      "text": "#FFFFFF",
      "accent1": "#FF0080",
      "accent2": "#00FFFF",
      "gray": "#808080"
    },
    "typography": {
      "headlineFont": "Inter",
      "headlineSize": 64,
      "headlineLineHeight": 1.2,
      "bodyFont": "Inter",
      "bodySize": 24,
      "bodyLineHeight": 1.4,
      "captionFont": "Inter",
      "captionSize": 16,
      "captionLineHeight": 1.3
    },
    "spacing": {
      "gutter": 16,
      "sectionPadding": 48,
      "cardGap": 24,
      "lineHeight": 1.5
    },
    "radii": {
      "default": 8,
      "large": 16,
      "full": 9999
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0, 0, 0, 0.5)",
      "md": "0 4px 6px rgba(0, 0, 0, 0.5)"
    }
  },
  "layoutExemplars": {
    "layouts": [
      {
        "id": "hero-center",
        "name": "대형 숫자/텍스트 중앙 배치",
        "visualCharacteristics": {
          "alignment": "center",
          "mainElement": "large-headline",
          "supportingElements": ["kicker", "supporting-text"],
          "backgroundStyle": "dark-solid"
        },
        "useCases": ["assertion", "statistic"],
        "sampleImages": ["hero-center-1.png", "hero-center-2.png"],
        "colorScheme": {
          "background": "#000000",
          "text": "#FFFFFF",
          "accent": "#00FF00"
        }
      },
      {
        "id": "split-2col",
        "name": "2열 비교 레이아웃",
        "visualCharacteristics": {
          "alignment": "split",
          "mainElement": "two-columns",
          "supportingElements": ["divider"],
          "backgroundStyle": "dark-solid"
        },
        "useCases": ["comparison"],
        "sampleImages": ["split-2col-1.png", "split-2col-2.png"],
        "colorScheme": {
          "background": "#000000",
          "text": "#FFFFFF",
          "divider": "#00FF00"
        }
      }
    ]
  },
  "outputFiles": {
    "designTokens": "output/design-tokens.json",
    "layoutExemplars": "output/layout-exemplars.json"
  }
}
```

---

### 2. /reat-catalog (기반, 1회성)

**목적**: 레이아웃 카탈로그 + Scene DSL 스키마 생성

#### 요청

```bash
POST /api/skills/catalog
```

**Request Body**:
```json
{
  "layoutExemplarsFile": "output/layout-exemplars.json",
  "designTokensFile": "output/design-tokens.json",
  "outputPath": "output/"
}
```

#### 응답

**Response 200 OK**:
```json
{
  "status": "success",
  "catalog": {
    "version": "1.0.0",
    "generatedAt": "2026-03-10T10:00:00Z",
    "layoutFamilies": [
      {
        "id": "hero-center",
        "name": "대형 숫자/텍스트 중앙 배치",
        "description": "한 가지 큰 데이터 포인트나 주요 메시지를 강조할 때 사용",
        "components": [
          {
            "id": "kicker",
            "type": "Kicker",
            "optional": false,
            "defaultContent": "",
            "position": "top-center"
          },
          {
            "id": "headline",
            "type": "Headline",
            "optional": false,
            "defaultContent": "",
            "position": "center"
          },
          {
            "id": "supporting",
            "type": "SupportingText",
            "optional": true,
            "defaultContent": "",
            "position": "bottom-center"
          }
        ],
        "recommendedFor": {
          "intents": ["assertion"],
          "tones": ["emphasis"],
          "evidenceTypes": ["statistic"]
        },
        "motionPresets": ["fadeUp", "popNumber", "countUp"],
        "aspectRatio": 16 / 9,
        "dimensions": {
          "width": 1920,
          "height": 1080
        },
        "responsiveVariants": {
          "desktop": { "width": 1920, "height": 1080 },
          "tablet": { "width": 1024, "height": 768 },
          "mobile": { "width": 720, "height": 1280 }
        }
      }
    ],
    "motionPresets": {
      "fadeUp": {
        "type": "fade+translate",
        "from": { "opacity": 0, "translateY": 20 },
        "to": { "opacity": 1, "translateY": 0 },
        "durationFrames": 30,
        "easing": "easeInOutQuad"
      },
      "popNumber": {
        "type": "scale+fade",
        "from": { "scale": 0.5, "opacity": 0 },
        "to": { "scale": 1, "opacity": 1 },
        "durationFrames": 40,
        "easing": "easeOutBounce"
      }
    }
  },
  "sceneDslSchema": {
    "version": "1.0.0",
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "고유 장면 ID (예: 'scene-001')"
      },
      "beatIndex": {
        "type": "integer",
        "description": "beats.json에서의 beat 인덱스"
      },
      "layoutFamily": {
        "type": "string",
        "enum": ["hero-center", "split-2col", "grid-4x3", "process-horizontal", "radial-focus", "stacked-vertical", "comparison-bars", "spotlight-case"],
        "description": "사용할 루트 레이아웃 패밀리"
      },
      "durationMs": {
        "type": "number",
        "description": "장면 길이 (밀리초)"
      },
      "durationFrames": {
        "type": "integer",
        "description": "장면 길이 (프레임 수)"
      },
      "fps": {
        "type": "integer",
        "enum": [24, 30, 60],
        "default": 30,
        "description": "초당 프레임 수"
      },
      "width": {
        "type": "integer",
        "default": 1920,
        "description": "캔버스 너비"
      },
      "height": {
        "type": "integer",
        "default": 1080,
        "description": "캔버스 높이"
      },
      "backgroundColor": {
        "type": "string",
        "pattern": "^#[0-9A-F]{6}$",
        "default": "#000000",
        "description": "배경 색상 (16진수 RGB)"
      },
      "components": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "type": { "type": "string" },
            "content": { "type": "string" },
            "position": {
              "type": "object",
              "properties": {
                "x": { "type": ["string", "number"] },
                "y": { "type": ["string", "number"] },
                "anchor": { "type": "string", "enum": ["start", "center", "end"] }
              }
            },
            "fontSize": { "type": "integer" },
            "fontFamily": { "type": "string" },
            "fontWeight": { "type": "integer" },
            "color": { "type": "string" },
            "animation": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },
                "durationFrames": { "type": "integer" },
                "delayFrames": { "type": "integer" },
                "easing": { "type": "string" }
              },
              "required": ["type", "durationFrames"]
            }
          },
          "required": ["id", "type"]
        }
      },
      "audioAlignment": {
        "type": "object",
        "properties": {
          "beatIndex": { "type": "integer" },
          "beatStartFrame": { "type": "integer" },
          "beatEndFrame": { "type": "integer" },
          "beatText": { "type": "string" }
        }
      }
    },
    "required": ["id", "layoutFamily", "durationFrames", "components"]
  },
  "outputFiles": {
    "catalog": "output/catalog.json",
    "sceneDslSchema": "output/scene-dsl-schema.json"
  }
}
```

---

### 3. /reat-chunk (영상별)

**목적**: SRT 자막 → 의미 청킹

#### 요청

```bash
POST /api/skills/chunk
```

**Request Body**:
```json
{
  "srtFile": "/path/to/input.srt",
  "audioFile": "/path/to/input.mp3",
  "fps": 30,
  "outputPath": "output/projects/video-001/"
}
```

#### 응답

**Response 200 OK**:
```json
{
  "status": "success",
  "beatsFile": "output/projects/video-001/beats.json",
  "beats": [
    {
      "beatIndex": 0,
      "timeStart": "00:00:00,000",
      "timeEnd": "00:00:05,000",
      "frameStart": 0,
      "frameEnd": 150,
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
      "frameStart": 150,
      "frameEnd": 300,
      "text": "세 가지 주요 트렌드를 살펴보겠습니다",
      "intent": "process",
      "tone": "neutral",
      "evidenceType": "process",
      "emphasisTokens": ["세 가지", "트렌드"],
      "density": "medium",
      "beatCount": 1
    }
  ],
  "statistics": {
    "totalBeats": 2,
    "totalDurationMs": 10000,
    "avgBeatDuration": 5000,
    "intentDistribution": {
      "assertion": 1,
      "process": 1
    }
  }
}
```

---

### 4. /reat-scene (영상별)

**목적**: beats.json + 카탈로그 → Scene DSL 생성

#### 요청

```bash
POST /api/skills/scene
```

**Request Body**:
```json
{
  "beatsFile": "output/projects/video-001/beats.json",
  "catalogFile": "output/catalog.json",
  "designTokensFile": "output/design-tokens.json",
  "assetLibraryPath": "assets/",
  "outputPath": "output/projects/video-001/"
}
```

#### 응답

**Response 200 OK**:
```json
{
  "status": "success",
  "scenePlanFile": "output/projects/video-001/scene-plan.json",
  "sceneDslFiles": [
    "output/projects/video-001/scene-001.json",
    "output/projects/video-001/scene-002.json"
  ],
  "scenePlan": {
    "projectId": "video-001",
    "filename": "video-001.srt",
    "totalDuration": "00:00:10",
    "generationTimestamp": "2026-03-10T10:00:00Z",
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
        "confidence": 0.78,
        "alternativeLayouts": [
          {
            "id": "split-2col",
            "score": 35,
            "reason": "비교 레이아웃이지만 assertion이 주 목적"
          }
        ],
        "dslFile": "scene-001.json"
      }
    ],
    "statistics": {
      "layoutDistribution": {
        "hero-center": 1,
        "split-2col": 1,
        "grid-4x3": 0
      },
      "averageScore": 56,
      "averageConfidence": 0.78
    }
  }
}
```

---

### 5. /reat-render (영상별)

**목적**: Scene DSL → Remotion TSX → mp4 렌더링

#### 요청

```bash
POST /api/skills/render
```

**Request Body**:
```json
{
  "sceneDslFolder": "output/projects/video-001/",
  "audioFile": "input/audio.mp3",
  "designTokensFile": "output/design-tokens.json",
  "outputPath": "output/videos/",
  "mp4Filename": "video-001.mp4",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "audioCodec": "aac",
  "videoCodec": "h264"
}
```

#### 응답 (웹소켓 스트림)

**Response 200 OK (스트리밍)**:
```json
{
  "status": "rendering",
  "projectId": "video-001",
  "progress": {
    "totalFrames": 300,
    "renderedFrames": 150,
    "percentComplete": 50,
    "estimatedTimeRemaining": "00:02:30"
  },
  "generatedTsx": "output/generated/SceneComposition.tsx",
  "currentScene": "Scene001",
  "logs": [
    "Generating Scene001.tsx...",
    "Rendering frames 0-50...",
    "Encoding video..."
  ]
}
```

**Response 200 OK (완료)**:
```json
{
  "status": "success",
  "mp4File": "output/videos/video-001.mp4",
  "fileSize": 125000000,
  "duration": "00:00:10",
  "generatedFiles": {
    "composition": "output/generated/SceneComposition.tsx",
    "scenes": [
      "output/generated/Scene001.tsx",
      "output/generated/Scene002.tsx"
    ]
  },
  "statistics": {
    "totalFrames": 300,
    "fps": 30,
    "renderTime": 180,
    "encodingTime": 120
  }
}
```

---

## 📋 JSON 스키마 정의

### beats.json 스키마

```typescript
interface BeatsJson {
  filename: string;
  audioFile: string;
  totalDurationMs: number;
  beats: Beat[];
}

interface Beat {
  beatIndex: number;
  timeStart: string;          // "00:00:05,000"
  timeEnd: string;            // "00:00:10,000"
  frameStart: number;
  frameEnd: number;
  text: string;
  intent: Intent;
  tone: Tone;
  evidenceType: EvidenceType;
  emphasisTokens: string[];
  density: Density;
  beatCount: number;
}

type Intent =
  | "assertion"       // 주장/진술
  | "comparison"      // 비교
  | "case-study"      // 사례
  | "warning"         // 경고/주의
  | "process"         // 과정/단계
  | "summary";        // 요약

type Tone =
  | "emphasis"        // 강조
  | "explanation"     // 설명
  | "proof"           // 증명/근거
  | "twist"           // 반전
  | "neutral";        // 중립

type EvidenceType =
  | "statistic"       // 통계/숫자
  | "quotation"       // 인용
  | "visualization"   // 시각화
  | "process";        // 프로세스

type Density = "low" | "medium" | "high";
```

### scene-plan.json 스키마

```typescript
interface ScenePlanJson {
  projectId: string;
  filename: string;
  totalDuration: string;
  generationTimestamp: string;
  scenes: ScenePlan[];
  statistics: {
    layoutDistribution: Record<LayoutFamily, number>;
    averageScore: number;
    averageConfidence: number;
  };
}

interface ScenePlan {
  beatIndex: number;
  selectedLayoutFamily: LayoutFamily;
  scoreBreakdown: {
    semanticFit: number;              // 40점 만점
    evidenceTypeFit: number;          // 20점 만점
    rhythmFit: number;                // 15점 만점
    assetOwnership: number;           // 10점 만점
    recentRepetitionPenalty: number;  // -25점
    previousSimilarityPenalty: number;// -20점
  };
  finalScore: number;
  confidence: number;                 // 0-1
  alternativeLayouts: AlternativeLayout[];
  dslFile: string;
}

interface AlternativeLayout {
  id: LayoutFamily;
  score: number;
  reason: string;
}

type LayoutFamily =
  | "hero-center"
  | "split-2col"
  | "grid-4x3"
  | "process-horizontal"
  | "radial-focus"
  | "stacked-vertical"
  | "comparison-bars"
  | "spotlight-case";
```

### scene-*.json (Scene DSL) 스키마

```typescript
interface SceneDsl {
  id: string;                         // "scene-001"
  beatIndex: number;
  layoutFamily: LayoutFamily;
  durationMs: number;
  durationFrames: number;
  fps: 24 | 30 | 60;
  width: number;                      // 1920
  height: number;                     // 1080
  backgroundColor: string;            // "#000000"
  components: Component[];
  audioAlignment: {
    beatIndex: number;
    beatStartFrame: number;
    beatEndFrame: number;
    beatText: string;
  };
}

interface Component {
  id: string;
  type: ComponentType;
  content?: string;
  position?: Position;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  maxWidth?: number;
  animation?: Animation;
  children?: Component[];
}

type ComponentType =
  | "Kicker"
  | "Headline"
  | "SupportingText"
  | "Label"
  | "Badge"
  | "IconCard"
  | "BarCompare"
  | "RingChart"
  | "ProcessFlow"
  | "ConnectorArrow"
  | "Image"
  | "Background"
  | "Grid"
  | "Column"
  | "Row";

interface Position {
  x: string | number;                 // "50%", 960, "center"
  y: string | number;                 // "50%", 540, "center"
  anchor?: "start" | "center" | "end";
}

interface Animation {
  type: MotionPresetType;
  durationFrames: number;
  delayFrames?: number;
  easing?: EasingFunction;
}

type MotionPresetType =
  | "fadeUp"
  | "popNumber"
  | "staggerChildren"
  | "drawConnector"
  | "pulseAccent"
  | "wipeBar"
  | "countUp"
  | "slideSplit"
  | "revealMask"
  | "popBadge";

type EasingFunction =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeOutBounce";
```

### design-tokens.json 스키마

```typescript
interface DesignTokensJson {
  colors: {
    primary: string;                  // "#00FF00"
    background: string;               // "#000000"
    text: string;                      // "#FFFFFF"
    accent1: string;                   // "#FF0080"
    accent2: string;                   // "#00FFFF"
    gray: string;                      // "#808080"
  };
  typography: {
    headlineFont: string;              // "Inter"
    headlineSize: number;              // 64
    headlineLineHeight: number;        // 1.2
    bodyFont: string;
    bodySize: number;
    bodyLineHeight: number;
    captionFont: string;
    captionSize: number;
    captionLineHeight: number;
  };
  spacing: {
    gutter: number;                    // 16
    sectionPadding: number;            // 48
    cardGap: number;                   // 24
    lineHeight: number;                // 1.5
  };
  radii: {
    default: number;                   // 8
    large: number;                     // 16
    full: number;                      // 9999
  };
  shadows: {
    sm: string;
    md: string;
  };
}
```

---

## 🔄 통합 워크플로우

### E2E 파이프라인 (CSV 형식)

| Step | Skill | Input | Output | 의존성 |
|------|-------|-------|--------|--------|
| 1 | `/reat-analyze` | reference/*.png | design-tokens.json, layout-exemplars.json | - |
| 2 | `/reat-catalog` | layout-exemplars.json | catalog.json, scene-dsl-schema.json | Step 1 |
| 3 | `/reat-chunk` | input.srt, input.mp3 | beats.json | - |
| 4 | `/reat-scene` | beats.json, catalog.json | scene-plan.json, scene-*.json | Step 2, 3 |
| 5 (옵션) | 웹 에디터 | scene-*.json | edited scene-*.json | Step 4 |
| 6 | `/reat-render` | scene-*.json, audio.mp3 | output.mp4 | Step 4 또는 5 |

---

## 🔗 스킬 간 데이터 흐름

```
design-tokens.json ──┐
                     │
layout-exemplars.json─┤─→ /reat-catalog ─→ catalog.json
                     │
                     └──────────────────┐
                                        │
                                   ┌────▼──────┐
                    ┌──────────────→│ /reat-scene │
                    │               └────┬──────┘
input.srt ─→ /reat-chunk ─→ beats.json   │
                                        │
                                    ┌───▼─────────┐
                                    │ scene-*.json│
                                    └───┬─────────┘
                                        │
input.mp3 ─────────────────────────────→│
                                        │
                                    ┌───▼────────┐
                                    │ /reat-render │
                                    └───┬────────┘
                                        │
                                    output.mp4
```

---

## 🛡️ 에러 응답

### 공통 에러 형식

```json
{
  "status": "error",
  "code": "INVALID_INPUT",
  "message": "상세 에러 메시지",
  "details": {
    "field": "srtFile",
    "reason": "파일을 찾을 수 없습니다"
  }
}
```

### 에러 코드 정의

| 코드 | HTTP | 설명 |
|------|------|------|
| `INVALID_INPUT` | 400 | 입력 파라미터 유효성 오류 |
| `FILE_NOT_FOUND` | 404 | 입력 파일 없음 |
| `SCHEMA_VALIDATION_ERROR` | 400 | JSON 스키마 검증 실패 |
| `SEMANTIC_ANALYSIS_FAILED` | 500 | 의미 청킹 실패 |
| `LAYOUT_MATCHING_ERROR` | 500 | 레이아웃 선택 오류 |
| `RENDERING_ERROR` | 500 | 렌더링 실패 |
| `INSUFFICIENT_RESOURCES` | 503 | 리소스 부족 |

---

## 🔐 인증 & 권한

각 스킬 호출 시 API 키 필요:

```bash
curl -X POST /api/skills/chunk \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @request.json
```

---

## 참조

- 아키텍처: `04-architecture.md`
- 화면 설계: `06-screens.md`
- 코딩 컨벤션: `07-coding-convention.md`
