import React from 'react';
import { Archive, Check, Copy, Download, FileDown, Plus, Trash2, CopyPlus } from 'lucide-react';

export interface StudioSlide {
  id: string;
  name: string;
  codeType: 'html' | 'canvas';
  code: string;
}

interface Props {
  slides: StudioSlide[];
  activeSlideId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
  onCopy: () => void;
  onExportAll: () => void;
  onExportPdf: () => void;
  isExporting: boolean;
  copiedImage: boolean;
}

export const MAX_SLIDES = 6;

export const SlideStrip: React.FC<Props> = ({
  slides,
  activeSlideId,
  onSelect,
  onAdd,
  onDuplicate,
  onDelete,
  onExport,
  onCopy,
  onExportAll,
  onExportPdf,
  isExporting,
  copiedImage,
}) => (
  <div className="shrink-0 border-b border-white/10 bg-studio-900 px-2 sm:px-3 py-2 flex items-center gap-2 select-none">
    <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 flex-1 pb-0.5">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onSelect(slide.id)}
          className={`shrink-0 min-w-[76px] px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
            slide.id === activeSlideId
              ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-200'
              : 'border-white/10 bg-studio-850 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title={slide.name}
        >
          <span className="block text-[9px] font-mono uppercase opacity-70">Slide {index + 1}</span>
          <span className="block max-w-[92px] truncate text-[11px] font-semibold">{slide.name}</span>
        </button>
      ))}

      <button
        onClick={onAdd}
        disabled={slides.length >= MAX_SLIDES}
        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-dashed border-white/20 text-[11px] font-semibold text-slate-400 hover:text-white hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
        title={slides.length >= MAX_SLIDES ? `Maximum ${MAX_SLIDES} slides` : 'Add blank slide'}
      >
        <Plus className="w-3.5 h-3.5" />
        {slides.length}/{MAX_SLIDES}
      </button>
    </div>

    <div className="flex items-center gap-1 shrink-0 border-l border-white/10 pl-2">
      <button
        onClick={onDuplicate}
        disabled={slides.length >= MAX_SLIDES}
        className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Duplicate active slide"
      >
        <CopyPlus className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onDelete}
        disabled={slides.length === 1}
        className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Delete active slide"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onCopy}
        disabled={isExporting}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
        title="Copy active slide as PNG"
      >
        {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="hidden xl:inline">{copiedImage ? 'Copied' : 'Copy slide'}</span>
      </button>
      <button
        onClick={onExportAll}
        disabled={isExporting}
        className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-indigo-500/35 bg-indigo-500/10 text-[11px] font-semibold text-indigo-200 hover:bg-indigo-500/20 disabled:opacity-50 transition-colors"
        title="Export all slides as numbered PNGs in a ZIP file"
      >
        <Archive className="w-3.5 h-3.5" />
        <span className="hidden 2xl:inline">Export ZIP</span>
      </button>
      <button
        onClick={onExportPdf}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-2 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
        title="Export all slides as a multi-page PDF"
      >
        <FileDown className="w-3.5 h-3.5 text-emerald-300" />
        <span className="hidden xl:inline">Export PDF</span>
      </button>
      <button
        onClick={onExport}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white disabled:opacity-50 transition-colors shadow-sm"
        title="Export active slide as PNG at 2x"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden xl:inline">Export slide</span>
      </button>
    </div>
  </div>
);
