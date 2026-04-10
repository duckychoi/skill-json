텍스트 목차 또는 제목을 받아 Remotion 기반 슬라이드 영상을 자동 생성합니다.
SRT/MP3 없이 동작합니다.

입력:
- 제목만: `/reat-slides "프로젝트 소개"` → Claude가 목차 자동 구성
- 목차 포함: 대화에서 슬라이드 목차를 함께 제공
- 파일 참조: `/reat-slides docs/outline.md`

출력:
- data/{projectId}/scenes-v2.json (슬라이드별 stack_root)
- data/{projectId}/render-props-v2.json
- output/{projectId}.mp4

스킬 파일: .claude/skills/reat-slides/SKILL.md 참고
