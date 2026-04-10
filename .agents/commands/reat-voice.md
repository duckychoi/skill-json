대본(script.json)을 ElevenLabs TTS로 변환하여 MP3 + SRT를 자동 생성합니다.

입력: projectId (data/{projectId}/script.json 필요)
옵션: --preview (첫 챕터만 테스트)

실행:
1. script.json 로드
2. 챕터별 ElevenLabs TTS API 호출 (with-timestamps)
3. MP3 병합 + SRT 자동 생성
4. input/{projectId}.mp3 + input/{projectId}.srt 저장

스킬 파일: .claude/skills/reat-voice/SKILL.md 참고
