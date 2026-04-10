# Video Gen Design System

> 다크 테마 + 프리미엄 퍼플 계열 형광 액센트

---

## Color Palette

### Background

| Token | Hex | 용도 |
|-------|-----|------|
| `bg-base` | `#000000` | 씬 기본 배경 |
| `bg-elevated` | `#0C0A14` | 카드, 패널 배경 |
| `bg-surface` | `#14111F` | 입력, 뱃지 배경 |
| `bg-accent-subtle` | `rgba(168, 85, 247, 0.06)` | 액센트 배경 tint |

### Text

| Token | Hex | 용도 |
|-------|-----|------|
| `text-primary` | `#FFFFFF` | 헤드라인, 강조 텍스트 |
| `text-secondary` | `rgba(255, 255, 255, 0.6)` | 서포팅 텍스트 |
| `text-muted` | `rgba(255, 255, 255, 0.38)` | 푸터, 캡션 |
| `text-accent` | `#C084FC` | 강조 토큰, kicker, 네온 텍스트 |

### Accent (Purple Neon)

| Token | Hex | 용도 |
|-------|-----|------|
| `accent` | `#A855F7` | 메인 액센트 (purple-500) |
| `accent-bright` | `#C084FC` | 밝은 액센트 (purple-400) - 텍스트용 |
| `accent-vivid` | `#D8B4FE` | 가장 밝은 (purple-300) - 숫자 강조 |
| `accent-dim` | `#7C3AED` | 어두운 액센트 (violet-600) - 보더 |
| `accent-glow` | `rgba(168, 85, 247, 0.25)` | 글로우 이펙트 |
| `accent-tint` | `rgba(168, 85, 247, 0.08)` | 미묘한 배경 틴트 |

### Border

| Token | Hex | 용도 |
|-------|-----|------|
| `border-default` | `rgba(255, 255, 255, 0.08)` | 구분선, 카드 테두리 |
| `border-accent` | `rgba(168, 85, 247, 0.4)` | 액센트 보더 |
| `border-accent-strong` | `#A855F7` | 강한 액센트 보더 (포커스 링) |

---

## Typography

| 역할 | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| **Headline XL** | Inter | 76px | 800 | 1.1 |
| **Headline L** | Inter | 52px | 800 | 1.15 |
| **Headline M** | Inter | 44px | 800 | 1.2 |
| **Kicker** | Inter | 18px | 600 | 1.0 |
| **Body L** | Inter | 28px | 400 | 1.5 |
| **Body M** | Inter | 22px | 400 | 1.6 |
| **Caption** | Inter | 17px | 400 | 1.4 |
| **Subtitle Bar** | Inter | 36px | 700 | 1.4 |

Kicker: `letter-spacing: 0.12em`, `text-transform: uppercase`

---

## Components

### Kicker Badge (pill)

```
bg: accent-tint
border: 1px solid border-accent
border-radius: 24px
padding: 6px 20px
text: accent-bright, 18px, 600
```

### Icon Circle

```
border-radius: 50%
border: 2px solid accent (또는 border-default for inactive)
bg: accent-tint (또는 bg-elevated for inactive)
box-shadow: 0 0 50px accent-glow (포커스 링 전용)
```

### Card

```
bg: bg-elevated
border: 1px solid border-default
border-radius: 20px
padding: 28px 24px
```

### Divider (horizontal)

```
height: 1px
bg: border-default
max-width: 500px (centered)
```

### Divider (vertical)

```
width: 1px
bg: border-default
```

### Subtitle Bar

```
position: absolute bottom
padding: 40px 80px 50px
bg: gradient to top (black 95% → transparent)
text: text-primary, 36px, 700
text-shadow: 0 2px 8px rgba(0,0,0,0.8)
```

---

## Spacing 원칙

- **외곽 여백**: 넉넉하게 (SceneShell padding: 60px 100px 160px)
- **내부 요소 간격**: 촘촘하게 (gap: 8~20px)
- **콘텐츠 덩어리**: 하나의 블록으로 화면 정중앙에 집중
- **헤더↔콘텐츠**: 20~36px (밀착)
- **아이콘↔텍스트**: 12~18px

---

## Motion Presets

| Preset | 용도 |
|--------|------|
| fadeUp | 기본 등장 (opacity + translateY) |
| popNumber | 스프링 스케일 (숫자, 아이콘) |
| staggerChildren | 순차 등장 (리스트 아이템) |
| drawConnector | 스케일X (화살표, 구분선) |
| popBadge | 스프링 팝 (뱃지, 태그) |
| slideSplit | 좌우 슬라이드 (분할 레이아웃) |

---

## 적용 파일

| 파일 | 역할 |
|------|------|
| `src/remotion/common/theme.ts` | 디자인 토큰 상수 |
| `src/remotion/common/SceneShell.tsx` | 공통 래퍼 (배경 + 자막) |
| `src/remotion/common/SubtitleBar.tsx` | 하단 자막 |
| `src/remotion/common/SvgIcons.tsx` | SVG 아이콘 (기본 색상: accent) |
| `src/remotion/layouts/*.tsx` | 각 레이아웃 컴포넌트 |
