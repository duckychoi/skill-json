---
name: reat-new
description: input/reat/ 폴더의 mp3+srt를 자동 감지하여 새 프로젝트를 생성하고, /reat-chunk → /reat-scene까지 자동 실행합니다.
---

# /reat-new — 새 프로젝트 자동 생성

`input/reat/` 폴더에 mp3+srt 파일을 넣으면 자동으로 프로젝트를 생성하고 파이프라인을 시작합니다.

## 트리거 조건

다음 중 하나라도 해당하면 이 스킬을 자동 실행:
- 사용자가 "새 프로젝트", "새로 만들어", "새 영상" 언급
- 사용자가 "더빙 교체", "자막 교체", "새 더빙", "새 자막" 언급
- 사용자가 `/reat-new` 직접 호출
- `input/reat/` 폴더에 아직 프로젝트화되지 않은 mp3+srt 쌍이 감지됨

## 호출

```
/reat-new                    # input/reat/ 폴더 자동 스캔
/reat-new --name "프로젝트명"  # 프로젝트명 직접 지정
```

## 워크플로우

### 1. input/reat/ 폴더 스캔

```bash
ls input/reat/
```

mp3와 srt 파일을 **같은 이름(확장자만 다른)** 쌍으로 매칭합니다.

예시:
```
input/reat/가치 노동.mp3  +  input/reat/가치 노동.srt  →  하나의 프로젝트
input/reat/RAG4.mp3       +  input/reat/RAG4.srt       →  하나의 프로젝트
```

### 2. 프로젝트 ID 생성

파일명에서 자동 생성:
- 한글/공백 → 영문 슬러그 변환 (kebab-case)
- 예: `"가치 노동"` → `"gachi-nodong"` 또는 짧은 영문 요약
- 영문 파일명은 소문자 kebab-case로: `"RAG4"` → `"rag4"`
- 기존 프로젝트 ID와 충돌 시 숫자 접미사 추가: `"rag4-2"`

**한글 파일명 슬러그 변환 규칙:**
- 초성 기반 약어 사용: `"가치 노동"` → `"value-labor"`
- 또는 의미 기반 영문 번역 사용 (Claude가 판단)
- projectId는 반드시 영문 소문자 + 숫자 + 하이픈만 사용

### 3. 프로젝트 디렉토리 생성 + 파일 복사

```bash
# 디렉토리 생성
mkdir -p data/{projectId}

# SRT 복사 (data/{projectId}/ 아래로)
cp "input/reat/{filename}.srt" "data/{projectId}/{filename}.srt"

# 오디오 복사 (public/ 아래로, Remotion staticFile용)
cp "input/reat/{filename}.mp3" "public/{filename}.mp3"
```

### 4. project.json 생성

```json
{
  "id": "{projectId}",
  "name": "{파일명 또는 사용자 지정명}",
  "srt_path": "{filename}.srt",
  "audio_path": "{filename}.mp3",
  "created_at": "2026-03-13T...",
  "updated_at": "2026-03-13T...",
  "status": "draft",
  "total_duration_ms": 0
}
```

### 5. 자동 파이프라인 실행

프로젝트 생성 후 순서대로 실행:

```
① /reat-chunk {projectId}   — SRT → beats.json
② /reat-scene {projectId}   — beats.json → 기본 장면 분리 (chunks.json + scenes-v2.json 자동 생성)
```

**기본 장면 분리가 완료된 상태**에서 사용자에게 **반드시 아래 형식으로** 보고합니다:

```
✅ 프로젝트 '{projectId}' 생성 완료
- 이름: {프로젝트명}
- 자막: {N}개, {M}분 {S}초
- 기본 장면 분리: {S}개 씬 자동 생성 완료

👉 장면 편집이 필요하면 아래 링크에서 수정하세요 (선택사항):
   http://localhost:3001/chunk?projectId={projectId}
   편집 후 저장하면 scenes-v2.json이 자동 업데이트됩니다.

👉 바로 진행하려면 "/reat-layout {projectId}" 를 요청해주세요.
```

**중요: 장면 편집 링크는 반드시 포함해야 합니다.**

사용자가 chunk 에디터에서 씬 경계를 **추가 편집**하고 **저장** 버튼을 누르면:
- `chunks.json` + `scenes-v2.json`이 **업데이트**됨 (API가 동시 처리)
- 프로젝트 상태가 `"scened"`로 유지됨

편집 없이 바로 진행하거나, 편집 완료 후 다음 단계를 요청하면:
```
③ /reat-layout {projectId}  — 현재 scenes-v2.json을 다시 읽고 stack_root 생성
④ /reat-render {projectId}  — 렌더링
```

**핵심:** /reat-layout은 항상 **현재 scenes-v2.json 기준**으로 레이아웃을 생성합니다.
사용자가 chunk 에디터에서 씬 개수·경계·내용을 변경했을 수 있으므로,
초기 자동 생성 시점의 데이터를 가정하지 않고 파일을 새로 읽어야 합니다.

### 6. input/ 정리 (선택)

파이프라인 완료 후 사용자에게 확인:
- "input/ 폴더의 원본 파일을 삭제할까요?"
- 삭제하지 않아도 다음 실행 시 이미 프로젝트화된 파일은 건너뜀

## 중복 감지

기존 프로젝트와의 중복을 감지합니다:
1. `data/*/project.json`을 모두 읽기
2. 각 프로젝트의 `srt_path`와 `audio_path`를 비교
3. 같은 파일명이 이미 프로젝트에 연결되어 있으면:
   - 사용자에게 "이미 '{projectId}' 프로젝트가 있습니다. 덮어쓸까요?" 확인
   - 덮어쓰기 선택 시 기존 프로젝트의 beats.json, scenes-v2.json 삭제 후 재생성

## 복수 파일 지원

input/reat/에 여러 쌍이 있으면:
```
input/reat/가치 노동.mp3 + .srt
input/reat/RAG4.mp3 + .srt
```
→ 목록을 보여주고 어떤 것부터 할지 사용자에게 선택을 요청합니다.
→ 하나만 있으면 바로 진행합니다.

## 에러 처리

| 상황 | 동작 |
|------|------|
| input/reat/ 비어있음 | "input/reat/ 폴더에 mp3+srt 파일을 넣어주세요" |
| mp3만 있고 srt 없음 | "'{name}.srt' 파일이 없습니다" |
| srt만 있고 mp3 없음 | "'{name}.mp3' 파일이 없습니다" (경고만, 진행 가능) |
| SRT 파싱 실패 | "SRT 형식이 올바르지 않습니다" |
| 디스크 공간 부족 | 파일 복사 실패 시 에러 메시지 |

## 예시 실행 흐름

```
사용자: "더빙과 자막을 새로 넣었어"
Claude: input/reat/ 폴더를 스캔합니다...

  발견: 가치 노동.mp3 + 가치 노동.srt

  프로젝트 생성 중...
  - ID: value-labor
  - 이름: 가치 노동

  beats.json 생성 중... ✓ 250 beats
  기본 장면 분리 중... ✓ 21개 씬 자동 생성

  ✅ 프로젝트 'value-labor' 생성 완료
  - 이름: 가치 노동
  - 자막: 250개, 11분 39초
  - 기본 장면 분리: 21개 씬 자동 생성 완료

  👉 장면 편집이 필요하면 아래 링크에서 수정하세요 (선택사항):
     http://localhost:3001/chunk?projectId=value-labor
     편집 후 저장하면 scenes-v2.json이 자동 업데이트됩니다.

  👉 바로 진행하려면 "/reat-layout value-labor" 를 요청해주세요.
```
