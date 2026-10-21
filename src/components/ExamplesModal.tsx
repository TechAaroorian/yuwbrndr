import React, { useState } from 'react';
import { X, LayoutTemplate, Code2, Check, ArrowRight, Layers } from 'lucide-react';
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
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z-50 aar-u-bg-black-80  aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-4 aar-u-select-none aar-u-animate-in aar-u-fade-in aar-u-duration-200">
      <div className="aar-u-w-full aar-u-max-w-4xl aar-u-bg-surface aar-u-border aar-u-border-border aar-u-rounded aar-u-overflow-hidden  aar-u-flex aar-u-flex-col aar-u-max-h--85vh">
        {/* Header */}
        <div className="aar-u-px-6 aar-u-py-5 aar-u-border-b aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-3">
            <div className="aar-u-w-9 aar-u-h-9 aar-u-rounded aar-u-bg-indigo-600-20 aar-u-text-primary aar-u-flex aar-u-items-center aar-u-justify-center aar-u-border aar-u-border-indigo-500-30">
              <LayoutTemplate className="aar-u-w-5 aar-u-h-5" />
            </div>
            <div>
              <h2 className="aar-u-text-lg aar-u-font-bold aar-u-text-text aar-u-tracking-tight">Code Examples & Templates Gallery</h2>
              <p className="aar-u-text-xs aar-u-text-text-muted">Load an editable HTML/CSS or Canvas design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="aar-button " data-size="sm"
          >
            <X className="aar-u-w-4 aar-u-h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="aar-u-px-6 aar-u-py-3 aar-u-border-b aar-u-border-border aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-overflow-x-auto aar-u-bg-surface">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`aar-button ${
                selectedCategory === cat
                  ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-font-semibold '
                  : 'aar-u-bg-surface-subtle aar-u-text-text-muted aar-u-hover-text-text aar-u-hover-bg-surface-subtle'
              }`} data-variant="primary" data-size="sm"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="aar-u-p-6 aar-u-overflow-y-auto aar-u-grid aar-u-grid-cols-1 aar-u-md-grid-cols-2 aar-u-gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="aar-u-p-5 aar-u-rounded aar-u-bg-slate-900-60 aar-u-border aar-u-border-border aar-u-hover-border-indigo-500-50 aar-u-hover-bg-slate-900-90 aar-u-transition-all aar-u-flex aar-u-flex-col aar-u-justify-between aar-u-group "
            >
              <div className="aar-u-space-y-2.5">
                <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                  <span className="aar-u-px-2.5 aar-u-py-0.5 aar-u-rounded-md aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-tracking-wider aar-u-bg-indigo-500-20 aar-u-text-primary aar-u-border aar-u-border-indigo-500-30">
                    {preset.category}
                  </span>
                  <span className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-text-text-muted aar-u-font-semibold">
                    {preset.type === 'html' ? 'HTML + CSS' : 'Canvas 2D JS'}
                  </span>
                </div>
                <h3 className="aar-u-text-base aar-u-font-bold aar-u-text-text aar-u-group-hover-text-primary aar-u-transition-colors">
                  {preset.name}
                </h3>
                <p className="aar-u-text-xs aar-u-text-text-muted aar-u-leading-relaxed aar-u-font-sans">
                  {preset.description}
                </p>
              </div>

              <div className="aar-u-mt-5 aar-u-pt-3 aar-u-border-t aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between">
                <span className="aar-u-text-sm aar-u-font-mono aar-u-text-text-muted">
                  {preset.code.split('\n').length} lines
                </span>
                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="aar-button aar-u-flex aar-u-gap-1.5" data-variant="primary" data-size="sm"
                >
                  <span>Load into Editor</span>
                  <ArrowRight className="aar-u-w-3.5 aar-u-h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
