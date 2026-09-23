import { describe, it, expect } from 'vitest';
import { CODE_PRESETS } from './codePresets';

describe('codePresets catalog', () => {
  it('should have a non-empty list of curated presets', () => {
    expect(CODE_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it('should ensure every preset has a unique ID, valid name, category, and code', () => {
    const ids = new Set<string>();

    for (const preset of CODE_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.id.length).toBeGreaterThan(0);
      expect(ids.has(preset.id)).toBe(false);
      ids.add(preset.id);

      expect(preset.name).toBeDefined();
      expect(preset.name.length).toBeGreaterThan(0);

      expect(preset.category).toBeDefined();
      expect(['Infographic', '3D & Canvas', 'Vector & SVG', 'Meme & Social', 'Starter']).toContain(
        preset.category
      );

      expect(['html', 'canvas']).toContain(preset.type);
      expect(typeof preset.code).toBe('string');
      expect(preset.code.trim().length).toBeGreaterThan(20);
    }
  });

  it('should include the Rough.js hand-drawn presets', () => {
    const htmlRough = CODE_PRESETS.find((p) => p.id === 'handdrawn-architecture');
    const canvasRough = CODE_PRESETS.find((p) => p.id === 'handdrawn-canvas-dashboard');

    expect(htmlRough).toBeDefined();
    expect(htmlRough?.type).toBe('html');
    expect(htmlRough?.code).toContain('data-rough-rect');

    expect(canvasRough).toBeDefined();
    expect(canvasRough?.type).toBe('canvas');
    expect(canvasRough?.code).toContain('rough');
  });
});
