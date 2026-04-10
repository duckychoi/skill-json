---
description: 사용자가 준 임무를 자율적으로 완수하는 무한 실험 루프. autoresearch-win-rtx 철학 계승 + 범용화.
---

사용자의 임무를 완수할 때까지 무한 실험하는 자율 연구 루프를 실행합니다.
autoresearch-win-rtx의 핵심 철학(고정 시간 예산, 단일 메트릭, 단일 파일 수정, git keep/discard, run.log 리다이렉트, NEVER STOP, simplicity criterion)을 그대로 계승하되, ML 학습에 한정하지 않고 어떤 임무에든 적용합니다.

입력: 자연어 임무 문장 또는 스킬 ID
  - `/auto-research pptx-generate` (스킬 개선)
  - `/auto-research scripts/generate_pptx.py 로 test_3pages.pdf와 시각적으로 동일한 PPT 만들어` (스크립트 개선)
  - `/auto-research screenshot.png와 동일한 index.html` (웹 클론)
  - `/auto-research train.py val_bpb 0.9 이하` (모델 학습)

$ARGUMENTS

실행 순서:
1. `.claude/skills/auto-research/SKILL.md` 전체를 읽고 워크플로우를 그대로 따른다
2. $ARGUMENTS에서 Mission을 해석한다 (Phase 0)
3. Evaluator가 없으면 웹서치로 평가 체계를 설계한다 (Phase 1)
4. 베이스라인 확립 (Phase 2)
5. 무한 실험 루프를 시작하고 사용자가 Ctrl+C 할 때까지 절대 멈추지 않는다 (Phase 3)

스킬 파일: .claude/skills/auto-research/SKILL.md
