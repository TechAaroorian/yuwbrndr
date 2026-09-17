import type {
  CaptionElement,
  SpeechBubbleElement,
  StickerElement,
  VisualScene,
  VisualStickerId,
} from '../types/visual';

let nextElementId = 0;

export function createVisualId(prefix: string): string {
  nextElementId += 1;
  return `${prefix}-${Date.now().toString(36)}-${nextElementId.toString(36)}`;
}

export function createCaption(overrides: Partial<CaptionElement> = {}): CaptionElement {
  return {
    id: createVisualId('caption'),
    type: 'caption',
    name: 'Meme caption',
    x: 90,
    y: 70,
    width: 900,
    height: 150,
    rotation: 0,
    opacity: 1,
    text: 'WHEN IT WORKS ON MY MACHINE',
    fontSize: 58,
    color: '#f8fafc',
    background: '#111827',
    align: 'center',
    ...overrides,
  };
}

export function createSpeechBubble(
  overrides: Partial<SpeechBubbleElement> = {}
): SpeechBubbleElement {
  return {
    id: createVisualId('bubble'),
    type: 'speech-bubble',
    name: 'Speech bubble',
    x: 510,
    y: 300,
    width: 450,
    height: 230,
    rotation: 0,
    opacity: 1,
    text: 'The tests passed locally.',
    fontSize: 32,
    color: '#172033',
    background: '#ffffff',
    borderColor: '#172033',
    tail: 'left',
    ...overrides,
  };
}

export function createSticker(
  stickerId: VisualStickerId,
  overrides: Partial<StickerElement> = {}
): StickerElement {
  const labels: Record<VisualStickerId, string> = {
    bug: 'Bug sticker',
    terminal: 'Terminal sticker',
    rocket: 'Rocket sticker',
    coffee: 'Coffee sticker',
  };

  return {
    id: createVisualId('sticker'),
    type: 'sticker',
    name: labels[stickerId],
    x: 130,
    y: 330,
    width: 320,
    height: 320,
    rotation: -4,
    opacity: 1,
    stickerId,
    color: stickerId === 'bug' ? '#fb7185' : '#6366f1',
    background: '#ffffff',
    ...overrides,
  };
}

export function createTechMemeScene(): VisualScene {
  return {
    version: 1,
    width: 1080,
    height: 1080,
    background: '#eef2ff',
    elements: [
      createCaption({
        x: 70,
        y: 60,
        width: 940,
        height: 170,
        text: 'WHEN THE BUG DISAPPEARS',
        fontSize: 54,
        background: '#172033',
      }),
      createSticker('bug', {
        x: 115,
        y: 330,
        width: 350,
        height: 350,
        rotation: -8,
      }),
      createSpeechBubble({
        x: 485,
        y: 285,
        width: 500,
        height: 270,
        text: 'I changed nothing.\nWhy is it working?',
        fontSize: 35,
      }),
      createCaption({
        x: 120,
        y: 820,
        width: 840,
        height: 150,
        text: 'SHIP IT BEFORE IT NOTICES',
        fontSize: 45,
        color: '#312e81',
        background: '#c7d2fe',
      }),
    ],
  };
}
