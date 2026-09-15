import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  ChevronDown,
  HelpCircle,
  Share2,
  Sparkles,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ASPECT_PRESETS, COLOR_THEMES, AspectPreset, ColorTheme } from '../types/studio';

interface Props {
  currentPreset: AspectPreset;
  onSelectPreset: (preset: AspectPreset) => void;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  autoFit?: boolean;
  onToggleAutoFit?: () => void;
  onExport: (scale: 1 | 2 | 4) => void;
  onCopyImage: () => void;
  onOpenExamples: () => void;
  onOpenPlatformGuide: () => void;
  isExporting: boolean;
  copiedImage: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<Props> = ({
  currentPreset,
  onSelectPreset,
  currentTheme,
  onSelectTheme,
  zoom,
  onZoomChange,
  autoFit,
  onToggleAutoFit,
  onExport,
  onCopyImage,
  onOpenExamples,
  onOpenPlatformGuide,
  isExporting,
  copiedImage,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  return (
    <header className="h-16 border-b border-white/10 bg-studio-900 px-4 sm:px-5 flex items-center justify-between z-30 select-none">
      {/* Brand Title & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg border transition-colors ${
              isSidebarOpen
                ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                : 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25'
            }`}
            title={isSidebarOpen ? "Collapse Left Panel (Ctrl+B)" : "Expand Left Panel (Ctrl+B)"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>
        )}

        <img src="./yuwbrndr-logo.svg" alt="" className="w-9 h-9 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-100 tracking-tight text-lg">YuwBrndr</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
              Studio
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Create social graphics from code</p>
        </div>
      </div>

      {/* Center Controls: Platform Selector, Resolution Guide & Zoom */}
      <div className="hidden lg:flex items-center gap-2 bg-studio-950 p-1 rounded-lg border border-white/10">
        {/* Platform Preset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 text-xs font-medium text-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentPreset.platform}: {currentPreset.aspectRatio}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showPresetMenu && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-white/10 bg-studio-900 shadow-2xl p-2 z-40 space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                <span>Select Platform Format</span>
                <span className="text-indigo-400 font-bold">2026 Optimal</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {ASPECT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPreset(p);
                      setShowPresetMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                      p.id === currentPreset.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-sans font-semibold text-slate-100">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.width} × {p.height} ({p.aspectRatio})</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {p.platform.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setShowPresetMenu(false);
                    onOpenPlatformGuide();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Open Full Resolution Guide</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zoom & Auto-Fit Controls */}
        <div className="flex items-center gap-1 pl-1">
          {onToggleAutoFit && (
            <button
              onClick={onToggleAutoFit}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                autoFit
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
              title="Auto-Fit Canvas to Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit</span>
            </button>
          )}

          <button
            onClick={() => onZoomChange(Math.max(0.2, zoom - 0.05))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-300 min-w-[2.75rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.0, zoom + 0.05))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Actions: Theme Selector, Code Inspector, Export */}
      <div className="flex items-center gap-2">
        {/* Mobile Resolution Guide Button */}
        <button
          onClick={onOpenPlatformGuide}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
          title="Platform Resolution Guide"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Theme Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
          >
            <span 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: currentTheme.primary }} 
            />
            <span className="hidden sm:inline">{currentTheme.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-studio-900 shadow-2xl p-1.5 z-40">
              <div className="text-[10px] font-mono uppercase text-slate-500 px-2 py-1">Theme Palette</div>
              {Object.values(COLOR_THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    onSelectTheme(th);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    th.id === currentTheme.id ? 'bg-indigo-600/30 text-white font-semibold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: th.primary }} />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Browse Examples Button */}
        <button
          onClick={onOpenExamples}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-xs font-semibold text-slate-200 transition-colors"
          title="Browse templates"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Copy Image Button */}
        <button
          onClick={onCopyImage}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-xs font-semibold text-slate-200 transition-colors"
          title="Copy rendered PNG to clipboard"
        >
          {copiedImage ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-300" />
          )}
          <span className="hidden sm:inline">{copiedImage ? 'Copied!' : 'Copy PNG'}</span>
        </button>

        {/* Export Image Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Rendering...' : 'Export'}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-studio-900 shadow-2xl p-1.5 z-40 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500 px-2 py-1">Resolution Multiplier</div>
              <button
                onClick={() => {
                  onExport(1);
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <div>
                  <div>Standard Resolution</div>
                  <div className="text-[10px] text-slate-500 font-mono">1x ({currentPreset.width}×{currentPreset.height})</div>
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">1x</span>
              </button>
              <button
                onClick={() => {
                  onExport(2);
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors bg-indigo-600/10 border border-indigo-500/20"
              >
                <div>
                  <div className="font-semibold text-indigo-300 flex items-center gap-1">
                    <span>Recommended</span>
                  </div>
                  <div className="text-[10px] text-indigo-400/80 font-mono">2x ({currentPreset.width * 2}×{currentPreset.height * 2})</div>
                </div>
                <span className="font-mono text-[10px] text-indigo-400 font-bold">2x</span>
              </button>
              <button
                onClick={() => {
                  onExport(4);
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <div>
                  <div className="font-semibold text-cyan-300">Ultra Print / 4K</div>
                  <div className="text-[10px] text-cyan-500 font-mono">4x ({currentPreset.width * 4}×{currentPreset.height * 4})</div>
                </div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold">4x</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
