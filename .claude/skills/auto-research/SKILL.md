---
name: auto-research
description: "사용자가 준 임무를 자율적으로 완수하는 무한 실험 루프. autoresearch-win-rtx의 철학(고정 시간 예산, 단일 메트릭, git keep/discard, NEVER STOP)을 계승하되 ML 학습에 한정하지 않고 어떤 임무에든 적용한다. 평가 지표가 없으면 웹서치로 직접 설계하고, 대상 아티팩트를 반복 수정해 목표 달성까지 절대 멈추지 않는다. 호출 예: optimize this skill, improve this script, make this clone pixel-perfect, train this model to X, evaluate and iterate."
---

# /auto-research -- 자율 임무 수행 실험 루프

> 사용자가 임무를 주면 평가 지표를 스스로 결정하고, 대상 아티팩트를 반복 수정하며,
> 목표가 달성될 때까지 무한 실험하는 autoresearch-win-rtx 계승 엔진.

## 프레이밍 (왜 이게 동작하는가)

이 스킬은 **자연선택 원리를 코드 진화에 적용한 과학적 방법의 자동화**다. 각 사이클은:

```
가설 생성 → 실험 설계 → 실행 → 관찰 → 판단 → 다음 가설
  (AI)      (Edit)     (runner)  (evaluator)  (keep/discard)  (AI)
```

고정 시간 예산과 단일 메트릭 제약이 **정직한 연구**를 강제한다. 제약이 없으면 AI는 메트릭을 해킹한다. 평가자를 잠그고, 시간을 고정하고, 단일 점수로만 판단하는 구조가 자연선택을 작동시킨다.

**기대 스케일**: 실험 1회가 5분이면 시간당 12회, 하룻밤 8시간이면 약 100회 자율 실험. 사용자의 수면 시간이 연구 시간으로 전환된다. 인간 연구원의 가장 큰 병목은 수면이다.

**불변 원칙**: 복잡한 시스템(PBT, 파레토 최적화, 메타 학습 등)이 아니라 **5분 + 단일 메트릭 + 단일 파일**이라는 극단적 단순화가 이 시스템의 실제 힘이다. 확장의 유혹을 경계하라.

---

## 트리거

```
/auto-research pptx-generate 스킬 SSIM 0.95 이상으로 끌어올려
/auto-research scripts/generate_pptx.py 로 이 PDF와 시각적으로 동일한 PPT 만들어
/auto-research train.py val_bpb 0.9 이하 찍어
/auto-research 이 screenshot.png와 동일하게 보이는 index.html 짜
/auto-research shot-wrighter 스크립트가 viral 점수 8점 이상 나올 때까지
```

---

## 핵심 철학 (autoresearch-win-rtx 계승, 수정 금지)

| 원칙 | 의미 |
|---|---|
| **고정 시간 예산** | 실험 1회 벽시계 시간을 고정 → 하드웨어/설정 독립적 공정 비교 |
| **단일 메트릭** | 명확한 숫자 하나. 복합은 가중합으로 단일화 → 목표 해킹 방지 |
| **단일 수정 대상** | 한 실험에서 한 파일(또는 명시된 집합)만 수정 → 폭발 반경 제한 |
| **읽기 전용 평가자** | evaluator는 prepare.py 역할. 절대 수정 금지 → 평가 무결성 |
| **git 기반 keep/discard** | 모든 실험은 commit. 개선 실패 시 `git reset --hard HEAD~1` |
| **run.log 리다이렉트** | 실행·평가 출력은 파일로. grep으로 숫자 한 줄만 회수 → context 보호 |
| **NEVER STOP** | 사용자 Ctrl+C 전까지 무한 반복. "계속할까요?" 금지 |
| **Simplicity criterion** | 개선 대비 복잡도 증가 평가. 작은 개선 + 큰 복잡도 → discard |
| **단일 가설 원칙** | 한 번에 한 가지 변경만. 두 개 동시에 바꾸면 무엇이 효과였는지 모름 |
| **사이드 메트릭 관찰** | goal은 단일. 그러나 리소스(시간·메모리·VRAM·크기)는 관찰해서 기록 |

이 10가지는 **스킬의 불변식**이다. 사용자가 명시적으로 바꾸라고 지시해도, 대안을 제시하고 재확인한다.

---

## 용어

| 용어 | 의미 |
|---|---|
| **Mission** | 사용자가 완수를 요구한 임무 전체 |
| **Goal** | 완수의 정의. 측정 가능한 수치 상태 (예: SSIM ≥ 0.95) |
| **Artifact** | 임무 수행을 위해 **수정하는** 파일. 한 실험당 원칙적으로 하나 |
| **Runner** | 임무 시도를 실행하는 명령. Artifact의 변경이 결과에 반영되도록 |
| **Evaluator** | 출력을 0~1 숫자로 채점하는 스크립트. 절대 수정 금지 |
| **Test input** | 모든 실험이 동일하게 사용하는 고정 입력 |
| **Time budget** | 실험 1회당 벽시계 상한 |
| **best_score** | 지금까지 기록한 최고 점수 |

이 7개가 `mission.json`으로 정의되고, 실험 루프의 상수가 된다.

---

## Workflow 개요

| Phase | 목적 | 필요 시 참고 |
|---|---|---|
| 0. Mission Intake | 임무 해석, mission.json 작성, 실측 검증 | (본 SKILL.md) |
| 1. Evaluator 설계 | evaluator 없을 때만. 도메인별 메트릭 + 표준 인터페이스 | **`references/evaluator-design.md`** |
| 2. Baseline | 브랜치 생성, 백업, 베이스라인 실행, results.tsv 초기화 | (본 SKILL.md) |
| 3. 실험 루프 (∞) | 가설 → Edit → commit → 실행 → 평가 → keep/discard | **`references/experiment-loop.md`** |
| 4. 완료 리포트 | 베이스라인→최종, Top 변경, 남은 실패 패턴 | (본 SKILL.md) |

**구체적 임무 예시가 필요하거나 사용자가 맥락을 물으면**: `references/examples.md` 참고.

---

## Phase 0: 임무 해석 (Mission Intake)

### Step 0-1: 임무 문장에서 요소 추출

사용자가 준 문장 하나에서 가능한 한 **모든 필드를 추론**한다. 다음 세 가지 패턴에 따라 다르게 해석한다.

#### 패턴 A: 스킬 ID만 주어짐
예: `/auto-research pptx-generate`

1. `.claude/skills/{id}/SKILL.md`를 읽는다
2. 하단의 `## 평가 기준 (auto-research용)` 섹션에서 YAML을 파싱한다
3. 있으면 그 값을 mission.json에 그대로 쓴다

#### 패턴 B: 자연어 임무
예: `/auto-research 이 screenshot.png와 동일하게 보이는 index.html 짜`

문장에서 다음을 추출한다:
- **Goal 단서**: "동일", "일치", "0.95 이상", "통과", "에러 없음", "viral 점수 8점"
- **Artifact 단서**: "이 파일", "X 스크립트", "SKILL.md", 명시된 경로
- **Test input 단서**: "이 screenshot.png", "이 PDF", 명시된 경로
- **Runner 단서**: 파일 확장자에서 추론 (.py → python, .html → playwright, 스킬 → Claude 직접 실행)

#### 패턴 C: 임무가 모호함
예: `/auto-research 영상 만들어봐`

1. 최근 대화와 `CLAUDE.md`, `input/`, `output/` 폴더 상태를 확인해 맥락 파악
2. 가장 그럴듯한 기본값으로 mission 제안
3. 사용자에게 **딱 한 번만** 요약 제시: "이렇게 이해했습니다. 맞으면 OK, 아니면 수정"
4. 확인 후에는 절대 다시 묻지 않음

### Step 0-2: mission.json 작성

```json
{
  "id": "{short-slug}",
  "description": "{사용자 원문}",
  "goal": {
    "metric": "{메트릭 이름}",
    "target": 0.95,
    "direction": "higher_is_better"
  },
  "artifact": ["scripts/generate_pptx.py"],
  "runner": "python scripts/generate_pptx.py {test_input} {output}",
  "evaluator": "python scripts/evaluate_pptx.py {output} {test_input}",
  "test_input": "input/pptx/test_3pages.pdf",
  "output_path": "output/pptx/test_3pages.pptx",
  "time_budget_minutes": 15,
  "runs_per_experiment": 1,
  "sidecar_metrics": ["wall_seconds", "peak_memory_mb", "output_size_kb"],
  "stop_when": "best_score >= 0.95 for 3 consecutive"
}
```

`autoresearch-runs/{id}/mission.json`에 저장한다.

**sidecar_metrics란?** goal은 단일이지만 소프트 제약으로 추적할 관찰 지표. 예: ML 학습이면 `peak_vram_mb`, `mfu_percent`; 문서 생성이면 `wall_seconds`, `output_size_kb`. results.tsv의 보조 컬럼으로 기록되고, tie-break(동점 판정) 시 참고한다. **goal에 영향을 주진 않지만 리소스 폭주를 감시**한다.

### Step 0-3: 실측 검증 (Existence Check)

mission.json을 저장하기 전에 다음을 **실제 파일 시스템으로 검증**한다:

- `test_input` 경로가 실제로 존재하는가? (Glob/Read로 확인)
- `evaluator` 스크립트가 실제로 존재하는가? (있으면 Phase 1 생략)
- `artifact` 경로의 각 파일이 존재하는가? (없는 파일은 Phase 3에서 생성됨을 명시)
- runner 명령이 요구하는 CLI 도구가 `PATH`에 있는가? (`python --version`, `uv --version` 등)

하나라도 실패하면 **이 단계에서만** 사용자에게 경로 수정을 요청한다. Phase 2부터는 재질문 금지.

### Step 0-4: 불변 필드 선언
- `evaluator`, `test_input`, `goal`은 실험 중 **절대 변경 금지**
- `artifact`, `runner`는 일반적으로 고정. 변경이 필요하면 사용자 승인 필요

### Step 0-5: 한 번만 확인

Phase 0가 자동 추론을 못 한 필드가 있거나, 사용자 임무가 패턴 C로 모호했으면 **이 단계에서 한 번만** 사용자에게 요약본을 보여주고 `OK/수정` 받는다. 그 외엔 바로 Phase 1으로 간다.

---

## Phase 1: 평가 체계 구축 (조건부)

**Phase 0에서 evaluator 경로가 지정되었고 해당 스크립트가 존재하면 Phase 1을 건너뛴다.**

Evaluator가 없으면 **반드시 먼저 이 파일을 Read한다**:

> **`references/evaluator-design.md`**

이 파일은 다음을 포함한다:
- Step 1-1~1-6 전체 프로세스 (도메인 추론, 웹서치, 표준 인터페이스, 이진 체크리스트, evaluator 동결)
- 도메인별 기본 메트릭 맵 (8개 도메인)
- autoresearch-win-rtx 원본 스타일의 multi-key summary 출력 포맷
- 이진 yes/no 체크리스트 설계 가이드 (eval-guide)

Read 후 그 워크플로우를 그대로 따른다. Phase 1 완료 후 Phase 2로 진행.

---

## Phase 2: 베이스라인 확립

### Step 2-1: 브랜치

```bash
TAG=$(date +%b%d | tr '[:upper:]' '[:lower:]')
BRANCH="autoresearch/{mission.id}/${TAG}"
git checkout -b "$BRANCH" 2>/dev/null || git checkout -b "${BRANCH}-2"
```

### Step 2-2: 작업 디렉토리

```
autoresearch-runs/{mission.id}/
├── mission.json        # Phase 0 결과. 불변.
├── results.tsv         # 실험 기록 (TSV, 쉼표 금지)
├── changelog.md        # 가설+결과 상세 로그
├── run.log             # 최신 실행 로그 (grep 대상)
├── baseline.backup/    # 원본 Artifact 백업 (복원용)
└── best/               # best_score 시점 Artifact 스냅샷
```

### Step 2-3: Artifact 백업

```bash
for f in "${mission.artifact[@]}"; do
  mkdir -p "autoresearch-runs/{id}/baseline.backup/$(dirname $f)"
  cp "$f" "autoresearch-runs/{id}/baseline.backup/$f"
done
```

### Step 2-4: 베이스라인 실행 (고정 시간 예산)

```bash
{runner} > autoresearch-runs/{id}/run.log 2>&1
SCORE=$(python {evaluator} {output} {test_input} 2>> autoresearch-runs/{id}/run.log | tail -1)
```

**중요**: runner/evaluator 출력을 **절대 stdout으로 흘려넣지 않는다**. 전부 `run.log`로 리다이렉트하고 `tail -1` 또는 `grep "^score:"`로 한 줄만 회수한다. 이는 context window 보호의 핵심.

### Step 2-5: 재현성 체크 (LLM 실행인 경우)

Runner가 비결정론적이면(LLM, Claude 직접 실행, 샘플링 포함 등) 베이스라인을 `runs_per_experiment` 회(기본 3회) 실행해 평균과 분산을 기록한다. 결정론적 스크립트면 1회면 충분.

### Step 2-6: results.tsv 초기화

results.tsv는 **tab-separated** (쉼표 금지 — description에 쉼표가 들어가면 깨진다).

**고정 컬럼**: `experiment`, `commit`, `score`, `status`, `description`, `timestamp`
**동적 컬럼**: `mission.sidecar_metrics`에 정의된 각 항목 (예: `wall_seconds`, `peak_memory_mb`)

포맷 규칙:
- `experiment`: 0부터 시작하는 정수
- `commit`: **짧은 7자 해시** (`git rev-parse --short HEAD`)
- `score`: 소수점 **6자리** (예: `0.997900`, crash 시 `0.000000`)
- `status`: `baseline` | `keep` | `discard` | `crash`
- `description`: 간결한 한 문장 (쉼표 금지)
- `timestamp`: ISO 8601
- sidecar 수치: 각 정수/실수 1개씩 (없으면 빈 값, crash 시 0)

**예시 (ML 학습 mission):**
```
experiment	commit	score	status	description	timestamp	wall_seconds	peak_vram_mb
0	a1b2c3d	0.997900	baseline	original train.py	2026-04-10T09:00:00+09:00	325.9	45060
1	b2c3d4e	0.993200	keep	increase LR to 0.04	2026-04-10T09:06:00+09:00	324.1	45088
```

### Step 2-7: 시작 선언

```
=== auto-research 시작 ===
임무: {description}
목표: {metric} {direction} {target}
Artifact: {artifact}
Runner: {runner}
Evaluator: {evaluator}
Test input: {test_input}
Time budget: {time_budget_minutes}분
베이스라인: {score} (±{std} over {runs} runs)
브랜치: {branch}
중단: Ctrl+C
-----
실험 시작.
```

---

## Phase 3: 실험 루프 (NEVER STOP)

루프를 시작하기 전에 **반드시 이 파일을 한 번 Read한다**:

> **`references/experiment-loop.md`**

이 파일은 다음을 포함한다:
- Step 3-1~3-10 전체 (상태 분석, 가설 도출, 수정, 커밋, 실행, 평가, 판정, 기록, 완료 조건, 연속 discard 대응)
- 좋은/나쁜 가설 카탈로그
- crash 디버깅 플로우 (`tail -n 50` 패턴)
- Simplicity criterion 구체 예시
- changelog.md 포맷
- 연속 discard 대응 전략 표

**한 번 Read하면 세션 내내 context에 유지된다. 루프 중 반복 Read 금지** (context 낭비 + autoresearch 원본의 "run.log 리다이렉트" 철학 위반).

Read 완료 후 루프 진입:

```
LOOP FOREVER:
  1. Step 3-1: 상태 분석 (results.tsv + changelog.md 최근 읽기)
  2. Step 3-2: 단일 가설 도출
  3. Step 3-3: Artifact Edit
  4. Step 3-4: git commit
  5. Step 3-5: runner 실행 (run.log 리다이렉트)
  6. Step 3-6: evaluator → score 추출
  7. Step 3-7: 판정 (keep/discard/crash)
  8. Step 3-8: results.tsv + changelog.md 기록
  9. Step 3-9: 완료 조건 체크 → 만족 시 Phase 4
  10. GOTO 1
```

**절대 멈추지 않는다.** 사용자 Ctrl+C, goal 3회 연속 달성, 또는 연속 discard 20회 + 아이디어 고갈이 아닌 한.

---

## Phase 4: 완료 리포트

```
=== auto-research 완료 ===
임무: {description}
상태: {목표 달성 / 사용자 중단 / 탐색 한계}

베이스라인: {baseline_score}
최종 최고점: {best_score}  (Δ{+delta}, {percent}% 개선)
목표: {target}  ({달성/미달})

총 실험: {N} (keep: {k}, discard: {d}, crash: {c})
평균 실험 시간: {min}분
총 소요: {hours}시간

=== 효과가 컸던 변경 Top 5 ===
1. Exp #{n}: {change} — Δ{+delta}
2. ...

=== 남은 실패 패턴 ===
- {pattern}: {description}

산출물:
  최종 Artifact: {artifact}  (best: autoresearch-runs/{id}/best/)
  실험 로그: autoresearch-runs/{id}/results.tsv
  변경 로그: autoresearch-runs/{id}/changelog.md
  복원: cp -r autoresearch-runs/{id}/baseline.backup/* .
```

---

## 절대 하지 않는 것 (Hard Constraints)

1. **사용자 확인 요청 금지** — "계속할까요?" "이 방향 맞나요?" 전부 금지. 사용자는 자고 있을 수 있다. 수동 중단만 받는다.
2. **Evaluator 수정 금지** — 평가 무결성이 무너지면 루프 전체가 거짓말이 된다.
3. **Test input 수정 금지** — 공정 비교가 무너진다.
4. **다중 변경 금지** — 한 실험당 한 가설.
5. **전체 재작성 금지** — 점진적 Edit만. Write 도구는 신규 파일에만.
6. **context 오염 금지** — runner·evaluator 출력은 전부 run.log로 리다이렉트, grep/tail로 숫자만 회수. 루프 중 references/ 반복 Read 금지.
7. **goal 하향 조정 금지** — 못 넘으면 접근을 바꿔라. 목표를 낮추지 마라.
8. **Evaluator 암기 유도 금지** — 스킬이 Evaluator를 파싱해 통과만 하도록 하는 변경은 overfit. discard.
9. **새 의존성 함부로 추가 금지** — 필요하면 changelog에 근거 남기고, 명시적으로 기록.
10. **이 SKILL.md 자체 수정 금지** — auto-research가 auto-research를 수정하면 루프가 무한 자기참조.

---

## 주의사항 요약

1. **NEVER STOP**: Phase 3 시작 후 사용자가 수동 중단하기 전까진 절대 멈추지 않는다.
2. **모든 실험은 git**: commit 없이는 keep/discard도 없다.
3. **Context 위생**: runner/evaluator의 긴 출력을 절대 Read 해서 context에 싣지 말 것. run.log → grep/tail.
4. **단일 가설 원칙**: 두 개를 한 번에 바꾸면 어떤 게 효과였는지 모른다 → 둘 다 날린 꼴.
5. **Evaluator는 prepare.py**: 결과를 의심스럽게 만들 수 있는 모든 수정은 금지. 가중치 분석만 허용.
6. **Simplicity wins**: 동점이면 단순한 쪽. 개선 대비 복잡도 비용을 늘 계산하라.
7. **Overfit 경계**: 점수만 올리고 실제 품질이 떨어지면 Evaluator 설계가 잘못된 것. `references/evaluator-design.md`의 Step 1-5 재검토.
8. **백업과 복원 경로 명시**: 사용자가 언제든 원상 복구할 수 있어야 한다.

---

## 참조 파일

- `references/evaluator-design.md` — Phase 1 전체 (evaluator 없을 때 Read)
- `references/experiment-loop.md` — Phase 3 전체 (Phase 3 진입 시 1회 Read)
- `references/examples.md` — 4가지 실행 예시 (맥락 필요 시 Read)
