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
  PanelLeftOpen,
  BookOpen,
  Info,
  Monitor,
  Moon,
  Sun,
  MoreVertical
} from 'lucide-react';
import { ASPECT_PRESETS, COLOR_THEMES, AppTheme, AspectPreset, ColorTheme } from '../types/studio';

interface Props {
  currentPreset: AspectPreset;
  onSelectPreset: (preset: AspectPreset) => void;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  autoFit?: boolean;
  onToggleAutoFit?: () => void;
  onExport: (scale: 1 | 2 | 4, customName?: string) => void;
  onCopyImage: () => void;
  onOpenExamples: () => void;
  onOpenPlatformGuide: () => void;
  onOpenCapabilities: () => void;
  onOpenAbout: () => void;
  appTheme: AppTheme;
  onAppThemeChange: (theme: AppTheme) => void;
  isExporting: boolean;
  copiedImage: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onShare: () => void;
  hasLocalImages: boolean;
  sharedCopied: boolean;
  onOpenAiPrompt?: () => void;
  documentMode: 'design' | 'slides';
  onDocumentModeChange: (mode: 'design' | 'slides') => void;
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
  onOpenCapabilities,
  onOpenAbout,
  appTheme,
  onAppThemeChange,
  isExporting,
  copiedImage,
  isSidebarOpen = true,
  onToggleSidebar,
  onShare,
  hasLocalImages,
  sharedCopied,
  onOpenAiPrompt,
  documentMode,
  onDocumentModeChange,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [customExportName, setCustomExportName] = useState('');
  const themeOptions: AppTheme[] = ['system', 'light', 'dark'];
  const cycleAppTheme = () => onAppThemeChange(themeOptions[(themeOptions.indexOf(appTheme) + 1) % themeOptions.length]);
  const AppThemeIcon = appTheme === 'light' ? Sun : appTheme === 'dark' ? Moon : Monitor;

  return (
    <header className="h-16 border-b border-white/10 bg-studio-900 px-3 sm:px-5 flex items-center justify-between z-40 select-none relative">
      {/* Brand Title & Sidebar Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`hidden md:flex p-2 rounded-lg border transition-colors ${
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

        <img src="./yuwbrndr-logo.svg" alt="" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-slate-100 tracking-tight text-base sm:text-lg whitespace-nowrap">Yuwbrndr</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium whitespace-nowrap shrink-0 hidden sm:inline">
              <span className="hidden xl:inline">Design by Code · Design to All</span>
              <span className="xl:hidden">Design by Code</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden md:block whitespace-nowrap">Developer Brand Illustration Platform</p>
        </div>

        <div className="hidden sm:flex items-center rounded-lg border border-white/10 bg-studio-950 p-1" aria-label="Document type">
          <button
            onClick={() => onDocumentModeChange('design')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors ${documentMode === 'design' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Single design
          </button>
          <button
            onClick={() => onDocumentModeChange('slides')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors ${documentMode === 'slides' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Slide deck
          </button>
        </div>
      </div>

      {/* Center Controls: Platform Selector & Zoom (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-2 bg-studio-950 p-1 rounded-lg border border-white/10">
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

      {/* Mobile Preset Trigger (< md) */}
      <div className="md:hidden relative">
        <button
          onClick={() => setShowPresetMenu(!showPresetMenu)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-studio-950 border border-white/10 text-xs text-slate-200 font-medium max-w-[140px] sm:max-w-[180px] truncate"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{currentPreset.aspectRatio}</span>
          <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
        </button>

        {showPresetMenu && (
          <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-72 rounded-2xl border border-white/15 bg-studio-900 shadow-2xl p-2 z-50 space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
              <span>Platform Format</span>
              <span className="text-indigo-400 font-bold">{currentPreset.aspectRatio}</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
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
                  <div className="truncate mr-2">
                    <div className="font-sans font-semibold text-slate-100 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.width} × {p.height} ({p.aspectRatio})</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                    {p.platform.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions: Responsive Desktop & Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* App Theme Toggle (Accessible on all screens) */}
        <button
          onClick={cycleAppTheme}
          className="p-2 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-slate-300 transition-colors"
          title={`Theme: ${appTheme}`}
          aria-label={`Theme: ${appTheme}`}
        >
          <AppThemeIcon className="w-4 h-4" />
        </button>

        {/* Desktop-only secondary links */}
        <button
          onClick={onOpenCapabilities}
          className="hidden xl:flex p-2 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-slate-300 transition-colors"
          title="Capabilities"
          aria-label="Capabilities"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAbout}
          className="hidden xl:flex p-2 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-slate-300 transition-colors"
          title="About Yuwbrndr"
          aria-label="About Yuwbrndr"
        >
          <Info className="w-4 h-4" />
        </button>

        <a
          href="https://github.com/TechAaroorian/yuwbrndr"
          target="_blank"
          rel="noreferrer"
          className="hidden xl:flex p-2 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-slate-300 hover:text-slate-100 transition-colors"
          title="GitHub"
          aria-label="GitHub"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.74-1.56-2.57-.3-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
          </svg>
        </a>

        {/* Theme Palette Dropdown (Desktop) */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <span 
              className="w-3 h-3 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: currentTheme.primary }} 
            />
            <span className="hidden md:inline">{currentTheme.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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

        {/* AI Prompt Generator Button (Desktop & Tablet) */}
        {onOpenAiPrompt && (
          <button
            onClick={onOpenAiPrompt}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:border-cyan-500/50 transition-all shadow-sm active:scale-95"
            title="Generate AI Prompt for Design Code (ChatGPT, Claude, Cursor)"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">AI Prompt</span>
          </button>
        )}

        {/* Share URL Button (Desktop & Tablet) */}
        {documentMode === 'design' && <button
          onClick={onShare}
          disabled={hasLocalImages}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            hasLocalImages
              ? 'border-white/5 bg-white/5 text-slate-500 cursor-not-allowed opacity-60'
              : sharedCopied
              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm'
              : 'border-white/10 bg-studio-850 hover:bg-studio-800 text-slate-200 hover:text-white'
          }`}
          title={
            hasLocalImages
              ? 'URL sharing is not available with uploaded images. Use web image URLs (https://...) instead.'
              : 'Share design via link (code encoded in URL hash)'
          }
        >
          {sharedCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Share2 className={`w-3.5 h-3.5 ${hasLocalImages ? 'text-slate-500' : 'text-cyan-400'}`} />
          )}
          <span className="hidden md:inline">{sharedCopied ? 'Link Copied!' : 'Share'}</span>
        </button>}

        {/* Copy Image Button (Desktop) */}
        <button
          onClick={onCopyImage}
          disabled={isExporting}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-studio-850 hover:bg-studio-800 text-xs font-semibold text-slate-200 transition-colors"
          title="Copy rendered PNG"
        >
          {copiedImage ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-300" />
          )}
          <span className="hidden md:inline">{copiedImage ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/15 bg-studio-900 shadow-2xl p-2 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
              {/* Optional Custom File Name */}
              <div className="px-1 pt-1 pb-1.5 border-b border-white/10 space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
                  <span>File Name</span>
                  <span className="text-[9px] text-slate-500 font-normal lowercase">optional</span>
                </label>
                <div className="flex items-center gap-1 bg-studio-950 rounded-lg border border-white/10 px-2.5 py-1.5 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                  <input
                    type="text"
                    value={customExportName}
                    onChange={(e) => setCustomExportName(e.target.value)}
                    placeholder={documentMode === 'slides' ? 'slide-name' : 'graphic-name'}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onExport(2, customExportName);
                        setShowExportMenu(false);
                      }
                    }}
                  />
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">.png</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 px-1 py-1 font-bold">
                  Select Resolution
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onExport(1, customExportName);
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
                      onExport(2, customExportName);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors bg-indigo-600/10 border border-indigo-500/20"
                  >
                    <div>
                      <div className="font-semibold text-indigo-300">Recommended (2x)</div>
                      <div className="text-[10px] text-indigo-400/80 font-mono">{currentPreset.width * 2}×{currentPreset.height * 2}</div>
                    </div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold">2x</span>
                  </button>
                  <button
                    onClick={() => {
                      onExport(4, customExportName);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-cyan-300">Ultra Print (4x)</div>
                      <div className="text-[10px] text-cyan-500 font-mono">{currentPreset.width * 4}×{currentPreset.height * 4}</div>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">4x</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile More Options Dropdown Button (< lg) */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg border border-white/10 bg-studio-850 text-slate-300 hover:text-white hover:bg-studio-800 transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-studio-900 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 font-bold border-b border-white/10">
                Menu & Settings
              </div>

              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-studio-950 border border-white/10">
                <button onClick={() => { onDocumentModeChange('design'); setShowMobileMenu(false); }} className={`px-2 py-2 rounded-md text-xs font-semibold ${documentMode === 'design' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Design</button>
                <button onClick={() => { onDocumentModeChange('slides'); setShowMobileMenu(false); }} className={`px-2 py-2 rounded-md text-xs font-semibold ${documentMode === 'slides' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Slides</button>
              </div>

              {/* Copy Image Button on Mobile */}
              <button
                onClick={() => {
                  onCopyImage();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <Copy className="w-4 h-4 text-indigo-400" />
                <span>{copiedImage ? 'PNG Copied!' : 'Copy PNG to Clipboard'}</span>
              </button>

              {/* Share Design Link on Mobile */}
              {documentMode === 'design' && <button
                onClick={() => {
                  if (!hasLocalImages) {
                    onShare();
                    setShowMobileMenu(false);
                  }
                }}
                disabled={hasLocalImages}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                  hasLocalImages
                    ? 'text-slate-500 cursor-not-allowed opacity-60'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
                title={
                  hasLocalImages
                    ? 'URL sharing is not available with uploaded images'
                    : 'Share design via URL link'
                }
              >
                {sharedCopied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className={`w-4 h-4 ${hasLocalImages ? 'text-slate-500' : 'text-cyan-400'}`} />
                )}
                <div className="text-left">
                  <div className={sharedCopied ? 'text-emerald-300 font-semibold' : ''}>
                    {sharedCopied ? 'Link Copied!' : 'Share Design Link'}
                  </div>
                  {hasLocalImages && (
                    <div className="text-[10px] text-amber-400/80">
                      Not available with uploaded images
                    </div>
                  )}
                </div>
              </button>}

              {/* AI Prompt Generator */}
              {onOpenAiPrompt && (
                <button
                  onClick={() => {
                    onOpenAiPrompt();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Prompt Generator</span>
                </button>
              )}

              {/* Templates Gallery */}
              <button
                onClick={() => {
                  onOpenExamples();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Browse Templates</span>
              </button>

              {/* Theme Palette */}
              <div className="pt-1 border-t border-white/10">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold">Canvas Palette</div>
                <div className="grid grid-cols-5 gap-1 px-1 py-1">
                  {Object.values(COLOR_THEMES).map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        onSelectTheme(th);
                        setShowMobileMenu(false);
                      }}
                      className={`h-7 rounded-md border flex items-center justify-center transition-transform active:scale-95 ${
                        th.id === currentTheme.id ? 'border-white ring-1 ring-white/50 scale-105' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: th.primary }}
                      title={th.name}
                    />
                  ))}
                </div>
              </div>

              {/* Platform Resolution Guide */}
              <button
                onClick={() => {
                  onOpenPlatformGuide();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Resolution Guide</span>
              </button>

              {/* Capabilities */}
              <button
                onClick={() => {
                  onOpenCapabilities();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Design Capabilities</span>
              </button>

              {/* About */}
              <button
                onClick={() => {
                  onOpenAbout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>About & Responsibility</span>
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/TechAaroorian/yuwbrndr"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5"
              >
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.74-1.56-2.57-.3-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
                </svg>
                <span>View on GitHub</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
