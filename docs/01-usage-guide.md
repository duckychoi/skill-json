# newVideoGen 사용 가이드

> SRT 자막 + 음성 파일만 있으면 교육 영상을 자동으로 생성합니다.

## 필수 준비물

| 항목 | 설명 | 위치 |
|------|------|------|
| 음성 파일 | mp3 (더빙 완성본) | `input/{이름}.mp3` |
| 자막 파일 | SRT (타임스탬프 포함) | `input/{이름}.srt` |

파일 이름은 **동일**해야 합니다 (예: `가치 노동.mp3` + `가치 노동.srt`).

## 방법 A: 주제만으로 영상 만들기 (End-to-End 자동화)

SRT/MP3 없이 **주제 텍스트만** 던지면 대본 → 음성 → 영상까지 자동 생성합니다.

```bash
# 1. 대본 생성
/reat-script "AI와 코딩의 미래"

# 2. 음성 + 자막 생성 (ElevenLabs TTS)
/reat-voice ai-coding-future

# 3. 프로젝트 초기화 + 씬 분할
/reat-new

# 4. AI 레이아웃 생성
/reat-layout ai-coding-future

# 5. 렌더링
/reat-render ai-coding-future
```

### 사전 설정

- `.env`에 `ELEVENLABS_API_KEY` 설정
- `.env`에 `ELEVENLABS_VOICE_ID` 설정 (음성 클론 또는 라이브러리 음성)
- 음성 클론: `input/` 폴더의 mp3 샘플로 ElevenLabs API에서 생성

---

## 방법 B: MP3 + SRT로 영상 만들기 (기존 방식)

이미 더빙 음성과 자막이 준비된 경우:

### 1단계: 프로젝트 생성

```
/reat-new
```

`input/` 폴더의 mp3+srt를 자동 스캔하여 프로젝트를 생성합니다.

### 2단계: 씬 경계 편집 (선택)

```
http://localhost:3001/chunk?projectId={projectId}
```

웹 UI에서 자막 사이를 클릭하여 씬을 분리합니다.

### 3단계: AI 레이아웃 생성

```
/reat-layout {projectId}
```

Claude가 각 씬의 자막/의미를 분석하여 `stack_root` JSON 트리를 직접 생성합니다.

### 4단계: 렌더링

```
/reat-render {projectId}
```

### 5단계: 결과 확인

```
output/{projectId}.mp4
```

---

## 방법 C: 슬라이드 영상 만들기

SRT/MP3 없이 목차만으로 슬라이드 영상을 생성합니다.

```bash
/reat-slides "프로젝트 소개"
```

---

## Slash Commands 전체 목록

| 명령어 | 역할 | 자동/수동 |
|--------|------|-----------|
| `/reat-script "주제"` | 주제 → 대본 자동 생성 (script.json + script.md) | 자동 |
| `/reat-voice {id}` | 대본 → ElevenLabs TTS → MP3 + SRT 자동 생성 | 자동 |
| `/reat-new` | input/ 스캔 → 프로젝트 생성 → chunk + scene 실행 | 자동 |
| `/reat-chunk {id}` | SRT → beats.json (의미 청킹) | 자동 |
| `/reat-scene {id}` | beats.json → scene-plan + scenes (점수 기반 레이아웃 선택) | 자동 |
| `/reat-layout {id}` | Claude가 stack_root JSON 직접 생성 + 후처리 4단계 | 자동 |
| `/reat-render {id}` | scenes-v2 → render-props → mp4 렌더링 | 자동 |
| `/reat-slides "제목"` | 텍스트 목차 → 슬라이드 영상 (SRT/MP3 불필요) | 자동 |
| `/reat-assets` | public/assets/ 스캔 → 이미지/GIF 태그 자동 생성 | 자동 |
| `/reat-catalog {id}` | 레이아웃 카탈로그 + 모션 프리셋 생성 | 자동 |
| `/reat-analyze {id}` | 레퍼런스 이미지 디자인 토큰 추출 | 자동 |

---

## 웹 UI (Next.js)

개발 서버 시작:

```bash
npm run dev
# http://localhost:3001
```

### 주요 페이지

| URL | 설명 |
|-----|------|
| `/` | 프로젝트 대시보드 |
| `/chunk?projectId={id}` | 청크 에디터 (씬 경계 편집) |
| `/scene-editor?projectId={id}` | 씬 에디터 (stack_root 시각 편집) |

### 주요 API 엔드포인트

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/api/projects` | 프로젝트 목록 |
| POST | `/api/projects` | 프로젝트 생성 |
| GET | `/api/projects/{id}/scenes-v2` | scenes-v2 조회 |
| PATCH | `/api/projects/{id}/scenes-v2/{idx}/stack-root` | 개별 씬 stack_root 수정 |
| POST | `/api/projects/{id}/render` | 렌더 작업 시작 |
| GET | `/api/srt?projectId={id}` | SRT 자막 조회 |
| POST | `/api/srt/save-chunks` | 청크 경계 저장 |

---

## 이미지/GIF 에셋 활용

`public/assets/` 폴더에 이미지(PNG/JPG)나 움직이는 GIF를 넣으면 영상에 자동으로 배치됩니다.

### 에셋 추가 방법

```bash
# 1. 파일을 public/assets/에 넣기 (서브폴더 가능)
public/assets/
  ├── robot-thinking.gif
  ├── persons/
  │   └── boris-cherny.jpg
  └── tech/
      └── ai-brain.png

# 2. 에셋 스캔 + 태깅 (Claude가 이미지를 직접 보고 태그 생성)
/reat-assets

# 3. 레이아웃 생성 시 자동 매칭
/reat-layout {projectId}
```

### 매칭 원리
- `/reat-assets` 실행 시 Claude가 각 이미지를 직접 보고 태그(5~10개), 카테고리, 설명을 작성
- 결과는 `public/assets/manifest.json`에 저장
- `/reat-layout` 시 씬의 자막/키워드와 manifest 태그를 비교하여 가장 관련 높은 에셋을 자동 배치
- GIF는 `@remotion/gif`로 애니메이션 재생, PNG/JPG는 정적 이미지로 표시

### manifest.json 예시
```json
[
  {
    "file": "assets/persons/boris-cherny.jpg",
    "type": "image",
    "tags": ["보리스 체르니", "Boris Cherny", "TypeScript", "저자", "프로그래머"],
    "category": "person",
    "alt": "보리스 체르니 (프로그래밍 TypeScript 저자)"
  }
]
```

자막에 "보리스 체르니"가 등장하는 씬에 자동으로 해당 사진이 배치됩니다.

---

## 후처리 파이프라인 (수동 실행)

레이아웃 생성 후 품질 개선이 필요할 때:

```bash
# ① 자막-노드 키워드 매칭으로 enterAt 동기화
npx tsx scripts/sync-enterAt.ts data/{id}/scenes-v2.json

# ② 콘텐츠 높이 기반 gap/maxWidth 자동 조정
npx tsx scripts/optimize-layout.ts data/{id}/scenes-v2.json

# ③ sparse 씬에 InsightTile 자동 삽입
node scripts/pad-sparse-scenes.js data/{id}/scenes-v2.json

# ④ enterAt 갭 재분배 + 컨테이너 동기화
node scripts/fix-all-enterAt-gaps.js data/{id}/scenes-v2.json
```

순서를 반드시 지켜야 합니다 (① → ② → ③ → ④).

---

## Remotion Studio 미리보기

```bash
npx remotion studio
```

브라우저에서 실시간 미리보기가 가능합니다. props 파일을 지정하면 특정 프로젝트를 바로 확인할 수 있습니다.

---

## 트러블슈팅

### 자막이 표시되지 않음
- `SubtitleBar`가 상대/절대 타이밍을 자동 감지합니다.
- scenes-v2.json의 `subtitles[].startTime`이 씬 내 상대값인지, 전체 절대값인지 확인하세요.

### 빈 카드가 렌더링됨
- 노드의 `data` 필드 형식이 올바른지 확인하세요.
- IconCard: `{ icon, title, body }` (desc가 아닌 **body**)
- CompareCard: `{ left: { icon, title, subtitle, negative }, right: { icon, title, subtitle, positive } }`
- 스킬 치트시트: `.claude/skills/reat-layout/SKILL.md` 참조

### 렌더링 오류 (React error #31)
- `TerminalBlock.lines`는 문자열 배열이어야 합니다 (`string[]`).
- 객체 배열 `[{text, type}]`은 오류를 발생시킵니다.

### GIF가 정지 이미지로만 표시됨
- `@remotion/gif` 패키지가 설치되어 있는지 확인하세요 (`npm list @remotion/gif`).
- ImageAsset 노드의 `src`가 `.gif` 확장자로 끝나야 GIF 렌더러가 동작합니다.

### 포트 충돌
- `remotion.config.ts`의 `Config.setPort(3001)`은 주석 처리되어 있습니다.
- Next.js와 Remotion Studio를 동시에 실행하면 포트 충돌이 발생할 수 있습니다.
