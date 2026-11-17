import { describe, it, expect } from 'vitest';
import {
  balanceTextLines,
  wrapCanvasText,
  computeOptimalFontSize,
  computeDiscreteLedgerGeometry,
  computeVerticalFlow
} from './layoutEngine';

describe('layoutEngine', () => {
  describe('balanceTextLines (Knuth-Plass Balanced Line-Wrapping)', () => {
    it('returns empty array when text is empty', () => {
      const res = balanceTextLines('');
      expect(res.lines).toEqual([]);
      expect(res.lineCount).toBe(0);
    });

    it('returns single line for single word without alteration', () => {
      const res = balanceTextLines('Techaaroorian');
      expect(res.lines).toEqual(['Techaaroorian']);
      expect(res.lineCount).toBe(1);
    });

    it('balances multi-word paragraphs and prevents isolated single-word widows', () => {
      const paragraph = 'Subtle security flaws, hallucinated APIs, and unexpected edge cases mean over half of software engineers actively verify every single line.';
      const res = balanceTextLines(paragraph, { maxCharsPerLine: 50, minLastLineWords: 2 });
      
      expect(res.lineCount).toBeGreaterThan(1);
      // Ensure the last line has at least 2 words (no isolated widow)
      const lastLineWords = res.lines[res.lines.length - 1].split(' ');
      expect(lastLineWords.length).toBeGreaterThanOrEqual(2);
      
      // Ensure no line exceeds maxCharsPerLine by a massive margin
      for (const line of res.lines) {
        expect(line.length).toBeLessThanOrEqual(56);
      }
    });
  });

  describe('wrapCanvasText', () => {
    it('wraps canvas text using a mock width measure function and avoids single-word widows', () => {
      // Mock measure function: 1 char = 10px
      const measureFn = (str: string) => str.length * 10;
      const text = 'Widespread integration across all modern developer workflows and tools';
      const maxWidth = 300; // max 30 chars per line

      const lines = wrapCanvasText(measureFn, text, maxWidth, { minLastLineWords: 2 });
      expect(lines.length).toBeGreaterThan(1);
      
      const lastLine = lines[lines.length - 1];
      expect(lastLine.split(' ').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('computeOptimalFontSize', () => {
    it('scales font size up for short punchy titles', () => {
      const shortText = 'Low Trust';
      const size = computeOptimalFontSize(shortText, 800, 200, { minFontSize: 24, maxFontSize: 96 });
      expect(size).toBeGreaterThanOrEqual(64);
    });

    it('scales font size down for long descriptions to prevent overflow', () => {
      const longText = 'Subtle security flaws, hallucinated APIs, and unexpected edge cases mean over half of engineers actively verify every generated line.';
      const size = computeOptimalFontSize(longText, 600, 140, { minFontSize: 16, maxFontSize: 48 });
      expect(size).toBeLessThanOrEqual(32);
      expect(size).toBeGreaterThanOrEqual(16);
    });
  });

  describe('computeDiscreteLedgerGeometry', () => {
    it('calculates 10-bar discrete matrix coordinates accurately', () => {
      const segments = computeDiscreteLedgerGeometry(10, 4, 600, {
        x: 64,
        y: 500,
        height: 16,
        gap: 10,
        borderRadius: 4
      });

      expect(segments).toHaveLength(10);
      expect(segments[0].x).toBe(64);
      expect(segments[0].isActive).toBe(true);
      expect(segments[3].isActive).toBe(true); // 4 active (indices 0, 1, 2, 3)
      expect(segments[4].isActive).toBe(false);
      expect(segments[9].isActive).toBe(false);

      // Verify gap between consecutive segments
      expect(segments[1].x - (segments[0].x + segments[0].width)).toBe(10);
    });
  });

  describe('computeVerticalFlow', () => {
    it('distributes items vertically with smooth spacing and flags non-overflowing layouts', () => {
      const items = [
        { id: 'header', height: 40 },
        { id: 'icon', height: 80 },
        { id: 'title', height: 60 },
        { id: 'stat', height: 120 },
        { id: 'footer', height: 40 }
      ];

      const res = computeVerticalFlow(items, 1080, { paddingTop: 60, paddingBottom: 60 });
      expect(res.isOverflowing).toBe(false);
      expect(res.yOffsets['header']).toBe(60);
      expect(res.yOffsets['icon']).toBeGreaterThan(res.yOffsets['header']);
      expect(res.yOffsets['footer']).toBeGreaterThan(res.yOffsets['stat']);
    });

    it('flags overflowing content when items exceed available height', () => {
      const items = [
        { id: 'giant1', height: 600, minGapAfter: 50 },
        { id: 'giant2', height: 600, minGapAfter: 50 }
      ];

      const res = computeVerticalFlow(items, 1080, { paddingTop: 60, paddingBottom: 60 });
      expect(res.isOverflowing).toBe(true);
    });
  });
});
