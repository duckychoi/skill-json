# newVideoGen 워크플로우

> 주제 텍스트 하나로 교육 영상을 자동 생성하는 End-to-End 파이프라인을 설명합니다.

## 전체 파이프라인 개요 (End-to-End)

```
"AI와 코딩의 미래" (주제 텍스트)
              │
              ▼
    ┌─────────────────────┐
    │  /reat-script         │  Claude가 대본 생성 (script.json + script.md)
    └────────┬────────────┘
             ▼
    ┌─────────────────────┐
    │  /reat-voice          │  ElevenLabs TTS → MP3 + SRT 자동 생성
    │  (클론 음성 지원)     │  글자별 타임스탬프 → 문장 단위 SRT 변환
    └────────┬────────────┘
             ▼
    ┌─────────────────────┐
    │  /reat-new            │  프로젝트 초기화 + beats.json + 씬 분할
    └────────┬────────────┘
             ▼
    ┌─────────────────────┐
    │  /reat-assets         │  (선택) 이미지/GIF 스캔 + 태그 생성
    └────────┬────────────┘
             ▼
    ┌─────────────────────┐
    │  /reat-layout         │  Claude가 stack_root JSON 트리 생성
    │  + 캐릭터 오버레이    │  character.json 기반 포즈 자동 선택
    │  + 에셋 매칭         │  manifest.json 태그 ↔ 씬 키워드 자동 매칭
    │  + 후처리 4단계      │  enterAt 동기화 → gap 최적화 → 패딩 → 갭 재분배
    └────────┬────────────┘
             ▼
    ┌─────────────────────┐
    │  /reat-render         │  Remotion CLI로 mp4 렌더링
    └────────┬────────────┘
             ▼
      output/{projectId}.mp4
```

### 기존 방식 (MP3 + SRT 직접 준비)

```
input/{name}.mp3 + input/{name}.srt → /reat-new 부터 시작 (위 파이프라인의 중간부터)
```

---

## Stage 0: 대본 생성 (`/reat-script`) — 선택

주제 텍스트만 입력하면 Claude가 교육 영상용 대본을 자동 생성합니다.

### 입력
- 주제 텍스트: `"AI와 코딩의 미래"`

### 처리
1. 주제 분석 → 핵심 메시지, 타겟 청중, 톤 결정
2. 챕터 구조 설계 (도입 → 전개 → 절정 → 마무리)
3. 각 챕터별 나레이션 텍스트 작성 (구어체, 짧은 문장)

### 출력
```
data/{projectId}/
  ├── project.json     # status: "scripted"
  ├── script.json      # 구조화된 대본 (챕터별 paragraphs)
  └── script.md        # 읽기 쉬운 대본
```

---

## Stage 0.5: 음성 생성 (`/reat-voice`) — 선택

대본을 ElevenLabs TTS로 변환하여 MP3 + SRT를 생성합니다.

### 입력
- `data/{projectId}/script.json` (Stage 0에서 생성)

### 처리
1. script.json의 각 챕터 텍스트 추출
2. ElevenLabs `/v1/text-to-speech/{voice_id}/with-timestamps` API 호출
3. 글자별 타임스탬프를 문장 단위 SRT로 변환
4. 챕터별 MP3를 ffmpeg로 병합

### 출력
```
input/{projectId}.mp3      # TTS 음성
input/{projectId}.srt      # 자동 생성된 자막 (문장 단위)
```

### 음성 클론
본인 목소리 mp3 샘플(1~5분)을 ElevenLabs API에 업로드하면 클론 음성을 생성할 수 있습니다.
`.env`의 `ELEVENLABS_VOICE_ID`에 클론된 voice_id를 설정합니다.

---

## Stage 1: 프로젝트 생성 (`/reat-new`)

### 입력
- `input/{이름}.mp3` — 더빙 음성
- `input/{이름}.srt` — 타임스탬프 자막

### 처리
1. `data/{projectId}/project.json` 생성 (id, name, srt_path, audio_path, status)
2. mp3를 `public/` 에 복사 (Remotion `staticFile()` 참조용)
3. SRT 파싱 → `POST /api/skills/chunk` → `beats.json` 생성

### 출력
```
data/{projectId}/
  ├── project.json        # { id, name, srt_path, audio_path, status: "draft" }
  └── beats.json          # BeatMarker[] (의미 분석된 자막 단위)
public/{이름}.mp3           # Remotion용 오디오 복사본
```

### beats.json 구조

```json
{
  "beat_index": 0,
  "start_ms": 0,
  "end_ms": 2790,
  "start_frame": 0,
  "end_frame": 83,
  "text": "안녕하세요, 오늘은 가치 노동에 대해 이야기하겠습니다.",
  "semantic": {
    "intent": "explain",
    "tone": "neutral",
    "evidence_type": "statement",
    "emphasis_tokens": ["가치 노동"],
    "density": 2
  }
}
```

---

## Stage 2: 씬 분할

### 방법 A — 웹 UI 수동 편집 (권장)

```
http://localhost:3001/chunk?projectId={id}
```

- 자막 사이를 클릭하여 씬 경계(cut) 설정
- 저장 시 `POST /api/srt/save-chunks` 호출
- `chunks.json` + `scenes-v2.json` 동시 생성
- `project.json.status` → `"scened"` 업데이트

### 방법 B — 자동 씬 분할 (`/reat-scene`)

```bash
# 또는 CLI
npx tsx scripts/auto-scene-split.ts data/{id}/project.json
```

- 20초 목표로 beats를 자동 그룹핑
- `scene-plan.json` (레이아웃 선택 점수표) 생성

### scenes-v2.json 구조 (이 시점)

```json
{
  "id": "value-labor-s00",
  "project_id": "value-labor",
  "beat_index": [0, 1, 2],
  "layout_family": "hero-center",
  "start_ms": 0,
  "end_ms": 12680,
  "duration_frames": 381,
  "components": [],
  "copy_layers": {
    "kicker": "INTRO",
    "headline": "가치 노동이란?",
    "supporting": "설명 텍스트..."
  },
  "subtitles": [
    { "text": "안녕하세요", "startTime": 0, "endTime": 1.2 }
  ],
  "narration": "전체 나레이션 텍스트",
  "stack_root": null
}
```

`stack_root`가 아직 `null`입니다. 다음 단계에서 채워집니다.

---

## Stage 2.5: 에셋 준비 (`/reat-assets`) — 선택

`public/assets/`에 이미지(PNG/JPG)나 GIF를 넣어두면, Claude가 각 파일을 직접 보고 태그를 생성합니다.

### 입력
- `public/assets/` 하위의 이미지/GIF 파일

### 처리
1. `npx tsx scripts/scan-assets.ts` — 파일 스캔 + 파일명에서 기본 태그 추출
2. Claude가 태그 부족 파일을 Read 도구로 직접 확인
3. 각 파일에 tags(5~10개), category, alt 작성

### 출력
```json
// public/assets/manifest.json
[
  {
    "file": "assets/persons/boris-cherny.jpg",
    "filename": "boris-cherny.jpg",
    "type": "image",
    "tags": ["보리스 체르니", "Boris Cherny", "TypeScript", "저자", "프로그래머"],
    "category": "person",
    "alt": "보리스 체르니 (프로그래밍 TypeScript 저자)"
  },
  {
    "file": "assets/robot-thinking.gif",
    "filename": "robot-thinking.gif",
    "type": "gif",
    "tags": ["로봇", "사고", "AI", "인공지능", "생각", "고민"],
    "category": "tech",
    "alt": "고민하는 로봇 애니메이션"
  }
]
```

이 manifest는 `/reat-layout` 단계에서 씬 내용과 자동 매칭되어 ImageAsset 노드로 배치됩니다.

---

## Stage 3: AI 레이아웃 생성 (`/reat-layout`)

### 핵심 동작

Claude가 각 씬의 **자막 내용 + 의미 분석(intent/tone/density) + 시간 정보 + 에셋 manifest**를 읽고, `stack_root` JSON 트리를 직접 작성합니다.

### 아키타입 매칭 (2단계)

```
씬 의미 분석 → 20개 아키타입(A~Z) 중 선택 → REF 70종 매칭
                                              ↓
                                manifest.json 에셋 태그 매칭 (있으면)
                                              ↓
                                        stack_root 생성
```

| 아키타입 | 설명 | 대표 노드 |
|---------|------|----------|
| A | 히어로 오버레이 | Overlay + Headline + AccentGlow |
| C | 좌우 VS 대비 | Split + CompareCard |
| D | 3열 Grid | Grid(3) + IconCard × 3 |
| E | 수평 프로세스 | Grid + ProcessStepCard + ArrowConnector |
| K | 단일 IconCard | Stack + IconCard |
| U | ChatBubble 대화 | Stack + ChatBubble × 2~3 |
| W | 터미널 | Stack + TerminalBlock |

전체 20개 아키타입은 `.claude/skills/reat-layout/SKILL.md` 참조.

### 병렬 생성

55개 씬은 4개 에이전트가 병렬로 처리합니다:
- Agent 1: scenes 0~13
- Agent 2: scenes 14~27
- Agent 3: scenes 28~41
- Agent 4: scenes 42~54

### 후처리 파이프라인 (자동 실행)

```bash
# ① sync-enterAt: 자막 키워드 ↔ 노드 텍스트 매칭으로 등장 타이밍 동기화
npx tsx scripts/sync-enterAt.ts data/{id}/scenes-v2.json

# ② optimize-layout: 콘텐츠 높이 추정 → gap/maxWidth 자동 조정
npx tsx scripts/optimize-layout.ts data/{id}/scenes-v2.json

# ③ pad-sparse-scenes: 콘텐츠 부족 씬에 InsightTile 자동 삽입
node scripts/pad-sparse-scenes.js data/{id}/scenes-v2.json

# ④ fix-all-enterAt-gaps: 5초 이상 공백 재분배 + 컨테이너 enterAt 동기화
node scripts/fix-all-enterAt-gaps.js data/{id}/scenes-v2.json
```

### stack_root 생성 결과 예시

```json
{
  "type": "SceneRoot",
  "layout": { "direction": "column", "align": "center", "gap": 24 },
  "children": [
    {
      "type": "Kicker", "data": { "text": "CHAPTER 01" },
      "motion": { "preset": "fadeUp", "enterAt": 0, "duration": 20 }
    },
    {
      "type": "Headline", "data": { "text": "가치 노동이란?" },
      "style": { "fontSize": 56 },
      "motion": { "preset": "fadeUp", "enterAt": 8, "duration": 24 }
    },
    {
      "type": "Grid",
      "layout": { "columns": 3, "gap": 20, "width": "100%" },
      "motion": { "preset": "staggerChildren", "enterAt": 30, "duration": 30 },
      "children": [
        { "type": "IconCard", "data": { "icon": "brain", "title": "지식", "body": "전문 지식 기반" } },
        { "type": "IconCard", "data": { "icon": "sparkles", "title": "창의성", "body": "AI가 못하는 영역" } },
        { "type": "IconCard", "data": { "icon": "heart", "title": "공감", "body": "인간만의 능력" } }
      ]
    }
  ]
}
```

---

## Stage 4: 렌더링 (`/reat-render`)

### 처리

1. `render-props-v2.json` 생성/동기화:
   ```json
   {
     "projectId": "value-labor",
     "audioSrc": "가치 노동.mp3",
     "scenes": [ /* scenes-v2.json 전체 */ ]
   }
   ```

2. Remotion CLI 렌더링:
   ```bash
   npx remotion render MainComposition output/{id}.mp4 \
     --props=data/{id}/render-props-v2.json \
     --concurrency=4
   ```

### 렌더링 내부 흐름

```
render-props-v2.json
    ↓ (Composition.tsx)
<Series> 로 55개 씬 순차 배치
    ↓ (각 씬)
SceneRenderer → stack_root 존재? → SceneShell + StackRenderer
    ↓ (StackRenderer)
SceneRoot → 재귀 RenderNode
    ↓ (각 노드)
컨테이너 → getContainerCSS() + children 재귀
leaf → NODE_REGISTRY[type] 컴포넌트 렌더
    ↓ (모션)
motion.enterAt 기반 localFrame → computeMotionStyle() → CSS transform/opacity
    ↓ (자막)
SubtitleBar — 현재 프레임의 active 자막 표시 (하단 오버레이)
    ↓ (오디오)
<Audio src={staticFile(audioSrc)} /> — 전체 트랙 재생
```

### 출력

```
output/{projectId}.mp4    # 1920×1080, 30fps, h264, CRF 18
```

---

## 데이터 파일 생명주기

```
project.json    draft → chunked → scened → rendered
                  │         │         │         │
beats.json ──────┘         │         │         │
chunks.json ───────────────┘         │         │
scenes-v2.json ──────────────────────┘         │
render-props-v2.json ──────────────────────────┘
```

| 파일 | 생성 시점 | 갱신 시점 |
|------|----------|----------|
| `project.json` | `/reat-new` | 각 단계 완료 시 status 업데이트 |
| `beats.json` | `/reat-new` 또는 `/reat-chunk` | 재생성 시에만 |
| `chunks.json` | 청크 에디터 저장 | 재편집 시 |
| `scenes-v2.json` | 청크 저장 또는 `/reat-scene` | `/reat-layout` + 후처리 |
| `render-props-v2.json` | `/reat-render` 또는 수동 동기화 | 렌더링 전 |
| `public/assets/manifest.json` | `/reat-assets` | 에셋 추가/삭제 시 |

---

## 프로젝트 상태 흐름

```
draft ──→ chunked ──→ scened ──→ rendered
  │           │          │          │
  │   beats.json  chunks.json   mp4 완성
  │   생성됨       생성됨
  │
  project.json 생성됨
```

---

## 반복 개선 사이클

영상 결과가 마음에 들지 않을 때:

1. **개별 씬 수정**: 씬 에디터 또는 직접 scenes-v2.json 수정
2. **후처리 재실행**: `sync-enterAt → optimize-layout → pad-sparse → fix-gaps`
3. **render-props 동기화**: 스크립트 또는 수동
4. **재렌더링**: `/reat-render` 또는 `npx remotion render ...`

전체 레이아웃을 처음부터 다시 생성하려면 `/reat-layout`을 다시 실행합니다.
