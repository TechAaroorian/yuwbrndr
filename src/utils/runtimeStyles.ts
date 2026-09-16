import { createGenerator } from '@unocss/core';
import { presetWind4 } from '@unocss/preset-wind4';

const generator = createGenerator({
  presets: [presetWind4({ preflights: { reset: true } })],
});

export async function generateRuntimeUtilityCss(markup: string): Promise<string> {
  if (!markup.trim()) return '';
  const result = await (await generator).generate(markup, { preflights: true });
  return result.css;
}
