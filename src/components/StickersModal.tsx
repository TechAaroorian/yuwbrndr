import React, { useState } from 'react';
import { 
  X, 
  Smile, 
  Copy, 
  Check, 
  Search, 
  Code2, 
  Sparkles,
  ShieldCheck,
  Terminal,
  Flame,
  Layers
} from 'lucide-react';
import { STICKERS_CATALOG, StickerItem } from '../utils/stickersCatalog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet?: (snippet: string) => void;
}

export const StickersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInsertSnippet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = STICKERS_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopySvg = (item: StickerItem) => {
    navigator.clipboard.writeText(item.svgHtml);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (item: StickerItem) => {
    if (!onInsertSnippet) return;
    onInsertSnippet(item.svgHtml);
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
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-studio-900 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-studio-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Vectors, Lucide Icons & Meme Stickers</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Open Source SVGs
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                100% scalable vector elements, Lucide developer icons, and funny rubber stamps for your graphics.
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

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-white/10 bg-studio-950/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search icons, stickers, stamps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'lucide', label: 'Lucide Dev Icons' },
              { id: 'tech', label: 'Tech Badges' },
              { id: 'stamps', label: 'Meme Stickers & Stamps' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-studio-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs tracking-tight truncate max-w-[180px]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    {/* Live SVG Vector / Sticker Preview */}
                    <div className="min-h-[70px] p-3 rounded-xl bg-[#060812] border border-white/5 flex items-center justify-center overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: item.svgHtml }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopySvg(item)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition-all"
                      title="Copy raw SVG HTML to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 font-bold text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px]">Copy SVG</span>
                        </>
                      )}
                    </button>

                    {onInsertSnippet && (
                      <button
                        onClick={() => handleInsert(item)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/30 text-[11px] font-semibold transition-all"
                        title="Insert into canvas code"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>+ Insert</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No vectors or stickers matched your search query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-studio-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>All vectors & Lucide icons are 100% resolution-independent SVGs.</span>
          <span className="text-cyan-400 font-mono text-[11px]">Click "+ Insert" to add to active canvas code</span>
        </div>
      </div>
    </div>
  );
};
