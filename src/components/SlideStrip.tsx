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
  <div className="aar-slide-strip aar-stack">
    <div className="aar-slide-strip-items">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onSelect(slide.id)}
          className="aar-slide-thumb" aria-pressed={slide.id === activeSlideId}
          title={slide.name} data-size="sm"
        >
          <div className="aar-slide-thumb-meta">
            <span>Slide {String(index + 1).padStart(2, '0')}</span>
            <span className={slide.id === activeSlideId ? 'aar-u-text-primary' : 'aar-u-text-text-muted'}>
              {slide.id === activeSlideId ? <Check size={12} aria-hidden="true" /> : null}
            </span>
          </div>
          <span className="aar-slide-thumb-title">{slide.name}</span>
        </button>
      ))}

      <button
        onClick={onAdd}
        disabled={slides.length >= MAX_SLIDES}
        className="aar-button aar-u-shrink-0 aar-u-inline-flex aar-u-gap-1"
        title={slides.length >= MAX_SLIDES ? `Maximum ${MAX_SLIDES} slides` : 'Add blank slide'} data-size="sm"
      >
        <Plus className="aar-u-w-3.5 aar-u-h-3.5" />
        {slides.length}/{MAX_SLIDES}
      </button>
    </div>

    <div className="aar-u-flex aar-u-items-center aar-u-gap-1 aar-u-shrink-0 aar-u-border-l aar-u-border-border aar-u-pl-2">
      <button
        onClick={onDuplicate}
        disabled={slides.length >= MAX_SLIDES}
        className="aar-button "
        title="Duplicate active slide" data-size="sm"
      >
        <CopyPlus className="aar-u-w-3.5 aar-u-h-3.5" />
      </button>
      <button
        onClick={onDelete}
        disabled={slides.length === 1}
        className="aar-button "
        title="Delete active slide" data-size="sm"
      >
        <Trash2 className="aar-u-w-3.5 aar-u-h-3.5" />
      </button>
      <button
        onClick={onCopy}
        disabled={isExporting}
        className="aar-button aar-u-hidden aar-u-sm-inline-flex aar-u-gap-1.5"
        title="Copy active slide as PNG" data-size="sm"
      >
        {copiedImage ? <Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-400" /> : <Copy className="aar-u-w-3.5 aar-u-h-3.5" />}
        <span className="aar-u-hidden aar-u-xl-inline">{copiedImage ? 'Copied' : 'Copy slide'}</span>
      </button>
      <button
        onClick={onExportAll}
        disabled={isExporting}
        className="aar-button aar-u-hidden aar-u-md-inline-flex aar-u-gap-1.5"
        title="Export all slides as numbered PNGs in a ZIP file" data-size="sm"
      >
        <Archive className="aar-u-w-3.5 aar-u-h-3.5" />
        <span className="aar-u-hidden aar-u-2xl-inline">Export ZIP</span>
      </button>
      <button
        onClick={onExportPdf}
        disabled={isExporting}
        className="aar-button aar-u-inline-flex aar-u-gap-1.5"
        title="Export all slides as a multi-page PDF" data-size="sm"
      >
        <FileDown className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-300" />
        <span className="aar-u-hidden aar-u-xl-inline">Export PDF</span>
      </button>
      <button
        onClick={onExport}
        disabled={isExporting}
        className="aar-button aar-u-inline-flex aar-u-gap-1.5" data-variant="primary"
        title="Export active slide as PNG at 2x" data-size="sm"
      >
        <Download className="aar-u-w-3.5 aar-u-h-3.5" />
        <span className="aar-u-hidden aar-u-xl-inline">Export slide</span>
      </button>
    </div>
  </div>
);
