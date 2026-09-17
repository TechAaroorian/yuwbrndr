export type VisualElementType = 'caption' | 'speech-bubble' | 'sticker';
export type VisualStickerId = 'bug' | 'terminal' | 'rocket' | 'coffee';

export interface VisualElementBase {
  id: string;
  type: VisualElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
}

export interface CaptionElement extends VisualElementBase {
  type: 'caption';
  text: string;
  fontSize: number;
  color: string;
  background: string;
  align: 'left' | 'center' | 'right';
}

export interface SpeechBubbleElement extends VisualElementBase {
  type: 'speech-bubble';
  text: string;
  fontSize: number;
  color: string;
  background: string;
  borderColor: string;
  tail: 'left' | 'right';
}

export interface StickerElement extends VisualElementBase {
  type: 'sticker';
  stickerId: VisualStickerId;
  color: string;
  background: string;
}

export type VisualElement = CaptionElement | SpeechBubbleElement | StickerElement;

export interface VisualScene {
  version: 1;
  width: number;
  height: number;
  background: string;
  elements: VisualElement[];
}

export interface VisualHistory {
  past: VisualScene[];
  present: VisualScene;
  future: VisualScene[];
}
