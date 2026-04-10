---
name: pixl-charactor
description: 사진/이미지를 128x128 2D 픽셀 게임 캐릭터로 변환합니다. 원본 이미지를 리사이즈 + 색상 양자화하여 원본과 닮은 픽셀아트를 생성합니다.
---

# /pixl-charactor — 사진 → 128x128 픽셀 게임 캐릭터 변환

> 사진이나 이미지를 입력하면 원본의 외형을 유지한 채 128x128 2D 픽셀 아트 게임 캐릭터로 변환합니다.
> 원본 → 배경제거 → 정규화 리사이즈 → 색상 양자화 → 아웃라인 → 픽셀아트

## 트리거

```
/pixl-charactor path/to/photo.png
/pixl-charactor path/to/photo.webp --pixel 3 --colors 16
/pixl-charactor path/to/photo.png --pixel 1 --colors 32 --no-outline
```

## 입력

| 파라미터 | 필수 | 설명 | 기본값 |
|---------|------|------|--------|
| 이미지 경로 | O | 원본 사진/이미지 파일 경로 | - |
| `--pixel` | | 픽셀화 단위 (1=원본해상도, 2=도트감, 3=강한도트, 4=레트로) | 2 |
| `--colors` | | 색상 수 제한 (8/16/24/32) | 24 |
| `--outline` | | 외곽선 추가 여부 (yes/no) | yes |
| `--bg` | | 배경 (transparent/black) | transparent |

## 출력

```
output/pixl/{캐릭터명}/
├── character_128x128.png          # 메인 캐릭터 (128x128, 투명배경)
├── character_skeleton.json         # 스켈레톤 키포인트 (17개 관절)
├── character_metadata.json         # 높이, 비율, 팔레트 등
├── generate_{캐릭터명}.py          # 생성 스크립트 (재현 가능)
└── character_directions/           # 방향별
    ├── south.png (정면)
    ├── east.png (오른쪽)
    └── west.png (좌우반전)
```

---

## 핵심 원칙: 원본 이미지를 변환한다, 새로 그리지 않는다

이 스킬의 핵심은 **원본 이미지의 외형을 최대한 보존하면서 픽셀아트로 변환**하는 것이다.
절대로 PIL로 캐릭터를 처음부터 새로 그리지 않는다.

```
원본 사진 (고해상도)
    ↓ 크롭 (바운딩박스)
    ↓ 리사이즈 (TARGET_H 기준, 비율 유지)
    ↓ 픽셀화 (축소→확대, NEAREST 보간)
    ↓ 색상 양자화 (N색 제한, MEDIANCUT)
    ↓ 알파 이진화 (반투명 제거)
    ↓ 128x128 캔버스 배치 (정규화)
    ↓ 아웃라인 추가
    = 픽셀아트 캐릭터
```

---

## 128x128 캐릭터 정규화 규칙

```
┌─────────────────────────────┐
│         128x128 캔버스        │
│                              │
│     ┌──────────────┐         │
│     │   상단 여백    │ ~12px  │
│     ├──────────────┤         │
│     │              │         │
│     │   캐릭터 영역  │ ~100px │ ← TARGET_HEIGHT
│     │   (원본 보존) │         │
│     │              │         │
│     ├──────────────┤         │
│     │   하단 여백    │ ~16px  │
│     └──────────────┘         │
│   좌우: 캐릭터 중앙 정렬       │
└─────────────────────────────┘

TARGET_HEIGHT = 100px
FOOT_Y       = 112px (발 바닥 기준선)
CENTER_X     = 64px  (좌우 중심)
```

---

## 워크플로우

### Step 1: 원본 이미지 분석

```
Read: {입력 이미지 경로}
```

Claude가 이미지를 보고 확인:
- 캐릭터 종류 (인물/동물/몬스터/로봇 등)
- 배경 유무 (투명 배경인지, 제거 필요한지)
- 대략적인 비율 (세로형/정사각형/가로형)
- 캐릭터명 결정 (파일명 또는 특징 기반)

### Step 2: Python PIL 변환 스크립트 작성 및 실행

Claude가 다음 파이프라인을 수행하는 Python 스크립트를 작성한다:

```python
from PIL import Image
import json, os

# === 설정 ===
INPUT_PATH  = "{입력 이미지 경로}"
OUTPUT_DIR  = "output/pixl/{캐릭터명}"
CANVAS      = 128
TARGET_H    = 100
FOOT_Y      = 112
CENTER_X    = 64
PIXEL_SIZE  = 2          # 픽셀화 단위
NUM_COLORS  = 24         # 색상 수 제한

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/character_directions", exist_ok=True)

# --- 1. 원본 로드 ---
src = Image.open(INPUT_PATH).convert("RGBA")

# --- 2. 바운딩박스 크롭 (투명 영역 제거) ---
bbox = src.getbbox()
cropped = src.crop(bbox) if bbox else src

# --- 3. 정규화 리사이즈 (TARGET_H 기준, 비율 유지) ---
cw, ch = cropped.size
scale = TARGET_H / ch
new_w = int(cw * scale)
new_h = TARGET_H

# 폭이 캔버스 초과 시 폭 기준 재조정
max_w = CANVAS - 8
if new_w > max_w:
    scale = max_w / cw
    new_w = max_w
    new_h = int(ch * scale)

resized = cropped.resize((new_w, new_h), Image.NEAREST)

# --- 4. 픽셀화 (축소→확대) ---
if PIXEL_SIZE > 1:
    small_w = max(1, new_w // PIXEL_SIZE)
    small_h = max(1, new_h // PIXEL_SIZE)
    small = resized.resize((small_w, small_h), Image.LANCZOS)
    pixelated = small.resize((new_w, new_h), Image.NEAREST)
else:
    pixelated = resized

# --- 5. 색상 양자화 (팔레트 제한) ---
alpha = pixelated.split()[3]
rgb = pixelated.convert("RGB")
quantized = rgb.quantize(colors=NUM_COLORS, method=Image.Quantize.MEDIANCUT)
quantized_rgba = quantized.convert("RGB").convert("RGBA")
quantized_rgba.putalpha(alpha)

# 알파 이진화 (반투명 제거)
px = quantized_rgba.load()
for y in range(quantized_rgba.height):
    for x in range(quantized_rgba.width):
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 255) if a >= 128 else (0, 0, 0, 0)

# --- 6. 128x128 캔버스에 정규화 배치 ---
canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
char_w, char_h = quantized_rgba.size
paste_x = CENTER_X - char_w // 2
paste_y = FOOT_Y - char_h
if paste_y < 2:
    paste_y = 2
canvas.paste(quantized_rgba, (paste_x, paste_y), quantized_rgba)

# --- 7. 아웃라인 추가 ---
def add_outline(img, color=(0, 0, 0, 255)):
    w, h = img.size
    result = img.copy()
    src_px = img.load()
    dst_px = result.load()
    for y in range(h):
        for x in range(w):
            if src_px[x, y][3] == 0:
                for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                    nx, ny = x+dx, y+dy
                    if 0 <= nx < w and 0 <= ny < h and src_px[nx, ny][3] > 0:
                        dst_px[x, y] = color
                        break
    return result

result = add_outline(canvas)

# --- 저장 ---
result.save(f"{OUTPUT_DIR}/character_128x128.png")
result.save(f"{OUTPUT_DIR}/character_directions/south.png")
result.save(f"{OUTPUT_DIR}/character_directions/east.png")
west = result.transpose(Image.FLIP_LEFT_RIGHT)
west.save(f"{OUTPUT_DIR}/character_directions/west.png")
```

### Step 3: 정규화 검증

```python
# 검증 코드 (스크립트 끝에 포함)
final_px = result.load()
min_y, max_y, min_x, max_x = CANVAS, 0, CANVAS, 0
for y in range(CANVAS):
    for x in range(CANVAS):
        if final_px[x, y][3] > 0:
            min_y = min(min_y, y)
            max_y = max(max_y, y)
            min_x = min(min_x, x)
            max_x = max(max_x, x)

actual_h = max_y - min_y
center = (min_x + max_x) // 2

print(f"높이: {actual_h}px (목표: {TARGET_H})")
print(f"중심X: {center} (목표: {CENTER_X})")
print(f"foot_y: {max_y} (목표: {FOOT_Y})")

assert 85 <= actual_h <= 110, f"높이 오차: {actual_h}px"
assert 58 <= center <= 70,    f"중심 오차: {center}px"
assert 108 <= max_y <= 116,   f"발 위치 오차: {max_y}px"
```

### Step 4: 스켈레톤 JSON 생성

캐릭터의 바운딩박스와 비율을 기반으로 관절 위치를 자동 계산:

```python
body_mid_x = center
body_w = max_x - min_x

skeleton = {
    "keypoints": {
        "head_top":       {"x": body_mid_x, "y": min_y},
        "head_center":    {"x": body_mid_x, "y": int(min_y + actual_h * 0.10)},
        "neck":           {"x": body_mid_x, "y": int(min_y + actual_h * 0.18)},
        "shoulder_left":  {"x": int(min_x + body_w * 0.15), "y": int(min_y + actual_h * 0.25)},
        "shoulder_right": {"x": int(max_x - body_w * 0.15), "y": int(min_y + actual_h * 0.25)},
        "elbow_left":     {"x": int(min_x + body_w * 0.05), "y": int(min_y + actual_h * 0.40)},
        "elbow_right":    {"x": int(max_x - body_w * 0.05), "y": int(min_y + actual_h * 0.40)},
        "wrist_left":     {"x": int(min_x + body_w * 0.02), "y": int(min_y + actual_h * 0.55)},
        "wrist_right":    {"x": int(max_x - body_w * 0.02), "y": int(min_y + actual_h * 0.55)},
        "hip_left":       {"x": int(body_mid_x - body_w * 0.12), "y": int(min_y + actual_h * 0.55)},
        "hip_right":      {"x": int(body_mid_x + body_w * 0.12), "y": int(min_y + actual_h * 0.55)},
        "knee_left":      {"x": int(body_mid_x - body_w * 0.12), "y": int(min_y + actual_h * 0.75)},
        "knee_right":     {"x": int(body_mid_x + body_w * 0.12), "y": int(min_y + actual_h * 0.75)},
        "ankle_left":     {"x": int(body_mid_x - body_w * 0.12), "y": int(min_y + actual_h * 0.90)},
        "ankle_right":    {"x": int(body_mid_x + body_w * 0.12), "y": int(min_y + actual_h * 0.90)},
        "foot_left":      {"x": int(body_mid_x - body_w * 0.12), "y": max_y},
        "foot_right":     {"x": int(body_mid_x + body_w * 0.12), "y": max_y},
    },
    "image_size": {"width": CANVAS, "height": CANVAS}
}
```

### Step 5: 메타데이터 저장

```json
{
  "name": "{캐릭터명}",
  "source": "{입력 이미지 경로}",
  "actual_height": N,
  "target_height": 100,
  "pixel_size": 2,
  "num_colors": 24,
  "bounding_box": {"top": T, "left": L, "bottom": B, "right": R},
  "center_x": 64,
  "foot_y": 112
}
```

---

## 픽셀화 단위 가이드

| PIXEL_SIZE | 효과 | 용도 |
|-----------|------|------|
| 1 | 원본 해상도 유지, 색상만 양자화 | 고해상도 픽셀아트 |
| 2 | 약간의 도트감, 디테일 보존 | **기본값 (추천)** |
| 3 | 뚜렷한 도트, 레트로 느낌 | 16비트 스타일 |
| 4 | 강한 도트, 저해상도 | 8비트 레트로 |

## 색상 수 가이드

| NUM_COLORS | 효과 |
|-----------|------|
| 8 | 극단적 제한, NES 스타일 |
| 16 | 선명한 팔레트, SNES 스타일 |
| 24 | **기본값**, 적당한 디테일 |
| 32 | 풍부한 색상, 부드러운 그라데이션 |

---

## 품질 검증 체크리스트

1. **원본과 닮았는가?** (가장 중요 - 외형, 색상, 실루엣 보존)
2. 128x128 캔버스에 정확히 들어가는가?
3. 배경이 투명한가?
4. 캐릭터 높이가 85~110px 범위인가?
5. 캐릭터가 좌우 중앙에 배치되었는가?
6. 반투명 픽셀이 없는가? (완전 투명 또는 완전 불투명만)
7. 아웃라인이 깨끗한가?

---

## 사전 조건

- Python 3 + Pillow(PIL) 설치 (`pip install Pillow`)
- 입력 이미지: PNG/JPG/WEBP 지원 (투명 배경 권장)

## 연계 스킬

캐릭터 생성 후:
```
/pixl-attack {캐릭터경로} "몽둥이로 때리기"    # 공격 애니메이션
/pixl-runany {캐릭터경로}                      # 걷기/달리기 애니메이션
```
