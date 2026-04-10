# Layout Reference Library

실제 영상 캡처에서 추출한 레이아웃 패턴. `/reat-layout`이 stack_root를 생성할 때 참조합니다.

---

## REF-001: 수평 프로세스 플로우 (Circle Icon + Arrow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 순차적 과정 설명 (3단계 프로세스)
**아키타입 매핑:** E (수평 프로세스 플로우)

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000, 여백 넉넉함)                                │
│                                                          │
│          [BodyText: gray(#888), sm, 설명문]                │
│                                                          │
│    ┌──────┐          ┌──────┐          ┌──────┐          │
│    │ ○    │   →      │ ○    │   →      │ ○    │          │
│    │ Icon │  (green) │ Icon │  (green) │ Icon │          │
│    └──────┘          └──────┘          └──────┘          │
│    [Label]           [Label]           [Label]           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 아이콘 프레임 | **원형(circle)**, ~80px, fill: #1a1a1a, border: 2px #333 |
| 아이콘 | 이모지/SVG, ~48px, 원형 프레임 중앙 |
| 화살표 | ArrowConnector, 녹색(accent #39FF14), 가느다란 선 |
| 상단 텍스트 | BodyText, gray(#888888), fontSize:sm, 설명/도입문 |
| 라벨 텍스트 | BodyText, white, fontSize:sm, **bold**, 2-4자 키워드 |
| 간격 | 아이콘-라벨: gap 8px, 스텝 간: gap 48px |
| 전체 정렬 | 화면 세로 중앙 약간 위, 수평 중앙 |
| 여백 | 상하좌우 넉넉 (콘텐츠 영역 ~700px 이내) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "도입 설명문" },
      "style": { "color": "#888888", "fontSize": 20 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "justify": "center", "gap": 48 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "pencil", "size": 48 },
              "style": {
                "background": "#1a1a1a",
                "borderRadius": "50%",
                "border": "2px solid #333333",
                "width": 80, "height": 80,
                "display": "flex", "alignItems": "center", "justifyContent": "center"
              }
            },
            {
              "type": "BodyText",
              "data": { "text": "키워드1" },
              "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 16 }
            }
          ]
        },
        {
          "type": "ArrowConnector",
          "data": { "direction": "right" },
          "style": { "color": "#39FF14" }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "chat", "size": 48 },
              "style": {
                "background": "#1a1a1a",
                "borderRadius": "50%",
                "border": "2px solid #333333",
                "width": 80, "height": 80
              }
            },
            {
              "type": "BodyText",
              "data": { "text": "키워드2" },
              "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 16 }
            }
          ]
        },
        {
          "type": "ArrowConnector",
          "data": { "direction": "right" },
          "style": { "color": "#39FF14" }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "clipboard", "size": 48 },
              "style": {
                "background": "#1a1a1a",
                "borderRadius": "50%",
                "border": "2px solid #333333",
                "width": 80, "height": 80
              }
            },
            {
              "type": "BodyText",
              "data": { "text": "키워드3" },
              "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 16 }
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **3단계 프로세스** 설명 씬에 우선 적용
- 아이콘은 반드시 **원형 프레임** 안에 배치 (bare icon 금지)
- 원형 프레임: dark fill + subtle border (glow 아님)
- 화살표는 **녹색 accent**, 가느다란 선
- 라벨은 **bold, white, 2-4자 키워드**만
- 상단에 1줄 도입 설명문 (gray, 선택)
- 전체 maxWidth 700px 이내
- 여백 넉넉하게 (미니멀, 여유로운 느낌)

---

## REF-002: 대형 링 차트 + 통계 강조 (RingChart Center Stat)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 비율/퍼센트 강조, 활용도/달성률 시각화
**아키타입 매핑:** Q (도넛 차트 + 태그 배열) 변형

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [BodyText: gray(#888), sm, 도입문]                │
│                                                          │
│              ╭──────────────────╮                         │
│              │   ╭── green arc  │                         │
│              │   │              │                         │
│              │      10%        │  ← 대형 RingChart        │
│              │      활용        │     ~300px              │
│              │                  │     track: #222         │
│              ╰──────────────────╯     arc: accent green   │
│                                                          │
│        • [BulletList: green dot + white text, 1줄]        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| RingChart | size: **300px**, track: #222222, arc: accent green (#39FF14) |
| 링 두께 | ~20px, 둥근 끝(round cap) |
| 중앙 수치 | **매우 큰 볼드** ~72px, green(accent), fontWeight: 800 |
| 중앙 라벨 | gray(#888), fontSize: 18, 수치 바로 아래 |
| 상단 텍스트 | BodyText, gray(#888), sm, 1줄 도입문 |
| 하단 불릿 | green dot(●) + white text, fontSize: 18, 1줄 |
| 전체 정렬 | 완전 중앙 정렬, 세로 가운데 |
| 여백 | 상하 넉넉, 콘텐츠 집중형 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "도입 설명문" },
      "style": { "color": "#888888", "fontSize": 20 }
    },
    {
      "type": "RingChart",
      "data": {
        "value": 10,
        "label": "활용",
        "size": 300
      },
      "style": {
        "trackColor": "#222222",
        "arcColor": "#39FF14",
        "fontSize": 72,
        "fontWeight": 800,
        "labelFontSize": 18,
        "labelColor": "#888888",
        "strokeWidth": 20
      }
    },
    {
      "type": "BulletList",
      "data": {
        "items": ["핵심 인사이트 1줄"],
        "bulletColor": "#39FF14"
      },
      "style": { "color": "#ffffff", "fontSize": 18, "maxWidth": 600 }
    }
  ]
}
```

### 적용 규칙

- **퍼센트/비율** 강조 씬에 우선 적용
- RingChart는 **대형(300px)** — 화면의 주인공
- 중앙 수치: accent green, 매우 큰 볼드 (72px 이상)
- 링 트랙: 어두운 #222, arc: accent green
- 링 두께: ~20px, round cap
- 아래에 **1줄 불릿** (green dot)으로 핵심 인사이트
- 상단에 1줄 도입문 (gray, 선택)
- 요소 3개 이하 — 극도로 미니멀

---

## REF-003: 인물 프로필 카드 (PersonAvatar + FrameBox)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 인물 소개, 전문가/출처 인용, 권위 강조
**아키타입 매핑:** Z (인물 프로필) 변형

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│     ╭────╮   Name (green, bold, lg)                      │
│     │ BC │   Role · Title (gray, sm)                     │
│     ╰────╯   ✳ 부가 설명 (gray, sm)                      │
│                                                          │
│     ┌──────────────────────────────────┐                 │
│     │   핵심 메시지 (white, bold)        │  ← FrameBox   │
│     └──────────────────────────────────┘                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar | ~100px 원형, green fill(연한 accent), **green border ring** 3px |
| 이니셜 | 원 중앙, green(진한), bold, ~32px |
| 이름 | Headline, **accent green**, bold, ~36px |
| 역할/소속 | BodyText, gray(#888), sm, "조직 · 직함" 형태 |
| 부가 설명 | BodyText, gray(#888), sm, 아이콘(✳) 접두 |
| FrameBox | maxWidth:600, fill: #1a1a1a, border: 1px #3a3a3a (subtle), radius:12px |
| FrameBox 텍스트 | white, bold, ~20px, 중앙 정렬, padding: 16px 32px |
| 레이아웃 | 상단: Stack(row, gap:32) [Avatar + Stack(col, info)], 하단: FrameBox |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 120px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 32 },
      "children": [
        {
          "type": "PersonAvatar",
          "data": { "name": "인물명", "initials": "BC" },
          "style": {
            "width": 100, "height": 100,
            "background": "rgba(57,255,20,0.2)",
            "border": "3px solid #39FF14",
            "borderRadius": "50%",
            "fontSize": 32, "fontWeight": 700,
            "color": "#39FF14"
          }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 6 },
          "children": [
            {
              "type": "Headline",
              "data": { "text": "인물명" },
              "style": { "color": "#39FF14", "fontSize": 36, "fontWeight": 800 }
            },
            {
              "type": "BodyText",
              "data": { "text": "조직 · 직함" },
              "style": { "color": "#888888", "fontSize": 18 }
            },
            {
              "type": "BodyText",
              "data": { "text": "✳ 부가 설명" },
              "style": { "color": "#888888", "fontSize": 16 }
            }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "style": {
        "maxWidth": 600,
        "background": "#1a1a1a",
        "border": "1px solid #3a3a3a",
        "borderRadius": 12,
        "padding": "16px 32px"
      },
      "children": [
        {
          "type": "BodyText",
          "data": { "text": "핵심 메시지 한 줄" },
          "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 20, "textAlign": "center" }
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **인물 소개**, 전문가 인용, 출처 권위 강조 씬에 적용
- Avatar: 원형 + green 테두리 링 (이니셜 또는 아이콘)
- 이름: **accent green, 큰 볼드** — 화면에서 가장 눈에 띄는 요소
- 역할/소속: gray, 작은 글씨, "조직 · 직함" 포맷
- 아래 FrameBox: 핵심 행동/메시지 1줄, 카드 형태로 강조
- FrameBox border는 **subtle** (진한 gray, green 아님)
- 전체 좌측 정렬 느낌 (완전 중앙이 아니라 약간 좌측 무게감)

---

## REF-004: 체크리스트 + 하단 인사이트 (BulletList Check + FooterCaption)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 목차/어젠다, 핵심 포인트 정리, 체크항목 나열
**아키타입 매핑:** J (체크리스트) 변형

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [Headline: white, bold, md, 중앙]                │
│                                                          │
│          ✅ 항목 1 (white, md)                            │
│                                                          │
│          ✅ 항목 2 (white, md)                            │
│                                                          │
│          ✅ 항목 3 (white, md)                            │
│                                                          │
│          [BodyText: green(accent), sm, 마무리 한 줄]       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | white, **bold**, ~28px, 중앙 정렬, 제목/주제 |
| BulletList | variant: **check** (✅ 원형 체크 아이콘) |
| 체크 아이콘 | green(accent) 원형 안에 체크마크, ~24px |
| 항목 텍스트 | white, ~22px, regular weight, 좌측 정렬 (아이콘 기준) |
| 항목 간격 | gap: ~28px (넉넉한 세로 간격) |
| 하단 텍스트 | **accent green**, sm(~18px), 중앙 정렬, 전환/마무리 문장 |
| 전체 정렬 | 중앙 정렬, 리스트는 좌측 정렬 블록이 중앙에 위치 |
| 여백 | 상하 넉넉, 콘텐츠 블록 maxWidth ~600px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "제목 한 줄" },
      "style": { "color": "#ffffff", "fontSize": 28, "fontWeight": 700 }
    },
    {
      "type": "BulletList",
      "data": {
        "items": ["항목 1", "항목 2", "항목 3"],
        "variant": "check",
        "bulletColor": "#39FF14"
      },
      "style": {
        "color": "#ffffff",
        "fontSize": 22,
        "gap": 28,
        "maxWidth": 600
      }
    },
    {
      "type": "BodyText",
      "data": { "text": "마무리 전환 문장" },
      "style": { "color": "#39FF14", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- **목차/어젠다**, 핵심 포인트 정리, "오늘 다룰 내용" 씬에 적용
- 체크 아이콘: green accent 원형 체크 (✅ 스타일, 단색 green)
- 항목 3~5개가 적정 (너무 많으면 밀도 높아짐)
- 항목 텍스트: **10자 이내 키워드** (문장 금지)
- 항목 간격 넉넉 (gap 28px) — 답답하지 않게
- 하단에 **accent green 전환 문장** 1줄 (선택)
- Headline과 BulletList 사이 gap ~32px

---

## REF-005: 5열 카드 그리드 (FrameBox Grid Row)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 병렬 요소 나열, 동시 작업/인스턴스, 반복 아이콘 카드
**아키타입 매핑:** D (Grid 카드) 확장 — 5열 수평 배치

### 화면 구성

```
┌──────────────────────────────────────────────────────────────┐
│ (배경: #000000)                                               │
│                                                              │
│       [Headline: white+green accent 숫자, bold, md, 중앙]     │
│                                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ • • •  │ │ • • •  │ │ • • •  │ │ • • •  │ │ • • •  │     │
│  │  ✳     │ │  ✳     │ │  ✳     │ │  ✳     │ │  ✳     │     │
│  │ Label  │ │ Label  │ │ Label  │ │ Label  │ │ Label  │     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                              │
│       [BodyText: gray(#888), sm, 설명문, 중앙]                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | white, bold, ~28px, 숫자/키워드만 **accent green** (RichText 부분 강조) |
| FrameBox 카드 | ~160×140px, fill: #1a1a1a, **border: 1px solid accent green(#39FF14)**, radius: 12px |
| 카드 상단 | 3개 dot (• • •) — 미니 윈도우 UI 장식, green 또는 gray |
| 카드 중앙 아이콘 | ~48px, orange/coral 색상 (accent와 대비되는 보조 색상) |
| 카드 하단 라벨 | green(accent), bold, sm(~14px), "Label #N" 형태 |
| 카드 간격 | gap: ~16px, 수평 일렬 |
| 하단 설명 | BodyText, gray(#888), sm, 1줄 요약 |
| 전체 정렬 | 중앙 정렬, 카드 row maxWidth ~900px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "키워드 숫자강조 문장" },
      "style": { "color": "#ffffff", "fontSize": 28, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "stretch", "justify": "center", "gap": 16 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "FrameBox",
          "style": {
            "width": 160,
            "background": "#1a1a1a",
            "border": "1px solid #39FF14",
            "borderRadius": 12,
            "padding": "16px"
          },
          "children": [
            { "type": "Icon", "data": { "name": "sparkle", "size": 48 }, "style": { "color": "#e8845c" } },
            { "type": "BodyText", "data": { "text": "Label #1" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 160, "background": "#1a1a1a", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px" },
          "children": [
            { "type": "Icon", "data": { "name": "sparkle", "size": 48 }, "style": { "color": "#e8845c" } },
            { "type": "BodyText", "data": { "text": "Label #2" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 160, "background": "#1a1a1a", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px" },
          "children": [
            { "type": "Icon", "data": { "name": "sparkle", "size": 48 }, "style": { "color": "#e8845c" } },
            { "type": "BodyText", "data": { "text": "Label #3" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 160, "background": "#1a1a1a", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px" },
          "children": [
            { "type": "Icon", "data": { "name": "sparkle", "size": 48 }, "style": { "color": "#e8845c" } },
            { "type": "BodyText", "data": { "text": "Label #4" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 160, "background": "#1a1a1a", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px" },
          "children": [
            { "type": "Icon", "data": { "name": "sparkle", "size": 48 }, "style": { "color": "#e8845c" } },
            { "type": "BodyText", "data": { "text": "Label #5" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        }
      ]
    },
    {
      "type": "BodyText",
      "data": { "text": "설명 한 줄" },
      "style": { "color": "#888888", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- **병렬 인스턴스, 동시 실행, 반복 요소** 나열 씬에 적용
- 카드 4~5개 수평 배치 (3개면 REF-001 또는 D 아키타입 사용)
- FrameBox border: **accent green** (subtle gray 아님) — 미니 윈도우/터미널 느낌
- 카드 상단 3 dot 장식: 터미널/앱 윈도우 UI 메타포
- 카드 내 아이콘: **보조 색상(orange/coral #e8845c)** — accent green과 대비
- 라벨: accent green, bold, 번호 포함 ("#1", "#2" ...)
- Headline 내 숫자는 **accent green으로 부분 강조** (RichText segments)
- 하단 gray 설명문 1줄

---

## REF-006: 비유/대비 플로우 (1:N 아이콘 비교 + Arrow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 비유 설명, 1→N 확장, 규모 대비, 비포/애프터
**아키타입 매핑:** C (좌우 VS 대비) + E (프로세스 플로우) 혼합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [BodyText: gray(#888), sm, 도입문]                │
│                                                          │
│     🧑 (gray, 작은)   →    👤👤👤👤👤 (green, 큰)        │
│     "혼자"            arrow  "직원 5명"                    │
│     (gray, sm)               (green, bold, lg)           │
│                                                          │
│          [BodyText: gray(#888), sm, 설명문]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 상단 도입문 | BodyText, gray(#888), sm, "쉽게 비유하면요" 형태 |
| 좌측 (Before) | PersonAvatar 1개, **gray** 단색, ~60px, 라벨 "혼자" gray sm |
| 화살표 | ArrowConnector, gray(#888), 가느다란 → |
| 우측 (After) | PersonAvatar **5개** 겹침 배치, **accent green**, ~40px씩 |
| 우측 라벨 | **accent green, bold, ~32px**, "직원 5명" — 숫자+단위 강조 |
| 크기 대비 | 좌측 작고 gray vs 우측 크고 green — **시각적 규모 대비** |
| 하단 설명문 | BodyText, gray(#888), sm |
| 전체 정렬 | 중앙, 좌우 요소는 Stack(row) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "도입 비유문" },
      "style": { "color": "#888888", "fontSize": 20 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "justify": "center", "gap": 40 },
      "style": { "maxWidth": 800 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "user", "size": 60 },
              "style": { "color": "#666666" }
            },
            {
              "type": "BodyText",
              "data": { "text": "Before 라벨" },
              "style": { "color": "#888888", "fontSize": 16 }
            }
          ]
        },
        {
          "type": "ArrowConnector",
          "data": { "direction": "right" },
          "style": { "color": "#888888" }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "gap": -8 },
              "children": [
                { "type": "Icon", "data": { "name": "user", "size": 40 }, "style": { "color": "#39FF14" } },
                { "type": "Icon", "data": { "name": "user", "size": 40 }, "style": { "color": "#39FF14" } },
                { "type": "Icon", "data": { "name": "user", "size": 40 }, "style": { "color": "#39FF14" } },
                { "type": "Icon", "data": { "name": "user", "size": 40 }, "style": { "color": "#39FF14" } },
                { "type": "Icon", "data": { "name": "user", "size": 40 }, "style": { "color": "#39FF14" } }
              ]
            },
            {
              "type": "Headline",
              "data": { "text": "After 라벨" },
              "style": { "color": "#39FF14", "fontSize": 32, "fontWeight": 800 }
            }
          ]
        }
      ]
    },
    {
      "type": "BodyText",
      "data": { "text": "설명 한 줄" },
      "style": { "color": "#888888", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- **비유/은유** 설명, 1→N 확장, 규모 대비 씬에 적용
- **색상 대비**가 핵심: Before=gray(작고 희미), After=accent green(크고 강조)
- 좌측은 단일 아이콘(작고 gray), 우측은 복수 아이콘(크고 green)
- 화살표: **gray** (accent 아님 — 양쪽 대비를 방해하지 않도록)
- After 라벨: accent green, **큰 볼드** (숫자+단위 조합)

---

## REF-007: 번호 카드 3열 + 질문 카드 (Numbered IconCard Grid + InsightTile)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 역할 분류, 카테고리 나열, 번호 붙은 항목 정리
**아키타입 매핑:** D (3열 Grid 카드) + InsightTile 조합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [Headline: white, bold, md, 중앙]                │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │     ❶       │ │     ❷       │ │     ❸       │        │
│  │   키워드     │ │   키워드     │ │   키워드     │        │
│  │   설명       │ │   설명       │ │   설명       │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│  ┌──────────────────────────────────────┐                │
│  │  ❓ 질문/인사이트 한 줄               │ ← InsightTile  │
│  └──────────────────────────────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | white, bold, ~26px, 중앙 정렬 |
| 카드 (FrameBox) | ~190×160px, fill: #0d1f0d(어두운 green tint), **border: 1px solid accent green**, radius: 12px |
| 번호 뱃지 | **원형**, accent green fill(#39FF14), 내부 숫자 dark(#000), bold, ~28px |
| 카드 제목 | white, **bold**, ~22px, 2-3자 키워드 |
| 카드 설명 | gray(#888), sm(~16px), 4자 이내 |
| 카드 간격 | gap: ~20px, 3열 수평 |
| InsightTile | maxWidth:600, fill: #1a1a1a, border: 1px solid #3a3a3a, radius: 12px |
| InsightTile 아이콘 | ❓ 또는 ⓘ, gray/white, 좌측 |
| InsightTile 텍스트 | white, ~20px, 질문형 문장 |
| 전체 | 카드 row maxWidth ~700px, 중앙 정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "제목 한 줄" },
      "style": { "color": "#ffffff", "fontSize": 26, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "stretch", "justify": "center", "gap": 20 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "FrameBox",
          "style": {
            "width": 190,
            "background": "#0d1f0d",
            "border": "1px solid #39FF14",
            "borderRadius": 12,
            "padding": "24px 16px"
          },
          "children": [
            {
              "type": "Badge",
              "data": { "text": "1" },
              "style": {
                "background": "#39FF14",
                "color": "#000000",
                "borderRadius": "50%",
                "width": 36, "height": 36,
                "fontSize": 18, "fontWeight": 700
              }
            },
            {
              "type": "Headline",
              "data": { "text": "키워드" },
              "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 }
            },
            {
              "type": "BodyText",
              "data": { "text": "설명 2자" },
              "style": { "color": "#888888", "fontSize": 16 }
            }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 190, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "24px 16px" },
          "children": [
            { "type": "Badge", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 } },
            { "type": "Headline", "data": { "text": "키워드" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "설명 2자" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 190, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "24px 16px" },
          "children": [
            { "type": "Badge", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 } },
            { "type": "Headline", "data": { "text": "키워드" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "설명 2자" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        }
      ]
    },
    {
      "type": "InsightTile",
      "data": { "text": "질문 또는 인사이트 한 줄" },
      "style": {
        "maxWidth": 600,
        "background": "#1a1a1a",
        "border": "1px solid #3a3a3a",
        "borderRadius": 12
      }
    }
  ]
}
```

### 적용 규칙

- **역할/카테고리 분류**, 번호 매긴 항목 3개 씬에 적용
- 번호 뱃지: **accent green fill 원형** + dark 숫자 (테두리 아님, 채워진 원)
- 카드 배경: **어두운 green tint** (#0d1f0d) — 순수 검정보다 약간 녹색기
- 카드 border: accent green — REF-005와 동일 스타일
- 카드 내부: 번호 뱃지 → 키워드(bold white) → 설명(gray sm) 수직 배치
- 하단 InsightTile: **neutral border**(gray), 질문형 텍스트, ❓아이콘
- InsightTile은 카드와 다른 border 색상 — 계층 분리

---

## REF-008: 아이콘 카드 3열 + 하단 설명 (Icon FrameBox Grid)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 기능/영역 분류, 각 항목에 고유 아이콘 부여, 독립 요소 나열
**아키타입 매핑:** D (3열 Grid 카드) 변형 — REF-007과 유사하나 번호 뱃지 대신 아이콘

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│      [Headline: accent green, bold, md, 중앙]             │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │    📋 icon  │ │    🎨 icon  │ │    📁 icon  │        │
│  │   창 #1     │ │   창 #2     │ │   창 #3     │        │
│  │  기획 전용   │ │  디자인 전용 │ │  정리 전용   │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│          [BodyText: gray(#888), sm, 설명문]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징 (REF-007과의 차이점 중심)

| 요소 | 스타일 |
|------|--------|
| Headline | **accent green**, bold, ~28px (REF-007은 white) |
| 카드 상단 | 번호 뱃지 대신 **고유 아이콘/이모지** ~40px, 각 카드마다 다른 아이콘 |
| 카드 제목 | white, **bold**, ~22px, "창 #N" 형태 (번호 포함) |
| 카드 설명 | gray(#888), sm, "~전용" 형태의 역할 설명 |
| 카드 스타일 | REF-007과 동일: green tint fill + accent green border |
| 하단 | BodyText gray (InsightTile 없음) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "제목 한 줄" },
      "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "stretch", "justify": "center", "gap": 20 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "FrameBox",
          "style": { "width": 190, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "document", "size": 40 } },
            { "type": "Headline", "data": { "text": "창 #1" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "기획 전용" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 190, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "palette", "size": 40 } },
            { "type": "Headline", "data": { "text": "창 #2" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "디자인 전용" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 190, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "folder", "size": 40 } },
            { "type": "Headline", "data": { "text": "창 #3" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "정리 전용" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        }
      ]
    },
    {
      "type": "BodyText",
      "data": { "text": "설명 한 줄" },
      "style": { "color": "#888888", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- REF-007의 변형: 번호 뱃지 → **고유 아이콘**으로 대체
- 각 카드마다 **다른 아이콘** 사용 (내용에 맞는 시각적 구분)
- Headline이 **accent green** (REF-007은 white) — 더 강한 시각적 강조
- 동일한 구조를 반복해도 아이콘이 달라 시각적 단조로움 방지
- REF-007 vs REF-008 선택 기준: 순서 중요 → REF-007(번호), 종류 구분 → REF-008(아이콘)

---

## REF-009: 복합 레이어 — 미니 윈도우 5열 + 디바이스 플로우

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 멀티태스킹, 여러 창/탭 동시 사용, 크로스 디바이스 연계
**아키타입 매핑:** REF-005 (5열 카드) + E (프로세스 플로우) 수직 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────────┐
│ (배경: #000000)                                               │
│                                                              │
│    [Headline: white+green 숫자, bold, md]                     │
│                                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │•••   │ │•••   │ │•••   │ │•••   │ │•••   │  ← 5열 미니   │
│  │≡≡≡   │ │≡≡≡   │ │≡≡≡   │ │≡≡≡   │ │≡≡≡   │    윈도우     │
│  │ #1 ◀ │ │ #2   │ │ #3 ◀ │ │ #4   │ │ #5   │              │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘              │
│      green    gray    green    gray    gray   ← 활성/비활성   │
│                                                              │
│     📱  →  🖥️   아침에 폰 → 컴퓨터 이어받기                    │
│              ← 디바이스 플로우 (2단계)                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 미니 윈도우 (활성) | fill: #0d1f0d(green tint), **border: accent green**, 상단 3 dot green |
| 미니 윈도우 (비활성) | fill: #1a1a1a(dark gray), **border: #333**, 상단 3 dot gray |
| 윈도우 내부 | 2-3줄 가로선(≡) — 텍스트 메타포, green 또는 gray |
| 윈도우 라벨 | green(활성) 또는 gray(비활성), sm, bold, "#N" |
| 디바이스 아이콘 | PhoneMockup(작은 ~30px) → ArrowConnector(green) → MonitorMockup(~40px) |
| 디바이스 설명 | gray(#888), sm, 1줄 (아이콘 우측에 인라인) |
| 레이어 간격 | 윈도우 row와 디바이스 row 사이 gap: ~32px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "키워드 숫자 강조" },
      "style": { "color": "#ffffff", "fontSize": 28, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "stretch", "justify": "center", "gap": 12 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "FrameBox",
          "style": { "width": 140, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 8, "padding": "12px" },
          "children": [
            { "type": "BodyText", "data": { "text": "#1" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 140, "background": "#1a1a1a", "border": "1px solid #333333", "borderRadius": 8, "padding": "12px" },
          "children": [
            { "type": "BodyText", "data": { "text": "#2" }, "style": { "color": "#666666", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 140, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 8, "padding": "12px" },
          "children": [
            { "type": "BodyText", "data": { "text": "#3" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 140, "background": "#1a1a1a", "border": "1px solid #333333", "borderRadius": 8, "padding": "12px" },
          "children": [
            { "type": "BodyText", "data": { "text": "#4" }, "style": { "color": "#666666", "fontWeight": 700, "fontSize": 14 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 140, "background": "#1a1a1a", "border": "1px solid #333333", "borderRadius": 8, "padding": "12px" },
          "children": [
            { "type": "BodyText", "data": { "text": "#5" }, "style": { "color": "#666666", "fontWeight": 700, "fontSize": 14 } }
          ]
        }
      ]
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "justify": "center", "gap": 16 },
      "children": [
        { "type": "Icon", "data": { "name": "phone", "size": 32 }, "style": { "color": "#888888" } },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#39FF14" } },
        { "type": "Icon", "data": { "name": "monitor", "size": 40 }, "style": { "color": "#888888" } },
        { "type": "BodyText", "data": { "text": "폰 → 컴퓨터 이어받기" }, "style": { "color": "#888888", "fontSize": 16 } }
        ]
    }
  ]
}
```

### 적용 규칙

- **다중 창/탭 + 디바이스 연계** 등 복합 개념 씬에 적용
- **활성/비활성 상태 표현**: green border+tint(활성) vs gray border+dark(비활성)
- 5열 미니 윈도우: REF-005 스타일 기반이지만 더 작고(~140px) 간략한 형태
- 하단에 **별도 레이어**: 디바이스 플로우 (아이콘+화살표+설명 인라인)
- 수직으로 2개 레이어 쌓기 — 관련되지만 다른 정보를 분리 표시
- 활성 항목이 전체의 일부만 — **부분 강조** 패턴

---

## REF-010: 질문 카드 + 아이콘 히어로 + 솔루션 카드 (Problem → Solution 수직)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 문제 제기 → 핵심 개념 → 해결 설명, 질문-답변, 기능 소개
**아키타입 매핑:** F (FrameBox + InsightTile) 확장 — 3단 수직 스토리

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│      [Headline: white, bold, md]                         │
│                                                          │
│  ┌──────────────────────────────────┐                    │
│  │  질문/문제 한 줄 (gray, md)       │ ← FrameBox(gray)  │
│  └──────────────────────────────────┘                    │
│                                                          │
│              🔔 (green, ~48px)      ← Icon 히어로         │
│                                                          │
│      [Headline: accent green, bold, lg]  ← 솔루션 키워드  │
│                                                          │
│  ┌──────────────────────────────────┐                    │
│  │ 🔔 설명 플로우 한 줄 (white)      │ ← FrameBox(green) │
│  └──────────────────────────────────┘                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline (상단) | white, bold, ~26px |
| FrameBox 상단 (질문) | maxWidth:600, fill: transparent, **border: 1px #555 (gray)**, radius: 12px |
| 질문 텍스트 | gray(#888), ~18px, 질문형 문장 |
| Icon 히어로 | accent green, ~48px, 중앙, 개념 대표 아이콘 |
| Headline (솔루션) | **accent green**, bold, ~32px, 핵심 키워드 |
| FrameBox 하단 (설명) | maxWidth:600, fill: #0d1f0d, **border: 1px accent green**, radius: 12px |
| 설명 텍스트 | white, ~18px, 아이콘 접두 + 화살표(→) 포함 플로우 문장 |
| 수직 흐름 | 질문(gray) → 아이콘 → 키워드(green) → 설명(green card) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "제목 한 줄" },
      "style": { "color": "#ffffff", "fontSize": 26, "fontWeight": 700 }
    },
    {
      "type": "FrameBox",
      "style": { "maxWidth": 600, "background": "transparent", "border": "1px solid #555555", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        { "type": "BodyText", "data": { "text": "질문/문제 한 줄?" }, "style": { "color": "#888888", "fontSize": 18 } }
      ]
    },
    {
      "type": "Icon",
      "data": { "name": "bell", "size": 48 },
      "style": { "color": "#39FF14" }
    },
    {
      "type": "Headline",
      "data": { "text": "솔루션 키워드" },
      "style": { "color": "#39FF14", "fontSize": 32, "fontWeight": 800 }
    },
    {
      "type": "FrameBox",
      "style": { "maxWidth": 600, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 12 },
          "children": [
            { "type": "Icon", "data": { "name": "bell", "size": 20 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "플로우 설명 → 화살표 포함" }, "style": { "color": "#ffffff", "fontSize": 18 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **문제→해결, 질문→답변, 기능 소개** 씬에 적용
- 수직 스토리 흐름: 질문(gray) → 아이콘(green) → 키워드(green bold) → 설명카드(green)
- **2종 FrameBox 대비**: 상단 gray border(문제) vs 하단 green border(솔루션)
- 중앙 Icon이 전환점(pivot) — 위아래를 시각적으로 분리
- 솔루션 Headline: accent green, 큰 볼드
- 설명 카드 안에 **아이콘+텍스트 인라인** (→ 포함)
- 전체 요소 5개 — 밀도 높지만 수직 흐름 명확

---

## REF-011: 허브-스포크 다이어그램 + 통계 강조 (CycleDiagram + StatNumber)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 중심-위성 관계, 지휘/관리 구조, 허브 앤 스포크, 역할 분배
**아키타입 매핑:** X (CycleDiagram) + R (StatNumber) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│                 ○ 기획                                    │
│               ╱                ╲                          │
│        ○ 디자인 ── ◉ 지휘자(나) ── ○ 코딩                 │
│               ╲                ╱                          │
│           ○ 검토 ────── ○ 정리                            │
│                                                          │
│      [BodyText: white, md, "오케스트라처럼 Claude를 지휘"]  │
│                                                          │
│      [gray sm "처리 가능한 작업량"] [StatNumber "O배" green xl] │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 중앙 허브 | PersonAvatar ~80px, **accent green border ring**(3px), 내부 user 아이콘 white |
| 위성 노드 | 원형 ~56px, fill: #0d1f0d, border: 2px #39FF14(약간 어두운 green) |
| 위성 아이콘 | orange/coral(#e8845c), ~28px (REF-005와 동일 보조색) |
| 위성 라벨 | gray(#888), sm(~14px), 원 아래 |
| 연결선 | 점선(dashed), gray(#555), 허브→각 위성 |
| 허브 라벨 | **accent green**, bold, ~18px, "지휘자 (나)" |
| 중간 텍스트 | white, bold, ~22px, 비유 문장 |
| StatNumber | **accent green**, 매우 큰 볼드 ~72px, "O배" 형태 |
| StatNumber 접두 | gray, sm, "처리 가능한 작업량" — 좌측 인라인 |
| 배치 | 5개 위성이 중앙 주위 **방사형** 배치 (상1, 좌1, 우1, 하좌1, 하우1) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "20px 80px" },
  "children": [
    {
      "type": "CycleDiagram",
      "data": {
        "centerLabel": "지휘자 (나)",
        "centerIcon": "user",
        "steps": ["기획", "코딩", "정리", "검토", "디자인"],
        "variant": "hub-spoke"
      },
      "style": {
        "size": 320,
        "nodeSize": 56,
        "centerSize": 80,
        "lineStyle": "dashed",
        "lineColor": "#555555",
        "nodeBackground": "#0d1f0d",
        "nodeBorder": "2px solid #2a6e2a",
        "nodeIconColor": "#e8845c",
        "centerBorder": "3px solid #39FF14"
      }
    },
    {
      "type": "BodyText",
      "data": { "text": "비유 설명 한 줄" },
      "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "baseline", "justify": "center", "gap": 12 },
      "children": [
        { "type": "BodyText", "data": { "text": "설명 접두" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "StatNumber", "data": { "value": "O배" }, "style": { "color": "#39FF14", "fontSize": 72, "fontWeight": 800 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **허브-스포크, 중심-위성, 관리/지휘 구조** 씬에 적용
- 중앙 허브: 크고 강조(green border), 위성: 작고 약한(dark green)
- 연결선: **점선(dashed)**, gray — 실선보다 가벼운 느낌
- 위성 아이콘: **보조 색상(orange)** — 중앙과 구분
- 아래에 StatNumber로 **임팩트 수치** 강조
- StatNumber 옆에 gray 설명 텍스트 인라인 (baseline 정렬)
- 방사형 배치 — 원형이 아닌 다이아몬드/오각형도 가능

---

## 애니메이션 가이드라인 (모든 REF 공통)

### 의미 기반 모션

아이콘/그래픽의 의미에 맞는 **미세 애니메이션**을 적용합니다:

| 아이콘/요소 | 애니메이션 | Remotion 구현 |
|-----------|----------|-------------|
| 🔔 알람벨 | **좌우 흔들림**(swing) | `rotate: Math.sin(frame * 0.3) * 8 + 'deg'` |
| ⚡ 번개 | **깜빡임**(pulse) | `opacity: 0.7 + Math.sin(frame * 0.2) * 0.3` |
| 🔄 순환 | **느린 회전** | `rotate: (frame % 90) * 4 + 'deg'` |
| ⬆️ 상승 | **위아래 떠다님**(float) | `translateY: Math.sin(frame * 0.1) * 4` |
| ✨ 반짝임 | **스케일 펄스** | `scale: 1 + Math.sin(frame * 0.15) * 0.05` |
| 허브 연결선 | **점선 흐름** | `strokeDashoffset: -frame * 0.5` |

### 적용 규칙

- 아이콘의 **의미와 일치하는** 모션만 적용 (장식적 모션 금지)
- 진폭 작게 (±5~10deg, ±3~5px) — 미세하게
- 주기 느리게 (0.1~0.3 * frame) — 과하지 않게
- 1씬에 애니메이션 아이콘 **최대 1~2개** (과다 사용 금지)
- enterAt 이후부터 애니메이션 시작

---

## REF-012: 좌우 VS 대비 (✕ vs ✓ Split + 중앙 수직선)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 나쁜/좋은, 기존/신규, Before/After 대비
**아키타입 매핑:** C (좌우 VS 대비) 정석

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│        🔒 [Headline: accent green, bold, md]              │
│           ← Badge(green fill) + Headline 인라인           │
│                                                          │
│     ✕ (white, 원형)     │      ✓ (green, 원형 fill)      │
│                         │                                │
│    기존 방식 (white,bold)│    Boris 방식 (green,bold)      │
│                         │                                │
│    "이거 만들어줘"       │    계획 모드 먼저               │
│    바로 실행             │    설계 완료 후 실행            │
│    여러 번 수정          │    한 번에 끝낸다 ← green 강조  │
│         (gray)          │         (gray + green 마지막줄) │
│                         │                                │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 상단 Badge | accent green fill, 원형, ~32px, 아이콘(🔒) 내부 |
| 상단 Headline | accent green, bold, ~28px, Badge 우측 인라인 |
| 중앙 수직선 | **LineConnector(vertical)**, gray(#555), 1px, 높이 ~200px |
| 좌측 아이콘 | ✕ (X mark), **white**, 원형 outline, ~40px |
| 우측 아이콘 | ✓ (checkmark), **accent green**, 원형 fill, ~40px |
| 좌측 제목 | white, bold, ~24px |
| 우측 제목 | **accent green**, bold, ~24px |
| 좌측 항목 | gray(#888), ~16px, 3줄 리스트, 중앙 정렬 |
| 우측 항목 | gray(#888), ~16px, 마지막 줄만 **accent green** 강조 |
| Split 비율 | 1:1, gap: 수직선 포함 ~40px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 12 },
      "children": [
        {
          "type": "Badge",
          "data": { "text": "🔒" },
          "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36 }
        },
        {
          "type": "Headline",
          "data": { "text": "제목 키워드" },
          "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 }
        }
      ]
    },
    {
      "type": "Split",
      "layout": { "ratio": [1, 1], "gap": 40 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "x-circle", "size": 40 },
              "style": { "color": "#ffffff" }
            },
            {
              "type": "Headline",
              "data": { "text": "기존 방식" },
              "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 }
            },
            {
              "type": "BulletList",
              "data": { "items": ["항목1", "항목2", "항목3"], "variant": "none" },
              "style": { "color": "#888888", "fontSize": 16, "textAlign": "center" }
            }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "check-circle", "size": 40 },
              "style": { "color": "#39FF14" }
            },
            {
              "type": "Headline",
              "data": { "text": "새 방식" },
              "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 }
            },
            {
              "type": "BulletList",
              "data": { "items": ["항목1", "항목2", "항목3(강조)"], "variant": "none" },
              "style": { "color": "#888888", "fontSize": 16, "textAlign": "center" }
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **A vs B 대비** 씬에 적용 (나쁜/좋은, 이전/이후, 기존/신규)
- 반드시 **중앙 수직선**(LineConnector vertical) 포함 — 좌우 영역 명확 분리
- 좌측: white 계열 (✕, white 제목, gray 항목) — 부정/약한
- 우측: green 계열 (✓, green 제목, gray+green 항목) — 긍정/강한
- 마지막 항목만 **accent green 강조** — 핵심 차별점
- 상단에 Badge+Headline 인라인으로 **주제 제시**
- 각 측 항목 3줄 이내, 중앙 정렬
- 각 항목은 키워드형 (문장 금지, ~8자 이내)

---

## REF-013: 좌측 일러스트 + 우측 번호 스텝 리스트 (Split Illustration + Steps)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 기능 동작 방식 설명, 단계별 프로세스 + 시각 보조
**아키타입 매핑:** L (Split 비대칭) + I (수직 스텝카드) 혼합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│              [BodyText: gray, sm, 주제 설명]              │
│                                                          │
│  ┌────────────┐    ❶ 제목 (white, bold)                  │
│  │            │       설명 (gray, sm)                    │
│  │  와이어     │                                          │
│  │  프레임     │    ❷ 제목 (white, bold)                  │
│  │  일러스트   │       설명 (gray, sm)                    │
│  │  (green    │                                          │
│  │   선화)    │    ❸ 제목 (GREEN, bold) ← 활성/강조       │
│  │            │       설명 (gray, sm)                    │
│  └────────────┘                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 상단 주제 | BodyText, gray(#888), sm, 중앙 정렬 |
| 좌측 일러스트 | green 선화(wireframe), ~240×200px, 와이어프레임/설계도 느낌 |
| 일러스트 스타일 | stroke: accent green(#39FF14), fill: none, 배경: 그리드(#1a1a1a) |
| 번호 뱃지 (비활성) | gray fill(#555), 원형, ~32px, 숫자 white |
| 번호 뱃지 (활성) | **accent green fill**, 원형, ~32px, 숫자 dark |
| 스텝 제목 (비활성) | white, bold, ~22px |
| 스텝 제목 (활성) | **accent green**, bold, ~22px |
| 스텝 설명 | gray(#888), sm(~14px), 1줄 부연 |
| 스텝 간격 | gap: ~32px |
| Split 비율 | ~1:1.5 (좌 일러스트 : 우 스텝 리스트) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "주제 설명" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "Split",
      "layout": { "ratio": [1, 1.5], "gap": 48 },
      "style": { "maxWidth": 1000 },
      "children": [
        {
          "type": "Icon",
          "data": { "name": "blueprint", "size": 200 },
          "style": { "color": "#39FF14", "opacity": 0.7 }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 28 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "flex-start", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "1" }, "style": { "background": "#555555", "color": "#ffffff", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "children": [
                    { "type": "Headline", "data": { "text": "스텝 제목" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "부연 설명" }, "style": { "color": "#888888", "fontSize": 14 } }
                  ]
                }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "flex-start", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "2" }, "style": { "background": "#555555", "color": "#ffffff", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "children": [
                    { "type": "Headline", "data": { "text": "스텝 제목" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "부연 설명" }, "style": { "color": "#888888", "fontSize": 14 } }
                  ]
                }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "flex-start", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "children": [
                    { "type": "Headline", "data": { "text": "핵심 스텝" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "부연 설명" }, "style": { "color": "#888888", "fontSize": 14 } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **동작 방식 설명, 단계별 프로세스 + 시각 보조** 씬에 적용
- Split 좌측: **시각 요소** (와이어프레임, 아이콘, 설계도, 목업)
- Split 우측: **번호 스텝 리스트** (Badge + 제목 + 설명 수직)
- **활성/비활성 스텝**: 마지막(또는 현재) 스텝만 green Badge+제목, 나머지 gray
- 번호 뱃지: 비활성=gray fill, 활성=accent green fill
- 스텝 설명: gray, 1줄, 짧게 (콤마 구분 키워드)
- 좌측 일러스트: green 선화 — 와이어프레임/설계도 느낌 (fill 없이 stroke만)
- 일러스트 뒤 **그리드 배경**: 어두운 #1a1a1a 격자선 (기술적 느낌)

---

## REF-014: 인물 인용문 + 강조 바 (PersonAvatar + QuoteText + Accent Bars)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 핵심 인용, 전문가 발언 강조, 권위 있는 메시지 전달
**아키타입 매핑:** H (인용문 중심) + Z (인물 프로필) 혼합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  ┌──────┐  "                                             │
│  │  BC  │  핵심 인용문 1줄 (green, bold, lg)              │
│  │      │  부연 문장 (white, md)                          │
│  └──────┘  마무리 문장 (white, md)                        │
│  Boris                                                   │
│  Cherny     ═══════════════════  ← green 강조 바 3줄      │
│  역할        ═══════════════════                          │
│              ═══════════════════                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar | ~80px 원형, fill: #2a5a2a(어두운 green), border: 2px accent green |
| 이니셜 | green(accent), bold, ~28px, 원 중앙 |
| 인물명 | accent green, bold, ~18px, 아바타 아래 |
| 역할 | gray(#888), sm(~14px), 이름 아래 |
| 큰따옴표 " | accent green, ~40px, bold, 인용 시작 표시 |
| 인용 1줄 (핵심) | **accent green**, bold, ~28px — 가장 강조 |
| 인용 2~3줄 (부연) | white, bold, ~22px |
| 강조 바 (Accent Bars) | accent green, ~8px 높이, 너비 다양 (80%/90%/85%), 3줄, gap:6px |
| 레이아웃 | Split(좌:아바타+정보, 우:인용+바), ratio [1, 2.5] |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 100px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "gap": 40 },
      "style": { "maxWidth": 1000 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "style": { "minWidth": 120 },
          "children": [
            {
              "type": "PersonAvatar",
              "data": { "name": "인물명", "initials": "BC" },
              "style": {
                "width": 80, "height": 80,
                "background": "#2a5a2a",
                "border": "2px solid #39FF14",
                "borderRadius": "50%",
                "fontSize": 28, "fontWeight": 700,
                "color": "#39FF14"
              }
            },
            { "type": "BodyText", "data": { "text": "인물명" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 18 } },
            { "type": "BodyText", "data": { "text": "역할" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 12 },
          "children": [
            { "type": "BodyText", "data": { "text": "\"" }, "style": { "color": "#39FF14", "fontSize": 40, "fontWeight": 700, "lineHeight": 0.8 } },
            { "type": "Headline", "data": { "text": "핵심 인용문" }, "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 800 } },
            { "type": "BodyText", "data": { "text": "부연 문장 1" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "마무리 문장" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 6 },
              "style": { "marginTop": 12 },
              "children": [
                { "type": "Divider", "style": { "background": "#39FF14", "height": 8, "width": "90%", "borderRadius": 4 } },
                { "type": "Divider", "style": { "background": "#39FF14", "height": 8, "width": "95%", "borderRadius": 4 } },
                { "type": "Divider", "style": { "background": "#39FF14", "height": 8, "width": "85%", "borderRadius": 4 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **핵심 인용, 전문가 발언, 권위 메시지** 씬에 적용
- 좌: PersonAvatar + 이름 + 역할 (수직)
- 우: 큰따옴표 → 핵심 인용(green bold) → 부연(white bold) → 강조 바
- **강조 바 (Accent Bars)**: accent green 수평 막대 3줄 — 인용 아래 시각적 무게감
  - 높이 ~8px, 너비 불균일 (80~95%) — 동적 느낌
  - 바가 **순차 등장** (enterAt 간격 6프레임) — 슬라이딩 모션
- 인용 첫 줄만 **accent green**, 나머지는 white — 계층 구분
- 큰따옴표(")는 장식 — green, 큰 사이즈, 텍스트 바로 위
- Avatar 배경: **어두운 green**(#2a5a2a) — REF-003보다 진한 톤

---

## REF-015: A→B 핸드오프 플로우 + 결과 카드 (2노드 Arrow + InsightTile)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 역할 전달, 협업 구조, A가 만들고 B가 검토, 핸드오프
**아키타입 매핑:** E (프로세스 플로우) + F (FrameBox + InsightTile) 혼합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [BodyText: gray, sm, 도입문]                     │
│                                                          │
│     ╭────╮               ╭────╮                          │
│     │ ✳  │  ──────→     │ ✳  │                          │
│     ╰────╯  (green)      ╰────╯                          │
│    green     "동사 라벨"    white/gray                     │
│    border    (gray, sm)    border                        │
│                                                          │
│    Claude A               Claude B                       │
│    역할 설명               역할 설명                       │
│    (green)                (white/gray)                    │
│                                                          │
│  ┌──────────────────────────────────────┐                │
│  │ ✓ 결과/인사이트 한 줄                 │ ← FrameBox    │
│  └──────────────────────────────────────┘  (green border)│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 도입문 | gray(#888), sm, 중앙 |
| 노드 A (발신) | 원형 ~80px, **accent green border**(3px), fill: #0d1f0d, 아이콘: orange |
| 노드 B (수신) | 원형 ~80px, **white/gray border**(2px), fill: #1a1a1a, 아이콘: orange |
| 화살표 | ArrowConnector, **accent green**, 큰 화살표 (→), 두꺼운 선 |
| 화살표 라벨 | gray(#888), sm, 화살표 아래 "동사 키워드" (비판적 검토 등) |
| 노드 A 라벨 | **accent green**, bold, ~20px + gray 역할 sm |
| 노드 B 라벨 | **white**, bold, ~20px + gray 역할 sm |
| 결과 FrameBox | maxWidth:700, fill: #0d1f0d, **border: accent green**, radius: 12px |
| 결과 텍스트 | ✓ 아이콘(green) + white bold 텍스트, 인라인 |
| 전체 | 중앙 정렬, 플로우 row + 결과 카드 수직 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "도입 설명" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "justify": "center", "gap": 32 },
      "style": { "maxWidth": 800 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "sparkle", "size": 48 },
              "style": {
                "color": "#e8845c",
                "background": "#0d1f0d",
                "border": "3px solid #39FF14",
                "borderRadius": "50%",
                "width": 80, "height": 80
              }
            },
            { "type": "BodyText", "data": { "text": "Agent A" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 20 } },
            { "type": "BodyText", "data": { "text": "역할" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 4 },
          "children": [
            { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#39FF14", "strokeWidth": 3 } },
            { "type": "BodyText", "data": { "text": "동사 라벨" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "sparkle", "size": 48 },
              "style": {
                "color": "#e8845c",
                "background": "#1a1a1a",
                "border": "2px solid #888888",
                "borderRadius": "50%",
                "width": 80, "height": 80
              }
            },
            { "type": "BodyText", "data": { "text": "Agent B" }, "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 20 } },
            { "type": "BodyText", "data": { "text": "역할" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "style": {
        "maxWidth": 700,
        "background": "#0d1f0d",
        "border": "1px solid #39FF14",
        "borderRadius": 12,
        "padding": "16px 24px"
      },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 12 },
          "children": [
            { "type": "Icon", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "결과/인사이트 한 줄" }, "style": { "color": "#ffffff", "fontWeight": 700, "fontSize": 20 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **A→B 핸드오프, 협업, 역할 전달** 씬에 적용
- 노드 2개 + 화살표: A(green border, 주체) → B(gray border, 수신)
- **색상으로 주체 구분**: 발신=green, 수신=white/gray
- 화살표 아래 **동사 라벨** (gray sm) — "비판적 검토", "전달", "검증" 등
- 하단 결과 카드: ✓ 아이콘 + 핵심 결과 1줄
- REF-001(3스텝)과 달리 **2노드만** — 더 큰 원, 더 여유로운 간격
- 아이콘 색상: **orange(보조색)** — 양쪽 동일 (아이콘이 아닌 border로 구분)

---

## REF-016: 번호 뱃지 히어로 + 핵심 키워드 + 태그 카드 + 대형 아이콘 (Badge Hero)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 챕터/섹션 시작, 핵심 팁 강조, 중요 포인트 선언
**아키타입 매핑:** A (히어로 오버레이) + B (풀블리드 임팩트) 혼합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│              ❸ (green fill 원형 + gray 링)                │
│              ← Badge 히어로, 번호/아이콘                    │
│                                                          │
│      [Headline: accent green, bold, xl, 핵심 키워드]      │
│                                                          │
│  ┌──────────────────────────────────┐                    │
│  │ ★ 태그/라벨 텍스트 (green)        │ ← FrameBox(green) │
│  └──────────────────────────────────┘                    │
│                                                          │
│              🔍 (green, ~60px)                            │
│              ← 대형 아이콘 히어로                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 번호 Badge | accent green fill, ~44px 원형, 숫자/아이콘 dark, **gray 외곽 링**(2px #555) |
| Headline | **accent green**, bold, ~32px, 명령형/선언형 키워드 |
| FrameBox (태그) | maxWidth: fit-content, fill: transparent, **border: 1px accent green**, radius: 8px, padding: 8px 20px |
| 태그 텍스트 | accent green, ~16px, ★ 아이콘 접두 |
| 대형 아이콘 | accent green, ~60px, 개념 대표 (🔍, 🔔, ⚡ 등) |
| 수직 흐름 | Badge → Headline → 태그 카드 → 아이콘, 모두 중앙 정렬 |
| 간격 | 요소 간 gap: ~24px, 전체 여백 넉넉 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Badge",
      "data": { "text": "3" },
      "style": {
        "background": "#39FF14",
        "color": "#000000",
        "borderRadius": "50%",
        "width": 44, "height": 44,
        "fontSize": 20, "fontWeight": 700,
        "boxShadow": "0 0 0 3px #555555"
      }
    },
    {
      "type": "Headline",
      "data": { "text": "핵심 키워드 선언" },
      "style": { "color": "#39FF14", "fontSize": 32, "fontWeight": 800 }
    },
    {
      "type": "FrameBox",
      "style": {
        "background": "transparent",
        "border": "1px solid #39FF14",
        "borderRadius": 8,
        "padding": "8px 20px",
        "width": "fit-content"
      },
      "children": [
        {
          "type": "BodyText",
          "data": { "text": "★ 태그 라벨 텍스트" },
          "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 600 }
        }
      ]
    },
    {
      "type": "Icon",
      "data": { "name": "search", "size": 60 },
      "style": { "color": "#39FF14" }
    }
  ]
}
```

### 적용 규칙

- **챕터 시작, 핵심 팁, 중요 포인트 선언** 씬에 적용
- Badge 히어로: green fill 원형 + **gray 외곽 링** (boxShadow로 구현)
- **전체 accent green 톤** — 강한 임팩트, 짧은 씬(5~10초)에 적합
- 태그 카드: fit-content 너비, 짧은 1줄 (★ 접두)
- 대형 아이콘: 개념 대표, green, ~60px
- 요소 4개 모두 **중앙 정렬 수직 스택** — 극도로 심플
- 텍스트 최소화: Headline 1줄 + 태그 1줄만

---

## REF-017: 4단계 프로세스 플로우 — 점진적 활성화 (Progressive Circle Flow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 단계별 프로세스, 파이프라인, 진행 흐름 (4스텝)
**아키타입 매핑:** E (수평 프로세스 플로우) 확장 — 점진적 색상 활성화

### 화면 구성

```
┌──────────────────────────────────────────────────────────────┐
│ (배경: #000000)                                               │
│                                                              │
│          [BodyText: gray, sm, 주제 설명]                      │
│                                                              │
│    ○ gray  →  ○ gray  →  ◉ GREEN  →  ◉ GREEN               │
│    아이콘A     아이콘B     아이콘C      아이콘D                  │
│                                                              │
│   작업 지시   작업 완료   스스로 점검   품질 향상                 │
│   (gray)     (gray)     (GREEN)      (GREEN)                 │
│                                                              │
│  ┌──────────────────────────────────────────┐                │
│  │  인사이트 한 줄 → 화살표 포함              │ ← FrameBox   │
│  └──────────────────────────────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 비활성 원 (1~2단계) | ~60px, **gray border**(2px #555), fill: transparent, 아이콘: gray(#888) |
| 활성 원 (3~4단계) | ~70px(약간 큼), **accent green border**(3px), fill: transparent, 아이콘: green |
| 아이콘 | 각 단계별 고유 아이콘 (📋→✓→🔍→📈), ~28px |
| 화살표 | gray(#888), 가느다란, → |
| 비활성 라벨 | gray(#888), sm, ~16px |
| 활성 라벨 | **accent green**, sm, ~16px, bold |
| 원 크기 변화 | 비활성 ~60px → 활성 ~70px — **점진적 크기 증가** |
| FrameBox | maxWidth:700, fill: #1a1a1a, border: 1px #3a3a3a, radius: 12px |
| FrameBox 텍스트 | white, ~18px, → 화살표 포함 플로우 문장 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "주제 설명" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "justify": "center", "gap": 24 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            { "type": "Icon", "data": { "name": "list", "size": 28 }, "style": { "color": "#888888", "border": "2px solid #555555", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "1단계" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            { "type": "Icon", "data": { "name": "check", "size": 28 }, "style": { "color": "#888888", "border": "2px solid #555555", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "2단계" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            { "type": "Icon", "data": { "name": "search", "size": 32 }, "style": { "color": "#39FF14", "border": "3px solid #39FF14", "borderRadius": "50%", "width": 70, "height": 70 } },
            { "type": "BodyText", "data": { "text": "3단계" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 600 } }
          ]
        },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            { "type": "Icon", "data": { "name": "trending-up", "size": 32 }, "style": { "color": "#39FF14", "border": "3px solid #39FF14", "borderRadius": "50%", "width": 70, "height": 70 } },
            { "type": "BodyText", "data": { "text": "4단계" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 600 } }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "style": { "maxWidth": 700, "background": "#1a1a1a", "border": "1px solid #3a3a3a", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        { "type": "BodyText", "data": { "text": "인사이트 → 화살표 포함" }, "style": { "color": "#ffffff", "fontSize": 18 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **4단계 파이프라인, 진행 흐름** 씬에 적용 (REF-001은 3단계)
- **점진적 활성화**: 앞쪽 gray(완료/기본) → 뒤쪽 green(핵심/강조)
- 활성 원이 **약간 더 큼** (60px→70px) — 시각적 무게 차이
- 각 원에 **고유 아이콘** (단순 번호 아닌 의미 있는 아이콘)
- 화살표: **모두 gray** — 색상 대비는 원에서만
- 하단 FrameBox: **gray border**(neutral) — 보충 설명/경고
- REF-001 차이: 3스텝→4스텝, 동일색→점진적 활성화, circle icon 스타일

---

## REF-018: 비유 좌우 대비 — 아이콘 스토리 + 결과 태그 (Metaphor Split)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 비유를 통한 대비, 같은 행동의 다른 결과, 올바른 방법 vs 잘못된 방법
**아키타입 매핑:** C (좌우 VS 대비) 변형 — 아이콘 스토리텔링 + 결과 태그

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [BodyText: gray, sm, "비유 주제"]                │
│                                                          │
│     👨‍🍳 (gray)     │      👨‍🍳 (green)                     │
│     🍲 (gray)     │      🍲 (green)                     │
│                    │                                     │
│     맛 안 봄       │      맛 봄                           │
│     (white,bold)   │      (GREEN,bold)                   │
│                    │                                     │
│     완성→바로 제출  │      완성→직접 확인                   │
│     (gray, sm)     │      (gray, sm)                     │
│                    │                                     │
│  ┌────────────┐    │   ┌────────────┐                    │
│  │완성했습니다 ✕│   │   │완성했습니다 ✓│                    │
│  └─ gray border┘   │   └─green border┘                   │
│                    │                                     │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 도입문 | gray(#888), sm, "비유 주제" |
| 중앙 수직선 | LineConnector(vertical), gray(#555), 1px |
| 좌측 아이콘 (부정) | gray/white 계열, ~40px, 2개 수직 (행위자 + 도구) |
| 우측 아이콘 (긍정) | **accent green** 계열, ~40px, 2개 수직 (동일 구성) |
| 좌측 제목 | white, bold, ~22px |
| 우측 제목 | **accent green**, bold, ~22px |
| 프로세스 설명 | gray(#888), sm, "완성 → 동사" 형태, → 화살표 포함 |
| 좌측 결과 태그 | FrameBox, gray border(#555), "텍스트 ✕" (red ✕) |
| 우측 결과 태그 | FrameBox, **green border**, "텍스트 ✓" (green ✓) |
| ✕ 아이콘 | red/orange(#e8845c), ~16px |
| ✓ 아이콘 | accent green, ~16px |
| 각 측 내부 | Stack(col, center): 아이콘2개 → 제목 → 설명 → 결과태그 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "비유 주제" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "Split",
      "layout": { "ratio": [1, 1], "gap": 40 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            { "type": "Icon", "data": { "name": "chef", "size": 40 }, "style": { "color": "#888888" } },
            { "type": "Icon", "data": { "name": "bowl", "size": 36 }, "style": { "color": "#888888" } },
            { "type": "Headline", "data": { "text": "부정 라벨" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "완성 → 바로 제출" }, "style": { "color": "#888888", "fontSize": 16 } },
            {
              "type": "FrameBox",
              "style": { "background": "transparent", "border": "1px solid #555555", "borderRadius": 8, "padding": "8px 16px" },
              "children": [
                {
                  "type": "Stack",
                  "layout": { "direction": "row", "align": "center", "gap": 8 },
                  "children": [
                    { "type": "BodyText", "data": { "text": "결과 메시지" }, "style": { "color": "#888888", "fontSize": 16 } },
                    { "type": "Icon", "data": { "name": "x", "size": 16 }, "style": { "color": "#e8845c" } }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            { "type": "Icon", "data": { "name": "chef", "size": 40 }, "style": { "color": "#39FF14" } },
            { "type": "Icon", "data": { "name": "bowl", "size": 36 }, "style": { "color": "#39FF14" } },
            { "type": "Headline", "data": { "text": "긍정 라벨" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "완성 → 직접 확인" }, "style": { "color": "#888888", "fontSize": 16 } },
            {
              "type": "FrameBox",
              "style": { "background": "transparent", "border": "1px solid #39FF14", "borderRadius": 8, "padding": "8px 16px" },
              "children": [
                {
                  "type": "Stack",
                  "layout": { "direction": "row", "align": "center", "gap": 8 },
                  "children": [
                    { "type": "BodyText", "data": { "text": "결과 메시지" }, "style": { "color": "#39FF14", "fontSize": 16 } },
                    { "type": "Icon", "data": { "name": "check", "size": 16 }, "style": { "color": "#39FF14" } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **비유 대비** 씬에 적용 — REF-012(텍스트 대비)보다 **시각적으로 풍부**
- 양쪽에 **동일 구성의 아이콘 쌍** (행위자+도구) — 색상만 다름
- 좌=gray(부정), 우=green(긍정) — REF-012와 동일 색상 원칙
- **결과 태그**: 좌=gray border+✕(red), 우=green border+✓(green)
- ✕ 아이콘: **red/orange** (accent green의 보색 대비)
- 프로세스 설명에 **→ 화살표** 포함 ("완성 → 동사")
- REF-012와의 차이: 텍스트 리스트→아이콘 스토리, 결과를 태그 카드로 표현

---

## REF-019: 인물 + 대형 통계 + 수평 바 비교 (PersonAvatar + StatNumber + CompareBars)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 데이터 기반 주장, 수치 비교, 전문가 인용+근거 데이터
**아키타입 매핑:** Z (인물) + R (StatNumber) + M (CompareBars) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  ┌──────┐   2.5배  (accent green, 매우 큰 볼드 ~80px)    │
│  │  BC  │   최종 결과물 품질 향상 (white, bold, ~24px)    │
│  └──────┘                                                │
│  Boris       확인 없음  ████████████  1x  (gray 바)      │
│  Cherny      확인 있음  ████████████████████  3x (green)  │
│  역할                                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar | ~80px 원형, fill: #2a5a2a, border: 2px accent green |
| 이니셜 | green, bold, ~28px |
| 인물명 | accent green, bold, ~18px |
| 역할 | gray(#888), sm(~14px) |
| StatNumber | **accent green**, 매우 큰 볼드 **~80px**, "2.5배" |
| 부제 | white, bold, ~24px, StatNumber 바로 아래 |
| CompareBars | 2개 수평 바, maxWidth: ~500px |
| 바 (기준) | gray(#666) fill, 짧음(~60%), 라벨: white "1x", radius: 20px full-round |
| 바 (강조) | **accent green** fill, 길음(~100%), 라벨: green "3x", radius: 20px full-round |
| 바 라벨 (좌) | white, ~16px, 바 좌측에 "확인 없음" / "확인 있음" |
| 바 라벨 (우) | 바 안쪽 우측 끝에 "1x" / "3x" |
| 레이아웃 | Split(좌:아바타, 우:StatNumber+부제+바), 우측이 더 넓음 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 100px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "gap": 40 },
      "style": { "maxWidth": 1000 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "style": { "minWidth": 120 },
          "children": [
            {
              "type": "PersonAvatar",
              "data": { "name": "인물명", "initials": "BC" },
              "style": { "width": 80, "height": 80, "background": "#2a5a2a", "border": "2px solid #39FF14", "borderRadius": "50%", "fontSize": 28, "fontWeight": 700, "color": "#39FF14" }
            },
            { "type": "BodyText", "data": { "text": "인물명" }, "style": { "color": "#39FF14", "fontWeight": 700, "fontSize": 18 } },
            { "type": "BodyText", "data": { "text": "역할" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 16 },
          "children": [
            { "type": "StatNumber", "data": { "value": "2.5배" }, "style": { "color": "#39FF14", "fontSize": 80, "fontWeight": 800 } },
            { "type": "Headline", "data": { "text": "부제 설명" }, "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 } },
            {
              "type": "CompareBars",
              "data": {
                "items": [
                  { "label": "기준", "value": 60, "displayValue": "1x" },
                  { "label": "강조", "value": 100, "displayValue": "3x" }
                ]
              },
              "style": {
                "maxWidth": 500,
                "barHeight": 36,
                "barRadius": 20,
                "baseColor": "#666666",
                "accentColor": "#39FF14"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **데이터 기반 주장, 수치 비교 + 전문가 권위** 씬에 적용
- PersonAvatar(좌) + 데이터(우) — 인물이 데이터의 출처/근거
- StatNumber: **매우 큼(80px)**, accent green — 화면의 주인공
- CompareBars: **full-round 바** (radius: 20px), 2개 비교
  - 기준 바: gray, 짧음
  - 강조 바: green, 길음 — 길이 차이로 직관적 비교
- 바 안쪽 우측에 배수 라벨 ("1x", "3x")
- 바 좌측에 조건 라벨 ("확인 없음", "확인 있음")
- REF-002(RingChart)와 달리 **절대값 비교** — 비율보다 차이 강조

---

## REF-020: 2열 대형 카드 비교 + 인사이트 (Large Card Pair + InsightTile)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 2가지 옵션/유형 분류, 선택지 제시, 간단/복잡 구분
**아키타입 매핑:** O (CompareCard) 변형 — 대형 FrameBox 2열

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [BodyText: gray, sm, 주제 설명]                  │
│                                                          │
│  ┌───────────────────┐  ┌───────────────────┐            │
│  │                   │  │                   │            │
│  │    📋 (white)     │  │    📋✓ (green)    │            │
│  │    아이콘 ~60px    │  │    아이콘 ~60px    │            │
│  │                   │  │                   │            │
│  │   간단한 작업      │  │   복잡한 작업      │            │
│  │   (white, bold)   │  │   (GREEN, bold)   │            │
│  │                   │  │                   │            │
│  │   설명 2줄        │  │   설명 2줄         │            │
│  │   (gray, sm)      │  │   (gray, sm)      │            │
│  │                   │  │                   │            │
│  └── gray border ────┘  └── GREEN border ───┘            │
│                                                          │
│  ┌──────────────────────────────────────────┐            │
│  │ ● 인사이트 — 부분 green 강조 텍스트       │ InsightTile │
│  └──────────────────────────────────────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 도입문 | gray(#888), sm |
| 카드 (기본) | ~320×240px, fill: #1a1a1a, **border: 1px #555(gray)**, radius: 16px |
| 카드 (강조) | ~320×240px, fill: #0d1f0d(green tint), **border: 1px accent green**, radius: 16px |
| 카드 아이콘 (기본) | white, ~60px, 원형 outline 안에 배치 |
| 카드 아이콘 (강조) | **accent green**, ~60px, 원형 outline + 체크 뱃지 |
| 카드 제목 (기본) | white, bold, ~22px |
| 카드 제목 (강조) | **accent green**, bold, ~22px |
| 카드 설명 | gray(#888), sm(~16px), 2줄 이내, 중앙 정렬 |
| 카드 간격 | gap: ~24px |
| InsightTile | maxWidth:700, fill: #1a1a1a, border: 1px #3a3a3a, radius: 12px |
| InsightTile 텍스트 | green dot(●) + white 텍스트 + **부분 green 강조** (RichText) |
| 카드 padding | 넉넉함 ~32px — 카드 안에 여백 충분 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "BodyText",
      "data": { "text": "주제 설명" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "stretch", "justify": "center", "gap": 24 },
      "style": { "maxWidth": 800 },
      "children": [
        {
          "type": "FrameBox",
          "style": { "width": 320, "background": "#1a1a1a", "border": "1px solid #555555", "borderRadius": 16, "padding": "32px 24px" },
          "children": [
            { "type": "Icon", "data": { "name": "terminal", "size": 60 }, "style": { "color": "#ffffff" } },
            { "type": "Headline", "data": { "text": "옵션 A" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "설명 텍스트 2줄" }, "style": { "color": "#888888", "fontSize": 16, "textAlign": "center" } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "width": 320, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "32px 24px" },
          "children": [
            { "type": "Icon", "data": { "name": "browser-check", "size": 60 }, "style": { "color": "#39FF14" } },
            { "type": "Headline", "data": { "text": "옵션 B" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "설명 텍스트 2줄" }, "style": { "color": "#888888", "fontSize": 16, "textAlign": "center" } }
          ]
        }
      ]
    },
    {
      "type": "InsightTile",
      "data": { "text": "인사이트 — 부분 강조 포함" },
      "style": { "maxWidth": 700, "background": "#1a1a1a", "border": "1px solid #3a3a3a", "borderRadius": 12 }
    }
  ]
}
```

### 적용 규칙

- **2가지 옵션/유형 분류, 선택지 제시** 씬에 적용
- 카드 2개 나란히: 기본(gray border) vs 강조(green border)
- 카드가 **대형**(320×240px) — REF-007/008의 3열 카드보다 큼
- 각 카드 안에 **큰 아이콘(60px)** + 제목 + 설명 — 여백 넉넉
- 강조 카드: green tint 배경 + green border + green 아이콘/제목
- 하단 InsightTile: **부분 green 강조**(RichText) — 핵심 키워드만 green
- REF-012(좌우 대비)와의 차이: 수직선 없이 **카드 border 색상**으로 구분
- 2열이므로 카드가 더 크고 정보량이 많음 (3열은 REF-007/008)

---

## REF-021: 인터럽트/전환 씬 — 아이콘 히어로 + 선언 (Transition Breaker)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 흐름 중단, "잠깐!", 보너스 팁, 섹션 전환, 여담 시작
**아키타입 매핑:** T (미니멀 전환) 정석

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000, 여백 매우 넉넉)                            │
│                                                          │
│                                                          │
│              ⏸ (green 원형 outline, ~60px)                │
│              ← Icon 히어로 (전환/중단 의미)                 │
│                                                          │
│      [Headline: white, bold, lg, "잠깐만요, 하나 더!"]    │
│                                                          │
│      [BodyText: gray, sm, 부연 설명 1줄]                  │
│                                                          │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Icon 히어로 | accent green, ~60px, **원형 outline border**(2px green), 내부 아이콘 green |
| 아이콘 종류 | ⏸(일시정지), ⚡(번개), 💡(전구), ➕(추가), 🔔(알림) 등 전환 의미 |
| Headline | **white**, bold, ~32px, 감탄/선언형 ("잠깐만요!", "하나 더!", "보너스!") |
| BodyText | gray(#888), sm(~18px), 부연 설명 1줄 |
| 요소 수 | **최대 3개** — Icon + Headline + BodyText |
| 여백 | **매우 넉넉** — 화면의 60% 이상이 빈 공간 |
| 정렬 | 완전 중앙 (수평+수직) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "120px 80px" },
  "children": [
    {
      "type": "Icon",
      "data": { "name": "pause", "size": 40 },
      "style": {
        "color": "#39FF14",
        "border": "2px solid #39FF14",
        "borderRadius": "50%",
        "width": 64, "height": 64
      }
    },
    {
      "type": "Headline",
      "data": { "text": "잠깐만요, 하나 더!" },
      "style": { "color": "#ffffff", "fontSize": 32, "fontWeight": 800 }
    },
    {
      "type": "BodyText",
      "data": { "text": "부연 설명 한 줄" },
      "style": { "color": "#888888", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- **흐름 중단, 전환, 보너스 팁, 여담** 씬에 적용
- **극도로 미니멀** — 요소 3개 이하, 화면 대부분 빈 공간
- 짧은 씬 전용 (3~6초) — 시청자 주의 환기
- Icon: green 원형 outline — 작지 않은 히어로 사이즈(60px)
- Headline: **white**(green 아님) — 아이콘이 green이므로 텍스트는 white로 대비
- 부연 설명: gray, 1줄, 다음 내용 예고
- padding 매우 큼 (120px+) — 의도적 여백으로 "멈춤" 느낌
- 애니메이션: 아이콘 **스케일 펄스** (등장 시 1.2→1.0 바운스)

---

## REF-022: 중립 좌우 비교 — 대형 아이콘 + 수직선 (Neutral Icon Comparison)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 동등한 2가지 옵션, 장단점 없는 병렬 비교, 유형 분류 (어느 쪽이 우세하지 않음)
**아키타입 매핑:** C (좌우 VS 대비) 변형 — green 강조 없음, 완전 중립

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│                                                          │
│      ⚡ (white, 원형 outline)  │  ◎ (white, 원형 outline)  │
│      ~80px 대형 아이콘          │  ~80px 대형 아이콘         │
│                                │                          │
│    빠른 버전 (Haiku)           │  똑똑한 버전 (Opus)        │
│    (white, bold, ~22px)        │  (white, bold, ~22px)     │
│                                │                          │
│    [BodyText gray, sm]         │  [BodyText gray, sm]      │
│    부연 설명 1줄               │  부연 설명 1줄             │
│                                │                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 중앙 수직선 | LineConnector(vertical), gray(#555), 1px, 화면 높이 ~60% |
| 좌측 아이콘 | white(#ffffff), ~80px, **원형 outline**(border: 2px solid #555, borderRadius: 50%), 내부 아이콘 white |
| 우측 아이콘 | white(#ffffff), ~80px, **원형 outline**(border: 2px solid #555, borderRadius: 50%), 내부 아이콘 white |
| 아이콘 종류 | 각각 다른 아이콘 — 좌: ⚡(속도), 우: ◎(정밀/타겟) |
| 좌측 제목 | **white**, bold, ~22px, "유형명 (모델명)" |
| 우측 제목 | **white**, bold, ~22px, "유형명 (모델명)" |
| 부연 설명 | gray(#888), sm(~16px), 1줄 |
| 전체 색상 | **green 없음** — 모두 white/gray 톤, 완전 중립 |
| 레이아웃 | Split(1:1), 중앙 LineConnector(vertical), 양쪽 Stack(col, center) |
| 여백 | 넉넉함 — 화면의 40%+ 빈 공간, padding: 60px 100px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 100px" },
  "children": [
    {
      "type": "Split",
      "layout": { "ratio": [1, 1], "gap": 40 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "zap", "size": 48 },
              "style": {
                "color": "#ffffff",
                "border": "2px solid #555555",
                "borderRadius": "50%",
                "width": 80, "height": 80
              }
            },
            { "type": "Headline", "data": { "text": "빠른 버전" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "부연 설명" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "target", "size": 48 },
              "style": {
                "color": "#ffffff",
                "border": "2px solid #555555",
                "borderRadius": "50%",
                "width": 80, "height": 80
              }
            },
            { "type": "Headline", "data": { "text": "똑똑한 버전" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "부연 설명" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **동등한 옵션 병렬 비교** 씬에 적용 — 어느 쪽이 우세하지 않음
- REF-012/018(좌우 대비)와의 핵심 차이: **green 강조 없음** — 양쪽 모두 white/gray
- 중앙 수직선: gray(#555) — 분리선 역할만, 강조 없음
- 아이콘: **대형 원형 outline**(80px) — 각각 다른 아이콘으로 유형 구분
- 아이콘 border: **gray(#555)** — green border 아님 (중립 표현)
- 제목에 괄호로 부가 정보: "빠른 버전 (Haiku)" 형태
- 요소 적음(아이콘+제목+설명 각 1개) — REF-012보다 미니멀
- **비교 씬이지만 선호도/우열이 없을 때** 이 패턴 사용
- 선호도가 있으면 REF-012(green 강조)나 REF-020(카드 비교) 사용

---

## REF-023: 인물 → 선택 플로우 — PersonAvatar + 화살표 + 아이콘 결과 (Person Choice Flow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 특정 인물이 무엇을 선택/사용하는지, 전문가의 추천, "A는 B를 쓴다"
**아키타입 매핑:** Z (인물+플로우) 변형 — 수평 화살표로 인물→선택 연결

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│     ┌─────────┐     항상 쓰는 것    ┌─────────┐          │
│     │   BC    │     ──────→        │   ◎     │          │
│     │ (green  │     (gray, sm)      │ (green  │          │
│     │  이니셜) │                     │  아이콘) │          │
│     └─ green ─┘                     └─ green ─┘          │
│     ~160px 대형                      ~160px 대형          │
│                                                          │
│     Boris Cherny                    똑똑한 버전            │
│     (white, bold, ~28px)            (GREEN, bold, ~28px)  │
│                                                          │
│     Claude Code 창시자              ✓ 최대 성능으로 사용    │
│     (gray, sm)                      (green pill badge)    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar (좌) | **~160px 대형 원형**, fill: #1a3a1a(dark green tint), **border: 2px solid #39FF14**, glow 효과 |
| 이니셜 텍스트 | accent green, bold, ~48px, 원형 중앙 |
| 인물명 | **white**, bold, ~28px, 아바타 아래 |
| 역할 | gray(#888), sm(~16px), 인물명 아래 |
| 화살표 | ArrowConnector(right), **gray(#888)**, 두 원형 사이 중앙 |
| 화살표 라벨 | gray(#888), sm(~14px), 화살표 위에 "항상 쓰는 것" |
| 결과 아이콘 (우) | **~160px 대형 원형**, fill: transparent(또는 dark), **border: 2px solid #39FF14** |
| 아이콘 내부 | accent green, ~60px, 타겟/조준점 아이콘 |
| 결과 라벨 | **accent green**, bold, ~28px, 아이콘 아래 |
| 결과 뱃지 | Pill/Badge, green border(1px), green text, rounded-full, "✓ 키워드" |
| 원형 glow | 미세한 green 외부 그림자 (boxShadow: 0 0 20px rgba(57,255,20,0.15)) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 40 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            {
              "type": "PersonAvatar",
              "data": { "name": "Boris Cherny", "initials": "BC" },
              "style": {
                "width": 160, "height": 160,
                "background": "#1a3a1a",
                "border": "2px solid #39FF14",
                "borderRadius": "50%",
                "fontSize": 48, "fontWeight": 700, "color": "#39FF14",
                "boxShadow": "0 0 20px rgba(57,255,20,0.15)"
              }
            },
            { "type": "Headline", "data": { "text": "Boris Cherny" }, "style": { "color": "#ffffff", "fontSize": 28, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "Claude Code 창시자" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 4 },
          "children": [
            { "type": "BodyText", "data": { "text": "항상 쓰는 것" }, "style": { "color": "#888888", "fontSize": 14 } },
            { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "target", "size": 60 },
              "style": {
                "color": "#39FF14",
                "border": "2px solid #39FF14",
                "borderRadius": "50%",
                "width": 160, "height": 160,
                "boxShadow": "0 0 20px rgba(57,255,20,0.15)"
              }
            },
            { "type": "Headline", "data": { "text": "똑똑한 버전" }, "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 } },
            {
              "type": "Pill",
              "data": { "text": "✓ 최대 성능으로 사용" },
              "style": {
                "color": "#39FF14",
                "border": "1px solid #39FF14",
                "borderRadius": 20,
                "padding": "6px 16px",
                "fontSize": 16,
                "background": "transparent"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **인물의 선택/추천, "A는 B를 쓴다"** 씬에 적용
- REF-019(인물+통계)와의 차이: 데이터 대신 **선택 플로우**(화살표 연결)
- 양쪽 원형 **동일 크기(160px)** — 인물과 선택 대상이 시각적으로 동급
- 원형에 **미세 glow** (green shadow) — 프리미엄 느낌
- 화살표: **gray**, 위에 관계 라벨("항상 쓰는 것") — 두 요소의 관계 설명
- 우측 결과에 **Pill 뱃지** ("✓ 키워드") — 선택 이유/특성 강조
- 인물명: **white**, 결과 라벨: **green** — 선택 대상이 강조됨
- 3열 구조: 인물 | 화살표+라벨 | 결과 — Stack(row)

---

## REF-024: 수평 바 비교 + 반복 도트 + 인사이트 구분선 (Bar Compare with Dot Indicators)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 효율성 비교, 반복 횟수 vs 일회성, 총 비용/시간 비교, 품질 대 속도 트레이드오프
**아키타입 매핑:** M (CompareBars) 변형 — 도트 인디케이터 + 수평 구분선 + 인사이트

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [Headline: GREEN, bold, "결국에는 더 빨라요"]      │
│                                                          │
│  싸고 빠른 버전  ████████████████████████████  (white 바)  │
│                  ● ● ● ● ●  = 여러 번 수정 (gray)        │
│                                                          │
│  똑똑한 버전     ██████  (GREEN 바, 짧음)                  │
│                  ●  = 한 번에 완료 (GREEN)                 │
│                                                          │
│  ─────────────── 수평 구분선 (gray, thin) ──────────────── │
│                                                          │
│  싸게 여러 번 수리하느냐, 한 번에 제대로 고치느냐의 차이     │
│  (white + 부분 GREEN 밑줄/강조)                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | **accent green**, bold, ~28px, 중앙 정렬, 결론 선언형 |
| 바 (부정) | **white(#ffffff)** fill, full-round(radius:20px), 긴 바(~90%), maxWidth:700 |
| 바 라벨 (부정) | white, ~18px, 바 좌측에 "싸고 빠른 버전" |
| 도트 (부정) | white ●×5, ~12px 원, 바 아래 좌측 정렬, "= 여러 번 수정" gray 텍스트 |
| 바 (긍정) | **accent green** fill, full-round(radius:20px), 짧은 바(~30%), 뒤에 **gray(#333) 트랙** |
| 바 라벨 (긍정) | **accent green**, ~18px, 바 좌측에 "똑똑한 버전" |
| 도트 (긍정) | green ●×1, ~12px 원, 바 아래, "= 한 번에 완료" green 텍스트 |
| 바 트랙 | gray(#333), full-round, 바 뒤에 전체 너비로 깔림 — 진행률 표현 |
| 수평 구분선 | Divider, gray(#555), 1px, maxWidth:700, 바와 인사이트 사이 |
| 인사이트 텍스트 | white + **부분 green 밑줄 강조**(RichText), ~20px, 중앙 정렬 |
| 도트 간격 | gap: 8px, 도트끼리 등간격 |
| 바-도트 간격 | gap: 8px (바 바로 아래) |
| 바 그룹 간격 | gap: 24px (첫 그룹↔둘째 그룹) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "결국에는 더 빨라요" },
      "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "column", "gap": 24 },
      "style": { "maxWidth": 700, "width": "100%" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 8 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 16 },
              "children": [
                { "type": "BodyText", "data": { "text": "싸고 빠른 버전" }, "style": { "color": "#ffffff", "fontSize": 18, "minWidth": 140 } },
                { "type": "ProgressBar", "data": { "value": 90, "max": 100 }, "style": { "height": 36, "borderRadius": 20, "barColor": "#ffffff", "trackColor": "#333333", "flex": 1 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 8 },
              "style": { "paddingLeft": 156 },
              "children": [
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#ffffff" } },
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#ffffff" } },
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#ffffff" } },
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#ffffff" } },
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#ffffff" } },
                { "type": "BodyText", "data": { "text": "= 여러 번 수정" }, "style": { "color": "#888888", "fontSize": 16 } }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 8 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 16 },
              "children": [
                { "type": "BodyText", "data": { "text": "똑똑한 버전" }, "style": { "color": "#39FF14", "fontSize": 18, "minWidth": 140 } },
                { "type": "ProgressBar", "data": { "value": 30, "max": 100 }, "style": { "height": 36, "borderRadius": 20, "barColor": "#39FF14", "trackColor": "#333333", "flex": 1 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 8 },
              "style": { "paddingLeft": 156 },
              "children": [
                { "type": "Icon", "data": { "name": "circle-filled", "size": 12 }, "style": { "color": "#39FF14" } },
                { "type": "BodyText", "data": { "text": "= 한 번에 완료" }, "style": { "color": "#39FF14", "fontSize": 16 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Divider",
      "style": { "maxWidth": 700, "borderColor": "#555555" }
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "싸게 여러 번 수리하느냐, ", "style": "default" },
          { "text": "한 번에 제대로 고치느냐", "style": "accent-underline" },
          { "text": "의 차이", "style": "default" }
        ]
      },
      "style": { "fontSize": 20, "color": "#ffffff", "textAlign": "center" }
    }
  ]
}
```

### 적용 규칙

- **효율성/총비용 비교, 반복 vs 일회성** 씬에 적용
- REF-019(CompareBars)와의 차이: **도트 인디케이터**로 반복 횟수를 시각화
- 바 길이: 부정(긴 바) vs 긍정(짧은 바) — **짧은 게 좋다**는 역전 표현
- 도트: ●×N개로 반복 횟수 직관 표현 (5개=많음, 1개=한번)
- 바 뒤 **gray 트랙**(#333) — 전체 범위 대비 현재 값 표현
- 수평 **Divider**: 바 비교 영역과 인사이트 영역 분리
- 인사이트: **RichText** — 부분 green 밑줄/강조로 핵심 키워드 강조
- Headline이 **green 결론**(상단) — 바 비교 전에 결론을 먼저 제시
- 라벨: 부정=white, 긍정=green — 색상으로 즉각적 구분

---

## REF-025: 아이콘 히어로 + 수직선 + 불릿 리스트 (Icon Hero Split with Bullet List)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 파일/도구/개념 소개 + 세부 항목 나열, "이것은 무엇이고 어떤 내용이 있는가"
**아키타입 매핑:** L (Split 비대칭) 변형 — 좌: 대형 아이콘+라벨, 우: 수직 불릿 리스트

### 애니메이션 특징

**좌측이 먼저 중앙에서 등장 → 왼쪽으로 이동하며 수직선+우측 리스트가 순차 등장.**
- enterAt 0: 좌측 아이콘+라벨 (화면 중앙)
- enterAt 30~40: 좌측이 왼쪽으로 슬라이드, 수직선 등장
- enterAt 50: 우측 불릿 1번 항목
- enterAt 70: 우측 불릿 2번 항목
- enterAt 90: 우측 불릿 3번 항목 (**green 강조**)

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│     ┌──────────┐          │  ● 팀 작업 규칙               │
│     │  ≡ 📄    │          │    우리 팀이 따르는 규칙        │
│     │ (green   │          │    (gray, sm)                 │
│     │  outline)│          │                               │
│     └──────────┘          │  ● 방향                       │
│                            │    프로젝트 목표와 방향        │
│     CLAUDE.md              │    (gray, sm)                 │
│     (GREEN, bold, ~28px)   │                               │
│                            │  ● 반복 실수 목록              │
│     클로드 전용 메모장      │    (GREEN, bold)              │
│     (gray, sm)             │    클로드가 계속 틀리는 것들    │
│                            │    (gray, sm)                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 좌측 아이콘 | **대형 ~100px**, green outline 사각형(border: 2px solid #39FF14, radius:12px), 내부 문서 아이콘 green |
| 좌측 제목 | **accent green**, bold, ~28px, 아이콘 아래 |
| 좌측 부제 | gray(#888), sm(~16px), 제목 아래 |
| 수직 구분선 | LineConnector(vertical), gray(#555), 1px, 좌우 분리 |
| 우측 불릿 | gray ●(~8px) 기본, **green ●** 강조 항목 |
| 불릿 제목 (기본) | white, bold, ~22px |
| 불릿 제목 (강조) | **accent green**, bold, ~22px |
| 불릿 설명 | gray(#888), sm(~16px), 제목 아래 1줄 |
| 불릿 간격 | gap: 28~32px (항목 간 넉넉) |
| Split 비율 | 좌:우 = 약 2:3 (좌 좁음, 우 넓음) |
| 전체 정렬 | 수직 중앙(center) — 좌측 아이콘과 우측 리스트 중간 높이 일치 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Split",
      "layout": { "ratio": [2, 3], "gap": 40 },
      "style": { "maxWidth": 1000 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 12 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "file-text", "size": 60 },
              "style": {
                "color": "#39FF14",
                "border": "2px solid #39FF14",
                "borderRadius": 12,
                "width": 100, "height": 100,
                "background": "transparent"
              }
            },
            { "type": "Headline", "data": { "text": "CLAUDE.md" }, "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "클로드 전용 메모장" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 28 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "children": [
                {
                  "type": "Stack",
                  "layout": { "direction": "row", "align": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "data": { "name": "circle-filled", "size": 8 }, "style": { "color": "#888888" } },
                    { "type": "Headline", "data": { "text": "팀 작업 규칙" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "우리 팀이 따르는 규칙" }, "style": { "color": "#888888", "fontSize": 16, "paddingLeft": 18 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "children": [
                {
                  "type": "Stack",
                  "layout": { "direction": "row", "align": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "data": { "name": "circle-filled", "size": 8 }, "style": { "color": "#888888" } },
                    { "type": "Headline", "data": { "text": "방향" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "프로젝트 목표와 방향" }, "style": { "color": "#888888", "fontSize": 16, "paddingLeft": 18 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "children": [
                {
                  "type": "Stack",
                  "layout": { "direction": "row", "align": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "data": { "name": "circle-filled", "size": 8 }, "style": { "color": "#39FF14" } },
                    { "type": "Headline", "data": { "text": "반복 실수 목록" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "클로드가 계속 틀리는 것들" }, "style": { "color": "#888888", "fontSize": 16, "paddingLeft": 18 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **파일/도구/개념 소개 + 내부 구성 요소 나열** 씬에 적용
- **애니메이션 핵심**: 좌측이 먼저 중앙 등장 → 왼쪽 이동 → 수직선+우측 순차 등장
- 좌측: 대형 아이콘(100px) + 제목 + 부제 — **주인공 소개**
- 우측: 불릿 리스트 — 내부 항목/구성 요소 3~4개
- 마지막 불릿만 **green 강조** — 나레이션에서 강조하는 항목
- 수직 구분선: Split 중앙에 LineConnector(vertical) — 좌우 영역 분리
- REF-012(좌우 대비)와의 차이: 비교가 아닌 **소개+상세** 구조
- Split 비율 2:3 — 좌측이 약간 좁음 (아이콘은 크지만 텍스트 적음)
- 불릿 간격 넉넉(28px) — 항목이 3개뿐이므로 여유 있게 배치

---

## REF-026: 좌우 수직 플로우 대비 — 일반 vs 전문가 (Dual Vertical Flow Comparison)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 프로세스 대비, 일반적 방법 vs 올바른 방법, 짧은 플로우 vs 긴 플로우
**아키타입 매핑:** C (좌우 VS 대비) + P (수직 타임라인) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│      보통                    │     (BC) PersonAvatar      │
│      (white, bold, ~28px)    │     Boris Cherny           │
│                              │     (GREEN, bold, ~24px)   │
│      (✕) 잘못된 작업          │                            │
│      (gray 원+white 텍스트)   │     (✕) 잘못된 작업         │
│           ↓                  │     (gray 원+white 텍스트)  │
│      (↻) 그냥 다시 시키기     │          ↓                 │
│      (gray 원+white 텍스트)   │     (✎) 메모장 업데이트     │
│           → 또 같은 실수 반복  │     (GREEN 원+GREEN 텍스트) │
│           (gray, sm)          │          ↓                 │
│                              │     (✓) 같은 실수 다시 하지 마│
│                              │     (GREEN fill 원+GREEN)   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 좌측 제목 | **white**, bold, ~28px, "보통" |
| 우측 제목 | PersonAvatar(~50px, green border) + **green** bold ~24px 인물명 |
| 중앙 수직선 | LineConnector(vertical), gray(#555), 1px |
| 좌측 스텝 아이콘 | gray(#888) outline 원(~40px), 내부 아이콘 gray (✕, ↻) |
| 좌측 스텝 텍스트 | white, ~20px, 아이콘 우측 |
| 좌측 결과 | gray(#888), sm(~16px), "→ 또 같은 실수 반복" — 부정적 결말 |
| 좌측 화살표(↓) | gray(#888), ~16px |
| 우측 스텝 아이콘 (중립) | gray(#888) outline 원(~40px), 내부 아이콘 gray (✕) |
| 우측 스텝 아이콘 (행동) | **green outline** 원(~40px), 내부 아이콘 **green** (✎) |
| 우측 스텝 아이콘 (결과) | **green fill** 원(~40px), 내부 아이콘 **white** (✓) — 최종 성공 |
| 우측 스텝 텍스트 (행동) | **accent green**, bold, ~20px |
| 우측 스텝 텍스트 (결과) | **accent green**, bold, ~20px |
| 우측 화살표(↓) | **green**, ~16px |
| 좌측 스텝 수 | 2단계 (짧고 비효율) |
| 우측 스텝 수 | 3단계 (길지만 효과적) |
| 아이콘-텍스트 레이아웃 | Stack(row, center, gap:12) — 아이콘 좌, 텍스트 우 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Split",
      "layout": { "ratio": [1, 1], "gap": 40 },
      "style": { "maxWidth": 1000 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            { "type": "Headline", "data": { "text": "보통" }, "style": { "color": "#ffffff", "fontSize": 28, "fontWeight": 700 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 12 },
              "children": [
                { "type": "Icon", "data": { "name": "x", "size": 20 }, "style": { "color": "#888888", "border": "2px solid #888888", "borderRadius": "50%", "width": 40, "height": 40 } },
                { "type": "BodyText", "data": { "text": "잘못된 작업" }, "style": { "color": "#ffffff", "fontSize": 20 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "↓" }, "style": { "color": "#888888", "fontSize": 16 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 12 },
              "children": [
                { "type": "Icon", "data": { "name": "refresh", "size": 20 }, "style": { "color": "#888888", "border": "2px solid #888888", "borderRadius": "50%", "width": 40, "height": 40 } },
                { "type": "BodyText", "data": { "text": "그냥 다시 시키기" }, "style": { "color": "#ffffff", "fontSize": 20 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "→ 또 같은 실수 반복" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            {
              "type": "PersonAvatar",
              "data": { "name": "Boris Cherny", "initials": "BC" },
              "style": { "width": 50, "height": 50, "background": "#1a3a1a", "border": "2px solid #39FF14", "borderRadius": "50%", "fontSize": 20, "fontWeight": 700, "color": "#39FF14" }
            },
            { "type": "Headline", "data": { "text": "Boris Cherny" }, "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 12 },
              "children": [
                { "type": "Icon", "data": { "name": "x", "size": 20 }, "style": { "color": "#888888", "border": "2px solid #888888", "borderRadius": "50%", "width": 40, "height": 40 } },
                { "type": "BodyText", "data": { "text": "잘못된 작업" }, "style": { "color": "#ffffff", "fontSize": 20 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "↓" }, "style": { "color": "#39FF14", "fontSize": 16 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 12 },
              "children": [
                { "type": "Icon", "data": { "name": "edit", "size": 20 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 40, "height": 40 } },
                { "type": "BodyText", "data": { "text": "메모장 업데이트" }, "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "↓" }, "style": { "color": "#39FF14", "fontSize": 16 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 12 },
              "children": [
                { "type": "Icon", "data": { "name": "check", "size": 20 }, "style": { "color": "#ffffff", "background": "#39FF14", "borderRadius": "50%", "width": 40, "height": 40 } },
                { "type": "BodyText", "data": { "text": "같은 실수 다시 하지 마" }, "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **프로세스 대비: 일반 방법 vs 전문가 방법** 씬에 적용
- 좌=일반(gray, 짧은 플로우 2단계), 우=전문가(green, 긴 플로우 3단계)
- **우측이 더 길다** — 단계가 많지만 결과가 좋음을 시각적으로 표현
- 아이콘 3단계 색상 전이: gray outline → **green outline** → **green fill** (점진적 강조)
- 최종 스텝의 green fill 원(✓) — 성공/완료를 가장 강하게 표현
- 좌측 결말: gray "→ 또 같은 실수 반복" — 부정적, 순환적
- 우측 결말: green fill ✓ — 긍정적, 해결됨
- 우측 헤더에 **PersonAvatar** — 전문가 권위 부여
- 화살표(↓): 좌=gray, 우=green — 색상으로 플로우의 톤 구분
- REF-018(비유 대비)와의 차이: 결과 태그가 아닌 **수직 플로우 전체가 다름**

---

## REF-027: 수직 3단 플로우 — 아이콘 원형 + 화살표 + 색상 전이 (Vertical Icon Flow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 단순 3단계 프로세스, 문제→행동→결과, 원인→대응→해결
**아키타입 매핑:** P (수직 타임라인) 변형 — 대형 원형 아이콘 + 색상 점진 전이

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│              (✕) gray outline 원 ~70px                    │
│              실수 발생  (white, ~20px)                     │
│                                                          │
│                  ↓  (green)                               │
│                                                          │
│              (✎) green outline 원 ~70px                   │
│                   dark green tint fill                    │
│              메모장에 기록  (GREEN, bold, ~20px)            │
│                                                          │
│                  ↓  (green)                               │
│                                                          │
│              (✓) green fill 원 ~70px                      │
│              다음번엔 같은 실수 없음 (GREEN, ~20px)         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 1단계 아이콘 | **gray(#888) outline** 원(~70px), border: 2px solid #888, 내부 ✕ 아이콘 gray |
| 1단계 라벨 | white, ~20px, 아이콘 아래 중앙 |
| 2단계 아이콘 | **green outline** 원(~70px), border: 2px solid #39FF14, **dark green tint fill**(#1a3a1a), 내부 ✎ 아이콘 green |
| 2단계 라벨 | **accent green**, bold, ~20px |
| 3단계 아이콘 | **green fill** 원(~70px), background: #39FF14, 내부 ✓ 아이콘 **white** |
| 3단계 라벨 | **accent green**, ~20px |
| 화살표(↓) | **green**(#39FF14), ~20px, 스텝 사이 |
| 색상 전이 | gray outline → green outline+tint → **green solid fill** (3단계 점진 강조) |
| 전체 정렬 | 완전 중앙 (수직+수평), Stack(col, center) |
| 스텝 간격 | gap: ~24px (아이콘-라벨 gap: 8px, 라벨-화살표 gap: 16px) |
| 요소 수 | 최소 — 아이콘 3개 + 라벨 3개 + 화살표 2개 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "column", "align": "center", "gap": 8 },
      "children": [
        {
          "type": "Icon",
          "data": { "name": "x", "size": 32 },
          "style": { "color": "#888888", "border": "2px solid #888888", "borderRadius": "50%", "width": 70, "height": 70 }
        },
        { "type": "BodyText", "data": { "text": "실수 발생" }, "style": { "color": "#ffffff", "fontSize": 20 } },
        { "type": "BodyText", "data": { "text": "↓" }, "style": { "color": "#39FF14", "fontSize": 20, "marginTop": 8 } },
        {
          "type": "Icon",
          "data": { "name": "edit", "size": 32 },
          "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 70, "height": 70, "background": "#1a3a1a" }
        },
        { "type": "BodyText", "data": { "text": "메모장에 기록" }, "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 } },
        { "type": "BodyText", "data": { "text": "↓" }, "style": { "color": "#39FF14", "fontSize": 20, "marginTop": 8 } },
        {
          "type": "Icon",
          "data": { "name": "check", "size": 32 },
          "style": { "color": "#ffffff", "background": "#39FF14", "borderRadius": "50%", "width": 70, "height": 70 }
        },
        { "type": "BodyText", "data": { "text": "다음번엔 같은 실수 없음" }, "style": { "color": "#39FF14", "fontSize": 20 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **단순 3단계 프로세스, 문제→행동→결과** 씬에 적용
- REF-026(좌우 플로우 대비)의 **우측 플로우만 독립** 사용한 형태
- **색상 3단계 전이**가 핵심: gray outline → green outline+tint → green solid fill
  - 1단계(문제): gray — 부정/중립
  - 2단계(행동): green outline — 진행 중
  - 3단계(결과): green fill — 완료/성공
- 대형 원형 아이콘(70px) — 화면의 주인공, 텍스트는 보조
- 화살표(↓) 모두 **green** — 진행 방향이 긍정적
- Headline 없음 — 아이콘+라벨만으로 충분한 미니멀 구조
- 짧은 씬(5~8초)에 적합 — 요소가 적어 빠른 순차 등장
- REF-017(4단계 프로세스)와의 차이: 수평→수직, 원형 더 큼, 색상 전이 패턴

---

## REF-028: 용어 정의 + 인용 카드 — Headline + 부제 + ChatBubble (Term Definition with Quote)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 용어/개념 명명, 전문가 인용 + 비유 설명, "이걸 ~라고 부른다"
**아키타입 매핑:** H (인용문 중심) + U (ChatBubble) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000, 여백 넉넉)                                 │
│                                                          │
│          [Headline: GREEN, bold, ~32px, "복리 학습"]       │
│                                                          │
│          [BodyText: gray, sm, "보리스가 이걸 이렇게 부른대요"]│
│                                                          │
│     ┌──────────────────────────────────────────┐         │
│     │  👤 (green outline, sm)                   │         │
│     │                                          │         │
│     │  새 직원이 같은 실수를 반복하면             │         │
│     │  (white, ~20px)                           │         │
│     │  → 매뉴얼에 추가하는 것처럼요              │         │
│     │  (GREEN, bold, ~20px)                     │         │
│     │                                          │         │
│     └── gray border, rounded ──────────────────┘         │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | **accent green**, bold, ~32px, 중앙 정렬, 용어/개념명 |
| 부제 | gray(#888), sm(~18px), 중앙 정렬, "누가 이걸 ~라고 부른다" |
| ChatBubble 카드 | maxWidth: ~600px, fill: #1a1a1a, **border: 1px solid #555(gray)**, radius: 16px, padding: 24px |
| 아바타 아이콘 | green outline(#39FF14), ~28px, 사람 실루엣, 카드 좌상단 |
| 인용 텍스트 1줄 | white, ~20px, 상황 설명 (조건문) |
| 인용 텍스트 2줄 | **accent green**, bold, ~20px, "→" 접두사, 핵심 행동/결론 |
| "→" 화살표 | green, 텍스트 앞에 인라인 — 결론/행동 강조 |
| 카드-헤더 간격 | gap: ~24px |
| 전체 여백 | 넉넉함 — 하단 40%+ 빈 공간 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "80px 80px" },
  "children": [
    {
      "type": "Headline",
      "data": { "text": "복리 학습" },
      "style": { "color": "#39FF14", "fontSize": 32, "fontWeight": 700 }
    },
    {
      "type": "BodyText",
      "data": { "text": "보리스가 이걸 이렇게 부른대요" },
      "style": { "color": "#888888", "fontSize": 18 }
    },
    {
      "type": "ChatBubble",
      "data": {
        "avatar": "person",
        "messages": [
          { "text": "새 직원이 같은 실수를 반복하면", "style": "default" },
          { "text": "→ 매뉴얼에 추가하는 것처럼요", "style": "accent" }
        ]
      },
      "style": {
        "maxWidth": 600,
        "background": "#1a1a1a",
        "border": "1px solid #555555",
        "borderRadius": 16,
        "padding": "24px"
      }
    }
  ]
}
```

### 적용 규칙

- **용어 정의, 개념 명명, 전문가 인용+비유** 씬에 적용
- Headline: **green 용어명** — 화면의 주인공 (새로운 개념 소개)
- 부제: gray, 맥락 설명 ("누가 이걸 ~라고 부른다")
- ChatBubble: **인용/비유 카드** — 대화체로 친근하게 설명
- 인용 내 **2줄 구조**: 1줄=상황(white), 2줄=결론/행동(**green**, "→" 접두)
- 아바타: green outline 사람 아이콘 — 발화자 표시 (작게)
- 카드 border: **gray(#555)** — green 아님, Headline이 이미 green이므로 카드는 중립
- 하단 여백 넉넉 — 시청자가 용어를 읽고 소화할 시간
- REF-021(전환 씬)과 유사한 미니멀 느낌이나 **카드가 있어 정보량이 더 많음**
- REF-006(FrameBox+InsightTile)과의 차이: ChatBubble로 **대화체** 표현

---

## REF-029: 수평 바 4단 성장 + RichText 인사이트 (Stacked Growth Bars)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 시간에 따른 성장/증가, 점진적 변화, 복리 효과, 누적 데이터
**아키타입 매핑:** M (CompareBars) 변형 — 4개 바 점진 증가 + 하단 RichText

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  처음   ████                                    16%      │
│  1달    ████████████                            40%      │
│  3달    ████████████████████████                64%      │
│  6달    ████████████████████████████████████    78%      │
│                                                          │
│         시간이 지날수록 클로드가 점점                       │
│         우리 방식에 맞게 움직입니다                         │
│         (white + 부분 GREEN bold)                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 바 개수 | **4개**, 위→아래로 점진 증가 |
| 바 색상 | 모두 **accent green**(#39FF14), 동일 색상 — 길이로만 차이 표현 |
| 바 트랙 | gray(#333), full-round, 바 뒤에 전체 너비로 깔림 |
| 바 radius | full-round(20px) — REF-024와 동일 |
| 바 높이 | ~32px |
| 좌측 라벨 | white, ~18px, 바 좌측에 시간 단위("처음", "1달", "3달", "6달") |
| 우측 퍼센트 | **accent green**, bold, ~18px, 바 우측 끝에 "16%", "40%", "64%", "78%" |
| 라벨 정렬 | 좌측 라벨 고정 너비(~60px), 우측 퍼센트 바 끝 우측 정렬 |
| 바 간격 | gap: ~16px (바 그룹 내부) |
| 바-인사이트 간격 | gap: ~32px |
| 인사이트 | RichText, white + **부분 green bold** ("클로드가"), 중앙 정렬, ~22px, 2줄 |
| 전체 maxWidth | ~800px |
| Headline 없음 | 바 자체가 메인 — 인사이트가 설명 역할 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "column", "gap": 16 },
      "style": { "maxWidth": 800, "width": "100%" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "처음" }, "style": { "color": "#ffffff", "fontSize": 18, "minWidth": 60, "textAlign": "right" } },
            { "type": "ProgressBar", "data": { "value": 16, "max": 100 }, "style": { "height": 32, "borderRadius": 20, "barColor": "#39FF14", "trackColor": "#333333", "flex": 1 } },
            { "type": "BodyText", "data": { "text": "16%" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700, "minWidth": 50 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "1달" }, "style": { "color": "#ffffff", "fontSize": 18, "minWidth": 60, "textAlign": "right" } },
            { "type": "ProgressBar", "data": { "value": 40, "max": 100 }, "style": { "height": 32, "borderRadius": 20, "barColor": "#39FF14", "trackColor": "#333333", "flex": 1 } },
            { "type": "BodyText", "data": { "text": "40%" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700, "minWidth": 50 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "3달" }, "style": { "color": "#ffffff", "fontSize": 18, "minWidth": 60, "textAlign": "right" } },
            { "type": "ProgressBar", "data": { "value": 64, "max": 100 }, "style": { "height": 32, "borderRadius": 20, "barColor": "#39FF14", "trackColor": "#333333", "flex": 1 } },
            { "type": "BodyText", "data": { "text": "64%" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700, "minWidth": 50 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "6달" }, "style": { "color": "#ffffff", "fontSize": 18, "minWidth": 60, "textAlign": "right" } },
            { "type": "ProgressBar", "data": { "value": 78, "max": 100 }, "style": { "height": 32, "borderRadius": 20, "barColor": "#39FF14", "trackColor": "#333333", "flex": 1 } },
            { "type": "BodyText", "data": { "text": "78%" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700, "minWidth": 50 } }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "시간이 지날수록 ", "style": "default" },
          { "text": "클로드가", "style": "accent-bold" },
          { "text": " 점점\n우리 방식에 맞게 움직입니다", "style": "default" }
        ]
      },
      "style": { "fontSize": 22, "color": "#ffffff", "textAlign": "center" }
    }
  ]
}
```

### 적용 규칙

- **시간에 따른 점진적 성장/증가** 씬에 적용
- REF-024(2바 비교)와의 차이: **4개 바 점진 증가** — 비교가 아닌 **추세** 표현
- 바 모두 **같은 green** — 길이 차이만으로 성장 표현 (색상 대비 없음)
- 좌측 라벨: 시간 단위 (처음, 1달, 3달, 6달) — **시계열 데이터**
- 우측 퍼센트: green bold — 수치가 바와 같은 색으로 강조
- gray 트랙(#333): 바 뒤에 전체 너비 — 남은 여지/잠재력 표현
- Headline 없음 — 바가 메인, RichText 인사이트가 해석 제공
- RichText: **부분 green bold** ("클로드가") — 핵심 주어만 강조
- 바 순차 등장 애니메이션: 위→아래 순서, 각 ~20프레임 간격
- REF-019(CompareBars)와의 차이: 2개 비교→4개 추세, 라벨이 시간 단위

---

## REF-030: 아이콘 → 화살표 → Pill 3열 결과 (Icon to Pill Fan-out)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 하나의 입력이 여러 결과를 생성, 단축키/명령어의 다중 효과, 1→N 관계
**아키타입 매핑:** E (수평 프로세스 플로우) 변형 — 1:N 팬아웃 구조

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│                                       ┌──────────┐      │
│     ┌──────────┐                      │ 저장하기   │      │
│     │   /↵     │                      └─green pill┘      │
│     │ (green   │      ──→             ┌──────────┐      │
│     │  아이콘)  │     (gray)           │ 공유하기   │      │
│     └─gray bdr─┘                      └─green pill┘      │
│      ~100px sq                        ┌──────────┐      │
│                                       │ 검토 요청  │      │
│                                       └─green pill┘      │
│                                                          │
│      단축명령어 — 한 번에 실행                              │
│      (white, bold, ~24px)                                │
│                                                          │
│      매번 같은 말 반복 안 해도 돼요                         │
│      (gray, sm)                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 좌측 아이콘 박스 | ~100px 정사각형, **gray border**(#555, 2px), radius: 16px, 내부 아이콘 **green** ~48px |
| 아이콘 종류 | 슬래시 명령어(/↵), 키보드 단축키, 도구 아이콘 등 |
| 화살표 | ArrowConnector(right), **gray(#888)**, 아이콘 박스→Pill 그룹 사이 |
| 우측 Pill 그룹 | Stack(col, gap:12), 3개 Pill 수직 나열 |
| Pill 스타일 | green border(1px #39FF14), green text, **fill: #0d1f0d**(dark green tint), radius: full-round(20px), padding: 8px 20px |
| Pill 텍스트 | **accent green**, ~16px, 중앙 정렬 |
| Headline | white, bold, ~24px, "—" 대시 포함, 기능 설명 |
| 부제 | gray(#888), sm(~16px), 부가 설명 |
| 아이콘-화살표-Pill 정렬 | Stack(row, center) — 아이콘 중앙↔Pill 그룹 중앙 수평 정렬 |
| Pill 그룹 너비 | 각 Pill width: auto(내용에 맞춤), 우측 정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 24 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "Icon",
          "data": { "name": "terminal", "size": 48 },
          "style": {
            "color": "#39FF14",
            "border": "2px solid #555555",
            "borderRadius": 16,
            "width": 100, "height": 100,
            "background": "transparent"
          }
        },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "flex-end", "gap": 12 },
          "children": [
            {
              "type": "Pill",
              "data": { "text": "저장하기" },
              "style": { "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 20, "padding": "8px 20px", "background": "#0d1f0d", "fontSize": 16 }
            },
            {
              "type": "Pill",
              "data": { "text": "공유하기" },
              "style": { "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 20, "padding": "8px 20px", "background": "#0d1f0d", "fontSize": 16 }
            },
            {
              "type": "Pill",
              "data": { "text": "검토 요청" },
              "style": { "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 20, "padding": "8px 20px", "background": "#0d1f0d", "fontSize": 16 }
            }
          ]
        }
      ]
    },
    {
      "type": "Headline",
      "data": { "text": "단축명령어 — 한 번에 실행" },
      "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 }
    },
    {
      "type": "BodyText",
      "data": { "text": "매번 같은 말 반복 안 해도 돼요" },
      "style": { "color": "#888888", "fontSize": 16 }
    }
  ]
}
```

### 적용 규칙

- **1→N 관계, 하나의 입력→여러 결과** 씬에 적용
- REF-023(인물→선택)과의 차이: 1:1이 아닌 **1:N 팬아웃** 구조
- 좌측 아이콘 박스: **gray border**(중립 입력) + green 아이콘(기능 강조)
- 화살표: gray — 연결 역할만
- 우측 Pill 3개: 모두 **green border+tint** — 결과물은 동급, 순서 없음
- Pill에 dark green tint(#0d1f0d) — 단순 border만보다 입체감
- Headline: white + "—" 대시 — 기능명 + 한 줄 설명
- 부제: gray — 사용자 이점/편의성 설명
- Pill 개수: 2~5개 유연 (3개가 가장 균형)
- REF-007/008(3열 카드)과의 차이: 카드가 아닌 **Pill 태그** — 더 가볍고 빠른 인상

---

## REF-031: Kicker + Headline + 3열 원형 아이콘 + 강조 태그 (Triple Icon Row with Tag)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 병렬 처리, 동일 역할 N개, 팀/에이전트 구성, 동등한 요소 나열
**아키타입 매핑:** D (3열 Grid) 변형 — 카드 대신 원형 아이콘 + 라벨, 하단 태그

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│            [Kicker: GREEN, sm, "그리고"]                   │
│            [Headline: white, bold, ~40px, "분업시키기"]     │
│                                                          │
│     ┌─────────┐   ┌─────────┐   ┌─────────┐            │
│     │  🤖     │   │  🤖     │   │  🤖     │            │
│     │ (green  │   │ (green  │   │ (green  │            │
│     │  원형)   │   │  원형)   │   │  원형)   │            │
│     └─ green ─┘   └─ green ─┘   └─ green ─┘            │
│     ~100px          ~100px          ~100px               │
│                                                          │
│     에이전트 1      에이전트 2      에이전트 3              │
│     (GREEN, sm)    (GREEN, sm)    (GREEN, sm)            │
│                                                          │
│              • 동시 처리 •  (GREEN, bold, ~20px)           │
│              (● 양쪽 데코 dot)                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Kicker | **accent green**, sm(~16px), 중앙 정렬, 전환어("그리고") |
| Headline | **white**, bold, ~40px(대형), 중앙 정렬, 핵심 개념 |
| 원형 아이콘 | ~100px, **green outline**(border: 2px solid #39FF14), **dark green tint fill**(#1a3a1a), 내부 아이콘 green ~40px |
| 아이콘 종류 | 동일 아이콘 ×3 — 같은 역할의 복제 (로봇/에이전트) |
| 아이콘 라벨 | **accent green**, sm(~16px), 아이콘 아래 중앙, "에이전트 1/2/3" |
| 아이콘 행 | Stack(row, center, gap: ~32px) |
| 강조 태그 | **accent green**, bold, ~20px, 중앙 정렬, "• 동시 처리 •" |
| 태그 데코 | 양쪽 **●** dot — "• 텍스트 •" 형태의 장식적 강조 |
| Kicker-Headline 간격 | gap: 4~8px (밀착) |
| Headline-아이콘 간격 | gap: ~32px |
| 아이콘-태그 간격 | gap: ~24px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Kicker",
      "data": { "text": "그리고" },
      "style": { "color": "#39FF14", "fontSize": 16 }
    },
    {
      "type": "Headline",
      "data": { "text": "분업시키기" },
      "style": { "color": "#ffffff", "fontSize": 40, "fontWeight": 800 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "justify": "center", "gap": 32 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "bot", "size": 40 },
              "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 100, "height": 100, "background": "#1a3a1a" }
            },
            { "type": "BodyText", "data": { "text": "에이전트 1" }, "style": { "color": "#39FF14", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "bot", "size": 40 },
              "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 100, "height": 100, "background": "#1a3a1a" }
            },
            { "type": "BodyText", "data": { "text": "에이전트 2" }, "style": { "color": "#39FF14", "fontSize": 16 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "bot", "size": 40 },
              "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 100, "height": 100, "background": "#1a3a1a" }
            },
            { "type": "BodyText", "data": { "text": "에이전트 3" }, "style": { "color": "#39FF14", "fontSize": 16 } }
          ]
        }
      ]
    },
    {
      "type": "BodyText",
      "data": { "text": "• 동시 처리 •" },
      "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 }
    }
  ]
}
```

### 적용 규칙

- **병렬 처리, 동일 역할 N개, 팀 구성** 씬에 적용
- REF-007/008(3열 카드)과의 차이: 카드 없이 **원형 아이콘만** — 더 미니멀
- 아이콘 **모두 동일** — 같은 역할의 복제임을 시각적으로 표현
- 모두 **green** (outline + tint + 아이콘 + 라벨) — 긍정/활성 상태
- Kicker: green 전환어 — 이전 씬과의 연결 ("그리고", "또한", "마지막으로")
- Headline: **white, 대형(40px)** — 개념명이 화면의 주인공
- 강조 태그: "• 동시 처리 •" — 양쪽 dot 데코로 키워드 강조
- 원형 아이콘 개수: 2~5개 유연 (3개가 시각적 균형)
- REF-001/017(프로세스 플로우)과의 차이: 화살표 없음 — **병렬**(순서 없음)

---

## REF-032: PersonAvatar 헤더 + 3열 번호 카드 + 인사이트 (Person + Numbered Cards + Insight)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 전문가의 방법론, N가지 확인/체크 포인트, 병렬 실행 단계
**아키타입 매핑:** Z (인물) + D (3열 Grid) + F (InsightTile) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  (BC) PersonAvatar   Boris Cherny (GREEN, bold, ~28px)   │
│  ~60px green outline  공유 전에 동시에 세 가지를 확인시켜요  │
│                       (gray, sm)                          │
│                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
│  │   ❶ (green fill)│ │   ❷ (green fill)│ │  ❸ (green)   ││
│  │   ~36px 원형     │ │   ~36px 원형     │ │  ~36px 원형   ││
│  │                 │ │                 │ │              ││
│  │  규칙 맞는지 확인 │ │  작업 이력 파악   │ │  오류 찾기    ││
│  │  (white, bold)  │ │  (white, bold)  │ │  (white,bold)││
│  │                 │ │                 │ │              ││
│  └─ green border ──┘ └─ green border ──┘ └─green border─┘│
│   fill: dark green    fill: dark green    fill: dark grn │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ 사람이 한 번 검토하는 동안 (gray)                       ││
│  │ 이미 여러 관점에서 다 확인해 놓는 거예요 (GREEN, bold)   ││
│  └── gray border, fill: #1a1a1a ────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar | ~60px 원형, green outline(#39FF14), dark green tint fill, 이니셜 green bold |
| 인물명 | **accent green**, bold, ~28px, 아바타 우측 |
| 인물 설명 | gray(#888), sm(~16px), 인물명 아래 — 행동 요약 |
| 헤더 레이아웃 | Stack(row, center, gap:16) — 아바타 좌 + 텍스트 우 |
| 번호 카드 | FrameBox, **green border**(1px #39FF14), **dark green fill**(#0d1f0d), radius: 16px, padding: 24px |
| 번호 원형 | **green fill**(#39FF14), ~36px 원형, 내부 숫자 **dark/black** bold |
| 카드 제목 | white, bold, ~20px, 중앙 정렬 |
| 카드 너비 | 3등분, 각 ~300px, gap: ~16px |
| 카드 정렬 | Stack(col, center, gap:12) 내부 |
| 인사이트 카드 | FrameBox, **gray border**(#555), fill: #1a1a1a, radius: 12px, maxWidth: 전체 너비 |
| 인사이트 1줄 | gray(#888), sm, 상황 설명 |
| 인사이트 2줄 | **accent green**, bold, ~20px, 핵심 결론 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 60px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 16 },
      "children": [
        {
          "type": "PersonAvatar",
          "data": { "name": "Boris Cherny", "initials": "BC" },
          "style": { "width": 60, "height": 60, "background": "#1a3a1a", "border": "2px solid #39FF14", "borderRadius": "50%", "fontSize": 22, "fontWeight": 700, "color": "#39FF14" }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 2 },
          "children": [
            { "type": "Headline", "data": { "text": "Boris Cherny" }, "style": { "color": "#39FF14", "fontSize": 28, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "공유 전에 동시에 세 가지를 확인시켜요" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        }
      ]
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "gap": 16 },
      "style": { "width": "100%" },
      "children": [
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            {
              "type": "Badge",
              "data": { "text": "1" },
              "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 }
            },
            { "type": "BodyText", "data": { "text": "규칙 맞는지 확인" }, "style": { "color": "#ffffff", "fontSize": 20, "fontWeight": 700, "textAlign": "center" } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            {
              "type": "Badge",
              "data": { "text": "2" },
              "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 }
            },
            { "type": "BodyText", "data": { "text": "작업 이력 파악" }, "style": { "color": "#ffffff", "fontSize": 20, "fontWeight": 700, "textAlign": "center" } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            {
              "type": "Badge",
              "data": { "text": "3" },
              "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 }
            },
            { "type": "BodyText", "data": { "text": "오류 찾기" }, "style": { "color": "#ffffff", "fontSize": 20, "fontWeight": 700, "textAlign": "center" } }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "style": { "width": "100%", "background": "#1a1a1a", "border": "1px solid #555555", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        { "type": "BodyText", "data": { "text": "사람이 한 번 검토하는 동안" }, "style": { "color": "#888888", "fontSize": 16 } },
        { "type": "BodyText", "data": { "text": "이미 여러 관점에서 다 확인해 놓는 거예요" }, "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **전문가 방법론, N가지 체크포인트, 병렬 확인 단계** 씬에 적용
- PersonAvatar 헤더: **좌 아바타 + 우 이름/설명** — Stack(row) 수평 배치
- 번호 카드 3열: **green fill Badge(숫자)** + white 제목 — 순서가 있지만 병렬 실행
- 카드 전체 **green border + dark green tint** — 모두 활성/긍정 상태
- Badge 숫자: **green fill에 black 텍스트** — 높은 대비로 번호 강조
- 인사이트 카드: **gray border**(중립) — 카드 그룹과 시각적 분리
- 인사이트 2줄 구조: gray 상황 + **green bold 결론**
- REF-031(3열 원형 아이콘)과의 차이: 원형→FrameBox 카드, 번호 Badge 추가, PersonAvatar 헤더
- REF-007/008(3열 카드)과의 차이: 아이콘 대신 **번호 Badge**, PersonAvatar 헤더, 인사이트 카드

---

## REF-033: Kicker + StatNumber + 번호 리스트 (Summary Numbered List)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 요약/정리, 핵심 N가지, 전체 목차, 챕터 리캡
**아키타입 매핑:** I (수직 스텝카드) 변형 — 카드 없이 번호 Badge + 텍스트만

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│     [Kicker: GREEN, sm, "Boris Cherny가 강조한 핵심"]      │
│     [StatNumber: GREEN, 매우 큰 bold, ~64px, "5가지"]      │
│                                                          │
│     ❶  스스로 확인하게 해라        (white, ~22px)           │
│                                                          │
│     ❷  계획을 먼저 세워라          (white, ~22px)           │
│                                                          │
│     ❸  동시에 여러 개를 돌려라      (white, ~22px)          │
│                                                          │
│     ❹  클로드 전용 메모장에 투자해라 (white, ~22px)          │
│                                                          │
│     ❺  단축명령어를 써라           (white, ~22px)           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Kicker | **accent green**, sm(~16px), 중앙 정렬, "누가 강조한 핵심" |
| StatNumber | **accent green**, 매우 큰 bold(~64px), 중앙 정렬, "5가지" |
| Kicker-StatNumber 간격 | gap: 4px (밀착) |
| 번호 Badge | **green fill**(#39FF14), ~28px 원형, 내부 숫자 **dark/black** bold ~14px |
| 리스트 텍스트 | white, ~22px, Badge 우측, 좌측 정렬 |
| Badge-텍스트 간격 | gap: 16px (행 내부) |
| 항목 간격 | gap: ~20px (행 간) |
| 리스트 정렬 | **좌측 정렬** — 중앙이 아닌 좌측 시작 (좌측에 Badge 열 정렬) |
| 전체 정렬 | Kicker/StatNumber는 중앙, 리스트는 좌측 여백 있음(paddingLeft: ~200px) |
| 항목 수 | 5개 (3~7개 유연) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Kicker",
      "data": { "text": "Boris Cherny가 강조한 핵심" },
      "style": { "color": "#39FF14", "fontSize": 16 }
    },
    {
      "type": "StatNumber",
      "data": { "value": "5가지" },
      "style": { "color": "#39FF14", "fontSize": 64, "fontWeight": 800 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "column", "align": "flex-start", "gap": 20 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "Badge", "data": { "text": "1" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 14, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "스스로 확인하게 해라" }, "style": { "color": "#ffffff", "fontSize": 22 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "Badge", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 14, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "계획을 먼저 세워라" }, "style": { "color": "#ffffff", "fontSize": 22 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "Badge", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 14, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "동시에 여러 개를 돌려라" }, "style": { "color": "#ffffff", "fontSize": 22 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "Badge", "data": { "text": "4" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 14, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "클로드 전용 메모장에 투자해라" }, "style": { "color": "#ffffff", "fontSize": 22 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "Badge", "data": { "text": "5" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 14, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "단축명령어를 써라" }, "style": { "color": "#ffffff", "fontSize": 22 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **요약/정리, 핵심 N가지, 전체 리캡** 씬에 적용
- StatNumber: **대형 green(64px)** — "5가지"가 화면의 주인공
- Kicker + StatNumber 조합: 출처/맥락 + 숫자 — 권위+임팩트
- 번호 Badge: **green fill + black 텍스트** — REF-032와 동일 스타일
- 리스트: **좌측 정렬**, 카드 없이 텍스트만 — 최대한 깔끔
- 항목 텍스트: white, 명령형/동사형 — "~해라" 형태
- REF-032(3열 카드)와의 차이: 카드 없이 **수직 리스트**, 항목 5개 (3열에 안 맞을 때)
- REF-009(수직 스텝카드)와의 차이: ProcessStepCard 없이 **Badge+텍스트만** — 더 가볍고 빠른
- 순차 등장 애니메이션: 위→아래, 각 항목 ~20프레임 간격
- 나레이션이 현재 항목을 읽을 때 해당 항목 등장 — enterAt을 자막 타이밍에 맞춤

---

## REF-034: PersonAvatar 프로필 + 라벨 바 비교 + Pill 결론 (Profile + Labeled Bars + Pill)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 전문가 데이터 기반 주장, 사용 비율 비교, 설정/옵션 비교 + 결론
**아키타입 매핑:** Z (인물) + M (CompareBars) + Pill 결론 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  (BC) PersonAvatar    Boris Cherny  (white, bold, ~32px) │
│  ~100px green outline  • Anthropic 엔지니어 (green ●+gray)│
│  dark green tint                                         │
│                                                          │
│  기본 설정                                        92%     │
│  ██████████████████████████████████████████  (green 바)   │
│  [충분함 ✓] ← green Pill 바 안쪽 좌측                     │
│                                                          │
│  커스텀 설정                                       9%     │
│  ████                                       (gray 바)    │
│  [극소] ← gray Pill 바 안쪽 좌측                          │
│                                                          │
│     ┌──────────────────────────────┐                     │
│     │ 맞춤 설정은 필요할 때만        │ green border Pill   │
│     └──────────────────────────────┘                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| PersonAvatar | ~100px 원형, green outline(#39FF14, 2px), dark green tint fill(#1a3a1a), 이니셜 green bold ~36px |
| 인물명 | **white**, bold, ~32px, 아바타 우측 |
| 역할 | green ●(8px dot) + gray(#888) 텍스트, sm(~16px), "Anthropic 엔지니어" |
| 헤더 레이아웃 | Stack(row, center, gap:24) — 아바타(좌) + 이름/역할(우) |
| 바 라벨 (상단) | white, ~16px, 바 위 좌측에 "기본 설정" / "커스텀 설정" |
| 바 퍼센트 (상단) | **accent green**(강조) / gray(기본), bold, ~16px, 바 위 우측 |
| 바 (강조) | **green gradient**(#39FF14→연한 green), full-round(radius:8px), ~90% 너비, height:36px |
| 바 (기본) | **gray**(#555), full-round, ~9% 너비, height:36px |
| 바 트랙 | darker gray(#2a2a2a), full-round, 전체 너비 |
| 바 내부 Pill (강조) | green 배경에 dark text, "충분함 ✓", 바 안쪽 좌측, radius:4px, padding:4px 8px |
| 바 내부 Pill (기본) | gray 배경에 white text, "극소", 바 안쪽 좌측 |
| 결론 Pill | **green border**(1px #39FF14), green text, transparent 배경, radius:full-round(20px), padding:12px 24px, ~18px |
| 결론 정렬 | 중앙 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 24 },
      "children": [
        {
          "type": "PersonAvatar",
          "data": { "name": "Boris Cherny", "initials": "BC" },
          "style": { "width": 100, "height": 100, "background": "#1a3a1a", "border": "2px solid #39FF14", "borderRadius": "50%", "fontSize": 36, "fontWeight": 700, "color": "#39FF14" }
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 4 },
          "children": [
            { "type": "Headline", "data": { "text": "Boris Cherny" }, "style": { "color": "#ffffff", "fontSize": 32, "fontWeight": 700 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 8 },
              "children": [
                { "type": "Icon", "data": { "name": "circle-filled", "size": 8 }, "style": { "color": "#39FF14" } },
                { "type": "BodyText", "data": { "text": "Anthropic 엔지니어" }, "style": { "color": "#888888", "fontSize": 16 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Stack",
      "layout": { "direction": "column", "gap": 16 },
      "style": { "maxWidth": 800, "width": "100%" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 4 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "justify": "space-between" },
              "children": [
                { "type": "BodyText", "data": { "text": "기본 설정" }, "style": { "color": "#ffffff", "fontSize": 16 } },
                { "type": "BodyText", "data": { "text": "92%" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } }
              ]
            },
            { "type": "ProgressBar", "data": { "value": 92, "max": 100, "label": "충분함 ✓" }, "style": { "height": 36, "borderRadius": 8, "barColor": "#39FF14", "trackColor": "#2a2a2a" } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "gap": 4 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "justify": "space-between" },
              "children": [
                { "type": "BodyText", "data": { "text": "커스텀 설정" }, "style": { "color": "#ffffff", "fontSize": 16 } },
                { "type": "BodyText", "data": { "text": "9%" }, "style": { "color": "#888888", "fontSize": 16, "fontWeight": 700 } }
              ]
            },
            { "type": "ProgressBar", "data": { "value": 9, "max": 100, "label": "극소" }, "style": { "height": 36, "borderRadius": 8, "barColor": "#555555", "trackColor": "#2a2a2a" } }
          ]
        }
      ]
    },
    {
      "type": "Pill",
      "data": { "text": "맞춤 설정은 필요할 때만" },
      "style": { "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 20, "padding": "12px 24px", "background": "transparent", "fontSize": 18 }
    }
  ]
}
```

### 적용 규칙

- **전문가 의견 + 데이터 비교 + 결론** 씬에 적용
- REF-019(인물+StatNumber+바)와의 차이: StatNumber 대신 **2개 바 상하 비교**, 바 안에 **라벨 Pill**
- PersonAvatar 프로필: 이름 **white**(green 아님) + green dot + gray 역할
- 바 안쪽 좌측에 **인라인 Pill 라벨** ("충분함 ✓", "극소") — 바 자체가 정보 전달
- 바 위에 **라벨+퍼센트** 행: justify space-between
- 강조 바: green, 긴 바(92%), 퍼센트 green
- 기본 바: gray, 짧은 바(9%), 퍼센트 gray
- 결론 Pill: **green border**, 중앙 배치 — 데이터에서 도출된 한 줄 결론
- green gradient 바: 좌→우로 약간 연해짐 — 입체감
- 바 height: 36px (REF-024/029보다 약간 큼) — 내부 라벨이 들어갈 공간

---

## REF-035: 아이콘 히어로 + RichText + CTA 카드 (Icon Hero + CTA Card)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 아웃트로, CTA(행동 유도), 리소스 안내, "여기서 더 보세요", 마무리 씬
**아키타입 매핑:** B (풀블리드 임팩트) + F (FrameBox) 변형 — 미니멀 CTA

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000, 여백 넉넉)                                 │
│                                                          │
│              🌐 (green outline, ~80px)                    │
│              ← Icon 히어로 (주제 관련 아이콘)               │
│                                                          │
│          이 팁들은 여러 사이트에                             │
│          (white, bold, ~28px)                             │
│          다 정리가 돼 있어요                                │
│          (GREEN, bold, ~28px)                             │
│                                                          │
│     ┌──────────────────────────────────────────┐         │
│     │ 직접 가서 보시면 더 자세한 내용이 있으니까    │         │
│     │ 한 번 보세요                               │         │
│     └── gray border (#555), fill: #1a1a1a ─────┘         │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Icon 히어로 | **green outline**(#39FF14), ~80px, 선형 아이콘 (fill 없음, stroke만), 중앙 |
| 아이콘 종류 | 주제 관련: 🌐(웹), 📚(문서), 🔗(링크), ▶(영상) 등 |
| RichText Headline | 2줄, 1줄=**white** bold ~28px, 2줄=**accent green** bold ~28px |
| RichText 정렬 | 중앙 정렬, 줄 간격 넉넉 |
| CTA 카드 | FrameBox, **gray border**(#555, 1px), fill: #1a1a1a, radius: 12px, maxWidth: ~700px |
| CTA 텍스트 | gray(#888), ~18px, 중앙 정렬, 1~2줄, 부드러운 권유체 |
| 요소 수 | **3개** — Icon + RichText + FrameBox |
| 아이콘-텍스트 간격 | gap: ~24px |
| 텍스트-카드 간격 | gap: ~24px |
| 전체 여백 | 넉넉 — 하단 30%+ 빈 공간 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "80px 80px" },
  "children": [
    {
      "type": "Icon",
      "data": { "name": "globe", "size": 60 },
      "style": { "color": "#39FF14" }
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "이 팁들은 여러 사이트에\n", "style": "default" },
          { "text": "다 정리가 돼 있어요", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 28, "fontWeight": 700, "color": "#ffffff", "textAlign": "center" }
    },
    {
      "type": "FrameBox",
      "style": { "maxWidth": 700, "background": "#1a1a1a", "border": "1px solid #555555", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        { "type": "BodyText", "data": { "text": "직접 가서 보시면 더 자세한 내용이 있으니까 한 번 보세요" }, "style": { "color": "#888888", "fontSize": 18, "textAlign": "center" } }
      ]
    }
  ]
}
```

### 적용 규칙

- **아웃트로, CTA, 리소스 안내, 마무리** 씬에 적용
- REF-021(전환 씬)과의 차이: FrameBox **CTA 카드**가 있고, 목적이 **마무리/행동 유도**
- REF-028(ChatBubble)과의 차이: 아바타 없음, 대화체 아닌 **권유체**, 카드가 FrameBox
- Icon: **outline 스타일**(fill 없이 stroke만) — 가볍고 세련됨
- RichText 2줄: **white→green** 색상 전환 — 2번째 줄이 핵심 메시지
- CTA 카드: **gray border**(중립) + gray 텍스트 — 강압적이지 않은 부드러운 안내
- 전체 미니멀(3요소) — 시청자가 마무리임을 직감
- 아이콘은 주제에 맞게 교체 (🌐웹, 📚문서, 🎬영상 등)

---

## REF-036: 상태 전이 카드 — Before → After FrameBox (State Transition Cards)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 상태 변화, 이전↔이후, 데이터 손실/변환, 문제 원인 시각화
**아키타입 매핑:** C (좌우 VS 대비) + E (수평 프로세스) 복합 — FrameBox 카드 + 화살표

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [Kicker: GREEN, sm, "팁 ①"]                      │
│          [Headline: white, bold, ~36px, "기억 상실 문제"]   │
│                                                          │
│  ┌─────────────┐              ┌─────────────┐            │
│  │   🧠 (green │              │   ✕ (gray   │            │
│  │    outline)  │    ──→      │    outline)  │            │
│  │   ~50px     │  [새로 시작]  │   ~50px     │            │
│  │             │  (gray pill) │             │            │
│  │  기억 있음   │              │  기억 없음   │            │
│  │  (GREEN)    │              │  (gray)     │            │
│  └─ GREEN bdr ─┘              └─ gray bdr ──┘            │
│   fill: dark green             fill: #1a1a1a             │
│                                                          │
│    이전 세션                      새 세션                  │
│    (gray, sm)                   (gray, sm)               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Kicker | **accent green**, sm(~16px), "팁 ①" 형태 (번호 포함) |
| Headline | **white**, bold, ~36px, 문제/현상 명칭 |
| 좌측 카드 (이전/긍정) | FrameBox ~180×180px, **green border**(2px #39FF14), fill: #0d1f0d(dark green tint), radius: 16px |
| 좌측 아이콘 | green outline, ~50px, 원형 outline 안에 아이콘 |
| 좌측 라벨 | **accent green**, bold, ~18px, "기억 있음" |
| 우측 카드 (이후/부정) | FrameBox ~180×180px, **gray border**(2px #555), fill: #1a1a1a, radius: 16px |
| 우측 아이콘 | gray/white, ~50px, 원형 outline 안에 ✕ 아이콘 |
| 우측 라벨 | gray(#888), ~18px, "기억 없음" |
| 화살표 | ArrowConnector(right), **gray**(#888), 카드 사이 중앙 |
| 화살표 라벨 | Pill/Badge, gray border(#555), gray text, ~14px, "새로 시작", 화살표 아래 |
| 카드 아래 외부 라벨 | gray(#888), sm(~14px), "이전 세션" / "새 세션" |
| 카드 내부 정렬 | Stack(col, center, gap:12) — 아이콘 + 라벨 |
| 카드-화살표 레이아웃 | Stack(row, center, gap:24) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Kicker",
      "data": { "text": "팁 ①" },
      "style": { "color": "#39FF14", "fontSize": 16 }
    },
    {
      "type": "Headline",
      "data": { "text": "기억 상실 문제" },
      "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 800 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 24 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "FrameBox",
              "style": { "width": 180, "height": 180, "background": "#0d1f0d", "border": "2px solid #39FF14", "borderRadius": 16, "padding": 24 },
              "children": [
                { "type": "Icon", "data": { "name": "brain", "size": 50 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 70, "height": 70 } },
                { "type": "BodyText", "data": { "text": "기억 있음" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "이전 세션" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 4 },
          "children": [
            { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
            {
              "type": "Pill",
              "data": { "text": "새로 시작" },
              "style": { "color": "#888888", "border": "1px solid #555555", "borderRadius": 8, "padding": "4px 12px", "background": "#2a2a2a", "fontSize": 14 }
            }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 8 },
          "children": [
            {
              "type": "FrameBox",
              "style": { "width": 180, "height": 180, "background": "#1a1a1a", "border": "2px solid #555555", "borderRadius": 16, "padding": 24 },
              "children": [
                { "type": "Icon", "data": { "name": "x", "size": 50 }, "style": { "color": "#888888", "border": "2px solid #555555", "borderRadius": "50%", "width": 70, "height": 70 } },
                { "type": "BodyText", "data": { "text": "기억 없음" }, "style": { "color": "#888888", "fontSize": 18 } }
              ]
            },
            { "type": "BodyText", "data": { "text": "새 세션" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **상태 변화, Before→After, 데이터 손실/변환** 씬에 적용
- REF-020(2열 카드 비교)과의 차이: **화살표+라벨 Pill**로 전이 과정 표현, 외부 라벨
- REF-022(중립 비교)와의 차이: 원형 아이콘→**정사각 FrameBox 카드** 안에 아이콘
- 좌=**green**(긍정/이전 상태), 우=**gray**(부정/이후 상태) — 색상으로 가치 판단
- 화살표 라벨 Pill: **gray**(중립) — 전이 조건/원인 설명 ("새로 시작", "업데이트 후")
- 카드 아래 **외부 라벨**: gray sm — 카드의 컨텍스트/시점 설명
- 카드가 **정사각형**(180×180) — 아이콘이 크게 들어가는 시각적 무게감
- 좌→우 방향이 **부정적 변화**(손실)일 때: green→gray
- 좌→우 방향이 **긍정적 변화**(개선)일 때: gray→green (색상 반전)
- Kicker에 **번호 포함** ("팁 ①") — 시리즈 구조에서 챕터 마킹

---

## REF-037: 중앙 아이콘 + 원형 산재 요소 — ScatterLayout (Scattered Orbit)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 혼란/복잡성 표현, 중앙 주체 주변의 요소들, "여러 개가 둘러싼" 상태
**아키타입 매핑:** 신규 — **ScatterLayout** 노드 필요 (기존 Stack/Split/Grid로 불가)

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│          [Kicker: GREEN, sm, "팁 ②"]                      │
│          [Headline: white, bold, ~36px, "도메인 분리"]      │
│                                                          │
│              📁?        📁                                │
│      📁                      📁?                         │
│                                                          │
│              🤖 (중앙, gray, ~80px)                       │
│              헷갈려요 😵 (gray)                            │
│                                                          │
│      📁?                         ?                       │
│                    📁                    📁              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Kicker | **accent green**, sm(~16px), "팁 ②" |
| Headline | **white**, bold, ~36px |
| 중앙 아이콘 | gray/white, ~80px, 로봇/주체 아이콘 |
| 중앙 라벨 | gray(#888), ~16px, "헷갈려요" + 이모지 |
| 산재 아이콘 | gray(#888) outline, ~40px, 폴더/문서 아이콘 |
| 산재 물음표 | gray(#888), ~20px, 아이콘 옆에 "?" 텍스트 |
| 산재 배치 | **원형/방사형** — 중앙에서 반경 ~200px에 6~8개 요소 |
| 산재 회전 | 각 요소마다 약간 다른 각도 (불규칙 배치) |
| 전체 톤 | **모두 gray** — 혼란/부정 상태 (green 없음) |

### ScatterLayout 노드 정의 (신규)

```typescript
// 새로운 컨테이너 노드 타입
interface ScatterLayoutNode extends StackNode {
  type: "ScatterLayout";
  data: {
    pattern: "orbit" | "random" | "spiral";  // 배치 패턴
    radius: number;       // 산재 반경 (px)
    centerIcon?: string;  // 중앙 아이콘 name
    centerSize?: number;  // 중앙 아이콘 크기
    centerLabel?: string; // 중앙 라벨
  };
  children: StackNode[];  // 산재될 자식 노드들
}
```

**배치 알고리즘:**
```
orbit: children을 중앙 기준 원형으로 등간격 배치
  - angle = (360° / N) × i + randomOffset(±15°)
  - x = centerX + radius × cos(angle)
  - y = centerY + radius × sin(angle)

random: 중앙 기준 반경 내 랜덤 좌표
spiral: 나선형 배치 (안→밖)
```

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Kicker",
      "data": { "text": "팁 ②" },
      "style": { "color": "#39FF14", "fontSize": 16 }
    },
    {
      "type": "Headline",
      "data": { "text": "도메인 분리" },
      "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 800 }
    },
    {
      "type": "ScatterLayout",
      "data": {
        "pattern": "orbit",
        "radius": 200,
        "centerIcon": "bot",
        "centerSize": 80,
        "centerLabel": "헷갈려요 😵"
      },
      "style": { "width": 600, "height": 400 },
      "children": [
        { "type": "Icon", "data": { "name": "folder", "size": 40, "badge": "?" }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40, "badge": "?" }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40, "badge": "?" }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#888888" } },
        { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#888888" } }
      ]
    }
  ]
}
```

### 적용 규칙

- **혼란/복잡성, 중앙 주체 주변의 산재된 요소** 씬에 적용
- **ScatterLayout 노드 구현 필요** — NODE_REGISTRY에 추가해야 함
- 중앙 아이콘: 주체 (로봇, 사람, 도구)
- 산재 아이콘: 주변 요소 (폴더, 파일, 메시지, 알림 등)
- **모두 gray** — 혼란/부정적 상태를 표현할 때
- 모두 **green** — 통제된/조직된 상태를 표현할 때
- 물음표("?") badge: 불확실성 강조
- orbit 패턴: 6~8개 요소가 자연스럽게 보임 (3개 미만은 빈약, 10개 초과는 혼잡)
- 애니메이션: 산재 아이콘이 **하나씩 팝인**(scale 0→1) 또는 **동시에 등장 후 미세 흔들림**
- 기존 Stack/Grid로 대체 불가 — 절대 좌표 배치 필수
- **구현 완료**: `src/remotion/nodes/ScatterLayout.tsx` + NODE_REGISTRY/CONTAINER_TYPES 등록됨

### 구현 참고

ScatterLayout 렌더러는 `position: relative` 컨테이너 안에 `position: absolute`로 자식을 배치:

```tsx
// src/remotion/nodes/ScatterLayout.tsx (구현 예시)
const ScatterLayout: React.FC<{ node: ScatterLayoutNode }> = ({ node }) => {
  const { pattern, radius, centerIcon, centerSize, centerLabel } = node.data;
  const N = node.children.length;

  return (
    <div style={{ position: "relative", width: node.style.width, height: node.style.height }}>
      {/* 중앙 아이콘 */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <Icon name={centerIcon} size={centerSize} />
        {centerLabel && <span>{centerLabel}</span>}
      </div>
      {/* 산재 자식 */}
      {node.children.map((child, i) => {
        const angle = (360 / N) * i + (Math.random() * 30 - 15);
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        return (
          <div key={i} style={{ position: "absolute", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}>
            {renderNode(child)}
          </div>
        );
      })}
    </div>
  );
};
```

---

## REF-038: 3열 도메인 카드 — 폴더 + 에이전트 조합 (Domain Assignment Cards)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 영역별 분리/할당, 도메인 분류, 역할별 담당자 배정, 구조화된 팀 구성
**아키타입 매핑:** D (3열 Grid) 변형 — FrameBox 안에 아이콘 2개(도메인+담당) + 라벨

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│      영역별로 딱 나눠요                                    │
│      (white + GREEN bold 혼합, RichText, ~28px)           │
│                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
│  │   📁 (green)    │ │   📁 (green)    │ │  📁 (green)  ││
│  │   ~40px         │ │   ~40px         │ │  ~40px       ││
│  │                 │ │                 │ │              ││
│  │   결제           │ │   사용자         │ │  관리자       ││
│  │   (GREEN, bold) │ │   (GREEN, bold) │ │  (GREEN,bold)││
│  │                 │ │                 │ │              ││
│  │   🤖 (green)    │ │   🤖 (green)    │ │  🤖 (green)  ││
│  │   ~36px         │ │   ~36px         │ │  ~36px       ││
│  │                 │ │                 │ │              ││
│  │   전담 클로드    │ │   전담 클로드     │ │  전담 클로드  ││
│  │   (gray, sm)    │ │   (gray, sm)    │ │  (gray, sm)  ││
│  └─ green border ──┘ └─ green border ──┘ └─green border─┘│
│   fill: dark green    fill: dark green    fill: dark grn │
│                                                          │
│   실수도 줄고 나중에 찾아볼 때도 훨씬 편해요                │
│   (gray + 부분 GREEN bold, RichText, ~18px)               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Headline | RichText, white "영역별로 " + **green bold "딱 나눠요"**, ~28px, 중앙 |
| 카드 | FrameBox, **green border**(1px #39FF14), fill: #0d1f0d(dark green tint), radius: 16px, padding: 24px |
| 카드 너비 | 3등분, 각 ~280px, gap: ~16px |
| 도메인 아이콘 | green(#39FF14), ~40px, 폴더 아이콘 (도메인 상징) |
| 도메인 라벨 | **accent green**, bold, ~24px, 중앙 정렬 |
| 담당 아이콘 | green(#39FF14), ~36px, 로봇 아이콘 (담당자 상징) |
| 담당 라벨 | gray(#888), sm(~16px), 중앙 정렬, "전담 클로드" |
| 카드 내부 구조 | Stack(col, center): 도메인아이콘 → 도메인라벨 → 담당아이콘 → 담당라벨 |
| 하단 인사이트 | RichText, gray + **부분 green bold** ("나중에 찾아볼 때도"), ~18px, 중앙 |
| 카드 간 일관성 | 3장 모두 동일 구조, 동일 스타일 — 도메인명만 다름 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 60px" },
  "children": [
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "영역별로 ", "style": "default" },
          { "text": "딱 나눠요", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 28, "fontWeight": 700, "color": "#ffffff", "textAlign": "center" }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "gap": 16 },
      "style": { "width": "100%" },
      "children": [
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#39FF14" } },
            { "type": "Headline", "data": { "text": "결제" }, "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 } },
            { "type": "Icon", "data": { "name": "bot", "size": 36 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "전담 클로드" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#39FF14" } },
            { "type": "Headline", "data": { "text": "사용자" }, "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 } },
            { "type": "Icon", "data": { "name": "bot", "size": 36 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "전담 클로드" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "flex": 1, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 16, "padding": "24px 16px" },
          "children": [
            { "type": "Icon", "data": { "name": "folder", "size": 40 }, "style": { "color": "#39FF14" } },
            { "type": "Headline", "data": { "text": "관리자" }, "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 } },
            { "type": "Icon", "data": { "name": "bot", "size": 36 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "전담 클로드" }, "style": { "color": "#888888", "fontSize": 16 } }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "실수도 줄고 ", "style": "default" },
          { "text": "나중에 찾아볼 때도 훨씬 편해요", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 18, "color": "#888888", "textAlign": "center" }
    }
  ]
}
```

### 적용 규칙

- **영역별 분리/할당, 도메인 분류, 역할별 담당** 씬에 적용
- REF-032(번호 카드)와의 차이: 번호 Badge 대신 **2단 아이콘 구조**(도메인+담당)
- REF-031(3열 원형 아이콘)와의 차이: 원형 아이콘→FrameBox 카드, 2개 아이콘 포함
- 카드 안에 **도메인 아이콘(위) + 도메인명 + 담당 아이콘(아래) + 담당 라벨** — 4단 구조
- 3장 모두 **동일 구조** — 도메인명만 교체, 시각적 일관성
- 모두 **green** (border + tint + 아이콘 + 라벨) — 모두 활성/긍정/조직된 상태
- Headline: **RichText** — 부분 green bold로 키워드 강조
- 하단 인사이트: **RichText** — gray + 부분 green bold
- REF-037(ScatterLayout)의 **해결 상태**: gray 혼란 → green 조직됨 (같은 영상에서 Before→After)

---

## REF-039: 팁 번호 원형 + 화살표 + 약어 카드 3열 + 출처 뱃지 (Tip Number + Acronym Cards)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 팁/챕터 소개, 약어/용어 분해, 개념명 시각화, 섹션 인트로
**아키타입 매핑:** E (수평 프로세스 플로우) + R (StatNumber) 복합 — 번호 원형 → 약어 카드

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                            ┌────────────┐│
│                                            │Boris Cherny││
│                                            │Claude Code │|
│                                            │@ Anthropic ││
│     ┌───────────┐                          └─gray bdr───┘│
│     │   TIP     │                                        │
│     │   (green  │     ──→     [S] [D] [D]                │
│     │    sm)    │    (gray)   green gray gray             │
│     │   3      │              ~80px 정사각 카드            │
│     │  (GREEN  │             Spec Driven Development     │
│     │   ~64px) │             (gray, sm)                  │
│     └─green    ─┘                                        │
│      outline 원형                                         │
│      ~140px                                              │
│                                                          │
│          코드 짜기 전에 설계서 먼저                         │
│          (gray + GREEN bold 부분 강조, RichText)           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 팁 번호 원형 | ~140px, **green outline**(2px #39FF14), dark green tint fill(#1a3a1a) |
| "TIP" 라벨 | green, sm(~14px), 원형 내 상단, letter-spacing: 2px |
| 번호 | **accent green**, 매우 큰 bold(~64px), 원형 내 중앙 |
| 화살표 | ArrowConnector(right), **gray**(#888), 번호 원형 → 카드 그룹 사이 |
| 약어 카드 (첫 글자/강조) | ~80px 정사각, **green border**(1px #39FF14), fill: #0d1f0d, radius: 12px |
| 약어 카드 (나머지) | ~80px 정사각, **gray border**(1px #555), fill: #1a1a1a, radius: 12px |
| 카드 글자 | bold, ~36px, green(첫 카드) / white(나머지 카드), 중앙 정렬 |
| 카드 아래 라벨 | gray(#888), sm(~14px), 각 카드 아래 중앙, 약어 풀이 |
| 카드 그룹 | Stack(row, gap:12) |
| 출처 뱃지 | 우상단 고정, gray border(#555), fill: #1a1a1a, radius:8px, padding: 8px 16px |
| 출처 뱃지 텍스트 | white bold 이름 + gray sm 소속 |
| 하단 인사이트 | RichText, gray + **부분 green bold**, ~18px, 중앙 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "60px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 32 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 0 },
          "children": [
            { "type": "BodyText", "data": { "text": "TIP" }, "style": { "color": "#39FF14", "fontSize": 14, "letterSpacing": 2, "fontWeight": 600 } },
            {
              "type": "StatNumber",
              "data": { "value": "3" },
              "style": {
                "color": "#39FF14", "fontSize": 64, "fontWeight": 800,
                "border": "2px solid #39FF14", "borderRadius": "50%",
                "width": 140, "height": 140,
                "background": "#1a3a1a"
              }
            }
          ]
        },
        { "type": "ArrowConnector", "data": { "direction": "right" }, "style": { "color": "#888888" } },
        {
          "type": "Stack",
          "layout": { "direction": "row", "gap": 12 },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "column", "align": "center", "gap": 8 },
              "children": [
                {
                  "type": "FrameBox",
                  "style": { "width": 80, "height": 80, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": 0 },
                  "children": [
                    { "type": "BodyText", "data": { "text": "S" }, "style": { "color": "#39FF14", "fontSize": 36, "fontWeight": 700, "textAlign": "center" } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "Spec" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "column", "align": "center", "gap": 8 },
              "children": [
                {
                  "type": "FrameBox",
                  "style": { "width": 80, "height": 80, "background": "#1a1a1a", "border": "1px solid #555555", "borderRadius": 12, "padding": 0 },
                  "children": [
                    { "type": "BodyText", "data": { "text": "D" }, "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 700, "textAlign": "center" } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "Driven" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            {
              "type": "Stack",
              "layout": { "direction": "column", "align": "center", "gap": 8 },
              "children": [
                {
                  "type": "FrameBox",
                  "style": { "width": 80, "height": 80, "background": "#1a1a1a", "border": "1px solid #555555", "borderRadius": 12, "padding": 0 },
                  "children": [
                    { "type": "BodyText", "data": { "text": "D" }, "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 700, "textAlign": "center" } }
                  ]
                },
                { "type": "BodyText", "data": { "text": "Development" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "코드 짜기 전에 ", "style": "default" },
          { "text": "설계서 먼저", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 18, "color": "#888888", "textAlign": "center" }
    }
  ]
}
```

### 적용 규칙

- **팁/챕터 소개, 약어 분해, 개념명 시각화** 씬에 적용
- 팁 번호 원형: **대형(140px)** green outline — 섹션 마커 역할
- "TIP" + 번호: 원형 안에 상하 배치, letter-spacing으로 세련됨
- 약어 카드: **첫 글자만 green**(핵심), 나머지 gray — 강조 차등
- 화살표: 번호 → 카드 그룹 — "이번 팁은 이 개념이다"
- 출처 뱃지: **우상단 고정** — 발화자 권위 표시 (항상 화면에 있음)
- 하단 인사이트: RichText — 한 줄 요약
- REF-036(상태 전이)와의 차이: 카드가 상태가 아닌 **약어 글자**, 번호 원형이 주인공
- REF-032(번호 카드 3열)와의 차이: 카드가 **단일 글자**, 번호가 원형 안에 크게
- 약어 카드 개수: 2~5개 유연 (약어 길이에 따라)

---

## REF-040: 번호 + 수직선 + 아이콘 + 제목/부제 리스트 + 활성 마커 (Numbered Icon Timeline)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 목차/구성 항목 나열, 설계서/문서 구조, 순서 있는 항목 + 현재 위치 표시
**아키타입 매핑:** P (수직 타임라인) + I (수직 스텝카드) 변형 — 번호+수직선+아이콘+텍스트 4열 행

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│       [Kicker: gray, sm, letter-spacing, "설계서에 담는 것들"]│
│                                                          │
│   01  │ 📋  뭘 만들 건지              ●  (green dot)      │
│  GREEN│     기능 정의 · 범위 확정     (활성 마커)           │
│  bold │     (gray, sm)                                   │
│       │                                                  │
│   02  │ 🖥  어떻게 생겼는지                               │
│  gray │     UI · 레이아웃 설계                            │
│       │     (gray, sm)                                   │
│       │                                                  │
│   03  │ ⚙  어떻게 동작해야                                │
│  gray │     동작 명세 · 엣지 케이스                        │
│       │     (gray, sm)                                   │
│                                                          │
│       🏗 집짓기 전에 설계도 그리는 것처럼                   │
│       (gray icon + gray text, sm, 비유 보충)              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| Kicker | gray(#888), sm(~14px), **letter-spacing: 4px+**, 중앙 정렬, 섹션 주제 |
| 번호 (활성/첫 항목) | **accent green**, bold, ~36px, "01" 형태 (0 패딩) |
| 번호 (비활성) | gray(#888), bold, ~36px |
| 수직선 | **green**(활성 항목) 또는 gray(비활성), 1px, 번호와 아이콘 사이 |
| 아이콘 | green(활성) 또는 gray(비활성), ~32px, outline 스타일 |
| 제목 | **white**, bold, ~24px |
| 부제 | gray(#888), sm(~16px), "· " 구분자로 키워드 나열 |
| 활성 마커 | **green dot**(●), ~10px, 활성 항목 우측 끝에 표시 |
| 행 레이아웃 | Stack(row): 번호(60px) + 수직선 + 아이콘(40px) + Stack(col)[제목+부제] |
| 행 간격 | gap: ~32px |
| 하단 비유 | gray 아이콘(~20px) + gray 텍스트(sm), 좌측 정렬, 비유/보충 설명 |
| 비유 정렬 | 항목 리스트 아래, 아이콘 열 위치에 맞춤 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Kicker",
      "data": { "text": "설계서에 담는 것들" },
      "style": { "color": "#888888", "fontSize": 14, "letterSpacing": 4 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "column", "gap": 32 },
      "style": { "maxWidth": 700 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "01" }, "style": { "color": "#39FF14", "fontSize": 36, "fontWeight": 700, "minWidth": 60 } },
            { "type": "LineConnector", "data": { "direction": "vertical" }, "style": { "color": "#39FF14", "height": 50 } },
            { "type": "Icon", "data": { "name": "file-text", "size": 32 }, "style": { "color": "#39FF14" } },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "style": { "flex": 1 },
              "children": [
                { "type": "Headline", "data": { "text": "뭘 만들 건지" }, "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 } },
                { "type": "BodyText", "data": { "text": "기능 정의 · 범위 확정" }, "style": { "color": "#888888", "fontSize": 16 } }
              ]
            },
            { "type": "Icon", "data": { "name": "circle-filled", "size": 10 }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "02" }, "style": { "color": "#888888", "fontSize": 36, "fontWeight": 700, "minWidth": 60 } },
            { "type": "LineConnector", "data": { "direction": "vertical" }, "style": { "color": "#555555", "height": 50 } },
            { "type": "Icon", "data": { "name": "monitor", "size": 32 }, "style": { "color": "#888888" } },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "style": { "flex": 1 },
              "children": [
                { "type": "Headline", "data": { "text": "어떻게 생겼는지" }, "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 } },
                { "type": "BodyText", "data": { "text": "UI · 레이아웃 설계" }, "style": { "color": "#888888", "fontSize": 16 } }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 16 },
          "children": [
            { "type": "BodyText", "data": { "text": "03" }, "style": { "color": "#888888", "fontSize": 36, "fontWeight": 700, "minWidth": 60 } },
            { "type": "LineConnector", "data": { "direction": "vertical" }, "style": { "color": "#555555", "height": 50 } },
            { "type": "Icon", "data": { "name": "settings", "size": 32 }, "style": { "color": "#888888" } },
            {
              "type": "Stack",
              "layout": { "direction": "column", "gap": 4 },
              "style": { "flex": 1 },
              "children": [
                { "type": "Headline", "data": { "text": "어떻게 동작해야" }, "style": { "color": "#ffffff", "fontSize": 24, "fontWeight": 700 } },
                { "type": "BodyText", "data": { "text": "동작 명세 · 엣지 케이스" }, "style": { "color": "#888888", "fontSize": 16 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 8 },
      "children": [
        { "type": "Icon", "data": { "name": "building", "size": 20 }, "style": { "color": "#888888" } },
        { "type": "BodyText", "data": { "text": "집짓기 전에 설계도 그리는 것처럼" }, "style": { "color": "#888888", "fontSize": 16 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **목차/구성 나열, 문서 구조, 순서 항목 + 현재 위치** 씬에 적용
- REF-033(번호 리스트)와의 차이: Badge 대신 **대형 번호 텍스트(36px)**, **수직선+아이콘** 추가, 부제 포함
- REF-009/I(수직 스텝카드)와의 차이: ProcessStepCard 아닌 **4열 행 구조**(번호|선|아이콘|텍스트)
- 활성 항목(현재 나레이션 중): **green 번호 + green 수직선 + green 아이콘 + green dot 마커**
- 비활성 항목: **gray 번호 + gray 선 + gray 아이콘**, dot 없음
- 수직선: 번호와 아이콘 사이 **세로 구분** — 시각적 구조감
- 부제에 **"·" 구분자** — 키워드를 간결하게 나열 ("기능 정의 · 범위 확정")
- 하단 비유: gray 아이콘 + gray 텍스트 — 일상 비유로 개념 보충
- 순차 등장: 각 행이 위→아래로 등장, 활성 항목은 green으로 하이라이트
- Kicker: **letter-spacing 넓음** — 상단 라벨의 고급스러운 느낌

---

## REF-041: 조건 Pill + 번호 체크리스트 카드 (Condition Pill + Checklist Cards)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 조건부 이점 나열, "~하면 이런 장점이 있다", 체크리스트 결과
**아키타입 매핑:** J (체크리스트) + I (수직 스텝카드) 복합 — Pill 조건 + FrameBox 체크항목

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│         ┌──────────────┐                                 │
│         │ 설계서 있으면  │  ← green border Pill (조건)     │
│         └──────────────┘                                 │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ❶  뭘 만들지 명확                           ✓   │    │
│  │    방향이 흔들리지 않아요 (gray, sm)               │    │
│  └── green border, dark green tint fill ────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ❷  팀원 리뷰 편함                            ✓   │    │
│  │    스펙 기반으로 논의 가능 (gray, sm)              │    │
│  └── green border ──────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ❸  수정 최소화                               ✓   │    │
│  │    설계서 하나 = 수십 번 수정 방지 (gray, sm)      │    │
│  └── green border ──────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 조건 Pill | **green border**(1px #39FF14), green text, transparent 배경, radius: 8px, padding: 8px 20px, ~18px, 중앙 |
| 카드 | FrameBox, **green border**(1px #39FF14, 약간 투명), fill: #0d1f0d, radius: 12px, padding: 16px 24px, maxWidth: ~700px |
| 번호 Badge | **green fill**(#39FF14), ~32px 원형, 내부 숫자 **black** bold |
| 카드 제목 | **white**, bold, ~22px, Badge 우측 |
| 카드 부제 | gray(#888), sm(~16px), 제목 아래 |
| 체크 아이콘 | **green outline** 원형(~28px), 내부 ✓, 카드 우측 끝 |
| 카드 내부 레이아웃 | Stack(row): Badge + Stack(col)[제목+부제] + flex spacer + ✓ |
| 카드 간격 | gap: ~12px |
| 카드 border 투명도 | 약간 투명(opacity: 0.6~0.8) — 미세하게 은은한 느낌 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Pill",
      "data": { "text": "설계서 있으면" },
      "style": { "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 8, "padding": "8px 20px", "background": "transparent", "fontSize": 18 }
    },
    {
      "type": "Stack",
      "layout": { "direction": "column", "gap": 12 },
      "style": { "maxWidth": 700, "width": "100%" },
      "children": [
        {
          "type": "FrameBox",
          "style": { "background": "#0d1f0d", "border": "1px solid rgba(57,255,20,0.6)", "borderRadius": 12, "padding": "16px 24px", "width": "100%" },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "1" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "style": { "flex": 1 },
                  "children": [
                    { "type": "Headline", "data": { "text": "뭘 만들지 명확" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "방향이 흔들리지 않아요" }, "style": { "color": "#888888", "fontSize": 16 } }
                  ]
                },
                { "type": "Icon", "data": { "name": "check", "size": 16 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 28, "height": 28 } }
              ]
            }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "background": "#0d1f0d", "border": "1px solid rgba(57,255,20,0.6)", "borderRadius": 12, "padding": "16px 24px", "width": "100%" },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "style": { "flex": 1 },
                  "children": [
                    { "type": "Headline", "data": { "text": "팀원 리뷰 편함" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "스펙 기반으로 논의 가능" }, "style": { "color": "#888888", "fontSize": 16 } }
                  ]
                },
                { "type": "Icon", "data": { "name": "check", "size": 16 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 28, "height": 28 } }
              ]
            }
          ]
        },
        {
          "type": "FrameBox",
          "style": { "background": "#0d1f0d", "border": "1px solid rgba(57,255,20,0.6)", "borderRadius": 12, "padding": "16px 24px", "width": "100%" },
          "children": [
            {
              "type": "Stack",
              "layout": { "direction": "row", "align": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700 } },
                {
                  "type": "Stack",
                  "layout": { "direction": "column", "gap": 4 },
                  "style": { "flex": 1 },
                  "children": [
                    { "type": "Headline", "data": { "text": "수정 최소화" }, "style": { "color": "#ffffff", "fontSize": 22, "fontWeight": 700 } },
                    { "type": "BodyText", "data": { "text": "설계서 하나 = 수십 번 수정 방지" }, "style": { "color": "#888888", "fontSize": 16 } }
                  ]
                },
                { "type": "Icon", "data": { "name": "check", "size": 16 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 28, "height": 28 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **조건부 이점, "~하면 이런 장점"** 씬에 적용
- 상단 Pill: **조건문** — "설계서 있으면", "이렇게 하면"
- 카드: **수평 행** — Badge(좌) + 제목/부제(중) + ✓(우)
- REF-033(번호 리스트)와의 차이: **FrameBox 카드** 안에 행 구조, ✓ 체크 아이콘 포함
- REF-032(번호 카드 3열)와의 차이: 3열이 아닌 **수직 스택**, 카드가 넓은 가로형
- 모두 green — 모든 항목이 이점/긍정
- ✓ 아이콘: green outline 원형 — 완료/확인 상태
- 카드 border 약간 투명 — 은은한 green glow 느낌

---

## REF-042: 중앙 방사형 혼란 + RichText + 경고 인사이트 (Chaos Explosion Diagram)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 통제 불능, 스코프 크리프, 무계획 결과, "이렇게 되면 안 된다"
**아키타입 매핑:** ScatterLayout(random) + G (Warning) 복합

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│         ┌──────────────────┐                             │
│         │ 설계 없이 계속 추가하면│ ← gray border Pill (조건)│
│         └──────────────────┘                             │
│                                                          │
│           ?  ↗                                           │
│        ↖  ┌────────┐  ↗  ?                              │
│      ?    │ 기능 추가 │                                   │
│        ↙  └────────┘  ↘                                 │
│           ?  ↘        ?                                  │
│     (점선 화살표 6방향 + 물음표, 모두 gray/white)           │
│                                                          │
│      처음이랑 완전 다른 게 돼있어요                         │
│      (white + GREEN bold "완전 다른 게", RichText)         │
│                                                          │
│     ⊘  설계서 하나 = 수십 번의 수정을 막아줘요              │
│     (green ⊘ + gray text, 인사이트)                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 조건 Pill | **gray border**(#555), gray text, fill: #2a2a2a, radius: 8px — 부정적 조건 |
| 중앙 박스 | gray border(#555), fill: #2a2a2a, radius: 8px, "기능 추가" white text |
| 방사형 화살표 | **점선**(dashed), white/gray, 6방향으로 발산 |
| 물음표 | white/gray, ~16px, 각 화살표 끝에 배치 |
| 전체 다이어그램 | ScatterLayout(random) 또는 커스텀 SVG — 혼란/폭발 표현 |
| RichText | white + **green bold** ("완전 다른 게"), ~22px, 중앙 |
| 인사이트 | green ⊘(shield-x) 아이콘 + gray text, ~16px |
| 전체 톤 | **gray/white** 다이어그램 + green 인사이트 — 부정→해결 제안 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Pill",
      "data": { "text": "설계 없이 계속 추가하면" },
      "style": { "color": "#888888", "border": "1px solid #555555", "borderRadius": 8, "padding": "8px 20px", "background": "#2a2a2a", "fontSize": 16 }
    },
    {
      "type": "ScatterLayout",
      "data": {
        "pattern": "random",
        "radius": 150,
        "centerIcon": "plus-square",
        "centerSize": 40,
        "centerLabel": "기능 추가"
      },
      "style": { "width": 500, "height": 300 },
      "children": [
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } },
        { "type": "BodyText", "data": { "text": "?" }, "style": { "color": "#888888", "fontSize": 18 } }
      ]
    },
    {
      "type": "RichText",
      "data": {
        "segments": [
          { "text": "처음이랑 ", "style": "default" },
          { "text": "완전 다른 게", "style": "accent-bold" },
          { "text": " 돼있어요", "style": "default" }
        ]
      },
      "style": { "fontSize": 22, "fontWeight": 700, "color": "#ffffff", "textAlign": "center" }
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 8 },
      "children": [
        { "type": "Icon", "data": { "name": "shield-x", "size": 20 }, "style": { "color": "#39FF14" } },
        { "type": "BodyText", "data": { "text": "설계서 하나 = 수십 번의 수정을 막아줘요" }, "style": { "color": "#888888", "fontSize": 16 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **통제 불능, 스코프 크리프, 무계획 결과** 씬에 적용
- 조건 Pill: **gray**(부정적 조건) — REF-041의 green Pill과 대비
- ScatterLayout(random): 혼란/폭발 시각화 — 점선 화살표+물음표
- REF-037(orbit 산재)와의 차이: **방사형 화살표**(점선)가 있고, 더 혼란스러운 느낌
- RichText: **부분 green bold** — 부정적 상황 속 핵심 키워드 강조
- 인사이트: green 방패 아이콘 — 해결책/방어 제안
- REF-041과 **짝** — REF-041은 "있으면 이점", REF-042는 "없으면 이런 문제"

---

## REF-043: 팁 번호 + 좌우 Split — 솔루션(green) vs 문제(gray) (Tip Solution vs Problem Split)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 팁 소개 + 문제 시각화, 해결책(좌) vs 현재 고통(우), 기능 소개+동기 부여
**아키타입 매핑:** C (좌우 VS 대비) 변형 — 좌: 팁 번호+솔루션 아이콘, 우: 문제 일러스트+Pill 대사

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│      TIP ❹  (green outline 원형, ~40px)                  │
│      (좌측 상단 근처)                                      │
│                                                          │
│     🔔 (green, ~80px)     │  🖥 (gray outline, ~100px)   │
│     알림벨 아이콘           │  모니터+로봇 일러스트          │
│     (흔들림 애니메이션)      │  (화면 응시 중인 표정)        │
│                            │                              │
│     완료 알림 설정          │  화면 계속 보고 있는 중        │
│     (GREEN, bold, ~24px)   │  (white, bold, ~20px)        │
│                            │                              │
│                            │  [다 됐나?] [다 됐나?]        │
│                            │  (gray Pill ×2, 반복 대사)    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| TIP 번호 | green outline 원형(~40px), border: 2px #39FF14, 내부 숫자 green bold ~20px |
| "TIP" 텍스트 | gray, sm(~12px), letter-spacing: 2px, 원형 좌측 |
| 좌측 아이콘 (솔루션) | **accent green**, ~80px, 알림벨/도구 아이콘 |
| 좌측 라벨 | **accent green**, bold, ~24px, "완료 알림 설정" |
| 우측 일러스트 | gray/white outline, ~100px, 모니터+캐릭터 조합 |
| 우측 라벨 | white, bold, ~20px, 현재 상태 묘사 |
| 우측 Pill 대사 | gray border(#555), gray text, radius: full-round, "다 됐나?" ×2 |
| Pill 배치 | Stack(row, gap:8), 반복으로 지루함/초조함 표현 |
| 좌우 구분 | 암묵적(수직선 없음) — 좌=green 톤, 우=gray 톤으로 영역 구분 |
| 좌=솔루션/해결책 | green 계열 — 긍정, 기능 소개 |
| 우=문제/현재 고통 | gray/white 계열 — 부정, 공감 유도 |
| 벨 애니메이션 | **흔들림(swing)** — 알림벨이 좌우로 흔들리는 semantic motion |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 80px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 8 },
      "style": { "alignSelf": "flex-start" },
      "children": [
        { "type": "BodyText", "data": { "text": "TIP" }, "style": { "color": "#888888", "fontSize": 12, "letterSpacing": 2 } },
        {
          "type": "Badge",
          "data": { "text": "4" },
          "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 40, "height": 40, "fontSize": 20, "fontWeight": 700, "background": "transparent" }
        }
      ]
    },
    {
      "type": "Split",
      "layout": { "ratio": [1, 1], "gap": 60 },
      "style": { "maxWidth": 900 },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            {
              "type": "Icon",
              "data": { "name": "bell", "size": 80 },
              "style": { "color": "#39FF14" },
              "motion": { "preset": "swing" }
            },
            { "type": "Headline", "data": { "text": "완료 알림 설정" }, "style": { "color": "#39FF14", "fontSize": 24, "fontWeight": 700 } }
          ]
        },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 16 },
          "children": [
            { "type": "Icon", "data": { "name": "monitor", "size": 100 }, "style": { "color": "#888888" } },
            { "type": "BodyText", "data": { "text": "화면 계속 보고 있는 중" }, "style": { "color": "#ffffff", "fontSize": 20, "fontWeight": 700 } },
            {
              "type": "Stack",
              "layout": { "direction": "row", "gap": 8 },
              "children": [
                { "type": "Pill", "data": { "text": "다 됐나?" }, "style": { "color": "#888888", "border": "1px solid #555555", "borderRadius": 20, "padding": "6px 16px", "background": "#2a2a2a", "fontSize": 14 } },
                { "type": "Pill", "data": { "text": "다 됐나?" }, "style": { "color": "#888888", "border": "1px solid #555555", "borderRadius": 20, "padding": "6px 16px", "background": "#2a2a2a", "fontSize": 14 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **팁 소개 + 문제 공감** 씬에 적용 — 해결책과 문제를 동시에 보여줌
- 좌=**green 솔루션**(기능/팁 소개), 우=**gray 문제**(현재 고통/불편)
- REF-012(좌우 텍스트 대비)와의 차이: 텍스트가 아닌 **아이콘 일러스트** 중심
- REF-036(상태 전이)와의 차이: 화살표 없음, Before→After가 아닌 **해결책↔문제 병렬**
- TIP 번호: **좌상단**, 작은 원형(40px) — 섹션 마커
- 벨 아이콘 **swing 애니메이션** — semantic motion (알림=흔들림)
- 우측 Pill 반복("다 됐나?" ×2) — 초조함/반복 행동 시각화
- 수직선 없음 — 좌=green, 우=gray **색상 톤으로 암묵적 분리**
- 우측이 약간 더 복잡(일러스트+라벨+Pill) — 문제의 답답함을 시각적으로 표현

---

## REF-044: 5단계 수평 프로세스 + 색상 전이 + 인사이트 카드 + 부가 태그 (Extended Process Flow)

**출처:** YouTube 레퍼런스 영상 캡처
**용도:** 전체 워크플로우, 5단계 이상 프로세스, 점진적 진행 + 결과 인사이트
**아키타입 매핑:** E (수평 프로세스 플로우) 확장 — 5스텝 + 색상 전이 + 하단 2단 인사이트

### 화면 구성

```
┌──────────────────────────────────────────────────────────┐
│ (배경: #000000)                                           │
│                                                          │
│  ☀ ── 📋 ── ☕ ── 🔔 ── ✓                               │
│  gray    gray    GREEN   GREEN   GREEN                   │
│  ~60px   ~60px   ~60px   ~60px   ~60px                   │
│  원형     원형     원형    원형    원형                     │
│                                                          │
│  훅으로    작업     다른 일  따랑!   결과                   │
│  설정     맡기기   하기            확인                    │
│  (gray)  (gray)  (GREEN) (GREEN) (GREEN)                 │
│                                                          │
│  작업 완료 클로드에게 화면 안  완료 알림 가서 결과만          │
│  시 알림   위임     봐도 됨  수신    보면 끝               │
│  등록                                                    │
│  (gray,sm) (gray,sm) (gray,sm) (gray,sm) (gray,sm)       │
│                                                          │
│  ┌──────────────────────────────────────────┐            │
│  │ 🕐 화면 붙잡고 기다리는 시간 = 0 (GREEN bold)│            │
│  │    그 시간에 다른 일을 할 수 있어요 (gray)   │            │
│  └── green border, dark green tint ─────────┘            │
│                                                          │
│  Boris처럼 여러 클로드 동시 운용 시 ⓒⓒⓒ 특히 유용         │
│  (gray text + green badge ×3 + green "특히 유용")         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 핵심 스타일 특징

| 요소 | 스타일 |
|------|--------|
| 스텝 아이콘 | ~60px 원형 outline, 각각 고유 아이콘 |
| 스텝 1~2 (준비) | **gray**(#888) outline, gray 아이콘 — 준비/설정 단계 |
| 스텝 3~5 (실행~결과) | **green outline**(#39FF14), green 아이콘 — 핵심/활성 단계 |
| 연결선 | 수평 대시(——), 스텝 사이, gray(1~2 구간) / **green**(3~5 구간) |
| 스텝 제목 (gray) | gray, ~16px, 아이콘 아래 |
| 스텝 제목 (green) | **accent green**, bold, ~16px |
| 스텝 부제 | gray(#888), sm(~12px), 제목 아래, 1줄 설명 |
| 인사이트 카드 | FrameBox, **green border**, dark green tint fill, radius:12px, padding:16px 24px |
| 인사이트 제목 | 🕐 아이콘 + **green bold** "화면 붙잡고 기다리는 시간 = 0" |
| 인사이트 부제 | gray, sm, "그 시간에 다른 일을 할 수 있어요" |
| 부가 태그 행 | gray text + green 미니 Badge(ⓒ) ×3 + **green "특히 유용"** |
| 미니 Badge | green fill, ~20px 원형, 내부 "c" dark text |
| 전체 너비 | maxWidth: ~1100px — 5스텝이라 넓음 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "style": { "padding": "40px 40px" },
  "children": [
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "flex-start", "justify": "center", "gap": 8 },
      "style": { "maxWidth": 1100, "width": "100%" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 6 },
          "style": { "width": 140 },
          "children": [
            { "type": "Icon", "data": { "name": "sun", "size": 28 }, "style": { "color": "#888888", "border": "2px solid #555555", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "훅으로 설정" }, "style": { "color": "#888888", "fontSize": 16 } },
            { "type": "BodyText", "data": { "text": "작업 완료 시 알림 등록" }, "style": { "color": "#888888", "fontSize": 12, "textAlign": "center" } }
          ]
        },
        { "type": "LineConnector", "data": { "direction": "horizontal" }, "style": { "color": "#555555", "marginTop": 28 } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 6 },
          "style": { "width": 140 },
          "children": [
            { "type": "Icon", "data": { "name": "send", "size": 28 }, "style": { "color": "#888888", "border": "2px solid #555555", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "작업 맡기기" }, "style": { "color": "#888888", "fontSize": 16 } },
            { "type": "BodyText", "data": { "text": "클로드에게 위임" }, "style": { "color": "#888888", "fontSize": 12, "textAlign": "center" } }
          ]
        },
        { "type": "LineConnector", "data": { "direction": "horizontal" }, "style": { "color": "#39FF14", "marginTop": 28 } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 6 },
          "style": { "width": 140 },
          "children": [
            { "type": "Icon", "data": { "name": "coffee", "size": 28 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "다른 일 하기" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "화면 안 봐도 됨" }, "style": { "color": "#888888", "fontSize": 12, "textAlign": "center" } }
          ]
        },
        { "type": "LineConnector", "data": { "direction": "horizontal" }, "style": { "color": "#39FF14", "marginTop": 28 } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 6 },
          "style": { "width": 140 },
          "children": [
            { "type": "Icon", "data": { "name": "bell", "size": 28 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "따랑!" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "완료 알림 수신" }, "style": { "color": "#888888", "fontSize": 12, "textAlign": "center" } }
          ]
        },
        { "type": "LineConnector", "data": { "direction": "horizontal" }, "style": { "color": "#39FF14", "marginTop": 28 } },
        {
          "type": "Stack",
          "layout": { "direction": "column", "align": "center", "gap": 6 },
          "style": { "width": 140 },
          "children": [
            { "type": "Icon", "data": { "name": "check", "size": 28 }, "style": { "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 60, "height": 60 } },
            { "type": "BodyText", "data": { "text": "결과 확인" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } },
            { "type": "BodyText", "data": { "text": "가서 결과만 보면 끝" }, "style": { "color": "#888888", "fontSize": 12, "textAlign": "center" } }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "style": { "maxWidth": 600, "background": "#0d1f0d", "border": "1px solid #39FF14", "borderRadius": 12, "padding": "16px 24px" },
      "children": [
        {
          "type": "Stack",
          "layout": { "direction": "row", "align": "center", "gap": 8 },
          "children": [
            { "type": "Icon", "data": { "name": "clock", "size": 20 }, "style": { "color": "#39FF14" } },
            { "type": "BodyText", "data": { "text": "화면 붙잡고 기다리는 시간 = 0" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700 } }
          ]
        },
        { "type": "BodyText", "data": { "text": "그 시간에 다른 일을 할 수 있어요" }, "style": { "color": "#888888", "fontSize": 16 } }
      ]
    },
    {
      "type": "Stack",
      "layout": { "direction": "row", "align": "center", "gap": 8 },
      "children": [
        { "type": "BodyText", "data": { "text": "Boris처럼 여러 클로드 동시 운용 시" }, "style": { "color": "#888888", "fontSize": 14 } },
        { "type": "Badge", "data": { "text": "c" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 20, "height": 20, "fontSize": 10, "fontWeight": 700 } },
        { "type": "Badge", "data": { "text": "c" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 20, "height": 20, "fontSize": 10, "fontWeight": 700 } },
        { "type": "Badge", "data": { "text": "c" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": "50%", "width": 20, "height": 20, "fontSize": 10, "fontWeight": 700 } },
        { "type": "BodyText", "data": { "text": "특히 유용" }, "style": { "color": "#39FF14", "fontSize": 14, "fontWeight": 700 } }
      ]
    }
  ]
}
```

### 적용 규칙

- **전체 워크플로우, 5단계 프로세스** 씬에 적용
- REF-001/017(3~4단계)의 확장 — **5스텝**, 화면 전체 너비 활용
- **색상 전이**: 앞쪽 2스텝 gray(준비) → 뒤쪽 3스텝 green(핵심/실행)
- 각 스텝에 **3단 정보**: 아이콘 + 제목 + 부제 — REF-001보다 정보 밀도 높음
- 연결선도 **색상 전이**: gray→green — 프로세스 진행에 따라 활성화
- 하단 인사이트 카드: green border+tint FrameBox — 결과/핵심 이점
- 부가 태그 행: gray 텍스트 + **미니 green Badge(ⓒ) ×3** + green 키워드 — 부가 조건
- 미니 Badge: 여러 인스턴스를 시각적으로 표현 (에이전트 3개 등)
- 스텝 너비 고정(140px) — 5개가 균등 배분되도록
- 벨 아이콘(4번째 스텝): **swing 애니메이션** 가능 — REF-043과 연결

---

## REF-045: Tip Number Hero + 아이콘 설명 + 메뉴 리스트 카드

### 패턴 분류
- **아키타입**: L (Split 비대칭) + I (수직 스텝카드) 혼합
- **용도**: 팁 번호 강조 + 기능/메뉴 목록 소개
- **정보 밀도**: 중 (큰 숫자 1개 + 설명 1줄 + 리스트 3개)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────────────────────┐    │
│              │ → 이전 단계에서 한 단계 더        │    │
│   ┌──────┐  └─────────────────────────────────┘    │
│   │ TIP  │                                          │
│   │  5   │  자주 하는 작업의 **전체 방법**을 스킬로  │
│   │(ring)│                                          │
│   └──────┘  ┌──────────────────────────────────┐   │
│              │ 📋  유튜브 썸네일 만들기        → │   │
│   ┌──────┐  ├──────────────────────────────────┤   │
│   │ 📄   │  │ ✂️  영상 편집하기               → │   │
│   │SKILL │  ├──────────────────────────────────┤   │
│   │ .md  │  │ 📝  스크립트 작성               → │   │
│   └──────┘  └──────────────────────────────────┘   │
│  나만의 단축                                        │
│    메뉴                                             │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  유튜브 썸네일 만들기, 영상 편집하기, 스크립트 ...   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| TIP 텍스트 | `#888888`, fontSize 14, letterSpacing 4, uppercase |
| 숫자 "5" | `#39FF14`, fontSize 72, fontWeight 900 |
| 숫자 원형 링 | border `2px solid #39FF14`, borderRadius 50%, size 160px |
| 파일 아이콘 | 커스텀 SVG (문서 아이콘), size ~60px, 아래 녹색 "SKILL.md" 라벨 |
| 캡션 "나만의 단축 메뉴" | `#888888`, fontSize 14 |
| InsightTile 상단 | border `1px solid #333`, background `#111`, 화살표+RichText |
| RichText 설명 | white + **accent bold** ("전체 방법" = `#39FF14` bold) |
| 리스트 카드 | background `#0d1f0d` (dark green tint), borderRadius 8 |
| 리스트 아이콘 | 각각 다른 이모지/아이콘, size 28 |
| 리스트 텍스트 | `#FFFFFF`, fontSize 18 |
| 리스트 화살표 | `→`, `#555555`, 우측 정렬 |
| 자막바 | 하단 고정, white, accent bold 키워드 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "row",
  "style": { "padding": 60, "gap": 40 },
  "children": [
    {
      "type": "Stack",
      "id": "left-col",
      "direction": "column",
      "style": { "alignItems": "center", "gap": 24, "width": 200 },
      "enterAt": 0,
      "children": [
        {
          "type": "Stack",
          "id": "tip-ring",
          "direction": "column",
          "style": {
            "alignItems": "center",
            "justifyContent": "center",
            "width": 160,
            "height": 160,
            "borderRadius": "50%",
            "border": "2px solid #39FF14",
            "gap": 4
          },
          "enterAt": 0,
          "children": [
            { "type": "BodyText", "id": "tip-label", "data": { "text": "TIP" }, "style": { "color": "#888888", "fontSize": 14, "letterSpacing": 4 }, "enterAt": 0 },
            { "type": "StatNumber", "id": "tip-number", "data": { "value": "5", "size": "xl" }, "style": { "color": "#39FF14", "fontSize": 72, "fontWeight": 900 }, "enterAt": 0 }
          ]
        },
        {
          "type": "Icon",
          "id": "file-icon",
          "data": { "name": "document", "size": 56 },
          "style": { "color": "#888888" },
          "enterAt": 24
        },
        {
          "type": "BodyText",
          "id": "file-caption",
          "data": { "text": "나만의 단축 메뉴" },
          "style": { "color": "#888888", "fontSize": 14 },
          "enterAt": 30
        }
      ]
    },
    {
      "type": "Stack",
      "id": "right-col",
      "direction": "column",
      "style": { "flex": 1, "gap": 24 },
      "enterAt": 12,
      "children": [
        {
          "type": "InsightTile",
          "id": "context-tile",
          "data": { "text": "단축 명령에서 한 단계 더" },
          "style": { "maxWidth": 600 },
          "enterAt": 12
        },
        {
          "type": "RichText",
          "id": "desc-text",
          "data": {
            "segments": [
              { "text": "자주 하는 작업의 ", "style": "normal" },
              { "text": "전체 방법", "style": "accent-bold" },
              { "text": "을 스킬로", "style": "normal" }
            ]
          },
          "style": { "fontSize": 22 },
          "enterAt": 36
        },
        {
          "type": "Stack",
          "id": "menu-list",
          "direction": "column",
          "style": { "gap": 12, "maxWidth": 600 },
          "enterAt": 60,
          "children": [
            {
              "type": "FrameBox",
              "id": "menu-1",
              "style": { "background": "#0d1f0d", "borderRadius": 8, "padding": "14px 20px", "maxWidth": 600 },
              "enterAt": 60,
              "children": [
                {
                  "type": "Stack",
                  "id": "menu-1-row",
                  "direction": "row",
                  "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%", "gap": 16 },
                  "children": [
                    { "type": "Icon", "id": "m1-icon", "data": { "name": "image", "size": 28 }, "style": { "color": "#39FF14" } },
                    { "type": "BodyText", "id": "m1-text", "data": { "text": "유튜브 썸네일 만들기" }, "style": { "color": "#FFFFFF", "fontSize": 18, "flex": 1 } },
                    { "type": "BodyText", "id": "m1-arrow", "data": { "text": "→" }, "style": { "color": "#555555", "fontSize": 18 } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox",
              "id": "menu-2",
              "style": { "background": "#0d1f0d", "borderRadius": 8, "padding": "14px 20px", "maxWidth": 600 },
              "enterAt": 84,
              "children": [
                {
                  "type": "Stack",
                  "id": "menu-2-row",
                  "direction": "row",
                  "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%", "gap": 16 },
                  "children": [
                    { "type": "Icon", "id": "m2-icon", "data": { "name": "settings", "size": 28 }, "style": { "color": "#39FF14" } },
                    { "type": "BodyText", "id": "m2-text", "data": { "text": "영상 편집하기" }, "style": { "color": "#FFFFFF", "fontSize": 18, "flex": 1 } },
                    { "type": "BodyText", "id": "m2-arrow", "data": { "text": "→" }, "style": { "color": "#555555", "fontSize": 18 } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox",
              "id": "menu-3",
              "style": { "background": "#0d1f0d", "borderRadius": 8, "padding": "14px 20px", "maxWidth": 600 },
              "enterAt": 108,
              "children": [
                {
                  "type": "Stack",
                  "id": "menu-3-row",
                  "direction": "row",
                  "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%", "gap": 16 },
                  "children": [
                    { "type": "Icon", "id": "m3-icon", "data": { "name": "document", "size": 28 }, "style": { "color": "#39FF14" } },
                    { "type": "BodyText", "id": "m3-text", "data": { "text": "스크립트 작성" }, "style": { "color": "#FFFFFF", "fontSize": 18, "flex": 1 } },
                    { "type": "BodyText", "id": "m3-arrow", "data": { "text": "→" }, "style": { "color": "#555555", "fontSize": 18 } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **팁/기능 목록 소개** 씬에 적용 — 번호 강조 + 기능 나열
- 좌측: **큰 원형 링 숫자** (StatNumber xl + 원형 border) + 보조 아이콘+캡션
- 우측: InsightTile(맥락) → RichText(설명) → FrameBox 리스트 카드 ×3
- 리스트 카드: `#0d1f0d` dark green tint 배경, 아이콘+텍스트+화살표(→) 3열 row
- REF-039(팁 번호 + 두문자어 카드)와 유사하나, **메뉴/네비게이션 스타일 리스트** — 각 항목이 클릭 가능한 느낌
- FrameBox를 리스트 아이템 래퍼로 활용 — 각각 독립적으로 stagger 등장
- 원형 링: `border: 2px solid #39FF14` + `borderRadius: 50%` — Badge와 다른 대형 원형
- 보조 아이콘(SKILL.md): 좌측 하단에 개념 시각화 — 파일 아이콘+라벨 조합
- enterAt: 좌측 링 즉시(0) → InsightTile(12) → RichText(36) → 카드 순차(60, 84, 108)

### 변형: 대형 SVG 아이콘 + 불릿 리스트 카드

원형 링 숫자 대신 **큰 SVG 그래픽**(문서 아이콘 등, ~120px)을 좌측에 배치하고, 우측에 FrameBox 리스트 카드.
리스트 카드 우측에 **부가 주석**(gray 작은 텍스트 "다 적혀 있어요") 추가.

| 차이점 | REF-045 기본 | 변형 |
|--------|-------------|------|
| 좌측 주인공 | 원형 링 + 숫자 | **대형 SVG 아이콘** (~120px, green tint, glow) + 라벨 |
| InsightTile | 있음 | 없음 — RichText가 직접 헤더 역할 |
| 리스트 카드 우측 | 화살표(→) | 부가 주석 텍스트 (gray, fontSize 13) |
| 불릿 스타일 | 아이콘+텍스트 | **green 불릿(•)** + bold 텍스트 |

```json
{
  "type": "FrameBox",
  "style": { "background": "#1a1a1a", "border": "1px solid #333", "borderRadius": 8, "padding": "14px 20px", "maxWidth": 600 },
  "children": [
    {
      "type": "Stack",
      "direction": "row",
      "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%", "gap": 16 },
      "children": [
        { "type": "BodyText", "data": { "text": "•  어떤 순서로 할지" }, "style": { "color": "#FFFFFF", "fontSize": 18, "fontWeight": 700 } },
        { "type": "BodyText", "data": { "text": "다 적혀 있어요" }, "style": { "color": "#555555", "fontSize": 13 } }
      ]
    }
  ]
}
```

**대형 SVG 아이콘 스타일 포인트:**
- Icon size **100~120px** — 일반 아이콘(28~56px)보다 훨씬 크게
- green tint fill (`#39FF14` 또는 반투명 `rgba(57,255,20,0.15)` 배경)
- 아이콘 아래에 **라벨 텍스트** (green, fontSize 14, fontWeight 700)
- 아이콘 아래에 **캡션** (gray, fontSize 14)
- 이 스타일은 **개념/파일/도구를 시각적 주인공**으로 내세울 때 사용

---

## REF-046: ChatBubble + ProgressBar + 수평 번호 스텝 (활성 스텝 강조)

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + U (ChatBubble) + M (ProgressBar) 혼합
- **용도**: 사용자 명령 → 자동 실행 프로세스 시각화, 진행 상태 표현
- **정보 밀도**: 중 (명령 1개 + 프로그레스 1개 + 4스텝)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         ┌────────────────────────────────┐          │
│         │ 클로드에게: "**그냥** 만들어줘" │          │
│         └────────────────────────────────┘          │
│                                                     │
│  ════════════════════════════════════════════════    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (green bar)        │
│                                                     │
│    ①  ──→  ②  ──→  ③  ──→  ④                      │
│   명령     스킬     단계별   완료                    │
│   수신     파일참조  실행    (green)                  │
│  (gray)  (gray)   (gray)  (active)                  │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  클로드가 스킬 파일을 보고 처음부터 끝까지 ...       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| ChatBubble | border `1px solid #333`, background `#111`, borderRadius 8, padding 16 |
| ChatBubble 접두사 | `#888888` "클로드에게:", fontSize 16 |
| ChatBubble 본문 | `#FFFFFF`, bold, fontSize 20, **"그냥"** = `#39FF14` accent-bold |
| ProgressBar | height 6, background `#39FF14`, borderRadius 3, 전체 너비, maxWidth 700 |
| 스텝 번호 원형 (비활성) | `#333333` fill, `#FFFFFF` 번호 텍스트, size 44 |
| 스텝 번호 원형 (활성/마지막) | border `2px solid #39FF14`, `#000` fill, `#39FF14` 번호 텍스트 |
| 스텝 라벨 (비활성) | `#888888`, fontSize 14 |
| 스텝 라벨 (활성) | `#39FF14`, fontSize 14, fontWeight 700 |
| 화살표 연결 | `→`, `#555555`, fontSize 16 |
| 자막바 | 하단 고정, white, bold |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 60, "gap": 36, "alignItems": "center" },
  "children": [
    {
      "type": "ChatBubble",
      "id": "user-cmd",
      "data": {
        "role": "user",
        "name": "클로드에게",
        "message": "그냥 썸네일 만들어줘"
      },
      "style": { "maxWidth": 520 },
      "enterAt": 0
    },
    {
      "type": "ProgressBar",
      "id": "progress",
      "data": { "value": 100, "label": "" },
      "style": { "maxWidth": 700, "height": 6 },
      "enterAt": 24
    },
    {
      "type": "Stack",
      "id": "steps-row",
      "direction": "row",
      "style": { "gap": 16, "alignItems": "flex-start", "justifyContent": "center", "maxWidth": 900 },
      "enterAt": 48,
      "children": [
        {
          "type": "Stack",
          "id": "step-1",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8, "width": 120 },
          "enterAt": 48,
          "children": [
            { "type": "Badge", "id": "num-1", "data": { "text": "1" }, "style": { "background": "#333333", "color": "#FFFFFF", "borderRadius": "50%", "width": 44, "height": 44, "fontSize": 18, "fontWeight": 700 } },
            { "type": "BodyText", "id": "label-1", "data": { "text": "명령 수신" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "arrow-1",
          "data": { "direction": "right" },
          "style": { "color": "#555555", "marginTop": 12 },
          "enterAt": 60
        },
        {
          "type": "Stack",
          "id": "step-2",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8, "width": 120 },
          "enterAt": 72,
          "children": [
            { "type": "Badge", "id": "num-2", "data": { "text": "2" }, "style": { "background": "#333333", "color": "#FFFFFF", "borderRadius": "50%", "width": 44, "height": 44, "fontSize": 18, "fontWeight": 700 } },
            { "type": "BodyText", "id": "label-2", "data": { "text": "스킬 파일 참조" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "arrow-2",
          "data": { "direction": "right" },
          "style": { "color": "#555555", "marginTop": 12 },
          "enterAt": 84
        },
        {
          "type": "Stack",
          "id": "step-3",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8, "width": 120 },
          "enterAt": 96,
          "children": [
            { "type": "Badge", "id": "num-3", "data": { "text": "3" }, "style": { "background": "#333333", "color": "#FFFFFF", "borderRadius": "50%", "width": 44, "height": 44, "fontSize": 18, "fontWeight": 700 } },
            { "type": "BodyText", "id": "label-3", "data": { "text": "단계별 실행" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "arrow-3",
          "data": { "direction": "right" },
          "style": { "color": "#555555", "marginTop": 12 },
          "enterAt": 108
        },
        {
          "type": "Stack",
          "id": "step-4",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8, "width": 120 },
          "enterAt": 120,
          "children": [
            { "type": "Badge", "id": "num-4", "data": { "text": "4" }, "style": { "background": "#000000", "color": "#39FF14", "border": "2px solid #39FF14", "borderRadius": "50%", "width": 44, "height": 44, "fontSize": 18, "fontWeight": 700 } },
            { "type": "BodyText", "id": "label-4", "data": { "text": "완료" }, "style": { "color": "#39FF14", "fontSize": 14, "fontWeight": 700 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **자동 실행 프로세스, 파이프라인 진행 상태** 씬에 적용
- 상단 ChatBubble: 사용자 명령/트리거를 대화체로 표현 — accent-bold 키워드 강조
- 중간 ProgressBar: 전체 진행 상태 (green, height 6, 가로 전체)
- 하단 수평 4스텝: 번호 원형 Badge + 화살표 + 라벨
- **활성/비활성 색상 코딩**: 비활성 스텝 = gray(`#333` fill, `#888` 라벨), 활성 스텝 = green ring(`border: 2px solid #39FF14`, green 라벨)
- REF-001/044(수평 프로세스)와 다른 점: **ChatBubble 트리거** + **ProgressBar** + **활성 스텝 강조**
- 스텝 번호 원형 크기: 44px (REF-001의 아이콘+키워드보다 번호 중심)
- ProgressBar는 스텝 흐름 위에서 전체 진행률을 시각적으로 보여줌 — 스텝과 이중 인코딩
- enterAt: ChatBubble(0) → ProgressBar(24) → 스텝 순차(48, 72, 96, 120)

---

## REF-047: 앱 아이콘 히어로 + Headline 질문 + Pill 태그 클라우드 + FooterCaption

### 패턴 분류
- **아키타입**: A (히어로 오버레이) + N (RichText + Pill 태그 조합) 혼합
- **용도**: 인트로/도입, 주제 소개 + 키워드 나열 + 공감 유도 질문
- **정보 밀도**: 중 (아이콘 1 + 헤드라인 1 + Pill 7개 + 캡션 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    ┌──────┐                          │
│                    │ ✳️   │ (앱 아이콘, rounded)      │
│                    └──────┘                          │
│                                                     │
│           Claude Code, 써보셨나요?                   │
│              (Headline xl, bold)                     │
│                                                     │
│    ┌─────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌────┐    │
│    │ MCP │ │플러그인│ │프레임워크│ │확장기능│ │세팅│    │
│    └─────┘ └──────┘ └────────┘ └──────┘ └────┘    │
│         ┌────────┐  ┌────────┐                      │
│         │느려요 😰│  │막혀요 🤔│                      │
│         └────────┘  └────────┘                      │
│                                                     │
│      다들 잘 쓰는 것 같은데... 나는 왜?              │
│              (FooterCaption, gray)                   │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  유튜브 보면 다들 엄청 잘 쓰는 것 같은데             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 앱 아이콘 | 이미지 또는 Icon, size 80, borderRadius 16 (rounded square), 배경 `#c4956a` (갈색톤) |
| Headline | `#FFFFFF`, fontSize 40, fontWeight 800, 중앙정렬 |
| Pill 1행 (기능 키워드) | background `#1a1a1a`, border `1px solid #444`, borderRadius 24, padding `10px 24px`, `#FFFFFF` fontSize 18 |
| Pill 2행 (감정 키워드) | background `#1a1a1a`, border `1px solid #333`, borderRadius 24, `#888888` fontSize 16 |
| FooterCaption | `#666666`, fontSize 16, 중앙정렬 |
| 자막바 | 하단 고정, white, bold |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 60, "gap": 28, "alignItems": "center" },
  "children": [
    {
      "type": "Icon",
      "id": "app-icon",
      "data": { "name": "sparkle", "size": 80 },
      "style": { "background": "#c4956a", "borderRadius": 16, "padding": 16 },
      "enterAt": 0
    },
    {
      "type": "Headline",
      "id": "title",
      "data": { "text": "Claude Code, 써보셨나요?", "size": "xl" },
      "style": { "textAlign": "center" },
      "enterAt": 12
    },
    {
      "type": "Stack",
      "id": "pills-row-1",
      "direction": "row",
      "style": { "gap": 12, "justifyContent": "center", "flexWrap": "wrap", "maxWidth": 800 },
      "enterAt": 36,
      "children": [
        { "type": "Pill", "id": "p1", "data": { "text": "MCP" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "color": "#FFFFFF" }, "enterAt": 36 },
        { "type": "Pill", "id": "p2", "data": { "text": "플러그인" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "color": "#FFFFFF" }, "enterAt": 42 },
        { "type": "Pill", "id": "p3", "data": { "text": "프레임워크" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "color": "#FFFFFF" }, "enterAt": 48 },
        { "type": "Pill", "id": "p4", "data": { "text": "확장 기능" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "color": "#FFFFFF" }, "enterAt": 54 },
        { "type": "Pill", "id": "p5", "data": { "text": "세팅" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "color": "#FFFFFF" }, "enterAt": 60 }
      ]
    },
    {
      "type": "Stack",
      "id": "pills-row-2",
      "direction": "row",
      "style": { "gap": 12, "justifyContent": "center" },
      "enterAt": 72,
      "children": [
        { "type": "Pill", "id": "p6", "data": { "text": "느려요" }, "style": { "background": "#1a1a1a", "border": "1px solid #333", "color": "#888888" }, "enterAt": 72 },
        { "type": "Pill", "id": "p7", "data": { "text": "막혀요" }, "style": { "background": "#1a1a1a", "border": "1px solid #333", "color": "#888888" }, "enterAt": 78 }
      ]
    },
    {
      "type": "FooterCaption",
      "id": "caption",
      "data": { "text": "다들 잘 쓰는 것 같은데... 나는 왜?" },
      "style": { "color": "#666666" },
      "enterAt": 96
    }
  ]
}
```

### 적용 규칙

- **인트로, 주제 도입, 공감 유도** 씬에 적용
- 중앙 정렬 수직 스택 — 아이콘 → 질문형 Headline → Pill 태그 클라우드 → 공감 캡션
- **Pill 2행 구조**: 1행 = 기능/개념 키워드 (white, 진한 border), 2행 = 감정/상태 키워드 (gray, 연한 border)
- 1행과 2행의 **색상 차이**로 키워드 카테고리 구분: 기능 vs 감정/고민
- REF-030(아이콘→Pill 팬아웃)과 다른 점: **질문형 Headline이 중심**, Pill은 보조 키워드 나열
- 앱 아이콘: rounded square (borderRadius 16) — 일반 원형 아이콘과 차별화
- Pill stagger 등장: 6프레임 간격으로 빠르게 하나씩 팝인 — 키워드가 쏟아지는 느낌
- FooterCaption: 공감 유도 질문/독백 — gray 색상으로 부드럽게

---

## REF-048: 부정 → 화살표 → Green 진단 Headline + 해결 Pill

### 패턴 분류
- **아키타입**: B (풀블리드 임팩트) + T (미니멀 전환) 혼합
- **용도**: 오해 부정 → 진짜 원인 진단 → 해결책 제시 (3단 논리 전개)
- **정보 밀도**: 낮 (텍스트 3개 + 화살표 1개)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│              AI 탓?  ✕                               │
│              (gray, 취소선/부정)                      │
│                                                     │
│                  ↓                                   │
│            (LineConnector)                           │
│                                                     │
│             순서 문제                                 │
│        (green xl, glow 효과)                         │
│                                                     │
│           ┌──────────────┐                           │
│           │ 10단계 로드맵 │                           │
│           └──────────────┘                           │
│          (green border Pill)                         │
│                                                     │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  10단계 로드맵으로요                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 부정 텍스트 "AI 탓?" | `#888888`, fontSize 24, fontWeight 700 |
| ✕ 아이콘 | `#888888`, size 28, border `1px solid #555`, borderRadius 50% (원형 배경) |
| LineConnector ↓ | `#555555`, direction vertical, height ~40px |
| Headline "순서 문제" | `#39FF14`, fontSize 56, fontWeight 900, textShadow `0 0 40px rgba(57,255,20,0.5)` (glow) |
| Pill "10단계 로드맵" | border `1.5px solid #39FF14`, background `#0d1f0d`, color `#39FF14`, borderRadius 24, padding `12px 32px`, fontSize 18 |
| 자막바 | 하단 고정, white, bold |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 80, "gap": 8, "alignItems": "center", "justifyContent": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "denial-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 12 },
      "enterAt": 0,
      "children": [
        { "type": "BodyText", "id": "denial-text", "data": { "text": "AI 탓?" }, "style": { "color": "#888888", "fontSize": 24, "fontWeight": 700 } },
        { "type": "Icon", "id": "x-icon", "data": { "name": "close", "size": 28 }, "style": { "color": "#888888", "border": "1px solid #555", "borderRadius": "50%", "padding": 4 } }
      ]
    },
    {
      "type": "LineConnector",
      "id": "arrow-down",
      "data": { "direction": "vertical" },
      "style": { "color": "#555555", "height": 40 },
      "enterAt": 24
    },
    {
      "type": "Headline",
      "id": "diagnosis",
      "data": { "text": "순서 문제", "size": "xl" },
      "style": { "color": "#39FF14", "textShadow": "0 0 40px rgba(57,255,20,0.5)" },
      "enterAt": 48
    },
    {
      "type": "Pill",
      "id": "solution-pill",
      "data": { "text": "10단계 로드맵" },
      "style": { "border": "1.5px solid #39FF14", "background": "#0d1f0d", "color": "#39FF14", "padding": "12px 32px", "fontSize": 18 },
      "enterAt": 72
    }
  ]
}
```

### 적용 규칙

- **오해 부정 → 진짜 원인 → 해결책** 3단 논리 전개 씬에 적용
- 최소 요소로 최대 임팩트 — **4개 요소만** (부정 텍스트, 화살표, 진단 Headline, 해결 Pill)
- **color 대비**: gray(부정/오해) → green(진단/해결) — 위에서 아래로 색상 전환
- Headline **glow 효과** 필수: `textShadow: 0 0 40px rgba(57,255,20,0.5)` — 핵심 진단을 시각적으로 강조
- ✕ 아이콘: 원형 border 안에 close — "이건 아니다"를 시각적으로 표현
- REF-021(전환 브레이커)과 유사하나, **부정→진단→해결 3단 논리** 구조가 차별점
- Pill: 해결책/다음 단계를 CTA 버튼처럼 표현 — green border + dark green tint
- enterAt: 부정(0) → 화살표(24) → 진단(48) → 해결(72) — 논리 순서대로 등장

---

## REF-049: 이미지 = 아이콘 등치 비유 + Headline + Pill 조합 태그

### 패턴 분류
- **아키타입**: A (히어로 오버레이) + 독자적 (등치 비유)
- **용도**: 비유/은유를 시각적으로 표현 — "A = B" 등치, 두 속성 조합
- **정보 밀도**: 중 (이미지 1 + 아이콘 1 + Headline 1 + Pill 2 + 캡션 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        ┌────────┐           ┌──────┐                │
│        │ 📷     │     =     │ ✳️   │                │
│        │ 인물   │           │(앱   │                │
│        │ 사진   │           │아이콘)│                │
│        └────────┘           └──────┘                │
│         아인슈타인          Claude Code              │
│                                                     │
│            치매 걸린 아인슈타인                       │
│            (Headline xl, white)                      │
│                                                     │
│        ┌──────┐  +  ┌──────────┐                    │
│        │ 천재 │     │ 기억 상실 │                    │
│        └──────┘     └──────────┘                    │
│       (green)        (gray)                         │
│                                                     │
│   코드 짜고, 아키텍처 설계하고... 기억을 못해요      │
│            (FooterCaption, gray)                     │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  엄청 잘해요. 근데 기억을 못해요                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 인물 사진 (ImageAsset) | maxWidth 160, maxHeight 200, borderRadius 4, objectFit cover, grayscale |
| 사진 캡션 | `#FFFFFF`, fontSize 14, 중앙정렬 |
| "=" 기호 | `#888888`, fontSize 36, fontWeight 300 |
| 앱 아이콘 | size 100, borderRadius 16 (rounded square), 배경색 있음 |
| 아이콘 캡션 | `#FFFFFF`, fontSize 14, 중앙정렬 |
| Headline | `#FFFFFF`, fontSize 40, fontWeight 800, 중앙정렬 |
| Pill (긍정/green) | border `1.5px solid #39FF14`, background transparent, color `#39FF14`, fontSize 18 |
| "+" 기호 | `#888888`, fontSize 20 |
| Pill (부정/gray) | border `1px solid #555`, background `#1a1a1a`, color `#FFFFFF`, fontSize 18 |
| FooterCaption | `#555555`, fontSize 15, 중앙정렬, maxWidth 600, 2줄 가능 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 60, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "comparison-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 32, "justifyContent": "center" },
      "enterAt": 0,
      "children": [
        {
          "type": "Stack",
          "id": "left-figure",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 0,
          "children": [
            { "type": "ImageAsset", "id": "person-photo", "data": { "src": "images/einstein.jpg", "alt": "아인슈타인", "objectFit": "cover", "rounded": true, "maxHeight": 200 }, "style": { "maxWidth": 160, "borderRadius": 4 }, "enterAt": 0 },
            { "type": "BodyText", "id": "person-name", "data": { "text": "아인슈타인" }, "style": { "color": "#FFFFFF", "fontSize": 14 } }
          ]
        },
        {
          "type": "BodyText",
          "id": "equals-sign",
          "data": { "text": "=" },
          "style": { "color": "#888888", "fontSize": 36, "fontWeight": 300 },
          "enterAt": 12
        },
        {
          "type": "Stack",
          "id": "right-figure",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 24,
          "children": [
            { "type": "Icon", "id": "app-icon", "data": { "name": "sparkle", "size": 100 }, "style": { "background": "#c4956a", "borderRadius": 16, "padding": 16 } },
            { "type": "BodyText", "id": "app-name", "data": { "text": "Claude Code" }, "style": { "color": "#FFFFFF", "fontSize": 14 } }
          ]
        }
      ]
    },
    {
      "type": "Headline",
      "id": "title",
      "data": { "text": "치매 걸린 아인슈타인", "size": "xl" },
      "style": { "textAlign": "center" },
      "enterAt": 48
    },
    {
      "type": "Stack",
      "id": "tags-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16, "justifyContent": "center" },
      "enterAt": 72,
      "children": [
        { "type": "Pill", "id": "tag-positive", "data": { "text": "천재" }, "style": { "border": "1.5px solid #39FF14", "color": "#39FF14", "background": "transparent" }, "enterAt": 72 },
        { "type": "BodyText", "id": "plus-sign", "data": { "text": "+" }, "style": { "color": "#888888", "fontSize": 20 } },
        { "type": "Pill", "id": "tag-negative", "data": { "text": "기억 상실" }, "style": { "border": "1px solid #555", "color": "#FFFFFF", "background": "#1a1a1a" }, "enterAt": 84 }
      ]
    },
    {
      "type": "FooterCaption",
      "id": "desc",
      "data": { "text": "코드 짜고, 설계하고... 기억을 못해요" },
      "style": { "color": "#555555", "maxWidth": 600 },
      "enterAt": 108
    }
  ]
}
```

### 적용 규칙

- **비유/은유, A=B 등치** 씬에 적용 — 두 대상을 시각적으로 동치시킴
- 상단: **ImageAsset + "=" + Icon/ImageAsset** 수평 배치 — 비유의 양 항
- ImageAsset: **실제 사진** 사용 (grayscale 가능), borderRadius 4, 아래에 캡션
- "=" 기호: gray, 큰 폰트 — 연결 연산자
- Headline: 비유를 한 문장으로 — 유머/위트 가능
- **Pill 조합 태그**: green(긍정 속성) + gray(부정 속성) — "+" 기호로 연결하여 복합 속성 표현
- FooterCaption: 비유를 풀어서 설명하는 부연 텍스트 (gray, 2줄 가능)
- `assets.images[]`에 이미지가 있어야 함 — 없으면 PersonAvatar나 대형 Icon으로 대체
- enterAt: 비유 양항(0, 24) → "="(12) → Headline(48) → Pill 조합(72, 84) → 캡션(108)

---

## REF-050: 대형 SVG 일러스트 + 좌우 대비 라벨 (비유 중심)

### 패턴 분류
- **아키타입**: A (히어로 오버레이) 변형
- **용도**: 비유/은유를 대형 일러스트로 시각화 + 좌우 키워드 대비
- **정보 밀도**: 낮 (상단 캡션 1 + 일러스트 1 + 라벨 2)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│       자전거는 책으로 배울 수 없어요                  │
│            (Kicker, gray)                            │
│                                                     │
│                 ┌───────────┐                        │
│                 │           │                        │
│                 │  🚲 SVG   │  (대형 green 일러스트)  │
│                 │ ~200px    │                        │
│                 │           │                        │
│                 └───────────┘                        │
│                                                     │
│        책 100시간       넘어져봐야                    │
│         = 못 탐          늘어요                      │
│        (gray)          (green bold)                  │
│                                                     │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  가계부 앱이든 일정 정리 도구든 ...                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker 상단 캡션 | `#888888`, fontSize 18, 중앙정렬 |
| 대형 SVG 일러스트 | `#39FF14` stroke, size ~200px, 중앙정렬, line-art 스타일 |
| 좌측 라벨 상단 | `#FFFFFF`, fontSize 22, fontWeight 700 ("책 100시간") |
| 좌측 라벨 하단 | `#888888`, fontSize 14 ("= 못 탐") |
| 우측 라벨 상단 | `#39FF14`, fontSize 22, fontWeight 700 ("넘어져봐야") |
| 우측 라벨 하단 | `#888888`, fontSize 14 ("늘어요") |
| 자막바 | 하단 고정, white, bold |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 80, "gap": 24, "alignItems": "center", "justifyContent": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "top-caption",
      "data": { "text": "자전거는 책으로 배울 수 없어요" },
      "style": { "color": "#888888", "fontSize": 18 },
      "enterAt": 0
    },
    {
      "type": "Icon",
      "id": "hero-illustration",
      "data": { "name": "bicycle", "size": 200 },
      "style": { "color": "#39FF14" },
      "motion": { "preset": "scale-in" },
      "enterAt": 18
    },
    {
      "type": "Stack",
      "id": "labels-row",
      "direction": "row",
      "style": { "gap": 80, "justifyContent": "center", "alignItems": "flex-start" },
      "enterAt": 48,
      "children": [
        {
          "type": "Stack",
          "id": "label-left",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 4 },
          "enterAt": 48,
          "children": [
            { "type": "BodyText", "id": "left-main", "data": { "text": "책 100시간" }, "style": { "color": "#FFFFFF", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "id": "left-sub", "data": { "text": "= 못 탐" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "Stack",
          "id": "label-right",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 4 },
          "enterAt": 72,
          "children": [
            { "type": "BodyText", "id": "right-main", "data": { "text": "넘어져봐야" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
            { "type": "BodyText", "id": "right-sub", "data": { "text": "늘어요" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **비유/은유 + 핵심 대비** 씬에 적용 — 일러스트가 비유를 시각화
- 중앙에 **대형 SVG 일러스트** (size 200px, green, line-art) — 화면의 주인공
- 일러스트 아래에 **좌우 라벨 대비**: 좌(white/gray, 부정/비효율) vs 우(green, 긍정/해결)
- 각 라벨 2단 구조: **상단 키워드**(bold) + **하단 부연**(gray, 작은 폰트)
- REF-049(이미지 등치 비유)와 다른 점: **단일 일러스트** 중심, 좌우는 대비 라벨(이미지 아님)
- Kicker: 비유 문장을 상단에 — gray, 비유의 맥락 제공
- Icon size 200px — REF-045 변형(100~120px)보다 더 큼, 화면의 절반 차지
- motion `scale-in`: 일러스트가 커지면서 등장 — 시선 집중
- enterAt: Kicker(0) → 일러스트(18) → 좌 라벨(48) → 우 라벨(72)

---

## REF-051: Badge 스텝 + Headline + 아키텍처 다이어그램 (아이콘 → 중앙 박스 → 도구 목록)

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + F (FrameBox 카드) 혼합
- **용도**: 시스템 아키텍처, 연결 구조, 미들웨어/프로토콜 설명
- **정보 밀도**: 중 (Badge 1 + Headline 2 + 다이어그램 3열 + RichText 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────┐                             │
│              │ 4단계    │ (Badge, green)              │
│              └─────────┘                             │
│                                                     │
│              MCP 연결                                │
│           (Headline xl)                              │
│         Model Context Protocol                      │
│           (Kicker, gray)                             │
│                                                     │
│  ┌──────┐    ┌─────────────────┐    ┌──────────┐   │
│  │ ✳️   │ ── │  ╭──────────╮   │ ── │ GitHub   │   │
│  │Claude│    │  │          │   │    │ 브라우저  │   │
│  └──────┘    │  ╰──────────╯   │    │ DB       │   │
│              │      MCP        │    └──────────┘   │
│              └─────────────────┘     도구들         │
│                (FrameBox green)                      │
│                                                     │
│      클로드 코드에 **팔다리**를 붙여주는 것           │
│            (RichText, accent-bold)                   │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  GitHub MCP 연결하면                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Badge "4단계" | border `1.5px solid #39FF14`, background transparent, color `#39FF14`, borderRadius 20, padding `6px 20px` |
| Headline "MCP 연결" | `#FFFFFF`, fontSize 40, fontWeight 800, 중앙정렬 |
| 부제 "Model Context Protocol" | `#888888`, fontSize 16 |
| 좌측 아이콘 (Claude) | size 80, borderRadius 16, background `#c4956a`, 아래 캡션 white |
| 연결선 "──" | `#39FF14`, width 40, height 2 (수평 선) |
| 중앙 FrameBox (MCP) | border `1.5px solid #39FF14`, background `#0a0a0a`, borderRadius 12, padding 24, maxWidth 280 |
| FrameBox 내부 캡슐 | borderRadius 24, background `rgba(57,255,20,0.15)`, padding `12px 40px` |
| FrameBox 라벨 "MCP" | `#39FF14`, fontSize 16, 중앙정렬 |
| 우측 도구 스택 | Stack(col), gap 8 |
| 도구 Pill | background `#39FF14`, color `#000000`, borderRadius 6, padding `6px 16px`, fontWeight 700, fontSize 14 |
| 도구 캡션 "도구들" | `#888888`, fontSize 13 |
| RichText | white + **accent-bold** ("팔다리" = green bold) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Badge",
      "id": "step-badge",
      "data": { "text": "4단계" },
      "style": { "border": "1.5px solid #39FF14", "color": "#39FF14", "background": "transparent" },
      "enterAt": 0
    },
    {
      "type": "Headline",
      "id": "title",
      "data": { "text": "MCP 연결", "size": "xl" },
      "enterAt": 8
    },
    {
      "type": "Kicker",
      "id": "subtitle",
      "data": { "text": "Model Context Protocol" },
      "style": { "color": "#888888" },
      "enterAt": 8
    },
    {
      "type": "Stack",
      "id": "architecture-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 24, "justifyContent": "center", "maxWidth": 900 },
      "enterAt": 30,
      "children": [
        {
          "type": "Stack",
          "id": "source",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 30,
          "children": [
            { "type": "Icon", "id": "claude-icon", "data": { "name": "sparkle", "size": 80 }, "style": { "background": "#c4956a", "borderRadius": 16, "padding": 16 } },
            { "type": "BodyText", "id": "claude-label", "data": { "text": "Claude" }, "style": { "color": "#FFFFFF", "fontSize": 14 } }
          ]
        },
        {
          "type": "LineConnector",
          "id": "line-1",
          "data": { "direction": "horizontal" },
          "style": { "color": "#39FF14", "width": 40 },
          "enterAt": 42
        },
        {
          "type": "FrameBox",
          "id": "middleware-box",
          "style": { "border": "1.5px solid #39FF14", "background": "#0a0a0a", "borderRadius": 12, "padding": 24, "maxWidth": 280, "alignItems": "center", "gap": 12 },
          "enterAt": 54,
          "children": [
            { "type": "Pill", "id": "capsule", "data": { "text": "" }, "style": { "background": "rgba(57,255,20,0.15)", "borderRadius": 24, "width": 140, "height": 40 } },
            { "type": "BodyText", "id": "mcp-label", "data": { "text": "MCP" }, "style": { "color": "#39FF14", "fontSize": 16 } }
          ]
        },
        {
          "type": "LineConnector",
          "id": "line-2",
          "data": { "direction": "horizontal" },
          "style": { "color": "#39FF14", "width": 40 },
          "enterAt": 66
        },
        {
          "type": "Stack",
          "id": "tools-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 78,
          "children": [
            { "type": "Pill", "id": "tool-1", "data": { "text": "GitHub" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": 6, "fontWeight": 700 }, "enterAt": 78 },
            { "type": "Pill", "id": "tool-2", "data": { "text": "브라우저" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": 6, "fontWeight": 700 }, "enterAt": 90 },
            { "type": "Pill", "id": "tool-3", "data": { "text": "DB" }, "style": { "background": "#39FF14", "color": "#000000", "borderRadius": 6, "fontWeight": 700 }, "enterAt": 102 },
            { "type": "BodyText", "id": "tools-caption", "data": { "text": "도구들" }, "style": { "color": "#888888", "fontSize": 13 } }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "id": "explanation",
      "data": {
        "segments": [
          { "text": "클로드 코드에 ", "style": "normal" },
          { "text": "팔다리", "style": "accent-bold" },
          { "text": "를 붙여주는 것", "style": "normal" }
        ]
      },
      "style": { "fontSize": 20, "textAlign": "center" },
      "enterAt": 120
    }
  ]
}
```

### 적용 규칙

- **시스템 아키텍처, 미들웨어, 프로토콜 연결 구조** 씬에 적용
- 3열 구조: 소스(아이콘) → 미들웨어(FrameBox green border) → 대상들(Pill 세로 스택)
- **수평 LineConnector** green — 데이터/연결 흐름 표현
- 중앙 FrameBox: green border + 내부 캡슐(반투명 green) + 라벨 — 허브/미들웨어 역할 강조
- 우측 도구 목록: **green filled Pill** 세로 스택 — 연결 대상이 여러 개 (팬아웃)
- REF-001/044(수평 프로세스)와 다른 점: 동일 크기 스텝이 아닌 **비대칭 3열** (소스→허브→대상들)
- 하단 RichText: 비유적 한 줄 설명 — accent-bold 키워드
- **green filled Pill**(도구)은 stagger 등장 — 도구가 하나씩 연결되는 느낌
- Badge "N단계": 시리즈물에서 현재 스텝 표시
- enterAt: Badge(0) → Header(8) → 소스(30) → 연결선(42) → 허브(54) → 연결선(66) → 도구 순차(78,90,102) → 설명(120)

---

## REF-052: Kicker + 아이콘 카드 수직 리스트 (아이콘 박스 + 제목 + 설명)

### 패턴 분류
- **아키타입**: I (수직 스텝카드) 변형
- **용도**: 기능/도구/예시 목록 나열 — 각 항목에 아이콘 + 제목 + 한 줄 설명
- **정보 밀도**: 중 (Kicker 1 + 카드 3개)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              MCP 연결 예시                            │
│              (Kicker, gray)                          │
│                                                     │
│    ┌────┐  GitHub MCP                                │
│    │ 🐙 │  PR 만들기 · 이슈 달기 · 코드 리뷰         │
│    └────┘  (green title + gray desc)                 │
│                                                     │
│    ┌────┐  브라우저 MCP                              │
│    │ 🌐 │  웹 열기 · 클릭 · 스크린샷                 │
│    └────┘                                            │
│                                                     │
│    ┌────┐  데이터베이스 MCP                           │
│    │ 🗄️ │  DB에 직접 쿼리를 날릴 수 있어요           │
│    └────┘                                            │
│                                                     │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  이걸 간편하게 해주는 것이 바로 MCP입니다            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888888`, fontSize 16, letterSpacing 2, 중앙정렬 |
| 아이콘 박스 | border `1.5px solid #39FF14`, background `#0a0a0a`, borderRadius 12, size 56, 아이콘 `#39FF14` size 28 |
| 카드 제목 | `#39FF14`, fontSize 22, fontWeight 700 |
| 카드 설명 | `#888888`, fontSize 15 |
| 카드 간 gap | 28px |
| 리스트 maxWidth | 520 |
| 자막바 | 하단 고정, white, bold |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 60, "gap": 28, "alignItems": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "section-title",
      "data": { "text": "MCP 연결 예시" },
      "style": { "color": "#888888", "letterSpacing": 2 },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "card-list",
      "direction": "column",
      "style": { "gap": 28, "maxWidth": 520 },
      "enterAt": 24,
      "children": [
        {
          "type": "Stack",
          "id": "card-1",
          "direction": "row",
          "style": { "alignItems": "center", "gap": 20 },
          "enterAt": 24,
          "children": [
            { "type": "Icon", "id": "icon-1", "data": { "name": "github", "size": 28 }, "style": { "color": "#39FF14", "border": "1.5px solid #39FF14", "background": "#0a0a0a", "borderRadius": 12, "padding": 14 } },
            {
              "type": "Stack",
              "id": "text-1",
              "direction": "column",
              "style": { "gap": 4 },
              "children": [
                { "type": "BodyText", "id": "title-1", "data": { "text": "GitHub MCP" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
                { "type": "BodyText", "id": "desc-1", "data": { "text": "PR 만들기 · 이슈 달기 · 코드 리뷰" }, "style": { "color": "#888888", "fontSize": 15 } }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "id": "card-2",
          "direction": "row",
          "style": { "alignItems": "center", "gap": 20 },
          "enterAt": 54,
          "children": [
            { "type": "Icon", "id": "icon-2", "data": { "name": "browser", "size": 28 }, "style": { "color": "#39FF14", "border": "1.5px solid #39FF14", "background": "#0a0a0a", "borderRadius": 12, "padding": 14 } },
            {
              "type": "Stack",
              "id": "text-2",
              "direction": "column",
              "style": { "gap": 4 },
              "children": [
                { "type": "BodyText", "id": "title-2", "data": { "text": "브라우저 MCP" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
                { "type": "BodyText", "id": "desc-2", "data": { "text": "웹 열기 · 클릭 · 스크린샷" }, "style": { "color": "#888888", "fontSize": 15 } }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "id": "card-3",
          "direction": "row",
          "style": { "alignItems": "center", "gap": 20 },
          "enterAt": 84,
          "children": [
            { "type": "Icon", "id": "icon-3", "data": { "name": "database", "size": 28 }, "style": { "color": "#39FF14", "border": "1.5px solid #39FF14", "background": "#0a0a0a", "borderRadius": 12, "padding": 14 } },
            {
              "type": "Stack",
              "id": "text-3",
              "direction": "column",
              "style": { "gap": 4 },
              "children": [
                { "type": "BodyText", "id": "title-3", "data": { "text": "데이터베이스 MCP" }, "style": { "color": "#39FF14", "fontSize": 22, "fontWeight": 700 } },
                { "type": "BodyText", "id": "desc-3", "data": { "text": "DB에 직접 쿼리를 날릴 수 있어요" }, "style": { "color": "#888888", "fontSize": 15 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **기능/도구/예시 목록** 씬에 적용 — 각 항목이 아이콘+제목+설명 3요소
- 아이콘 박스: **green border 정사각형** (border `1.5px solid #39FF14`, borderRadius 12) — REF-045 메뉴 리스트와 다른 스타일
- 제목: **green bold** — 항목명이 강조색
- 설명: gray, 중간점(·)으로 구분된 기능 나열
- REF-045(메뉴 리스트 카드)와 다른 점: FrameBox 배경 없이 **아이콘 박스 + 텍스트만** — 더 가볍고 깔끔
- maxWidth 520 — 좌측 정렬, 화면 중앙에 위치
- 카드 간 gap 28px — 여유 있는 수직 간격
- 아이콘 박스 padding 14: 아이콘(28) + padding(14×2) = 56px 정사각 박스
- enterAt: Kicker(0) → 카드 순차(24, 54, 84) — 30프레임 간격

---

## REF-053: Badge 스텝 + RichText 등식 Headline + 대형 아이콘 + InsightTile

### 패턴 분류
- **아키타입**: B (풀블리드 임팩트) + K (단일 IconCard 집중) 혼합
- **용도**: 개념 정의 (A = B의 C), 비유 + 대형 아이콘 시각화 + 부연 인사이트
- **정보 밀도**: 중 (Badge 1 + Headline 1 + 부제 1 + 아이콘 1 + InsightTile 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────┐                             │
│              │ 5단계    │ (Badge, green)              │
│              └─────────┘                             │
│                                                     │
│         토큰 = 클로드의 **연료**                      │
│         (RichText, white + accent-bold)              │
│                                                     │
│       MCP 켜는 순간 대화 전부터 소비 시작             │
│         (Kicker, gray)                               │
│                                                     │
│                 ┌──────┐                             │
│                 │ 🔋   │ (대형 green 아이콘, ~100px) │
│                 └──────┘                             │
│                                                     │
│    ┌──────────────────────────────────────────┐      │
│    │ 😵 아인슈타인의 **기억 용량**이라고 생각해요│      │
│    └──────────────────────────────────────────┘      │
│         (InsightTile, 아이콘 + RichText)             │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  MCP를 켜는 순간 대화 시작 전부터 비용이 ...         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Badge "5단계" | border `1.5px solid #39FF14`, background transparent, color `#39FF14`, borderRadius 20 |
| RichText Headline | fontSize 36, fontWeight 800 — "토큰 = 클로드의 " white + "연료" `#39FF14` bold |
| Kicker 부제 | `#888888`, fontSize 16 |
| 대형 아이콘 (배터리) | `#39FF14` stroke, size 100, 중앙정렬 |
| InsightTile | background `#1a1a1a`, border `1px solid #333`, borderRadius 8, padding `14px 24px`, maxWidth 520 |
| InsightTile 아이콘 | size 24, `#888888` (이모지/아이콘) |
| InsightTile 텍스트 | white + **accent-bold** ("기억 용량" = green bold), fontSize 16 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Badge",
      "id": "step-badge",
      "data": { "text": "5단계" },
      "style": { "border": "1.5px solid #39FF14", "color": "#39FF14", "background": "transparent" },
      "enterAt": 0
    },
    {
      "type": "RichText",
      "id": "equation-headline",
      "data": {
        "segments": [
          { "text": "토큰 = 클로드의 ", "style": "normal" },
          { "text": "연료", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 36, "fontWeight": 800, "textAlign": "center" },
      "enterAt": 8
    },
    {
      "type": "Kicker",
      "id": "subtitle",
      "data": { "text": "MCP 켜는 순간 대화 전부터 소비 시작" },
      "style": { "color": "#888888" },
      "enterAt": 8
    },
    {
      "type": "Icon",
      "id": "hero-icon",
      "data": { "name": "battery", "size": 100 },
      "style": { "color": "#39FF14" },
      "motion": { "preset": "scale-in" },
      "enterAt": 30
    },
    {
      "type": "InsightTile",
      "id": "insight",
      "data": { "text": "아인슈타인의 기억 용량이라고 생각해요" },
      "style": { "maxWidth": 520 },
      "enterAt": 60
    }
  ]
}
```

### 적용 규칙

- **개념 정의, A = B의 C** 등식 씬에 적용 — RichText로 등식 표현
- Badge: 시리즈 스텝 번호 (선택적)
- RichText Headline: "A = B의 **C**" 형태 — 마지막 키워드가 accent-bold
- Kicker 부제: 등식에 대한 부연 설명 (gray)
- **대형 아이콘**: 등식의 핵심 개념을 시각화 (size 100, green, scale-in 모션)
- InsightTile: 비유적 부연 — 아이콘 + RichText (accent-bold 키워드 포함)
- REF-050(대형 SVG + 좌우 대비)과 다른 점: **수직 중앙 정렬**, 좌우 대비 없이 **등식 → 아이콘 → 인사이트** 순차 전개
- 대형 아이콘은 비유적/개념적 (배터리=연료, 톱니=설정 등) — 리터럴 아이콘
- enterAt: Badge(0) → RichText+Kicker(8) → 아이콘(30) → InsightTile(60)

---

## REF-054: Kicker + 카드→화살표→카드 플로우 + ChatBubble 인용 + 결과 행

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + U (ChatBubble) 혼합
- **용도**: 프로세스/메커니즘 설명 — 입력→처리→출력 + 대사 인용 + 결과 요약
- **정보 밀도**: 높 (Kicker 1 + 카드 2 + 화살표 1 + ChatBubble 1 + 결과 행 1 + 캡션 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│       MCP가 세션 시작할 때 하는 일                    │
│            (Kicker, gray)                            │
│                                                     │
│  ┌──────────────┐        ┌──────────────────┐       │
│  │  MCP 서버    │  ───→  │ 클로드 머릿속     │       │
│  │  5개 켜짐    │        │ 기능 목록 강제 주입│       │
│  └──────────────┘        └──────────────────┘       │
│   (gray border)           (green border+tint)        │
│                                                     │
│        ┌─────────────────────────────────┐          │
│        │ "나 이런 기능들이 있어요~"       │          │
│        │  목록 통째로 주입 → 이미 소비 시작│          │
│        └─────────────────────────────────┘          │
│              (ChatBubble / FrameBox)                 │
│                                                     │
│     ⓪  글자 입력 전  →  **이미 소비 중**             │
│    (Badge)  (white)  (→)  (green bold)               │
│                                                     │
│   여러분이 대화 한 글자도 쓰기 전에 이미 소비가 ...   │
│              (FooterCaption, gray)                   │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  여러분이 대화 한 글자도 쓰기 전에                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888888`, fontSize 16, 중앙정렬 |
| 좌측 카드 (MCP 서버) | border `1px solid #555`, background `#111`, borderRadius 8, padding 20, maxWidth 240 |
| 좌측 카드 제목 | `#FFFFFF`, fontSize 20, fontWeight 700 |
| 좌측 카드 부제 | `#888888`, fontSize 14 |
| ArrowConnector | `#888888`, direction right |
| 우측 카드 (클로드 머릿속) | border `1.5px solid #39FF14`, background `#0d1f0d`, borderRadius 8, padding 20, maxWidth 240 |
| 우측 카드 제목 | `#39FF14`, fontSize 20, fontWeight 700 |
| 우측 카드 부제 | `#888888`, fontSize 14 |
| ChatBubble/FrameBox (인용) | border `1px solid #444`, background `#1a1a1a`, borderRadius 8, maxWidth 480 |
| ChatBubble 본문 | `#FFFFFF`, fontSize 18, fontWeight 700 |
| ChatBubble 부제 | `#888888`, fontSize 14 |
| 결과 행 Badge "0" | background `#333`, color `#FFFFFF`, borderRadius 50%, size 36 |
| 결과 행 텍스트 | white "글자 입력 전" + gray `→` + green bold "이미 소비 중" |
| FooterCaption | `#555555`, fontSize 15 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "section-title",
      "data": { "text": "MCP가 세션 시작할 때 하는 일" },
      "style": { "color": "#888888" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "flow-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 20, "justifyContent": "center" },
      "enterAt": 18,
      "children": [
        {
          "type": "FrameBox",
          "id": "source-card",
          "style": { "border": "1px solid #555", "background": "#111", "borderRadius": 8, "padding": 20, "maxWidth": 240, "alignItems": "center", "gap": 8 },
          "enterAt": 18,
          "children": [
            { "type": "BodyText", "id": "src-title", "data": { "text": "MCP 서버" }, "style": { "color": "#FFFFFF", "fontSize": 20, "fontWeight": 700 } },
            { "type": "BodyText", "id": "src-sub", "data": { "text": "5개 켜짐" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "flow-arrow",
          "data": { "direction": "right" },
          "style": { "color": "#888888" },
          "enterAt": 36
        },
        {
          "type": "FrameBox",
          "id": "target-card",
          "style": { "border": "1.5px solid #39FF14", "background": "#0d1f0d", "borderRadius": 8, "padding": 20, "maxWidth": 240, "alignItems": "center", "gap": 8 },
          "enterAt": 48,
          "children": [
            { "type": "BodyText", "id": "tgt-title", "data": { "text": "클로드 머릿속" }, "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700 } },
            { "type": "BodyText", "id": "tgt-sub", "data": { "text": "기능 목록 강제 주입" }, "style": { "color": "#888888", "fontSize": 14 } }
          ]
        }
      ]
    },
    {
      "type": "FrameBox",
      "id": "quote-box",
      "style": { "border": "1px solid #444", "background": "#1a1a1a", "borderRadius": 8, "padding": "16px 24px", "maxWidth": 480, "alignItems": "center", "gap": 8 },
      "enterAt": 66,
      "children": [
        { "type": "BodyText", "id": "quote-main", "data": { "text": "\"나 이런 기능들이 있어요~\"" }, "style": { "color": "#FFFFFF", "fontSize": 18, "fontWeight": 700 } },
        { "type": "BodyText", "id": "quote-sub", "data": { "text": "목록 통째로 주입 → 이미 소비 시작" }, "style": { "color": "#888888", "fontSize": 14 } }
      ]
    },
    {
      "type": "Stack",
      "id": "result-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16, "justifyContent": "center" },
      "enterAt": 90,
      "children": [
        { "type": "Badge", "id": "zero-badge", "data": { "text": "0" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
        { "type": "BodyText", "id": "result-before", "data": { "text": "글자 입력 전" }, "style": { "color": "#FFFFFF", "fontSize": 18 } },
        { "type": "ArrowConnector", "id": "result-arrow", "data": { "direction": "right" }, "style": { "color": "#555" } },
        { "type": "BodyText", "id": "result-after", "data": { "text": "이미 소비 중" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700 } }
      ]
    },
    {
      "type": "FooterCaption",
      "id": "caption",
      "data": { "text": "여러분이 대화 한 글자도 쓰기 전에 이미 소비가 됩니다" },
      "style": { "color": "#555555" },
      "enterAt": 114
    }
  ]
}
```

### 적용 규칙

- **메커니즘/프로세스 설명 + 결과 강조** 씬에 적용 — 4단 수직 전개
- 1단: **카드→화살표→카드** 수평 플로우 — gray 카드(입력) → green 카드(출력)
- 2단: **FrameBox 인용** — 대사체("~") + 부연설명 — 프로세스를 의인화
- 3단: **결과 행** — 원형 Badge(숫자) + 텍스트 + → + green bold 결과
- 4단: FooterCaption — 전체 요약
- REF-036(상태 전환 카드)과 유사하나, **인용 FrameBox + 결과 행**이 추가된 다층 설명
- gray→green 카드 색상 대비: 입력(neutral) → 출력(active/target)
- 결과 행의 "0" Badge: 수치/상태를 원형으로 강조 — "아직 0인데 이미 소비" 역설 표현
- enterAt: Kicker(0) → 좌카드(18) → 화살표(36) → 우카드(48) → 인용(66) → 결과행(90) → 캡션(114)

---

## REF-055: Split — RingChart 데이터 + 번호 솔루션 리스트

### 패턴 분류
- **아키타입**: L (Split 비대칭) + Q (도넛 차트) 혼합
- **용도**: 데이터/통계 시각화 + 해결책 나열 — 문제 수치 → 솔루션 제시
- **정보 밀도**: 높 (Kicker 1 + RingChart 1 + Headline 1 + 번호 카드 2)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  커뮤니티 측정 수치        해결책 2가지               │
│   (Kicker, gray)          (Headline, white bold)    │
│                                                     │
│    ┌──────────┐          ①  자주 안 쓰는 기능        │
│    │          │             → **스킬**로 대체         │
│    │  41%     │             호출할 때만 로드 →        │
│    │ (green   │             기본 소모 없음            │
│    │  donut)  │           (green 번호 + RichText)    │
│    │          │                                      │
│    │ MCP 5개  │          ②  안 쓰는 MCP는            │
│    │ 용량 소멸│             **끄세요**                │
│    └──────────┘             필요할 때만 켜고,         │
│                             평소엔 OFF               │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  스킬은 호출할 때만 로드되니까 기본 소모가 ...        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 좌측 Kicker | `#888888`, fontSize 14 |
| RingChart | size 220, value 41, trackColor `#333`, fillColor `#39FF14`, strokeWidth 12 |
| RingChart 중앙 라벨 상단 | `#888888`, fontSize 14 ("MCP 5개") |
| RingChart 중앙 값 | `#FFFFFF`, fontSize 48, fontWeight 800 ("41%") |
| RingChart 중앙 라벨 하단 | `#888888`, fontSize 14 ("용량 소멸") |
| 우측 Headline | `#FFFFFF`, fontSize 22, fontWeight 700 ("해결책 2가지") |
| 번호 원형 Badge | background `#39FF14`, color `#000`, borderRadius 50%, size 32, fontWeight 700 |
| 솔루션 제목 | `#FFFFFF`, fontSize 18, fontWeight 600 — accent-bold 키워드 (green underline) |
| 솔루션 부연 | `#888888`, fontSize 13 |
| 솔루션 간 gap | 24px |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "row",
  "style": { "padding": 60, "gap": 60, "alignItems": "center", "justifyContent": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "left-data",
      "direction": "column",
      "style": { "alignItems": "center", "gap": 16 },
      "enterAt": 0,
      "children": [
        {
          "type": "Kicker",
          "id": "data-label",
          "data": { "text": "커뮤니티 측정 수치" },
          "style": { "color": "#888888", "fontSize": 14 },
          "enterAt": 0
        },
        {
          "type": "RingChart",
          "id": "donut",
          "data": { "value": 41, "label": "용량 소멸", "size": 220, "centerText": "41%" },
          "style": {},
          "enterAt": 12
        },
        {
          "type": "BodyText",
          "id": "donut-context",
          "data": { "text": "MCP 5개" },
          "style": { "color": "#888888", "fontSize": 14 },
          "enterAt": 12
        }
      ]
    },
    {
      "type": "Stack",
      "id": "right-solutions",
      "direction": "column",
      "style": { "gap": 24, "maxWidth": 400 },
      "enterAt": 36,
      "children": [
        {
          "type": "Headline",
          "id": "sol-title",
          "data": { "text": "해결책 2가지", "size": "sm" },
          "style": { "fontSize": 22 },
          "enterAt": 36
        },
        {
          "type": "Stack",
          "id": "sol-1",
          "direction": "row",
          "style": { "gap": 16, "alignItems": "flex-start" },
          "enterAt": 60,
          "children": [
            { "type": "Badge", "id": "num-1", "data": { "text": "1" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700, "flexShrink": 0 } },
            {
              "type": "Stack",
              "id": "sol-1-text",
              "direction": "column",
              "style": { "gap": 4 },
              "children": [
                {
                  "type": "RichText",
                  "id": "sol-1-title",
                  "data": {
                    "segments": [
                      { "text": "자주 안 쓰는 기능\n→ ", "style": "normal" },
                      { "text": "스킬", "style": "accent-bold" },
                      { "text": "로 대체", "style": "normal" }
                    ]
                  },
                  "style": { "fontSize": 18, "fontWeight": 600 }
                },
                { "type": "BodyText", "id": "sol-1-desc", "data": { "text": "호출할 때만 로드 → 기본 소모 없음" }, "style": { "color": "#888888", "fontSize": 13 } }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "id": "sol-2",
          "direction": "row",
          "style": { "gap": 16, "alignItems": "flex-start" },
          "enterAt": 90,
          "children": [
            { "type": "Badge", "id": "num-2", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 16, "fontWeight": 700, "flexShrink": 0 } },
            {
              "type": "Stack",
              "id": "sol-2-text",
              "direction": "column",
              "style": { "gap": 4 },
              "children": [
                {
                  "type": "RichText",
                  "id": "sol-2-title",
                  "data": {
                    "segments": [
                      { "text": "안 쓰는 MCP는\n", "style": "normal" },
                      { "text": "끄세요", "style": "accent-bold" }
                    ]
                  },
                  "style": { "fontSize": 18, "fontWeight": 600 }
                },
                { "type": "BodyText", "id": "sol-2-desc", "data": { "text": "필요할 때만 켜고, 평소엔 OFF" }, "style": { "color": "#888888", "fontSize": 13 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 적용 규칙

- **데이터 수치 + 해결책 나열** 씬에 적용 — 좌측 차트(문제 크기) + 우측 솔루션
- Split 구조: 좌(RingChart + 맥락 라벨) vs 우(Headline + 번호 솔루션 리스트)
- RingChart: green 도넛, 중앙에 큰 % 수치 — 문제의 심각성 시각화
- 번호 솔루션: **green filled 원형 Badge**(1, 2) + RichText(accent-bold 키워드) + gray 부연
- REF-029(4 growth bars)와 다른 점: 단일 RingChart + **솔루션 리스트**가 함께 — 문제→해결 한 화면
- RichText 솔루션 제목: 줄바꿈(\n) 포함 가능, accent-bold 핵심어 강조
- 좌측 RingChart size 220 — 충분히 크게 화면 좌반을 차지
- enterAt: 좌측(0, 12) → 우측 Headline(36) → 솔루션 순차(60, 90)

---

## REF-056: 완료 Badge + 번호 체크리스트 + RichText 요약

### 패턴 분류
- **아키타입**: J (체크리스트) + REF-033 (요약 번호 리스트) 혼합
- **용도**: 시리즈 전체 요약/회고, 완료 상태 표시, 섹션 마무리
- **정보 밀도**: 높 (Badge 1 + 체크 항목 5개 + RichText 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ┌──────────────────────────────────────┐        │
│     │ ✅ 1~5단계 완료 — 튜토리얼 클리어    │        │
│     └──────────────────────────────────────┘        │
│      (Badge/Pill, green border, 체크 아이콘)         │
│                                                     │
│       ①  클로드 코드 작동 방법          ✅           │
│       ②  반복 작업 저장 (자동화)        ✅           │
│       ③  MCP 연결                      ✅           │
│       ④  스킬/CLI 테크닉               ✅           │
│       ⑤  MCP 비용 관리                 ✅           │
│      (green 번호 + white 텍스트 + green 체크)        │
│                                                     │
│         여기까지가 **기초**입니다                     │
│         (RichText, accent-bold)                      │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  MCP 비용은 어떻게 관리하는지                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 상단 Badge | border `1.5px solid #39FF14`, background transparent, color `#39FF14`, borderRadius 24, padding `8px 24px`, fontSize 16 |
| Badge 체크 아이콘 | `#39FF14`, inline, size 16 |
| 번호 원형 Badge | background `#39FF14`, color `#000`, borderRadius 50%, size 36, fontSize 16, fontWeight 700 |
| 항목 텍스트 | `#FFFFFF`, fontSize 20, fontWeight 500 |
| 체크 아이콘 (우측) | `#39FF14`, size 24, 원형 배경 `rgba(57,255,20,0.15)` |
| 항목 간 gap | 16px |
| 리스트 maxWidth | 600 |
| RichText 요약 | white + **accent-bold** ("기초" = green bold), fontSize 22, 중앙정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 24, "alignItems": "center" },
  "children": [
    {
      "type": "Pill",
      "id": "completion-badge",
      "data": { "text": "✅ 1~5단계 완료 — 튜토리얼 클리어" },
      "style": { "border": "1.5px solid #39FF14", "color": "#39FF14", "background": "transparent", "fontSize": 16, "padding": "8px 24px" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "checklist",
      "direction": "column",
      "style": { "gap": 16, "maxWidth": 600, "width": "100%" },
      "enterAt": 20,
      "children": [
        {
          "type": "Stack", "id": "item-1", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 20,
          "children": [
            {
              "type": "Stack", "id": "item-1-left", "direction": "row",
              "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-1", "data": { "text": "1" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
                { "type": "BodyText", "id": "text-1", "data": { "text": "클로드 코드 작동 방법" }, "style": { "color": "#FFFFFF", "fontSize": 20 } }
              ]
            },
            { "type": "Icon", "id": "check-1", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack", "id": "item-2", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 36,
          "children": [
            {
              "type": "Stack", "id": "item-2-left", "direction": "row",
              "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-2", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
                { "type": "BodyText", "id": "text-2", "data": { "text": "반복 작업 저장 (자동화)" }, "style": { "color": "#FFFFFF", "fontSize": 20 } }
              ]
            },
            { "type": "Icon", "id": "check-2", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack", "id": "item-3", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 52,
          "children": [
            {
              "type": "Stack", "id": "item-3-left", "direction": "row",
              "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-3", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
                { "type": "BodyText", "id": "text-3", "data": { "text": "MCP 연결" }, "style": { "color": "#FFFFFF", "fontSize": 20 } }
              ]
            },
            { "type": "Icon", "id": "check-3", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack", "id": "item-4", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 68,
          "children": [
            {
              "type": "Stack", "id": "item-4-left", "direction": "row",
              "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-4", "data": { "text": "4" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
                { "type": "BodyText", "id": "text-4", "data": { "text": "스킬/CLI 테크닉" }, "style": { "color": "#FFFFFF", "fontSize": 20 } }
              ]
            },
            { "type": "Icon", "id": "check-4", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack", "id": "item-5", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 84,
          "children": [
            {
              "type": "Stack", "id": "item-5-left", "direction": "row",
              "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-5", "data": { "text": "5" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 16, "fontWeight": 700 } },
                { "type": "BodyText", "id": "text-5", "data": { "text": "MCP 비용 관리" }, "style": { "color": "#FFFFFF", "fontSize": 20 } }
              ]
            },
            { "type": "Icon", "id": "check-5", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" } }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "id": "summary",
      "data": {
        "segments": [
          { "text": "여기까지가 ", "style": "normal" },
          { "text": "기초", "style": "accent-bold" },
          { "text": "입니다", "style": "normal" }
        ]
      },
      "style": { "fontSize": 22, "textAlign": "center" },
      "enterAt": 108
    }
  ]
}
```

### 적용 규칙

- **시리즈 요약, 섹션 마무리, 완료 회고** 씬에 적용
- 상단 Pill: 완료 상태 배너 — green border + 체크 아이콘 + "N단계 완료" 텍스트
- 체크리스트: **green filled 번호 Badge + 항목 텍스트 + 우측 체크 아이콘** — 3열 row
- REF-033(요약 번호 리스트)과 다른 점: **우측 체크 아이콘** + **상단 완료 배너** — 완료 상태 강조
- 5개 항목까지 적합 (6개 이상이면 화면 초과)
- 각 항목 `justifyContent: space-between` — 번호+텍스트 좌측, 체크 아이콘 우측 끝
- 하단 RichText: 전체 요약 한 줄 — accent-bold 핵심어
- 체크 아이콘: green `check-circle` — 원형 배경 안에 체크마크
- enterAt: 완료 Badge(0) → 항목 순차(20, 36, 52, 68, 84) — 16프레임 간격 빠르게 → 요약(108)

---

## REF-057: 회전 링 스텝 넘버 히어로 + Headline + 진행 도트 바

### 패턴 분류
- **아키타입**: T (미니멀 전환/챕터 마커) 확장
- **용도**: 시리즈 챕터 전환, 현재 스텝 강조, 진행 상태 표시
- **정보 밀도**: 중 (스텝 넘버 1 + Headline 1 + RichText 1 + 진행 도트 10개)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               ╭ · · · · · · ╮                        │
│              ·    ┌──────┐   ·   (점선 원 = 회전     │
│             ·     │ STEP │    ·    애니메이션)        │
│             ·     │  6   │    ·                      │
│              ·    └──────┘   ·                        │
│               ╰ · · · · · · ╯                        │
│              (green 숫자 + glow ring)                 │
│                                                     │
│            컨텍스트 엔지니어링                        │
│              (Headline xl)                           │
│                                                     │
│     전체 10단계 중에서 **제일 중요한 단계**           │
│        (RichText, accent-bold)                       │
│                                                     │
│    ✅ ✅ ✅ ✅ ✅  ⑥  ⑦  ⑧  ⑨  ⑩                  │
│   (green checks) (active) (gray 미완)                │
│                  ↑ 지금 여기                          │
│                  (green, 작은 화살표)                 │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  컨텍스트 엔지니어링은 클로드한테                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 외부 점선 원 (회전) | border `2px dashed #39FF14`, opacity 0.4, borderRadius 50%, size 200, **rotate 애니메이션** (무한 회전) |
| 내부 원 | background `#111`, border `2px solid #39FF14`, borderRadius 50%, size 140 |
| "STEP" 라벨 | `#39FF14`, fontSize 14, letterSpacing 3 |
| 숫자 "6" | `#39FF14`, fontSize 64, fontWeight 900 |
| 숫자 glow | textShadow `0 0 30px rgba(57,255,20,0.4)` |
| Headline | `#FFFFFF`, fontSize 36, fontWeight 800, 중앙정렬 |
| RichText 부제 | white + **accent-bold** ("제일 중요한 단계" = green bold), fontSize 18 |
| 완료 도트 (✅) | `#39FF14`, size 28, check-circle 아이콘 |
| 현재 도트 (active) | background `#39FF14`, color `#000`, borderRadius 50%, size 32, fontWeight 700, glow `0 0 12px rgba(57,255,20,0.6)` |
| 미완 도트 | background `#333`, color `#888`, borderRadius 50%, size 28 |
| "↑ 지금 여기" | `#39FF14`, fontSize 12 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "step-hero",
      "direction": "column",
      "style": { "alignItems": "center", "justifyContent": "center", "position": "relative", "width": 200, "height": 200 },
      "enterAt": 0,
      "children": [
        {
          "type": "Stack",
          "id": "inner-circle",
          "direction": "column",
          "style": {
            "alignItems": "center", "justifyContent": "center",
            "width": 140, "height": 140, "borderRadius": "50%",
            "background": "#111", "border": "2px solid #39FF14",
            "gap": 0
          },
          "enterAt": 0,
          "children": [
            { "type": "BodyText", "id": "step-label", "data": { "text": "STEP" }, "style": { "color": "#39FF14", "fontSize": 14, "letterSpacing": 3 } },
            { "type": "StatNumber", "id": "step-num", "data": { "value": "6", "size": "xl" }, "style": { "color": "#39FF14", "fontSize": 64, "fontWeight": 900, "textShadow": "0 0 30px rgba(57,255,20,0.4)" } }
          ]
        }
      ],
      "motion": { "preset": "spin-ring" }
    },
    {
      "type": "Headline",
      "id": "title",
      "data": { "text": "컨텍스트 엔지니어링", "size": "xl" },
      "style": { "textAlign": "center" },
      "enterAt": 18
    },
    {
      "type": "RichText",
      "id": "subtitle",
      "data": {
        "segments": [
          { "text": "전체 10단계 중에서 ", "style": "normal" },
          { "text": "제일 중요한 단계", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 18, "textAlign": "center" },
      "enterAt": 30
    },
    {
      "type": "Stack",
      "id": "progress-dots",
      "direction": "column",
      "style": { "alignItems": "center", "gap": 6 },
      "enterAt": 54,
      "children": [
        {
          "type": "Stack",
          "id": "dots-row",
          "direction": "row",
          "style": { "gap": 8, "alignItems": "center" },
          "children": [
            { "type": "Icon", "id": "d1", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" }, "enterAt": 54 },
            { "type": "Icon", "id": "d2", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" }, "enterAt": 56 },
            { "type": "Icon", "id": "d3", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" }, "enterAt": 58 },
            { "type": "Icon", "id": "d4", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" }, "enterAt": 60 },
            { "type": "Icon", "id": "d5", "data": { "name": "check-circle", "size": 24 }, "style": { "color": "#39FF14" }, "enterAt": 62 },
            { "type": "Badge", "id": "d6-active", "data": { "text": "6" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 32, "height": 32, "fontSize": 14, "fontWeight": 700, "boxShadow": "0 0 12px rgba(57,255,20,0.6)" }, "enterAt": 64 },
            { "type": "Badge", "id": "d7", "data": { "text": "7" }, "style": { "background": "#333", "color": "#888", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 12 } },
            { "type": "Badge", "id": "d8", "data": { "text": "8" }, "style": { "background": "#333", "color": "#888", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 12 } },
            { "type": "Badge", "id": "d9", "data": { "text": "9" }, "style": { "background": "#333", "color": "#888", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 12 } },
            { "type": "Badge", "id": "d10", "data": { "text": "10" }, "style": { "background": "#333", "color": "#888", "borderRadius": "50%", "width": 28, "height": 28, "fontSize": 12 } }
          ]
        },
        { "type": "BodyText", "id": "here-marker", "data": { "text": "↑ 지금 여기" }, "style": { "color": "#39FF14", "fontSize": 12 }, "enterAt": 66 }
      ]
    }
  ]
}
```

### 적용 규칙

- **시리즈 챕터 전환, 중요 스텝 강조** 씬에 적용
- 상단 히어로: **이중 원형** — 외부 점선 원(회전 애니메이션) + 내부 solid 원(STEP + 숫자)
- **회전 애니메이션**: 외부 dashed 원이 느리게 무한 회전 (spin-ring 모션 프리셋) — 시선 집중 + 동적 느낌
- REF-045(Tip Number Hero)와 다른 점: **회전 점선 링** + **진행 도트 바** — 시리즈 전체 진행 상태 표시
- 진행 도트 바: 완료(green check) + 현재(green filled + glow) + 미완(gray 번호)
- "↑ 지금 여기" 마커: 현재 스텝 아래에 green 작은 텍스트
- glow 효과: 숫자 `textShadow` + 현재 도트 `boxShadow` — 녹색 발광
- 도트 stagger: 완료 체크가 2프레임 간격으로 빠르게 연속 등장
- enterAt: 히어로 원(0) → Headline(18) → RichText(30) → 도트 순차(54~66)

---

## REF-058: 팬인 → 필터 허브 → 팬아웃 (다입력 → 처리 → 단일 출력)

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + REF-051 (아키텍처 다이어그램) 확장
- **용도**: 다중 입력 → 필터/처리 → 결과 출력 구조, 데이터 파이프라인
- **정보 밀도**: 높 (Kicker 1 + 입력 Pill 5 + 허브 1 + 출력 1 + RichText 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  모든 정보                                           │
│  (Kicker)                                           │
│  ┌──────────┐                                       │
│  │ 대화 기록 │ ╲                                     │
│  ├──────────┤  ╲    ┌─────────┐     ┌──────────┐   │
│  │ 코드베이스│ ──→  │ CLAUDE  │ ──→ │ ✦        │   │
│  ├──────────┤  ╱    │컨텍스트  │     │최적       │   │
│  │ 이전 에러 │ ╱    │ 필터    │     │컨텍스트    │   │
│  ├──────────┤       └─────────┘     └──────────┘   │
│  │ 문서들   │        (hexagon      (rounded sq     │
│  ├──────────┤         green)        green icon)    │
│  │ 설정 파일 │                                      │
│  └──────────┘                                       │
│                                                     │
│    클로드한테 **딱 맞는 정보만** 골라서 주는 기술     │
│        (RichText, accent-bold)                       │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  뭘 잊게 할지 설계하는 거예요                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker "모든 정보" | `#888888`, fontSize 14 |
| 입력 Pill ×5 | background `#1a1a1a`, border `1px solid #444`, borderRadius 8, padding `10px 24px`, color `#FFFFFF`, fontSize 15 |
| 입력→허브 연결선 | `#555` 사선, 5개가 한 점으로 수렴 (팬인) |
| 허브 (육각형) | border `2px solid #39FF14`, background `#0d1f0d`, 육각형 clipPath, size ~120px |
| 허브 텍스트 "CLAUDE" | `#39FF14`, fontSize 16, fontWeight 800 |
| 허브 부제 "컨텍스트 필터" | `#39FF14`, fontSize 11 |
| 허브→출력 화살표 | `#39FF14`, width 80, height 3 (굵은 화살표) |
| 출력 (rounded square) | border `2px solid #39FF14`, background `#0d1f0d`, borderRadius 12, size 80 |
| 출력 아이콘 | `#39FF14`, sparkle/diamond, size 24 |
| 출력 라벨 "최적 컨텍스트" | `#39FF14`, fontSize 12 |
| RichText | white + **accent-bold** ("딱 맞는 정보만" = green bold), fontSize 20, 중앙정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 40, "gap": 24, "alignItems": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "pipeline-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 24, "justifyContent": "center", "maxWidth": 1000 },
      "enterAt": 0,
      "children": [
        {
          "type": "Stack",
          "id": "inputs-col",
          "direction": "column",
          "style": { "gap": 10, "alignItems": "flex-end" },
          "enterAt": 0,
          "children": [
            { "type": "Kicker", "id": "inputs-label", "data": { "text": "모든 정보" }, "style": { "color": "#888888", "fontSize": 14 }, "enterAt": 0 },
            { "type": "Pill", "id": "in-1", "data": { "text": "대화 기록" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "color": "#FFFFFF" }, "enterAt": 6 },
            { "type": "Pill", "id": "in-2", "data": { "text": "코드베이스" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "color": "#FFFFFF" }, "enterAt": 12 },
            { "type": "Pill", "id": "in-3", "data": { "text": "이전 에러" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "color": "#FFFFFF" }, "enterAt": 18 },
            { "type": "Pill", "id": "in-4", "data": { "text": "문서들" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "color": "#FFFFFF" }, "enterAt": 24 },
            { "type": "Pill", "id": "in-5", "data": { "text": "설정 파일" }, "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "color": "#FFFFFF" }, "enterAt": 30 }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "fanin-arrow",
          "data": { "direction": "right" },
          "style": { "color": "#555555" },
          "enterAt": 36
        },
        {
          "type": "Stack",
          "id": "hub",
          "direction": "column",
          "style": {
            "alignItems": "center", "justifyContent": "center",
            "width": 120, "height": 120,
            "border": "2px solid #39FF14", "background": "#0d1f0d",
            "borderRadius": 12, "gap": 4
          },
          "enterAt": 42,
          "children": [
            { "type": "BodyText", "id": "hub-title", "data": { "text": "CLAUDE" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 800 } },
            { "type": "BodyText", "id": "hub-sub", "data": { "text": "컨텍스트 필터" }, "style": { "color": "#39FF14", "fontSize": 11 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "fanout-arrow",
          "data": { "direction": "right" },
          "style": { "color": "#39FF14" },
          "enterAt": 60
        },
        {
          "type": "Stack",
          "id": "output",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 72,
          "children": [
            {
              "type": "Stack",
              "id": "output-box",
              "direction": "column",
              "style": {
                "alignItems": "center", "justifyContent": "center",
                "width": 80, "height": 80,
                "border": "2px solid #39FF14", "background": "#0d1f0d",
                "borderRadius": 12
              },
              "children": [
                { "type": "Icon", "id": "out-icon", "data": { "name": "sparkle", "size": 24 }, "style": { "color": "#39FF14" } }
              ]
            },
            { "type": "BodyText", "id": "out-label", "data": { "text": "최적 컨텍스트" }, "style": { "color": "#39FF14", "fontSize": 12 } }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "id": "explanation",
      "data": {
        "segments": [
          { "text": "클로드한테 ", "style": "normal" },
          { "text": "딱 맞는 정보만", "style": "accent-bold" },
          { "text": " 골라서 주는 기술", "style": "normal" }
        ]
      },
      "style": { "fontSize": 20, "textAlign": "center" },
      "enterAt": 90
    }
  ]
}
```

### 적용 규칙

- **다중 입력 → 처리/필터 → 단일 출력** 데이터 파이프라인 씬에 적용
- 3열 구조: 좌(입력 Pill 세로 스택, 팬인) → 중(허브 박스) → 우(출력 아이콘)
- REF-051(소스→허브→도구들)의 **역방향 패턴**: 다수→하나(팬인→팬아웃이 아닌 팬인→싱글 아웃)
- 입력 Pill: gray border, 세로 스택 — 6프레임 간격 빠르게 stagger 등장
- 허브: green border 박스 + 굵은 텍스트 — 처리 엔진/필터 역할
- 좌측 화살표 gray(입력=raw), 우측 화살표 green(출력=정제) — **색상 전이**
- 출력 박스: 작은 rounded square + 아이콘 + 라벨 — 결과물의 가치 강조
- 하단 RichText: 한 줄 설명 (accent-bold 핵심어)
- 입력이 5개 이상이면 화면 높이 초과 주의 — 최대 5~6개 권장
- enterAt: 입력 순차(0~30, 6f 간격) → 팬인 화살표(36) → 허브(42) → 팬아웃 화살표(60) → 출력(72) → 설명(90)

---

## REF-059: VS 대비 — 문서 목업 카드 (좌 green 권장 vs 우 gray 비권장) + BulletList

### 패턴 분류
- **아키타입**: C (좌우 VS 대비) 변형
- **용도**: 좋은 방법 vs 나쁜 방법 비교, 문서/파일 크기 대비
- **정보 밀도**: 높 (Kicker 1 + 목업 카드 2 + VS + BulletList 3항목)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              많이 하는 실수                           │
│              (Kicker, gray)                          │
│                                                     │
│  ┌──────────────────┐       ┌──────────────────┐    │
│  │ ✅ 권장  핵심만   │       │ 다 써놓자        │    │
│  │ ═══════════      │       │ ─────────────    │    │
│  │ ═══════          │  VS   │ ─────────────    │    │
│  │ ═════            │       │ ─────────────    │    │
│  │ ════             │       │ ─────────────    │    │
│  │                  │       │ ... 계속         │    │
│  │   ~50줄          │       │  1,000~2,000     │    │
│  │   (green stat)   │       │    줄 (white)    │    │
│  └──────────────────┘       └──────────────────┘    │
│   (green border)             (gray border)           │
│                                                     │
│  • 길면 길만큼 토큰을 먹어요                         │
│  • 규칙 100개 → 클로드도 다 못 따라와요              │
│  • /init 보다 — 못 잡는 부분만 기입 (green)          │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  사람도 규칙이 100개면 다 기억 못하잖아요             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker "많이 하는 실수" | `#888888`, fontSize 16, 중앙정렬 |
| 좌측 카드 (권장) | border `2px solid #39FF14`, background `#0a0a0a`, borderRadius 12, padding 24, maxWidth 320, height ~280 |
| 좌측 Badge "✅ 권장" | background `#39FF14`, color `#000`, borderRadius 16, padding `4px 12px`, fontSize 13, fontWeight 700 |
| 좌측 "핵심만" 라벨 | `#888888`, fontSize 14 |
| 좌측 가로선들 (문서 목업) | `#39FF14` 불투명도 변화, height 3~4, 각각 다른 width — 문서 내용 시뮬레이션 |
| 좌측 StatNumber "~50" | `#39FF14`, fontSize 40, fontWeight 800 |
| 좌측 "줄" 단위 | `#39FF14`, fontSize 16 |
| "VS" 텍스트 | `#555555`, fontSize 24, fontWeight 700 |
| 우측 카드 (비권장) | border `1px solid #333`, background `#1a1a1a`, borderRadius 12, padding 24, maxWidth 320, height ~280 |
| 우측 Badge "다 써놓자" | background `#333`, color `#888`, borderRadius 16, fontSize 13 |
| 우측 가로선들 | `#555555`, height 2~3, 동일 width 반복 — 빽빽한 문서 시뮬레이션 |
| 우측 "... 계속" | `#555555`, fontSize 12 |
| 우측 StatNumber "1,000~2,000" | `#FFFFFF`, fontSize 36, fontWeight 800 |
| BulletList 기본 항목 | `#FFFFFF`, fontSize 16, bullet `•` |
| BulletList 마지막 항목 | `#39FF14`, fontSize 16 — 솔루션/권장 사항 강조 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 30, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "section-title",
      "data": { "text": "많이 하는 실수" },
      "style": { "color": "#888888" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "compare-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 28, "justifyContent": "center" },
      "enterAt": 12,
      "children": [
        {
          "type": "FrameBox",
          "id": "good-card",
          "style": { "border": "2px solid #39FF14", "background": "#0a0a0a", "borderRadius": 12, "padding": 24, "maxWidth": 320, "gap": 12 },
          "enterAt": 12,
          "children": [
            {
              "type": "Stack", "id": "good-header", "direction": "row",
              "style": { "gap": 12, "alignItems": "center" },
              "children": [
                { "type": "Badge", "id": "good-badge", "data": { "text": "✅ 권장" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": 16, "fontSize": 13, "fontWeight": 700 } },
                { "type": "BodyText", "id": "good-label", "data": { "text": "핵심만" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            {
              "type": "Stack", "id": "good-lines", "direction": "column",
              "style": { "gap": 6 },
              "children": [
                { "type": "Divider", "id": "gl1", "style": { "background": "#39FF14", "height": 4, "width": "90%", "borderRadius": 2 } },
                { "type": "Divider", "id": "gl2", "style": { "background": "#39FF14", "height": 4, "width": "75%", "opacity": 0.8, "borderRadius": 2 } },
                { "type": "Divider", "id": "gl3", "style": { "background": "#39FF14", "height": 4, "width": "60%", "opacity": 0.6, "borderRadius": 2 } },
                { "type": "Divider", "id": "gl4", "style": { "background": "#39FF14", "height": 4, "width": "50%", "opacity": 0.4, "borderRadius": 2 } }
              ]
            },
            {
              "type": "Stack", "id": "good-stat", "direction": "row",
              "style": { "alignItems": "baseline", "gap": 4 },
              "children": [
                { "type": "StatNumber", "id": "good-num", "data": { "value": "~50", "size": "lg" }, "style": { "color": "#39FF14", "fontSize": 40, "fontWeight": 800 } },
                { "type": "BodyText", "id": "good-unit", "data": { "text": "줄" }, "style": { "color": "#39FF14", "fontSize": 16 } }
              ]
            }
          ]
        },
        {
          "type": "BodyText",
          "id": "vs-text",
          "data": { "text": "VS" },
          "style": { "color": "#555555", "fontSize": 24, "fontWeight": 700 },
          "enterAt": 30
        },
        {
          "type": "FrameBox",
          "id": "bad-card",
          "style": { "border": "1px solid #333", "background": "#1a1a1a", "borderRadius": 12, "padding": 24, "maxWidth": 320, "gap": 12 },
          "enterAt": 42,
          "children": [
            { "type": "Badge", "id": "bad-badge", "data": { "text": "다 써놓자" }, "style": { "background": "#333", "color": "#888", "borderRadius": 16, "fontSize": 13 } },
            {
              "type": "Stack", "id": "bad-lines", "direction": "column",
              "style": { "gap": 4 },
              "children": [
                { "type": "Divider", "id": "bl1", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } },
                { "type": "Divider", "id": "bl2", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } },
                { "type": "Divider", "id": "bl3", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } },
                { "type": "Divider", "id": "bl4", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } },
                { "type": "Divider", "id": "bl5", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } },
                { "type": "Divider", "id": "bl6", "style": { "background": "#555", "height": 3, "width": "95%", "borderRadius": 2 } }
              ]
            },
            { "type": "BodyText", "id": "bad-more", "data": { "text": "... 계속" }, "style": { "color": "#555555", "fontSize": 12 } },
            {
              "type": "Stack", "id": "bad-stat", "direction": "column",
              "style": { "gap": 2 },
              "children": [
                { "type": "StatNumber", "id": "bad-num", "data": { "value": "1,000~2,000", "size": "lg" }, "style": { "color": "#FFFFFF", "fontSize": 36, "fontWeight": 800 } },
                { "type": "BodyText", "id": "bad-unit", "data": { "text": "줄" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "BulletList",
      "id": "tips",
      "data": {
        "items": [
          { "text": "길면 길만큼 토큰을 먹어요" },
          { "text": "규칙 100개 → 클로드도 다 못 따라와요" },
          { "text": "/init 보다 — 못 잡는 부분만 기입", "highlight": true }
        ]
      },
      "style": { "maxWidth": 600 },
      "enterAt": 72
    }
  ]
}
```

### 적용 규칙

- **좋은 방법 vs 나쁜 방법, 문서/데이터 크기 비교** 씬에 적용
- 좌우 FrameBox 목업 카드: **문서 내용을 가로선(Divider)으로 시뮬레이션** — 실제 텍스트 대신 라인 패턴
- 좌측 (권장): green border, 가로선 폭 점점 줄어듦(핵심만) + green StatNumber
- 우측 (비권장): gray border, 가로선 동일 폭 빽빽함(다 넣음) + white StatNumber (큰 숫자)
- **문서 목업 가로선 애니메이션**: 내부 Divider들이 enterAt으로 순차 등장 — SVG draw 효과 시뮬레이션
- 가로선 opacity 변화: green쪽은 0.4~1.0으로 페이드, gray쪽은 동일 opacity
- 하단 BulletList: 마지막 항목 green — 권장 행동 강조
- "VS" 텍스트: gray, 두 카드 사이 중앙
- REF-043(tip solution vs problem)과 유사하나, **문서 목업(가로선)** + **수치(StatNumber)** 대비가 차별점
- enterAt: 좌카드(12, 내부 선들 순차) → VS(30) → 우카드(42, 내부 선들 순차) → BulletList(72)

### 내부 요소 순차 애니메이션 구현 노트

이 레이아웃의 원본 영상에서는 카드 내부 요소(가로선, Badge, 숫자)가 차례대로 그려지는 애니메이션이 적용됨.
우리 시스템에서의 구현 방법:

1. **enterAt 분산**: 카드 내부 children의 enterAt을 6~8프레임 간격으로 순차 설정
2. **motion preset**: 각 Divider에 `fade-in` 또는 `slide-right` 프리셋 적용
3. **SVG strokeDashoffset** (향후 확장): Remotion `interpolate()`로 선이 왼→오 그려지는 효과 구현 가능
   ```typescript
   // 향후 구현 시 참고
   const progress = interpolate(frame, [enterAt, enterAt+20], [0, 1], { extrapolateRight: 'clamp' });
   strokeDashoffset = lineLength * (1 - progress);
   ```

---

## REF-060: Split — 자동 분석 체크리스트 + 직접 추가 아이콘 리스트

### 패턴 분류
- **아키타입**: C (좌우 VS 대비) + J (체크리스트) 혼합
- **용도**: 자동 생성 vs 수동 보완, AI 능력 범위 vs 사람 역할 구분
- **정보 밀도**: 높 (Headline 1 + 좌 카드 3항목 + 우 카드 3항목 + RichText 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│            CLAUDE.md 작성 팁                         │
│              (Headline, white)                       │
│                                                     │
│  ┌──────────────────────┬──────────────────────┐    │
│  │ /init  자동 분석     │  직접 추가  AI가 못   │    │
│  │ (green badge)(gray)  │  (green bg)  잡는 것  │    │
│  │                      │  (gray label)        │    │
│  │ 📁 파일 구조    ✅  │  💡 팀 약속/컨벤션    │    │
│  │ 🔧 사용 기술    ✅  │  🚫 자꾸 틀리는 패턴  │    │
│  │ ⬛ 실행 명령어   ✅  │  🎯 개인 코딩 스타일  │    │
│  │                      │                      │    │
│  │ (dark bg, gray       │  (dark green tint,   │    │
│  │  border)             │   green border)      │    │
│  └──────────────────────┴──────────────────────┘    │
│            +                                         │
│                                                     │
│   /init 후 — 클로드가 **못 잡는 부분만** 직접 보완   │
│         (RichText, accent-bold)                      │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  claude.md 파일에다가 기입을 해둬야지 ...            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Headline | `#FFFFFF`, fontSize 28, fontWeight 700, 중앙정렬 |
| 좌측 FrameBox (자동) | border `1px solid #333`, background `#111`, borderRadius 12 0 0 12, padding 24, flex 1 |
| 좌측 Badge "/init" | background `#39FF14`, color `#000`, borderRadius 6, fontSize 13, fontWeight 700 |
| 좌측 라벨 "자동 분석" | `#888888`, fontSize 14 |
| 좌측 항목 아이콘 | `#555555`, size 24, 원형 dark 배경 |
| 좌측 항목 텍스트 | `#FFFFFF`, fontSize 18, fontWeight 600 |
| 좌측 체크 아이콘 | `#39FF14`, check-circle, size 22 |
| 우측 FrameBox (수동) | border `1.5px solid #39FF14`, background `#0d1f0d`, borderRadius 0 12 12 0, padding 24, flex 1 |
| 우측 Badge "직접 추가" | background `#39FF14`, color `#000`, borderRadius 6, fontSize 13, fontWeight 700 |
| 우측 라벨 "AI가 못 잡는 것" | `#888888`, fontSize 14 |
| 우측 항목 아이콘 | 각각 다른 색상/아이콘, 원형 border 배경 (green/orange/red 계열) |
| 우측 항목 텍스트 | `#39FF14`, fontSize 18, fontWeight 600 |
| "+" 기호 (중앙) | `#888888`, fontSize 20 |
| RichText | green "/init 후" + white " — 클로드가 " + accent-bold "못 잡는 부분만" + white " 직접 보완" |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 40, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Headline",
      "id": "title",
      "data": { "text": "CLAUDE.md 작성 팁", "size": "md" },
      "style": { "fontSize": 28 },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "split-cards",
      "direction": "row",
      "style": { "maxWidth": 800, "width": "100%" },
      "enterAt": 18,
      "children": [
        {
          "type": "FrameBox",
          "id": "auto-card",
          "style": { "border": "1px solid #333", "background": "#111", "borderRadius": "12px 0 0 12px", "padding": 24, "flex": 1, "gap": 20 },
          "enterAt": 18,
          "children": [
            {
              "type": "Stack", "id": "auto-header", "direction": "row",
              "style": { "gap": 10, "alignItems": "center" },
              "children": [
                { "type": "Badge", "id": "init-badge", "data": { "text": "/init" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": 6, "fontWeight": 700, "fontSize": 13 } },
                { "type": "BodyText", "id": "auto-label", "data": { "text": "자동 분석" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            {
              "type": "Stack", "id": "auto-item-1", "direction": "row",
              "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
              "enterAt": 30,
              "children": [
                {
                  "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 12 },
                  "children": [
                    { "type": "Icon", "id": "ai1", "data": { "name": "folder", "size": 20 }, "style": { "color": "#555", "background": "#222", "borderRadius": "50%", "padding": 6 } },
                    { "type": "BodyText", "id": "at1", "data": { "text": "파일 구조" }, "style": { "color": "#FFFFFF", "fontSize": 18, "fontWeight": 600 } }
                  ]
                },
                { "type": "Icon", "id": "ac1", "data": { "name": "check-circle", "size": 22 }, "style": { "color": "#39FF14" } }
              ]
            },
            {
              "type": "Stack", "id": "auto-item-2", "direction": "row",
              "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
              "enterAt": 42,
              "children": [
                {
                  "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 12 },
                  "children": [
                    { "type": "Icon", "id": "ai2", "data": { "name": "settings", "size": 20 }, "style": { "color": "#555", "background": "#222", "borderRadius": "50%", "padding": 6 } },
                    { "type": "BodyText", "id": "at2", "data": { "text": "사용 기술" }, "style": { "color": "#FFFFFF", "fontSize": 18, "fontWeight": 600 } }
                  ]
                },
                { "type": "Icon", "id": "ac2", "data": { "name": "check-circle", "size": 22 }, "style": { "color": "#39FF14" } }
              ]
            },
            {
              "type": "Stack", "id": "auto-item-3", "direction": "row",
              "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
              "enterAt": 54,
              "children": [
                {
                  "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 12 },
                  "children": [
                    { "type": "Icon", "id": "ai3", "data": { "name": "terminal", "size": 20 }, "style": { "color": "#555", "background": "#222", "borderRadius": "50%", "padding": 6 } },
                    { "type": "BodyText", "id": "at3", "data": { "text": "실행 명령어" }, "style": { "color": "#FFFFFF", "fontSize": 18, "fontWeight": 600 } }
                  ]
                },
                { "type": "Icon", "id": "ac3", "data": { "name": "check-circle", "size": 22 }, "style": { "color": "#39FF14" } }
              ]
            }
          ]
        },
        {
          "type": "FrameBox",
          "id": "manual-card",
          "style": { "border": "1.5px solid #39FF14", "background": "#0d1f0d", "borderRadius": "0 12px 12px 0", "padding": 24, "flex": 1, "gap": 20 },
          "enterAt": 66,
          "children": [
            {
              "type": "Stack", "id": "manual-header", "direction": "row",
              "style": { "gap": 10, "alignItems": "center" },
              "children": [
                { "type": "Badge", "id": "manual-badge", "data": { "text": "직접 추가" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": 6, "fontWeight": 700, "fontSize": 13 } },
                { "type": "BodyText", "id": "manual-label", "data": { "text": "AI가 못 잡는 것" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            {
              "type": "Stack", "id": "manual-item-1", "direction": "row",
              "style": { "alignItems": "center", "gap": 12 },
              "enterAt": 78,
              "children": [
                { "type": "Icon", "id": "mi1", "data": { "name": "lightbulb", "size": 20 }, "style": { "color": "#39FF14", "border": "1.5px solid #39FF14", "borderRadius": "50%", "padding": 6 } },
                { "type": "BodyText", "id": "mt1", "data": { "text": "팀 약속 / 컨벤션" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 600 } }
              ]
            },
            {
              "type": "Stack", "id": "manual-item-2", "direction": "row",
              "style": { "alignItems": "center", "gap": 12 },
              "enterAt": 90,
              "children": [
                { "type": "Icon", "id": "mi2", "data": { "name": "warning", "size": 20 }, "style": { "color": "#FF6B35", "border": "1.5px solid #FF6B35", "borderRadius": "50%", "padding": 6 } },
                { "type": "BodyText", "id": "mt2", "data": { "text": "자꾸 틀리는 패턴" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 600 } }
              ]
            },
            {
              "type": "Stack", "id": "manual-item-3", "direction": "row",
              "style": { "alignItems": "center", "gap": 12 },
              "enterAt": 102,
              "children": [
                { "type": "Icon", "id": "mi3", "data": { "name": "target", "size": 20 }, "style": { "color": "#FF4444", "border": "1.5px solid #FF4444", "borderRadius": "50%", "padding": 6 } },
                { "type": "BodyText", "id": "mt3", "data": { "text": "개인 코딩 스타일" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 600 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "id": "summary",
      "data": {
        "segments": [
          { "text": "/init", "style": "accent-bold" },
          { "text": " 후 — 클로드가 ", "style": "normal" },
          { "text": "못 잡는 부분만", "style": "accent-bold" },
          { "text": " 직접 보완", "style": "normal" }
        ]
      },
      "style": { "fontSize": 20, "textAlign": "center" },
      "enterAt": 120
    }
  ]
}
```

### 적용 규칙

- **자동 vs 수동, AI 능력 범위 vs 사람 역할** 대비 씬에 적용
- 두 FrameBox가 **붙어 있음** — 좌 borderRadius `12 0 0 12`, 우 `0 12 12 0` → 하나의 카드처럼 보임
- 좌(자동/AI): dark 배경 + gray 아이콘 + white 텍스트 + **체크 아이콘(✅)** 우측
- 우(수동/사람): **green tint 배경** + 컬러 아이콘(green/orange/red) + green 텍스트
- 아이콘 색상 다양성: 우측 항목마다 다른 아이콘 색상 — 항목의 성격 구분
  - green: 긍정/구조적 (팀 컨벤션)
  - orange: 주의/반복 (틀리는 패턴)
  - red: 개인적/민감 (코딩 스타일)
- "+" 기호: 두 카드 사이 — 좌+우 합쳐야 완성
- REF-043(tip solution vs problem)보다 **디테일한 리스트 항목** + **붙은 카드** 구조
- 좌측 항목은 빠르게(12f 간격), 우측은 좌측 완료 후 시작(66f)하여 순차(12f 간격)
- enterAt: Headline(0) → 좌카드+항목(18~54) → 우카드+항목(66~102) → RichText(120)

---

## REF-061: Headline + 쌓이는 Grid 칩 → 화살표 → 압축 결과 카드 + 경고

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + D (Grid 카드) 혼합
- **용도**: 데이터 축적 → 압축/변환 프로세스, 용량 한계 → 강제 처리
- **정보 밀도**: 높 (Headline 1 + Grid 칩 16개 + 화살표 + 결과 카드 1 + 경고 1 + 설명 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     컨텍스트 컴팩션 **(Context Compaction)**          │
│        (RichText, white + accent-bold)               │
│                                                     │
│  쌓이는 대화             강제 요약                    │
│  (Kicker)               (Kicker)                    │
│  ┌──────────────────┐                               │
│  │ 대화1  대화2      │         ┌──────────┐         │
│  │ 코드수정 에러수정  │   압축   │ 요약본    │         │
│  │ 대화5  대화6      │  ───→   │ ≡≡≡      │         │
│  │ 파일읽기 테스트   │         │          │         │
│  │ 대화9  대화10     │         └──────────┘         │
│  │ 코드추가 대화12   │         기억이 뭉개짐         │
│  │ 리팩터  대화14    │                               │
│  │ 디버깅  대화16    │← 하이라이트(마지막 추가)       │
│  └──────────────────┘                               │
│    ⚠ 임계점 도달!                                    │
│                                                     │
│         치매 발작이 오는 거예요                       │
│         (Headline sm, white bold)                    │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  치매 발작이 오는 거예요                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| RichText Headline | white "컨텍스트 컴팩션 " + accent-bold "(Context Compaction)", fontSize 32, fontWeight 800 |
| 좌측 Kicker "쌓이는 대화" | `#888888`, fontSize 14 |
| 좌측 FrameBox (대화 목록) | border `1px solid #555`, background `#1a1a1a`, borderRadius 12, padding 16, maxWidth 340 |
| 칩 (일반) | background `#333`, color `#FFFFFF`, borderRadius 6, padding `6px 14px`, fontSize 13 |
| 칩 (마지막/하이라이트) | background `#555`, color `#FFFFFF`, borderRadius 6 — 방금 추가된 느낌 |
| 칩 Grid | 2열, gap 8 |
| 경고 텍스트 | `#FF6B35` 또는 `#FFAA00`, fontSize 14, "⚠ 임계점 도달!" |
| "압축" 라벨 + 화살표 | `#39FF14` 화살표, 위에 "압축" green 텍스트 |
| 우측 Kicker "강제 요약" | `#888888`, fontSize 14 |
| 우측 결과 카드 | border `1.5px solid #39FF14`, background `#0d1f0d`, borderRadius 12, size ~140, 중앙정렬 |
| 결과 카드 텍스트 "요약본" | `#39FF14`, fontSize 18, fontWeight 700 |
| 결과 카드 선 아이콘 | `#39FF14`, 가로선 3개 (≡ 요약된 문서) |
| 결과 캡션 "기억이 뭉개짐" | `#888888`, fontSize 13 |
| 하단 Headline | `#FFFFFF`, fontSize 22, fontWeight 700, 중앙정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 30, "gap": 16, "alignItems": "center" },
  "children": [
    {
      "type": "RichText",
      "id": "main-title",
      "data": {
        "segments": [
          { "text": "컨텍스트 컴팩션 ", "style": "normal" },
          { "text": "(Context Compaction)", "style": "accent-bold" }
        ]
      },
      "style": { "fontSize": 32, "fontWeight": 800, "textAlign": "center" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "process-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 28, "justifyContent": "center" },
      "enterAt": 18,
      "children": [
        {
          "type": "Stack",
          "id": "input-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 18,
          "children": [
            { "type": "Kicker", "id": "input-label", "data": { "text": "쌓이는 대화" }, "style": { "color": "#888888", "fontSize": 14 }, "enterAt": 18 },
            {
              "type": "FrameBox",
              "id": "chip-container",
              "style": { "border": "1px solid #555", "background": "#1a1a1a", "borderRadius": 12, "padding": 16, "maxWidth": 340, "gap": 8 },
              "enterAt": 24,
              "children": [
                {
                  "type": "Stack", "id": "chip-grid", "direction": "column",
                  "style": { "gap": 8 },
                  "children": [
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c1", "data": { "text": "대화 1" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 24 },
                      { "type": "Pill", "id": "c2", "data": { "text": "대화 2" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 28 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c3", "data": { "text": "코드 수정" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 32 },
                      { "type": "Pill", "id": "c4", "data": { "text": "에러 수정" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 36 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c5", "data": { "text": "대화 5" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 40 },
                      { "type": "Pill", "id": "c6", "data": { "text": "대화 6" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 44 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c7", "data": { "text": "파일 읽기" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 48 },
                      { "type": "Pill", "id": "c8", "data": { "text": "테스트" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 52 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c9", "data": { "text": "대화 9" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 56 },
                      { "type": "Pill", "id": "c10", "data": { "text": "대화 10" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 60 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c11", "data": { "text": "코드 추가" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 64 },
                      { "type": "Pill", "id": "c12", "data": { "text": "대화 12" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 68 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c13", "data": { "text": "리팩터" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 72 },
                      { "type": "Pill", "id": "c14", "data": { "text": "대화 14" }, "style": { "background": "#333", "borderRadius": 6, "fontSize": 13 }, "enterAt": 76 }
                    ]},
                    { "type": "Stack", "direction": "row", "style": { "gap": 8 }, "children": [
                      { "type": "Pill", "id": "c15", "data": { "text": "디버깅" }, "style": { "background": "#444", "borderRadius": 6, "fontSize": 13 }, "enterAt": 80 },
                      { "type": "Pill", "id": "c16", "data": { "text": "대화 16" }, "style": { "background": "#555", "color": "#FFFFFF", "borderRadius": 6, "fontSize": 13 }, "enterAt": 84 }
                    ]}
                  ]
                }
              ]
            },
            { "type": "BodyText", "id": "warning", "data": { "text": "⚠ 임계점 도달!" }, "style": { "color": "#FFAA00", "fontSize": 14, "fontWeight": 700 }, "enterAt": 90 }
          ]
        },
        {
          "type": "Stack",
          "id": "arrow-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 4 },
          "enterAt": 96,
          "children": [
            { "type": "BodyText", "id": "compress-label", "data": { "text": "압축" }, "style": { "color": "#39FF14", "fontSize": 14, "fontWeight": 700 } },
            { "type": "ArrowConnector", "id": "compress-arrow", "data": { "direction": "right" }, "style": { "color": "#39FF14" } }
          ]
        },
        {
          "type": "Stack",
          "id": "output-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 108,
          "children": [
            { "type": "Kicker", "id": "output-label", "data": { "text": "강제 요약" }, "style": { "color": "#888888", "fontSize": 14 } },
            {
              "type": "FrameBox",
              "id": "result-card",
              "style": { "border": "1.5px solid #39FF14", "background": "#0d1f0d", "borderRadius": 12, "padding": 20, "width": 140, "height": 120, "alignItems": "center", "justifyContent": "center", "gap": 8 },
              "enterAt": 108,
              "children": [
                { "type": "BodyText", "id": "result-title", "data": { "text": "요약본" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700 } },
                { "type": "Divider", "id": "rl1", "style": { "background": "#39FF14", "height": 3, "width": "80%", "borderRadius": 2 } },
                { "type": "Divider", "id": "rl2", "style": { "background": "#39FF14", "height": 3, "width": "60%", "borderRadius": 2, "opacity": 0.7 } },
                { "type": "Divider", "id": "rl3", "style": { "background": "#39FF14", "height": 3, "width": "40%", "borderRadius": 2, "opacity": 0.4 } }
              ]
            },
            { "type": "BodyText", "id": "result-caption", "data": { "text": "기억이 뭉개짐" }, "style": { "color": "#888888", "fontSize": 13 } }
          ]
        }
      ]
    },
    {
      "type": "Headline",
      "id": "punchline",
      "data": { "text": "치매 발작이 오는 거예요", "size": "sm" },
      "style": { "fontSize": 22 },
      "enterAt": 126
    }
  ]
}
```

### 적용 규칙

- **데이터 축적 → 임계점 → 강제 압축/변환** 프로세스 씬에 적용
- 좌측: FrameBox 안에 **칩(Pill) Grid가 4프레임 간격으로 하나씩 쌓이는 애니메이션** — 데이터가 쌓이는 과정 시각화
- 칩 enterAt: 4프레임 간격으로 16개 → 총 64프레임(~2초)에 걸쳐 쌓임 — **빠르게 쌓이는 느낌**
- 마지막 칩은 밝은 배경(`#555`) — 방금 추가됨을 강조
- "⚠ 임계점 도달!" 경고: orange/yellow 색상 — 칩이 다 차면 나타남
- 화살표 "압축": green, 라벨 위에 — 강제 변환 프로세스
- 우측 결과 카드: green border + 문서 목업(Divider 가로선) — 요약된 결과물
- 하단 Headline: 펀치라인 — 임팩트 있는 한 줄
- REF-058(팬인→허브)과 다른 점: **시간에 따라 축적**되는 과정 + **임계점 경고** + 단일 압축 결과
- 칩 개수는 화면 크기에 맞춰 조절 (8~16개, 2열 Grid)
- enterAt: Headline(0) → 칩 순차(24~84, 4f간격) → 경고(90) → 화살표(96) → 결과(108) → 펀치라인(126)

---

## REF-062: Kicker + 번호 리스트 (제목+설명) + 전/후 미니 Badge 쌍 + 경고 결론

### 패턴 분류
- **아키타입**: I (수직 스텝카드) + O (좌우 비교) 혼합
- **용도**: 문제점/증상 나열 — 각 항목에 제목+설명+전후 상태 미니 비교
- **정보 밀도**: 높 (Kicker 1 + 항목 3개 + 전후 Badge 3쌍 + 결론 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           컴팩션 발동 시 증상                         │
│            (Kicker, gray)                            │
│                                                     │
│    ① 지시 위반                         전 → 후      │
│       100% 따르다가 → 규칙 무시       (grn) (gray)  │
│                                                     │
│    ② 버그 재등장                       전 → 후      │
│       고쳐달라 했던 버그가 다시 나타남  (grn) (gray)  │
│                                                     │
│    ③ 파일 망각                         전 → 후      │
│       읽던 파일 잊어버리고 처음부터     (grn) (gray)  │
│                                                     │
│        컴팩션은 최대한 피해야 합니다                  │
│          (green, warning 스타일)                     │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  그래서 컴팩션은 최대한 피해야 합니다                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888888`, fontSize 16, 중앙정렬 |
| 번호 원형 Badge | background `#333`, color `#FFFFFF`, borderRadius 50%, size 40, fontSize 18, fontWeight 700 |
| 항목 제목 | `#FFFFFF`, fontSize 20, fontWeight 700 |
| 항목 설명 | `#888888`, fontSize 15 |
| "전" Badge | background `#0d1f0d`, color `#39FF14`, border `1px solid #39FF14`, borderRadius 6, padding `4px 10px`, fontSize 13 |
| "→" 화살표 | `#555555`, fontSize 14 |
| "후" Badge | background `#333`, color `#FFFFFF`, borderRadius 6, padding `4px 10px`, fontSize 13 |
| 항목 간 gap | 28px |
| 결론 텍스트 | `#39FF14`, fontSize 20, fontWeight 700, 중앙정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 24, "alignItems": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "section-title",
      "data": { "text": "컴팩션 발동 시 증상" },
      "style": { "color": "#888888" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "symptom-list",
      "direction": "column",
      "style": { "gap": 28, "maxWidth": 700, "width": "100%" },
      "enterAt": 18,
      "children": [
        {
          "type": "Stack", "id": "item-1", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 18,
          "children": [
            {
              "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-1", "data": { "text": "1" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": "50%", "width": 40, "height": 40, "fontSize": 18, "fontWeight": 700 } },
                {
                  "type": "Stack", "direction": "column", "style": { "gap": 4 },
                  "children": [
                    { "type": "BodyText", "id": "t1", "data": { "text": "지시 위반" }, "style": { "color": "#FFFFFF", "fontSize": 20, "fontWeight": 700 } },
                    { "type": "BodyText", "id": "d1", "data": { "text": "100% 따르다가 → 규칙 무시" }, "style": { "color": "#888888", "fontSize": 15 } }
                  ]
                }
              ]
            },
            {
              "type": "Stack", "id": "ba-1", "direction": "row",
              "style": { "alignItems": "center", "gap": 8 },
              "children": [
                { "type": "Badge", "id": "before-1", "data": { "text": "전" }, "style": { "background": "#0d1f0d", "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 6, "fontSize": 13 } },
                { "type": "BodyText", "data": { "text": "→" }, "style": { "color": "#555", "fontSize": 14 } },
                { "type": "Badge", "id": "after-1", "data": { "text": "후" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": 6, "fontSize": 13 } }
              ]
            }
          ]
        },
        {
          "type": "Stack", "id": "item-2", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 48,
          "children": [
            {
              "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-2", "data": { "text": "2" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": "50%", "width": 40, "height": 40, "fontSize": 18, "fontWeight": 700 } },
                {
                  "type": "Stack", "direction": "column", "style": { "gap": 4 },
                  "children": [
                    { "type": "BodyText", "id": "t2", "data": { "text": "버그 재등장" }, "style": { "color": "#FFFFFF", "fontSize": 20, "fontWeight": 700 } },
                    { "type": "BodyText", "id": "d2", "data": { "text": "고쳐달라 했던 버그가 다시 나타남" }, "style": { "color": "#888888", "fontSize": 15 } }
                  ]
                }
              ]
            },
            {
              "type": "Stack", "id": "ba-2", "direction": "row",
              "style": { "alignItems": "center", "gap": 8 },
              "children": [
                { "type": "Badge", "id": "before-2", "data": { "text": "전" }, "style": { "background": "#0d1f0d", "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 6, "fontSize": 13 } },
                { "type": "BodyText", "data": { "text": "→" }, "style": { "color": "#555", "fontSize": 14 } },
                { "type": "Badge", "id": "after-2", "data": { "text": "후" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": 6, "fontSize": 13 } }
              ]
            }
          ]
        },
        {
          "type": "Stack", "id": "item-3", "direction": "row",
          "style": { "alignItems": "center", "justifyContent": "space-between", "width": "100%" },
          "enterAt": 78,
          "children": [
            {
              "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 16 },
              "children": [
                { "type": "Badge", "id": "num-3", "data": { "text": "3" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": "50%", "width": 40, "height": 40, "fontSize": 18, "fontWeight": 700 } },
                {
                  "type": "Stack", "direction": "column", "style": { "gap": 4 },
                  "children": [
                    { "type": "BodyText", "id": "t3", "data": { "text": "파일 망각" }, "style": { "color": "#FFFFFF", "fontSize": 20, "fontWeight": 700 } },
                    { "type": "BodyText", "id": "d3", "data": { "text": "읽던 파일 잊어버리고 처음부터" }, "style": { "color": "#888888", "fontSize": 15 } }
                  ]
                }
              ]
            },
            {
              "type": "Stack", "id": "ba-3", "direction": "row",
              "style": { "alignItems": "center", "gap": 8 },
              "children": [
                { "type": "Badge", "id": "before-3", "data": { "text": "전" }, "style": { "background": "#0d1f0d", "color": "#39FF14", "border": "1px solid #39FF14", "borderRadius": 6, "fontSize": 13 } },
                { "type": "BodyText", "data": { "text": "→" }, "style": { "color": "#555", "fontSize": 14 } },
                { "type": "Badge", "id": "after-3", "data": { "text": "후" }, "style": { "background": "#333", "color": "#FFFFFF", "borderRadius": 6, "fontSize": 13 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "BodyText",
      "id": "conclusion",
      "data": { "text": "컴팩션은 최대한 피해야 합니다" },
      "style": { "color": "#39FF14", "fontSize": 20, "fontWeight": 700, "textAlign": "center" },
      "enterAt": 108
    }
  ]
}
```

### 적용 규칙

- **문제점/증상 나열 + 전후 상태 비교** 씬에 적용
- 각 항목 3열 구조: 좌(번호 Badge + 제목/설명) + 우(전→후 미니 Badge 쌍)
- **전/후 미니 Badge**: green "전"(정상 상태) → gray "후"(문제 발생) — 상태 변화를 압축 표현
- 번호 Badge: gray filled 원형 (`#333`) — REF-056 green filled와 대비 (여기는 문제 항목이므로 gray)
- 항목 제목: white bold, 설명: gray — 2줄 구조
- 하단 결론: **green bold** — 경고/행동 유도 (WarningCard 대신 간결한 텍스트)
- REF-033(요약 번호 리스트)과 다른 점: **전/후 Badge 쌍** + gray 번호(문제 항목) + green 결론
- `justifyContent: space-between` — 좌측 번호+텍스트, 우측 전/후 Badge가 양 끝 정렬
- 항목 3개 최적 (4개도 가능, 5개 이상이면 화면 초과)
- enterAt: Kicker(0) → 항목 순차(18, 48, 78) — 30프레임 간격 → 결론(108)

---

## REF-063: 번호 Badge + Headline + TerminalBlock + ProgressBar + 결론 캡션

### 패턴 분류
- **아키타입**: W (터미널 코드 블록) + B (풀블리드 임팩트) 혼합
- **용도**: CLI 명령어 소개, 도구/기능 데모, 실행 결과 표시
- **정보 밀도**: 중 (Badge 1 + Headline 1 + TerminalBlock 1 + ProgressBar 1 + 캡션 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ②  /clear 명령어 적극 활용                       │
│    (green Badge + white bold Headline)               │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │ 🔴 🟡 🟢  Claude Code                  │        │
│  │─────────────────────────────────────────│        │
│  │ $  /clear                               │        │
│  │                                          │        │
│  │ ✓ 대화 기록 초기화 완료                  │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│    ┌──────────────────┐  깨끗하게 시작!              │
│    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  (green bold)               │
│    └──────────────────┘                              │
│      (ProgressBar, 리셋 표현)                        │
│                                                     │
│      새 작업 시작 = 반드시 /clear                    │
│        (gray 캡션)                                   │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  컴팩션이 발동될 일이 잘 없습니다                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 번호 Badge | background `#39FF14`, color `#000`, borderRadius 50%, size 36, fontWeight 700 |
| Headline | `#FFFFFF`, fontSize 28, fontWeight 700, inline (Badge 옆) |
| TerminalBlock 타이틀바 | background `#1a1a1a`, border `1px solid #39FF14`, borderRadius `8px 8px 0 0` |
| 타이틀바 원형 버튼 | 🔴`#FF5F56` 🟡`#FFBD2E` 🟢`#27C93F`, size 12 |
| 타이틀바 텍스트 | `#39FF14`, fontSize 13 ("Claude Code") |
| TerminalBlock 본문 | background `#0a0a0a`, border `1px solid #39FF14`, borderRadius `0 0 8px 8px`, padding 20 |
| 프롬프트 "$" | `#39FF14`, fontSize 16, monospace |
| 명령어 "/clear" | `#39FF14`, fontSize 20, fontWeight 700, monospace |
| 결과 텍스트 "✓ ..." | `#888888`, fontSize 15 |
| ProgressBar (리셋) | background `#333`, 내부 fill `#555` → 리셋 상태, maxWidth 400, height 8 |
| "깨끗하게 시작!" | `#39FF14`, fontSize 16, fontWeight 700 |
| 캡션 | `#888888`, fontSize 15 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 50, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "header-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16 },
      "enterAt": 0,
      "children": [
        { "type": "Badge", "id": "step-num", "data": { "text": "2" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 } },
        { "type": "Headline", "id": "title", "data": { "text": "/clear 명령어 적극 활용", "size": "md" }, "style": { "fontSize": 28 } }
      ]
    },
    {
      "type": "TerminalBlock",
      "id": "terminal",
      "data": {
        "title": "Claude Code",
        "lines": [
          { "type": "command", "text": "/clear" },
          { "type": "output", "text": "✓ 대화 기록 초기화 완료" }
        ]
      },
      "style": { "maxWidth": 600 },
      "enterAt": 24
    },
    {
      "type": "Stack",
      "id": "progress-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16 },
      "enterAt": 54,
      "children": [
        { "type": "ProgressBar", "id": "reset-bar", "data": { "value": 0, "label": "" }, "style": { "maxWidth": 400, "height": 8 } },
        { "type": "BodyText", "id": "reset-label", "data": { "text": "깨끗하게 시작!" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } }
      ]
    },
    {
      "type": "BodyText",
      "id": "caption",
      "data": { "text": "새 작업 시작 = 반드시 /clear" },
      "style": { "color": "#888888", "fontSize": 15 },
      "enterAt": 78
    }
  ]
}
```

### 적용 규칙

- **CLI 명령어 소개, 도구 데모** 씬에 적용
- TerminalBlock: macOS 터미널 목업 — 타이틀바(🔴🟡🟢 + 앱 이름) + 본문($ 프롬프트 + 명령어 + 결과)
- TerminalBlock **green border** — 기본 gray border와 달리 강조된 터미널
- 프롬프트 "$" + 명령어: green monospace — CLI 느낌
- 결과 텍스트: gray + 체크마크 — 성공 출력
- ProgressBar: value 0 (리셋 상태) — 빈 바 + "깨끗하게 시작!" green 라벨
- REF-039(tip number + 카드)와 다른 점: **TerminalBlock**이 메인 시각 요소
- 번호 Badge + Headline: 인라인 (row) — 시리즈 스텝 표시
- TerminalBlock 내부 애니메이션: 명령어 라인이 먼저 나오고(typing 효과), 결과가 이어서 — enterAt으로 순차
- enterAt: Header(0) → TerminalBlock(24) → ProgressBar(54) → 캡션(78)

---

## REF-064: 번호 Headline + 큰 카드 → 화살표 → 서브태스크 팬아웃 + Divider + 결론

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + REF-051 (팬아웃) 혼합
- **용도**: 큰 작업 → 작은 단위 분할, 분해/리팩토링 개념 설명
- **정보 밀도**: 중 (Badge+Headline 1 + 큰 카드 1 + 화살표 + 서브 Pill 3 + Divider + 결론 2)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ③  작업을 잘게 쪼개세요                          │
│    (green Badge + white bold Headline)               │
│                                                     │
│  ┌──────────────┐         ● 서브태스크 A  한 세션    │
│  │              │         ● 서브태스크 B  한 세션    │
│  │    BIG       │  ───→   ● 서브태스크 C  한 세션    │
│  │  하나에 다하기│                                    │
│  │              │                                    │
│  └──────────────┘                                    │
│   컴팩션 발동 위험                                    │
│  (gray big card)          (green pills + 도트)       │
│                                                     │
│  ─────────────────────────────────────────────────   │
│                                                     │
│        컴팩션은 선택이 아닙니다                       │
│         (Headline sm, white bold)                    │
│                                                     │
│      피하거나 — 최소화해야 해요                       │
│        (green, fontSize 18)                          │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  피하거나 아니면 최소화해야 해요                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| 번호 Badge | background `#39FF14`, color `#000`, borderRadius 50%, size 36, fontWeight 700 |
| Headline | `#FFFFFF`, fontSize 28, fontWeight 700, inline |
| 큰 카드 (BIG) | border `1px solid #444`, background `#1a1a1a`, borderRadius 12, padding 28, maxWidth 260, height ~160 |
| "BIG" 텍스트 | `#FFFFFF`, fontSize 28, fontWeight 800 |
| "하나에 다 하기" | `#888888`, fontSize 14 |
| 경고 캡션 | `#888888`, fontSize 13, ("컴팩션 발동 위험") |
| ArrowConnector | `#39FF14`, direction right |
| green 도트 | `#39FF14`, 원형 size 10, filled |
| 서브태스크 Pill | border `1px solid #39FF14`, background transparent, color `#39FF14`, borderRadius 6, padding `6px 16px`, fontSize 14 |
| "한 세션" 라벨 | `#888888`, fontSize 13 |
| Divider | `#39FF14`, opacity 0.3, height 1, 전체 너비 |
| 결론 Headline | `#FFFFFF`, fontSize 22, fontWeight 700, 중앙정렬 |
| 결론 부제 | `#39FF14`, fontSize 18, 중앙정렬 |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 40, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Stack",
      "id": "header-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16 },
      "enterAt": 0,
      "children": [
        { "type": "Badge", "id": "step-num", "data": { "text": "3" }, "style": { "background": "#39FF14", "color": "#000", "borderRadius": "50%", "width": 36, "height": 36, "fontSize": 18, "fontWeight": 700 } },
        { "type": "Headline", "id": "title", "data": { "text": "작업을 잘게 쪼개세요", "size": "md" }, "style": { "fontSize": 28 } }
      ]
    },
    {
      "type": "Stack",
      "id": "split-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 24, "justifyContent": "center" },
      "enterAt": 18,
      "children": [
        {
          "type": "Stack",
          "id": "big-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 18,
          "children": [
            {
              "type": "FrameBox",
              "id": "big-card",
              "style": { "border": "1px solid #444", "background": "#1a1a1a", "borderRadius": 12, "padding": 28, "maxWidth": 260, "alignItems": "center", "gap": 8 },
              "enterAt": 18,
              "children": [
                { "type": "BodyText", "id": "big-label", "data": { "text": "BIG" }, "style": { "color": "#FFFFFF", "fontSize": 28, "fontWeight": 800 } },
                { "type": "BodyText", "id": "big-sub", "data": { "text": "하나에 다 하기" }, "style": { "color": "#888888", "fontSize": 14 } }
              ]
            },
            { "type": "BodyText", "id": "warning-caption", "data": { "text": "컴팩션 발동 위험" }, "style": { "color": "#888888", "fontSize": 13 } }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "split-arrow",
          "data": { "direction": "right" },
          "style": { "color": "#39FF14" },
          "enterAt": 42
        },
        {
          "type": "Stack",
          "id": "subtasks-col",
          "direction": "column",
          "style": { "gap": 14 },
          "enterAt": 54,
          "children": [
            {
              "type": "Stack", "id": "sub-1", "direction": "row",
              "style": { "alignItems": "center", "gap": 10 },
              "enterAt": 54,
              "children": [
                { "type": "Badge", "id": "dot-1", "data": { "text": "" }, "style": { "background": "#39FF14", "borderRadius": "50%", "width": 10, "height": 10 } },
                { "type": "Pill", "id": "pill-1", "data": { "text": "서브태스크 A" }, "style": { "border": "1px solid #39FF14", "color": "#39FF14", "background": "transparent", "borderRadius": 6 } },
                { "type": "BodyText", "id": "label-1", "data": { "text": "한 세션" }, "style": { "color": "#888888", "fontSize": 13 } }
              ]
            },
            {
              "type": "Stack", "id": "sub-2", "direction": "row",
              "style": { "alignItems": "center", "gap": 10 },
              "enterAt": 72,
              "children": [
                { "type": "Badge", "id": "dot-2", "data": { "text": "" }, "style": { "background": "#39FF14", "borderRadius": "50%", "width": 10, "height": 10 } },
                { "type": "Pill", "id": "pill-2", "data": { "text": "서브태스크 B" }, "style": { "border": "1px solid #39FF14", "color": "#39FF14", "background": "transparent", "borderRadius": 6 } },
                { "type": "BodyText", "id": "label-2", "data": { "text": "한 세션" }, "style": { "color": "#888888", "fontSize": 13 } }
              ]
            },
            {
              "type": "Stack", "id": "sub-3", "direction": "row",
              "style": { "alignItems": "center", "gap": 10 },
              "enterAt": 90,
              "children": [
                { "type": "Badge", "id": "dot-3", "data": { "text": "" }, "style": { "background": "#39FF14", "borderRadius": "50%", "width": 10, "height": 10 } },
                { "type": "Pill", "id": "pill-3", "data": { "text": "서브태스크 C" }, "style": { "border": "1px solid #39FF14", "color": "#39FF14", "background": "transparent", "borderRadius": 6 } },
                { "type": "BodyText", "id": "label-3", "data": { "text": "한 세션" }, "style": { "color": "#888888", "fontSize": 13 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Divider",
      "id": "section-divider",
      "style": { "background": "#39FF14", "opacity": 0.3, "height": 1, "width": "80%" },
      "enterAt": 108
    },
    {
      "type": "Headline",
      "id": "conclusion",
      "data": { "text": "컴팩션은 선택이 아닙니다", "size": "sm" },
      "style": { "fontSize": 22 },
      "enterAt": 114
    },
    {
      "type": "BodyText",
      "id": "conclusion-sub",
      "data": { "text": "피하거나 — 최소화해야 해요" },
      "style": { "color": "#39FF14", "fontSize": 18, "textAlign": "center" },
      "enterAt": 126
    }
  ]
}
```

### 적용 규칙

- **큰 작업 → 작은 단위 분할, 분해 전략** 씬에 적용
- 좌측: 큰 gray 카드 "BIG" + 경고 캡션 — 문제 상태 (하나에 몰아넣기)
- 화살표: green — 변환/분할 행위
- 우측: **green 도트 + green border Pill + gray 라벨** 세로 스택 — 분할된 서브태스크들
- REF-051(소스→허브→도구)과 다른 점: **1→N 분할**(팬아웃), 허브 없이 직접 분할
- REF-058(N→1 팬인)의 **역방향** — 큰 것을 작게 쪼개기
- green 도트: 각 서브태스크 앞 — 불릿 포인트 역할, active 상태 표시
- "한 세션" 라벨: 각 서브태스크 옆 gray 텍스트 — 분할 단위/범위 표시
- Divider: green 반투명 — 다이어그램과 결론 구분
- 결론 2줄: white Headline + green 부제 — 강한 메시지
- enterAt: Header(0) → 큰 카드(18) → 화살표(42) → 서브태스크 순차(54, 72, 90) → Divider(108) → 결론(114, 126)

---

## REF-065: Kicker + 파일 리스트(하이라이트 1개) → 필터 Badge → 결과 아이콘 + 효과 행

### 패턴 분류
- **아키타입**: E (수평 프로세스 플로우) + REF-058 (팬인→필터) 변형
- **용도**: 다수에서 하나 선택/필터링, 파일 목록 → 필요한 것만 추출
- **정보 밀도**: 높 (Kicker 1 + 파일 Pill 5 + 필터 Badge + 결과 아이콘 + 효과 행 1)

### ASCII 다이어그램
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│       7단계 — 토큰 방법론 ①                          │
│            (Kicker, gray)                            │
│                                                     │
│  전체 프로젝트          필요한 범위만                 │
│  ┌──────────────┐                                   │
│  │ 📄 payment.ts│ (gray)     ┌──────────┐          │
│  │ 📄 auth.ts   │ (gray)     │  ≡≡≡     │          │
│  │ 📄 login.ts  │ (GREEN!)   │ login.ts │          │
│  │ 📄 db.ts     │ (gray)  필터 └──────────┘         │
│  │ 📄 routes.ts │ (gray)  ──→  (green icon)         │
│  └──────────────┘         (Badge) 필요한 것만        │
│                                  (green Pill)        │
│                                                     │
│       파일 수 ↓  |  **토큰 절약 + 컴팩션 지연**      │
│       (green)    |  (green underline)                │
│                                                     │
│  ═══════════════════════════════════════════════════ │
│  로그인 관련 파일만 주세요                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888888`, fontSize 16, 중앙정렬 |
| "전체 프로젝트" 라벨 | `#888888`, fontSize 14 |
| 파일 Pill (비선택) | background `#1a1a1a`, border `1px solid #444`, borderRadius 8, color `#888`, fontSize 16, monospace |
| 파일 아이콘 (비선택) | `#555`, size 18 |
| 파일 Pill (선택/하이라이트) | background `#0d1f0d`, border `1.5px solid #39FF14`, borderRadius 8, color `#39FF14`, fontSize 16, monospace, fontWeight 700 |
| 파일 아이콘 (선택) | `#39FF14`, size 18 |
| "필터" Badge | border `1.5px solid #39FF14`, background transparent, color `#39FF14`, borderRadius 20, fontSize 14 |
| ArrowConnector | `#39FF14`, direction right |
| "필요한 범위만" 라벨 | `#888888`, fontSize 14 |
| 결과 아이콘 (문서) | green border rounded square, size ~100, 내부 가로선 3개 |
| 결과 파일명 | `#39FF14`, fontSize 18, fontWeight 700, monospace |
| "필요한 것만" Pill | border `1px solid #39FF14`, color `#39FF14`, borderRadius 20, fontSize 13 |
| 효과 행 | "파일 수 ↓"(green) + "|" + "**토큰 절약 + 컴팩션 지연**"(green, underline) |

### stack_root 구조

```json
{
  "type": "SceneRoot",
  "direction": "column",
  "style": { "padding": 30, "gap": 20, "alignItems": "center" },
  "children": [
    {
      "type": "Kicker",
      "id": "section-title",
      "data": { "text": "7단계 — 토큰 방법론 ①" },
      "style": { "color": "#888888" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "filter-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 24, "justifyContent": "center" },
      "enterAt": 12,
      "children": [
        {
          "type": "Stack",
          "id": "file-list-col",
          "direction": "column",
          "style": { "gap": 10 },
          "enterAt": 12,
          "children": [
            { "type": "BodyText", "id": "list-label", "data": { "text": "전체 프로젝트" }, "style": { "color": "#888888", "fontSize": 14 }, "enterAt": 12 },
            {
              "type": "FrameBox", "id": "file-1",
              "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "padding": "10px 20px", "maxWidth": 280 },
              "enterAt": 18,
              "children": [
                { "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "id": "fi-1", "data": { "name": "document", "size": 18 }, "style": { "color": "#555" } },
                    { "type": "BodyText", "id": "fn-1", "data": { "text": "payment.ts" }, "style": { "color": "#888", "fontSize": 16, "fontFamily": "monospace" } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox", "id": "file-2",
              "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "padding": "10px 20px", "maxWidth": 280 },
              "enterAt": 24,
              "children": [
                { "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "id": "fi-2", "data": { "name": "document", "size": 18 }, "style": { "color": "#555" } },
                    { "type": "BodyText", "id": "fn-2", "data": { "text": "auth.ts" }, "style": { "color": "#888", "fontSize": 16, "fontFamily": "monospace" } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox", "id": "file-3-active",
              "style": { "background": "#0d1f0d", "border": "1.5px solid #39FF14", "borderRadius": 8, "padding": "10px 20px", "maxWidth": 280 },
              "enterAt": 30,
              "children": [
                { "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "id": "fi-3", "data": { "name": "document", "size": 18 }, "style": { "color": "#39FF14" } },
                    { "type": "BodyText", "id": "fn-3", "data": { "text": "login.ts" }, "style": { "color": "#39FF14", "fontSize": 16, "fontFamily": "monospace", "fontWeight": 700 } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox", "id": "file-4",
              "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "padding": "10px 20px", "maxWidth": 280 },
              "enterAt": 36,
              "children": [
                { "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "id": "fi-4", "data": { "name": "document", "size": 18 }, "style": { "color": "#555" } },
                    { "type": "BodyText", "id": "fn-4", "data": { "text": "db.ts" }, "style": { "color": "#888", "fontSize": 16, "fontFamily": "monospace" } }
                  ]
                }
              ]
            },
            {
              "type": "FrameBox", "id": "file-5",
              "style": { "background": "#1a1a1a", "border": "1px solid #444", "borderRadius": 8, "padding": "10px 20px", "maxWidth": 280 },
              "enterAt": 42,
              "children": [
                { "type": "Stack", "direction": "row", "style": { "alignItems": "center", "gap": 10 },
                  "children": [
                    { "type": "Icon", "id": "fi-5", "data": { "name": "document", "size": 18 }, "style": { "color": "#555" } },
                    { "type": "BodyText", "id": "fn-5", "data": { "text": "routes.ts" }, "style": { "color": "#888", "fontSize": 16, "fontFamily": "monospace" } }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "Stack",
          "id": "filter-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 8 },
          "enterAt": 54,
          "children": [
            { "type": "Pill", "id": "filter-badge", "data": { "text": "필터" }, "style": { "border": "1.5px solid #39FF14", "color": "#39FF14", "background": "transparent", "borderRadius": 20 }, "enterAt": 54 },
            { "type": "ArrowConnector", "id": "filter-arrow", "data": { "direction": "right" }, "style": { "color": "#39FF14" }, "enterAt": 60 }
          ]
        },
        {
          "type": "Stack",
          "id": "result-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 10 },
          "enterAt": 72,
          "children": [
            { "type": "BodyText", "id": "result-label", "data": { "text": "필요한 범위만" }, "style": { "color": "#888888", "fontSize": 14 } },
            {
              "type": "Stack",
              "id": "result-icon-box",
              "direction": "column",
              "style": { "alignItems": "center", "justifyContent": "center", "width": 100, "height": 100, "border": "1.5px solid #39FF14", "borderRadius": 12, "background": "#0d1f0d", "gap": 8 },
              "children": [
                { "type": "Divider", "style": { "background": "#39FF14", "height": 3, "width": "60%", "borderRadius": 2 } },
                { "type": "Divider", "style": { "background": "#39FF14", "height": 3, "width": "50%", "borderRadius": 2, "opacity": 0.7 } },
                { "type": "Divider", "style": { "background": "#39FF14", "height": 3, "width": "40%", "borderRadius": 2, "opacity": 0.4 } }
              ]
            },
            { "type": "BodyText", "id": "result-filename", "data": { "text": "login.ts" }, "style": { "color": "#39FF14", "fontSize": 18, "fontWeight": 700, "fontFamily": "monospace" } },
            { "type": "Pill", "id": "result-pill", "data": { "text": "필요한 것만" }, "style": { "border": "1px solid #39FF14", "color": "#39FF14", "background": "transparent", "borderRadius": 20, "fontSize": 13 } }
          ]
        }
      ]
    },
    {
      "type": "Stack",
      "id": "effect-row",
      "direction": "row",
      "style": { "alignItems": "center", "gap": 16, "justifyContent": "center" },
      "enterAt": 96,
      "children": [
        { "type": "BodyText", "id": "eff-1", "data": { "text": "파일 수 ↓" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700 } },
        { "type": "BodyText", "id": "eff-sep", "data": { "text": "|" }, "style": { "color": "#555", "fontSize": 16 } },
        { "type": "BodyText", "id": "eff-2", "data": { "text": "토큰 절약 + 컴팩션 지연" }, "style": { "color": "#39FF14", "fontSize": 16, "fontWeight": 700, "textDecoration": "underline" } }
      ]
    }
  ]
}
```

### 적용 규칙

- **다수에서 하나 선택, 필터링, 스코프 축소** 씬에 적용
- 좌측: 파일/항목 리스트 (FrameBox 세로 스택) — **하나만 green 하이라이트**, 나머지 gray
- 중앙: "필터" Pill + green 화살표 — 필터링 행위
- 우측: 결과 문서 아이콘(green border box + 가로선 목업) + 파일명 + "필요한 것만" Pill
- REF-058(N→1 팬인)과 유사하나, 입력이 **파일 리스트 목업**(monospace 파일명) — 개발 맥락
- **하이라이트 1개**: green border + green tint 배경 + green 텍스트 — 선택된 항목 강조
- 비선택 파일: gray 전체 (border, icon, text) — 관련 없음을 시각적으로 표현
- 하단 효과 행: green bold + "|" 구분자 + green underline — 핵심 이점 2개 나열
- monospace 폰트: 파일명에 사용 — 코드/개발 맥락 강조
- enterAt: Kicker(0) → 파일 순차(18~42, 6f간격) → 필터(54) → 화살표(60) → 결과(72) → 효과(96)

---

## REF-066: 모델 비교 — 좌우 카드 + Pill 태그 + InsightTile

### 구조 (ASCII)

```
┌─────────────────────────────────────────────────┐
│ [Kicker] 7단계 — 토큰 방법론 ②                    │
│                                                 │
│  ┌─ gray border ──────┐ │ ┌─ green border ────┐ │
│  │  ⬡ Opus            │ │ │  ⬡ Sonnet         │ │
│  │  복잡한 설계        │ │ │  코드 수정         │ │
│  │  아키텍처           │ │ │  간단한 작업        │ │
│  │                    │ │ │                    │ │
│  │ [심층 분석][코드 설계]│ │ │ [빠름] [저렴]      │ │
│  │ [복잡한 문제]       │ │ │ [효율적]           │ │
│  └────────────────────┘ │ └────────────────────┘ │
│                         │                        │
│  ┌─ green border ─────────────────────────────┐  │
│  │ 💡 작업 난이도에 맞는 모델 → 토큰 절약 + 속도 향상│  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888`, 14px, uppercase tracking |
| 좌 카드 border | `#555` (gray) — 무거운/고비용 암시 |
| 우 카드 border | `#39FF14` (accent green) — 가벼운/효율적 암시 |
| 카드 내 아이콘 | 28px, 좌=gray, 우=green |
| 카드 내 모델명 (Headline sm) | 22px, bold, 좌=white, 우=`#39FF14` |
| 카드 내 설명 (BodyText) | 16px, 좌=`#ccc`, 우=`#ccc` |
| Pill 태그 좌 | `bg: #1a1a1a`, `border: #555`, `color: #888` |
| Pill 태그 우 | `bg: #0d1f0d`, `border: #39FF14`, `color: #39FF14` |
| 수직 구분선 | `LineConnector vertical`, `#333`, 1px |
| InsightTile | `border: #39FF14`, green tint bg, 16px |
| 카드 maxWidth | 420 각각 |
| Split 전체 | maxWidth: 900 |

### stack_root JSON

```json
{
  "type": "SceneRoot",
  "id": "scene-root",
  "style": { "padding": 60 },
  "children": [
    {
      "type": "Kicker",
      "id": "kicker",
      "data": { "text": "7단계 — 토큰 방법론 ②" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "card-split",
      "direction": "row",
      "style": { "gap": 0, "maxWidth": 900, "width": "100%", "alignItems": "stretch" },
      "enterAt": 24,
      "children": [
        {
          "type": "FrameBox",
          "id": "card-left",
          "style": {
            "maxWidth": 420,
            "flex": 1,
            "borderColor": "#555",
            "borderWidth": 1,
            "borderRadius": 12,
            "padding": 28,
            "background": "#111"
          },
          "enterAt": 24,
          "children": [
            {
              "type": "Icon",
              "id": "icon-left",
              "data": { "name": "brain", "size": 28 },
              "style": { "color": "#888" },
              "enterAt": 24
            },
            {
              "type": "Headline",
              "id": "hl-left",
              "data": { "text": "Opus", "size": "sm" },
              "style": { "color": "#ffffff", "fontSize": 22 },
              "enterAt": 30
            },
            {
              "type": "BodyText",
              "id": "desc-left-1",
              "data": { "text": "복잡한 설계" },
              "style": { "color": "#ccc", "fontSize": 16 },
              "enterAt": 36
            },
            {
              "type": "BodyText",
              "id": "desc-left-2",
              "data": { "text": "아키텍처" },
              "style": { "color": "#ccc", "fontSize": 16 },
              "enterAt": 42
            },
            {
              "type": "Stack",
              "id": "pills-left",
              "direction": "row",
              "style": { "gap": 8, "flexWrap": "wrap", "marginTop": 12 },
              "enterAt": 54,
              "children": [
                { "type": "Pill", "id": "pill-l1", "data": { "label": "심층 분석" }, "style": { "background": "#1a1a1a", "borderColor": "#555", "color": "#888" }, "enterAt": 54 },
                { "type": "Pill", "id": "pill-l2", "data": { "label": "코드 설계" }, "style": { "background": "#1a1a1a", "borderColor": "#555", "color": "#888" }, "enterAt": 60 },
                { "type": "Pill", "id": "pill-l3", "data": { "label": "복잡한 문제" }, "style": { "background": "#1a1a1a", "borderColor": "#555", "color": "#888" }, "enterAt": 66 }
              ]
            }
          ]
        },
        {
          "type": "LineConnector",
          "id": "divider-v",
          "data": { "direction": "vertical" },
          "style": { "color": "#333", "marginLeft": 16, "marginRight": 16 },
          "enterAt": 24
        },
        {
          "type": "FrameBox",
          "id": "card-right",
          "style": {
            "maxWidth": 420,
            "flex": 1,
            "borderColor": "#39FF14",
            "borderWidth": 1,
            "borderRadius": 12,
            "padding": 28,
            "background": "#0d1f0d"
          },
          "enterAt": 36,
          "children": [
            {
              "type": "Icon",
              "id": "icon-right",
              "data": { "name": "zap", "size": 28 },
              "style": { "color": "#39FF14" },
              "enterAt": 36
            },
            {
              "type": "Headline",
              "id": "hl-right",
              "data": { "text": "Sonnet", "size": "sm" },
              "style": { "color": "#39FF14", "fontSize": 22 },
              "enterAt": 42
            },
            {
              "type": "BodyText",
              "id": "desc-right-1",
              "data": { "text": "코드 수정" },
              "style": { "color": "#ccc", "fontSize": 16 },
              "enterAt": 48
            },
            {
              "type": "BodyText",
              "id": "desc-right-2",
              "data": { "text": "간단한 작업" },
              "style": { "color": "#ccc", "fontSize": 16 },
              "enterAt": 54
            },
            {
              "type": "Stack",
              "id": "pills-right",
              "direction": "row",
              "style": { "gap": 8, "flexWrap": "wrap", "marginTop": 12 },
              "enterAt": 66,
              "children": [
                { "type": "Pill", "id": "pill-r1", "data": { "label": "빠름" }, "style": { "background": "#0d1f0d", "borderColor": "#39FF14", "color": "#39FF14" }, "enterAt": 66 },
                { "type": "Pill", "id": "pill-r2", "data": { "label": "저렴" }, "style": { "background": "#0d1f0d", "borderColor": "#39FF14", "color": "#39FF14" }, "enterAt": 72 },
                { "type": "Pill", "id": "pill-r3", "data": { "label": "효율적" }, "style": { "background": "#0d1f0d", "borderColor": "#39FF14", "color": "#39FF14" }, "enterAt": 78 }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "InsightTile",
      "id": "insight",
      "data": { "text": "작업 난이도에 맞는 모델 → 토큰 절약 + 속도 향상" },
      "style": { "maxWidth": 600 },
      "enterAt": 96
    }
  ]
}
```

### 적용 규칙

- **이항 대비 — 두 옵션/모델/도구 비교** 씬에 적용
- 좌 카드: gray border + 흰 텍스트 + gray Pill → 무거운/고비용/전문가 옵션
- 우 카드: green border + green tint bg + green Pill → 가벼운/효율적/일상 옵션
- **색상 코딩으로 가치 판단 내포**: gray=무거운/비싸지만 필요, green=빠르고 효율적
- REF-003(좌우 VS 대비)과 유사하나, **수직 구분선이 더 얇고**, **카드 내부에 Pill 태그 클러스터**가 핵심 차이
- Pill 태그: 좌=gray계열(#1a1a1a bg, #555 border), 우=green계열(#0d1f0d bg, #39FF14 border)
- 하단 InsightTile: 두 옵션의 **활용 전략** 요약 — "→" 기호로 원인→효과 표현
- 카드 내부 구조: Icon(모델 상징) → Headline(모델명) → BodyText×2(용도) → Pill 클러스터(특성)
- enterAt: Kicker(0) → 좌카드(24) → 좌내용 순차(24~66) → 우카드(36) → 우내용 순차(36~78) → InsightTile(96)
- **좌우 카드 등장이 12프레임 차이로 살짝 시차** — 동시 등장보다 역동적

---

## REF-067: 아이콘 히어로 + 등식 헤드라인 + 좌우 비교 테이블 + RichText 요약

### 구조 (ASCII)

```
┌─────────────────────────────────────────────────┐
│            [Kicker] 8단계 — 요리 예산 비유         │
│         🍲 (큰 SVG 아이콘, 김 올라오는 냄비)        │
│            식비 = **토큰 비용**                    │
│                                                 │
│    소모량 모를 때          │   소모량 알 때          │
│  ──────────────────────  │  ──────────────────── │
│  어떻게 절약할지 모름  절약  정확한 절약 포인트 파악   │
│  너무 많거나 적게 구매 플랜  딱 맞는 플랜 선택        │
│  매번 불안            감각  프로젝트 규모별 예측 가능  │
│                                                 │
│  먼저 내가 얼마나 쓰는지 **알아야** 줄일 수 있다      │
│                                                 │
│     [FooterCaption] 플랜 선택도 현명하게 할 수 있어요 │
└─────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888`, 14px |
| SVG 아이콘 (냄비) | 80px, green stroke `#39FF14`, 김 애니메이션 |
| 등식 Headline | white + green bold (`식비 = **토큰 비용**`) — RichText로 구현 |
| 열 헤더 좌 "소모량 모를 때" | white, 16px, underline 없음 |
| 열 헤더 우 "소모량 알 때" | `#39FF14`, 16px, underline |
| 수직 구분선 | `#333`, 1px |
| 좌 열 내용 | `#aaa`, 15px — 부정적/모호한 상태 |
| 중앙 라벨 (절약/플랜/감각) | `#888`, 14px, 카테고리 명 |
| 우 열 내용 | `#39FF14`, 15px, underline — 긍정적/명확한 상태 |
| RichText 요약 | white 18px + green bold underline ("알아야") |
| FooterCaption | `#888`, 20px, 하단 여백 |
| 테이블 행 간격 | 수평 Divider `#222`, 전체 너비 |

### stack_root JSON

```json
{
  "type": "SceneRoot",
  "id": "scene-root",
  "style": { "padding": 60 },
  "children": [
    {
      "type": "Kicker",
      "id": "kicker",
      "data": { "text": "8단계 — 요리 예산 비유" },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "hero-row",
      "direction": "row",
      "style": { "gap": 20, "alignItems": "center", "justifyContent": "center" },
      "enterAt": 6,
      "children": [
        {
          "type": "Icon",
          "id": "icon-pot",
          "data": { "name": "cooking-pot", "size": 80 },
          "style": { "color": "#39FF14" },
          "enterAt": 6,
          "motion": { "preset": "scale-in" }
        },
        {
          "type": "RichText",
          "id": "equation",
          "data": {
            "segments": [
              { "text": "식비 = ", "bold": true, "color": "#ffffff" },
              { "text": "토큰 비용", "bold": true, "color": "#39FF14" }
            ]
          },
          "style": { "fontSize": 32 },
          "enterAt": 12
        }
      ]
    },
    {
      "type": "Stack",
      "id": "table-block",
      "direction": "column",
      "style": { "maxWidth": 800, "width": "100%", "gap": 0, "marginTop": 24 },
      "enterAt": 30,
      "children": [
        {
          "type": "Stack",
          "id": "header-row",
          "direction": "row",
          "style": { "justifyContent": "space-around", "width": "100%", "paddingBottom": 12 },
          "enterAt": 30,
          "children": [
            {
              "type": "BodyText",
              "id": "col-h-left",
              "data": { "text": "소모량 모를 때" },
              "style": { "color": "#ffffff", "fontSize": 16, "flex": 1, "textAlign": "center" },
              "enterAt": 30
            },
            {
              "type": "BodyText",
              "id": "col-h-right",
              "data": { "text": "소모량 알 때" },
              "style": { "color": "#39FF14", "fontSize": 16, "textDecoration": "underline", "flex": 1, "textAlign": "center" },
              "enterAt": 30
            }
          ]
        },
        {
          "type": "Divider",
          "id": "div-header",
          "style": { "color": "#333" },
          "enterAt": 30
        },
        {
          "type": "Stack",
          "id": "row-1",
          "direction": "row",
          "style": { "alignItems": "center", "width": "100%", "paddingTop": 14, "paddingBottom": 14 },
          "enterAt": 42,
          "children": [
            { "type": "BodyText", "id": "r1-left", "data": { "text": "어떻게 절약할지 모름" }, "style": { "color": "#aaa", "fontSize": 15, "flex": 1, "textAlign": "center" }, "enterAt": 42 },
            { "type": "Badge", "id": "r1-cat", "data": { "label": "절약" }, "style": { "background": "transparent", "color": "#888", "fontSize": 13 }, "enterAt": 42 },
            { "type": "BodyText", "id": "r1-right", "data": { "text": "정확한 절약 포인트 파악" }, "style": { "color": "#39FF14", "fontSize": 15, "textDecoration": "underline", "flex": 1, "textAlign": "center" }, "enterAt": 48 }
          ]
        },
        {
          "type": "Divider",
          "id": "div-1",
          "style": { "color": "#222" },
          "enterAt": 42
        },
        {
          "type": "Stack",
          "id": "row-2",
          "direction": "row",
          "style": { "alignItems": "center", "width": "100%", "paddingTop": 14, "paddingBottom": 14 },
          "enterAt": 56,
          "children": [
            { "type": "BodyText", "id": "r2-left", "data": { "text": "너무 많거나 적게 구매" }, "style": { "color": "#aaa", "fontSize": 15, "flex": 1, "textAlign": "center" }, "enterAt": 56 },
            { "type": "Badge", "id": "r2-cat", "data": { "label": "플랜" }, "style": { "background": "transparent", "color": "#888", "fontSize": 13 }, "enterAt": 56 },
            { "type": "BodyText", "id": "r2-right", "data": { "text": "딱 맞는 플랜 선택" }, "style": { "color": "#39FF14", "fontSize": 15, "textDecoration": "underline", "flex": 1, "textAlign": "center" }, "enterAt": 62 }
          ]
        },
        {
          "type": "Divider",
          "id": "div-2",
          "style": { "color": "#222" },
          "enterAt": 56
        },
        {
          "type": "Stack",
          "id": "row-3",
          "direction": "row",
          "style": { "alignItems": "center", "width": "100%", "paddingTop": 14, "paddingBottom": 14 },
          "enterAt": 70,
          "children": [
            { "type": "BodyText", "id": "r3-left", "data": { "text": "매번 불안" }, "style": { "color": "#aaa", "fontSize": 15, "flex": 1, "textAlign": "center" }, "enterAt": 70 },
            { "type": "Badge", "id": "r3-cat", "data": { "label": "감각" }, "style": { "background": "transparent", "color": "#888", "fontSize": 13 }, "enterAt": 70 },
            { "type": "BodyText", "id": "r3-right", "data": { "text": "프로젝트 규모별 예측 가능" }, "style": { "color": "#39FF14", "fontSize": 15, "textDecoration": "underline", "flex": 1, "textAlign": "center" }, "enterAt": 76 }
          ]
        }
      ]
    },
    {
      "type": "RichText",
      "id": "summary",
      "data": {
        "segments": [
          { "text": "먼저 내가 얼마나 쓰는지 ", "color": "#ffffff" },
          { "text": "알아야", "bold": true, "color": "#39FF14", "underline": true },
          { "text": " 줄일 수 있다", "color": "#ffffff" }
        ]
      },
      "style": { "fontSize": 18, "marginTop": 24 },
      "enterAt": 90
    },
    {
      "type": "FooterCaption",
      "id": "footer",
      "data": { "text": "플랜 선택도 현명하게 할 수 있어요" },
      "enterAt": 108
    }
  ]
}
```

### 적용 규칙

- **비유 기반 전후 비교 테이블** 씬에 적용 — "모를 때 vs 알 때", "이전 vs 이후"
- 상단 히어로: 큰 SVG 아이콘 + RichText 등식 (`A = B` 형태) — 비유 관계 시각화
- 테이블 구조: Stack(row) 반복 + Divider로 행 구분 — 실제 테이블 목업
- **3열 구조**: 좌(gray 부정) + 중앙(Badge 카테고리 라벨) + 우(green 긍정)
- 중앙 카테고리 Badge: transparent bg, gray 텍스트 — 행의 주제를 짧게 표시
- 좌 열: `#aaa` gray — 문제/모호한 상태
- 우 열: `#39FF14` green + underline — 해결/명확한 상태
- 열 헤더: 좌=white(중립), 우=green+underline(강조) — 헤더에서부터 색상 코딩
- RichText 요약: 핵심 단어만 green bold underline — 문장 속 키워드 강조
- REF-066(카드 비교)과 달리 **테이블 형태** — 항목이 3개 이상일 때 더 적합
- enterAt: Kicker(0) → 아이콘+등식(6~12) → 테이블 헤더(30) → 행 순차(42,56,70) → 요약(90) → Footer(108)
- 우 열이 좌 열보다 6프레임 늦게 등장 — "알게 되면 이렇게 바뀐다" 인과 효과

---

## REF-068: 가격 티어 3열 카드 + ProgressBar + 강조 CTA

### 구조 (ASCII)

```
┌─────────────────────────────────────────────────┐
│         [Kicker] 9단계 — 한계까지 써보기            │
│     Claude Code **Max** 플랜 구조                 │
│                                                 │
│  ┌─ #333 border ─┐ ┌─ #555 border ─┐ ┌─ green ─┐│
│  │  1x           │ │  5x           │ │  20x     ││
│  │  ━━●━━━━━━━━  │ │  ━━━━●━━━━━━  │ │  ━━━━━━━●││
│  │  Pro    기본   │ │  Max 5x 월$100│ │ Max20x $200│
│  └───────────────┘ └───────────────┘ └──────────┘│
│                                                 │
│  ┌─ green border pill ──────────────────────┐    │
│  │  써보신다면 — 한계까지 써보세요              │    │
│  └──────────────────────────────────────────┘    │
│                                                 │
│     [FooterCaption] 5배짜리가 월 100달러          │
└─────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Kicker | `#888`, 14px, letter-spacing |
| Headline | white + green bold ("Max") — RichText |
| 카드 1 (1x) | `border: #333`, `bg: #111`, borderRadius 12, 가장 낮은 티어 |
| 카드 2 (5x) | `border: #555`, `bg: #111`, borderRadius 12, 중간 티어 |
| 카드 3 (20x) | `border: #39FF14`, `bg: #0d1f0d`, borderRadius 12, 최고 티어 |
| 배율 숫자 (StatNumber) | 카드1,2: white 36px bold / 카드3: `#39FF14` 36px bold |
| ProgressBar | 카드1: `#333` 낮음 / 카드2: `#888` 중간 / 카드3: `#39FF14` 가득참 |
| 카드 하단 좌 라벨 | white 14px bold (플랜명) |
| 카드 하단 우 라벨 | `#888` 14px (가격) |
| CTA Pill | `border: #39FF14`, `bg: transparent`, green text, 큰 pill, 중앙 |
| FooterCaption | white, 20px, 하단 자막 |
| 카드 각 maxWidth | 300 |
| 3열 전체 maxWidth | 1000 |

### stack_root JSON

```json
{
  "type": "SceneRoot",
  "id": "scene-root",
  "style": { "padding": 60 },
  "children": [
    {
      "type": "Kicker",
      "id": "kicker",
      "data": { "text": "9단계 — 한계까지 써보기" },
      "enterAt": 0
    },
    {
      "type": "RichText",
      "id": "headline",
      "data": {
        "segments": [
          { "text": "Claude Code ", "bold": true, "color": "#ffffff" },
          { "text": "Max", "bold": true, "color": "#39FF14" },
          { "text": " 플랜 구조", "bold": true, "color": "#ffffff" }
        ]
      },
      "style": { "fontSize": 30 },
      "enterAt": 8
    },
    {
      "type": "Stack",
      "id": "tier-row",
      "direction": "row",
      "style": { "gap": 20, "maxWidth": 1000, "width": "100%", "alignItems": "stretch" },
      "enterAt": 30,
      "children": [
        {
          "type": "FrameBox",
          "id": "card-t1",
          "style": { "flex": 1, "maxWidth": 300, "borderColor": "#333", "borderWidth": 1, "borderRadius": 12, "padding": 24, "background": "#111" },
          "enterAt": 30,
          "children": [
            { "type": "StatNumber", "id": "num-t1", "data": { "value": "1x", "size": "lg" }, "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 700 }, "enterAt": 30 },
            { "type": "ProgressBar", "id": "bar-t1", "data": { "value": 10, "maxValue": 100 }, "style": { "color": "#333", "maxWidth": 260 }, "enterAt": 36 },
            {
              "type": "Stack", "id": "label-t1", "direction": "row",
              "style": { "justifyContent": "space-between", "width": "100%", "marginTop": 8 },
              "enterAt": 36,
              "children": [
                { "type": "BodyText", "id": "plan-t1", "data": { "text": "Pro" }, "style": { "color": "#ffffff", "fontSize": 14, "fontWeight": 700 }, "enterAt": 36 },
                { "type": "BodyText", "id": "price-t1", "data": { "text": "기본" }, "style": { "color": "#888", "fontSize": 14 }, "enterAt": 36 }
              ]
            }
          ]
        },
        {
          "type": "FrameBox",
          "id": "card-t2",
          "style": { "flex": 1, "maxWidth": 300, "borderColor": "#555", "borderWidth": 1, "borderRadius": 12, "padding": 24, "background": "#111" },
          "enterAt": 42,
          "children": [
            { "type": "StatNumber", "id": "num-t2", "data": { "value": "5x", "size": "lg" }, "style": { "color": "#ffffff", "fontSize": 36, "fontWeight": 700 }, "enterAt": 42 },
            { "type": "ProgressBar", "id": "bar-t2", "data": { "value": 50, "maxValue": 100 }, "style": { "color": "#888", "maxWidth": 260 }, "enterAt": 48 },
            {
              "type": "Stack", "id": "label-t2", "direction": "row",
              "style": { "justifyContent": "space-between", "width": "100%", "marginTop": 8 },
              "enterAt": 48,
              "children": [
                { "type": "BodyText", "id": "plan-t2", "data": { "text": "Max 5x" }, "style": { "color": "#ffffff", "fontSize": 14, "fontWeight": 700 }, "enterAt": 48 },
                { "type": "BodyText", "id": "price-t2", "data": { "text": "월 $100" }, "style": { "color": "#888", "fontSize": 14 }, "enterAt": 48 }
              ]
            }
          ]
        },
        {
          "type": "FrameBox",
          "id": "card-t3",
          "style": { "flex": 1, "maxWidth": 300, "borderColor": "#39FF14", "borderWidth": 1, "borderRadius": 12, "padding": 24, "background": "#0d1f0d" },
          "enterAt": 54,
          "children": [
            { "type": "StatNumber", "id": "num-t3", "data": { "value": "20x", "size": "lg" }, "style": { "color": "#39FF14", "fontSize": 36, "fontWeight": 700 }, "enterAt": 54 },
            { "type": "ProgressBar", "id": "bar-t3", "data": { "value": 100, "maxValue": 100 }, "style": { "color": "#39FF14", "maxWidth": 260 }, "enterAt": 60 },
            {
              "type": "Stack", "id": "label-t3", "direction": "row",
              "style": { "justifyContent": "space-between", "width": "100%", "marginTop": 8 },
              "enterAt": 60,
              "children": [
                { "type": "BodyText", "id": "plan-t3", "data": { "text": "Max 20x" }, "style": { "color": "#ffffff", "fontSize": 14, "fontWeight": 700 }, "enterAt": 60 },
                { "type": "BodyText", "id": "price-t3", "data": { "text": "월 $200" }, "style": { "color": "#888", "fontSize": 14 }, "enterAt": 60 }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Pill",
      "id": "cta-pill",
      "data": { "label": "써보신다면 — 한계까지 써보세요" },
      "style": { "borderColor": "#39FF14", "color": "#39FF14", "background": "transparent", "fontSize": 16, "paddingLeft": 32, "paddingRight": 32, "paddingTop": 12, "paddingBottom": 12 },
      "enterAt": 78
    },
    {
      "type": "FooterCaption",
      "id": "footer",
      "data": { "text": "5배짜리가 월 100달러" },
      "enterAt": 96
    }
  ]
}
```

### 적용 규칙

- **가격/용량/등급 티어 비교** 씬에 적용 — 3단계 플랜, 요금제, 성능 단계
- 3열 카드: 좌→우로 갈수록 **border 밝아짐** (#333 → #555 → #39FF14) — 시각적 등급 상승
- **최고 티어만 green border + green tint bg + green 숫자** — 추천/강조 표시
- ProgressBar로 용량/배율 시각화: 낮음(#333) → 중간(#888) → 가득참(#39FF14)
- 카드 내부 구조: StatNumber(배율) → ProgressBar → Stack(row)[플랜명 + 가격]
- CTA Pill: green border outline, transparent bg — 액션 유도 메시지 (버튼 느낌)
- REF-004(3열 Grid 카드)와 유사하나, **ProgressBar + 가격 라벨 + 등급 색상 차등**이 핵심 차이
- 카드 등장 시차: 12프레임 간격으로 좌→우 순차 — 티어가 올라가는 느낌
- enterAt: Kicker(0) → RichText HL(8) → 카드1(30) → 카드2(42) → 카드3(54) → CTA(78) → Footer(96)

---

## REF-069: 비유 비포/애프터 — 일러스트 카드 + 화살표 + 모션 아이콘 + InsightTile

### 구조 (ASCII)

```
┌─────────────────────────────────────────────────┐
│          차를 처음 샀을 때 (Headline)              │
│                                                 │
│     주차장에서만          →      고속도로까지       │
│  ┌─ #333 border ────┐       ┌─ green border ──┐ │
│  │  P               │       │          MAX    │ │
│  │  🚗 ░░ ░░        │  →    │   🚗─ ─ ─ ─ →  │ │
│  │  (주차 슬롯 목업)  │       │  (도로 목업)     │ │
│  └──────────────────┘       └─────────────────┘ │
│  성능을 다 못 본다             진짜 능력이 보인다    │
│                                                 │
│  ┌─ green border pill ────────────────────────┐  │
│  │ 뭘 맡기고 뭘 해야 하는지 → 명확해져요         │  │
│  └────────────────────────────────────────────┘  │
│  Claude Code의 진짜 능력 + 한계를 동시에 파악       │
│                                                 │
│     [FooterCaption] 알게 되는 것도 중요해요         │
└─────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Headline | white, 28px, bold, 중앙 |
| 좌 라벨 "주차장에서만" | `#aaa`, 15px |
| 우 라벨 "고속도로까지" | `#39FF14`, 15px, underline |
| 좌 카드 | `border: #333`, `bg: #111`, borderRadius 12, 160×120 비율 |
| 우 카드 | `border: #39FF14`, `bg: #0d1f0d`, borderRadius 12 |
| 좌 카드 내부 | 자동차 아이콘(gray) + 주차 슬롯 목업(FrameBox×2 gray 사각형) + "P" 텍스트 |
| 우 카드 내부 | 자동차 아이콘(green) + 파선 도로(dashed line) + "MAX" Badge |
| 자동차 아이콘 우측 | **slide-right 모션** — 좌→우 이동 애니메이션 |
| ArrowConnector | green `#39FF14`, 카드 사이 |
| 좌 캡션 | `#aaa`, 14px, 중앙 |
| 우 캡션 | `#39FF14`, 14px, 중앙 |
| CTA Pill | `border: #39FF14`, transparent bg, green text |
| InsightTile 텍스트 | `#888`, 14px |
| FooterCaption | white, 20px |
| Split 전체 maxWidth | 900 |

### stack_root JSON

```json
{
  "type": "SceneRoot",
  "id": "scene-root",
  "style": { "padding": 60 },
  "children": [
    {
      "type": "Headline",
      "id": "headline",
      "data": { "text": "차를 처음 샀을 때", "size": "md" },
      "style": { "fontSize": 28 },
      "enterAt": 0
    },
    {
      "type": "Stack",
      "id": "compare-row",
      "direction": "row",
      "style": { "gap": 24, "maxWidth": 900, "width": "100%", "alignItems": "center", "justifyContent": "center" },
      "enterAt": 24,
      "children": [
        {
          "type": "Stack",
          "id": "before-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 12, "flex": 1 },
          "enterAt": 24,
          "children": [
            {
              "type": "BodyText",
              "id": "label-before",
              "data": { "text": "주차장에서만" },
              "style": { "color": "#aaa", "fontSize": 15 },
              "enterAt": 24
            },
            {
              "type": "FrameBox",
              "id": "card-before",
              "style": { "borderColor": "#333", "borderWidth": 1, "borderRadius": 12, "padding": 24, "background": "#111", "maxWidth": 360, "width": "100%", "minHeight": 120 },
              "enterAt": 30,
              "children": [
                {
                  "type": "Stack",
                  "id": "parking-layout",
                  "direction": "row",
                  "style": { "alignItems": "center", "gap": 12, "justifyContent": "flex-start", "width": "100%" },
                  "enterAt": 30,
                  "children": [
                    { "type": "Icon", "id": "car-before", "data": { "name": "car", "size": 36 }, "style": { "color": "#888" }, "enterAt": 30 },
                    { "type": "FrameBox", "id": "slot-1", "style": { "borderColor": "#444", "borderWidth": 1, "background": "#1a1a1a", "width": 40, "height": 50, "borderRadius": 4 }, "enterAt": 36, "children": [] },
                    { "type": "FrameBox", "id": "slot-2", "style": { "borderColor": "#444", "borderWidth": 1, "background": "#1a1a1a", "width": 40, "height": 50, "borderRadius": 4 }, "enterAt": 36, "children": [] }
                  ]
                },
                {
                  "type": "Badge",
                  "id": "p-badge",
                  "data": { "label": "P" },
                  "style": { "color": "#555", "background": "transparent", "position": "absolute", "top": 8, "right": 12, "fontSize": 16 },
                  "enterAt": 30
                }
              ]
            },
            {
              "type": "BodyText",
              "id": "caption-before",
              "data": { "text": "성능을 다 못 본다" },
              "style": { "color": "#aaa", "fontSize": 14 },
              "enterAt": 42
            }
          ]
        },
        {
          "type": "ArrowConnector",
          "id": "arrow-mid",
          "data": { "direction": "right" },
          "style": { "color": "#39FF14" },
          "enterAt": 48
        },
        {
          "type": "Stack",
          "id": "after-col",
          "direction": "column",
          "style": { "alignItems": "center", "gap": 12, "flex": 1 },
          "enterAt": 54,
          "children": [
            {
              "type": "BodyText",
              "id": "label-after",
              "data": { "text": "고속도로까지" },
              "style": { "color": "#39FF14", "fontSize": 15, "textDecoration": "underline" },
              "enterAt": 54
            },
            {
              "type": "FrameBox",
              "id": "card-after",
              "style": { "borderColor": "#39FF14", "borderWidth": 1, "borderRadius": 12, "padding": 24, "background": "#0d1f0d", "maxWidth": 360, "width": "100%", "minHeight": 120 },
              "enterAt": 60,
              "children": [
                {
                  "type": "Badge",
                  "id": "max-badge",
                  "data": { "label": "MAX" },
                  "style": { "color": "#39FF14", "background": "#0d1f0d", "borderColor": "#39FF14", "fontWeight": 700, "position": "absolute", "top": 12, "right": 12 },
                  "enterAt": 60
                },
                {
                  "type": "Stack",
                  "id": "road-layout",
                  "direction": "row",
                  "style": { "alignItems": "center", "gap": 8, "width": "100%" },
                  "enterAt": 66,
                  "children": [
                    {
                      "type": "Icon",
                      "id": "car-after",
                      "data": { "name": "car", "size": 36 },
                      "style": { "color": "#39FF14" },
                      "enterAt": 66,
                      "motion": { "preset": "slide-right" }
                    },
                    {
                      "type": "Divider",
                      "id": "road-line",
                      "style": { "color": "#39FF14", "borderStyle": "dashed", "flex": 1, "opacity": 0.5 },
                      "enterAt": 66
                    }
                  ]
                }
              ]
            },
            {
              "type": "BodyText",
              "id": "caption-after",
              "data": { "text": "진짜 능력이 보인다" },
              "style": { "color": "#39FF14", "fontSize": 14 },
              "enterAt": 72
            }
          ]
        }
      ]
    },
    {
      "type": "Pill",
      "id": "cta-pill",
      "data": { "label": "뭘 맡기고 뭘 해야 하는지 → 명확해져요" },
      "style": { "borderColor": "#39FF14", "color": "#39FF14", "background": "transparent", "fontSize": 16, "paddingLeft": 28, "paddingRight": 28, "paddingTop": 10, "paddingBottom": 10 },
      "enterAt": 84
    },
    {
      "type": "BodyText",
      "id": "insight-text",
      "data": { "text": "Claude Code의 진짜 능력 + 한계를 동시에 파악" },
      "style": { "color": "#888", "fontSize": 14 },
      "enterAt": 96
    },
    {
      "type": "FooterCaption",
      "id": "footer",
      "data": { "text": "알게 되는 것도 중요해요" },
      "enterAt": 108
    }
  ]
}
```

### 적용 규칙

- **비유 기반 전환 — 제한된 환경 → 해방된 환경** 씬에 적용
- 좌 카드: gray 일러스트 목업 (제한적 상황) — 아이콘 + 간단한 도형으로 장면 구성
- 우 카드: green 일러스트 목업 (확장된 상황) — **아이콘에 slide-right 모션** 적용
- **슬라이드 모션 핵심**: 우측 카드의 자동차 아이콘이 `slide-right` 프리셋으로 좌→우 이동 — 속도감/진행감 표현
- 카드 내부를 FrameBox + Icon + Divider(dashed)로 **미니 일러스트** 구성 — 복잡한 SVG 없이 노드 조합으로 장면 묘사
- 좌 카드 목업: 자동차 + 빈 사각형(주차 슬롯) + "P" Badge → 주차장
- 우 카드 목업: 자동차(모션) + dashed Divider(도로선) + "MAX" Badge → 고속도로
- REF-048(부정→긍정 전환)과 유사하나, **카드 내부가 텍스트가 아닌 아이콘 일러스트 조합**
- 카드 아래 캡션: 좌=gray(문제), 우=green(해결) — 색상 코딩 일관
- CTA Pill + 부가 설명 텍스트(gray) — 2단 요약
- enterAt: HL(0) → 좌카드(24~42) → 화살표(48) → 우카드(54~72) → CTA(84) → 부가설명(96) → Footer(108)
- **모션 주의**: `slide-right`은 Remotion `translateX` 인터폴레이션 — 카드 영역 내에서 좌→우 이동

---

## REF-070: 스텝 Badge + 원형 이미지 히어로 + 키워드 Headline + 부제

### 구조 (ASCII)

```
┌─────────────────────────────────────────────────┐
│              [STEP 10] (Badge pill)              │
│                                                 │
│              ┌────────────┐                      │
│              │  ◯ 원형    │ ← green border ring  │
│              │  사진 이미지│    borderRadius 50%   │
│              │            │    240×240            │
│              └────────────┘                      │
│                                                 │
│                  하니스 (Headline xl)             │
│        등산 안전줄 — 절벽에서 떨어져도 잡아주는 것    │
│                                                 │
│         [FooterCaption] 그게 하니스예요            │
└─────────────────────────────────────────────────┘
```

### 스타일 명세

| 요소 | 스타일 |
|------|--------|
| 배경 | `#000000` |
| Badge | `border: #555`, `bg: transparent`, white text, "STEP 10", borderRadius 20, 14px |
| 원형 이미지 | `borderRadius: "50%"`, `border: 3px solid #39FF14`, 240×240, `objectFit: cover` |
| Headline | white, 48px, bold, 중앙 — 단일 키워드 |
| BodyText (부제) | `#888`, 16px — 은유/비유 설명 |
| FooterCaption | white, 20px, 하단 자막 |

### stack_root JSON

```json
{
  "type": "SceneRoot",
  "id": "scene-root",
  "style": { "padding": 60 },
  "children": [
    {
      "type": "Badge",
      "id": "step-badge",
      "data": { "label": "STEP 10" },
      "style": { "borderColor": "#555", "background": "transparent", "color": "#ffffff", "fontSize": 14, "borderRadius": 20, "paddingLeft": 20, "paddingRight": 20, "paddingTop": 6, "paddingBottom": 6 },
      "enterAt": 0,
      "motion": { "preset": "scale-in" }
    },
    {
      "type": "ImageAsset",
      "id": "hero-image",
      "data": {
        "src": "images/{projectId}/harness.jpg",
        "alt": "안전 하니스를 착용한 작업자",
        "objectFit": "cover",
        "rounded": true,
        "shadow": true,
        "maxHeight": 240
      },
      "style": {
        "width": 240,
        "height": 240,
        "borderRadius": "50%",
        "borderColor": "#39FF14",
        "borderWidth": 3,
        "overflow": "hidden"
      },
      "enterAt": 12,
      "motion": { "preset": "scale-in" }
    },
    {
      "type": "Headline",
      "id": "headline",
      "data": { "text": "하니스", "size": "xl" },
      "style": { "fontSize": 48 },
      "enterAt": 30
    },
    {
      "type": "BodyText",
      "id": "subtitle",
      "data": { "text": "등산 안전줄 — 절벽에서 떨어져도 잡아주는 것" },
      "style": { "color": "#888", "fontSize": 16 },
      "enterAt": 42
    },
    {
      "type": "FooterCaption",
      "id": "footer",
      "data": { "text": "그게 하니스예요" },
      "enterAt": 60
    }
  ]
}
```

### 적용 규칙

- **개념 정의 히어로 — 단일 키워드 + 비유 이미지** 씬에 적용
- 최소 요소, 최대 임팩트 — Badge + 원형 이미지 + 큰 Headline + 부제만으로 구성
- **원형 이미지**: `borderRadius: "50%"` + green border ring — 프로필/개념 사진 강조
- ImageAsset `rounded: true` + green borderColor로 원형 프레임 구현
- Badge는 스텝 번호 표시 — `"STEP N"` 형태, border pill 스타일
- Headline은 **한 단어 키워드** (48px xl) — 정의할 개념명
- BodyText는 **비유/은유 한 줄 설명** — em dash(—)로 구분
- REF-053(등식 Headline + 큰 아이콘)과 유사하나, **아이콘 대신 실사 이미지**가 핵심 차이
- 이미지가 없으면 Icon(size:100, glow)으로 대체 가능 (REF-020 히어로 오버레이 참고)
- `scale-in` 모션: Badge와 이미지 모두 중앙에서 확대 등장 — 집중 효과
- enterAt: Badge(0) → 이미지(12) → Headline(30) → 부제(42) → Footer(60)
- **짧은 씬(5~8초)에 적합** — 요소가 적어 빠르게 전달
