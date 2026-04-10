// @TASK P1.5-SK1-T1 - SRT 파서 + 의미 분석 엔진 테스트
// @SPEC specs/shared/types.yaml

import { describe, it, expect } from "vitest";
import {
  parseSRT,
  timeCodeToMs,
  msToFrame,
  type SRTEntry,
  type SemanticAnalysis,
} from "@/services/srt-parser";

// ---------------------------------------------------------------------------
// timeCodeToMs
// ---------------------------------------------------------------------------
describe("timeCodeToMs", () => {
  it("converts HH:MM:SS,mmm to milliseconds", () => {
    expect(timeCodeToMs("00:00:01,000")).toBe(1000);
    expect(timeCodeToMs("00:01:00,000")).toBe(60_000);
    expect(timeCodeToMs("01:00:00,000")).toBe(3_600_000);
    expect(timeCodeToMs("00:00:00,500")).toBe(500);
  });

  it("handles complex timecodes", () => {
    expect(timeCodeToMs("01:23:45,678")).toBe(
      1 * 3_600_000 + 23 * 60_000 + 45 * 1000 + 678
    );
  });

  it("throws on invalid timecode format", () => {
    expect(() => timeCodeToMs("invalid")).toThrow();
    expect(() => timeCodeToMs("00:00:00")).toThrow(); // missing ms
    expect(() => timeCodeToMs("")).toThrow();
  });
});

// ---------------------------------------------------------------------------
// msToFrame
// ---------------------------------------------------------------------------
describe("msToFrame", () => {
  it("converts milliseconds to frame number at 30fps", () => {
    expect(msToFrame(0)).toBe(0);
    expect(msToFrame(1000)).toBe(30); // 1s * 30fps
    expect(msToFrame(5000)).toBe(150); // 5s * 30fps
  });

  it("rounds down partial frames", () => {
    // 33.33ms per frame at 30fps
    expect(msToFrame(33)).toBe(0); // 0.99 frames -> floor -> 0
    expect(msToFrame(34)).toBe(1); // 1.02 frames -> floor -> 1
  });

  it("accepts custom fps", () => {
    expect(msToFrame(1000, 24)).toBe(24);
    expect(msToFrame(1000, 60)).toBe(60);
  });
});

// ---------------------------------------------------------------------------
// parseSRT - basic parsing
// ---------------------------------------------------------------------------
describe("parseSRT", () => {
  const SIMPLE_SRT = [
    "1",
    "00:00:01,000 --> 00:00:05,000",
    "Hello World",
    "",
    "2",
    "00:00:06,000 --> 00:00:10,500",
    "Second subtitle",
    "",
  ].join("\n");

  it("parses a simple SRT string into SRTEntry array", () => {
    const entries = parseSRT(SIMPLE_SRT);
    expect(entries).toHaveLength(2);
  });

  it("extracts index, timecodes, and text correctly", () => {
    const entries = parseSRT(SIMPLE_SRT);
    const first = entries[0];

    expect(first.index).toBe(1);
    expect(first.startTime).toBe("00:00:01,000");
    expect(first.endTime).toBe("00:00:05,000");
    expect(first.text).toBe("Hello World");
  });

  it("computes millisecond values", () => {
    const entries = parseSRT(SIMPLE_SRT);
    expect(entries[0].startMs).toBe(1000);
    expect(entries[0].endMs).toBe(5000);
    expect(entries[1].startMs).toBe(6000);
    expect(entries[1].endMs).toBe(10500);
  });

  it("computes frame numbers at 30fps", () => {
    const entries = parseSRT(SIMPLE_SRT);
    expect(entries[0].startFrame).toBe(30);
    expect(entries[0].endFrame).toBe(150);
    expect(entries[1].startFrame).toBe(180);
    expect(entries[1].endFrame).toBe(315);
  });

  // ---------------------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------------------
  it("handles multiline subtitles", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:05,000",
      "Line one",
      "Line two",
      "Line three",
      "",
    ].join("\n");

    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].text).toBe("Line one\nLine two\nLine three");
  });

  it("returns empty array for empty input", () => {
    expect(parseSRT("")).toEqual([]);
    expect(parseSRT("   ")).toEqual([]);
    expect(parseSRT("\n\n\n")).toEqual([]);
  });

  it("handles Windows-style line endings (CRLF)", () => {
    const srt = "1\r\n00:00:01,000 --> 00:00:05,000\r\nHello\r\n\r\n";
    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].text).toBe("Hello");
  });

  it("handles SRT without trailing newline", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:05,000",
      "No trailing newline",
    ].join("\n");

    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].text).toBe("No trailing newline");
  });

  it("skips entries with invalid timecode lines", () => {
    const srt = [
      "1",
      "INVALID_TIMECODE",
      "Some text",
      "",
      "2",
      "00:00:01,000 --> 00:00:05,000",
      "Valid entry",
      "",
    ].join("\n");

    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].index).toBe(2);
    expect(entries[0].text).toBe("Valid entry");
  });

  it("handles BOM (byte order mark) at start of file", () => {
    const srt = "\uFEFF1\n00:00:01,000 --> 00:00:05,000\nWith BOM\n\n";
    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].index).toBe(1);
  });

  it("handles extra whitespace around timecodes", () => {
    const srt = [
      "1",
      "  00:00:01,000 --> 00:00:05,000  ",
      "Spaced",
      "",
    ].join("\n");

    const entries = parseSRT(srt);
    expect(entries).toHaveLength(1);
    expect(entries[0].startMs).toBe(1000);
    expect(entries[0].endMs).toBe(5000);
  });
});

// ---------------------------------------------------------------------------
// Type check: SemanticAnalysis interface exists and is usable
// ---------------------------------------------------------------------------
describe("SemanticAnalysis type", () => {
  it("can be instantiated as an object literal", () => {
    const analysis: SemanticAnalysis = {
      intent: "explain",
      tone: "confident",
      evidenceType: "statistic",
      emphasisTokens: ["key", "data"],
      density: 3,
    };

    expect(analysis.intent).toBe("explain");
    expect(analysis.emphasisTokens).toHaveLength(2);
    expect(analysis.density).toBe(3);
  });
});
