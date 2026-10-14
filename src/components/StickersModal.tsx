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
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z-50 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-4 aar-u-sm-p-6 aar-u-animate-in aar-u-fade-in aar-u-duration-200">
      {/* Backdrop */}
      <div 
        className="aar-u-absolute aar-u-inset-0 aar-u-bg-black-80 "
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="aar-u-relative aar-u-w-full aar-u-max-w-4xl aar-u-max-h--85vh aar-u-bg-surface aar-u-border aar-u-border-border aar-u-rounded  aar-u-flex aar-u-flex-col aar-u-overflow-hidden aar-u-text-text aar-u-z-10">
        
        {/* Header */}
        <div className="aar-u-px-6 aar-u-py-4 aar-u-border-b aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between aar-u-bg-background aar-u-shrink-0">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-3">
            <div className="aar-u-w-9 aar-u-h-9 aar-u-rounded aar-u-bg-cyan-500-20 aar-u-border aar-u-border-cyan-500-30 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-text-primary">
              <Smile className="aar-u-w-5 aar-u-h-5" />
            </div>
            <div>
              <h2 className="aar-u-text-lg aar-u-font-bold aar-u-text-text aar-u-flex aar-u-items-center aar-u-gap-2">
                <span>Vectors, Lucide Icons & Meme Stickers</span>
                <span className="aar-u-text-sm aar-u-font-mono aar-u-font-semibold aar-u-px-2 aar-u-py-0.5 aar-u-rounded-full aar-u-bg-cyan-500-20 aar-u-text-primary aar-u-border aar-u-border-cyan-500-30">
                  Open Source SVGs
                </span>
              </h2>
              <p className="aar-u-text-xs aar-u-text-text-muted">
                100% scalable vector elements, Lucide developer icons, and funny rubber stamps for your graphics.
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

        {/* Search & Categories Bar */}
        <div className="aar-u-p-4 aar-u-border-b aar-u-border-border aar-u-bg-background aar-u-flex aar-u-flex-wrap aar-u-items-center aar-u-justify-between aar-u-gap-3 aar-u-shrink-0">
          <div className="aar-u-relative aar-u-flex-1 aar-u-min-w--200px aar-u-max-w-xs">
            <Search className="aar-u-w-4 aar-u-h-4 aar-u-text-text-muted aar-u-absolute aar-u-left-3 aar-u-top-1-2 aar-u--translate-y-1-2" />
            <input
              type="text"
              placeholder="Search icons, stickers, stamps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aar-input" data-size="sm"
            />
          </div>

          <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-flex-wrap">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'lucide', label: 'Lucide Dev Icons' },
              { id: 'tech', label: 'Tech Badges' },
              { id: 'stamps', label: 'Meme Stickers & Stamps' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`aar-button ${
                  selectedCategory === cat.id
                    ? 'aar-u-bg-surface-subtle aar-u-text-text  aar-u-font-semibold'
                    : 'aar-u-bg-surface-subtle aar-u-text-text-muted aar-u-hover-text-text aar-u-hover-bg-surface-subtle aar-u-border aar-u-border-border'
                }`} data-variant="primary" data-size="sm"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="aar-u-flex-1 aar-u-overflow-y-auto aar-u-p-6">
          <div className="aar-u-grid aar-u-grid-cols-1 aar-u-sm-grid-cols-2 aar-u-md-grid-cols-3 aar-u-gap-4">
            {filteredItems.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="aar-u-p-4 aar-u-rounded aar-u-bg-background aar-u-border aar-u-border-border aar-u-hover-border-cyan-500-40 aar-u-transition-all aar-u-flex aar-u-flex-col aar-u-justify-between aar-u-group "
                >
                  <div className="aar-u-space-y-3">
                    <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                      <span className="aar-u-font-bold aar-u-text-text aar-u-text-xs aar-u-tracking-tight aar-u-truncate aar-u-max-w--180px">
                        {item.name}
                      </span>
                      <span className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-text-text-muted">
                        {item.category}
                      </span>
                    </div>

                    {/* Live SVG Vector / Sticker Preview */}
                    <div className="aar-u-min-h--70px aar-u-p-3 aar-u-rounded aar-u-bg-surface aar-u-border aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-center aar-u-overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: item.svgHtml }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="aar-u-pt-3 aar-u-mt-2 aar-u-border-t aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-2">
                    <button
                      onClick={() => handleCopySvg(item)}
                      className="aar-button aar-u-flex aar-u-gap-1.5"
                      title="Copy raw SVG HTML to clipboard" data-size="sm"
                    >
                      {isCopied ? (
                        <>
                          <Check className="aar-u-w-3 aar-u-h-3 aar-u-text-success" />
                          <span className="aar-u-text-emerald-300 aar-u-font-bold aar-u-text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="aar-u-w-3 aar-u-h-3 aar-u-text-text-muted" />
                          <span className="aar-u-text-sm">Copy SVG</span>
                        </>
                      )}
                    </button>

                    {onInsertSnippet && (
                      <button
                        onClick={() => handleInsert(item)}
                        className="aar-button aar-u-flex aar-u-gap-1" data-variant="primary"
                        title="Insert into canvas code" data-size="sm"
                      >
                        <Code2 className="aar-u-w-3 aar-u-h-3" />
                        <span>+ Insert</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="aar-u-text-center aar-u-py-12 aar-u-text-text-muted aar-u-text-sm">
              No vectors or stickers matched your search query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="aar-u-px-6 aar-u-py-3 aar-u-border-t aar-u-border-border aar-u-bg-background aar-u-flex aar-u-items-center aar-u-justify-between aar-u-text-xs aar-u-text-text-muted aar-u-shrink-0">
          <span>All vectors & Lucide icons are 100% resolution-independent SVGs.</span>
          <span className="aar-u-text-primary aar-u-font-mono aar-u-text-sm">Click "+ Insert" to add to active canvas code</span>
        </div>
      </div>
    </div>
  );
};
