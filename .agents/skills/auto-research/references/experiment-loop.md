# Phase 3: 실험 루프 가이드

> **이 파일은 언제 읽어야 하나?**
> Phase 2(베이스라인) 완료 후 Phase 3 루프 시작 직전에 **딱 한 번** Read.
> 한 번 읽으면 세션 내내 context에 유지되므로 루프 100회 동안 **절대 재Read 금지**.
> 재Read는 autoresearch-win-rtx 원본의 "run.log 리다이렉트" context 보호 철학에 정면 위배.

---

## 루프 구조 (NEVER STOP)

```
LOOP FOREVER:
  Step 3-1: 상태 분석
  Step 3-2: 가설 도출 (ONE change)
  Step 3-3: Artifact Edit
  Step 3-4: git commit
  Step 3-5: runner 실행 (run.log 리다이렉트)
  Step 3-6: evaluator → score 추출
  Step 3-7: 판정 (keep/discard/crash)
  Step 3-8: results.tsv + changelog.md 기록
  Step 3-9: 완료 조건 체크 → 만족 시 Phase 4
  GOTO Step 3-1
```

**사용자 Ctrl+C, goal 3회 연속 달성, 또는 연속 discard 20회 + 아이디어 고갈이 아닌 한 절대 멈추지 않는다.**

---

## Step 3-1: 상태 분석

매 사이클 시작 시 다음을 수행:

1. `results.tsv` **최근 10개 행**만 읽기 → 추세 파악 (`tail -n 11 results.tsv`)
2. `changelog.md` **최근 5개 엔트리**만 읽기 → 중복 가설 방지
3. 연속 discard 수 계산 (tail로 status 컬럼만)
4. 현재 `best_score` 확인 (results.tsv에서 max)

**context 주의**: 전체 results.tsv/changelog.md 읽기 금지. 매번 tail로 최근 것만.

---

## Step 3-2: 가설 도출 (ONE change per experiment)

### 우선순위 표

| 순위 | 전략 | 언제 | 예시 |
|---|---|---|---|
| 1 | **실패 패턴 공략** | run.log에서 어떤 세부 지표가 낮은지 찾고, 그것만 다루는 변경 | `sub_ssim 0.72`로 낮음 → slide3 도형 좌표 정밀화 |
| 2 | **keep 방향 연장** | 직전 keep이 효과적이면 그 방향을 더 깊이 | #2에서 "카드 배경 추가"가 +0.03 → #3에서 "카드 테두리 강조" 시도 |
| 3 | **도메인 지식** | 웹서치 1~2쿼리로 최신 기법/모범 사례 찾고 적용 | "how to improve SSIM for document rendering" → Gaussian blur pre-processing |
| 4 | **근본 접근 변경** | 연속 discard 5회↑ 시 완전히 다른 방법 시도 | 도형 정밀화 대신 전체 레이아웃 재배치 |
| 5 | **단순화** | 점수 유지하며 복잡도 줄이기 → simplicity win | 20줄 하드코딩 → 10줄 루프로 |

### 좋은 가설 (Good)

- **특정 실패 사례에서 패턴 추출** → 그 패턴만 다루는 **단일 변경**
- **모호한 지시를 구체로 바꾸기** ("색상 정확히" → "HEX #2B7A9E")
- **anti-pattern 추가** (`Do NOT use add_picture`)
- **묻혀 있던 지시를 상단으로 올리기** (우선순위 = 위치)
- **worked example 추가** (잘된 출력 하나를 예시로)
- **하드코딩된 숫자 튜닝** (좌표 30% → 33%)
- **누락된 엣지 케이스 처리** (빈 입력, 경계 조건)

### 나쁜 가설 (Bad)

- **Artifact 전체 재작성** — 어떤 변경이 효과였는지 알 수 없음
- **5개 변경 한꺼번에** — 단일 가설 원칙 위배
- **이유 없는 길이 증가** — context 낭비
- **"더 좋게 만들어" 식 모호 지시** — 측정 불가
- **Evaluator 암기 유도** — 스킬이 Evaluator 파싱해서 통과만 노리는 변경 (overfit)
- **새 의존성 추가** — 환경 오염, 원본 철학 위반
- **sidecar 메트릭 최적화** — goal이 아닌 걸 올리는 건 의미 없음

---

## Step 3-3: Artifact 수정

Edit 도구로 **ONE 변경**만. 다중 변경은 실험 무효.

### 수정 절대 불가 (Hard boundary)

- `{evaluator}` 스크립트 및 참조 파일
- `{test_input}` 및 expected output
- `mission.json`
- `.claude/skills/auto-research/SKILL.md` 및 `references/*` (스킬 자체)
- `autoresearch-runs/{id}/baseline.backup/*` (복원용 백업)
- 다른 Mission의 Artifact

### 수정 가능

- `mission.artifact[]` 에 나열된 파일만
- 여러 파일이 artifact에 있어도, **한 실험당 한 파일 한 변경**이 이상적
- 파일 여러 개를 동시에 바꿔야만 의미 있는 가설이라면 (예: 인터페이스 변경), 그 경우는 **하나의 논리적 변경**으로 간주하고 커밋 메시지에 이유 명시

---

## Step 3-4: 커밋

```bash
git add {artifact}
git commit -m "experiment #{N}: {한 문장 변경 설명}"
```

**커밋 메시지 규칙**:
- 영어 또는 한글 OK, 일관성만 유지
- 60자 이내
- 무엇을 바꿨는지 + 왜 바꿨는지 (기대 효과)
- 예: `experiment #7: slide2 허브 다이어그램 디테일 추가 (풍부도 0.567→target 1.0)`

**금지**:
- `git commit --amend` — autoresearch-win-rtx 원본 지침: 실험은 새 커밋으로 추적
- Pre-commit hook skip (`--no-verify`) — 보안 원칙 위배

---

## Step 3-5: 실행 (고정 시간 예산)

```bash
# 벽시계 제한 예: 15분
# bash: timeout이 없는 Windows 환경이면 Python subprocess에 timeout 인자 사용
START=$(date +%s)
(timeout {time_budget}m {runner}) > autoresearch-runs/{id}/run.log 2>&1
RUNNER_EXIT=$?
WALL=$(( $(date +%s) - START ))
```

### runner 출력 권장 포맷

autoresearch-win-rtx 원본의 multi-key summary 패턴. runner가 통제 가능하면 끝부분에 `KEY: VALUE` 한 줄씩:

```
---
score:            0.997900
wall_seconds:     325.9
peak_memory_mb:   45060.2
output_size_kb:   128
---
```

**이유**: `grep "^score:" run.log | awk '{print $2}'`로 메인 메트릭만 추출하고, 동일한 패턴으로 sidecar 메트릭도 추출할 수 있다. context window에 로그 본문이 흘러들어가지 않는다.

```bash
SCORE=$(grep "^score:" autoresearch-runs/{id}/run.log | awk '{print $2}')
```

runner가 이 포맷을 따르지 않으면(외부 도구 등) evaluator가 대신 출력한다 (Step 3-6 참조).

### 크래시 처리 (autoresearch-win-rtx 원본 준수)

- `RUNNER_EXIT != 0` 또는 `SCORE` 추출 실패 → crash 가능성
- **즉시 `tail -n 50 autoresearch-runs/{id}/run.log`로 stack trace만 읽는다** (전체 로그 읽기 금지 — context 오염)
- stack trace 내용에 따라 판단:
  - typo, import 누락, 경로 오타 등 **단순 오류** → 즉시 1회만 수정 후 재실행 (`git commit --amend` 금지, 새 commit)
  - 접근 방식 자체가 근본적으로 틀림 → `crash` 기록, `git reset --hard HEAD~1`, 다음 실험
- **"몇 번 시도해도 안 되면 포기"** — 원본 program.md 지침: "If you can't get things to work after more than a few attempts, give up."

---

## Step 3-6: 평가

```bash
SCORE=$(python {evaluator} {output} {test_input} 2>> autoresearch-runs/{id}/run.log | tail -1)
```

또는 runner가 이미 score를 출력했다면:

```bash
SCORE=$(grep "^score:" autoresearch-runs/{id}/run.log | awk '{print $2}')
```

점수가 숫자가 아니면 crash.

**LLM 기반 runner**는 `runs_per_experiment`회 실행 후 평균. 분산이 크면 신뢰구간 체크 — 평균 개선이 분산(std)보다 작으면 noise로 판정하고 **discard**.

예: baseline 3.2±0.4, 실험 평균 3.3 → 개선 +0.1 < std 0.4 → noise, discard.

---

## Step 3-7: 판정

| 조건 | 판정 | 액션 |
|---|---|---|
| `score > best_score` (유의미한 개선, 분산 고려) | **keep** | `best_score ← score`, `best/` 갱신 |
| `score ≈ best_score` AND Artifact 더 단순 | **keep** | simplicity win |
| `score ≤ best_score` | **discard** | `git reset --hard HEAD~1` |
| crash / 숫자 아님 | **crash** | `git reset --hard HEAD~1`, score=0 |

### Simplicity criterion 구체 예시 (원본 autoresearch-win-rtx 계승)

원본 program.md 인용:
> "A small improvement that adds ugly complexity is not worth it.
> A 0.001 val_bpb improvement from deleting code? Definitely keep."

| 변화 | 복잡도 | 판정 | 근거 |
|---|---|---|---|
| `+0.001 개선 + 20줄 해킹 코드 추가` | ↑↑ | **discard** | 복잡도 대비 이익 너무 작음 |
| `+0.001 개선 + 10줄 삭제` | ↓↓ | **keep** | 개선 + 단순화 = 이중 이익 |
| `점수 동등 + 코드 대폭 단순화` | ↓↓ | **keep** | simplification win (원본 철학) |
| `+0.05 개선 + 20줄 추가` | ↑ | **keep** | 큰 개선은 값짐 |
| `+0.005 개선 + 5줄 추가` | ↑ | **keep** | 균형 OK |
| `+0.005 개선 + 100줄 추가 + 새 의존성` | ↑↑↑ | **discard** | 복잡도 비용 과다 |
| `-0.002 하락 + 50줄 삭제` | ↓↓ | **discard** | 단순화 좋지만 점수 하락은 불허 |

**핵심**: 점수와 복잡도를 **동시에** 평가한다. 점수만 보면 원본 철학이 깨진다.

### best/ 스냅샷 갱신

keep 판정 시:

```bash
rm -rf autoresearch-runs/{id}/best/
mkdir -p autoresearch-runs/{id}/best/
for f in "${mission.artifact[@]}"; do
  mkdir -p "autoresearch-runs/{id}/best/$(dirname $f)"
  cp "$f" "autoresearch-runs/{id}/best/$f"
done
```

`best/`는 항상 최고 점수 시점의 Artifact 전체 스냅샷. 나중에 복원용으로 쓸 수도 있고, 연속 discard 시 "여기서 다시 출발"할 수도 있다.

---

## Step 3-8: 기록

### results.tsv 한 줄 추가 (tab-separated, 쉼표 금지)

```
{N}	{commit7}	{score}	{status}	{description}	{iso}	{wall_seconds}	{peak_memory_mb}	...
```

- `{commit7}`: `git rev-parse --short HEAD` (7자)
- `{score}`: 소수점 6자리 (`printf "%.6f"`)
- `{status}`: `keep` / `discard` / `crash`
- `{description}`: 한 문장, 쉼표 금지 (쉼표 들어가면 TSV 파싱 깨짐)
- `{iso}`: ISO 8601 timestamp
- sidecar 컬럼: mission.json의 `sidecar_metrics` 순서 그대로

### changelog.md 엔트리 추가

```markdown
## Experiment {N} — {keep/discard/crash}
- **Score**: {score} (best: {best})
- **Hypothesis**: 왜 이게 효과 있을 거라 생각했나 (한 문장, 2-3개 bullet OK)
- **Change**: 한 문장으로 정확히 뭘 바꿨나 (파일:라인 명시)
- **Result**: run.log에서 어떤 세부 지표가 올랐나/내렸나 (sub_ssim: 0.72→0.79 등)
- **Next hint**: 이 결과로부터 다음 실험에 주는 단서
```

**이 changelog가 가장 값진 산출물이다.** 다음 세션 또는 더 똑똑한 미래 모델이 이어받아 실행할 수 있다. results.tsv는 정량, changelog는 정성적 추론 기록.

---

## Step 3-9: 완료 조건 체크

다음 중 하나를 만족하면 Phase 4로 진행:

1. **사용자 Ctrl+C** — 즉시 Phase 4
2. **`best_score >= goal.target` 상태가 3회 연속** — 재현성 확인. 한 번 우연히 찍었을 수 있으므로 3회 연속 이상 확인
3. **연속 discard 20회 AND 웹서치 + 근본 접근 변경 후에도 개선 없음** — 현재 접근의 탐색 공간 고갈

그 외엔 **절대 멈추지 않는다**. Step 3-1으로 GOTO.

### "계속할까요?" 금지

사용자는:
- 자고 있을 수 있다
- 다른 작업을 하고 있을 수 있다
- 의도적으로 밤새 돌리는 중일 수 있다 (원본 autoresearch의 주 사용 패턴)

"100회 돌았는데 계속할까요?" 같은 질문은 **NEVER STOP 원칙 위반**. 사용자가 중단하지 않는 한 돌려라.

---

## Step 3-10: 연속 discard 대응 전략

**원본 autoresearch-win-rtx 원칙**: "rewind는 very very sparingly (if ever)". 과거 상태로의 복귀는 기본이 아니라 **최후 수단**이다. 루프 본연의 동작은 현재 branch에서 앞으로 나아가며 새 가설을 시도하는 것이다.

| 연속 | 전략 | 복귀 허용? |
|---|---|---|
| 3회 | 직전 keep 방향을 더 깊이 탐색 | ❌ |
| 5회 | 웹서치 1쿼리로 새 접근법 조사, 근본 방향 전환. 여전히 현재 branch에서 전진 | ❌ |
| 10회 | 최초의 rewind 후보: `best/` 스냅샷 복원은 **최후 수단**. 가능하면 더 창의적인 실험 먼저 시도 | ⚠ 허용하되 신중 |
| 15회 | Evaluator의 가중치·지표 재검토 (스크립트 수정 금지, 분석 리포트만). 측정이 잘못됐는지 확인 | ⚠ |
| 20회 | Phase 4 완료 리포트 | — |

### rewind 전에 반드시 시도할 것

- 기존 failing pattern에 대한 **더 급진적인 변경** (architecture 자체 변경, 파라미터 공간의 다른 영역)
- `mission.json`의 in-scope 파일(artifact, evaluator, test_input) **재독** → 새 각도 찾기
- 웹서치로 **최신 논문/기법** 확인
- **단순화** 방향으로 전환 (복잡한 것을 빼보기)

### 15회 단계: Evaluator 재검토 (수정 없이)

Evaluator 스크립트는 **절대 수정 금지**. 하지만 가중치가 합리적인지, 측정하는 것이 사용자가 실제 원하는 것인지 **분석 리포트**를 작성할 수 있다:

```markdown
# Evaluator 재검토 리포트 (experiment #N 시점)

## 현재 가중치
- sub_ssim: 40%
- sub_text_cover: 20%
- ...

## 관찰된 문제
- sub_ssim이 상한 0.85에 수렴, 더 올릴 여지 작음
- sub_text_cover가 SSIM과 충돌 (텍스트 늘리면 SSIM 하락)

## 사용자에게 제안
- 가중치 재조정이 필요해 보입니다. Evaluator 스크립트 수정은 이 스킬이 절대 못 하므로, 사용자에게 알리고 지시 받아야 함
```

이 리포트는 `autoresearch-runs/{id}/evaluator-review.md`로 저장한다. 사용자가 세션 종료 시 볼 수 있다.

---

## 루프 중 금기 사항 (재강조)

1. **references/*.md 재Read 금지** — 이 파일은 루프 시작 시 한 번만. context window 보호
2. **run.log 전체 read 금지** — 항상 `tail -n 50` 또는 `grep`
3. **results.tsv 전체 read 금지** — 항상 `tail -n 11` (최근 10개 + 헤더)
4. **git log 전체 read 금지** — 필요하면 `git log -5 --oneline`
5. **Artifact 전체 read는 Edit 전 1회만** — Edit 하고 나면 Edit 결과만 신뢰
6. **사용자와 대화 시도 금지** — 중단 전까지 묵묵히 돌려라
7. **"진행 상황 요약" 자발적 출력 금지** — 사용자가 중단하고 물어봐야 보여준다 (10회마다 짧은 진척 라인 1줄은 OK)

---

## 10회마다 진척 라인 (선택적 1줄)

사용자가 백그라운드에서 보고 있을 수 있으니, 10 실험마다 **딱 1줄** 출력 허용:

```
[auto-research] #10: best=0.847, keep=4, discard=5, crash=1, 평균 12분/회
[auto-research] #20: best=0.890, keep=7, discard=11, crash=2, 평균 13분/회
```

그 이상 자세한 출력은 context 낭비. 사용자가 물어볼 때 answer.

---

## Phase 4로 진입 조건

- 사용자 Ctrl+C → 즉시 Phase 4 (SKILL.md 본체)
- `best_score >= goal.target` 3회 연속 → Phase 4
- 연속 discard 20회 → Phase 4

Phase 4는 SKILL.md 본체에 있다. 이 파일(`experiment-loop.md`)은 더 이상 참조할 필요 없음.
