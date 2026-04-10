# Expert-to-Skill Platform — Claude Code 기반 스킬 실행 시스템

## 핵심 철학

> **전문가의 판단을 SKILL.md로 코드화하고, Claude Code가 그 전문가처럼 실행한다.**

상세 철학 → [docs/core-philosophy.md](docs/core-philosophy.md)

1. **스킬 = 전문가의 SOP** — "이 분야 전문가라면 어떤 순서로 판단하는가"를 SKILL.md에 담는다
2. **확인 없이 실행** — 트리거 후 중간에 묻지 않는다. 불명확한 부분은 기본값으로 처리 후 결과 보고
3. **스킬은 조합된다** — 출력이 다음 스킬의 입력. 인터페이스를 맞추는 것이 설계의 핵심
4. **도메인별 독립 확장** — 새 기능은 새 프리픽스로. 기존 스킬에 욱여넣지 않는다
5. **자기 개선** — `/auto-research`로 평가 지표 기반 반복 실험, SKILL.md 자동 고도화

---

## 프로젝트 개요

전문가의 노하우를 SKILL.md로 코드화하고, Claude Code + MCP로 실행하는 플랫폼.
스킬은 `.claude/skills/{name}/SKILL.md`에 위치하며 `/name` 명령어로 호출된다.

**스킬 명명 규칙**: `{프리픽스}-{기능}` (예: `reat-layout`, `pptx-generate`)

| 프리픽스 | 도메인 |
|---------|--------|
| `reat-*` | 영상 생성 (Remotion + AI) |
| `pptx-*` | 프레젠테이션 |
| `pixl-*` | 픽셀아트 |
| `obsi-*` | Obsidian 노트 |
| `down-*` | 미디어 다운로드 |

기술 아키텍처 상세 → [docs/03-architecture.md](docs/03-architecture.md)
전체 스킬 목록 → `/help-skill`

---

## 폴더 구조

```
input/
├── reat/       ← mp3, srt (reat-new/reat-voice용 입력)
├── pptx/       ← PDF, 이미지 (pptx-generate 입력)
├── pixl/       ← 사진/이미지 (pixl-* 입력)
├── hwpx/       ← hwp/hwpx 템플릿 (hwpx-skill 입력)
└── shot/       ← 쇼츠 기획 참고자료

output/
├── reat/       ← 렌더링된 mp4
├── pptx/       ← 생성된 .pptx
├── pixl/       ← 픽셀아트 결과물 (캐릭터별 서브폴더)
├── down/       ← 다운로드 영상
│   ├── youtube/
│   ├── instagram/
│   └── threads/
├── hwpx/       ← 생성된 .hwpx
└── shot/       ← shot-wrighter 대본

data/           ← reat 프로젝트 중간 데이터 ({projectId}/ 별로 관리)
temp/           ← 휘발성 작업 공간 (작업 후 정리)
public/         ← Remotion 정적 파일 (mp3, assets/)
```

---

## 영상 도메인 (reat-*) 핵심 참조

### 핵심 경로
| 역할 | 경로 |
|------|------|
| 렌더 진입 | `src/remotion/index.ts` → `Root.tsx` → `Composition.tsx` |
| 재귀 노드 렌더러 | `src/remotion/common/StackRenderer.tsx` |
| 씬 라우터 | `src/remotion/common/SceneRenderer.tsx` |
| 노드 등록 | `src/remotion/nodes/registry.ts` |
| 타입 정의 | `src/types/stack-nodes.ts`, `src/types/index.ts` |
| 테마/팔레트 | `src/remotion/common/theme.ts` |
| 프로젝트 데이터 | `data/{projectId}/scenes-v2.json`, `render-props-v2.json` |
| 에셋 매니페스트 | `public/assets/manifest.json` |

### 렌더 명령어
```bash
npx remotion render MainComposition output/reat/{name}.mp4 --props=data/{projectId}/render-props-v2.json --concurrency=4
```

### 노드 시스템
모든 씬 레이아웃은 **StackNode 재귀 트리** 하나로 표현된다. 렌더러는 `StackRenderer.tsx` 단 하나.
- **컨테이너 9종**: SceneRoot, Stack, Grid, Split, Overlay, AnchorBox, SafeArea, FrameBox, ScatterLayout
- **Leaf 27종**: 텍스트(8) · 도형(4) · 미디어(3) · 차트(3) · 복합카드(6) · 커넥터(2) · 악센트(3)
- **모션 14종**: fadeUp, fadeIn, popNumber, staggerChildren, countUp, wipeBar 등

### CSS 핵심 규칙 (위반 시 레이아웃 깨짐)
| 규칙 | 이유 |
|------|------|
| `SceneRoot`: `alignItems: "center"` | stretch 하면 inline-block 요소 깨짐 |
| 컨테이너: `width: "100%"` | 없으면 콘텐츠 크기로 축소됨 |
| 단일 카드: `maxWidth ≤ 520px` | 화면 가득 차면 레이아웃 어색 |
| SceneRoot gap: `max 28` | 과도한 간격 방지 |

---

## 필수 지침

### 1. 워크스페이스 청결 유지

작업 중 생성한 임시 파일은 사용 후 즉시 삭제한다.

- **삭제**: 테스트용 스크립트, one-off 스크립트, 검증용 임시 파일
- **보존**: 재사용 가능한 스크립트, `output/` 결과물, 매번 재생성되는 파일

작업 완료 시 `temp/` 폴더를 확인하고 불필요한 파일을 정리한다.

### 2. 소통

한글 존댓말로 소통한다.
