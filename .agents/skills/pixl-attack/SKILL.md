---
name: pixl-attack
description: 픽셀 캐릭터의 공격 애니메이션 스프라이트 시트를 생성합니다. Claude가 직접 Python PIL 스크립트를 작성하여 6프레임 정규화된 애니메이션을 만듭니다.
---

# /pixl-attack — 공격 애니메이션 스프라이트 시트 생성

> 픽셀 캐릭터 이미지와 공격 동작을 입력하면, Claude가 직접 Python PIL 스크립트를 작성하여 정규화된 공격 애니메이션 스프라이트 시트를 생성합니다.

## 트리거

```
/pixl-attack output/pixl/warrior/character_128x128.png "몽둥이로 때리기"
/pixl-attack output/pixl/mage/character_128x128.png "마법 발사" --frames 8
/pixl-attack output/pixl/knight/character_128x128.png "검 휘두르기" --direction east
```

## 입력

| 파라미터 | 필수 | 설명 | 기본값 |
|---------|------|------|--------|
| 캐릭터 이미지 | O | /pixl-charactor로 생성한 128x128 캐릭터 | - |
| 공격 설명 | O | 공격 동작 설명 (한글) | - |
| `--frames` | | 애니메이션 프레임 수 (4/6/8) | 6 |
| `--direction` | | 공격 방향 (south/east/west/north) | east |
| `--view` | | 카메라 앵글 | side |
| `--speed` | | 프레임 속도 (slow/normal/fast) | normal |

## 출력

```
output/pixl/{캐릭터명}/
├── attack_spritesheet.png          # 스프라이트 시트 (128*N x 128)
├── attack_frames/                  # 개별 프레임
│   ├── frame_01.png
│   ├── frame_02.png
│   ├── ...
│   └── frame_06.png
└── attack_metadata.json            # 애니메이션 메타데이터
```

---

## Expert Knowledge: 공격 애니메이션 정규화

### 프레임 정규화 원칙

#### 1. 캐릭터 높이 고정 (가장 중요)

```
모든 프레임에서 캐릭터 본체의 높이는 동일해야 한다.

문제 상황:
  프레임 1: 캐릭터 100px (서있기)
  프레임 3: 캐릭터 85px  (웅크리기) ← 작아짐!
  프레임 5: 캐릭터 110px (점프공격) ← 커짐!

해결:
  모든 프레임에서 캐릭터 "발 위치(foot_y)"를 기준점으로 고정
  머리 높이는 포즈에 따라 변할 수 있지만
  발~어깨까지의 "몸통 높이"는 동일하게 유지
```

#### 2. 앵커 포인트 시스템

```
128x128 캔버스 내 고정 앵커:

  anchor_foot = (64, 112)     # 발 위치 (하단 기준)
  anchor_hip  = (64, 76)      # 엉덩이 (중심축)
  anchor_head = (64, 28)      # 머리 상단

모든 프레임에서 anchor_foot.y는 112px로 고정
→ 캐릭터가 점프하더라도 "지면 기준선"은 변하지 않음
→ 점프 공격 시: anchor_foot.y를 올리는 대신 그림자를 지면에 유지
```

#### 3. 프레임 간격 정규화

```
6프레임 공격 애니메이션 표준 타이밍:

프레임  | 포즈         | 비율  | 설명
--------|-------------|-------|------------------
1       | 준비        | 16%   | 무기 들어올리기 시작
2       | 와인드업    | 16%   | 최대 백스윙
3       | 스윙 시작   | 16%   | 공격 개시
4       | 임팩트      | 16%   | 타격 순간 (가장 역동적)
5       | 팔로스루    | 16%   | 공격 완료 관성
6       | 복귀        | 16%   | idle 포즈로 돌아가기

각 프레임 간 포즈 변화량이 균등해야 함 (등속 운동 원칙)
프레임 3→4 사이에만 급격한 변화 허용 (임팩트 강조)
```

#### 4. 무기/이펙트 영역 관리

```
┌─────────────────────────────┐
│         128x128              │
│                              │
│  ┌──────┐  ←무기 영역(좌)    │
│  │      │  (공격 반대편)      │
│  │  캐릭│  ←캐릭터 본체      │
│  │  터  │   (64px 중심)      │
│  │      │                    │
│  └──────┘──→ 무기 영역(우)   │
│              (공격 방향)      │
│         ───── 지면 기준선     │
└─────────────────────────────┘

무기 스윙 반경: 캔버스 가장자리까지 활용 가능
단, 캐릭터 본체는 절대 캔버스 밖으로 나가지 않음
```

### 공격 유형별 스켈레톤 키포인트

#### 근접 공격 (몽둥이, 검, 도끼)
```
프레임 1 (준비):     오른손 = 어깨 높이, 무기 세로
프레임 2 (와인드업): 오른손 = 머리 위, 무기 뒤로
프레임 3 (스윙):     오른손 = 머리→허리 이동 중
프레임 4 (임팩트):   오른손 = 앞쪽 최대 뻗기, 무기 수평
프레임 5 (팔로스루): 오른손 = 아래로 내려오기
프레임 6 (복귀):     오른손 = 프레임1 위치로
```

#### 원거리 공격 (마법, 활)
```
프레임 1 (준비):     양손 앞으로, 집중 포즈
프레임 2 (차지):     에너지 모으기 이펙트
프레임 3 (발사):     팔 뻗기 + 투사체 생성
프레임 4 (투사체):   투사체 이동
프레임 5 (잔여효과): 이펙트 페이드
프레임 6 (복귀):     idle로 돌아가기
```

---

## 워크플로우

### Step 1: 캐릭터 및 메타데이터 로드

```
Read: {캐릭터 이미지 경로}
Read: {같은 폴더}/character_skeleton.json    ← /pixl-charactor가 생성한 것
Read: {같은 폴더}/character_metadata.json
```

`character_metadata.json`에서 앵커 포인트와 캐릭터 높이 확인:
```json
{
  "actual_height": 100,
  "foot_y": 112,
  "center_x": 64
}
```

### Step 2: 공격 동작의 포즈 설계

공격 설명을 분석하여 6프레임의 포즈 계획을 수립:

```
공격: "몽둥이로 때리기"
→ 근접 공격 패턴 적용
→ 6프레임 포즈 설계

각 프레임의 특징:
  F1: 캐릭터 직립, 오른팔 어깨 높이로 올리기
  F2: 오른팔 머리 위로 최대 백스윙
  F3: 팔이 앞쪽으로 내려오는 중간 지점
  F4: 팔 완전히 뻗어 임팩트 (몸 약간 앞으로 기울기)
  F5: 팔이 아래로 완성된 팔로스루
  F6: F1 포즈로 복귀
```

**높이 검증 기준 (필수):**
```
매 프레임마다:
  foot_y = 112 고정 (앵커)
  몸통 높이 = 84px ±5px 이내
  center_x = 64px 기준
```

### Step 3: Python PIL 스크립트 작성 및 실행

Claude가 원본 캐릭터를 분석하여 6프레임 각각의 포즈를 PIL로 직접 그린다.

```python
from PIL import Image
import os, json

# 원본 캐릭터 로드
BASE_CHAR = Image.open("output/pixl/warrior/character_128x128.png")
output_dir = "output/pixl/warrior/attack_frames"
os.makedirs(output_dir, exist_ok=True)

def draw_frame(frame_index):
    """
    각 프레임의 포즈를 직접 그린다.
    원본 캐릭터를 기반으로, 팔/무기 위치만 변형한다.
    """
    img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    px = img.load()
    base_px = BASE_CHAR.load()

    # 원본 캐릭터 몸통 복사 (머리, 몸통, 다리)
    # 팔/무기 부분은 프레임마다 다르게 그림
    for y in range(128):
        for x in range(128):
            # 팔 영역(대략 y=30~60, 양쪽)을 제외한 나머지 복사
            if not _is_arm_region(x, y):
                px[x, y] = base_px[x, y]

    # 프레임별 팔/무기 위치 정의
    arm_poses = {
        0: {"right_arm_x": 74, "right_arm_y": 38, "weapon_angle": 90},   # 준비
        1: {"right_arm_x": 68, "right_arm_y": 22, "weapon_angle": 135},  # 와인드업
        2: {"right_arm_x": 80, "right_arm_y": 32, "weapon_angle": 60},   # 스윙
        3: {"right_arm_x": 96, "right_arm_y": 44, "weapon_angle": 0},    # 임팩트
        4: {"right_arm_x": 86, "right_arm_y": 58, "weapon_angle": -30},  # 팔로스루
        5: {"right_arm_x": 74, "right_arm_y": 38, "weapon_angle": 90},   # 복귀
    }

    pose = arm_poses[frame_index]
    _draw_arm(px, pose["right_arm_x"], pose["right_arm_y"])
    _draw_weapon(px, pose["right_arm_x"], pose["right_arm_y"], pose["weapon_angle"])

    return img

def _is_arm_region(x, y):
    # 오른팔 영역 (대략적인 범위, 캐릭터별로 조정)
    return (y >= 30 and y <= 65 and x >= 70 and x <= 100)

def _draw_arm(px, hand_x, hand_y):
    # 어깨(74, 34)에서 손목까지 팔을 그림
    shoulder_x, shoulder_y = 74, 34
    ARM_COLOR = (220, 180, 140, 255)
    OUTLINE   = (  0,   0,   0, 255)
    # 간단한 라인으로 팔 표현 (실제로는 두께 있는 선)
    for t in range(10):
        x = shoulder_x + int((hand_x - shoulder_x) * t / 9)
        y = shoulder_y + int((hand_y - shoulder_y) * t / 9)
        for dx in range(-2, 3):
            for dy in range(-2, 3):
                if 0 <= x+dx < 128 and 0 <= y+dy < 128:
                    px[x+dx, y+dy] = ARM_COLOR

def _draw_weapon(px, base_x, base_y, angle_deg):
    import math
    WEAPON_COLOR = (120, 80, 40, 255)
    rad = math.radians(angle_deg)
    length = 24
    for i in range(length):
        x = int(base_x + math.cos(rad) * i)
        y = int(base_y - math.sin(rad) * i)
        if 0 <= x < 128 and 0 <= y < 128:
            px[x, y] = WEAPON_COLOR
        if 0 <= x+1 < 128 and 0 <= y < 128:
            px[x+1, y] = WEAPON_COLOR

# 6프레임 생성
frames = []
for i in range(6):
    frame = draw_frame(i)
    frame.save(f"{output_dir}/frame_{i+1:02d}.png")
    frames.append(frame)
    print(f"프레임 {i+1} 저장 완료")

print("모든 프레임 생성 완료")
```

**실제 작업 시:** 원본 캐릭터의 색상, 체형, 의상을 분석하여 위 스크립트를 완전히 커스터마이징한다. `_is_arm_region`, `_draw_arm`, `_draw_weapon` 함수는 실제 캐릭터 픽셀 위치에 맞게 재작성한다.

### Step 4: 프레임 정규화 검증

각 프레임에 대해:

```python
from PIL import Image
import os

output_dir = "output/pixl/warrior/attack_frames"
frames = [Image.open(f"{output_dir}/frame_{i+1:02d}.png") for i in range(6)]

heights = []
foot_positions = []

for i, frame in enumerate(frames):
    px = frame.load()
    min_y, max_y = 128, 0
    for y in range(128):
        for x in range(128):
            if px[x, y][3] > 0:
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    # 무기/이펙트 영역 제외 (x < 80 기준 본체만)
    body_min_y, body_max_y = 128, 0
    for y in range(128):
        for x in range(40, 90):  # 본체 중심 영역
            if px[x, y][3] > 0:
                body_min_y = min(body_min_y, y)
                body_max_y = max(body_max_y, y)

    heights.append(body_max_y - body_min_y)
    foot_positions.append(body_max_y)
    print(f"F{i+1}: 본체 높이={body_max_y - body_min_y}px, foot_y={body_max_y}px")

avg_height = sum(heights) / len(heights)
max_deviation = max(abs(h - avg_height) for h in heights)
max_foot_dev  = max(abs(f - 112) for f in foot_positions)

print(f"\n평균 본체 높이: {avg_height:.1f}px")
print(f"최대 높이 편차: {max_deviation:.1f}px (허용: 5px)")
print(f"최대 발 위치 편차: {max_foot_dev:.1f}px (허용: 3px)")

assert max_deviation <= 5,   f"높이 편차 초과: {max_deviation:.1f}px"
assert max_foot_dev  <= 3,   f"발 위치 편차 초과: {max_foot_dev:.1f}px"
print("검증 통과")
```

### Step 5: 스프라이트 시트 조립

```python
from PIL import Image
import json

output_dir = "output/pixl/warrior"
frame_count = 6
sheet_w = 128 * frame_count  # 768
sheet_h = 128

sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))

for i in range(frame_count):
    frame = Image.open(f"{output_dir}/attack_frames/frame_{i+1:02d}.png")
    sheet.paste(frame, (i * 128, 0))

sheet.save(f"{output_dir}/attack_spritesheet.png")
print(f"스프라이트 시트 저장: {output_dir}/attack_spritesheet.png ({sheet_w}x{sheet_h})")
```

```
6프레임 → 768x128 스프라이트 시트

┌────────┬────────┬────────┬────────┬────────┬────────┐
│ F1     │ F2     │ F3     │ F4     │ F5     │ F6     │
│ 128x128│ 128x128│ 128x128│ 128x128│ 128x128│ 128x128│
│ 준비   │ 와인드 │ 스윙   │ 임팩트 │ 팔로스루│ 복귀   │
└────────┴────────┴────────┴────────┴────────┴────────┘

조립 규칙:
- 각 프레임 사이 간격: 0px (빈틈 없이 연결)
- 모든 프레임의 배경: 투명
- 프레임 순서: 좌→우 (시간순)
```

### Step 6: 메타데이터 저장

```json
// attack_metadata.json
{
  "animation": "attack",
  "attack_type": "몽둥이로 때리기",
  "frame_count": 6,
  "frame_size": {"width": 128, "height": 128},
  "spritesheet_size": {"width": 768, "height": 128},
  "anchor_foot": {"x": 64, "y": 112},
  "anchor_hip": {"x": 64, "y": 76},
  "timing": {
    "fps": 12,
    "frame_duration_ms": 83,
    "total_duration_ms": 500
  },
  "normalization": {
    "avg_body_height": 84,
    "max_height_deviation": 2,
    "foot_y_fixed": 112,
    "all_frames_validated": true
  }
}
```

---

## 품질 검증 체크리스트

1. 모든 프레임에서 캐릭터 본체 높이가 ±5px 이내로 일정한가?
2. 발 위치(foot_y)가 모든 프레임에서 112px로 고정되었는가?
3. 무기가 캔버스(128x128) 밖으로 벗어나지 않는가?
4. 프레임 1과 프레임 6의 포즈가 유사한가? (루프 가능)
5. 프레임 간 포즈 변화가 자연스럽게 연결되는가?
6. 프레임 간격이 균등한가? (등속 운동)
7. 스프라이트 시트의 모든 프레임이 정확히 128px 간격으로 배치되었는가?
8. 배경이 모든 프레임에서 투명한가?

---

## 사전 조건

- Python 3 + Pillow(PIL) 설치 (`pip install Pillow`)
- `/pixl-charactor`로 생성한 캐릭터 이미지 + skeleton.json 필요

## 연계 스킬

```
/pixl-charactor {사진}                    # 먼저 캐릭터 생성
/pixl-attack {캐릭터} "검 휘두르기"        # 공격 모션
/pixl-runany {캐릭터}                      # 이동 모션
```
