---
name: reat-voice
description: script.json의 대본을 ElevenLabs TTS로 변환하여 MP3 + SRT를 자동 생성합니다.
---
# /reat-voice — 대본 → 음성(MP3) + 자막(SRT) 자동 생성

> script.json의 대본을 ElevenLabs TTS로 변환하여 MP3 + SRT를 자동 생성합니다.

## 트리거

```
/reat-voice {projectId}              # 대본 → MP3 + SRT
/reat-voice {projectId} --preview    # 첫 챕터만 테스트
/reat-voice --list                   # 사용 가능한 음성 목록
```

## 사전 조건

- `data/{projectId}/script.json` 존재 (`/reat-script`로 생성)
- `.env`에 `ELEVENLABS_API_KEY` 설정
- `.env`에 `ELEVENLABS_VOICE_ID` 설정 (또는 project.json의 voice.voice_id)

## 워크플로우

### Step 1: 대본 로드

```
Read: data/{projectId}/script.json
Read: .env (API key, voice_id)
```

### Step 2: TTS API 호출

script.json의 각 챕터를 순서대로 TTS 변환합니다.

**API 호출 (챕터별):**
```bash
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps
{
  "text": "챕터 전체 나레이션 텍스트",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3
  }
}
```

**응답:**
```json
{
  "audio_base64": "...",
  "alignment": {
    "characters": ["안", "녕", ...],
    "character_start_times_seconds": [0.0, 0.15, ...],
    "character_end_times_seconds": [0.15, 0.28, ...]
  }
}
```

### Step 3: 오디오 병합

각 챕터의 MP3를 하나로 합칩니다:
```bash
ffmpeg -i "concat:ch01.mp3|ch02.mp3|..." -c copy output.mp3
```

또는 전체 대본을 하나의 API 호출로 처리 (5000자 이하인 경우).

### Step 4: SRT 생성

ElevenLabs의 character-level 타임스탬프를 **문장 단위 SRT**로 변환합니다.

변환 로직:
1. `characters[]` + `start_times[]` + `end_times[]`를 결합
2. 마침표(.), 물음표(?), 느낌표(!) 기준으로 문장 분리
3. 각 문장의 시작/끝 시간으로 SRT 엔트리 생성

```srt
1
00:00:00,000 --> 00:00:02,340
안녕하세요, 오늘은 AI 시대의 가치 노동에 대해 이야기하겠습니다.

2
00:00:02,500 --> 00:00:05,120
어떤 회사에서 하청 개발사에게 사내 시스템 개발을 의뢰했는데요.
```

### Step 5: 파일 저장

```
input/reat/{projectId}.mp3     # TTS 음성 파일
input/reat/{projectId}.srt     # 자동 생성된 자막
```

project.json 업데이트:
```json
{
  "srt_path": "{projectId}.srt",
  "audio_path": "{projectId}.mp3",
  "status": "voiced"
}
```

## 실행 스크립트

실제 TTS + SRT 변환은 `scripts/tts-generate.ts`로 실행합니다:

```bash
npx tsx scripts/tts-generate.ts {projectId}
```

## 출력

```
input/reat/{projectId}.mp3      # TTS 음성
input/reat/{projectId}.srt      # 자막 (문장 단위)
data/{projectId}/project.json  # status: "voiced"
```

## 다음 단계

```
/reat-new              # mp3+srt를 인식하여 기존 파이프라인 실행
/reat-layout {id}      # 레이아웃 생성
/reat-render {id}      # 영상 렌더링
```

## 제한사항

- ElevenLabs API 1회 호출 최대 5000자 (초과 시 챕터별 분할)
- 한국어 multilingual_v2 모델 사용 (turbo_v2.5는 한국어 미지원)
- 무료 플랜: 10,000자/월, 유료 플랜: 100,000자~/월
