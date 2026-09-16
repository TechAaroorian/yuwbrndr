import React, { useState, useRef, useEffect } from 'react';
import { 
  AspectPreset, 
  ASPECT_PRESETS, 
  COLOR_THEMES, 
  ColorTheme,
  AppTheme,
  UploadedAsset
} from './types/studio';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasViewport } from './components/CanvasViewport';
import { CustomCodeCanvas } from './components/templates/custom/CustomCodeCanvas';
import { CodeInspector } from './components/CodeInspector';
import { PlatformResolutionGuide } from './components/PlatformResolutionGuide';
import { ExamplesModal } from './components/ExamplesModal';
import { FontsModal } from './components/FontsModal';
import { StickersModal } from './components/StickersModal';
import { CapabilitiesModal } from './components/CapabilitiesModal';
import { AboutModal } from './components/AboutModal';
import { FullCodeEditor, EditorDockMode } from './components/FullCodeEditor';
import { exportElementAsPng, copyElementToClipboard } from './utils/exportImage';
import { CODE_PRESETS, CodePreset } from './utils/codePresets';
import { Code2, ChevronLeft, ChevronRight } from 'lucide-react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB max per file
const MAX_ASSETS_COUNT = 5; // Max 5 uploaded assets in RAM

export function App() {
  const [customCodeType, setCustomCodeType] = useState<'html' | 'canvas'>('html');
  const [customCode, setCustomCode] = useState<string>(''); // Clean empty canvas on initial load!
  const [dockMode, setDockMode] = useState<EditorDockMode>('sidebar');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Left-side panel collapse/expand
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true); // Right-side editor active by default
  const [isEditorWide, setIsEditorWide] = useState<boolean>(false);
  const [autoFit, setAutoFit] = useState<boolean>(true); // Auto-arrange & fit canvas size by default
  const [currentPreset, setCurrentPreset] = useState<AspectPreset>(ASPECT_PRESETS[0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(COLOR_THEMES.midnight);
  const [zoom, setZoom] = useState<number>(0.55);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState<boolean>(false);
  const [isFontsOpen, setIsFontsOpen] = useState<boolean>(false);
  const [isStickersOpen, setIsStickersOpen] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [useAsBackground, setUseAsBackground] = useState<boolean>(false);
  const [isPlatformGuideOpen, setIsPlatformGuideOpen] = useState<boolean>(false);
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('yuwbrndr-theme');
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const hasShownUsageNotice = useRef(false);

  // Global keyboard shortcut for toggling sidebar: Ctrl+B or Cmd+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolved = appTheme === 'system' ? (media.matches ? 'dark' : 'light') : appTheme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      localStorage.setItem('yuwbrndr-theme', appTheme);
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [appTheme]);

  useEffect(() => {
    const hasStartedCreating = customCode.trim().length > 0 || uploadedAssets.length > 0;
    if (!hasStartedCreating || hasShownUsageNotice.current) return;

    hasShownUsageNotice.current = true;
    setIsAboutOpen(true);
  }, [customCode, uploadedAssets.length]);

  // When preset changes, re-enable autoFit
  const handleSelectPresetFormat = (preset: AspectPreset) => {
    setCurrentPreset(preset);
    setAutoFit(true);
  };

  // Manual zoom changes
  const handleManualZoom = (newZ: number) => {
    setAutoFit(false);
    setZoom(newZ);
  };

  // Toggle Left Sidebar
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle Uploading Files with validation: max 2MB per file, max 5 total assets
  const handleAddAssets = (files: FileList | File[]) => {
    setUploadError(null);
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    if (uploadedAssets.length + fileList.length > MAX_ASSETS_COUNT) {
      setUploadError(
        `Quota reached: Maximum ${MAX_ASSETS_COUNT} assets allowed. You have ${uploadedAssets.length} asset(s), cannot add ${fileList.length} more.`
      );
      return;
    }

    const validNewAssets: UploadedAsset[] = [];
    for (const file of fileList) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(
          `"${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 2 MB limit.`
        );
        return;
      }
      const url = URL.createObjectURL(file);
      validNewAssets.push({
        id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        url,
        size: file.size,
        createdAt: Date.now(),
      });
    }

    setUploadedAssets((prev) => {
      const updated = [...prev, ...validNewAssets];
      if (!userImage && validNewAssets.length > 0) {
        setUserImage(validNewAssets[0].url);
        setUseAsBackground(true);
      }
      return updated;
    });
  };

  // Remove asset and revoke its blob URL to immediately free RAM
  const handleRemoveAsset = (id: string) => {
    setUploadError(null);
    setUploadedAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        if (userImage === target.url) {
          const remaining = prev.filter((a) => a.id !== id);
          if (remaining.length > 0) {
            setUserImage(remaining[0].url);
          } else {
            setUserImage(null);
            setUseAsBackground(false);
          }
        }
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  // Insert uploaded image directly into code editor
  const handleInsertImageToCode = (imageUrl: string) => {
    if (customCodeType === 'html') {
      const imgSnippet = `\n  <div class="flex justify-center my-4">\n    <img src="${imageUrl}" alt="Custom asset" class="max-h-64 rounded-2xl shadow-2xl border border-white/10 object-contain" />\n  </div>`;
      setCustomCode((prev) => {
        if (!prev || prev.trim() === '') {
          return `<div class="w-full h-full p-8 bg-[#090a10] text-white flex flex-col items-center justify-center">${imgSnippet}\n</div>`;
        }
        return prev + imgSnippet;
      });
    } else {
      const canvasSnippet = `\n// Draw custom uploaded image\nconst img = new Image();\nimg.onload = () => {\n  ctx.drawImage(img, (width - 400) / 2, (height - 300) / 2, 400, 300);\n};\nimg.src = "${imageUrl}";\n`;
      setCustomCode((prev) => prev + canvasSnippet);
    }
  };

  // Load starter sample
  const handleLoadSample = (type: 'html' | 'canvas') => {
    if (type === 'html') {
      setCustomCodeType('html');
      setCustomCode(CODE_PRESETS[0].code); // Promise.all vs allSettled
    } else {
      setCustomCodeType('canvas');
      setCustomCode(CODE_PRESETS[3].code); // 3D Isometric Tech Cube Canvas
    }
    setIsEditorOpen(true);
    setAutoFit(true);
  };

  // Load selected preset from Examples Gallery
  const handleSelectPreset = (preset: CodePreset) => {
    setCustomCodeType(preset.type);
    setCustomCode(preset.code);
    setIsEditorOpen(true);
    setAutoFit(true);
  };

  // Export Image Handler
  const handleExport = async (scale: 1 | 2 | 4) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      await exportElementAsPng(canvasRef.current, {
        scale,
        fileName: `yuwbrndr-${scale}x.png`,
      });
      setExportNotice(`PNG exported at ${currentPreset.width * scale} × ${currentPreset.height * scale}px`);
      setTimeout(() => setExportNotice(null), 3000);
    } catch (err) {
      alert('Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCode = () => {
    if (!customCode.trim() || window.confirm('Clear the current canvas code? This cannot be undone.')) {
      setCustomCode('');
    }
  };

  // Copy PNG to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const success = await copyElementToClipboard(canvasRef.current, 2);
    setIsExporting(false);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } else {
      alert('Unable to copy directly to clipboard in this browser. Try the Export button.');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-950 text-slate-100">
      {/* Top Navigation Bar */}
      <Header
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPresetFormat}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        zoom={zoom}
        onZoomChange={handleManualZoom}
        autoFit={autoFit}
        onToggleAutoFit={() => setAutoFit((prev) => !prev)}
        onExport={handleExport}
        onCopyImage={handleCopyImage}
        onOpenExamples={() => setIsExamplesOpen(true)}
        onOpenPlatformGuide={() => setIsPlatformGuideOpen(true)}
        onOpenCapabilities={() => setIsCapabilitiesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        appTheme={appTheme}
        onAppThemeChange={setAppTheme}
        isExporting={isExporting}
        copiedImage={copiedImage}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Workspace Body: [Left Tools & Presets] | [Center Live Canvas] | [Right Code Editor] */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 1. LEFT TOOLS & ASSETS PANEL (COLLAPSIBLE) */}
        <Sidebar
          customCodeType={customCodeType}
          onLoadSample={handleLoadSample}
          onOpenExamples={() => setIsExamplesOpen(true)}
          onOpenFonts={() => setIsFontsOpen(true)}
          onOpenStickers={() => setIsStickersOpen(true)}
          onClearCode={handleClearCode}
          userImage={userImage}
          setUserImage={setUserImage}
          useAsBackground={useAsBackground}
          setUseAsBackground={setUseAsBackground}
          onInsertImageToCode={handleInsertImageToCode}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          uploadedAssets={uploadedAssets}
          onAddAssets={handleAddAssets}
          onRemoveAsset={handleRemoveAsset}
          uploadError={uploadError}
          onClearUploadError={() => setUploadError(null)}
        />

        {/* 2. CENTER CANVAS VIEWPORT */}
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden min-w-0">
          <CanvasViewport
            currentPreset={currentPreset}
            currentTheme={currentTheme}
            zoom={zoom}
            onZoomChange={setZoom}
            autoFit={autoFit}
            onToggleAutoFit={() => setAutoFit((prev) => !prev)}
            canvasRef={canvasRef}
            customCodeType={customCodeType}
            customCode={customCode}
            userImage={userImage}
            useAsBackground={useAsBackground}
            onLoadSample={handleLoadSample}
            onOpenPlatformGuide={() => setIsPlatformGuideOpen(true)}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* Bottom Drawer (optional layout switch) */}
          {dockMode === 'bottom' && (
            <div className="h-[360px] w-full p-3 border-t border-white/10 bg-studio-950 flex flex-col shrink-0 z-20 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <FullCodeEditor
                codeType={customCodeType}
                setCodeType={setCustomCodeType}
                code={customCode}
                onChange={setCustomCode}
                onClear={handleClearCode}
                onLoadSample={handleLoadSample}
                dockMode={dockMode}
                onDockModeChange={setDockMode}
                userImage={userImage}
                uploadedAssets={uploadedAssets}
                onInsertImage={handleInsertImageToCode}
              />
            </div>
          )}
        </div>

        {/* 3. RIGHT SIDE CODE EDITOR (SYNTAX HIGHLIGHTING & LINTING) */}
        {dockMode !== 'bottom' && (
          isEditorOpen ? (
            <div
              className={`h-[calc(100vh-4rem)] bg-studio-900 shrink-0 flex flex-col z-20 shadow-2xl transition-all duration-200 ease-out border-l border-white/10 ${
                isEditorWide ? 'w-[680px] xl:w-[740px]' : 'w-[500px] xl:w-[580px]'
              }`}
            >
              <FullCodeEditor
                codeType={customCodeType}
                setCodeType={setCustomCodeType}
                code={customCode}
                onChange={setCustomCode}
                onClear={handleClearCode}
                onLoadSample={handleLoadSample}
                dockMode={dockMode}
                onDockModeChange={setDockMode}
                userImage={userImage}
                uploadedAssets={uploadedAssets}
                onInsertImage={handleInsertImageToCode}
                isWide={isEditorWide}
                onToggleWide={() => setIsEditorWide(!isEditorWide)}
                onToggleCollapse={() => setIsEditorOpen(false)}
              />
            </div>
          ) : (
            /* Collapsed side tab when editor is hidden */
            <button
              onClick={() => setIsEditorOpen(true)}
              className="h-[calc(100vh-4rem)] w-10 bg-studio-900/90 border-l border-white/10 hover:bg-studio-800 transition-colors flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white cursor-pointer py-4 shadow-lg shrink-0"
              title="Expand Right Code Editor"
            >
              <ChevronLeft className="w-4 h-4 text-indigo-400" />
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider uppercase rotate-90 whitespace-nowrap text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-indigo-400 -rotate-90 inline-block" />
                <span>Code Editor</span>
              </div>
            </button>
          )
        )}
      </div>

      {/* Fullscreen IDE Studio Modal with Side Preview (optional) */}
      {dockMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 bg-studio-950 flex flex-col animate-in fade-in duration-200">
          <div className="h-14 px-6 border-b border-white/10 bg-studio-900 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-white tracking-tight">YuwBrndr Fullscreen Code Studio</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {currentPreset.name} ({currentPreset.width}×{currentPreset.height})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDockMode('sidebar')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition-all"
              >
                Close Fullscreen
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden p-4 gap-4">
            <div className="flex-1 h-full min-w-0">
              <FullCodeEditor
                codeType={customCodeType}
                setCodeType={setCustomCodeType}
                code={customCode}
                onChange={setCustomCode}
                onClear={handleClearCode}
                onLoadSample={handleLoadSample}
                dockMode={dockMode}
                onDockModeChange={setDockMode}
                userImage={userImage}
                uploadedAssets={uploadedAssets}
                onInsertImage={handleInsertImageToCode}
              />
            </div>

            <div className="w-[45%] h-full rounded-2xl border border-white/10 bg-studio-900 flex flex-col items-center justify-center p-6 overflow-hidden relative shadow-2xl">
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold mb-3">
                Live Output Preview
              </div>
              <div
                className="origin-center shadow-2xl rounded-2xl overflow-hidden border border-white/15"
                style={{
                  transform: `scale(${Math.min(0.55, zoom)})`,
                  width: `${currentPreset.width}px`,
                  height: `${currentPreset.height}px`,
                }}
              >
                <div
                  ref={canvasRef}
                  className="w-full h-full relative"
                  style={{ width: `${currentPreset.width}px`, height: `${currentPreset.height}px` }}
                >
                  <CustomCodeCanvas
                    codeType={customCodeType}
                    code={customCode}
                    theme={currentTheme}
                    width={currentPreset.width}
                    height={currentPreset.height}
                    userImage={userImage}
                    useAsBackground={useAsBackground}
                    onPasteSample={handleLoadSample}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples & Templates Gallery Modal */}
      <ExamplesModal
        isOpen={isExamplesOpen}
        onClose={() => setIsExamplesOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* 10 Curated Open-Source Fonts Catalog Modal */}
      <FontsModal
        isOpen={isFontsOpen}
        onClose={() => setIsFontsOpen(false)}
        onInsertSnippet={(snippet) => setCustomCode((prev) => prev ? `${prev}\n\n${snippet}` : snippet)}
      />

      {/* Vectors, Lucide Icons & Meme Stickers Modal */}
      <StickersModal
        isOpen={isStickersOpen}
        onClose={() => setIsStickersOpen(false)}
        onInsertSnippet={(snippet) => setCustomCode((prev) => prev ? `${prev}\n\n${snippet}` : snippet)}
      />

      {/* Developer Code Inspector Modal */}
      <CodeInspector
        isOpen={isCodeOpen}
        onClose={() => setIsCodeOpen(false)}
        customCode={customCode}
        customCodeType={customCodeType}
      />

      {/* Platform Resolution & Compression Guide Modal */}
      <PlatformResolutionGuide
        isOpen={isPlatformGuideOpen}
        onClose={() => setIsPlatformGuideOpen(false)}
        currentPreset={currentPreset}
        onSelectPreset={setCurrentPreset}
      />

      <CapabilitiesModal isOpen={isCapabilitiesOpen} onClose={() => setIsCapabilitiesOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {exportNotice && (
        <div role="status" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] rounded-lg border border-emerald-500/30 bg-studio-850 px-4 py-2.5 text-sm font-medium text-emerald-300 shadow-xl">
          {exportNotice}
        </div>
      )}
    </div>
  );
}

export default App;
