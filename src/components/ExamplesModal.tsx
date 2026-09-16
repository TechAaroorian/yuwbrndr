import React, { useState } from 'react';
import { X, Sparkles, Code2, Check, ArrowRight, Layers } from 'lucide-react';
import { CODE_PRESETS, CodePreset } from '../utils/codePresets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: CodePreset) => void;
}

export const ExamplesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Infographic', '3D & Canvas', 'Vector & SVG', 'Meme & Social', 'Starter'];

  const filteredPresets = selectedCategory === 'All'
    ? CODE_PRESETS
    : CODE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0a0d1d] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Code Examples & Templates Gallery</h2>
              <p className="text-xs text-slate-400">Load an editable HTML/CSS or Canvas design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-[#070914]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-glow-indigo'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                    {preset.type === 'html' ? 'HTML + CSS' : 'Canvas 2D JS'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {preset.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {preset.code.split('\n').length} lines
                </span>
                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-all"
                >
                  <span>Load into Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
