---
name: tools-frontend
description: URL을 주면 실제 브라우저로 열고, 마우스 좌표·요소 라벨 오버레이와 우측 사이드 툴패널을 주입합니다.
---
# /tools-frontend — 프론트엔드 개발 오버레이 툴

> URL을 주면 실제 브라우저로 열고, 마우스 좌표·요소 라벨 오버레이와 우측 사이드 툴패널을 주입합니다.

## 실행 원칙

사용자에게 확인 없이 즉시 실행한다.

## 트리거

```
/tools-frontend "https://example.com"
/tools-frontend "http://localhost:3000"
```

## 기능

| 기능 | 설명 |
|------|------|
| 마우스 좌표 | 좌상단에 `x: 120, y: 340` 실시간 표시 |
| 요소 라벨 | 호버 시 툴팁: `버튼 · 로그인`, `네비게이션`, `입력필드 · 이메일` 등 |
| 요소 하이라이트 | 호버 요소에 네온그린 테두리 표시 |
| TOOLS 사이드패널 | 오른쪽 끝 버튼 클릭으로 슬라이드 인 |
| 스크린샷 | 패널 내 버튼 클릭 → PNG 저장 + 미리보기 |
| 메모/채팅 | 패널 내 텍스트 입력 → `temp/screenshots/chat.log` 저장 |

## 워크플로우

### Step 1: overlay.js 실행

```bash
node .claude/skills/tools-frontend/overlay.js "URL"
```

백그라운드 실행 (브라우저가 계속 열려있어야 함):
```bash
node .claude/skills/tools-frontend/overlay.js "URL" &
```

**초기 설정 (최초 1회, playwright 미설치 시):**
```bash
npm install playwright
npx playwright install chromium
```

### Step 2: 사용자가 좌표 알려주면 수정 작업

사용자가 "(120, 340) 부근에 저장 버튼 만들어줘" 하면:
- 해당 URL의 소스 파일을 찾아 해당 위치에 버튼 추가
- 또는 CSS 절대/고정 위치로 버튼 주입

### Step 3: 스크린샷 확인

스크린샷은 `temp/screenshots/` 폴더에 저장됨. Read 툴로 이미지 확인 가능.

## 로컬 서버 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `localhost:3033/screenshot` | GET | 현재 화면 PNG 캡처 |
| `localhost:3033/chat` | POST | 메모 로그 저장 |

## 재주입

페이지 이동 후 오버레이가 사라지면 재주입:
```bash
# Node.js 콘솔에서 자동으로 framenavigated 이벤트로 재주입됨
```

## 레퍼런스 문서

TOOLS 패널에 아래 두 링크가 고정되어 있음:
- **shadcn/ui Docs**: https://ui.shadcn.com/docs
- **Component Gallery**: https://component.gallery/components/

사용자에게 컴포넌트/디자인 용어를 설명할 때 `.claude/skills/tools-frontend/design-reference.md` 참고.
주요 내용: Button variants, Design tokens, Compound components, ARIA 속성, 반응형 breakpoints, 바이브 코딩 용어

## 주의사항

- `node temp/tools-frontend.js` 는 브라우저가 닫힐 때까지 실행 유지
- 포트 3033이 이미 사용 중이면 기존 프로세스 종료 후 재실행
- CSP(Content Security Policy)가 strict한 사이트는 일부 기능 제한될 수 있음
