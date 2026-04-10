# 캐릭터 제작 가이드

> 교육 영상에 양념처럼 등장하는 캐릭터를 준비하는 방법을 안내합니다.

## 필요한 포즈 세트

### 필수 (최소 5종)

| # | 포즈 | 용도 | AI 프롬프트 키워드 |
|---|------|------|--------------------|
| 1 | **default** | 기본 자세, 인트로/전환 | standing, neutral expression, idle pose |
| 2 | **pointing** | 핵심 개념 강조 | pointing finger, teaching, presenting |
| 3 | **thinking** | 질문/비교/고민 | hand on chin, thinking, curious |
| 4 | **surprised** | 놀라운 수치/사실 | wide eyes, shocked, amazed |
| 5 | **thumbsUp** | 완료/격려 | thumbs up, encouraging, positive |

### 권장 (3종 추가 = 총 8종)

| # | 포즈 | 용도 | AI 프롬프트 키워드 |
|---|------|------|--------------------|
| 6 | **happy** | 좋은 예시/성과 | smiling, cheerful, celebrating |
| 7 | **explaining** | 일반 설명 | open palm gesture, explaining, casual |
| 8 | **warning** | 경고/주의사항 | stop hand, cautious, serious face |

### 선택 (상황에 따라)

| 포즈 | 용도 |
|------|------|
| waving | 인사/환영 (첫 씬) |
| confused | 복잡한 개념 도입 |
| celebrating | 최종 마무리 |
| writing | 코드/문서 작성 장면 |
| reading | 참고 자료 언급 |

---

## 캐릭터 제작 방법

### 방법 1: AI 이미지 생성 (권장)

#### Midjourney / DALL-E / Stable Diffusion

**1단계 — 캐릭터 디자인 확정**

```
프롬프트 예시:
"Character design sheet, cute mascot character,
a friendly robot/animal/person, simple flat illustration style,
consistent design, white background,
multiple poses on one sheet"
```

**2단계 — 개별 포즈 생성**

캐릭터가 확정되면 각 포즈를 따로 생성합니다:

```
프롬프트 구조:
"[캐릭터 설명], [포즈/동작], [표정],
flat illustration style, transparent background,
full body, facing slightly left, consistent with reference"
```

포즈별 프롬프트 예시:

```
default:
"friendly robot mascot, standing casually, neutral expression,
arms at sides, flat illustration, transparent background"

pointing:
"friendly robot mascot, pointing forward with right hand,
confident expression, teaching pose, flat illustration,
transparent background"

thinking:
"friendly robot mascot, hand on chin, looking up,
curious expression, thinking pose, flat illustration,
transparent background"

surprised:
"friendly robot mascot, both hands up, wide eyes,
shocked expression, flat illustration, transparent background"

thumbsUp:
"friendly robot mascot, giving thumbs up with right hand,
happy smile, encouraging pose, flat illustration,
transparent background"
```

**3단계 — 배경 제거**

AI가 투명 배경을 완벽히 만들지 못할 경우:
- [remove.bg](https://www.remove.bg/) — 무료 배경 제거
- Photoshop / GIMP — 수동 배경 제거
- `rembg` Python 패키지 — CLI로 일괄 처리

```bash
pip install rembg
rembg i input.png output.png
```

#### ChatGPT + DALL-E (대화형)

```
"나만의 교육 영상 마스코트를 만들어줘.
귀여운 로봇 캐릭터, 플랫 일러스트 스타일.
다음 8가지 포즈를 각각 투명 배경으로 만들어줘:
1. 기본 자세 (default)
2. 손가락으로 가리키기 (pointing)
3. 턱에 손 대고 생각하기 (thinking)
..."
```

### 방법 2: 일러스트레이터 의뢰

**전달 사항:**
- 캐릭터 컨셉 (귀여운/전문적/유머러스)
- 필요한 포즈 목록 (위 표 참조)
- 파일 형식: PNG, 투명 배경
- 크기: 1000×1000px 이상
- 스타일: 플랫 일러스트 / 심플 라인 / 3D 렌더

**비용 참고:** 캐릭터 디자인 + 8포즈 = 보통 10~30만원 (프리랜서)

### 방법 3: GIF 캐릭터 (애니메이션)

움직이는 캐릭터를 원하면 각 포즈를 GIF로 준비합니다:
- Lottie → GIF 변환
- After Effects → GIF 내보내기
- 캐릭터 애니메이션 서비스 (Animaker, Vyond 등)

GIF는 `@remotion/gif`로 프레임 동기화 렌더링됩니다.

---

## 기술 요구사항

### 파일 형식

| 항목 | 권장 |
|------|------|
| 형식 | **PNG** (투명 배경) 또는 **GIF** (애니메이션) |
| 크기 | 800×800px ~ 1200×1200px |
| 배경 | **반드시 투명** (검정 배경 위에 올라감) |
| 파일 크기 | PNG: 500KB 이하, GIF: 3MB 이하 |
| 방향 | **약간 왼쪽을 바라보는** 3/4뷰 (우하단에 배치되므로) |

### 디렉토리 구조

```
public/assets/characters/{캐릭터이름}/
  ├── default.png
  ├── pointing.png
  ├── thinking.gif       ← GIF도 가능
  ├── surprised.png
  ├── happy.png
  ├── explaining.png
  ├── warning.png
  └── thumbsup.png
```

### character.json 설정

```bash
# 프로젝트 디렉토리에 생성
data/{projectId}/character.json
```

```json
{
  "name": "코디",
  "poses": {
    "default":    "assets/characters/cody/default.png",
    "pointing":   "assets/characters/cody/pointing.png",
    "thinking":   "assets/characters/cody/thinking.gif",
    "surprised":  "assets/characters/cody/surprised.png",
    "happy":      "assets/characters/cody/happy.png",
    "explaining": "assets/characters/cody/explaining.png",
    "warning":    "assets/characters/cody/warning.png",
    "thumbsUp":   "assets/characters/cody/thumbsup.png"
  },
  "position": "bottomRight",
  "size": 200,
  "frequency": 0.3
}
```

| 설정 | 설명 | 권장값 |
|------|------|--------|
| `position` | 기본 등장 위치 | `bottomRight` |
| `size` | 캐릭터 높이 (px) | 180~220 |
| `frequency` | 등장 빈도 (0~1) | 0.2~0.4 |

---

## 사용 흐름

```
1. 캐릭터 이미지 준비 (최소 5포즈)
     ↓
2. public/assets/characters/{name}/ 에 저장
     ↓
3. /reat-assets 실행 (태깅)
     ↓
4. data/{projectId}/character.json 생성
     ↓
5. /reat-layout {projectId} 실행
     ↓  씬의 intent에 따라 자동으로 포즈 선택 + 배치
6. output/{projectId}.mp4 에 캐릭터 포함된 영상!
```

---

## 디자인 팁

### 스타일 통일
- 모든 포즈에서 **동일한 그림체** 유지
- 선 두께, 색상 팔레트, 비율이 일관되어야 함
- AI 생성 시 시드(seed) 고정 또는 reference image 활용

### 검정 배경과의 조화
- 영상 배경이 검정이므로 **밝은 색상** 캐릭터가 잘 보임
- 외곽에 미세한 글로우/테두리 추가하면 분리감 향상
- 너무 어두운 캐릭터는 배경에 묻힘

### 크기와 위치
- 캐릭터가 콘텐츠를 가리면 안 됨 → 200px 이하 권장
- 자막바(하단 140px) 위에 위치해야 함
- 우하단 기본이지만, 레이아웃에 따라 좌하단 자동 전환

### 말풍선 텍스트
- 15자 이내 (짧고 임팩트 있게)
- 존댓말 통일 ("이 부분이 중요해요!", "주의하세요!")
- 모든 씬에 말풍선 X → 50% 정도만
