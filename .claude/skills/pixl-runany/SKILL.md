---
name: pixl-runany
description: 픽셀 캐릭터의 걷기/달리기 애니메이션 스프라이트 시트를 생성합니다. Claude가 직접 Python PIL 스크립트를 작성하여 8프레임 정규화된 루프 애니메이션을 만듭니다.
---

# /pixl-runany — 걷기/달리기 애니메이션 스프라이트 시트 생성

> 픽셀 캐릭터 이미지를 입력하면, Claude가 직접 Python PIL 스크립트를 작성하여 정규화된 걷기/달리기 루프 애니메이션 스프라이트 시트를 생성합니다.

## 트리거

```
/pixl-runany output/pixl/warrior/character_128x128.png
/pixl-runany output/pixl/mage/character_128x128.png --motion run
/pixl-runany output/pixl/knight/character_128x128.png --direction south --motion walk
```

## 입력

| 파라미터 | 필수 | 설명 | 기본값 |
|---------|------|------|--------|
| 캐릭터 이미지 | O | /pixl-charactor로 생성한 128x128 캐릭터 | - |
| `--motion` | | 이동 유형 (walk/run/sprint) | walk |
| `--direction` | | 이동 방향 (south/east/west/north/all) | east |
| `--frames` | | 프레임 수 (6/8) | 8 |
| `--view` | | 카메라 앵글 | side |

## 출력

```
output/pixl/{캐릭터명}/
├── walk_spritesheet.png            # 스프라이트 시트 (128*8 x 128 = 1024x128)
├── walk_frames/                    # 개별 프레임
│   ├── frame_01.png ~ frame_08.png
├── walk_metadata.json              # 애니메이션 메타데이터
└── walk_directions/                # --direction all 시 4방향
    ├── walk_south.png
    ├── walk_east.png
    ├── walk_west.png
    └── walk_north.png
```

---

## Expert Knowledge: 보행 애니메이션 정규화

### 보행 사이클 기본 원리

```
8프레임 보행 사이클 (2보 = 1사이클):

프레임  | 좌발       | 우발       | 포즈 이름      | 설명
--------|-----------|-----------|---------------|------------------
1       | 지면 (뒤) | 지면 (앞) | 컨택트 R      | 오른발 앞 착지
2       | 들림      | 지면      | 리코일 R      | 체중 이동 시작
3       | 앞으로    | 지면 (뒤) | 패싱 R        | 좌발이 우발 지나침
4       | 앞 최대   | 지면      | 하이포인트 R  | 좌발 최대 전진
5       | 지면 (앞) | 지면 (뒤) | 컨택트 L      | 좌발 앞 착지
6       | 지면      | 들림      | 리코일 L      | 체중 이동
7       | 지면 (뒤) | 앞으로    | 패싱 L        | 우발이 좌발 지나침
8       | 지면      | 앞 최대   | 하이포인트 L  | 우발 최대 전진
```

### 정규화 핵심 규칙

#### 1. 캐릭터 높이 정규화 (최우선)

```
보행 중 캐릭터 높이 변동 원인:
- 컨택트 포즈: 다리 벌림 → 무게중심 낮아짐 → 키 줄어듦
- 패싱 포즈: 한 발로 서기 → 무게중심 높아짐 → 키 커짐

문제:
  프레임 1 (컨택트): 높이 96px  ← 다리 벌려서 낮음
  프레임 3 (패싱):   높이 102px ← 한 발로 서서 높음
  → 캐릭터가 위아래로 출렁임 (Bobbing)

해결 - 평균 높이 고정법:
  1. 모든 프레임의 캐릭터 높이 측정
  2. 평균 높이(avg_height) 계산
  3. 각 프레임을 avg_height로 스케일 조정
  4. foot_y를 112px로 재정렬

공식:
  avg_height = mean([h1, h2, ..., h8])
  TARGET_HEIGHT = 100px
  scale_factor = TARGET_HEIGHT / avg_height

  각 프레임 적용:
    new_height = frame_height * scale_factor
    offset_y = 112 - new_height  # 발 기준 배치
```

#### 2. 보행 바운스 (의도적 상하 움직임)

```
자연스러운 걷기에는 약간의 바운스가 필요:

허용 범위:
  walk:   ±2px (미세한 상하)
  run:    ±3px (약간 더 큰 상하)
  sprint: ±4px (역동적 상하)

바운스 적용:
  컨택트 (F1, F5): foot_y = 112px (기본)
  패싱   (F3, F7): foot_y = 110px (2px 위)
  → 머리 위치가 아닌 발 위치로 바운스 표현
  → 발이 올라가면 캐릭터 전체가 올라감
```

#### 3. 프레임 간 거리 정규화

```
캐릭터가 제자리 걷기를 하는 경우 (대부분의 게임):
  → 모든 프레임에서 캐릭터 중심 X좌표 = 64px (고정)
  → 다리만 앞뒤로 움직임

캐릭터가 실제로 이동하는 경우:
  → 프레임당 이동 거리 = 일정 (등속)
  → frame_offset_x = (frame_index / total_frames) * stride_length
  → stride_length = 보폭 (캐릭터 높이의 약 40%)
```

#### 4. 팔 스윙 대칭성

```
보행 시 팔은 다리의 반대 방향으로 스윙:

  프레임 1: 우발 앞 → 좌팔 앞, 우팔 뒤
  프레임 5: 좌발 앞 → 우팔 앞, 좌팔 뒤

팔 스윙 각도:
  walk:   ±15도
  run:    ±30도
  sprint: ±45도

팔 스윙 폭 (px):
  walk:   ±6px
  run:    ±10px
  sprint: ±14px
```

### 걷기 vs 달리기 차이

| 속성 | walk | run | sprint |
|------|------|-----|--------|
| 프레임 수 | 8 | 8 | 6 |
| FPS | 8 | 12 | 16 |
| 바운스 | ±2px | ±3px | ±4px |
| 팔 스윙 | ±15도 | ±30도 | ±45도 |
| 보폭 | 높이x0.3 | 높이x0.5 | 높이x0.7 |
| 상체 기울기 | 0도 | 5도 전경 | 10도 전경 |
| 두 발 동시 지면 | 있음 | 없음 (비행기) | 없음 |

---

## 워크플로우

### Step 1: 캐릭터 및 메타데이터 로드

```
Read: {캐릭터 이미지 경로}
Read: {같은 폴더}/character_skeleton.json
Read: {같은 폴더}/character_metadata.json
```

### Step 2: 보행 사이클 포즈 설계

8프레임 걷기 사이클의 다리/팔 위치를 설계:

```
기준값 (character_metadata.json에서):
  foot_y   = 112
  center_x = 64
  hip_y    = 76
  head_y   = 28

각 프레임의 다리 위치 (보행 사이클 원리 적용):

  F1 (컨택트 R): 오른발 앞(x=74,y=112), 왼발 뒤(x=54,y=112), 두 발 지면
  F2 (리코일 R): 오른발 중심(x=68,y=112), 왼발 들림(x=54,y=106)
  F3 (패싱 R):   오른발 뒤(x=58,y=112), 왼발 앞으로(x=64,y=108) — 바운스 foot_y=110
  F4 (하이R):    오른발 뒤(x=54,y=112), 왼발 최대 전진(x=74,y=108)
  F5 (컨택트 L): 왼발 앞(x=74,y=112), 오른발 뒤(x=54,y=112)
  F6 (리코일 L): 왼발 중심(x=68,y=112), 오른발 들림(x=74,y=106)
  F7 (패싱 L):   왼발 뒤(x=58,y=112), 오른발 앞으로(x=64,y=108) — 바운스 foot_y=110
  F8 (하이L):    왼발 뒤(x=54,y=112), 오른발 최대 전진(x=74,y=108)

팔은 다리 반대 방향:
  F1: 왼팔 앞(x=52), 오른팔 뒤(x=76)
  F5: 오른팔 앞(x=76), 왼팔 뒤(x=52)
```

**높이 검증 (매 프레임):**
```
for frame in frames:
  body_height = foot_y[frame] - head_y[frame]
  assert abs(body_height - avg_body_height) <= bounce_allowance
  assert abs(center_x[frame] - 64) <= 2  # 좌우 흔들림 최소화
```

### Step 3: Python PIL 스크립트 작성 및 실행

Claude가 원본 캐릭터를 분석하여 8프레임 보행 사이클을 PIL로 직접 그린다.

```python
from PIL import Image
import os, json, math

BASE_CHAR  = Image.open("output/pixl/warrior/character_128x128.png")
output_dir = "output/pixl/warrior/walk_frames"
os.makedirs(output_dir, exist_ok=True)

# 보행 사이클 파라미터 (walk 기준)
BOUNCE_PX = 2   # 패싱 포즈에서 발이 올라가는 양

# 8프레임 다리 포즈 정의
# (left_foot_x, left_foot_y, right_foot_x, right_foot_y, left_arm_dx, right_arm_dx)
WALK_POSES = [
    # F1 컨택트 R: 오른발 앞
    (54, 112, 74, 112,  +6, -6),
    # F2 리코일 R: 왼발 들림
    (54, 106, 68, 112,  +3, -3),
    # F3 패싱 R: 바운스 (foot_y=110 — 캐릭터 전체 2px 위)
    (64, 108, 58, 112,   0,  0),
    # F4 하이포인트 R: 왼발 최대 전진
    (74, 108, 54, 112,  -6, +6),
    # F5 컨택트 L: 왼발 앞
    (74, 112, 54, 112,  -6, +6),
    # F6 리코일 L: 오른발 들림
    (68, 112, 54, 106,  -3, +3),
    # F7 패싱 L: 바운스
    (58, 112, 64, 108,   0,  0),
    # F8 하이포인트 L: 오른발 최대 전진
    (54, 112, 74, 108,  +6, -6),
]

def draw_frame(pose_idx):
    lf_x, lf_y, rf_x, rf_y, l_arm_dx, r_arm_dx = WALK_POSES[pose_idx]

    img   = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    px    = img.load()
    base  = BASE_CHAR.load()

    # 몸통/머리 복사 (다리 및 팔 영역 제외)
    for y in range(128):
        for x in range(128):
            if not _is_limb_region(x, y):
                px[x, y] = base[x, y]

    # 왼쪽 다리 그리기 (hip_y=76 → lf_y)
    _draw_leg(px, 58, 76, lf_x, lf_y, "left")
    # 오른쪽 다리 그리기
    _draw_leg(px, 70, 76, rf_x, rf_y, "right")

    # 팔 그리기 (shoulder_y=34)
    _draw_arm(px, 54 + l_arm_dx, 34, 50 + l_arm_dx, 52, "left")
    _draw_arm(px, 74 + r_arm_dx, 34, 78 + r_arm_dx, 52, "right")

    return img

def _is_limb_region(x, y):
    # 다리 영역 (y >= 56) 및 팔 영역 (y=30~60, 양 옆)
    if y >= 56:
        return True
    if y >= 30 and y <= 60 and (x <= 56 or x >= 72):
        return True
    return False

def _draw_leg(px, hip_x, hip_y, foot_x, foot_y, side):
    LEG_COLOR  = ( 30,  30,  80, 255)
    SHOE_COLOR = ( 40,  30,  20, 255)
    OUTLINE    = (  0,   0,   0, 255)

    # 허벅지 (hip → knee 중간)
    knee_x = (hip_x + foot_x) // 2
    knee_y = (hip_y + foot_y) // 2
    for t in range(11):
        x = int(hip_x  + (knee_x - hip_x)  * t / 10)
        y = int(hip_y  + (knee_y - hip_y)  * t / 10)
        _fill_rect(px, x-2, y, 4, 1, LEG_COLOR, OUTLINE)

    # 정강이 (knee → foot)
    for t in range(11):
        x = int(knee_x + (foot_x - knee_x) * t / 10)
        y = int(knee_y + (foot_y - knee_y) * t / 10)
        _fill_rect(px, x-2, y, 4, 1, LEG_COLOR, OUTLINE)

    # 발
    _fill_rect(px, foot_x - 4, foot_y - 4, 10, 4, SHOE_COLOR, OUTLINE)

def _draw_arm(px, shoulder_x, shoulder_y, hand_x, hand_y, side):
    ARM_COLOR = (220, 180, 140, 255)
    OUTLINE   = (  0,   0,   0, 255)
    for t in range(11):
        x = int(shoulder_x + (hand_x - shoulder_x) * t / 10)
        y = int(shoulder_y + (hand_y - shoulder_y) * t / 10)
        _fill_rect(px, x-1, y, 3, 2, ARM_COLOR, OUTLINE)

def _fill_rect(px, x, y, w, h, color, outline):
    for dy in range(h):
        for dx in range(w):
            nx, ny = x + dx, y + dy
            if 0 <= nx < 128 and 0 <= ny < 128:
                is_edge = (dx == 0 or dx == w-1 or dy == 0 or dy == h-1)
                px[nx, ny] = outline if is_edge else color

# 8프레임 생성
frames = []
for i in range(8):
    frame = draw_frame(i)
    frame.save(f"{output_dir}/frame_{i+1:02d}.png")
    frames.append(frame)
    print(f"프레임 {i+1} 저장 완료")

print("모든 프레임 생성 완료")
```

**실제 작업 시:** 원본 캐릭터의 색상, 다리/팔 위치를 분석하여 `WALK_POSES`, `_draw_leg`, `_draw_arm` 함수를 완전히 커스터마이징한다.

### Step 4: 프레임 정규화 검증 (핵심)

```python
from PIL import Image

output_dir = "output/pixl/warrior/walk_frames"
frames = [Image.open(f"{output_dir}/frame_{i+1:02d}.png") for i in range(8)]

heights         = []
foot_positions  = []
center_positions = []

for i, frame in enumerate(frames):
    px = frame.load()
    min_y, max_y, min_x, max_x = 128, 0, 128, 0
    for y in range(128):
        for x in range(128):
            if px[x, y][3] > 0:
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                min_x = min(min_x, x)
                max_x = max(max_x, x)

    heights.append(max_y - min_y)
    foot_positions.append(max_y)
    center_positions.append((min_x + max_x) // 2)

avg_height      = sum(heights) / len(heights)
max_height_dev  = max(abs(h - avg_height) for h in heights)
max_foot_dev    = max(abs(f - 112) for f in foot_positions)
max_center_dev  = max(abs(c - 64) for c in center_positions)

print(f"평균 높이: {avg_height:.1f}px")
print(f"최대 높이 편차: {max_height_dev:.1f}px (허용: 5px)")
print(f"최대 발 위치 편차: {max_foot_dev:.1f}px (허용: 3px)")
print(f"최대 중심 편차: {max_center_dev:.1f}px (허용: 3px)")

assert max_height_dev  <= 5, f"높이 편차 초과: {max_height_dev:.1f}px"
assert max_foot_dev    <= 3, f"발 위치 편차 초과: {max_foot_dev:.1f}px"
assert max_center_dev  <= 3, f"중심 편차 초과: {max_center_dev:.1f}px"
print("검증 통과")
```

### Step 5: 루프 연속성 검증

```python
import numpy as np
from PIL import Image

output_dir = "output/pixl/warrior/walk_frames"
frames = [np.array(Image.open(f"{output_dir}/frame_{i+1:02d}.png")) for i in range(8)]

def pixel_diff(a, b):
    return np.mean(np.abs(a.astype(int) - b.astype(int)))

sequential_diffs = [pixel_diff(frames[i], frames[i+1]) for i in range(7)]
loop_diff        = pixel_diff(frames[7], frames[0])
avg_seq_diff     = sum(sequential_diffs) / len(sequential_diffs)

print(f"순차 평균 차이: {avg_seq_diff:.2f}")
print(f"루프(F8→F1) 차이: {loop_diff:.2f}")

if loop_diff > avg_seq_diff * 1.5:
    print("경고: 루프 불연속 → F8 포즈를 F1에 가깝게 조정 필요")
else:
    print("루프 연속성 통과")
```

### Step 6: 스프라이트 시트 조립

```python
from PIL import Image
import json

output_dir  = "output/pixl/warrior"
frame_count = 8
sheet_w     = 128 * frame_count  # 1024
sheet_h     = 128

sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))

for i in range(frame_count):
    frame = Image.open(f"{output_dir}/walk_frames/frame_{i+1:02d}.png")
    sheet.paste(frame, (i * 128, 0))

sheet.save(f"{output_dir}/walk_spritesheet.png")
print(f"스프라이트 시트 저장: {output_dir}/walk_spritesheet.png ({sheet_w}x{sheet_h})")
```

```
8프레임 → 1024x128 스프라이트 시트

┌────┬────┬────┬────┬────┬────┬────┬────┐
│ F1 │ F2 │ F3 │ F4 │ F5 │ F6 │ F7 │ F8 │
│컨택│리코│패싱│하이│컨택│리코│패싱│하이│
│트R │일R │R   │R   │트L │일L │L   │L   │
└────┴────┴────┴────┴────┴────┴────┴────┘
  각 프레임: 정확히 128x128, 투명 배경
```

### Step 7: 4방향 생성 (--direction all)

```python
from PIL import Image

output_dir = "output/pixl/warrior"
os.makedirs(f"{output_dir}/walk_directions", exist_ok=True)

sheet_east = Image.open(f"{output_dir}/walk_spritesheet.png")

# west = east 좌우 반전
sheet_west = sheet_east.transpose(Image.FLIP_LEFT_RIGHT)
sheet_west.save(f"{output_dir}/walk_directions/walk_west.png")

# east 저장
sheet_east.save(f"{output_dir}/walk_directions/walk_east.png")

# south (정면 보행), north (후면 보행) = 별도 스크립트로 생성
print("east / west 방향 저장 완료")
print("south / north 방향은 별도 포즈 스크립트 필요")
```

### Step 8: 메타데이터 저장

```json
{
  "animation": "walk",
  "motion_type": "walk",
  "frame_count": 8,
  "frame_size": {"width": 128, "height": 128},
  "spritesheet_size": {"width": 1024, "height": 128},
  "cycle": "loop",
  "timing": {
    "fps": 8,
    "frame_duration_ms": 125,
    "cycle_duration_ms": 1000
  },
  "normalization": {
    "avg_body_height": 100,
    "max_height_deviation": 2,
    "foot_y_fixed": 112,
    "center_x_fixed": 64,
    "bounce_px": 2,
    "bounce_frames": [3, 7],
    "all_frames_validated": true
  },
  "walk_cycle": {
    "contact_right": [1, 5],
    "passing": [3, 7],
    "stride_length_px": 30
  }
}
```

---

## 품질 검증 체크리스트

1. 모든 프레임에서 캐릭터 높이 편차가 ±5px 이내인가?
2. 발 위치(foot_y)가 ±3px 이내로 일정한가?
3. 캐릭터 중심(center_x)이 ±3px 이내로 일정한가?
4. F8→F1 전환(루프)이 자연스러운가?
5. 좌우 대칭인가? (F1~F4 ≈ F5~F8 미러)
6. 팔 스윙이 다리와 반대 방향인가?
7. 두 발이 동시에 공중에 뜨지 않는가? (walk 모드)
8. 스프라이트 시트의 프레임이 정확히 128px 간격인가?
9. 배경이 모든 프레임에서 투명한가?

---

## 사전 조건

- Python 3 + Pillow(PIL) 설치 (`pip install Pillow`)
- `/pixl-charactor`로 생성한 캐릭터 + skeleton.json 필요

## 연계 스킬

```
/pixl-charactor {사진}                    # 먼저 캐릭터 생성
/pixl-attack {캐릭터} "검 휘두르기"        # 공격 모션
/pixl-runany {캐릭터}                      # 이동 모션
```
