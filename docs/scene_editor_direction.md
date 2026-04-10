# 장면 편집 도구 — 기술 방향 제안

## 현재 아키텍처 요약

분석 대상: [types/index.ts](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts) | [SceneRenderer.tsx](file:///Users/futurewave/Documents/dev/videogen2/src/components/SceneRenderer.tsx) | [SceneWrapper.tsx](file:///Users/futurewave/Documents/dev/videogen2/src/components/SceneWrapper.tsx)

```
현재 렌더링 파이프라인 (SceneRenderer 4-tier fallback):
┌─────────────────┐
│  StackGrammar   │ ← stackPlan 있으면 우선 사용
│  (slot 기반)    │
├─────────────────┤
│  VisualPlan     │ ← visualPlan 있으면 사용
│  (zone/object)  │
├─────────────────┤
│  Composition    │ ← layoutStrategy 기반
│  Engine         │
├─────────────────┤
│  Legacy 15종    │ ← sceneType 기반 고정 컴포넌트
└─────────────────┘
```

| 시스템 | 배치 모델 | 특징 |
|--------|----------|------|
| **StackGrammar** | 슬롯 기반 스택 | `StackDefinition[] → SlotDefinition[]` 적층 |
| **VisualPlan** | Zone + Object | [SkeletonZoneDefinition(x,y,w,h)](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#414-423) + [VisualObject(anchor, stackOrder)](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#589-606) |
| **Legacy Templates** | 하드코딩 Flex | 15개 고정 JSX 컴포넌트 |

---

## 핵심 질문: 스택 vs 절대 좌표

### 결론: **하이브리드 — Zone 레벨은 절대 좌표, Zone 내부는 스택**

이유:

| 기준 | 순수 스택 | 순수 절대좌표 | **하이브리드 (제안)** |
|------|----------|-------------|-------------------|
| 편집 직관성 | ✅ 드래그 순서만 변경 | ⚠️ 겹침·정렬 수동 관리 | ✅ Zone 드래그 + 내부 자동 정렬 |
| 반응형 대응 | ✅ 자동 리플로우 | ❌ 해상도별 수동 조정 | ✅ Zone 비율 유지, 내부 리플로우 |
| 미세 배치 제어 | ❌ 제한적 | ✅ 픽셀 단위 | ✅ Zone 위치는 자유, 내부는 스택 |
| 기존 호환성 | ⚠️ VisualPlan 비호환 | ⚠️ StackPlan 비호환 | ✅ 둘 다 호환 |
| 템플릿 재사용 | ✅ 구조 보존 | ⚠️ 절대값은 재사용 어려움 | ✅ Zone 비율로 템플릿화 |

현재 프로젝트에 이미 이 하이브리드가 존재합니다:
- [SkeletonZoneDefinition](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#414-423)은 **비율 기반 절대 좌표** (`x, y, w, h` — 0~1 비율)
- Zone 내부 `layout`은 **스택** (`"single" | "stack" | "columns" | "grid"`)

---

## 1. 장면 편집 도구

### 제안 아키텍처

```
┌──────────────────────────────────────────────────┐
│  Scene Editor (Next.js 페이지)                    │
│                                                   │
│  ┌─────────────────────┐  ┌──────────────────┐   │
│  │  Preview Canvas     │  │  Property Panel   │   │
│  │  (Remotion Player)  │  │  (React Form)     │   │
│  │                     │  │                   │   │
│  │  ┌───┐ ┌───┐      │  │  - 텍스트 편집    │   │
│  │  │ Z1│ │ Z2│      │  │  - 폰트 크기     │   │
│  │  │   │ │   │      │  │  - 정렬 (H/V)    │   │
│  │  └───┘ └───┘      │  │  - 이모지 선택    │   │
│  │  ┌───────────┐     │  │  - layout 변경    │   │
│  │  │    Z3     │     │  │  - 색상/톤       │   │
│  │  └───────────┘     │  │                   │   │
│  └─────────────────────┘  └──────────────────┘   │
│                                                   │
│  ┌───────────────────────────────────────────┐   │
│  │  Slide Strip (하단 장면 목록)               │   │
│  │  [S1] [S2] [S3] [S4] ... [Sn]            │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### 기술 스택 방향

| 계층 | 선택지 | 근거 |
|------|--------|------|
| **프리뷰 렌더링** | `@remotion/player` (인브라우저) | 현재 Remotion 컴포넌트를 **그대로 재사용** — 실제 렌더 결과를 WYSIWYG로 확인 |
| **편집 인터랙션** | React 드래그 라이브러리 (`react-dnd` 또는 `@dnd-kit`) | Zone 리사이즈·이동, 슬롯 순서 변경 |
| **속성 편집 패널** | React Hook Form + Zustand 상태 관리 | [Scene](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#716-749) JSON을 실시간 패치 → Player 리렌더 |
| **슬라이드 스트립** | 가로 스크롤 썸네일 리스트 | 장면 선택·순서 변경·삭제 |

### 편집 가능 속성 매핑

현재 [Scene](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#716-749) 타입에서 편집 도구가 제어할 수 있는 속성:

```
Scene.sceneType      → 드롭다운 (15종)
Scene.layoutStrategy → 드롭다운 (scene_type별 허용 목록 STRATEGY_ALLOWED)
Scene.motionPreset   → 드롭다운 (8종)
Scene.transition     → 드롭다운 + duration 슬라이더

StackPlan.layout_family    → 라디오 (4종)
StackPlan.stacks[].slots[] → 슬롯 순서 드래그, 내용 인라인 편집
StackPlan.active_stack_index → 클릭으로 활성 스택 변경

VisualPlan.objectPlan[]  → 오브젝트 선택, zone/anchor 변경, 내용 편집
VisualPlan.zonePlan      → Zone 위치·크기 드래그 (비율 좌표)
```

---

## 2. 캔바 스타일 템플릿 시스템

### 현재 상태

- [templates.json](file:///Users/futurewave/Documents/dev/videogen2/src/data/templates.json): 150개 레이아웃 정의 존재하나, **레이아웃 메타데이터만** 보유 (컴포넌트 코드·배치 정보 미포함)
- [SceneTemplate](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#750-759) 타입이 이미 존재: `{ id, name, layoutType, componentCode, thumbnail, tags }`

### 제안: 2-Tier 템플릿

```
Template Tier 1: 레이아웃 프리셋 (현재 존재)
├── "title_card" + "centered_hero" = 기본 배치 규칙
└── templates.json의 150개 레이아웃 메타데이터

Template Tier 2: 「완성형 씬 스냅샷」 (추가 필요)
├── Scene JSON의 전체 스냅샷 (stackPlan/visualPlan 포함)
├── 썸네일 이미지 (Remotion으로 1프레임 캡처)
└── 카테고리·태그로 검색
```

### 적용 흐름

```
사용자가 템플릿 갤러리에서 선택
        │
        ▼
Template의 layoutStrategy + stackPlan/visualPlan을 현재 씬에 머지
        │
        ▼
텍스트 내용(subtitles, keywords)은 현재 씬 것 유지
배치·스타일만 템플릿에서 덮어쓰기
        │
        ▼
@remotion/player로 즉시 미리보기
```

### 구현 방향

| 항목 | 방향 |
|------|------|
| 템플릿 저장 포맷 | [Scene](file:///Users/futurewave/Documents/dev/videogen2/src/types/index.ts#716-749) JSON 서브셋 (`stackPlan` + `visualPlan` + `layoutStrategy` + `motionPreset`) |
| 갤러리 UI | 카드 그리드 + 카테고리 필터 (현재 templates.json의 keywords 활용) |
| 썸네일 생성 | `npx remotion still`로 1프레임 PNG 캡처 → `/public/templates/` 저장 |
| 컨텐츠 분리 | 템플릿 적용 시 **구조(레이아웃)만 머지, 컨텐츠(자막·키워드)는 보존** |

---

## 3. 장면 배치 정보의 저장

### 제안: [scenes.json](file:///Users/futurewave/Documents/dev/videogen2/src/data/scenes.json) 인라인 + `scene-overrides.json` 분리

```
저장 전략:
┌─────────────────────────────────────────────┐
│  scenes.json (파이프라인 출력물, 읽기 전용)    │
│  └── AI 에이전트가 생성한 원본 데이터         │
├─────────────────────────────────────────────┤
│  scene-overrides.json (사용자 편집, 쓰기)     │
│  └── 사용자가 편집기에서 수정한 diff만 저장    │
│      { "scene-3": { "layoutStrategy": ...,  │
│        "stackPlan": { ... } } }             │
├─────────────────────────────────────────────┤
│  런타임 머지                                  │
│  └── scenes.json + overrides → merged scenes │
└─────────────────────────────────────────────┘
```

### 이 구조의 장점

| 장점 | 설명 |
|------|------|
| **비파괴 편집** | AI 원본을 보존하면서 사용자 편집을 오버레이 |
| **리셋 가능** | override 삭제 → 원본 복원 |
| **Git 친화적** | 22K 라인 원본 diff 대신, 변경분만 커밋 |
| **충돌 최소화** | AI가 원본을 재생성해도 사용자 커스텀 유지 가능 |

### 저장 형식

```typescript
// scene-overrides.json
interface SceneOverrides {
  version: "1.0";
  overrides: Record<string, Partial<Scene>>; // sceneId → 변경된 필드만
  templateBindings?: Record<string, string>; // sceneId → templateId
  lastModified: string; // ISO timestamp
}
```

---

## 구현 우선순위 제안

```
Phase 1: 읽기 전용 프리뷰 (빠른 가치 확인)
├── @remotion/player로 장면별 슬라이드 뷰
├── 하단 Strip에서 장면 선택·탐색
└── 장면 속성 표시 (readonly)

Phase 2: 속성 편집 (핵심 기능)
├── layoutStrategy, motionPreset, transition 드롭다운
├── StackPlan 슬롯 내용 인라인 편집
├── scene-overrides.json 저장/로드
└── Undo/Redo 스택

Phase 3: 비주얼 편집 + 템플릿 (고급)
├── Zone 드래그·리사이즈
├── 템플릿 갤러리 + 적용
├── 썸네일 자동 생성
└── 이모지·아이콘 배치 편집
```

---

## 기술적 리스크 및 고려사항

| 리스크 | 설명 | 완화 방안 |
|--------|------|----------|
| **Remotion Player 성능** | 모든 장면을 동시에 프리뷰하면 메모리 폭발 | 현재 선택된 1개만 Player 렌더, Strip은 정적 썸네일 |
| **편집 ↔ 파이프라인 충돌** | AI가 scenes.json 재생성하면 사용자 편집 소실 | overrides 레이어가 이를 해결 |
| **StackPlan vs VisualPlan 이중 시스템** | 편집 대상이 둘 중 어느 것인지 혼란 | 편집기에서는 StackPlan 우선, VisualPlan은 고급 탭에서 노출 |
| **1920×1080 WYSIWYG** | 편집기 캔버스를 실제 해상도로 표시하면 화면 공간 부족 | `transform: scale(0.5)` 등으로 축소 프리뷰 |
