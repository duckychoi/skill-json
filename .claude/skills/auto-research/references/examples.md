# /auto-research 실행 예시

> **이 파일은 언제 읽어야 하나?**
> 사용자가 맥락이 모호한 자연어 임무를 줬거나, "예시 보여줘"/"어떻게 동작해?"라고 물을 때만.
> 루프 중이나 Phase 0~4 진행 중엔 Read 불필요.

---

## 예시 1: 스킬 개선 (Pattern A — 스킬 ID만 주어짐)

```
사용자: /auto-research pptx-generate

[Phase 0]
SKILL.md 평가 기준 섹션 파싱 완료.
- id: pptx-generate
- goal: composite_pptx_quality ≥ 0.95
- artifact: [scripts/generate_pptx.py]
- runner: python scripts/generate_pptx.py input/pptx/test_3pages.pdf output/pptx/test.pptx
- evaluator: python scripts/evaluate_pptx.py output/pptx/test.pptx input/pptx/test_3pages.pdf
- test_input: input/pptx/test_3pages.pdf
- time_budget: 15m, runs_per_exp: 1 (결정론적)

[Phase 2]
브랜치: autoresearch/pptx-generate/apr10
baseline: 0.787

[Phase 3] (references/experiment-loop.md Read 후 루프 시작)
#1 slide3 건물 실루엣 도형 세트 추가 → 0.814 KEEP (+0.027)
#2 slide2 허브 다이어그램 디테일 → 0.847 KEEP (+0.033)
#3 slide1 자동차 + Wi-Fi 도형 → 0.844 DISCARD (SSIM 하락)
#4 slide1 하단 부제 추가 → 0.887 KEEP (+0.040)
#5 slide3 좌표 정밀 조정 → 0.890 KEEP (+0.003)
... (무한 반복)

[10회마다 진척 라인]
[auto-research] #10: best=0.890, keep=5, discard=4, crash=1, 평균 8분/회
```

**특이점**: 스킬 ID만 주면 해당 스킬의 SKILL.md에서 `평가 기준` YAML을 자동 파싱. evaluator가 이미 있으므로 Phase 1 생략.

---

## 예시 2: 모델 학습 (원본 autoresearch-win-rtx 재현)

```
사용자: /auto-research autoresearch-win-rtx/train.py 로 val_bpb 0.9 이하 달성

[Phase 0]
- goal: val_bpb ≤ 0.9 (lower_is_better → evaluator 내부에서 1-normalized)
- artifact: [autoresearch-win-rtx/train.py]
- runner: cd autoresearch-win-rtx && uv run train.py
- evaluator: 간이 쉘 스크립트 — `grep "^val_bpb:" run.log | awk '{print $2}'`
- evaluator 외부 스크립트 필요 없음 (runner 출력이 이미 메트릭 포함)
- time_budget: 6m (5분 학습 + 1분 startup 여유)
- runs_per_exp: 1 (결정론적)
- sidecar_metrics: [peak_vram_mb, mfu_percent, training_seconds]

[Phase 2]
브랜치: autoresearch/train-bpb/apr10
baseline: val_bpb=0.9979 (정규화 점수: 1 - 0.9979/1.5 = 0.3347)
wall_seconds: 325.9, peak_vram_mb: 45060

[Phase 3]
#1 LR 0.04로 증가 → val_bpb=0.9932 → 정규화 0.3379 KEEP (+0.0032)
#2 GeLU로 교체 → val_bpb=1.005 → DISCARD (악화)
#3 model depth 8→10 → val_bpb=0.9891 → KEEP (+0.0027)
#4 Muon momentum 0.85→0.95 → val_bpb=0.9834 → KEEP
...
```

**특이점**: runner(`uv run train.py`)가 이미 multi-key summary를 출력하므로 별도 evaluator 스크립트 없이 `grep`만으로 점수 추출. autoresearch-win-rtx 원본과 거의 동일한 플로우.

---

## 예시 3: 웹 클론 (Evaluator 없음 → Phase 1 발동)

```
사용자: /auto-research reference/homepage.png와 동일하게 보이는 index.html 짜

[Phase 0]
자연어에서 추출:
- goal: "동일하게 보이는" → 렌더 SSIM ≥ 0.95로 수치화
- artifact: [index.html]  (없으면 빈 파일로 시작)
- test_input: reference/homepage.png
- evaluator: (없음 → Phase 1로)
- runner: python scripts/render_html.py index.html /tmp/rendered.png
- runs_per_exp: 1

[Phase 0 Step 0-5] 모호한 부분이 있어 사용자에게 1회 확인:
"이렇게 이해했습니다:
 - reference/homepage.png와 시각적으로 매칭되는 index.html 작성
 - 평가: Playwright 렌더 → SSIM 비교 (스크립트 자동 생성 예정)
 - 목표: SSIM ≥ 0.95
 맞으면 OK, 아니면 수정"

사용자: OK

[Phase 1] (references/evaluator-design.md Read)
웹서치: "how to compare two screenshots automatically python"
→ scikit-image SSIM + 픽셀 히스토그램 매칭 조합이 표준
→ scripts/evaluate_webclone.py 생성:
   1. Playwright로 index.html → /tmp/rendered.png 렌더
   2. SSIM(rendered, reference) 계산
   3. 색상 히스토그램 correlation 계산
   4. 가중합 (SSIM 0.7, 히스토그램 0.3) → score: 출력
evaluator 동결.

[Phase 2]
baseline: 0.12 (빈 HTML)

[Phase 3] (references/experiment-loop.md Read)
#1 기본 div 레이아웃 + 제목 → 0.31 KEEP
#2 배경색 #F5F7FA 적용 → 0.48 KEEP
#3 헤더 영역 grid 레이아웃 → 0.62 KEEP
#4 히어로 섹션 정렬 조정 → 0.67 KEEP
#5 푸터 4-col grid → 0.71 KEEP
...
```

**특이점**: 자연어 임무 → Phase 0에서 goal 수치화 → Phase 1에서 evaluator 자동 설계 → Phase 2 베이스라인 → 무한 루프. 사용자는 한 번의 OK만 줌.

---

## 예시 4: 대본 생성 (이진 체크리스트 평가)

```
사용자: /auto-research shot-wrighter 대본이 viral 체크 5/6 이상 통과

[Phase 0]
- goal: binary_checklist_pass_rate ≥ 5/6 (0.833)
- artifact: [.claude/skills/shot-wrighter/SKILL.md]
- runner: Claude 세션 내에서 shot-wrighter SKILL.md 읽고 테스트 주제로 대본 5개 생성
- evaluator: (없음 → Phase 1)
- test_input: "테스트 주제 5개" (고정 리스트)
- runs_per_exp: 5 (LLM 비결정론적)
- sidecar_metrics: [avg_length_chars, unique_openings_count]

[Phase 1] (references/evaluator-design.md Read)
웹서치 + 도메인 지식으로 이진 체크 6개 설계:
  1. 첫 3초 훅에 구체적 숫자·사실 1개 이상 있는가?
  2. 50~60초 분량인가? (문자 수 기준 700~900)
  3. 말순 스타일 어미(~하거든, ~있네요) 사용했는가?
  4. 금지 표현(대박, 진짜, 레전드 등 상투어) 0개인가?
  5. 끝에 명확한 CTA (구독·좋아요·다음 편 예고)가 있는가?
  6. 주제와 동물 캐릭터(말순 스타일) 연결이 자연스러운가?

scripts/evaluate_shot.py 생성:
- 1, 2, 4: 정규식/파싱으로 자동 체크
- 3, 5, 6: Claude API 호출로 yes/no 판정
- 5개 대본 × 6 체크 = 30 중 몇 개 통과 → score = passed/30

evaluator 동결.

[Phase 2]
baseline 실행 (5회):
- avg score: 3.2/6 평균 (std 0.4)
- 실패 패턴: 주로 check #1 (구체 숫자 없음), check #4 (상투어 사용)

[Phase 3] (references/experiment-loop.md Read)
#1 훅에 "숫자 1개 이상 강제" 지시 추가 → 4.2/6 KEEP (+1.0)
#2 금지 표현 anti-pattern 섹션 추가 (대박, 진짜, 레전드 등 10개) → 4.8/6 KEEP (+0.6)
#3 worked example 추가 (이상적 훅 3개 예시) → 5.1/6 KEEP (+0.3)
#4 "CTA 패턴 3가지 중 하나" 명시 → 5.3/6 KEEP
...
```

**특이점**:
- LLM 비결정론적이므로 `runs_per_exp=5`로 분산 감소
- 이진 체크리스트는 일부는 정규식, 일부는 Claude API 호출로 구현
- 점수 개선이 신호인지 잡음인지 판정 시 **분산(std) 고려** — #N의 평균 개선이 std보다 작으면 noise로 판정 후 discard

---

## 패턴별 트리거 문장 예시

### Pattern A: 스킬 ID만
```
/auto-research pptx-generate
/auto-research shot-wrighter
/auto-research reat-layout
```

### Pattern B: 자연어 임무 (파일 경로 명시)
```
/auto-research scripts/generate_pptx.py 로 input/pptx/input.pdf 와 동일한 PPT 만들어
/auto-research train.py val_bpb 0.9 이하
/auto-research index.html이 reference/target.png와 SSIM 0.95 이상 나올 때까지
/auto-research scripts/scraper.py로 target_data.json 스키마 100% 통과시켜
```

### Pattern C: 모호 (1회 확인 필요)
```
/auto-research 영상 만들어봐              → 사용자에게 "어떤 도메인?", "테스트 입력?" 1회 확인
/auto-research 성능 올려                  → "어느 스킬/스크립트?" 1회 확인
/auto-research 이거 더 좋게 해줘          → 최근 대화 맥락에서 artifact 추론 → 1회 확인
```

---

## 주의 사항

- **예시를 그대로 복사하지 말 것**. 각 임무의 도메인·목표·환경에 맞게 변형.
- **예시 4번(LLM 비결정론)처럼 분산 관리가 필요한 경우**엔 `runs_per_exp`를 반드시 3~5로 설정. 1회로는 신호/잡음 구분 불가.
- **예시 2번(ML 학습)**은 원본 autoresearch-win-rtx의 직접 재현. `train.py` 외 어떤 파일도 건드리면 안 됨.
- **예시 3번(웹 클론)**은 Phase 1에서 evaluator를 처음부터 설계하는 케이스. 웹서치 후 표준 인터페이스 준수 필수.
