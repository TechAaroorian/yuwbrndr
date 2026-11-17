/**
 * Yuwbrndr Color Engine (Deterministic / Rule-Based)
 * 
 * Provides mathematical color space transforms, WCAG 2.1 relative luminance
 * and contrast ratio calculations, and procedural palette generation
 * without external dependencies or non-deterministic AI.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface ProceduralPalette {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderAccent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBadgeBg: string;
  accentBadgeBorder: string;
  contrastRatioTextToBg: number;
  contrastRatioAccentToBg: number;
}

export type AccentStrategy = 'vibrant-complement' | 'analogous' | 'monochrome' | 'gold-ochre' | 'emerald';

/**
 * Normalizes and parses a 3, 4, 6, or 8-digit HEX string to RGB.
 */
export function hexToRgb(hexInput: string): RgbColor {
  let hex = hexInput.trim().replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  } else if (hex.length === 4) {
    hex = hex.slice(0, 3).split('').map(c => c + c).join('');
  } else if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }

  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
    // Fallback safe black
    return { r: 0, g: 0, b: 0 };
  }

  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Formats RGB numbers to an uppercase 6-digit hex string (#RRGGBB).
 */
export function rgbToHex(rgb: RgbColor): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toLowerCase();
}

/**
 * Converts RGB to HSL color space.
 */
export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;

  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf:
        h = ((gf - bf) / d + (gf < bf ? 6 : 0)) * 60;
        break;
      case gf:
        h = ((bf - rf) / d + 2) * 60;
        break;
      case bf:
        h = ((rf - gf) / d + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h * 100) / 100,
    s: Math.round(s * 10000) / 100,
    l: Math.round(l * 10000) / 100
  };
}

/**
 * Converts HSL to RGB color space.
 */
export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rf = 0, gf = 0, bf = 0;
  if (hNorm < 60) {
    rf = c; gf = x; bf = 0;
  } else if (hNorm < 120) {
    rf = x; gf = c; bf = 0;
  } else if (hNorm < 180) {
    rf = 0; gf = c; bf = x;
  } else if (hNorm < 240) {
    rf = 0; gf = x; bf = c;
  } else if (hNorm < 300) {
    rf = x; gf = 0; bf = c;
  } else {
    rf = c; gf = 0; bf = x;
  }

  return {
    r: Math.round((rf + m) * 255),
    g: Math.round((gf + m) * 255),
    b: Math.round((bf + m) * 255)
  };
}

/**
 * Calculates WCAG 2.1 relative luminance for an RGB color.
 * Reference: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function calculateRelativeLuminance({ r, g, b }: RgbColor): number {
  const srgb = [r / 255, g / 255, b / 255];
  const linear = srgb.map(val => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (ranging from 1.0 to 21.0).
 */
export function calculateContrastRatio(colorA: string | RgbColor, colorB: string | RgbColor): number {
  const rgbA = typeof colorA === 'string' ? hexToRgb(colorA) : colorA;
  const rgbB = typeof colorB === 'string' ? hexToRgb(colorB) : colorB;

  const lumA = calculateRelativeLuminance(rgbA);
  const lumB = calculateRelativeLuminance(rgbB);

  const brighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  const ratio = (brighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Validates whether contrast meets WCAG criteria:
 * - AA Normal Text: >= 4.5:1
 * - AA Large Text (>= 18pt or bold >= 14pt): >= 3.0:1
 * - AAA Normal Text: >= 7.0:1
 * - AAA Large Text: >= 4.5:1
 */
export function isWcagCompliant(
  foreground: string | RgbColor,
  background: string | RgbColor,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
  }
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
}

/**
 * Derives a full procedural, high-contrast palette from any single base hex color.
 */
export function generateProceduralPalette(
  baseHex: string,
  options: {
    accentStrategy?: AccentStrategy;
    overrideAccent?: string;
  } = {}
): ProceduralPalette {
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb);
  const lum = calculateRelativeLuminance(baseRgb);
  const isDark = lum < 0.2;

  // 1. Surface and border derivations
  let surfaceHsl: HslColor;
  let surfaceMutedHsl: HslColor;
  let borderHsl: HslColor;
  let borderAccentHsl: HslColor;

  if (isDark) {
    // Elevate lightness for dark mode cards
    surfaceHsl = {
      h: baseHsl.h,
      s: Math.max(10, baseHsl.s - 5),
      l: Math.min(30, baseHsl.l + 7)
    };
    surfaceMutedHsl = {
      h: baseHsl.h,
      s: baseHsl.s,
      l: Math.min(20, baseHsl.l + 4)
    };
    borderHsl = {
      h: baseHsl.h,
      s: Math.max(15, baseHsl.s),
      l: Math.min(35, baseHsl.l + 12)
    };
    borderAccentHsl = {
      h: baseHsl.h,
      s: Math.min(90, baseHsl.s + 20),
      l: Math.min(50, baseHsl.l + 25)
    };
  } else {
    // Deepen lightness for light mode cards
    surfaceHsl = {
      h: baseHsl.h,
      s: Math.max(5, baseHsl.s),
      l: Math.max(88, baseHsl.l - 5)
    };
    surfaceMutedHsl = {
      h: baseHsl.h,
      s: baseHsl.s,
      l: Math.max(92, baseHsl.l - 2)
    };
    borderHsl = {
      h: baseHsl.h,
      s: Math.max(10, baseHsl.s),
      l: Math.max(65, baseHsl.l - 15)
    };
    borderAccentHsl = {
      h: baseHsl.h,
      s: Math.min(90, baseHsl.s + 30),
      l: Math.max(35, baseHsl.l - 35)
    };
  }

  const surface = rgbToHex(hslToRgb(surfaceHsl));
  const surfaceMuted = rgbToHex(hslToRgb(surfaceMutedHsl));
  const border = rgbToHex(hslToRgb(borderHsl));
  const borderAccent = rgbToHex(hslToRgb(borderAccentHsl));

  // 2. High-contrast Accessible Text
  let textPrimary: string;
  let textSecondary: string;
  let textMuted: string;

  if (isDark) {
    textPrimary = '#ffffff';
    textSecondary = rgbToHex(hslToRgb({ h: baseHsl.h, s: 15, l: 88 }));
    textMuted = rgbToHex(hslToRgb({ h: baseHsl.h, s: 10, l: 64 }));
  } else {
    textPrimary = '#090d16';
    textSecondary = rgbToHex(hslToRgb({ h: baseHsl.h, s: 20, l: 24 }));
    textMuted = rgbToHex(hslToRgb({ h: baseHsl.h, s: 12, l: 42 }));
  }

  // 3. Compute Accent Color
  let accentHsl: HslColor;
  let accent: string;
  let accentRgb: RgbColor;

  if (options.overrideAccent) {
    const overrideRgb = hexToRgb(options.overrideAccent);
    const overrideContrast = calculateContrastRatio(overrideRgb, baseRgb);
    if (overrideContrast >= 3.5) {
      let cleanHex = options.overrideAccent.trim().toLowerCase();
      if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`;
      accent = cleanHex;
      accentRgb = overrideRgb;
      accentHsl = rgbToHsl(accentRgb);
    } else {
      accentHsl = rgbToHsl(overrideRgb);
      accentHsl.l = isDark ? Math.min(85, accentHsl.l + 18) : Math.max(25, accentHsl.l - 18);
      accentRgb = hslToRgb(accentHsl);
      accent = rgbToHex(accentRgb);
    }
  } else {
    const strategy = options.accentStrategy || 'vibrant-complement';
    switch (strategy) {
      case 'gold-ochre':
        accentHsl = { h: 38, s: 96, l: isDark ? 54 : 45 };
        break;
      case 'emerald':
        accentHsl = { h: 158, s: 76, l: isDark ? 52 : 38 };
        break;
      case 'analogous':
        accentHsl = {
          h: (baseHsl.h + 35) % 360,
          s: Math.max(75, baseHsl.s),
          l: isDark ? 58 : 42
        };
        break;
      case 'monochrome':
        accentHsl = {
          h: baseHsl.h,
          s: Math.min(100, baseHsl.s + 20),
          l: isDark ? 65 : 35
        };
        break;
      case 'vibrant-complement':
      default:
        accentHsl = {
          h: (baseHsl.h + 180) % 360,
          s: 88,
          l: isDark ? 56 : 42
        };
        break;
    }

    // Ensure generated accent has minimum contrast against background
    accentRgb = hslToRgb(accentHsl);
    let accentContrast = calculateContrastRatio(accentRgb, baseRgb);

    if (accentContrast < 3.5) {
      accentHsl.l = isDark ? Math.min(85, accentHsl.l + 18) : Math.max(25, accentHsl.l - 18);
      accentRgb = hslToRgb(accentHsl);
    }
    accent = rgbToHex(accentRgb);
  }

  const accentContrast = calculateContrastRatio(accentRgb, baseRgb);

  // Derive badge background and border for accent
  const badgeBgHsl: HslColor = {
    h: accentHsl.h,
    s: isDark ? Math.min(50, accentHsl.s) : Math.min(30, accentHsl.s),
    l: isDark ? 16 : 94
  };
  const badgeBorderHsl: HslColor = {
    h: accentHsl.h,
    s: accentHsl.s,
    l: isDark ? 28 : 82
  };

  const accentBadgeBg = rgbToHex(hslToRgb(badgeBgHsl));
  const accentBadgeBorder = rgbToHex(hslToRgb(badgeBorderHsl));

  const textContrast = calculateContrastRatio(textPrimary, baseRgb);

  return {
    isDark,
    background: rgbToHex(baseRgb),
    surface,
    surfaceMuted,
    border,
    borderAccent,
    textPrimary,
    textSecondary,
    textMuted,
    accent,
    accentBadgeBg,
    accentBadgeBorder,
    contrastRatioTextToBg: textContrast,
    contrastRatioAccentToBg: accentContrast
  };
}
