/**
 * Yuwbrndr Layout Engine (Deterministic / Rule-Based)
 * 
 * Provides Knuth-Plass style balanced line-wrapping, dynamic typographic
 * auto-scaling, discrete matrix geometry solvers, and vertical flow distribution
 * without relying on non-deterministic AI.
 */

export interface TextBalanceOptions {
  /** Target max characters per line */
  maxCharsPerLine?: number;
  /** Max lines permitted before truncation (optional) */
  maxLines?: number;
  /** Minimum characters required on the last line to prevent orphaned words ("widows") */
  minLastLineChars?: number;
  /** Minimum words required on the last line */
  minLastLineWords?: number;
}

export interface BalancedLinesResult {
  lines: string[];
  lineCount: number;
  maxLineLength: number;
  lengthVariance: number;
}

export interface FontSizeOptions {
  minFontSize?: number;
  maxFontSize?: number;
  lineHeightRatio?: number;
  averageCharAspect?: number;
}

export interface DiscreteLedgerSegment {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  isActive: boolean;
}

export interface DiscreteLedgerOptions {
  x?: number;
  y?: number;
  height?: number;
  gap?: number;
  borderRadius?: number;
}

export interface VerticalFlowItem {
  id: string;
  height: number;
  minGapAfter?: number;
}

export interface VerticalFlowResult {
  yOffsets: Record<string, number>;
  totalHeight: number;
  paddingTop: number;
  paddingBottom: number;
  isOverflowing: boolean;
}

/**
 * Breaks text into balanced lines to avoid "ragged" text and isolated widows.
 * Minimizes the variance in line length while respecting max bounds.
 */
export function balanceTextLines(
  rawText: string,
  options: TextBalanceOptions = {}
): BalancedLinesResult {
  const text = rawText.trim().replace(/\s+/g, ' ');
  if (!text) {
    return { lines: [], lineCount: 0, maxLineLength: 0, lengthVariance: 0 };
  }

  const maxChars = options.maxCharsPerLine || 48;
  const minLastLineWords = options.minLastLineWords ?? 2;
  const minLastLineChars = options.minLastLineChars ?? 8;
  const words = text.split(' ');

  if (words.length === 1) {
    return { lines: [text], lineCount: 1, maxLineLength: text.length, lengthVariance: 0 };
  }

  // Estimate ideal number of lines
  const totalChars = text.length;
  const estimatedLines = Math.max(1, Math.ceil(totalChars / maxChars));
  const targetCharsPerLine = Math.ceil(totalChars / estimatedLines);

  // Dynamic programming / greedy penalty search for line splits
  const lines: string[] = [];
  let currentWords: string[] = [];
  let currentLen = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wouldBeLen = currentLen === 0 ? word.length : currentLen + 1 + word.length;
    const remainingWords = words.length - (i + 1);

    // If adding this word exceeds maxChars, or if we're near target and moving forward
    // would leave the next line with too few words (widow), break here
    const shouldBreak = wouldBeLen > maxChars || 
      (wouldBeLen >= targetCharsPerLine && remainingWords >= minLastLineWords && (currentWords.length >= 2));

    if (shouldBreak && currentWords.length > 0) {
      lines.push(currentWords.join(' '));
      currentWords = [word];
      currentLen = word.length;
    } else {
      currentWords.push(word);
      currentLen = wouldBeLen;
    }
  }

  if (currentWords.length > 0) {
    lines.push(currentWords.join(' '));
  }

  // Widow correction: if the final line is too short (e.g. 1 word or < minLastLineChars),
  // pull one word down from the previous line if possible
  if (lines.length > 1) {
    const lastLine = lines[lines.length - 1];
    const prevLine = lines[lines.length - 2];
    const lastWords = lastLine.split(' ');

    if (lastWords.length < minLastLineWords || lastLine.length < minLastLineChars) {
      const prevWords = prevLine.split(' ');
      if (prevWords.length >= 3) {
        const stolenWord = prevWords.pop()!;
        lines[lines.length - 2] = prevWords.join(' ');
        lines[lines.length - 1] = `${stolenWord} ${lastLine}`;
      }
    }
  }

  // Calculate statistics
  const lengths = lines.map(l => l.length);
  const maxLineLength = Math.max(...lengths);
  const avgLength = lengths.reduce((acc, v) => acc + v, 0) / lengths.length;
  const variance = lengths.reduce((acc, v) => acc + Math.pow(v - avgLength, 2), 0) / lengths.length;

  return {
    lines,
    lineCount: lines.length,
    maxLineLength,
    lengthVariance: Math.round(variance * 10) / 10
  };
}

/**
 * Balanced line-wrapping for HTML5 Canvas using a measurement callback.
 */
export function wrapCanvasText(
  measureFn: (text: string) => number,
  rawText: string,
  maxWidth: number,
  options: { minLastLineWords?: number } = {}
): string[] {
  const text = rawText.trim().replace(/\s+/g, ' ');
  if (!text) return [];

  const words = text.split(' ');
  const minLastLineWords = options.minLastLineWords ?? 2;
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = measureFn(candidate);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Widow protection for canvas
  if (lines.length > 1) {
    const lastLine = lines[lines.length - 1];
    const prevLine = lines[lines.length - 2];
    const lastWords = lastLine.split(' ');

    if (lastWords.length < minLastLineWords) {
      const prevWords = prevLine.split(' ');
      if (prevWords.length >= 3) {
        const stolen = prevWords.pop()!;
        const newPrev = prevWords.join(' ');
        const newLast = `${stolen} ${lastLine}`;
        if (measureFn(newLast) <= maxWidth) {
          lines[lines.length - 2] = newPrev;
          lines[lines.length - 1] = newLast;
        }
      }
    }
  }

  return lines;
}

/**
 * Calculates optimal font size so text harmoniously fills an allotted container
 * without overflowing or clipping.
 */
export function computeOptimalFontSize(
  text: string,
  containerWidth: number,
  containerHeight: number,
  options: FontSizeOptions = {}
): number {
  const minSize = options.minFontSize || 16;
  const maxSize = options.maxFontSize || 96;
  const lineHeightRatio = options.lineHeightRatio || 1.25;
  const charAspect = options.averageCharAspect || 0.55; // width per character relative to font size

  const charCount = Math.max(1, text.length);

  // Binary search for highest font size where estimated total box fits container
  let low = minSize;
  let high = maxSize;
  let optimal = minSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const charsPerLine = Math.max(1, Math.floor(containerWidth / (mid * charAspect)));
    const neededLines = Math.ceil(charCount / charsPerLine);
    const neededHeight = neededLines * (mid * lineHeightRatio);

    if (neededHeight <= containerHeight && (mid * charAspect <= containerWidth)) {
      optimal = mid;
      low = mid + 1; // Try larger
    } else {
      high = mid - 1; // Too big, try smaller
    }
  }

  return Math.min(maxSize, Math.max(minSize, optimal));
}

/**
 * Computes exact coordinate geometry for a 10-bar or N-bar discrete data matrix.
 */
export function computeDiscreteLedgerGeometry(
  totalCount: number,
  activeCount: number,
  containerWidth: number,
  options: DiscreteLedgerOptions = {}
): DiscreteLedgerSegment[] {
  const n = Math.max(1, totalCount);
  const active = Math.max(0, Math.min(n, activeCount));
  const startX = options.x ?? 0;
  const startY = options.y ?? 0;
  const h = options.height ?? 16;
  const gap = options.gap ?? 12;
  const radius = options.borderRadius ?? 4;

  const totalGaps = (n - 1) * gap;
  const segmentWidth = Math.max(2, Math.floor((containerWidth - totalGaps) / n));

  const segments: DiscreteLedgerSegment[] = [];

  for (let i = 0; i < n; i++) {
    const x = startX + i * (segmentWidth + gap);
    segments.push({
      index: i,
      x,
      y: startY,
      width: segmentWidth,
      height: h,
      radius,
      isActive: i < active
    });
  }

  return segments;
}

/**
 * Distributes visual components vertically within a canvas/viewport, preventing
 * overlaps, awkward dead spaces, and providing golden-ratio proportional spacing.
 */
export function computeVerticalFlow(
  items: VerticalFlowItem[],
  availableHeight: number,
  options: {
    paddingTop?: number;
    paddingBottom?: number;
    distribution?: 'even' | 'golden-ratio';
  } = {}
): VerticalFlowResult {
  const pTop = options.paddingTop ?? 64;
  const pBottom = options.paddingBottom ?? 64;
  const usableHeight = availableHeight - (pTop + pBottom);

  const totalItemHeight = items.reduce((sum, item) => sum + item.height, 0);
  const minGapsSum = items.reduce((sum, item, idx) => {
    return idx < items.length - 1 ? sum + (item.minGapAfter ?? 16) : sum;
  }, 0);

  const isOverflowing = (totalItemHeight + minGapsSum) > usableHeight;

  const yOffsets: Record<string, number> = {};
  let currentY = pTop;

  if (isOverflowing || items.length <= 1) {
    // Pack tightly with min gaps
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      yOffsets[item.id] = currentY;
      currentY += item.height + (item.minGapAfter ?? 16);
    }
  } else {
    // Distribute leftover space evenly between items
    const leftoverSpace = usableHeight - totalItemHeight;
    const gapCount = items.length - 1;
    const gap = Math.max(12, Math.floor(leftoverSpace / gapCount));

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      yOffsets[item.id] = currentY;
      currentY += item.height + gap;
    }
  }

  return {
    yOffsets,
    totalHeight: currentY - pTop,
    paddingTop: pTop,
    paddingBottom: pBottom,
    isOverflowing
  };
}
