# 바이브 코딩 & 디자인 용어 레퍼런스

출처: https://ui.shadcn.com/docs · https://component.gallery/components/

---

## shadcn/ui 핵심 설계 철학

| 원칙 | 설명 |
|------|------|
| **Open Code** | npm 패키지가 아닌 소스 코드 직접 소유 (copy-paste 방식) |
| **Composition** | 모든 컴포넌트가 공통 조합 인터페이스 공유 |
| **Beautiful Defaults** | 추가 작업 없이도 즉시 우수한 디자인 제공 |
| **AI-Ready** | LLM이 읽고 이해하고 개선할 수 있는 구조 |
| **asChild** | 다른 컴포넌트가 스타일을 상속할 때 사용 (`<Button asChild><Link /></Button>`) |

---

## 컴포넌트 분류

### 폼 & 입력
| 컴포넌트 | 설명 |
|---------|------|
| Input | 텍스트 입력 필드 |
| Select | 드롭다운 선택 (그룹화 가능) |
| Checkbox | 체크박스 선택 |
| Radio Group | 배타적 선택 (한 개만) |
| Toggle / Switch | 온/오프 전환 |
| Textarea | 여러 줄 텍스트 |
| Combobox | 검색 가능한 드롭다운 |
| Date Picker | 날짜 선택 |
| Input OTP | 일회용 비밀번호 입력 |

### 레이아웃 & 오버레이
| 컴포넌트 | 설명 |
|---------|------|
| Card | 콘텐츠 블록 (Header/Content/Footer) |
| Sidebar | 네비게이션 사이드바 (축소 가능) |
| Sheet | 가장자리 슬라이드인 오버레이 |
| Drawer | 서랍 형태 슬라이드 오버 |
| Dialog | 모달 대화창 |
| Popover | 팝업 오버레이 |
| Tooltip | 짧은 설명 도움말 |

### 네비게이션
| 컴포넌트 | 설명 |
|---------|------|
| Breadcrumb | 경로 표시 네비게이션 |
| Menubar | 수평 메뉴바 |
| Tabs | 탭 인터페이스 |
| Dropdown Menu | 드롭다운 액션 메뉴 |
| Pagination | 페이지 넘김 |

### 데이터 표시
| 컴포넌트 | 설명 |
|---------|------|
| Table | 기본 테이블 (시맨틱 HTML) |
| Data Table | 정렬/필터/페이지네이션 포함 (TanStack Table) |
| Carousel | 이미지/콘텐츠 슬라이더 |
| Badge | 상태/태그 표시 |
| Progress | 진행률 표시 바 |

### 피드백 & 상태
| 컴포넌트 | 설명 |
|---------|------|
| Alert | 경고/정보 메시지 박스 |
| Alert Dialog | 모달 경고 대화 |
| Toast (Sonner) | 일시적 알림 메시지 |
| Skeleton | 로딩 중 플레이스홀더 |

---

## 컴포넌트 구조 패턴

### Compound Components (복합 컴포넌트)
```tsx
// Dialog = Trigger + Content + Header + Footer 조합
<Dialog>
  <DialogTrigger asChild><Button>열기</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Field 구조 (폼 유효성)
```tsx
<Field data-invalid={hasError}>
  <FieldLabel>이메일</FieldLabel>
  <Input type="email" aria-invalid={hasError} />
  {hasError && <FieldError>{error}</FieldError>}
  <FieldDescription>설명 텍스트</FieldDescription>
</Field>
```

### Card 레이아웃
```tsx
<Card size="default | sm">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
    <CardAction>우측 상단 버튼</CardAction>
  </CardHeader>
  <CardContent>내용</CardContent>
  <CardFooter>하단</CardFooter>
</Card>
```

### Dropdown Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical /></Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>작업</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>수정</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 디자인 토큰 (Design Tokens)

CSS 변수 기반 테마 시스템:

```css
--background       /* 페이지 배경 */
--foreground       /* 기본 텍스트 */
--primary          /* 주요 작업 버튼 */
--primary-foreground /* primary 위 텍스트 */
--secondary        /* 보조 버튼 */
--accent           /* 강조 요소 */
--muted            /* 비활성화/보조 배경 */
--muted-foreground /* 보조 텍스트 */
--destructive      /* 삭제/위험 (빨강) */
--border           /* 테두리 선 */
```

Tailwind 통합:
```js
colors: {
  background: 'hsl(var(--background) / <alpha-value>)',
  primary: 'hsl(var(--primary) / <alpha-value>)',
}
```

---

## Button Variants

| Variant | 용도 |
|---------|------|
| `default` | 주요 작업 (Primary) |
| `secondary` | 보조 작업 |
| `outline` | 테두리 버튼 |
| `ghost` | 배경 없는 버튼 |
| `destructive` | 삭제/위험 작업 |
| `link` | 링크 스타일 |

Sizes: `xs` `sm` `default` `lg` `icon-xs` `icon-sm` `icon-lg`

---

## 상태 관리 속성

| 속성 | 의미 |
|------|------|
| `disabled` | 상호작용 불가 |
| `aria-invalid` | 유효성 검증 실패 (접근성) |
| `data-invalid` | 시각적 오류 표현 |
| `data-disabled` | 비활성화 스타일링 |

로딩 패턴:
```tsx
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : '제출'}
</Button>
```

---

## 반응형 Breakpoints (Tailwind)

| 이름 | 기준 |
|------|------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

모바일 우선: `w-full md:w-1/2 lg:w-1/3`

---

## 용어 빠른 참고

| 용어 | 의미 |
|------|------|
| **Primitive** | 기본 단위 컴포넌트 (Button, Input 등) |
| **Compound** | 여러 primitive 조합 (Dialog = Trigger + Content) |
| **Composition** | 컴포넌트 조합 방식 |
| **Variant** | 컴포넌트 변형 (default, outline, ghost 등) |
| **Trigger** | 상호작용 시작 요소 (DialogTrigger 등) |
| **Slot** | 컴포넌트 내 위치 (CardHeader, CardFooter 등) |
| **asChild** | 자식이 스타일 상속받을 때 |
| **Token** | CSS 변수 디자인 값 (`--primary` 등) |
| **Skeleton** | 로딩 중 플레이스홀더 UI |
| **Sonner** | 모던 Toast 라이브러리 |
| **RTL** | 우측→좌측 레이아웃 (아랍어 등) |
| **ARIA** | 접근성 속성 (aria-invalid, aria-label) |
| **Data Table** | 정렬/필터/페이지네이션 포함 테이블 (TanStack Table) |
| **Vibe Coding** | AI와 협력하여 직관적으로 UI를 만드는 개발 방식 |
| **Open Code** | 패키지 설치 대신 소스를 직접 소유하는 방식 |

---

## component.gallery 패턴 분류

component.gallery는 다양한 라이브러리/프레임워크의 동일 컴포넌트 구현을 비교합니다.

주요 카테고리:
- **Actions**: Button, Floating Action Button, Split Button, Toggle Button
- **Forms**: Checkbox, Date Picker, File Upload, Input, Radio, Select, Slider, Switch, Textarea
- **Navigation**: Breadcrumb, Dropdown, Menu, Pagination, Stepper, Tabs
- **Feedback**: Alert, Badge, Loading Indicator, Progress Bar, Skeleton, Snackbar/Toast, Tooltip
- **Overlays**: Dialog/Modal, Drawer, Popover, Sheet
- **Data Display**: Accordion, Calendar, Card, Carousel, List, Table, Tree

컴포넌트 간 관계:
- **Snackbar = Toast**: 일시적 알림 (Material Design 용어 vs 일반 용어)
- **FAB = Floating Action Button**: 화면에 고정된 주요 액션 버튼
- **Stepper**: 여러 단계의 폼/위저드 네비게이션
- **Accordion**: 접고 펼칠 수 있는 콘텐츠 패널
