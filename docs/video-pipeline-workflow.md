# 영상 제작 파이프라인

> SRT 자막 + 음성 파일 하나로 교육 영상을 자동 생성하는 전체 과정

## 전체 흐름도

```
input/
  가치 노동.mp3
  가치 노동.srt
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ Step 1. /reat-new — 프로젝트 자동 생성                      │  [자동]
│   input/ 스캔 → 프로젝트 생성 → beats.json                │
└───────────────────────┬──────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ Step 2. /chunk 에디터 — 씬 경계 편집                      │  [수동]
│   웹 UI에서 자막 사이를 클릭하여 씬 분리                    │
│   저장 → chunks.json + scenes-v2.json 자동 생성            │
└───────────────────────┬──────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ Step 3. /reat-layout — AI 레이아웃 생성                     │  [자동]
│   각 씬에 stack_root JSON 트리 생성 (44개 노드 자유 조합)   │
│   + 후처리 4단계 (enterAt/gap/padding/갭재분배)            │
│   + render-props-v2.json 동기화                           │
└───────────────────────┬──────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ Step 4. /reat-render — Remotion mp4 렌더링                  │  [자동]
│   → output/{projectId}.mp4                                │
└───────────────────────┬──────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ Step 5. 피드백 루프                                       │  [반복]
│   영상 확인 → 수정 요청 → Step 3~4 반복                    │
└──────────────────────────────────────────────────────────┘
```

## 빠른 시작

```bash
# 1. input/ 폴더에 mp3 + srt 넣기
# 2. Claude Code에서:
> /reat-new

# 3. 웹 브라우저에서 씬 편집:
#    http://localhost:3001/chunk?projectId=value-labor

# 4. 편집 저장 후:
> /reat-layout value-labor
> /reat-render value-labor
```

---

## Step 1. /reat-new — 프로젝트 자동 생성

### 트리거

- "새 더빙 넣었어", "새 프로젝트", "새 영상" 등의 키워드
- 또는 `/reat-new` 직접 호출

### 동작

| 순서 | 동작 | 생성 파일 |
|------|------|----------|
| 1 | `input/` 폴더에서 mp3+srt 쌍 스캔 | — |
| 2 | 프로젝트 ID 자동 생성 (파일명 → kebab-case) | — |
| 3 | 디렉토리 생성 + 파일 복사 | `data/{id}/project.json` |
| | SRT → `data/{id}/` | `data/{id}/{name}.srt` |
| | 오디오 → `public/` | `public/{name}.mp3` |
| 4 | SRT 파싱 → beats.json | `data/{id}/beats.json` |

### 프로젝트 ID 규칙

- 한글 파일명: 의미 기반 영문 번역 (`"가치 노동"` → `value-labor`)
- 영문 파일명: 소문자 kebab-case (`"RAG4"` → `rag4`)
- 기존 ID 충돌 시 숫자 접미사 (`rag4-2`)

### 완료 시 출력

```
✅ 프로젝트 'value-labor' 생성 완료
- 자막: 250개, 11분 39초
- 다음 단계: http://localhost:3001/chunk?projectId=value-labor 에서 씬 편집
```

---

## Step 2. /chunk 에디터 — 씬 경계 편집

### 접속

```
http://localhost:3001/chunk?projectId={projectId}
```

대시보드(`/`)의 각 프로젝트 카드에 **Chunk** 버튼이 있습니다.

### 사용법

1. 자막 목록이 시간순으로 표시됨
2. **자막 사이를 클릭**하면 보라색 씬 경계선이 추가/제거됨
3. 하단에 씬 수와 각 씬 길이가 실시간으로 표시됨
4. **저장 버튼**을 누르면:
   - `chunks.json` 저장 (씬 경계 정보)
   - `scenes-v2.json` 자동 생성 (렌더링용 씬 데이터)
   - `project.json` 상태 → `"scened"`

### 씬 분할 가이드

| 권장 씬 길이 | 내용 |
|-------------|------|
| 5~15초 | 단일 개념, 한 문장 요약 |
| 15~30초 | 주요 설명, 예시 포함 |
| 30~60초 | 복합 주제, 비교/대조 |
| 60초 이상 | 가급적 분할 권장 |

- 10분 영상 기준 약 20~30씬이 적당
- 의미 단위로 끊기 (화제 전환, 새 개념 시작점)
- 인트로/아웃트로는 짧게 (5~10초)

---

## Step 3. /reat-layout — AI 레이아웃 생성

### 호출

```
> /reat-layout {projectId}
> /reat-layout value-labor --scene 3    # 특정 씬만
```

### 동작

1. `scenes-v2.json` 읽기
2. 각 씬의 `copy_layers`, `chunk_metadata`, `assets` 분석
3. 26종 아키타입(A-Z) 중 최적 선택
4. 44개 노드(36 leaf + 8 container) 자유 조합하여 `stack_root` 트리 생성
5. 후처리 파이프라인 4단계 실행
6. `render-props-v2.json` 동기화

### 레이아웃 아키타입 (A-Z)

| 코드 | 이름 | 주요 노드 | 용도 |
|------|------|----------|------|
| A | 히어로 오버레이 | Overlay + Icon + Headline | 인트로/아웃트로 |
| B | 풀블리드 임팩트 | Badge + Headline(xl) | 핵심 메시지 |
| C | 좌우 VS 대비 | Split + FrameBox + VerticalDivider | 비교/대조 |
| D | 3열 Grid | Grid + IconCard x3 | 분류/나열 |
| E | 수평 프로세스 플로우 | Stack(row) + ArrowConnector | 파이프라인 |
| F | FrameBox + InsightTile | FrameBox(컨테이너) + InsightTile | 문제 제기 |
| G | Warning 강조 | WarningCard + InsightTile | 경고/주의 |
| H | 인용문 중심 | QuoteText + Divider | 핵심 인용 |
| I | 수직 스텝카드 | ProcessStepCard x3 | 순서 있는 단계 |
| J | 체크리스트 | BulletList(check) | 체크항목 |
| K | 단일 IconCard | IconCard(bold) | 단일 개념 |
| L | Split 비대칭 | Split + Icon + BulletList | 시각+텍스트 |
| M | 수평 바 비교 | CompareBars | 수치 비교 |
| N | RichText + Pill | Pill x3 + RichText | 키워드 강조 |
| O | 좌우 비교 | CompareCard | 이항 비교 |
| P | 수직 타임라인 | Icon + LineConnector | 순서 흐름 |
| Q | 도넛 차트 + 태그 | RingChart + Pill | 통계/비율 |
| R | 번호 헤더 + 바 | StatNumber + ProgressBar | 챕터+수치 |
| S | 아이콘 + 3열 카드 | Icon + Grid + FrameBox | 요약 |
| T | 미니멀 전환 | Icon + Badge + BodyText | 섹션 전환 |
| U | 채팅 대화 | ChatBubble | 대화/Q&A |
| V | 디바이스 목업 | PhoneMockup / MonitorMockup | 제품 데모 |
| W | 터미널 코드 | TerminalBlock | CLI/코드 |
| X | 순환 사이클 | CycleDiagram | 피드백 루프 |
| Y | 수직 타임라인 v2 | TimelineStepper | 단계별 과정 |
| Z | 인물 프로필 | PersonAvatar + FlowDiagram | 인물 소개 |

### 후처리 파이프라인

```bash
# ① 자막 타이밍에 enterAt 동기화
npx tsx scripts/sync-enterAt.ts data/{id}/scenes-v2.json

# ② 높이 기반 gap/maxWidth 자동 조정
npx tsx scripts/optimize-layout.ts data/{id}/scenes-v2.json

# ③ 콘텐츠 부족 씬에 InsightTile 자동 삽입 (≤2 콘텐츠 노드 + >15초)
node scripts/pad-sparse-scenes.js data/{id}/scenes-v2.json

# ④ 전체 enterAt 갭 재분배 + 컨테이너 enterAt 동기화
node scripts/fix-all-enterAt-gaps.js data/{id}/scenes-v2.json
```

### 핵심 규칙

- **enterAt**: 헤더(0~24f) → 콘텐츠(36f~) → 형제간 20~30f 간격
- **컨테이너 enterAt**: 반드시 첫 자식과 동일 (빈 카드 방지)
- **카드 maxWidth**: 단일 카드 400~520, Split 1000~1100, Grid 1100
- **텍스트**: 키워드 중심, Headline 25자, BodyText 15자 이내
- **다양성**: 연속 3씬 같은 아키타입 금지, 최소 5종 사용

---

## Step 4. /reat-render — Remotion mp4 렌더링

### 호출

```
> /reat-render {projectId}
```

### 동작

1. `render-props-v2.json` 존재/최신 여부 확인
2. 필요 시 `scenes-v2.json` → `render-props-v2.json` 동기화
3. Remotion 렌더링 실행 (백그라운드)
4. `output/{projectId}.mp4` 생성

### 렌더 명령어

```bash
# 전체 렌더링
npx remotion render MainComposition output/{id}.mp4 \
  --props=data/{id}/render-props-v2.json \
  --concurrency=4

# 부분 렌더링 (특정 프레임 구간)
npx remotion render MainComposition output/test.mp4 \
  --props=data/{id}/render-props-v2.json \
  --frames=4138-10266
```

### 렌더링 스펙

| 항목 | 값 |
|------|-----|
| 해상도 | 1920 x 1080 (Full HD) |
| 프레임레이트 | 30fps |
| 코덱 | H.264 |
| 색 팔레트 | 3종 로테이션 (Electric Violet, Neon Fuchsia, Cyber Indigo) |
| 자막바 | 하단 고정, SRT 동기화 |
| 노드 시스템 | 44개 타입 (36 leaf + 8 container) |
| 소요 시간 | 10분 영상 ≈ 5~10분 |

---

## Step 5. 피드백 루프

영상을 확인하고 수정이 필요하면:

| 요청 | 실행 |
|------|------|
| "레이아웃 다시" | `/reat-layout {id}` (Step 3부터) |
| "렌더링만 다시" | `/reat-render {id}` (Step 4만) |
| "씬 다시 나눌게" | chunk 에디터 → 저장 → Step 3부터 |
| "특정 씬만 수정" | `/reat-layout {id} --scene 5` → `/reat-render` |
| "전체 다시" | `/reat-new`부터 |

---

## 보조 도구

### 미리보기

| 도구 | URL | 용도 |
|------|-----|------|
| Remotion Studio | `npm run remotion:preview` → `:3000` | 프레임 단위 실시간 미리보기 |
| 대시보드 | `npm run dev` → `:3001/` | 프로젝트 목록, 상태 확인 |
| 씬 에디터 | `:3001/editor?projectId=xxx` | 노드 트리 편집, Remotion Player |
| chunk 에디터 | `:3001/chunk?projectId=xxx` | 씬 경계 편집 |

### 보조 스킬

| 스킬 | 역할 | 실행 시점 |
|------|------|----------|
| `/reat-analyze` | 레퍼런스 이미지에서 디자인 토큰 추출 | 프로젝트 시작 전 (선택) |
| `/reat-catalog` | 레이아웃 카탈로그 + 모션 프리셋 생성 | 프로젝트 시작 전 (선택) |

---

## 프로젝트 디렉토리 구조

```
input/                          ← 새 프로젝트 입력 (mp3 + srt)
  가치 노동.mp3
  가치 노동.srt

data/{projectId}/               ← 프로젝트 데이터
  project.json                  ← 프로젝트 메타 (id, name, status, srt_path, audio_path)
  {name}.srt                    ← SRT 자막 (input/에서 복사)
  beats.json                    ← /reat-new 결과 (1자막 = 1beat)
  chunks.json                   ← chunk 에디터 저장 (씬 경계 정보)
  scenes-v2.json                ← chunk 에디터 저장 시 자동 생성 → /reat-layout이 stack_root 추가
  render-props-v2.json          ← /reat-layout이 생성 (Remotion props)
  scene-plan.json               ← /reat-scene 결과 (레이아웃 선택 로그, 참고용)
  scenes.json                   ← /reat-scene 결과 (1:1 매핑, 참고용)

public/                         ← Remotion staticFile 경로
  {name}.mp3                    ← 오디오 파일
  images/{projectId}/           ← 다운로드된 이미지 에셋

output/                         ← 최종 렌더링 결과
  {projectId}.mp4
```

### project.json status 흐름

```
draft → chunked → scened → rendered
         /reat-new    chunk 에디터   /reat-render
                    저장 시
```

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| 빈 카드가 먼저 나옴 | 컨테이너 enterAt < 자식 enterAt | `fix-all-enterAt-gaps.js` 실행 (컨테이너 동기화 포함) |
| 요소가 한꺼번에 나옴 | enterAt 미분배 | `fix-all-enterAt-gaps.js` 실행 |
| 카드가 화면 전체로 늘어남 | maxWidth 미설정 | 카드에 maxWidth: 400~520 추가 |
| 자막과 장면 싱크 안 맞음 | enterAt이 자막보다 느림 | `sync-enterAt.ts` 실행 (anticipation 15f) |
| 칩(Badge/Pill) 텍스트 작음 | 기본 fontSize가 작았음 | shapes.tsx에서 20% 확대 완료 |
| TimelineStepper 텍스트 없음 | label/desc vs title/subtitle | diagrams.tsx에서 호환 매핑 완료 |
| zod 경고 | 버전 불일치 | 무시 가능, 렌더에 영향 없음 |
| localhost:3001 접속 불가 | Next.js 서버 다운 | `npm run dev` 재시작 |
| Remotion Studio 포트 충돌 | 3000 포트 겹침 | remotion.config.ts에서 포트 변경 |
