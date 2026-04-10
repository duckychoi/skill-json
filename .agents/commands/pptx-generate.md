---
description: PDF나 이미지를 입력받아 시각적으로 동일한 PPT를 네이티브 요소로 생성합니다.
---

PDF/이미지의 모든 시각 요소(텍스트, 도형, 표, 화살표, 다이어그램)를 PowerPoint 네이티브 요소로 재현합니다.

입력: PDF 파일 또는 이미지 파일 경로
옵션: --output (출력 경로), --pages (페이지 범위), --dpi (해상도)

$ARGUMENTS

출력:
- output/{name}.pptx (생성된 PowerPoint)
- output/{name}_spec.json (슬라이드 명세)

스킬 파일: .claude/skills/pptx-generate/SKILL.md 참고
