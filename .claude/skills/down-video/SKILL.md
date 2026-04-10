---
name: down-video
description: Instagram, Threads, YouTube URL을 입력하면 플랫폼별 폴더에 키워드 기반 제목으로 자동 저장합니다.
---
# /down-video — SNS/YouTube 영상 다운로드

> Instagram, Threads, YouTube URL을 입력하면 플랫폼별 폴더에 키워드 기반 제목으로 자동 저장합니다.

## 실행 원칙

**사용자에게 확인 없이 모든 단계를 자동으로 실행한다.** Bash 명령어, 파일 생성, 다운로드 등 모든 작업을 즉시 실행하고 결과만 보고한다. 중간에 물어보지 않는다.

## 트리거

```
/down-video "https://www.youtube.com/watch?v=xxxx"
/down-video "https://www.instagram.com/reel/xxxx/"
/down-video "https://www.threads.net/@user/post/xxxx"
```

## 입력

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| URL | ✅ | Instagram / Threads / YouTube URL |

## 출력 경로

| 플랫폼 | 저장 경로 |
|--------|----------|
| YouTube | `D:/product/skill-json/output/down/youtube/` |
| Instagram | `D:/product/skill-json/output/down/instagram/` |
| Threads | `D:/product/skill-json/output/down/threads/` |

## 워크플로우

### Step 1: 플랫폼 감지

URL 패턴으로 플랫폼 판별:
- `youtube.com` 또는 `youtu.be` → YouTube
- `instagram.com` → Instagram
- `threads.net` → Threads

### Step 2: 메타데이터 추출

yt-dlp로 제목/설명 추출:
```bash
yt-dlp --print "%(title)s\n%(description)s" --no-download "URL"
```

추출된 텍스트에서 키워드 추출 규칙:
- 영문/한글 명사 위주로 3~5개 핵심 키워드 선별
- 특수문자, 공백 → `_` 치환
- 최대 50자로 제한
- 예: "AI가 바꿔놓은 디자인 업계 현실" → `AI_디자인_업계_현실`

### Step 3: 다운로드 실행

```bash
yt-dlp \
  -o "OUTPUT_DIR/KEYWORD_TITLE.%(ext)s" \
  --no-playlist \
  --merge-output-format mp4 \
  "URL"
```

**플랫폼별 추가 옵션:**

| 플랫폼 | 추가 옵션 |
|--------|----------|
| YouTube | `-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]"` |
| Instagram | `-f best` (기본값으로 충분) |
| Threads | `-f best` (기본값으로 충분) |

### Step 4: 결과 보고

다운로드 완료 후:
- 저장된 파일 경로 출력
- 파일 크기 출력
- 영상 길이(초) 출력

## 실행 예시

**입력:**
```
/down-video "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Claude 처리 흐름:**
1. URL → YouTube 판별
2. yt-dlp로 제목 추출: "Rick Astley - Never Gonna Give You Up"
3. 키워드 생성: `Rick_Astley_Never_Gonna_Give_Up`
4. 다운로드: `D:/product/skill-json/output/down/youtube/Rick_Astley_Never_Gonna_Give_Up.mp4`
5. 결과 보고

## 플랫폼별 다운로드 방식

| 플랫폼 | 도구 | 비고 |
|--------|------|------|
| YouTube | yt-dlp | 직접 지원 |
| Instagram | yt-dlp | 직접 지원 |
| Threads | Playwright → curl | yt-dlp 미지원, JS 렌더링 필요 |

### Threads 전용 워크플로우

yt-dlp가 Threads를 지원하지 않으므로 Node.js Playwright로 영상 URL을 추출 후 curl로 다운로드:

```bash
# 1. Playwright로 cdninstagram .mp4 URL 추출
node temp/threads_dl.js

# 2. 추출된 URL을 curl로 다운로드
curl -L -o "output/down/threads/FILENAME.mp4" \
  -H "Referer: https://www.threads.com/" \
  "VIDEO_URL"
```

`temp/threads_dl.js` 스크립트:
```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext()).newPage();
  const videoUrls = [];
  page.on('response', res => {
    if (res.url().includes('.mp4') && res.url().includes('cdninstagram'))
      videoUrls.push(res.url());
  });
  await page.goto('THREADS_URL', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log(JSON.stringify(videoUrls[0]));
  await browser.close();
})();
```

## 주의사항

- yt-dlp, Node.js + Playwright 필요
- Threads 비공개 계정은 다운로드 불가 (로그인 세션 없이 headless 브라우저 접근 불가)
- 저작권이 있는 콘텐츠는 개인 학습/레퍼런스 용도로만 사용할 것

## 실패 대응

| 에러 | 원인 | 해결 |
|------|------|------|
| `ERROR: Unsupported URL` | yt-dlp가 해당 플랫폼 미지원 | Threads라면 Playwright 방식 사용 |
| `HTTP Error 401` | 로그인 필요 | 비공개 계정은 다운로드 불가 |
| `HTTP Error 429` | 요청 과다 | 잠시 후 재시도 |
| `ffmpeg not found` | ffmpeg 미설치 | `winget install ffmpeg` |
