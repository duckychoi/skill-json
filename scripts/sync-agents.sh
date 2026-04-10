#!/usr/bin/env bash
# .claude/ → .agents/ 자동 동기화
# Claude Code PostToolUse 훅 및 git post-commit 훅에서 호출됨

PROJ_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$PROJ_ROOT/.claude"
DST="$PROJ_ROOT/.agents"

if [ ! -d "$SRC" ]; then
  echo "[sync-agents] .claude/ 폴더 없음, 스킵"
  exit 0
fi

rsync -a --delete "$SRC/" "$DST/" 2>/dev/null \
  || cp -r "$SRC/." "$DST/"

echo "[sync-agents] .agents/ 동기화 완료"
