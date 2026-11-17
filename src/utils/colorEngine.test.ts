import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateRelativeLuminance,
  calculateContrastRatio,
  isWcagCompliant,
  generateProceduralPalette
} from './colorEngine';

describe('colorEngine', () => {
  describe('Color Space Conversions', () => {
    it('converts 6-digit, 3-digit, and 8-digit hex codes to RGB accurately', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#211405')).toEqual({ r: 33, g: 20, b: 5 });
      expect(hexToRgb('051e18')).toEqual({ r: 5, g: 30, b: 24 });
      expect(hexToRgb('#071728ff')).toEqual({ r: 7, g: 23, b: 40 });
    });

    it('converts RGB to normalized lowercase 6-digit hex string', () => {
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 33, g: 20, b: 5 })).toBe('#211405');
    });

    it('converts RGB to HSL and back without loss', () => {
      const original = { r: 16, g: 185, b: 129 }; // Emerald green
      const hsl = rgbToHsl(original);
      const roundtrip = hslToRgb(hsl);
      expect(Math.abs(original.r - roundtrip.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(original.g - roundtrip.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(original.b - roundtrip.b)).toBeLessThanOrEqual(1);
    });
  });

  describe('WCAG 2.1 Luminance & Contrast', () => {
    it('calculates accurate relative luminance for pure black and white', () => {
      expect(calculateRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
      expect(calculateRelativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1);
    });

    it('calculates standard WCAG contrast ratios', () => {
      // Black vs White is 21.0
      expect(calculateContrastRatio('#000000', '#ffffff')).toBe(21);
      // Same color is 1.0
      expect(calculateContrastRatio('#ffffff', '#ffffff')).toBe(1);
      // Dark Ochre (#211405) vs White (#ffffff) is > 16:1
      const ochreRatio = calculateContrastRatio('#211405', '#ffffff');
      expect(ochreRatio).toBeGreaterThan(16);
    });

    it('validates WCAG AA and AAA compliance thresholds', () => {
      expect(isWcagCompliant('#ffffff', '#000000', 'AAA')).toBe(true);
      expect(isWcagCompliant('#767676', '#ffffff', 'AA', false)).toBe(true); // >= 4.5:1
      expect(isWcagCompliant('#cccccc', '#ffffff', 'AA', false)).toBe(false); // fails
    });
  });

  describe('Procedural Palette Generator', () => {
    it('generates a complete accessible palette for a dark ochre background (#211405)', () => {
      const palette = generateProceduralPalette('#211405', { accentStrategy: 'gold-ochre' });
      expect(palette.isDark).toBe(true);
      expect(palette.background).toBe('#211405');
      expect(palette.textPrimary).toBe('#ffffff');
      expect(palette.contrastRatioTextToBg).toBeGreaterThan(15);
      expect(palette.contrastRatioAccentToBg).toBeGreaterThan(4.5);
      expect(palette.surface).toBeTruthy();
      expect(palette.border).toBeTruthy();
      expect(palette.accentBadgeBg).toBeTruthy();
    });

    it('generates a complete accessible palette for an emerald background (#051e18)', () => {
      const palette = generateProceduralPalette('#051e18', { accentStrategy: 'emerald' });
      expect(palette.isDark).toBe(true);
      expect(palette.background).toBe('#051e18');
      expect(palette.textPrimary).toBe('#ffffff');
      expect(palette.contrastRatioTextToBg).toBeGreaterThan(15);
      expect(palette.contrastRatioAccentToBg).toBeGreaterThan(4.5);
    });

    it('generates an inverted accessible palette for a light background (#f8fafc)', () => {
      const palette = generateProceduralPalette('#f8fafc');
      expect(palette.isDark).toBe(false);
      expect(palette.textPrimary).toBe('#090d16');
      expect(palette.contrastRatioTextToBg).toBeGreaterThan(15);
    });

    it('respects accent overrides while enforcing minimum contrast', () => {
      const palette = generateProceduralPalette('#071728', { overrideAccent: '#38bdf8' });
      expect(palette.accent).toBe('#38bdf8');
      expect(palette.contrastRatioAccentToBg).toBeGreaterThan(4.5);
    });
  });
});
