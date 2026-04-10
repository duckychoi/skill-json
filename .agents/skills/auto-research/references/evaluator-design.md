# Phase 1: Evaluator 설계 가이드

> **이 파일은 언제 읽어야 하나?**
> Phase 0에서 `mission.evaluator` 경로가 없거나 해당 스크립트가 존재하지 않을 때.
> Phase 0에서 evaluator가 이미 있으면 이 파일은 읽지 않는다.
>
> **한 번 Read하면 그 세션 동안 context에 유지된다.** Phase 1 완료 후 Phase 2로 진행.

---

## Step 1-1: 도메인 추론

임무 설명과 artifact 확장자에서 도메인을 분류한다.

- `.py` + "train" 키워드 → 머신러닝 학습
- `.pptx/.pdf/.docx` → 문서 재현
- `.html/.css` + "screenshot"/"clone" → 웹 UI 클론
- `.png/.jpg` + "generate"/"art" → 이미지 생성
- `.mp4/.mov` → 영상 렌더
- `.mp3/.wav` + "voice"/"TTS" → 음성 합성
- `.md`/스킬 SKILL.md + "대본"/"copy"/"카피" → 텍스트/대본 생성
- `.json` + "schema"/"convert" → 데이터 변환

모호하면 사용자 원문에서 키워드를 다시 찾는다.

---

## Step 1-2: 웹서치 (필수)

무작정 메트릭을 고르지 말고, 웹서치 1~2쿼리로 해당 도메인의 **학술적으로 검증된 자동 평가 방법**을 찾는다.

쿼리 예시:
- `how to automatically evaluate {domain} output`
- `{domain} similarity metric python library`
- `{task} benchmark evaluation code`
- `best metric for {domain} quality python`

웹서치 결과를 참고하되, 다음 맵이 기본 후보다.

---

## Step 1-3: 도메인별 기본 메트릭 맵

| 도메인 | 단일 메트릭 후보 | 라이브러리 |
|---|---|---|
| 문서 재현 (PDF/PPT) | 렌더 SSIM + 텍스트 커버리지 + 구조 일치 (가중합) | python-pptx, scikit-image, pymupdf |
| 이미지 생성/클론 | SSIM, LPIPS, FID, 색상 히스토그램 매칭 | scikit-image, lpips, cleanfid, Pillow |
| 웹 UI 클론 | Playwright 렌더 → SSIM + DOM 유사도 | playwright, beautifulsoup |
| 코드 생성 | 테스트 통과율 + 린트 통과 | pytest, vitest, ruff |
| 텍스트/대본/카피 | 이진 체크리스트 N개 → 통과율 | (Claude 자체 평가) |
| 데이터 변환 | JSON 스키마 + 필드 완성도 + 의미 검증 | jsonschema |
| 머신러닝 학습 | val_loss / val_bpb / accuracy (프로젝트 내장) | PyTorch/TF |
| 음성/TTS | MOS 유사 지표, WER | jiwer, whisper |
| 영상 렌더 | 프레임별 SSIM 평균 + 오디오 크로스상관 | ffmpeg + scikit-image |

여러 서브 메트릭이 있으면 **가중합으로 단일화**해서 하나의 `score:` 출력으로 수렴시킨다.

---

## Step 1-4: 평가 스크립트 생성 (표준 인터페이스)

```bash
python {evaluator} {output_path} {reference_or_input}
# stdout: autoresearch-win-rtx 원본 스타일의 multi-key summary
#   ---
#   score:            0.876543
#   sub_ssim:         0.890000
#   sub_text:         0.667000
#   output_size_kb:   128
#   ---
# 마지막 줄에 score만 있어도 OK (grep "^score:" | awk '{print $2}')
# stderr: 상세 로그
# exit: 0=정상, 1=평가 실패
```

**설계 규칙:**
- 복합 지표는 **스크립트 내부에서 가중합**하여 `score:` 한 줄로 출력한다 → 외부 루프는 단일 메트릭만 다룸
- 서브 메트릭과 sidecar 메트릭은 `sub_*:`, `*_mb:`, `*_kb:` 등 별도 키로 함께 출력 — 디버깅과 tie-break에 사용
- `higher_is_better = true` 가 기본. 낮을수록 좋은 지표는 내부에서 `1 - normalized`로 뒤집는다
- 실패/크래시 시 `score: 0.000000`을 출력하고 exit 1

**출력 포맷 예시 (PPTX 평가)**:
```
---
score:            0.890000
sub_slide_count:  1.000000
sub_native:       1.000000
sub_no_image:     1.000000
sub_text_cover:   0.878000
sub_ssim:         0.797000
output_size_kb:   456
---
```

---

## Step 1-5: 이진 체크리스트 평가의 특수 처리

텍스트/창의 도메인에선 수치 지표가 부정확할 수 있다. 이 경우 **이진 yes/no 체크 3~6개**를 설계하고 통과율을 점수로 쓴다.

### 좋은 이진 체크 규칙

- **yes/no 만. 1~10 척도 금지** (변수 누적 → 신호 약화)
- **구체적**: "모든 단어가 잘리지 않았는가?" > "읽기 좋은가?"
- **독립적**: 문법 체크와 맞춤법 체크는 겹친다 → 하나로 합친다
- **관찰 가능**: "재미있는가?" (측정 불가) → "첫 문장에 구체 숫자가 있는가?" (측정 가능)
- **3~6개가 sweet spot**: 많으면 스킬이 평가를 암기하고 품질이 고르지 못해진다
- **게임 방지**: "200자 미만" 같은 구조 제약은 스킬이 나머지를 희생하며 만족시킬 수 있다

### 체크리스트 템플릿

```
EVAL N: {짧은 이름}
Question: {yes/no 질문 한 문장}
Pass: {"yes" 조건 구체 설명}
Fail: {"no" 조건 구체 설명}
```

### 도메인별 이진 체크 예시

**텍스트/카피 (뉴스레터, 트윗, 랜딩):**
- `금칙어 N개 중 0개 사용 (game-changer, 대박, level up 등)`
- `첫 문장에 구체 시간·장소·감각 표현 1개 이상`
- `분량 150~400자 이내`
- `마지막 줄에 명확한 CTA (행동 지시)`

**시각 (다이어그램, 슬라이드, 이미지):**
- `모든 텍스트가 완전히 읽힘 (잘림·겹침 없음)`
- `파스텔/소프트 팔레트만 사용 (네온·고채도 0)`
- `레이아웃이 선형 (좌→우 또는 상→하 한 방향)`
- `번호 매기기 0개 (1st, 2nd, Step 1 등 금지)`

**코드 (스크립트, 설정):**
- `에러 없이 실행됨 (실제로 돌려봐)`
- `TODO / placeholder 주석 0개`
- `변수명 모두 서술적 (단일 문자 금지, 루프 카운터 제외)`
- `외부 호출(API, 파일, 네트워크)에 에러 핸들링 존재`

**문서 (제안서, 보고서, 덱):**
- `필수 섹션 전부 포함 (list them)`
- `모든 주장에 숫자·날짜·출처 첨부`
- `분량 X페이지 이하`
- `executive summary가 3문장 이하`

### 이진 체크 3-질문 테스트

평가 설계 전 이 3가지를 자문하라:

1. **두 에이전트가 같은 출력을 보고 같은 결과를 낼 수 있는가?** → 아니면 너무 주관적, 다시 쓰기
2. **이 eval을 통과하려고 꼼수를 쓸 수 있는가?** → 가능하면 너무 좁음, 넓혀라
3. **이 eval이 사용자가 실제로 신경 쓰는 걸 측정하는가?** → 아니면 버려라. 의미 없는 eval은 신호를 희석한다

### 흔한 실수

| 실수 | 문제 | 해결 |
|---|---|---|
| **eval이 너무 많음 (7개↑)** | 스킬이 eval을 암기하고 품질은 고르지 못함 | 3~6개로 줄여라 |
| **너무 좁거나 경직됨** | "정확히 bullet 3개" → 이상한 출력 | 품질을 보는 eval을 써라, 임의 구조 제약 X |
| **겹치는 eval** | "문법 맞음?"과 "스펠 오류 없음?" → 이중 카운트 | 독립적이어야 함 |
| **에이전트가 측정 불가** | "사람이 재미있어 할까?" → 거의 항상 "yes" | 관찰 가능 신호로 번역 |

### 이진 체크 구현

이진 체크는 `evaluate_{domain}.py` 안에서 다음 중 하나로 구현한다:

1. **정규식/파싱** (구조 체크): 금칙어 검색, 길이 측정, 섹션 존재 확인 등
2. **Claude API 호출** (의미 체크): 각 질문을 별도 API 호출로 yes/no 받기
3. **외부 라이브러리** (기술 체크): `pytest`, `ruff`, `playwright screenshot + SSIM`

외부에는 여전히 `{passed}/{total}` 비율만 숫자로 노출한다:

```
score:     0.833333   # 5/6 passed
sub_eval1: 1.000000   # passed
sub_eval2: 1.000000
sub_eval3: 0.000000   # failed
sub_eval4: 1.000000
sub_eval5: 1.000000
sub_eval6: 1.000000
```

---

## Step 1-6: Evaluator 동결

생성한 스크립트를 **이 Mission 동안 수정 금지 파일**로 선언한다. 이후 실험 루프 중엔 절대 손대지 않는다.

`mission.json`에 evaluator 경로를 기록하고, `autoresearch-runs/{id}/mission.json`에 다음 flag를 남긴다:

```json
"evaluator_frozen_at": "{ISO timestamp}",
"evaluator_hash": "{sha256 of the file}"
```

실험 중 evaluator 파일의 hash가 바뀌면 **즉시 루프 중단하고 사용자에게 경고**. Evaluator가 수정됐다는 건 평가 무결성이 깨졌다는 뜻이므로 그 이후 점수는 모두 무효.

---

## 완료 후 Phase 2로 진행

Evaluator가 준비되고 Step 1-6의 동결까지 완료되면 Phase 2(베이스라인 확립)로 돌아가서 SKILL.md 본체의 Step 2-1부터 계속한다.

**중요**: Phase 1에서 돌아온 이후엔 이 파일(`evaluator-design.md`)을 다시 Read할 필요 없다. 필요한 건 전부 `mission.json`과 생성된 evaluator 스크립트에 기록되어 있다.
