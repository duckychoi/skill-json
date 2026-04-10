에셋 스캔 + 태그 자동 생성을 실행합니다.

1. `npx tsx scripts/scan-assets.ts` 실행하여 `public/assets/` 스캔
2. manifest.json에서 태그가 부족한 파일(≤2개)을 찾아 Read 도구로 이미지를 직접 확인
3. 각 이미지에 대해 tags(5~10개), category, alt를 작성
4. manifest.json 업데이트
5. 결과 리포트 출력

인자: 없음 (또는 "refresh" — 새 파일만 태깅)

스킬 파일: .claude/skills/reat-assets/SKILL.md 참고
