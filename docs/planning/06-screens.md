# 화면 설계 (UI/UX 명세)

## 개요

newVideoGen의 웹 앱은 3개의 주요 화면(S1, S2, S3)으로 구성되어 있습니다. 각 화면의 레이아웃, 컴포넌트, 인터랙션을 정의합니다.

---

## 📱 화면 네비게이션 맵

```
┌─────────────────────────────────────────────────┐
│  홈 / 프로젝트 선택                              │
│  (프로젝트 목록, 새 프로젝트 생성)                │
└────────────────┬────────────────────────────────┘
                 │ 프로젝트 열기
                 ▼
┌─────────────────────────────────────────────────┐
│  S1: 타임라인 에디터 (메인)                      │
│  URL: /                                         │
│  ├─ 상단: 프로젝트 정보 + 컨트롤                │
│  ├─ 중앙: 타임라인 (수평 스크롤)               │
│  ├─ 우측: DSL 에디터                           │
│  └─ 하단: 오디오 파형 + 비트 마커               │
│                                                 │
│  [S2로 이동] [렌더링 시작]                      │
└────────┬─────────────────────┬──────────────────┘
         │                     │
    [프리뷰]              [렌더링 시작]
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌─────────────────────┐
│  S2: 프리뷰      │  │  S3: 렌더 출력      │
│  URL: /preview   │  │  URL: /render       │
│                  │  │                     │
│  ├─ Remotion     │  │  ├─ 진행률 바      │
│  │   Player      │  │  ├─ 렌더 로그      │
│  │               │  │  └─ 다운로드 버튼  │
│  ├─ 장면 네비게이션
│  └─ 재생 컨트롤  │
│                  │
│  [돌아가기]      │
└──────────────────┘
```

---

## 🎬 S1: 타임라인 에디터 (메인 화면)

**URL**: `/`
**기능**: AI 제안 결과 시각화 + 편집

### 레이아웃

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (높이 60px)                                              │
│  ┌────────────┬────────────────────────┬───────────────┬────────┐
│  │ Logo/Title │ Project: video-001.srt │ [저장]  [⚙️]  │ [👤]   │
│  └────────────┴────────────────────────┴───────────────┴────────┘
├──────────────────────────────────────────────────────────────────┤
│ Main Content (flex)                                              │
├─────────────────────────────────────────┬────────────────────────┤
│ Left Panel (70%)                        │ Right Panel (30%)      │
│                                         │                        │
│  Timeline Viewport                      │  DSL Editor            │
│  ┌───────────────────────────────────┐ │  ┌────────────────────┐
│  │ ◀ [Scene Cards] (수평 스크롤) ▶   │ │  │ Scene ID: scene-001
│  │                                   │ │  │ Layout: hero-center
│  │ ┌──────┐ ┌──────┐ ┌──────┐       │ │  │                    │
│  │ │ Sc-1 │ │ Sc-2 │ │ Sc-3 │ ...   │ │  │ [컴포넌트 목록]    │
│  │ │ hero │ │split │ │grid  │       │ │  │ ├─ Kicker        │
│  │ │      │ │      │ │      │       │ │  │ ├─ Headline      │
│  │ │ 0-5s │ │ 5-10s│ │10-15s│       │ │  │ └─ Supporting   │
│  │ └──────┘ └──────┘ └──────┘       │ │  │                    │
│  │  ▲                                │ │  │ [Template 변경]    │
│  │ (선택 시 우측 패널 업데이트)      │ │  │ ┌──────────────┐  │
│  │                                   │ │  │ │hero-center ▼ │  │
│  │ [구간 나누기] [병합] [삭제]       │ │  │ └──────────────┘  │
│  └───────────────────────────────────┘ │  │                    │
│                                         │  │ [JSON 편집]        │
│  오디오 파형 + 비트 마커                │  │ ┌────────────────┐
│  ┌───────────────────────────────────┐ │  │ { "id": ...    │
│  │ 🎵 Audio Waveform (플레이헤드)    │ │  │ }              │
│  │ ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁   │ │  │                │
│  │ 0s      5s       10s       15s    │ │  │ [저장]         │
│  │                                   │ │  └────────────────┘
│  │ [비트 마커] ●    ●    ●          │ │                    │
│  └───────────────────────────────────┘ │                        │
├─────────────────────────────────────────┴────────────────────────┤
│ Footer (높이 40px)                                               │
│ ┌──────────────────────────────────────────────────────────────┐
│ │ [◀ 이전] [▶ 다음] │ 장면 1/3 │ 진행도: ████░░░░░░ 40% │     │
│ │ [프리뷰 보기] [렌더링 시작]                                   │
│ └──────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트

#### Header 컴포넌트

```typescript
// Header.tsx
interface HeaderProps {
  projectName: string;
  isSaved: boolean;
  onSave: () => void;
  onSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  isSaved,
  onSave,
  onSettings,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-green-500">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-green-500">newVideoGen</h1>
        <span className="text-gray-400 text-sm">Project: {projectName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isSaved ? "outline" : "default"}
          onClick={onSave}
        >
          {isSaved ? "저장됨" : "저장"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onSettings}>
          ⚙️
        </Button>
      </div>
    </header>
  );
};
```

#### Timeline 컴포넌트

```typescript
// Timeline.tsx
interface TimelineProps {
  scenes: SceneType[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onSplitScene: (beatIndex: number) => void;
  onMergeScenes: (beatIndex1: number, beatIndex2: number) => void;
  onDeleteScene: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  scenes,
  selectedSceneId,
  onSelectScene,
  onSplitScene,
  onMergeScenes,
  onDeleteScene,
}) => {
  return (
    <div className="flex-1 overflow-x-auto bg-black p-4">
      <div className="flex gap-3 min-w-max">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            isSelected={scene.id === selectedSceneId}
            onSelect={() => onSelectScene(scene.id)}
            onSplit={() => onSplitScene(scene.beatIndex)}
            onDelete={() => onDeleteScene(scene.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => onSplitScene(0)}>
          구간 나누기
        </Button>
        <Button size="sm" variant="outline" onClick={() => onMergeScenes(0, 1)}>
          병합
        </Button>
      </div>
    </div>
  );
};
```

#### SceneCard 컴포넌트

```typescript
// SceneCard.tsx
interface SceneCardProps {
  scene: SceneType;
  isSelected: boolean;
  onSelect: () => void;
  onSplit: () => void;
  onDelete: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isSelected,
  onSelect,
  onSplit,
  onDelete,
}) => {
  return (
    <Card
      className={cn(
        "w-40 cursor-pointer transition-all",
        isSelected ? "ring-2 ring-green-500" : "border-gray-700"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="aspect-video bg-gray-900 rounded mb-2 flex items-center justify-center text-xs text-gray-600">
          {scene.layoutFamily}
        </div>
        <h4 className="text-sm font-semibold text-white truncate">
          Scene {scene.beatIndex + 1}
        </h4>
        <p className="text-xs text-gray-400">
          {scene.durationFrames / 30}s
        </p>
        <div className="flex gap-1 mt-2 justify-between">
          <Button size="xs" variant="ghost" onClick={onSplit}>
            나누기
          </Button>
          <Button size="xs" variant="ghost" onClick={onDelete}>
            삭제
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### DSL Editor 컴포넌트

```typescript
// DSLEditor.tsx
interface DSLEditorProps {
  scene: SceneType | null;
  onUpdate: (scene: SceneType) => void;
  onChangeTemplate: (layoutFamily: LayoutFamily) => void;
}

export const DSLEditor: React.FC<DSLEditorProps> = ({
  scene,
  onUpdate,
  onChangeTemplate,
}) => {
  if (!scene) return <div className="text-gray-500 text-center">선택 없음</div>;

  const [jsonStr, setJsonStr] = React.useState(JSON.stringify(scene, null, 2));

  return (
    <Tabs defaultValue="template" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="template">템플릿</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="template" className="space-y-4">
        <div>
          <Label>레이아웃 선택</Label>
          <Select
            value={scene.layoutFamily}
            onValueChange={onChangeTemplate}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hero-center">
                대형 숫자/텍스트 중앙 배치
              </SelectItem>
              <SelectItem value="split-2col">2열 비교 레이아웃</SelectItem>
              <SelectItem value="grid-4x3">그리드 레이아웃</SelectItem>
              <SelectItem value="process-horizontal">
                수평 프로세스 플로우
              </SelectItem>
              <SelectItem value="radial-focus">
                원형 차트/프로그레스 링
              </SelectItem>
              <SelectItem value="stacked-vertical">
                세로 타임라인/스텝
              </SelectItem>
              <SelectItem value="comparison-bars">
                수평 바 차트 비교
              </SelectItem>
              <SelectItem value="spotlight-case">
                사례/제품 스포트라이트
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>컴포넌트 목록</Label>
          <ScrollArea className="h-40 border border-gray-700 rounded p-2">
            {scene.components.map((comp) => (
              <div key={comp.id} className="text-sm text-gray-400 py-1">
                {comp.type}: {comp.id}
              </div>
            ))}
          </ScrollArea>
        </div>
      </TabsContent>

      <TabsContent value="json">
        <Textarea
          value={jsonStr}
          onChange={(e) => setJsonStr(e.target.value)}
          className="font-mono text-xs h-64"
        />
        <Button
          className="mt-2 w-full"
          onClick={() => {
            const updated = JSON.parse(jsonStr);
            onUpdate(updated);
          }}
        >
          저장
        </Button>
      </TabsContent>
    </Tabs>
  );
};
```

#### AudioWaveform 컴포넌트

```typescript
// AudioWaveform.tsx
interface AudioWaveformProps {
  audioFile: string;
  beatMarkers: BeatMarker[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioFile,
  beatMarkers,
  currentTime,
  onSeek,
}) => {
  return (
    <div className="w-full h-24 bg-gray-900 rounded p-2 border border-gray-700">
      <div className="relative h-full">
        {/* 파형 시각화 */}
        <svg className="w-full h-full">
          <polyline
            points="0,60 10,40 20,50 30,30 40,60..."
            fill="none"
            stroke="#00FF00"
            strokeWidth="1"
          />
        </svg>

        {/* 재생 헤드 */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-green-500"
          style={{
            left: `${(currentTime / totalDuration) * 100}%`,
            cursor: "col-resize",
          }}
          onMouseDown={(e) => {
            const rect = e.currentTarget.parentElement!.getBoundingClientRect();
            const newTime = ((e.clientX - rect.left) / rect.width) * totalDuration;
            onSeek(newTime);
          }}
        />

        {/* 비트 마커 */}
        {beatMarkers.map((marker) => (
          <div
            key={marker.beatIndex}
            className="absolute top-0 w-1 h-full bg-yellow-400 opacity-50"
            style={{
              left: `${(marker.timeMs / totalDuration) * 100}%`,
            }}
            title={`Beat ${marker.beatIndex}: ${marker.text}`}
          />
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-1 flex justify-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
    </div>
  );
};
```

### 인터랙션

#### 시나리오 1: 장면 선택

1. 타임라인에서 장면 카드 클릭
2. 우측 패널이 선택된 장면의 DSL로 업데이트
3. 프리뷰 플레이어도 해당 장면으로 스크롤

#### 시나리오 2: 템플릿 변경

1. 우측 패널에서 레이아웃 드롭다운 변경
2. Scene DSL 자동 업데이트
3. 프리뷰에 실시간 반영

#### 시나리오 3: 구간 나누기

1. 구간 나누기 버튼 클릭
2. 모달 열기: "어디서 나눌까요?"
3. 선택 후 두 개의 새로운 Scene DSL 생성

---

## 🎥 S2: Remotion 프리뷰

**URL**: `/preview`
**기능**: 실시간 영상 미리보기

### 레이아웃

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (높이 60px)                                              │
│  ┌────────────┬──────────────────────┬──────────────────────────┐
│  │ ◀ 돌아가기 │ Remotion Player      │ [전체화면] [⚙️]         │
│  └────────────┴──────────────────────┴──────────────────────────┘
├──────────────────────────────────────────────────────────────────┤
│ Player Container (중앙 정렬)                                     │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │                                                            │  │
│ │  ┌──────────────────────────────────────────────────┐    │  │
│ │  │                                                  │    │  │
│ │  │        1920x1080 Remotion Player                │    │  │
│ │  │                                                  │    │  │
│ │  │  [장면 콘텐츠가 여기에 렌더링됨]                 │    │  │
│ │  │                                                  │    │  │
│ │  └──────────────────────────────────────────────────┘    │  │
│ │                                                            │  │
│ └────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│ Controls Panel (높이 100px)                                      │
│ ┌──────────────────────────────────────────────────────────────┐
│ │                                                              │
│ │  [◀◀] [▶] [⏸] [▶▶]  │  장면: 1/3  │  속도: 1x ▼           │
│ │                                                              │
│ │  Timeline: ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│ │  [0:00] ................. [0:10]                           │
│ │                                                              │
│ │  🔊 음량: ░░░░░░░░░░░░░░░                                   │
│ │                                                              │
│ └──────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트

#### RemotionPlayer 컴포넌트

```typescript
// RemotionPlayer.tsx
interface RemotionPlayerProps {
  compositionId: string;
  scenes: SceneDsl[];
  audioFile: string;
  onFrameChange?: (frame: number) => void;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  compositionId,
  scenes,
  audioFile,
  onFrameChange,
}) => {
  const playerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={playerRef} className="w-full h-full bg-black">
      <Player
        component={() => <SceneComposition scenes={scenes} />}
        durationInFrames={calculateTotalFrames(scenes)}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls={true}
        autoPlay={false}
        loop={false}
        onFrameUpdate={onFrameChange}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
```

#### SceneNavigation 컴포넌트

```typescript
// SceneNavigation.tsx
interface SceneNavigationProps {
  currentScene: number;
  totalScenes: number;
  onNextScene: () => void;
  onPreviousScene: () => void;
}

export const SceneNavigation: React.FC<SceneNavigationProps> = ({
  currentScene,
  totalScenes,
  onNextScene,
  onPreviousScene,
}) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 border-t border-gray-700">
      <Button size="sm" onClick={onPreviousScene} disabled={currentScene === 0}>
        ◀ 이전
      </Button>
      <span className="text-sm text-gray-400">
        장면 {currentScene + 1}/{totalScenes}
      </span>
      <Button size="sm" onClick={onNextScene} disabled={currentScene === totalScenes - 1}>
        다음 ▶
      </Button>
    </div>
  );
};
```

#### PlaybackControls 컴포넌트

```typescript
// PlaybackControls.tsx
interface PlaybackControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  playbackRate: number;
  volume: number;
  onPlayPause: () => void;
  onSeek: (frame: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentFrame,
  totalFrames,
  playbackRate,
  volume,
  onPlayPause,
  onSeek,
  onPlaybackRateChange,
  onVolumeChange,
}) => {
  return (
    <div className="space-y-4 px-4 py-4 bg-gray-900 border-t border-gray-700">
      {/* 재생 컨트롤 */}
      <div className="flex items-center gap-4">
        <Button size="sm" onClick={onPlayPause}>
          {isPlaying ? "⏸ 일시 정지" : "▶ 재생"}
        </Button>

        {/* 재생 속도 선택 */}
        <Select value={playbackRate.toString()}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 타임라인 슬라이더 */}
      <div className="space-y-2">
        <Slider
          value={[currentFrame]}
          onValueChange={([frame]) => onSeek(frame)}
          max={totalFrames}
          step={1}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentFrame / 30)}</span>
          <span>{formatTime(totalFrames / 30)}</span>
        </div>
      </div>

      {/* 음량 제어 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">🔊</span>
        <Slider
          value={[volume]}
          onValueChange={([v]) => onVolumeChange(v)}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-gray-400">{volume}%</span>
      </div>
    </div>
  );
};
```

---

## 📊 S3: 렌더 출력

**URL**: `/render`
**기능**: 렌더링 진행률 모니터링 + mp4 다운로드

### 레이아웃

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (높이 60px)                                              │
│  ┌────────────┬──────────────────────┬──────────────────────────┐
│  │ ◀ 돌아가기 │ 렌더링 진행률        │ [⚙️]                    │
│  └────────────┴──────────────────────┴──────────────────────────┘
├──────────────────────────────────────────────────────────────────┤
│ Main Content (중앙 정렬)                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                                                        │     │
│  │  렌더링 진행 중...                                     │     │
│  │                                                        │     │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │     │
│  │  60% (180/300 프레임)                                  │     │
│  │                                                        │     │
│  │  예상 완료 시간: 2분 30초                              │     │
│  │  경과 시간: 1분 30초                                   │     │
│  │                                                        │     │
│  │  [일시 정지] [취소]                                   │     │
│  │                                                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  최근 로그 (스크롤 가능)                                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ [2026-03-10 10:05:30] 렌더링 시작 (300 프레임)         │     │
│  │ [2026-03-10 10:05:35] Scene001 렌더링 중...            │     │
│  │ [2026-03-10 10:06:00] Scene001 완료 (50/300)           │     │
│  │ [2026-03-10 10:06:25] Scene002 렌더링 중...            │     │
│  │ ...                                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
│  Footer (높이 60px, 렌더링 완료 후만 표시)                      │
│  ┌──────────────────────────────────────────────────────────────┐
│  │ ✅ 렌더링 완료!                                             │
│  │                                                              │
│  │ video-001.mp4 (125MB)  [다운로드] [폴더에서 열기] [공유]   │
│  └──────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트

#### RenderProgress 컴포넌트

```typescript
// RenderProgress.tsx
interface RenderProgressProps {
  totalFrames: number;
  renderedFrames: number;
  estimatedTimeRemaining: number; // 초 단위
  elapsedTime: number;
  currentScene?: string;
}

export const RenderProgress: React.FC<RenderProgressProps> = ({
  totalFrames,
  renderedFrames,
  estimatedTimeRemaining,
  elapsedTime,
  currentScene,
}) => {
  const percentComplete = (renderedFrames / totalFrames) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            렌더링 진행 중...
          </h3>
          <Progress value={percentComplete} className="h-2" />
          <p className="text-sm text-gray-400 mt-2">
            {percentComplete.toFixed(1)}% ({renderedFrames}/{totalFrames} 프레임)
          </p>
        </div>

        {currentScene && (
          <p className="text-sm text-gray-400">
            현재: {currentScene}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">경과 시간:</span>
            <span className="text-white ml-2">{formatTime(elapsedTime)}</span>
          </div>
          <div>
            <span className="text-gray-400">예상 남은 시간:</span>
            <span className="text-white ml-2">
              {formatTime(estimatedTimeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            일시 정지
          </Button>
          <Button variant="destructive" size="sm">
            취소
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### RenderLog 컴포넌트

```typescript
// RenderLog.tsx
interface LogEntry {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

interface RenderLogProps {
  logs: LogEntry[];
}

export const RenderLog: React.FC<RenderLogProps> = ({ logs }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm">렌더링 로그</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={scrollRef}
          className="h-40 w-full border border-gray-700 rounded p-2"
        >
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={cn(
                  "text-gray-400",
                  log.level === "error" && "text-red-400",
                  log.level === "warning" && "text-yellow-400"
                )}
              >
                <span className="text-gray-600">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
```

#### DownloadButton 컴포넌트

```typescript
// DownloadButton.tsx
interface DownloadButtonProps {
  mp4File: string;
  fileSize: number;
  isComplete: boolean;
  onDownload: () => void;
  onOpenFolder: () => void;
  onShare: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  mp4File,
  fileSize,
  isComplete,
  onDownload,
  onOpenFolder,
  onShare,
}) => {
  if (!isComplete) return null;

  return (
    <Card className="w-full bg-green-900/20 border-green-500">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 font-semibold">✅ 렌더링 완료!</p>
            <p className="text-sm text-gray-400 mt-1">
              {mp4File} ({formatFileSize(fileSize)})
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onDownload}>다운로드</Button>
            <Button variant="outline" onClick={onOpenFolder}>
              폴더에서 열기
            </Button>
            <Button variant="ghost" onClick={onShare}>
              공유
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🎨 공통 디자인 시스템

### 색상 팔레트

```css
/* 배경 */
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--bg-tertiary: #1a1a1a;

/* 텍스트 */
--text-primary: #FFFFFF;
--text-secondary: #B0B0B0;
--text-tertiary: #808080;

/* 강조 */
--accent-primary: #00FF00;  /* 네온 그린 */
--accent-secondary: #FF0080; /* 핫 핑크 */
--accent-tertiary: #00FFFF; /* 시안 */

/* 상태 */
--success: #00FF00;
--warning: #FFD700;
--error: #FF4444;
--info: #00FFFF;

/* 테두리 */
--border-primary: #333333;
--border-accent: #00FF00;
```

### 타이포그래피

```css
/* 헤드라인 */
--headline-size: 64px;
--headline-weight: 700;
--headline-font: "Inter", sans-serif;

/* 본문 */
--body-size: 24px;
--body-weight: 400;
--body-font: "Inter", sans-serif;

/* 캡션 */
--caption-size: 16px;
--caption-weight: 400;
--caption-font: "Inter", sans-serif;
```

---

## 📱 반응형 설계

### 뷰포트 크기

| 기기 | 너비 | 정렬 |
|------|------|------|
| 데스크톱 | 1920px+ | 타임라인 + 우측 패널 (70/30) |
| 태블릿 | 1024-1919px | 타임라인 (전체, 우측 패널 오버레이) |
| 모바일 | <1024px | 타임라인 (수직, 스택 레이아웃) |

---

## 참조

- PRD: `01-prd.md`
- 아키텍처: `04-architecture.md`
- API 명세: `05-api-spec.md`
- 코딩 컨벤션: `07-coding-convention.md`
