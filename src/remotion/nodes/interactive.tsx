// Interactive Nodes: ChatBubble, PhoneMockup, MonitorMockup, TerminalBlock
import React from "react";
import type { NodeProps } from "@/types/stack-nodes";
import { T, useScenePalette } from "../common/theme";

// ---------------------------------------------------------------------------
// ChatBubbleRenderer
// 좌/우 말풍선 — iMessage 스타일
// node.data.messages: Array<{ sender: string; text: string; side: "left" | "right" }>
// ---------------------------------------------------------------------------
export const ChatBubbleRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();
  const messages: Array<{ sender: string; text: string; side: "left" | "right" }> =
    d.messages ?? [];

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);

  // 메시지당 등장 간격: 전체 duration을 메시지 수로 나눔
  const msgCount = messages.length;
  const framePerMsg = msgCount > 0 ? dur / msgCount : dur;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
      padding: "4px 0",
      ...(node.style as React.CSSProperties),
    }}>
      {messages.map((msg, i) => {
        const visibleAt = i * framePerMsg;
        if (localFrame < visibleAt) return null;

        const isRight = msg.side === "right";
        const opacity = Math.min(1, (localFrame - visibleAt) / 6);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isRight ? "flex-end" : "flex-start",
              gap: 4,
              opacity,
            }}
          >
            {/* 발신자 이름 */}
            <span style={{
              fontFamily: T.font,
              fontSize: 13,
              color: T.textMuted,
              paddingLeft: isRight ? 0 : 14,
              paddingRight: isRight ? 14 : 0,
            }}>
              {msg.sender}
            </span>

            {/* 말풍선 */}
            <div style={{
              maxWidth: "80%",
              padding: "12px 16px",
              borderRadius: isRight
                ? "20px 20px 6px 20px"
                : "20px 20px 20px 6px",
              backgroundColor: isRight
                ? P.accent
                : T.bgSurface,
              border: isRight
                ? `1px solid ${P.accentBright}40`
                : `1px solid ${T.borderDefault}`,
              boxShadow: isRight
                ? `0 0 14px ${P.accentGlow}`
                : "none",
              fontFamily: T.font,
              fontSize: 17,
              color: T.textPrimary,
              lineHeight: 1.5,
              wordBreak: "keep-all",
            }}>
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PhoneMockupRenderer
// SVG 스마트폰 프레임 (노치 포함)
// node.data.title: 앱 이름 / node.data.content: 화면 내 텍스트
// node.data.items: 선택적 리스트 아이템 배열
// ---------------------------------------------------------------------------
export const PhoneMockupRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur);

  const phoneW = 200;
  const phoneH = 380;
  const screenPad = 14;
  const screenTop = 56;
  const screenH = phoneH - screenTop - 20;

  const items: string[] = d.items ?? [];

  return (
    <div style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "center",
      opacity: progress,
      transform: `scale(${0.88 + 0.12 * progress})`,
      transformOrigin: "center center",
      ...(node.style as React.CSSProperties),
    }}>
      {/* 폰 외곽 프레임 */}
      <div style={{
        width: phoneW,
        height: phoneH,
        borderRadius: 32,
        border: `2.5px solid ${P.accentBright}`,
        boxShadow: `0 0 24px ${P.accentGlow}, inset 0 0 10px rgba(0,0,0,0.5)`,
        backgroundColor: "#0A0A0F",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 상단 노치 */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 72,
          height: 24,
          backgroundColor: "#0A0A0F",
          borderRadius: "0 0 16px 16px",
          zIndex: 2,
          border: `0 solid ${P.accentBright}`,
          borderBottom: `2px solid ${P.accentBright}30`,
        }} />

        {/* 상태바 / 앱 제목 */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: screenTop,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 8,
          backgroundColor: T.bgSurface,
          borderBottom: `1px solid ${P.borderAccent}`,
          zIndex: 1,
        }}>
          <span style={{
            fontFamily: T.font,
            fontSize: 13,
            fontWeight: 700,
            color: P.accentBright,
            letterSpacing: "0.04em",
          }}>
            {d.title ?? "App"}
          </span>
        </div>

        {/* 화면 콘텐츠 */}
        <div style={{
          position: "absolute",
          top: screenTop,
          left: screenPad,
          right: screenPad,
          bottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingTop: 12,
          overflow: "hidden",
        }}>
          {d.content && (
            <p style={{
              fontFamily: T.font,
              fontSize: 13,
              color: T.textSecondary,
              lineHeight: 1.55,
              margin: 0,
            }}>
              {d.content}
            </p>
          )}

          {items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 10px",
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.borderDefault}`,
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: P.accentBright,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: T.font,
                    fontSize: 12,
                    color: T.textPrimary,
                    lineHeight: 1.4,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 홈 인디케이터 */}
        <div style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 4,
          borderRadius: 2,
          backgroundColor: P.accentBright,
          opacity: 0.5,
        }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MonitorMockupRenderer
// SVG 데스크톱 모니터 프레임 (스탠드 포함)
// node.data.title: 윈도우 타이틀
// node.data.lines: 화면 내 텍스트 라인 배열
// ---------------------------------------------------------------------------
export const MonitorMockupRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);
  const progress = Math.min(1, localFrame / dur);

  const monitorW = 400;
  const monitorH = 260;
  const screenPad = 16;
  const titleBarH = 36;

  const lines: string[] = d.lines ?? [];

  return (
    <div style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "center",
      opacity: progress,
      transform: `scale(${0.90 + 0.10 * progress})`,
      transformOrigin: "center center",
      ...(node.style as React.CSSProperties),
    }}>
      {/* 모니터 화면 */}
      <div style={{
        width: monitorW,
        height: monitorH,
        borderRadius: "14px 14px 0 0",
        border: `2.5px solid ${P.accentBright}`,
        boxShadow: `0 0 28px ${P.accentGlow}, 0 8px 32px rgba(0,0,0,0.6)`,
        backgroundColor: "#080810",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* 타이틀 바 */}
        <div style={{
          height: titleBarH,
          backgroundColor: T.bgSurface,
          borderBottom: `1px solid ${P.borderAccent}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          gap: 8,
        }}>
          {/* macOS 신호등 버튼 */}
          {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
            <div key={i} style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              backgroundColor: color,
              flexShrink: 0,
            }} />
          ))}
          <span style={{
            fontFamily: T.font,
            fontSize: 13,
            fontWeight: 600,
            color: T.textSecondary,
            flex: 1,
            textAlign: "center",
            marginRight: 33, // 신호등 버튼 너비만큼 보정
          }}>
            {d.title ?? "Window"}
          </span>
        </div>

        {/* 화면 콘텐츠 */}
        <div style={{
          padding: screenPad,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "hidden",
          height: monitorH - titleBarH - screenPad * 2,
        }}>
          {lines.map((line, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}>
              <span style={{
                fontFamily: "monospace",
                fontSize: 14,
                color: T.textMuted,
                minWidth: 20,
                textAlign: "right",
                userSelect: "none",
              }}>
                {i + 1}
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: 14,
                color: T.textPrimary,
                lineHeight: 1.6,
              }}>
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* 화면 반사 광택 효과 */}
        <div style={{
          position: "absolute",
          top: titleBarH,
          left: 0,
          right: 0,
          height: 40,
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* 베젤 하단 */}
      <div style={{
        width: monitorW,
        height: 20,
        backgroundColor: T.bgSurface,
        borderLeft: `2.5px solid ${P.accentBright}`,
        borderRight: `2.5px solid ${P.accentBright}`,
        borderBottom: `2.5px solid ${P.accentBright}`,
        borderRadius: "0 0 6px 6px",
      }} />

      {/* 스탠드 넥 */}
      <div style={{
        width: 36,
        height: 22,
        backgroundColor: T.bgSurface,
        borderLeft: `2px solid ${P.accentBright}50`,
        borderRight: `2px solid ${P.accentBright}50`,
      }} />

      {/* 스탠드 베이스 */}
      <div style={{
        width: 120,
        height: 10,
        borderRadius: 5,
        backgroundColor: T.bgSurface,
        border: `2px solid ${P.accentBright}60`,
        boxShadow: `0 0 10px ${P.accentGlow}`,
      }} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// TerminalBlockRenderer
// 터미널/코드 블록 — macOS 스타일 다크 터미널
// node.data.lines: 명령어 라인 배열
// node.data.title: 터미널 제목 (기본값 "Terminal")
// ---------------------------------------------------------------------------
export const TerminalBlockRenderer: React.FC<NodeProps> = ({ node, frame }) => {
  const d = node.data ?? {};
  const P = useScenePalette();

  const enterAt = node.motion?.enterAt ?? 0;
  const dur = node.motion?.duration ?? 20;
  const localFrame = Math.max(0, frame - enterAt);

  const lines: string[] = d.lines ?? [];
  const title: string = d.title ?? "Terminal";

  // 라인별 순차 등장
  const lineCount = lines.length;
  const framePerLine = lineCount > 0 ? dur / lineCount : dur;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
      borderRadius: 12,
      overflow: "hidden",
      border: `1.5px solid ${T.borderDefault}`,
      boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      ...(node.style as React.CSSProperties),
    }}>
      {/* 타이틀 바 — macOS 스타일 */}
      <div style={{
        height: 38,
        backgroundColor: "#1C1C1E",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 14,
        paddingRight: 14,
        gap: 0,
        flexShrink: 0,
        position: "relative",
      }}>
        {/* 신호등 3개 점 */}
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
            <div key={i} style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: color,
            }} />
          ))}
        </div>

        {/* 타이틀 */}
        <span style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: T.font,
          fontSize: 13,
          fontWeight: 500,
          color: T.textMuted,
          whiteSpace: "nowrap",
        }}>
          {title}
        </span>
      </div>

      {/* 터미널 바디 */}
      <div style={{
        backgroundColor: "#0D0D0F",
        padding: "16px 20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 80,
      }}>
        {lines.map((line, i) => {
          const visibleAt = i * framePerLine;
          if (localFrame < visibleAt) return null;

          const lineOpacity = Math.min(1, (localFrame - visibleAt) / 5);
          const isCurrent = i === lineCount - 1 ||
            (localFrame >= visibleAt && localFrame < (i + 1) * framePerLine);

          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              opacity: lineOpacity,
            }}>
              {/* $ 프롬프트 */}
              <span style={{
                fontFamily: "monospace",
                fontSize: 15,
                color: P.accentBright,
                flexShrink: 0,
                textShadow: `0 0 8px ${P.accentGlow}`,
                userSelect: "none",
              }}>
                $
              </span>

              {/* 명령어 텍스트 */}
              <span style={{
                fontFamily: "monospace",
                fontSize: 15,
                color: "#22C55E",
                lineHeight: 1.6,
                wordBreak: "break-all",
              }}>
                {line}
              </span>

              {/* 커서 — 현재 마지막 줄에만 표시 */}
              {isCurrent && localFrame < (i + 1) * framePerLine && (
                <span style={{
                  display: "inline-block",
                  width: 9,
                  height: 15,
                  backgroundColor: "#22C55E",
                  opacity: Math.floor(localFrame / 8) % 2 === 0 ? 1 : 0,
                  verticalAlign: "text-bottom",
                  borderRadius: 1,
                }} />
              )}
            </div>
          );
        })}

        {/* 완료 후 빈 커서 라인 */}
        {localFrame >= dur && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: 15,
              color: P.accentBright,
              flexShrink: 0,
              textShadow: `0 0 8px ${P.accentGlow}`,
              userSelect: "none",
            }}>
              $
            </span>
            <span style={{
              display: "inline-block",
              width: 9,
              height: 15,
              backgroundColor: "#22C55E",
              opacity: Math.floor(localFrame / 8) % 2 === 0 ? 0.8 : 0,
              verticalAlign: "text-bottom",
              borderRadius: 1,
            }} />
          </div>
        )}
      </div>
    </div>
  );
};
