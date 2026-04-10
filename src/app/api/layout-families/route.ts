// @TASK P1-R2-T1 - Layout Families API 엔드포인트
// @SPEC GET /api/layout-families - 8개 레이아웃 패밀리 카탈로그 반환

import { NextResponse } from "next/server";
import { layoutFamilies } from "@/data/layout-families";

export async function GET() {
  return NextResponse.json(layoutFamilies);
}
