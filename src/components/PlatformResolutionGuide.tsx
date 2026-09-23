import React from 'react';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle, 
  Maximize, 
  Monitor, 
  Smartphone,
  Share2
} from 'lucide-react';
import { ASPECT_PRESETS, AspectPreset, PlatformType } from '../types/studio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: AspectPreset;
  onSelectPreset: (preset: AspectPreset) => void;
}

export const PlatformResolutionGuide: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPreset,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-studio-900 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-bold text-slate-100 text-sm sm:text-lg">Social & Web Platform Resolution Guide</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                  Updated for 2026 Algorithms
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">
                Optimal aspect ratios, safe zones, and compression bypass techniques for crystal-clear exports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Pro-Tips Banner */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Pro Tip for Developers:</strong> Social platforms (X, LinkedIn, Meta) re-encode uploaded JPEGs. Always export in <strong>PNG at 2x (Retina)</strong> to keep small code snippets, diagram lines, and text vector-sharp.
          </span>
        </div>

        {/* Platform Presets Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASPECT_PRESETS.map((p) => {
              const isSelected = p.id === currentPreset.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPreset(p);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/15 shadow-glow-indigo'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  <div>
                    {/* Top Row: Platform & Aspect Ratio */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                        {p.platform}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {p.aspectRatio}
                      </span>
                    </div>

                    {/* Name & Dimensions */}
                    <h4 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-xs font-mono font-extrabold text-cyan-400 mb-2.5">
                      {p.width} × {p.height} px
                    </div>

                    {/* Resolution Tip */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {p.tip}
                    </p>

                    {/* Safe Zone Alert */}
                    {p.safeZone && (
                      <div className="p-2 rounded-lg bg-studio-950/80 border border-white/5 text-[11px] text-amber-300/90 flex items-start gap-1.5 mb-2 font-mono">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                        <span><strong>Safe Zone:</strong> {p.safeZone}</span>
                      </div>
                    )}
                  </div>

                  {/* Best For & Select Button */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono line-clamp-1">
                      {p.bestFor}
                    </span>
                    <button
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/10 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-white/5 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-DPI Retina Rendering Supported (1x, 2x, 4x)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
