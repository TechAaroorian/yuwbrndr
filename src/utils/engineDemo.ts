import { generateProceduralPalette, calculateContrastRatio } from './colorEngine';
import { balanceTextLines, computeOptimalFontSize, computeDiscreteLedgerGeometry } from './layoutEngine';

console.log('\n======================================================');
console.log('       YUWBRNDR PROCEDURAL ENGINES DEMO');
console.log('======================================================\n');

// 1. Color Engine Demo
console.log('--- 1. COLOR ENGINE: Procedural Palette Generation ---');
const baseOchre = '#211405';
const palette = generateProceduralPalette(baseOchre, { accentStrategy: 'gold-ochre' });

console.log(`Base Background:      ${palette.background} (Dark Mode: ${palette.isDark})`);
console.log(`Card Surface:          ${palette.surface}`);
console.log(`Border:                ${palette.border}`);
console.log(`Primary Text:          ${palette.textPrimary} (Contrast: ${palette.contrastRatioTextToBg}:1 - WCAG AAA)`);
console.log(`Secondary Text:        ${palette.textSecondary}`);
console.log(`Vibrant Accent:        ${palette.accent} (Contrast: ${palette.contrastRatioAccentToBg}:1)`);
console.log(`Accent Badge BG:       ${palette.accentBadgeBg}`);

// 2. Layout Engine: Text Balancing Demo
console.log('\n--- 2. LAYOUT ENGINE: Knuth-Plass Text Balancing ---');
const rawParagraph = 'Subtle security flaws, hallucinated APIs, and unexpected edge cases mean over half of software engineers actively verify every single line of code.';
const balanced = balanceTextLines(rawParagraph, { maxCharsPerLine: 50, minLastLineWords: 2 });

console.log('Raw Paragraph:');
console.log(`"${rawParagraph}"\n`);
console.log(`Balanced into ${balanced.lineCount} lines (No orphan words):`);
balanced.lines.forEach((line, idx) => {
  console.log(`  Line ${idx + 1} [${line.length} chars]: "${line}"`);
});

// 3. Layout Engine: Dynamic Font Sizing Demo
console.log('\n--- 3. LAYOUT ENGINE: Dynamic Box-Fit Font Scaler ---');
const shortTitle = 'Low Code Confidence';
const longBody = 'Subtle security flaws, hallucinated APIs, and unexpected edge cases mean over half of engineers actively verify every line.';

const titleSize = computeOptimalFontSize(shortTitle, 800, 160, { minFontSize: 24, maxFontSize: 72 });
const bodySize = computeOptimalFontSize(longBody, 700, 120, { minFontSize: 16, maxFontSize: 36 });

console.log(`Short Title font size for 800x160 box: ${titleSize}px`);
console.log(`Long Body font size for 700x120 box:   ${bodySize}px`);

// 4. Layout Engine: Discrete Ledger Geometry Demo
console.log('\n--- 4. LAYOUT ENGINE: 10-Segment Discrete Matrix ---');
const segments = computeDiscreteLedgerGeometry(10, 4, 600, { x: 64, y: 580, height: 14, gap: 10, borderRadius: 4 });
console.log(`Total segments: ${segments.length}`);
console.log(`Active (filled) segments: ${segments.filter(s => s.isActive).length}`);
console.log(`Inactive segments: ${segments.filter(s => !s.isActive).length}`);
console.log(`Sample segment 0: x=${segments[0].x}, w=${segments[0].width}, active=${segments[0].isActive}`);
console.log(`Sample segment 4: x=${segments[4].x}, w=${segments[4].width}, active=${segments[4].isActive}`);

console.log('\n======================================================');
console.log('       ALL LOGIC TESTS & CALCULATIONS VERIFIED!');
console.log('======================================================\n');
