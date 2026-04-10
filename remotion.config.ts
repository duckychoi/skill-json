// @TASK P0-T0.2 - Remotion 설정
// Remotion Studio 및 CLI 렌더링에 적용되는 전역 설정입니다.

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// 병렬 렌더 스레드 수 (기본값: CPU 코어 수의 절반)
// 필요 시 Config.setConcurrency(N) 으로 명시 설정 가능

// 출력 코덱
Config.setCodec("h264");

// 픽셀 포맷
Config.setPixelFormat("yuv420p");

// CRF (품질): 0 ~ 51, 낮을수록 고품질 (기본 18)
Config.setCrf(18);

// 프리뷰 포트
// Config.setPort(3001);
