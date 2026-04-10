---
description: AI 레이아웃 생성 — Claude가 직접 stack_root JSON 트리를 생성하여 36+ 노드를 자유 조합합니다.
---

아래 스킬 문서를 읽고 그에 따라 실행하세요.

## 인자
```
$ARGUMENTS
```

## 스킬 문서 로드

아래 파일을 반드시 읽고 지침을 따르세요:
```
Read: .claude/skills/reat-layout/SKILL.md
```

## 실행 순서

1. `.claude/skills/reat-layout/SKILL.md` 전체 읽기
2. `$ARGUMENTS`에서 projectId 추출 (첫 번째 인자)
3. `--scene N` 옵션이 있으면 특정 씬만 처리
4. 스킬 문서의 워크플로우를 순서대로 실행
