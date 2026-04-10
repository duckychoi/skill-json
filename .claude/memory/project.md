# newVideoGen 프로젝트 정보

## 개요
SRT 자막 + 더빙 오디오 → AI가 프레젠테이션 영상 자동 생성

## 기술 스택
- Frontend: Next.js 15 + Tailwind CSS + ShadCN UI
- Video: Remotion (1920x1080, 30fps)
- Backend: Next.js API Routes (파일 시스템 기반)
- Language: TypeScript (strict)
- State: Zustand
- Test: Vitest + Playwright

## 4층 파이프라인
1. 의미 청킹 (SRT → 의미 역할 + 비트 분해)
2. 장면 DSL (제약 기반 변주, 8개 레이아웃 패밀리)
3. 타임라인 에디터 (웹 UI, 구간 편집)
4. Remotion 렌더링 (DSL → TSX → mp4)

## 8개 레이아웃 패밀리
hero-center, split-2col, grid-4x3, process-horizontal,
radial-focus, stacked-vertical, comparison-bars, spotlight-case

## 디자인 시스템
- 배경: #000000 (다크)
- 액센트: #00FF00 (네온 그린)
- 폰트: Inter

## 도메인 리소스
- project, scenes, audio, render_job, layout_families

## 3개 화면
- S1: 타임라인 에디터 (/, main-sidebar)
- S2: Remotion 프리뷰 (/preview, full-width)
- S3: 렌더 출력 (/render, full-width)
