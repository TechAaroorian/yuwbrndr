import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bug,
  Coffee,
  Download,
  MessageCircle,
  Redo2,
  Rocket,
  RotateCcw,
  Terminal,
  Trash2,
  Type,
  Undo2,
  X,
} from 'lucide-react';
import type {
  CaptionElement,
  SpeechBubbleElement,
  StickerElement,
  VisualElement,
  VisualHistory,
  VisualScene,
  VisualStickerId,
} from '../types/visual';
import {
  createCaption,
  createSpeechBubble,
  createSticker,
  createTechMemeScene,
} from '../utils/visualMeme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface DragState {
  elementId: string;
  pointerX: number;
  pointerY: number;
  elementX: number;
  elementY: number;
  before: VisualScene;
}

const cloneScene = (scene: VisualScene): VisualScene => structuredClone(scene);

function wrapText(text: string, maxCharacters: number): string[] {
  return text.split('\n').flatMap((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [''];
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxCharacters && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  });
}

function StickerArtwork({ sticker }: { sticker: StickerElement }) {
  const common = {
    fill: 'none',
    stroke: sticker.color,
    strokeWidth: 7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <>
      <rect width="100" height="100" rx="24" fill={sticker.background} />
      {sticker.stickerId === 'bug' && (
        <g {...common}>
          <rect x="34" y="27" width="32" height="52" rx="16" />
          <path d="M40 28 35 17M60 28l5-11M34 42 20 34M66 42l14-8M34 59H18M66 59h16M35 73 22 83M65 73l13 10M50 27v52" />
          <circle cx="44" cy="42" r="2" fill={sticker.color} stroke="none" />
          <circle cx="56" cy="42" r="2" fill={sticker.color} stroke="none" />
        </g>
      )}
      {sticker.stickerId === 'terminal' && (
        <g {...common}>
          <rect x="14" y="20" width="72" height="60" rx="10" />
          <path d="m29 40 12 10-12 10M49 62h21" />
        </g>
      )}
      {sticker.stickerId === 'rocket' && (
        <g {...common}>
          <path d="M58 18c13 1 22 10 24 24L55 69 32 46 58 18Z" />
          <circle cx="62" cy="38" r="8" />
          <path d="M33 47 20 50l13 13M54 68l-4 13-12-13M34 66c-10 2-15 7-17 17 10-2 15-7 17-17Z" />
        </g>
      )}
      {sticker.stickerId === 'coffee' && (
        <g {...common}>
          <path d="M24 35h49v30c0 10-8 18-18 18H42c-10 0-18-8-18-18V35Z" />
          <path d="M73 44h5c10 0 10 18 0 18h-5M38 26c-6-7 6-9 0-16M55 26c-6-7 6-9 0-16" />
        </g>
      )}
    </>
  );
}

function CaptionArtwork({ element }: { element: CaptionElement }) {
  const lines = wrapText(element.text, Math.max(12, Math.floor(element.width / (element.fontSize * 0.58))));
  const anchor = element.align === 'left' ? 'start' : element.align === 'right' ? 'end' : 'middle';
  const textX = element.align === 'left' ? 28 : element.align === 'right' ? element.width - 28 : element.width / 2;
  const lineHeight = element.fontSize * 1.08;
  const firstY = element.height / 2 - ((lines.length - 1) * lineHeight) / 2;

  return (
    <>
      <rect width={element.width} height={element.height} rx="28" fill={element.background} />
      <text
        x={textX}
        y={firstY}
        dominantBaseline="middle"
        textAnchor={anchor}
        fill={element.color}
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize={element.fontSize}
        fontWeight="850"
        letterSpacing="-1"
      >
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={textX} dy={index === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
}

function SpeechBubbleArtwork({ element }: { element: SpeechBubbleElement }) {
  const lines = wrapText(element.text, Math.max(10, Math.floor(element.width / (element.fontSize * 0.56))));
  const lineHeight = element.fontSize * 1.18;
  const firstY = element.height * 0.43 - ((lines.length - 1) * lineHeight) / 2;
  const tail = element.tail === 'left'
    ? `M ${element.width * 0.23} ${element.height - 4} L ${element.width * 0.1} ${element.height + 42} L ${element.width * 0.38} ${element.height - 4} Z`
    : `M ${element.width * 0.62} ${element.height - 4} L ${element.width * 0.9} ${element.height + 42} L ${element.width * 0.77} ${element.height - 4} Z`;

  return (
    <>
      <path d={tail} fill={element.background} stroke={element.borderColor} strokeWidth="7" strokeLinejoin="round" />
      <rect
        width={element.width}
        height={element.height}
        rx="38"
        fill={element.background}
        stroke={element.borderColor}
        strokeWidth="7"
      />
      <text
        x={element.width / 2}
        y={firstY}
        dominantBaseline="middle"
        textAnchor="middle"
        fill={element.color}
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize={element.fontSize}
        fontWeight="750"
      >
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={element.width / 2} dy={index === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
}

export const VisualMemeEditor: React.FC<Props> = ({ isOpen, onClose }) => {
  const initialScene = useMemo(() => createTechMemeScene(), []);
  const [history, setHistory] = useState<VisualHistory>({ past: [], present: initialScene, future: [] });
  const [selectedId, setSelectedId] = useState<string | null>(initialScene.elements[0]?.id ?? null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const scene = history.present;
  const selected = scene.elements.find((element) => element.id === selectedId) ?? null;

  const commit = (update: (scene: VisualScene) => VisualScene) => {
    setHistory((current) => ({
      past: [...current.past, cloneScene(current.present)].slice(-50),
      present: update(cloneScene(current.present)),
      future: [],
    }));
  };

  const updateSelected = (changes: Partial<VisualElement>) => {
    if (!selectedId) return;
    commit((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.id === selectedId ? ({ ...element, ...changes } as VisualElement) : element
      ),
    }));
  };

  const addElement = (element: VisualElement) => {
    commit((current) => ({ ...current, elements: [...current.elements, element] }));
    setSelectedId(element.id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    commit((current) => ({
      ...current,
      elements: current.elements.filter((element) => element.id !== selectedId),
    }));
    setSelectedId(null);
  };

  const reorderSelected = (direction: -1 | 1) => {
    if (!selectedId) return;
    commit((current) => {
      const elements = [...current.elements];
      const index = elements.findIndex((element) => element.id === selectedId);
      const next = Math.max(0, Math.min(elements.length - 1, index + direction));
      if (index === -1 || index === next) return current;
      const [element] = elements.splice(index, 1);
      elements.splice(next, 0, element);
      return { ...current, elements };
    });
  };

  const undo = () => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [cloneScene(current.present), ...current.future].slice(0, 50),
      };
    });
  };

  const redo = () => {
    setHistory((current) => {
      const next = current.future[0];
      if (!next) return current;
      return {
        past: [...current.past, cloneScene(current.present)].slice(-50),
        present: next,
        future: current.future.slice(1),
      };
    });
  };

  const pointerToScene = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * scene.width,
      y: ((clientY - rect.top) / rect.height) * scene.height,
    };
  };

  const startDrag = (event: React.PointerEvent, element: VisualElement) => {
    event.preventDefault();
    event.stopPropagation();
    const point = pointerToScene(event.clientX, event.clientY);
    setSelectedId(element.id);
    setDrag({
      elementId: element.id,
      pointerX: point.x,
      pointerY: point.y,
      elementX: element.x,
      elementY: element.y,
      before: cloneScene(scene),
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent) => {
    if (!drag) return;
    const point = pointerToScene(event.clientX, event.clientY);
    setHistory((current) => ({
      ...current,
      present: {
        ...current.present,
        elements: current.present.elements.map((element) =>
          element.id === drag.elementId
            ? {
                ...element,
                x: Math.round(drag.elementX + point.x - drag.pointerX),
                y: Math.round(drag.elementY + point.y - drag.pointerY),
              }
            : element
        ),
      },
    }));
  };

  const endDrag = () => {
    if (!drag) return;
    setHistory((current) => ({
      past: [...current.past, drag.before].slice(-50),
      present: current.present,
      future: [],
    }));
    setDrag(null);
  };

  const loadSample = () => {
    commit(() => createTechMemeScene());
    setSelectedId(null);
  };

  const handleExport = async () => {
    const svg = svgRef.current;
    if (!svg) return;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('[data-editor-overlay]').forEach((node) => node.remove());
    clone.setAttribute('width', String(scene.width));
    clone.setAttribute('height', String(scene.height));
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const source = new XMLSerializer().serializeToString(clone);
    const blobUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      const image = new Image();
      image.decoding = 'async';
      image.src = blobUrl;
      await image.decode();

      const output = document.createElement('canvas');
      output.width = scene.width;
      output.height = scene.height;
      const context = output.getContext('2d');
      if (!context) throw new Error('Canvas export is unavailable.');
      context.drawImage(image, 0, 0, scene.width, scene.height);

      const link = document.createElement('a');
      link.download = 'yuwbrndr-tech-meme.png';
      link.href = output.toDataURL('image/png');
      link.click();
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-studio-950 text-slate-100">
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-studio-900 px-4 py-2">
        <div>
          <h2 className="font-bold text-white">Visual Meme Studio</h2>
          <p className="text-xs text-slate-400">Phase 1 · SVG elements, captions, stickers, dragging and history</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={!history.past.length} className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-30" title="Undo">
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={redo} disabled={!history.future.length} className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-30" title="Redo">
            <Redo2 className="h-4 w-4" />
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
            <Download className="h-4 w-4" /> Export PNG
          </button>
          <button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-slate-300" title="Close meme studio">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[230px_minmax(0,1fr)_280px] lg:overflow-hidden">
        <aside className="order-2 overflow-y-auto border-t border-white/10 bg-studio-900 p-4 lg:order-1 lg:border-r lg:border-t-0">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Add elements</div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <ToolButton icon={<Type />} label="Caption" onClick={() => addElement(createCaption({ y: 700 }))} />
            <ToolButton icon={<MessageCircle />} label="Speech bubble" onClick={() => addElement(createSpeechBubble())} />
          </div>

          <div className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">Built-in stickers</div>
          <div className="grid grid-cols-2 gap-2">
            <StickerButton id="bug" icon={<Bug />} onAdd={(id) => addElement(createSticker(id))} />
            <StickerButton id="terminal" icon={<Terminal />} onAdd={(id) => addElement(createSticker(id))} />
            <StickerButton id="rocket" icon={<Rocket />} onAdd={(id) => addElement(createSticker(id))} />
            <StickerButton id="coffee" icon={<Coffee />} onAdd={(id) => addElement(createSticker(id))} />
          </div>

          <button onClick={loadSample} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-2.5 text-xs font-semibold text-indigo-200">
            <RotateCcw className="h-4 w-4" /> Load tech meme
          </button>

          <div className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">Layers</div>
          <div className="space-y-1.5">
            {[...scene.elements].reverse().map((element) => (
              <button
                key={element.id}
                onClick={() => setSelectedId(element.id)}
                className={`w-full truncate rounded-lg border px-3 py-2 text-left text-xs ${selectedId === element.id ? 'border-indigo-500/60 bg-indigo-500/20 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}
              >
                {element.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="order-1 flex min-h-[55vh] items-center justify-center overflow-auto bg-studio-950 p-5 lg:order-2 lg:min-h-0">
          <div className="aspect-square w-full max-w-[min(72vh,760px)] overflow-hidden bg-white shadow-2xl">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${scene.width} ${scene.height}`}
              className="h-full w-full touch-none select-none"
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerDown={() => setSelectedId(null)}
              role="img"
              aria-label="Editable meme canvas"
            >
              <rect width={scene.width} height={scene.height} fill={scene.background} />
              <defs>
                <pattern id="meme-grid" width="42" height="42" patternUnits="userSpaceOnUse">
                  <path d="M42 0H0V42" fill="none" stroke="#6366f1" strokeOpacity="0.07" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width={scene.width} height={scene.height} fill="url(#meme-grid)" />
              {scene.elements.map((element) => (
                <g
                  key={element.id}
                  transform={`translate(${element.x} ${element.y}) rotate(${element.rotation} ${element.width / 2} ${element.height / 2})`}
                  opacity={element.opacity}
                  onPointerDown={(event) => startDrag(event, element)}
                  style={{ cursor: drag?.elementId === element.id ? 'grabbing' : 'grab' }}
                >
                  {element.type === 'caption' && <CaptionArtwork element={element} />}
                  {element.type === 'speech-bubble' && <SpeechBubbleArtwork element={element} />}
                  {element.type === 'sticker' && (
                    <svg width={element.width} height={element.height} viewBox="0 0 100 100">
                      <StickerArtwork sticker={element} />
                    </svg>
                  )}
                  {selectedId === element.id && (
                    <rect
                      data-editor-overlay="selection"
                      x="-10"
                      y="-10"
                      width={element.width + 20}
                      height={element.height + (element.type === 'speech-bubble' ? 62 : 20)}
                      rx="12"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="5"
                      strokeDasharray="14 10"
                      pointerEvents="none"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </main>

        <aside className="order-3 overflow-y-auto border-t border-white/10 bg-studio-900 p-4 lg:border-l lg:border-t-0">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Properties</div>
          {!selected && <p className="text-sm leading-6 text-slate-400">Select or drag an element on the canvas to edit it.</p>}
          {selected && (
            <div className="space-y-4">
              {(selected.type === 'caption' || selected.type === 'speech-bubble') && (
                <Field label="Text">
                  <textarea
                    value={selected.text}
                    onChange={(event) => updateSelected({ text: event.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-studio-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                <NumberField label="X" value={selected.x} onChange={(x) => updateSelected({ x })} />
                <NumberField label="Y" value={selected.y} onChange={(y) => updateSelected({ y })} />
                <NumberField label="Width" value={selected.width} min={60} onChange={(width) => updateSelected({ width })} />
                <NumberField label="Height" value={selected.height} min={60} onChange={(height) => updateSelected({ height })} />
                <NumberField label="Rotation" value={selected.rotation} min={-180} max={180} onChange={(rotation) => updateSelected({ rotation })} />
                {'fontSize' in selected && (
                  <NumberField label="Font size" value={selected.fontSize} min={12} max={120} onChange={(fontSize) => updateSelected({ fontSize })} />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {'color' in selected && <ColorField label="Main colour" value={selected.color} onChange={(color) => updateSelected({ color })} />}
                {'background' in selected && <ColorField label="Background" value={selected.background} onChange={(background) => updateSelected({ background })} />}
              </div>

              {selected.type === 'speech-bubble' && (
                <button onClick={() => updateSelected({ tail: selected.tail === 'left' ? 'right' : 'left' })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
                  Tail: {selected.tail}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <button onClick={() => reorderSelected(1)} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs">
                  <ArrowUp className="h-3.5 w-3.5" /> Forward
                </button>
                <button onClick={() => reorderSelected(-1)} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs">
                  <ArrowDown className="h-3.5 w-3.5" /> Backward
                </button>
              </div>
              <button onClick={removeSelected} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300">
                <Trash2 className="h-4 w-4" /> Delete element
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

function ToolButton({ icon, label, onClick }: { icon: React.ReactElement; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10">
      {React.cloneElement(icon, { className: 'h-4 w-4 text-indigo-400' } as React.SVGProps<SVGSVGElement>)}
      {label}
    </button>
  );
}

function StickerButton({ id, icon, onAdd }: { id: VisualStickerId; icon: React.ReactElement; onAdd: (id: VisualStickerId) => void }) {
  return (
    <button onClick={() => onAdd(id)} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] font-semibold capitalize text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10">
      {React.cloneElement(icon, { className: 'h-5 w-5 text-indigo-300' } as React.SVGProps<SVGSVGElement>)}
      {id}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function NumberField({ label, value, min = -2000, max = 3000, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (value: number) => void }) {
  return (
    <Field label={label}>
      <input type="number" value={Math.round(value)} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-lg border border-white/10 bg-studio-950 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500" />
    </Field>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-studio-950 p-1" />
    </Field>
  );
}
