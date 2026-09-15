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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-studio-900 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-studio-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>10 Curated Open-Source Fonts</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Commercial Safe
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                OFL & Apache 2.0 licensed typography pre-loaded and ready for Tailwind CSS classes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Search, Category Filter, and Custom Text input */}
        <div className="p-4 border-b border-white/10 bg-studio-950/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fonts, styles, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Live Preview Text Overrider */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Live Preview:</span>
            <input
              type="text"
              placeholder="Type custom preview text..."
              value={customPreviewText}
              onChange={(e) => setCustomPreviewText(e.target.value)}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors w-full sm:w-56"
            />
          </div>
        </div>

        {/* Fonts Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFonts.map((font) => {
              const isCopied = copiedFontId === font.id;
              return (
                <div
                  key={font.id}
                  className="p-5 rounded-2xl bg-studio-950/70 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Top Row: Name, Category, and License */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base tracking-tight">
                          {font.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">
                          {font.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {font.license.split(' ')[0]}
                      </span>
                    </div>

                    {/* Description & Best For */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {font.description}
                    </p>

                    <div className="text-[11px] text-indigo-300/90 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      🎯 Best for: {font.bestFor}
                    </div>

                    {/* Live Font Rendering Preview */}
                    <div 
                      className="p-4 rounded-xl bg-[#060810] border border-white/10 space-y-1.5 transition-colors overflow-hidden"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
                        {customPreviewText.trim() ? customPreviewText : font.sampleHeadline}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 opacity-90 leading-relaxed break-words">
                        {customPreviewText.trim() ? '' : font.sampleBody}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy Tailwind class and Insert Block */}
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyClass(font)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition-all"
                      title="Copy Tailwind class"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>.{font.tailwindClass}</span>
                        </>
                      )}
                    </button>

                    {onInsertSnippet && (
                      <button
                        onClick={() => handleInsertFontBlock(font)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all"
                        title="Insert ready-made styled element into code"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>+ Insert Block</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFonts.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No fonts matched your search query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-studio-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>All 10 fonts are loaded via Google Fonts with <code className="font-mono text-slate-300">font-display: swap</code>.</span>
          <span className="text-indigo-400 font-mono text-[11px]">Usage: class="{OPEN_SOURCE_FONTS[0].tailwindClass}"</span>
        </div>
      </div>
    </div>
  );
};
