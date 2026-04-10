---
name: reat-render
description: scenes-v2.json + render-props-v2.json을 사용하여 Remotion으로 mp4 영상을 렌더링합니다.
---

# /reat-render — Remotion mp4 렌더링

## 호출

```
/reat-render {projectId}
```

## 전제조건

`/reat-layout`이 완료되어 다음 파일이 존재해야 함:
- `data/{projectId}/scenes-v2.json` (stack_root 포함)
- `data/{projectId}/render-props-v2.json` (scenes 동기화 완료)
- `public/` 에 오디오 파일 복사 완료

## 워크플로우

### 1. 검증 + 오디오 복사

```bash
# scenes-v2.json 존재 확인
ls data/{projectId}/scenes-v2.json

# render-props-v2.json 존재 확인
ls data/{projectId}/render-props-v2.json
```

**오디오 파일 최신 복사 (필수):**
project.json에서 `audio_path`를 읽고, `input/reat/`에 원본이 있으면 **항상** `public/`으로 복사 (덮어쓰기):

```bash
# project.json에서 audio_path 읽기 (예: "가치 노동.mp3")
# input/reat/에 해당 파일이 있으면 public/으로 복사
cp "input/reat/{audio_filename}" "public/{audio_filename}"
```

복사 후 `public/{audio_filename}` 존재 확인. 없으면 에러.

### 2. render-props-v2.json 동기화 (필수)

**항상** scenes-v2.json과 project.json에서 다시 생성:

```javascript
const scenes = JSON.parse(fs.readFileSync('data/{projectId}/scenes-v2.json'));
const project = JSON.parse(fs.readFileSync('data/{projectId}/project.json'));
// audio_path는 "public/" 접두사 없이 파일명만 (예: "가치 노동.mp3")
// Remotion staticFile()이 public/ 기준 상대경로를 사용하므로
const renderProps = {
  projectId: project.id,
  audioSrc: project.audio_path,  // "가치 노동.mp3" (public/ 접두사 없이!)
  scenes: scenes
};
fs.writeFileSync('data/{projectId}/render-props-v2.json', JSON.stringify(renderProps, null, 2));
```

**주의:** `audioSrc`에 `"public/"` 접두사 절대 붙이지 않는다. `staticFile("가치 노동.mp3")`는 자동으로 `public/가치 노동.mp3`를 찾는다.

### 3. 렌더링 실행

```bash
npx remotion render MainComposition output/reat/{projectId}.mp4 \
  --props=data/{projectId}/render-props-v2.json \
  --concurrency=4
```

### 4. 상태 업데이트

렌더링 성공 시 project.json 업데이트:
```json
{
  "status": "rendered",
  "updated_at": "..."
}
```

### 5. 결과 보고

- 출력 파일: `output/reat/{projectId}.mp4`
- 파일 크기, 렌더링 소요 시간 보고

## 주의사항

- 렌더링은 시간이 오래 걸림 (10분 영상 ≈ 5~10분) → 백그라운드 실행 권장
- `remotion.config.ts` 포트 설정은 주석 처리 상태 (Next.js 충돌 방지)
- 오디오 파일은 반드시 `public/` 아래에 있어야 Remotion `staticFile()`이 인식
- concurrency=4 이상은 메모리 부족 위험
