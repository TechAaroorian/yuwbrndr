import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Copy, 
  Check, 
  Sparkles, 
  Search,
  Code2,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { OPEN_SOURCE_FONTS, OpenSourceFont } from '../utils/fontsCatalog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet?: (snippet: string) => void;
}

export const FontsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInsertSnippet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customPreviewText, setCustomPreviewText] = useState<string>('');
  const [copiedFontId, setCopiedFontId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFonts = OPEN_SOURCE_FONTS.filter((font) => {
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    const matchesSearch = 
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.tailwindClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyClass = (font: OpenSourceFont) => {
    navigator.clipboard.writeText(font.tailwindClass);
    setCopiedFontId(font.id);
    setTimeout(() => setCopiedFontId(null), 2000);
  };

  const handleInsertFontBlock = (font: OpenSourceFont) => {
    if (!onInsertSnippet) return;
    const snippet = `<div class="p-6 rounded-2xl bg-slate-900/80 border border-white/10 ${font.tailwindClass}">\n  <span class="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">${font.name}</span>\n  <h2 class="text-3xl sm:text-4xl font-black text-white mt-1 mb-2">${font.sampleHeadline}</h2>\n  <p class="text-slate-300 text-sm leading-relaxed">${font.sampleBody}</p>\n</div>`;
    onInsertSnippet(snippet);
    onClose();
  };

  return (
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z-50 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-4 aar-u-sm-p-6 aar-u-animate-in aar-u-fade-in aar-u-duration-200">
      {/* Backdrop */}
      <div 
        className="aar-u-absolute aar-u-inset-0 aar-u-bg-black-80 "
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="aar-u-relative aar-u-w-full aar-u-max-w-5xl aar-u-max-h--90vh aar-u-bg-surface aar-u-border aar-u-border-border aar-u-rounded  aar-u-flex aar-u-flex-col aar-u-overflow-hidden aar-u-text-text aar-u-z-10">
        
        {/* Header */}
        <div className="aar-u-px-6 aar-u-py-4 aar-u-border-b aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between aar-u-bg-background aar-u-shrink-0">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-3">
            <div className="aar-u-w-9 aar-u-h-9 aar-u-rounded aar-u-bg-indigo-500-20 aar-u-border aar-u-border-indigo-500-30 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-text-primary">
              <Type className="aar-u-w-5 aar-u-h-5" />
            </div>
            <div>
              <h2 className="aar-u-text-lg aar-u-font-bold aar-u-text-text aar-u-flex aar-u-items-center aar-u-gap-2">
                <span>10 Curated Open-Source Fonts</span>
                <span className="aar-u-text-sm aar-u-font-mono aar-u-font-semibold aar-u-px-2 aar-u-py-0.5 aar-u-rounded-full aar-u-bg-emerald-500-20 aar-u-text-emerald-300 aar-u-border aar-u-border-emerald-500-30">
                  100% Commercial Safe
                </span>
              </h2>
              <p className="aar-u-text-xs aar-u-text-text-muted">
                OFL & Apache 2.0 licensed typography pre-loaded and ready for Tailwind CSS classes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="aar-button " data-size="sm"
          >
            <X className="aar-u-w-5 aar-u-h-5" />
          </button>
        </div>

        {/* Controls Bar: Search, Category Filter, and Custom Text input */}
        <div className="aar-u-p-4 aar-u-border-b aar-u-border-border aar-u-bg-background aar-u-flex aar-u-flex-wrap aar-u-items-center aar-u-justify-between aar-u-gap-3 aar-u-shrink-0">
          {/* Search Input */}
          <div className="aar-u-relative aar-u-flex-1 aar-u-min-w--200px aar-u-max-w-xs">
            <Search className="aar-u-w-4 aar-u-h-4 aar-u-text-text-muted aar-u-absolute aar-u-left-3 aar-u-top-1-2 aar-u--translate-y-1-2" />
            <input
              type="text"
              placeholder="Search fonts, styles, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aar-input" data-size="sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-flex-wrap">
            {[
              { id: 'all', label: 'All Fonts (10)' },
              { id: 'sans', label: 'Sans-Serif' },
              { id: 'mono', label: 'Monospace' },
              { id: 'display', label: 'Display & Meme' },
              { id: 'serif', label: 'Editorial Serif' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`aar-button ${
                  selectedCategory === cat.id
                    ? 'aar-u-bg-surface-subtle aar-u-text-text '
                    : 'aar-u-bg-surface-subtle aar-u-text-text-muted aar-u-hover-text-text aar-u-hover-bg-surface-subtle aar-u-border aar-u-border-border'
                }`} data-variant="primary" data-size="sm"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Live Preview Text Overrider */}
          <div className="aar-u-w-full aar-u-sm-w-auto aar-u-flex aar-u-items-center aar-u-gap-2">
            <span className="aar-u-text-sm aar-u-font-mono aar-u-text-text-muted aar-u-shrink-0">Live Preview:</span>
            <input
              type="text"
              placeholder="Type custom preview text..."
              value={customPreviewText}
              onChange={(e) => setCustomPreviewText(e.target.value)}
              className="aar-input" data-size="sm"
            />
          </div>
        </div>

        {/* Fonts Grid */}
        <div className="aar-u-flex-1 aar-u-overflow-y-auto aar-u-p-6 aar-u-space-y-4">
          <div className="aar-u-grid aar-u-grid-cols-1 aar-u-md-grid-cols-2 aar-u-gap-4">
            {filteredFonts.map((font) => {
              const isCopied = copiedFontId === font.id;
              return (
                <div
                  key={font.id}
                  className="aar-u-p-5 aar-u-rounded aar-u-bg-background aar-u-border aar-u-border-border aar-u-hover-border-indigo-500-40 aar-u-transition-all aar-u-flex aar-u-flex-col aar-u-justify-between aar-u-group "
                >
                  <div className="aar-u-space-y-3">
                    {/* Top Row: Name, Category, and License */}
                    <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                      <div className="aar-u-flex aar-u-items-center aar-u-gap-2">
                        <span className="aar-u-font-bold aar-u-text-text aar-u-text-base aar-u-tracking-tight">
                          {font.name}
                        </span>
                        <span className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-text-text aar-u-font-semibold">
                          {font.category}
                        </span>
                      </div>
                      <span className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono">
                        {font.license.split(' ')[0]}
                      </span>
                    </div>

                    {/* Description & Best For */}
                    <p className="aar-u-text-xs aar-u-text-text-muted aar-u-leading-relaxed">
                      {font.description}
                    </p>

                    <div className="aar-u-text-sm aar-u-text-primary-90 aar-u-font-mono aar-u-bg-indigo-500-10 aar-u-px-2.5 aar-u-py-1 aar-u-rounded aar-u-border aar-u-border-indigo-500-20">
                      🎯 Best for: {font.bestFor}
                    </div>

                    {/* Live Font Rendering Preview */}
                    <div 
                      className="aar-font-sample aar-u-p-4 aar-u-rounded aar-u-bg-surface aar-u-border aar-u-border-border aar-u-space-y-1.5 aar-u-transition-colors aar-u-overflow-hidden"
                      style={{ '--aar-preview-font': font.cssFamily } as React.CSSProperties}
                    >
                      <div className="aar-u-text-xl aar-u-sm-text-2xl aar-u-font-bold aar-u-text-text aar-u-tracking-tight aar-u-break-words">
                        {customPreviewText.trim() ? customPreviewText : font.sampleHeadline}
                      </div>
                      <div className="aar-u-text-xs aar-u-sm-text-sm aar-u-text-text aar-u-opacity-90 aar-u-leading-relaxed aar-u-break-words">
                        {customPreviewText.trim() ? '' : font.sampleBody}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy Tailwind class and Insert Block */}
                  <div className="aar-u-pt-4 aar-u-mt-3 aar-u-border-t aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-2">
                    <button
                      onClick={() => handleCopyClass(font)}
                      className="aar-button aar-u-flex aar-u-gap-1.5"
                      title="Copy Tailwind class" data-size="sm"
                    >
                      {isCopied ? (
                        <>
                          <Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-success" />
                          <span className="aar-u-text-emerald-300 aar-u-font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-text-muted" />
                          <span>.{font.tailwindClass}</span>
                        </>
                      )}
                    </button>

                    {onInsertSnippet && (
                      <button
                        onClick={() => handleInsertFontBlock(font)}
                        className="aar-button aar-u-flex aar-u-gap-1.5" data-variant="primary"
                        title="Insert ready-made styled element into code" data-size="sm"
                      >
                        <Code2 className="aar-u-w-3.5 aar-u-h-3.5" />
                        <span>+ Insert Block</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFonts.length === 0 && (
            <div className="aar-u-text-center aar-u-py-12 aar-u-text-text-muted aar-u-text-sm">
              No fonts matched your search query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="aar-u-px-6 aar-u-py-3 aar-u-border-t aar-u-border-border aar-u-bg-background aar-u-flex aar-u-items-center aar-u-justify-between aar-u-text-xs aar-u-text-text-muted aar-u-shrink-0">
          <span>All 10 fonts are loaded via Google Fonts with <code className="aar-u-font-mono aar-u-text-text">font-display: swap</code>.</span>
          <span className="aar-u-text-primary aar-u-font-mono aar-u-text-sm">Usage: class="{OPEN_SOURCE_FONTS[0].tailwindClass}"</span>
        </div>
      </div>
    </div>
  );
};
