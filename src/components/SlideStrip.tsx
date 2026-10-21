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
  <div className="aar-slide-strip aar-u-border-b aar-u-border-border">
    <div className="aar-slide-strip-items">
      <div className="aar-segmented" role="tablist" aria-label="Slide deck tabs">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            id={`slide-tab-${slide.id}`}
            aria-selected={slide.id === activeSlideId}
            aria-pressed={slide.id === activeSlideId}
            onClick={() => onSelect(slide.id)}
            data-size="sm"
            title={slide.name}
            className="aar-segmented-item"
          >
            <span className="aar-u-font-mono aar-u-text-xs aar-u-opacity-70">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="aar-u-font-medium">{slide.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onAdd}
        disabled={slides.length >= MAX_SLIDES}
        className="aar-button aar-u-shrink-0 aar-u-inline-flex aar-u-items-center aar-u-gap-1"
        data-variant="quiet"
        data-size="sm"
        title={slides.length >= MAX_SLIDES ? `Maximum ${MAX_SLIDES} slides` : 'Add slide with current design'}
      >
        <Plus className="aar-u-w-3.5 aar-u-h-3.5" />
        <span>{slides.length}/{MAX_SLIDES}</span>
      </button>
    </div>

    <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-shrink-0 aar-u-border-l aar-u-border-border aar-u-pl-2.5">
      <button
        onClick={onDuplicate}
        disabled={slides.length >= MAX_SLIDES}
        className="aar-button aar-u-inline-flex aar-u-items-center aar-u-gap-1.5"
        data-variant="quiet"
        title="Copy current slide as new slide"
        data-size="sm"
        aria-label="Copy current slide"
      >
        <CopyPlus className="aar-u-w-3.5 aar-u-h-3.5" />
        <span className="aar-u-hidden aar-u-lg-inline">Copy slide</span>
      </button>
      <button
        onClick={onDelete}
        disabled={slides.length === 1}
        className="aar-icon-button"
        data-variant="quiet"
        title="Delete active slide"
        data-size="sm"
        aria-label="Delete active slide"
      >
        <Trash2 className="aar-u-w-3.5 aar-u-h-3.5" />
      </button>
      <button
        onClick={onCopy}
        disabled={isExporting}
        className="aar-button aar-u-hidden aar-u-sm-inline-flex aar-u-gap-1.5"
        data-variant="quiet"
        title="Copy active slide image to clipboard (PNG)"
        data-size="sm"
      >
        {copiedImage ? <Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-400" /> : <Copy className="aar-u-w-3.5 aar-u-h-3.5" />}
        <span className="aar-u-hidden aar-u-xl-inline">{copiedImage ? 'Copied' : 'Copy PNG'}</span>
      </button>
      <button
        onClick={onExportAll}
        disabled={isExporting}
        className="aar-button aar-u-hidden aar-u-md-inline-flex aar-u-gap-1.5"
        data-variant="quiet"
        title="Export all slides as numbered PNGs in a ZIP file"
        data-size="sm"
      >
        <Archive className="aar-u-w-3.5 aar-u-h-3.5" />
        <span className="aar-u-hidden aar-u-2xl-inline">Export ZIP</span>
      </button>
      <button
        onClick={onExportPdf}
        disabled={isExporting}
        className="aar-button aar-u-inline-flex aar-u-gap-1.5"
        data-variant="quiet"
        title="Export all slides as a multi-page PDF"
        data-size="sm"
      >
        <FileDown className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-300" />
        <span className="aar-u-hidden aar-u-xl-inline">PDF</span>
      </button>
      <button
        onClick={onExport}
        disabled={isExporting}
        className="aar-button aar-u-inline-flex aar-u-gap-1.5"
        data-variant="primary"
        title="Export active slide as PNG at 2x"
        data-size="sm"
      >
        <Download className="aar-u-w-3.5 aar-u-h-3.5" />
        <span>Export slide</span>
      </button>
    </div>
  </div>
);
