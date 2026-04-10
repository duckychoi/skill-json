// @TASK P1-R2-T1 - Layout Families 정적 카탈로그 데이터
// @SPEC 8개 레이아웃 패밀리 정의

export interface LayoutFamily {
  id: string;
  name: string;
  description: string;
  preview_svg: string;
  stack_variants: string[];
}

export const layoutFamilies: LayoutFamily[] = [
  {
    id: "hero-center",
    name: "Hero Center",
    description: "중앙 헤드라인과 서브텍스트를 강조하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="40" y="30" width="120" height="20" fill="#333" rx="2"/><rect x="55" y="60" width="90" height="10" fill="#999" rx="2"/><rect x="70" y="80" width="60" height="10" fill="#999" rx="2"/></svg>`,
    stack_variants: ["default", "with-background-image", "gradient-overlay"],
  },
  {
    id: "split-2col",
    name: "Split 2-Column",
    description: "좌우 2분할로 콘텐츠를 배치하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="10" y="10" width="85" height="100" fill="#ddd" rx="2"/><rect x="105" y="10" width="85" height="100" fill="#ddd" rx="2"/></svg>`,
    stack_variants: ["text-image", "image-text", "text-text"],
  },
  {
    id: "grid-4x3",
    name: "Grid 4x3",
    description: "4x3 그리드로 다수의 항목을 표시하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="10" y="10" width="40" height="30" fill="#ddd" rx="2"/><rect x="55" y="10" width="40" height="30" fill="#ddd" rx="2"/><rect x="100" y="10" width="40" height="30" fill="#ddd" rx="2"/><rect x="145" y="10" width="40" height="30" fill="#ddd" rx="2"/><rect x="10" y="45" width="40" height="30" fill="#ddd" rx="2"/><rect x="55" y="45" width="40" height="30" fill="#ddd" rx="2"/><rect x="100" y="45" width="40" height="30" fill="#ddd" rx="2"/><rect x="145" y="45" width="40" height="30" fill="#ddd" rx="2"/><rect x="10" y="80" width="40" height="30" fill="#ddd" rx="2"/><rect x="55" y="80" width="40" height="30" fill="#ddd" rx="2"/><rect x="100" y="80" width="40" height="30" fill="#ddd" rx="2"/><rect x="145" y="80" width="40" height="30" fill="#ddd" rx="2"/></svg>`,
    stack_variants: ["uniform", "featured-first", "with-labels"],
  },
  {
    id: "process-horizontal",
    name: "Process Horizontal",
    description: "수평 프로세스 플로우를 표현하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><circle cx="30" cy="60" r="15" fill="#ddd"/><line x1="45" y1="60" x2="65" y2="60" stroke="#999" stroke-width="2"/><circle cx="80" cy="60" r="15" fill="#ddd"/><line x1="95" y1="60" x2="115" y2="60" stroke="#999" stroke-width="2"/><circle cx="130" cy="60" r="15" fill="#ddd"/><line x1="145" y1="60" x2="155" y2="60" stroke="#999" stroke-width="2"/><circle cx="170" cy="60" r="15" fill="#ddd"/></svg>`,
    stack_variants: ["arrows", "numbered", "icons"],
  },
  {
    id: "radial-focus",
    name: "Radial Focus",
    description: "중앙 요소를 중심으로 방사형으로 배치하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><circle cx="100" cy="60" r="20" fill="#333"/><circle cx="50" cy="30" r="12" fill="#ddd"/><circle cx="150" cy="30" r="12" fill="#ddd"/><circle cx="50" cy="90" r="12" fill="#ddd"/><circle cx="150" cy="90" r="12" fill="#ddd"/></svg>`,
    stack_variants: ["default", "with-connectors", "orbit"],
  },
  {
    id: "stacked-vertical",
    name: "Stacked Vertical",
    description: "수직으로 콘텐츠를 쌓아 표시하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="20" y="10" width="160" height="22" fill="#ddd" rx="2"/><rect x="20" y="37" width="160" height="22" fill="#ddd" rx="2"/><rect x="20" y="64" width="160" height="22" fill="#ddd" rx="2"/><rect x="20" y="91" width="160" height="22" fill="#ddd" rx="2"/></svg>`,
    stack_variants: ["simple", "alternating", "with-icons"],
  },
  {
    id: "comparison-bars",
    name: "Comparison Bars",
    description: "비교 바 차트 형태로 데이터를 시각화하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="20" y="15" width="140" height="14" fill="#5b9bd5" rx="2"/><rect x="20" y="35" width="100" height="14" fill="#ed7d31" rx="2"/><rect x="20" y="55" width="160" height="14" fill="#70ad47" rx="2"/><rect x="20" y="75" width="80" height="14" fill="#ffc000" rx="2"/><rect x="20" y="95" width="120" height="14" fill="#4472c4" rx="2"/></svg>`,
    stack_variants: ["horizontal", "vertical", "side-by-side"],
  },
  {
    id: "spotlight-case",
    name: "Spotlight Case",
    description: "특정 케이스나 사례를 스포트라이트로 강조하는 레이아웃",
    preview_svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#f0f0f0" rx="4"/><rect x="15" y="15" width="110" height="90" fill="#ddd" rx="4"/><rect x="135" y="15" width="50" height="25" fill="#bbb" rx="2"/><rect x="135" y="50" width="50" height="25" fill="#bbb" rx="2"/><rect x="135" y="85" width="50" height="20" fill="#bbb" rx="2"/></svg>`,
    stack_variants: ["quote", "metric", "testimonial"],
  },
];
