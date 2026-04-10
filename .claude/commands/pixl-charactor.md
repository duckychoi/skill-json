사진/이미지를 128x128 2D 픽셀 게임 캐릭터로 변환합니다. PixelLab API 사용.

입력: 이미지 파일 경로
옵션: --style (rpg/platformer/chibi), --view (side/low top-down), --direction (south/east/west/north), --bg (transparent/solid)

출력:
- output/pixl/{캐릭터명}/character_128x128.png (메인 캐릭터)
- character_skeleton.json (스켈레톤 키포인트)
- character_metadata.json (높이/비율 정보)
- character_directions/ (4방향 회전, 선택)

스킬 파일: .claude/skills/pixl-charactor/SKILL.md 참고
