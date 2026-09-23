import { describe, it, expect } from 'vitest';
import {
  buildYuwbrndrAiPrompt,
  detectPromptIntent,
  ARCHETYPE_LABELS,
  AiPromptOptions,
} from './aiPromptGenerator';
import { ASPECT_PRESETS, COLOR_THEMES } from '../types/studio';

describe('aiPromptGenerator utility', () => {
  const defaultOptions: AiPromptOptions = {
    engine: 'html',
    preset: ASPECT_PRESETS[0], // LinkedIn Banner (1200x627)
    theme: COLOR_THEMES.midnight,
    userInstruction: 'Create a microservice architecture diagram showing API gateway and cache',
    styleArchetype: 'architecture',
    intent: 'architecture',
  };

  it('should detect prompt intents accurately from user keywords', () => {
    expect(detectPromptIntent('React vs Vue performance').intent).toBe('comparison');
    expect(detectPromptIntent('API gateway microservices routing pipeline').intent).toBe(
      'architecture'
    );
    expect(detectPromptIntent('p99 latency 1.2ms throughput 40k rps').intent).toBe('benchmark');
    expect(detectPromptIntent('v2.4.0 release announcement and changelog').intent).toBe('release');
    expect(detectPromptIntent('https://nodejs.org/en/docs').intent).toBe('concept');
  });

  it('should generate a structured prompt containing platform resolution and aspect ratio', () => {
    const prompt = buildYuwbrndrAiPrompt(defaultOptions);

    expect(prompt).toContain(defaultOptions.preset.name);
    expect(prompt).toContain(String(defaultOptions.preset.width));
    expect(prompt).toContain(String(defaultOptions.preset.height));
    expect(prompt).toContain(defaultOptions.preset.aspectRatio);
  });

  it('should enforce mobile-first font scale in HTML engine prompts', () => {
    const prompt = buildYuwbrndrAiPrompt(defaultOptions);

    expect(prompt).toContain('comfortably readable on mobile feeds');
    expect(prompt).toContain('avoid tiny microscopic text');
  });

  it('should include Rough.js guidelines when styleArchetype is sketch', () => {
    const sketchPrompt = buildYuwbrndrAiPrompt({
      ...defaultOptions,
      styleArchetype: 'sketch',
    });

    expect(sketchPrompt).toContain('Rough.js');
    expect(sketchPrompt).toContain('data-rough-rect');
    expect(sketchPrompt).toContain('hand-drawn');
  });

  it('should cover all defined archetypes in ARCHETYPE_LABELS', () => {
    const archetypes = [
      'sketch',
      'cheatsheet',
      'architecture',
      'comparison',
      'infographic',
      'bento',
      'announcement',
      'minimalist',
    ] as const;

    for (const arch of archetypes) {
      expect(ARCHETYPE_LABELS[arch]).toBeDefined();
      expect(ARCHETYPE_LABELS[arch].name.length).toBeGreaterThan(0);
      expect(ARCHETYPE_LABELS[arch].description.length).toBeGreaterThan(0);
    }
  });
});
