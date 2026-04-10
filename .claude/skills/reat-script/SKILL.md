---
name: reat-script
description: 주제/키워드만 입력하면 교육 영상용 대본을 자동 생성합니다.
---
# /reat-script — AI 대본 생성

> 주제/키워드만 입력하면 교육 영상용 대본을 자동 생성합니다.

## 트리거

```
/reat-script "AI 시대의 가치 노동"
/reat-script "RAG 검색의 원리" --tone casual --length 10m
/reat-script docs/topic-outline.md
```

## 입력

| 파라미터 | 필수 | 설명 | 기본값 |
|---------|------|------|--------|
| 주제 | ✅ | 영상 주제 (텍스트 또는 파일 경로) | - |
| `--tone` | | 톤 (casual/formal/storytelling) | storytelling |
| `--length` | | 목표 길이 (5m/10m/15m/20m) | 10m |
| `--lang` | | 언어 (ko/en) | ko |
| `--projectId` | | 프로젝트 ID (미지정 시 주제에서 자동 생성) | - |

## 워크플로우

### Step 1: 주제 분석

주제 텍스트를 분석하여 다음을 결정:
- **핵심 메시지**: 영상이 전달해야 하는 1줄 메시지
- **타겟 청중**: 누구를 위한 영상인지
- **톤앤매너**: 강의식/대화식/스토리텔링

### Step 2: 구조 설계

챕터 구조를 설계합니다:

```
도입 (10~15%) — 후킹, 문제 제기, 궁금증 유발
전개 (60~70%) — 핵심 개념 2~4개, 예시, 비교
절정 (10~15%) — 핵심 인사이트, 반전, 감정적 피크
마무리 (10%) — 정리, CTA, 여운
```

목표 길이별 챕터 수:
| 길이 | 챕터 수 | 문장 수 (총) |
|------|---------|-------------|
| 5m | 3~4 | 40~60 |
| 10m | 5~7 | 80~120 |
| 15m | 7~9 | 120~170 |
| 20m | 9~12 | 160~220 |

### Step 3: 대본 작성

각 챕터별로 나레이션 텍스트를 작성합니다.

**대본 작성 원칙:**
1. **구어체**: "~입니다" 대신 "~이에요", "~거든요", "~잖아요"
2. **짧은 문장**: 1문장 = 2~3초 (15~30자)
3. **호흡 단위**: 마침표(.) 기준으로 TTS가 끊어 읽음
4. **청자 참여**: "여러분은 어떻게 생각하세요?", "한번 생각해 보세요"
5. **전환어 사용**: "그런데 말이죠", "자 그러면", "여기서 중요한 건"
6. **구체적 사례**: 추상적 설명 < 구체적 에피소드
7. **반복 강조**: 핵심 키워드는 3번 이상 자연스럽게 반복

**톤별 가이드:**
| 톤 | 특징 | 예시 |
|----|------|------|
| casual | 친구와 대화하듯 | "이거 진짜 대박인 게요..." |
| formal | 강의/발표 톤 | "오늘 말씀드릴 주제는..." |
| storytelling | 이야기 풀어가듯 | "오늘 한 가지 이야기를 들려드릴게요..." |

### Step 4: 출력 파일 저장

**script.json** (구조화된 대본):
```json
{
  "title": "AI 시대의 가치 노동",
  "description": "1줄 설명",
  "tone": "storytelling",
  "target_length_min": 10,
  "chapters": [
    {
      "id": "ch01",
      "title": "도입 — 하청 개발사 이야기",
      "intent": "hook",
      "paragraphs": [
        {
          "text": "오늘 커뮤니티에서 읽은 에피소드 하나를 들려드릴게요.",
          "pause_after": 0.5
        },
        {
          "text": "어떤 회사에서 하청 개발사에게 사내 시스템 개발을 의뢰했는데요.",
          "pause_after": 0.3
        }
      ]
    }
  ]
}
```

**script.md** (사람이 읽기 쉬운 형태):
```markdown
# AI 시대의 가치 노동

## CH01. 도입 — 하청 개발사 이야기
[intent: hook | tone: storytelling]

오늘 커뮤니티에서 읽은 에피소드 하나를 들려드릴게요.
어떤 회사에서 하청 개발사에게 사내 시스템 개발을 의뢰했는데요.
...

## CH02. 반응이 둘로 갈렸어요
[intent: question | tone: engaging]
...
```

### Step 5: 프로젝트 초기화

```json
// data/{projectId}/project.json
{
  "id": "{projectId}",
  "name": "영상 제목",
  "srt_path": "",
  "audio_path": "",
  "status": "scripted",
  "voice": {
    "voice_id": "{ELEVENLABS_VOICE_ID from .env}",
    "model": "eleven_multilingual_v2"
  }
}
```

## 출력

```
data/{projectId}/
  ├── project.json     # status: "scripted"
  ├── script.json      # 구조화된 대본
  └── script.md        # 읽기 쉬운 대본
```

## 다음 단계

대본 생성 후 사용자가 검토/수정하고:
```
/reat-voice {projectId}    # 대본 → MP3 + SRT
/reat-new                  # 이후 기존 파이프라인
```

또는 한번에:
```
/reat-auto "주제"          # script → voice → layout → render 전부 자동
```
