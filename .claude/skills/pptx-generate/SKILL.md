---
name: pptx-generate
description: PDF나 이미지를 입력받아, 모든 시각 요소를 PowerPoint의 기본 도형/텍스트/표로 재현한 .pptx 파일을 생성합니다. 단순 이미지 삽입이 아니라 네이티브 요소로 구현합니다.
---
# /pptx-generate -- PDF/이미지를 PPT 네이티브 요소로 재현

> PDF나 이미지를 입력받아, 모든 시각 요소를 PowerPoint의 기본 도형/텍스트/표로 재현한 .pptx 파일을 생성합니다.
> 단순 이미지 삽입이 아니라, 원본의 텍스트/도형/표/화살표/다이어그램을 모두 PPT 네이티브 요소로 구현합니다.

## !! 절대 금지 사항 !!

**add_picture(), 이미지 삽입, 스크린샷 붙여넣기는 어떤 경우에도 절대 금지한다.**

- PDF 페이지를 PNG로 캡처해서 슬라이드에 붙이는 행위 금지
- PDF에서 이미지를 추출(extract_image)해서 삽입하는 행위 금지
- 어떤 형태의 래스터 이미지(.png, .jpg, .bmp 등)도 슬라이드에 삽입 금지
- 로고, 아이콘, 사진, 그래프 등 모든 시각 요소는 반드시 PPT 기본 도형(사각형, 원, 삼각형, 화살표 등) + 텍스트 조합으로 근사하여 재현해야 한다
- `slide.shapes.add_picture()` 호출이 생성 코드에 포함되면 실패로 간주한다

이 규칙은 어떤 최적화, 편의, 품질 향상 명목으로도 예외를 허용하지 않는다.

## GT(정답) PPTX 구조 분석 결과

실제 전문가가 만든 PPT(GT_pdf.pptx)의 내부 구조를 분석한 결과:

**슬라이드 크기**: 11.69 x 8.27 인치 (A4 비율)

**핵심 구조 패턴**: 각 슬라이드는 대형 GROUP 1개로 감싸고, 그 안에 수십 개의 네이티브 요소를 배치

**슬라이드당 평균 요소 수**: 20~36개 (GROUP 내부 기준)

**사용된 요소 타입:**
| 타입 | 용도 | python-pptx 대응 |
|------|------|-----------------|
| `AUTO_SHAPE` (타원) | 번호 뱃지(01~04), 원형 아이콘 배경 | `MSO_SHAPE.OVAL` |
| `AUTO_SHAPE` (둥근사각형) | 카드 배경, 정보 박스 | `MSO_SHAPE.ROUNDED_RECTANGLE` |
| `AUTO_SHAPE` (화살표) | 쉐브론, 방향 화살표 | `MSO_SHAPE.CHEVRON`, `MSO_SHAPE.RIGHT_ARROW` |
| `TEXT_BOX` | 제목, 본문, 항목 내용 | `add_textbox()` |
| `LINE` (직선 연결선) | 프로세스 플로우 연결, 구분선 | `add_connector()` |
| `FREEFORM` (자유형 도형) | 로고, 복잡한 아이콘 실루엣 | 기본 도형 조합으로 근사 |
| `TABLE` | 데이터 표 | `add_table()` |
| 중첩 `GROUP` | 아이콘+텍스트 묶음, 카드 구성 | 요소를 논리적으로 인접 배치 |

**슬라이드 3 (산업체/참여학생) 실제 구성 (25개 요소):**
- 둥근사각형 4개 = 카드 배경
- 타원 4개 = 번호 뱃지 (01, 02, 03, 04)
- 텍스트박스 10+개 = "산업체", "참여학생", 각 항목 설명문
- 화살표 도형 2개 = 좌우 방향 화살표
- 중첩 그룹 2개 = 건물/사람 일러스트 (도형 조합)

**핵심 교훈:**
1. 슬라이드당 **20개 이상의 네이티브 도형**을 사용해야 원본 수준의 디테일 달성
2. 텍스트는 **개별 TEXT_BOX**로 분리 배치 (하나의 큰 텍스트박스에 모든 내용을 넣지 않음)
3. 번호 뱃지(01, 02...)는 **타원(OVAL) + 텍스트** 조합
4. 카드 레이아웃은 **둥근사각형 배경 + 개별 텍스트박스** 구조
5. 복잡한 아이콘은 **기본 도형 조합**으로 근사 (FREEFORM 대체)

## 트리거

```
/pptx-generate input/pptx/input_pdf.pdf
/pptx-generate screenshot.png
/pptx-generate slides/ --output result.pptx
```

## 입력

| 파라미터 | 필수 | 설명 | 기본값 |
|---------|------|------|--------|
| 파일 경로 | O | PDF 파일 또는 이미지 파일 (PNG/JPG) 경로. 디렉토리면 내부 이미지를 페이지 순서로 처리 | - |
| `--output` | | 출력 .pptx 파일 경로 | `output/pptx/{입력파일명}.pptx` |
| `--pages` | | 처리할 페이지 범위 (예: `1-5`, `3,7,10`) | 전체 |
| `--dpi` | | PDF→이미지 변환 해상도 | 200 |

## 출력

- `output/pptx/{name}.pptx` -- 생성된 PowerPoint 파일
- `output/pptx/{name}_spec.json` -- 슬라이드 명세 (디버깅/재현용)

---

## 의존성

실행 전 다음 패키지가 설치되어 있어야 합니다:

```bash
pip install python-pptx pymupdf Pillow
```

---

## 워크플로우

### Step 1: 입력 파일 확인 및 페이지별 이미지 변환

1. 입력 파일 확장자 판별:
   - `.pdf` → PyMuPDF(fitz)로 페이지별 PNG 변환
   - `.png`, `.jpg`, `.jpeg`, `.webp` → 단일 이미지 = 단일 슬라이드
   - 디렉토리 → 내부 이미지 파일을 이름순 정렬하여 페이지로 처리

2. PDF 변환 코드:
```python
import fitz  # pymupdf
doc = fitz.open(pdf_path)
page_images = []
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=200)
    img_path = f"temp/page_{i+1:03d}.png"
    pix.save(img_path)
    page_images.append(img_path)
```

3. `--pages` 옵션이 있으면 해당 페이지만 필터링

### Step 2: 테마 추출 (첫 2-3페이지 분석)

첫 2-3장의 페이지 이미지를 Read 도구로 확인하고 다음을 추출:

- **주요 색상 팔레트**: 배경색, 강조색 1-3개, 텍스트 기본색
- **폰트 추론**: 한글이면 "맑은 고딕", 영문이면 "Arial" 기본
- **슬라이드 비율**: 16:9 (기본) 또는 4:3

테마 정보를 JSON으로 기록:
```json
{
  "colors": {
    "background": "#FFFFFF",
    "primary": "#2B7A9E",
    "secondary": "#1A5276",
    "accent": "#48C9B0",
    "text_dark": "#333333",
    "text_light": "#FFFFFF"
  },
  "font": {
    "korean": "맑은 고딕",
    "english": "Arial",
    "title_size": 28,
    "body_size": 14
  },
  "slide_ratio": "16:9"
}
```

### Step 3: 각 페이지 Claude Vision 분석

**각 페이지 이미지를 Read 도구로 열어보고**, 다음 구조의 JSON으로 모든 시각 요소를 분석합니다.

**분석 시 반드시 지켜야 할 규칙:**

1. **모든 눈에 보이는 요소를 빠짐없이 기술한다** -- 텍스트, 도형, 선, 화살표, 표, 아이콘, 이미지, 배경 장식 전부
2. **위치는 슬라이드 대비 퍼센트(%)로 기록한다** -- `left_pct`, `top_pct`, `width_pct`, `height_pct`
3. **색상은 정확한 HEX 코드로 기록한다** -- 대략적인 색이 아니라 최대한 정확하게
4. **한글 텍스트는 글자 하나 틀리지 않게 정확히 기록한다**
5. **겹치는 요소는 z-order(앞뒤 순서)를 기록한다**
6. **그룹으로 묶인 요소는 children으로 중첩 표현한다**

**슬라이드 명세 JSON 스키마 (slide_spec.json):**

```json
{
  "slides": [
    {
      "page": 1,
      "background": {
        "type": "solid",
        "color": "#FFFFFF"
      },
      "elements": [
        {
          "id": "e1",
          "type": "text",
          "content": "교육연구팀 로고",
          "position": {
            "left_pct": 30,
            "top_pct": 8,
            "width_pct": 40,
            "height_pct": 10
          },
          "style": {
            "font_size": 32,
            "font_weight": "bold",
            "color": "#333333",
            "align": "center",
            "font_name": "맑은 고딕"
          }
        },
        {
          "id": "e2",
          "type": "circle",
          "position": {
            "left_pct": 15,
            "top_pct": 25,
            "width_pct": 30,
            "height_pct": 53
          },
          "style": {
            "fill": "#2B7A9E",
            "stroke": null,
            "stroke_width": 0
          },
          "children": [
            {
              "type": "text",
              "content": "ST@ST",
              "style": {
                "font_size": 28,
                "font_weight": "bold",
                "color": "#FFFFFF",
                "align": "center"
              }
            }
          ]
        },
        {
          "id": "e3",
          "type": "arrow",
          "position": {
            "from_x_pct": 45,
            "from_y_pct": 50,
            "to_x_pct": 55,
            "to_y_pct": 50
          },
          "style": {
            "color": "#CCCCCC",
            "width": 2,
            "head_type": "triangle"
          }
        },
        {
          "id": "e4",
          "type": "table",
          "position": {
            "left_pct": 10,
            "top_pct": 30,
            "width_pct": 80,
            "height_pct": 50
          },
          "rows": 4,
          "cols": 3,
          "header_row": true,
          "cells": [
            ["항목", "내용", "비고"],
            ["01", "첫 번째 내용", ""],
            ["02", "두 번째 내용", ""],
            ["03", "세 번째 내용", ""]
          ],
          "style": {
            "header_fill": "#2B7A9E",
            "header_text_color": "#FFFFFF",
            "border_color": "#DDDDDD",
            "cell_font_size": 12
          }
        },
        {
          "id": "e5",
          "type": "rounded_rect",
          "position": {
            "left_pct": 5,
            "top_pct": 20,
            "width_pct": 40,
            "height_pct": 70
          },
          "style": {
            "fill": "#F5F5F5",
            "stroke": "#DDDDDD",
            "stroke_width": 1,
            "corner_radius": 10,
            "shadow": true
          }
        },
        {
          "id": "e6",
          "type": "image",
          "description": "자동차 로고 아이콘",
          "position": {
            "left_pct": 20,
            "top_pct": 30,
            "width_pct": 15,
            "height_pct": 20
          },
          "source": "extract_from_pdf"
        }
      ]
    }
  ]
}
```

**지원 요소 타입:**

| type | 설명 | 필수 속성 |
|------|------|----------|
| `text` | 텍스트 박스 | content, position, style(font_size, color, align) |
| `rect` | 사각형 | position, style(fill, stroke) |
| `rounded_rect` | 둥근 사각형 | position, style(fill, stroke, corner_radius) |
| `circle` | 원/타원 | position, style(fill, stroke) |
| `hexagon` | 육각형 | position, style(fill, stroke) |
| `triangle` | 삼각형 | position, style(fill, stroke) |
| `arrow` | 화살표/연결선 | position(from/to), style(color, width, head_type) |
| `line` | 직선 | position(from/to), style(color, width) |
| `table` | 표 | position, rows, cols, cells, style |
| ~~`image`~~ | **사용 금지** -- 이미지 삽입 대신 도형+텍스트 조합으로 근사 | - |
| `group` | 그룹 (여러 요소 묶음) | position, children[] |
| `chevron` | 쉐브론/화살표 도형 | position, style(fill) |
| `connector` | 곡선 연결선 | position(from/to), style |

### Step 4: python-pptx 코드 생성 및 실행

slide_spec.json의 각 슬라이드에 대해 python-pptx 코드를 생성하고 실행합니다.

**기본 설정:**
```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu, Cm
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor

# 슬라이드 크기 (PDF/입력 파일의 비율에 맞춰 자동 결정)
# 예: A4 비율 (GT 기준)
SLIDE_WIDTH = Inches(11.69)
SLIDE_HEIGHT = Inches(8.27)
# 16:9인 경우: Inches(13.333) x Inches(7.5)
# 4:3인 경우: Inches(10) x Inches(7.5)

prs = Presentation()
prs.slide_width = SLIDE_WIDTH
prs.slide_height = SLIDE_HEIGHT
```

**퍼센트 → EMU 변환:**
```python
def pct_to_emu_x(pct):
    return int(SLIDE_WIDTH * pct / 100)

def pct_to_emu_y(pct):
    return int(SLIDE_HEIGHT * pct / 100)
```

**요소 타입별 변환 규칙:**

#### 텍스트
```python
from pptx.enum.text import PP_ALIGN

txBox = slide.shapes.add_textbox(left, top, width, height)
tf = txBox.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = content
p.font.size = Pt(font_size)
p.font.color.rgb = RGBColor.from_string(hex_color[1:])
p.font.name = "맑은 고딕"
p.font.bold = (font_weight == "bold")
p.alignment = {
    "left": PP_ALIGN.LEFT,
    "center": PP_ALIGN.CENTER,
    "right": PP_ALIGN.RIGHT
}[align]
```

#### 도형 (원, 사각형, 둥근 사각형 등)
```python
shape_map = {
    "rect": MSO_SHAPE.RECTANGLE,
    "rounded_rect": MSO_SHAPE.ROUNDED_RECTANGLE,
    "circle": MSO_SHAPE.OVAL,
    "hexagon": MSO_SHAPE.HEXAGON,
    "triangle": MSO_SHAPE.ISOSCELES_TRIANGLE,
    "chevron": MSO_SHAPE.CHEVRON,
}

shape = slide.shapes.add_shape(
    shape_map[element_type],
    left, top, width, height
)
shape.fill.solid()
shape.fill.fore_color.rgb = RGBColor.from_string(fill_hex[1:])
if stroke:
    shape.line.color.rgb = RGBColor.from_string(stroke_hex[1:])
    shape.line.width = Pt(stroke_width)
else:
    shape.line.fill.background()  # 테두리 없음
```

**도형 안에 텍스트 넣기:**
```python
tf = shape.text_frame
tf.word_wrap = True
tf.paragraphs[0].alignment = PP_ALIGN.CENTER
p = tf.paragraphs[0]
run = p.add_run()
run.text = text_content
run.font.size = Pt(font_size)
run.font.color.rgb = RGBColor.from_string(color_hex[1:])
run.font.name = "맑은 고딕"
```

#### 화살표/연결선
```python
# 방법 1: 화살표 도형 (단순)
shape = slide.shapes.add_shape(
    MSO_SHAPE.RIGHT_ARROW,
    left, top, width, height
)

# 방법 2: 직선 + 화살표 머리 (정밀)
connector = slide.shapes.add_connector(
    MSO_CONNECTOR_TYPE.STRAIGHT,
    Emu(from_x), Emu(from_y),
    Emu(to_x), Emu(to_y)
)
connector.line.color.rgb = RGBColor.from_string(color_hex[1:])
connector.line.width = Pt(width)
# 화살표 머리 설정
from pptx.oxml.ns import qn
line_elem = connector.line._ln
tail_end = line_elem.find(qn('a:tailEnd'))
if tail_end is None:
    from lxml import etree
    tail_end = etree.SubElement(line_elem, qn('a:tailEnd'))
tail_end.set('type', 'triangle')
tail_end.set('w', 'med')
tail_end.set('len', 'med')
```

#### 표
```python
table_shape = slide.shapes.add_table(
    rows, cols, left, top, width, height
)
table = table_shape.table

for row_idx, row_data in enumerate(cells):
    for col_idx, cell_text in enumerate(row_data):
        cell = table.cell(row_idx, col_idx)
        cell.text = str(cell_text)
        # 셀 스타일
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.size = Pt(cell_font_size)
            paragraph.font.name = "맑은 고딕"
        # 헤더 행 배경색
        if row_idx == 0 and header_row:
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor.from_string(header_fill[1:])
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.color.rgb = RGBColor.from_string(header_text_color[1:])
```

#### 이미지 대체 (도형+텍스트 조합)
```python
# add_picture()는 절대 금지! 대신 도형+텍스트로 근사한다.
# 예: 자동차 로고 → 원형 배경 + "ST@ST" 텍스트
# 예: 건물 아이콘 → 사각형 + 삼각형(지붕) 조합
# 예: 사람 실루엣 → 원(머리) + 사다리꼴(몸) 조합
shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, width, height)
shape.fill.solid()
shape.fill.fore_color.rgb = RGBColor.from_string("2B7A9E")
tf = shape.text_frame
tf.paragraphs[0].add_run().text = "LOGO"  # 이니셜/약어로 대체
```

#### 배경색 설정
```python
from pptx.oxml.ns import qn
from lxml import etree

background = slide.background
fill = background.fill
fill.solid()
fill.fore_color.rgb = RGBColor.from_string(bg_hex[1:])
```

### Step 5: 파일 저장 및 결과 안내

```python
output_path = f"output/pptx/{output_name}.pptx"
prs.save(output_path)
print(f"생성 완료: {output_path}")
```

생성 후 안내:
- 출력 파일 경로
- 총 슬라이드 수
- 처리된 요소 수 합계
- slide_spec.json 저장 경로 (디버깅용)

---

## 실행 예시

### 단일 실행 흐름

```
사용자: /pptx-generate input/pptx/input_pdf.pdf

1. PDF 열기: 33페이지 감지
2. 페이지별 PNG 변환 (temp/page_001.png ~ page_033.png)
3. 테마 추출: 주요 색상 #2B7A9E, #1A5276, 한글 폰트
4. 페이지 1 분석: 로고 2개, 텍스트 1개 → 요소 3개
5. 페이지 2 분석: 중앙 원형 다이어그램 + 위성 박스 3개 → 요소 15개
   ...
6. python-pptx 코드 생성 및 실행
7. 저장: output/pptx/input_pdf.pptx (33 슬라이드, 총 280 요소)
```

---

## 핵심 원칙

1. **네이티브 도형 필수**: 이미지(add_picture) 삽입 금지. 모든 요소를 PPT 기본 도형(사각형, 원, 둥근사각형, 화살표, 텍스트박스, 표, 쉐브론 등)으로 재현해야 한다. 로고/아이콘은 도형+텍스트 조합으로 근사한다
2. **정확한 좌표**: 원본과 위치가 최대한 일치하도록 퍼센트 좌표를 세밀하게 지정
3. **한글 정확성**: 한글 텍스트는 한 글자도 틀리지 않게. 폰트는 "맑은 고딕" 기본
4. **색상 정확성**: 원본의 색상을 HEX 코드로 정확히 매칭
5. **도형 조합**: 복잡한 아이콘/로고는 기본 도형(원+사각형+삼각형) 조합으로 근사. 텍스트 이니셜 활용 가능
6. **구조 보존**: 그룹, 중첩, z-order를 원본과 동일하게 유지

---

## 평가 기준 (auto-research용)

```yaml
metric: native_pptx_quality
test_input: input/pptx/test_3pages.pdf
evaluator: python scripts/evaluate_pptx.py {output} {test_input}
modification_target: scripts/generate_pptx.py
runner: C:/Anaconda3/python.exe scripts/generate_pptx.py
higher_is_better: true
timeout_minutes: 5
```

### 평가 지표 구성 (v2 - 네이티브 도형 중심)

| 지표 | 가중치 | 측정 방법 |
|------|--------|----------|
| 슬라이드 수 일치 | 10% | 생성 슬라이드 수 / 원본 페이지 수 |
| 네이티브 요소 풍부도 | 20% | 슬라이드당 도형/텍스트 shape 수 (5개 이상이면 만점) |
| 이미지 미사용 비율 | 20% | 이미지를 사용하지 않은 슬라이드 비율 (높을수록 좋음) |
| 텍스트 커버리지 | 25% | 슬라이드당 텍스트 양 (50자 이상이면 만점) |
| 시각 유사도 | 25% | PPTX→PNG 렌더 후 원본 PDF와 SSIM 비교 |
