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
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z-50 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-3 aar-u-sm-p-4 aar-u-bg-black-75  aar-u-animate-in aar-u-fade-in">
      <div className="aar-u-w-full aar-u-max-w-4xl aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-surface  aar-u-flex aar-u-flex-col aar-u-overflow-hidden aar-u-max-h--90vh">
        {/* Modal Header */}
        <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-px-4 aar-u-sm-px-6 aar-u-py-3 aar-u-sm-py-4 aar-u-border-b aar-u-border-border aar-u-bg-surface-subtle">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-2.5 aar-u-sm-gap-3">
            <div className="aar-u-p-2 aar-u-rounded aar-u-bg-indigo-500-20 aar-u-text-primary aar-u-border aar-u-border-indigo-500-30 aar-u-shrink-0">
              <Share2 className="aar-u-w-4 aar-u-h-4 aar-u-sm-w-5 aar-u-sm-h-5" />
            </div>
            <div>
              <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-sm-gap-2 aar-u-flex-wrap">
                <h3 className="aar-u-font-bold aar-u-text-text aar-u-text-sm aar-u-sm-text-lg">Social & Web Platform Resolution Guide</h3>
                <span className="aar-u-text-xs aar-u-font-mono aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-bg-emerald-500-20 aar-u-text-emerald-300 aar-u-border aar-u-border-emerald-500-30 aar-u-uppercase aar-u-font-semibold">
                  Updated for 2026 Algorithms
                </span>
              </div>
              <p className="aar-u-text-sm aar-u-sm-text-xs aar-u-text-text-muted aar-u-font-mono aar-u-mt-0.5">
                Optimal aspect ratios, safe zones, and compression bypass techniques for crystal-clear exports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="aar-button aar-u-shrink-0" data-size="sm"
          >
            <X className="aar-u-w-5 aar-u-h-5" />
          </button>
        </div>

        {/* Global Pro-Tips Banner */}
        <div className="aar-u-px-4 aar-u-sm-px-6 aar-u-py-2.5 aar-u-sm-py-3 aar-u-bg-indigo-950-40 aar-u-border-b aar-u-border-indigo-500-20 aar-u-flex aar-u-items-center aar-u-gap-2.5 aar-u-text-xs aar-u-text-primary">
          <Sparkles className="aar-u-w-4 aar-u-h-4 aar-u-text-primary aar-u-shrink-0" />
          <span>
            <strong>Pro Tip for Developers:</strong> Social platforms (X, LinkedIn, Meta) re-encode uploaded JPEGs. Always export in <strong>PNG at 2x (Retina)</strong> to keep small code snippets, diagram lines, and text vector-sharp.
          </span>
        </div>

        {/* Platform Presets Cards Grid */}
        <div className="aar-u-p-4 aar-u-sm-p-6 aar-u-overflow-y-auto aar-u-space-y-4 aar-u-max-h--70vh">
          <div className="aar-u-grid aar-u-grid-cols-1 aar-u-md-grid-cols-2 aar-u-lg-grid-cols-3 aar-u-gap-4">
            {ASPECT_PRESETS.map((p) => {
              const isSelected = p.id === currentPreset.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPreset(p);
                    onClose();
                  }}
                  className={`aar-u-p-4 aar-u-rounded aar-u-border aar-u-transition-all aar-u-cursor-pointer aar-u-flex aar-u-flex-col aar-u-justify-between aar-u-group ${
                    isSelected
                      ? 'aar-u-border-indigo-500 aar-u-bg-indigo-600-15 '
                      : 'aar-u-border-border aar-u-bg-surface-subtle aar-u-hover-border-border aar-u-hover-bg-white-0.08'
                  }`}
                >
                  <div>
                    {/* Top Row: Platform & Aspect Ratio */}
                    <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-mb-2">
                      <span className="aar-u-text-sm aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-tracking-wider aar-u-text-primary">
                        {p.platform}
                      </span>
                      <span className="aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-px-1.5 aar-u-py-0.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-text-text">
                        {p.aspectRatio}
                      </span>
                    </div>

                    {/* Name & Dimensions */}
                    <h4 className="aar-u-font-bold aar-u-text-text aar-u-text-sm aar-u-mb-1 aar-u-group-hover-text-primary aar-u-transition-colors">
                      {p.name}
                    </h4>
                    <div className="aar-u-text-xs aar-u-font-mono aar-u-font-extrabold aar-u-text-primary aar-u-mb-2.5">
                      {p.width} × {p.height} px
                    </div>

                    {/* Resolution Tip */}
                    <p className="aar-u-text-xs aar-u-text-text aar-u-leading-relaxed aar-u-mb-3">
                      {p.tip}
                    </p>

                    {/* Safe Zone Alert */}
                    {p.safeZone && (
                      <div className="aar-u-p-2 aar-u-rounded aar-u-bg-background aar-u-border aar-u-border-border aar-u-text-sm aar-u-text-amber-300-90 aar-u-flex aar-u-items-start aar-u-gap-1.5 aar-u-mb-2 aar-u-font-mono">
                        <ShieldAlert className="aar-u-w-3.5 aar-u-h-3.5 aar-u-shrink-0 aar-u-text-amber-400 aar-u-mt-0.5" />
                        <span><strong>Safe Zone:</strong> {p.safeZone}</span>
                      </div>
                    )}
                  </div>

                  {/* Best For & Select Button */}
                  <div className="aar-u-pt-3 aar-u-border-t aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between">
                    <span className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono aar-u-line-clamp-1">
                      {p.bestFor}
                    </span>
                    <button
                      className={`aar-button ${
                        isSelected
                          ? 'aar-u-bg-surface-subtle aar-u-text-text'
                          : 'aar-u-bg-surface-subtle aar-u-text-text aar-u-group-hover-bg-surface-subtle aar-u-group-hover-text-text'
                      }`} data-variant="primary" data-size="sm"
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
        <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-px-6 aar-u-py-3 aar-u-border-t aar-u-border-border aar-u-bg-surface-subtle aar-u-text-xs aar-u-font-mono aar-u-text-text-muted">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-2">
            <CheckCircle className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-400" />
            <span>High-DPI Retina Rendering Supported (1x, 2x, 4x)</span>
          </div>
          <button
            onClick={onClose}
            className="aar-button " data-size="sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
