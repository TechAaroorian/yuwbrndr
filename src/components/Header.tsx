import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ChevronDown,
  MoreHorizontal,
  Info,
  BookOpen,
  Share2,
  Sparkles,
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
} from 'lucide-react';
import { ASPECT_PRESETS, type AspectPreset, type AppTheme } from '../types/studio';
import { AarSelect } from './AarSelect';

interface Props {
  documentMode: 'design' | 'slides';
  onDocumentModeChange: (mode: 'design' | 'slides') => void;
  currentPreset: AspectPreset;
  onSelectPreset: (preset: AspectPreset) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  autoFit: boolean;
  onToggleAutoFit: () => void;
  fontScale: number;
  onFontScaleChange: (newScale: number) => void;
  appTheme: AppTheme;
  onAppThemeChange: (theme: AppTheme) => void;
  onExport: (scale: 1 | 2 | 4, name?: string) => void;
  isExporting: boolean;
  hasDesign: boolean;
  onCopyImage: () => void;
  copiedImage: boolean;
  onShare: () => void;
  sharedCopied: boolean;
  hasLocalImages: boolean;
  onOpenAiPrompt: () => void;
  onOpenAbout: () => void;
  onOpenCapabilities: () => void;
  onOpenPlatformGuide: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
}

export function Header({
  documentMode,
  onDocumentModeChange,
  currentPreset,
  onSelectPreset,
  zoom,
  onZoomChange,
  autoFit,
  onToggleAutoFit,
  fontScale,
  onFontScaleChange,
  appTheme,
  onAppThemeChange,
  onExport,
  isExporting,
  hasDesign,
  onCopyImage,
  copiedImage,
  onShare,
  sharedCopied,
  hasLocalImages,
  onOpenAiPrompt,
  onOpenAbout,
  onOpenCapabilities,
  onOpenPlatformGuide,
  isSidebarOpen,
  onToggleSidebar,
  isEditorOpen,
  onToggleEditor,
}: Props) {
  const [exportName, setExportName] = useState('');
  const actionsRef = useRef<HTMLDetailsElement>(null);
  const exportRef = useRef<HTMLDetailsElement>(null);
  const presetRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      for (const ref of [actionsRef, exportRef, presetRef]) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          ref.current.open = false;
        }
      }
    };
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, []);

  const closeAndRun = (action: () => void) => {
    if (actionsRef.current) actionsRef.current.open = false;
    action();
  };

  const dismiss = (event: React.KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.open = false;
      event.currentTarget.querySelector('summary')?.focus();
    }
  };

  return (
    <header className="aar-app-header aar-studio-header">
      {/* 1. Brand Identity, Tagline Badge, and Mode Switcher */}
      <div className="aar-cluster" data-gap="2">
        <button
          className="aar-icon-button"
          data-variant="quiet"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Hide tools sidebar' : 'Show tools sidebar'}
          title="Toggle Tools Sidebar (Ctrl+B)"
          data-size="sm"
        >
          {isSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>

        <img src="./yuwbrndr-logo.svg" alt="Yuwbrndr" width="18" height="18" />
        <div>
          <div className="aar-cluster" data-gap="2">
            <strong>Yuwbrndr</strong>
            <span className="aar-badge">Design by Code · Design to All</span>
          </div>
        </div>

        <div className="aar-segmented" role="group" aria-label="Document type">
          <button
            type="button"
            aria-pressed={documentMode === 'design'}
            onClick={() => onDocumentModeChange('design')}
            data-size="sm"
          >
            Graphic
          </button>
          <button
            type="button"
            aria-pressed={documentMode === 'slides'}
            onClick={() => onDocumentModeChange('slides')}
            data-size="sm"
          >
            Slides
          </button>
        </div>
      </div>

      {/* 2. Center Informative Platform Preset Picker & Zoom Bar */}
      <div className="aar-cluster" data-gap="2">
        {/* Platform Preset Dropdown */}
        <details className="aar-menu" ref={presetRef} onKeyDown={dismiss}>
          <summary className="aar-button" data-size="sm" aria-label="Platform format">
            <Share2 size={13} className="aar-u-text-primary" />
            <span>{currentPreset.platform}: {currentPreset.aspectRatio}</span>
            <span className="aar-badge">{currentPreset.width}×{currentPreset.height}</span>
            <ChevronDown size={13} />
          </summary>
          <div className="aar-menu-dropdown aar-preset-menu-dropdown">
            <div className="aar-cluster aar-p-2" data-gap="2">
              <span className="aar-label">Platform Formats</span>
              <span className="aar-badge" data-tone="success">2026 Optimal</span>
            </div>
            {ASPECT_PRESETS.map((p) => (
              <button
                key={p.id}
                className="aar-menu-item"
                data-selected={p.id === currentPreset.id}
                onClick={() => {
                  onSelectPreset(p);
                  if (presetRef.current) presetRef.current.open = false;
                }}
                data-size="sm"
              >
                <div className="aar-u-flex-1 aar-u-min-w-0">
                  <div className="aar-u-font-semibold">{p.name}</div>
                  <div className="aar-text-muted aar-u-text-xs">{p.width} × {p.height} ({p.aspectRatio})</div>
                </div>
                <span className="aar-badge">{p.platform.split(' ')[0]}</span>
              </button>
            ))}
            <div className="aar-menu-divider" />
            <button
              className="aar-menu-item"
              onClick={() => {
                if (presetRef.current) presetRef.current.open = false;
                onOpenPlatformGuide();
              }}
              data-size="sm"
            >
              <HelpCircle size={14} />
              <span>Platform Resolution Guide</span>
            </button>
          </div>
        </details>

        {/* Zoom Controls */}
        <div className="aar-button-group" data-size="sm" role="group" aria-label="Canvas zoom">
          <button
            className="aar-button"
            data-variant="quiet"
            aria-pressed={autoFit}
            onClick={onToggleAutoFit}
            title="Auto-Fit Canvas to Viewport"
            data-size="sm"
          >
            Fit
          </button>
          <button
            className="aar-icon-button"
            data-variant="quiet"
            aria-label="Zoom out"
            onClick={() => onZoomChange(Math.max(0.2, Math.round((zoom - 0.05) * 100) / 100))}
            data-size="sm"
          >
            −
          </button>
          <span className="aar-button-group-value">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="aar-icon-button"
            data-variant="quiet"
            aria-label="Zoom in"
            onClick={() => onZoomChange(Math.min(2.0, Math.round((zoom + 0.05) * 100) / 100))}
            data-size="sm"
          >
            +
          </button>
        </div>

        {/* Font Scale Controls */}
        <div className="aar-button-group" data-size="sm" role="group" aria-label="Font scale">
          <button
            className="aar-icon-button"
            data-variant="quiet"
            title="Decrease Font Size"
            onClick={() => onFontScaleChange(Math.max(0.6, Math.round((fontScale - 0.05) * 100) / 100))}
            data-size="sm"
          >
            A−
          </button>
          <span className="aar-button-group-value">
            {Math.round(fontScale * 100)}%
          </span>
          <button
            className="aar-icon-button"
            data-variant="quiet"
            title="Increase Font Size"
            onClick={() => onFontScaleChange(Math.min(2.0, Math.round((fontScale + 0.05) * 100) / 100))}
            data-size="sm"
          >
            A+
          </button>
        </div>
      </div>

      {/* 3. Action Commands & Export (Right) */}
      <div className="aar-app-header-actions">
        {/* AI Prompt Generator */}
        <button
          className="aar-button"
          data-variant="ai"
          onClick={onOpenAiPrompt}
          title="Generate AI Prompt for Design Code"
          data-size="sm"
        >
          <Sparkles size={13} />
          <span>AI Prompt</span>
        </button>

        {/* Share Link */}
        {documentMode === 'design' && (
          <button
            className="aar-button"
            data-variant="quiet"
            disabled={hasLocalImages || !hasDesign}
            title={hasLocalImages ? 'Uploaded images cannot be included in a share URL.' : 'Share design via link'}
            onClick={onShare}
            data-size="sm"
          >
            {sharedCopied ? <Check size={13} className="aar-text-muted" /> : <Share2 size={13} />}
            <span>{sharedCopied ? 'Link copied' : 'Share'}</span>
          </button>
        )}

        {/* Copy PNG */}
        <button
          className="aar-button"
          data-variant="quiet"
          onClick={onCopyImage}
          disabled={isExporting || !hasDesign}
          title="Copy rendered PNG to clipboard"
          data-size="sm"
        >
          {copiedImage ? <Check size={13} className="aar-text-muted" /> : <Copy size={13} />}
          <span>{copiedImage ? 'Image copied' : 'Copy'}</span>
        </button>

        {/* Code Editor Toggle */}
        <button
          className="aar-button"
          data-variant="quiet"
          aria-pressed={isEditorOpen}
          onClick={onToggleEditor}
          title="Toggle Code Editor"
          data-size="sm"
        >
          <Code2 size={13} />
          <span>Code</span>
        </button>

        {/* Export Dropdown */}
        <details className="aar-menu" ref={exportRef} onKeyDown={dismiss}>
          <summary className="aar-button" data-variant="primary" aria-label="Export options" data-size="sm">
            <Download size={14} />
            <span>{isExporting ? 'Exporting…' : 'Export'}</span>
            <ChevronDown size={13} />
          </summary>
          <div className="aar-menu-dropdown" data-align="end">
            <div className="aar-u-p-2 aar-stack" data-gap="1.5">
              <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                <span className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-font-bold aar-u-text-text-muted">File Name</span>
                <span className="aar-u-text-xs aar-u-font-mono aar-u-text-text-muted">.png</span>
              </div>
              <input
                className="aar-input aar-u-w-full"
                value={exportName}
                onChange={(event) => setExportName(event.target.value)}
                placeholder="my-design"
                data-size="sm"
              />
            </div>

            <div className="aar-menu-divider" />

            <div className="aar-u-px-2 aar-u-py-1 aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-font-bold aar-u-text-text-muted">
              Resolution & Scale
            </div>

            {([
              { scale: 1, label: 'Standard PNG', note: 'Web & Preview', badge: '1×' },
              { scale: 2, label: 'Retina High-DPI', note: 'Optimal for Social', badge: '2×' },
              { scale: 4, label: 'Ultra-HD Crisp', note: 'Print & 4K Quality', badge: '4×' },
            ] as const).map(({ scale, label, note, badge }) => (
              <button
                key={scale}
                className="aar-menu-item aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-3"
                disabled={isExporting || !hasDesign}
                onClick={() => {
                  if (exportRef.current) exportRef.current.open = false;
                  onExport(scale, exportName);
                }}
                data-size="sm"
              >
                <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-min-w-0">
                  <span className="aar-badge aar-u-font-mono aar-u-font-bold aar-u-shrink-0" data-tone={scale === 2 ? 'success' : undefined}>
                    {badge}
                  </span>
                  <div className="aar-u-min-w-0">
                    <div className="aar-u-font-semibold aar-u-text-text aar-u-truncate">{label}</div>
                    <div className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono aar-u-truncate">
                      {currentPreset.width * scale} × {currentPreset.height * scale} px · {note}
                    </div>
                  </div>
                </div>
                <Download size={13} className="aar-u-text-text-muted aar-u-shrink-0" />
              </button>
            ))}
          </div>
        </details>

        {/* Settings & Info Dropdown */}
        <details className="aar-menu" data-menu="studio" ref={actionsRef} onKeyDown={dismiss}>
          <summary className="aar-icon-button" data-variant="quiet" aria-label="Studio settings" data-size="sm">
            <MoreHorizontal size={14} />
          </summary>
          <div className="aar-menu-dropdown" data-align="end">
            <div className="aar-p-2">
              <AarSelect
                label="Appearance"
                compact
                value={appTheme}
                onChange={(value) => onAppThemeChange(value as AppTheme)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
              />
            </div>
            <div className="aar-menu-divider" />
            <button className="aar-menu-item" onClick={() => closeAndRun(onOpenPlatformGuide)} data-size="sm">
              <HelpCircle size={14} />
              <span>Resolution guide</span>
            </button>
            <button className="aar-menu-item" onClick={() => closeAndRun(onOpenCapabilities)} data-size="sm">
              <BookOpen size={14} />
              <span>Capabilities</span>
            </button>
            <button className="aar-menu-item" onClick={() => closeAndRun(onOpenAbout)} data-size="sm">
              <Info size={14} />
              <span>About Yuwbrndr</span>
            </button>
            <a className="aar-menu-item" href="https://github.com/TechAaroorian/yuwbrndr" target="_blank" rel="noreferrer">
              Source on GitHub
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
