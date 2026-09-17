import React, { useState, useRef, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
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
import { MAX_SLIDES, SlideStrip, StudioSlide } from './components/SlideStrip';
import { exportElementAsPng, copyElementToClipboard, renderElementAsPngBlob } from './utils/exportImage';
import { CODE_PRESETS, CodePreset } from './utils/codePresets';
import {
  decodeShareUrl,
  encodeShareUrl,
  hasLocalUploadedImages,
  MAX_SHARE_URL_LENGTH,
  ShareUrlError,
} from './utils/shareUrl';
import { Code2, ChevronLeft, Eye, Sparkles, Download } from 'lucide-react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB max per file

async function copyShareUrl(url: string): Promise<void> {
  let clipboardError: unknown;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) {
    throw clipboardError instanceof Error
      ? clipboardError
      : new Error('Clipboard access is unavailable.');
  }
}
const MAX_ASSETS_COUNT = 5; // Max 5 uploaded assets in RAM

export function App() {
  const [documentMode, setDocumentMode] = useState<'design' | 'slides'>('design');
  const [customCodeType, setCustomCodeType] = useState<'html' | 'canvas'>('html');
  const [customCode, setCustomCode] = useState<string>(''); // Clean empty canvas on initial load!
  const [dockMode, setDockMode] = useState<EditorDockMode>('sidebar');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  }); // Left-side panel collapse/expand
  const [mobileTab, setMobileTab] = useState<'canvas' | 'code'>('canvas');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true); // Right-side editor active by default
  const [isEditorWide, setIsEditorWide] = useState<boolean>(false);
  const [autoFit, setAutoFit] = useState<boolean>(true); // Auto-arrange & fit canvas size by default
  const [currentPreset, setCurrentPreset] = useState<AspectPreset>(ASPECT_PRESETS[0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(COLOR_THEMES.midnight);
  const [zoom, setZoom] = useState<number>(0.55);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
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
  const [slides, setSlides] = useState<StudioSlide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState('');

  const canvasRef = useRef<HTMLDivElement>(null);
  const hasShownUsageNotice = useRef(false);
  const designDraftRef = useRef<{ code: string; codeType: 'html' | 'canvas' }>({
    code: '',
    codeType: 'html',
  });

  const handleCodeChange = (code: string) => {
    setCustomCode(code);
    if (documentMode === 'design') {
      designDraftRef.current.code = code;
    }
    if (documentMode === 'slides' && activeSlideId) {
      setSlides((current) => current.map((slide) =>
        slide.id === activeSlideId ? { ...slide, code } : slide
      ));
    }
  };

  const handleCodeTypeChange = (codeType: 'html' | 'canvas') => {
    setCustomCodeType(codeType);
    if (documentMode === 'design') {
      designDraftRef.current.codeType = codeType;
    }
    if (documentMode === 'slides' && activeSlideId) {
      setSlides((current) => current.map((slide) =>
        slide.id === activeSlideId ? { ...slide, codeType } : slide
      ));
    }
  };

  const handleDocumentModeChange = (mode: 'design' | 'slides') => {
    if (mode === 'slides') {
      designDraftRef.current = { code: customCode, codeType: customCodeType };
      if (slides.length === 0) {
        const firstSlide: StudioSlide = {
          id: crypto.randomUUID(),
          name: 'Cover',
          codeType: customCodeType,
          code: customCode,
        };
        setSlides([firstSlide]);
        setActiveSlideId(firstSlide.id);
      } else {
        const active = slides.find((slide) => slide.id === activeSlideId) ?? slides[0];
        setActiveSlideId(active.id);
        setCustomCodeType(active.codeType);
        setCustomCode(active.code);
      }
    } else {
      setCustomCodeType(designDraftRef.current.codeType);
      setCustomCode(designDraftRef.current.code);
    }
    setDocumentMode(mode);
    setAutoFit(true);
  };

  const handleSelectSlide = (id: string) => {
    const slide = slides.find((item) => item.id === id);
    if (!slide) return;
    setActiveSlideId(id);
    setCustomCodeType(slide.codeType);
    setCustomCode(slide.code);
    setAutoFit(true);
  };

  const handleAddSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    const slide: StudioSlide = {
      id: crypto.randomUUID(),
      name: `Slide ${slides.length + 1}`,
      codeType: customCodeType,
      code: '',
    };
    setSlides((current) => [...current, slide]);
    setActiveSlideId(slide.id);
    setCustomCode('');
    setAutoFit(true);
  };

  const handleDuplicateSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    const activeIndex = slides.findIndex((slide) => slide.id === activeSlideId);
    if (activeIndex < 0) return;
    const source = slides[activeIndex];
    const duplicate: StudioSlide = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} copy`,
    };
    const next = [...slides];
    next.splice(activeIndex + 1, 0, duplicate);
    setSlides(next);
    setActiveSlideId(duplicate.id);
    setCustomCodeType(duplicate.codeType);
    setCustomCode(duplicate.code);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) return;
    const activeIndex = slides.findIndex((slide) => slide.id === activeSlideId);
    const next = slides.filter((slide) => slide.id !== activeSlideId);
    const replacement = next[Math.min(activeIndex, next.length - 1)];
    setSlides(next);
    setActiveSlideId(replacement.id);
    setCustomCodeType(replacement.codeType);
    setCustomCode(replacement.code);
  };

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

  const hasLocalImages = useMemo(() => {
    return hasLocalUploadedImages(uploadedAssets, userImage, customCode);
  }, [uploadedAssets, userImage, customCode]);

  // Restore designs from URL hashes without persisting shared content locally.
  useEffect(() => {
    let active = true;
    let noticeTimer: number | undefined;

    const restoreFromHash = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      if (!params.has('share')) return;

      try {
        const restored = await decodeShareUrl(hash);
        if (!active) return;
        setCustomCodeType(restored.t);
        setCustomCode(restored.c);
        const matchedPreset = ASPECT_PRESETS.find((p) => p.id === restored.p);
        if (matchedPreset) {
          setCurrentPreset(matchedPreset);
        }
        const matchedTheme = Object.values(COLOR_THEMES).find((th) => th.id === restored.th);
        if (matchedTheme) {
          setCurrentTheme(matchedTheme);
        }
        setIsEditorOpen(true);
        setAutoFit(true);
        setExportNotice('Shared design loaded from link!');
      } catch (error) {
        if (!active) return;
        console.warn('Unable to restore shared design', error);
        setExportNotice(
          error instanceof ShareUrlError
            ? error.message
            : 'Unable to load this shared design.'
        );
      }

      window.clearTimeout(noticeTimer);
      noticeTimer = window.setTimeout(() => setExportNotice(null), 4500);
    };

    restoreFromHash();
    window.addEventListener('hashchange', restoreFromHash);
    return () => {
      active = false;
      window.clearTimeout(noticeTimer);
      window.removeEventListener('hashchange', restoreFromHash);
    };
  }, []);

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
      handleCodeChange((() => {
        if (!customCode || customCode.trim() === '') {
          return `<div class="w-full h-full p-8 bg-[#090a10] text-white flex flex-col items-center justify-center">${imgSnippet}\n</div>`;
        }
        return customCode + imgSnippet;
      })());
    } else {
      const canvasSnippet = `\n// Draw custom uploaded image\nconst img = new Image();\nimg.onload = () => {\n  ctx.drawImage(img, (width - 400) / 2, (height - 300) / 2, 400, 300);\n};\nimg.src = "${imageUrl}";\n`;
      handleCodeChange(customCode + canvasSnippet);
    }
  };

  // Load starter sample
  const handleLoadSample = (type: 'html' | 'canvas') => {
    if (type === 'html') {
      handleCodeTypeChange('html');
      handleCodeChange(CODE_PRESETS[0].code); // Promise.all vs allSettled
    } else {
      handleCodeTypeChange('canvas');
      handleCodeChange(CODE_PRESETS[3].code); // 3D Isometric Tech Cube Canvas
    }
    setIsEditorOpen(true);
    setAutoFit(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
      setMobileTab('canvas');
    }
  };

  // Load selected preset from Examples Gallery
  const handleSelectPreset = (preset: CodePreset) => {
    handleCodeTypeChange(preset.type);
    handleCodeChange(preset.code);
    setIsEditorOpen(true);
    setAutoFit(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
      setMobileTab('canvas');
    }
  };

  // Export Image Handler
  const handleExport = async (scale: 1 | 2 | 4) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      await exportElementAsPng(canvasRef.current, {
        scale,
        fileName: documentMode === 'slides'
          ? `yuwbrndr-slide-${Math.max(1, slides.findIndex((slide) => slide.id === activeSlideId) + 1)}-${scale}x.png`
          : `yuwbrndr-${scale}x.png`,
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
      handleCodeChange('');
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

  const waitForSlidePreview = async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const frame = canvasRef.current?.querySelector('iframe[data-yuwbrndr-preview]');
    if (!frame) return;
    await new Promise<void>((resolve) => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timer);
        resolve();
      };
      const timer = window.setTimeout(done, 1200);
      frame.addEventListener('load', done, { once: true });
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  };

  const handleExportSlidesZip = async () => {
    if (!canvasRef.current || slides.length === 0) return;
    const previousSlide = slides.find((slide) => slide.id === activeSlideId) ?? slides[0];
    setIsExporting(true);
    setExportNotice(`Preparing 1 of ${slides.length} slides…`);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (let index = 0; index < slides.length; index += 1) {
        const slide = slides[index];
        flushSync(() => {
          setActiveSlideId(slide.id);
          setCustomCodeType(slide.codeType);
          setCustomCode(slide.code);
          setExportNotice(`Preparing ${index + 1} of ${slides.length} slides…`);
        });
        await waitForSlidePreview();
        if (!canvasRef.current) throw new Error('Slide preview is unavailable.');
        const blob = await renderElementAsPngBlob(canvasRef.current, 2);
        const safeName = slide.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `slide-${index + 1}`;
        zip.file(`${String(index + 1).padStart(2, '0')}-${safeName}.png`, blob);
      }

      const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(archive);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'yuwbrndr-slides.zip';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportNotice(`${slides.length} slides exported as a ZIP.`);
    } catch (error) {
      console.error('Failed to export slide deck', error);
      setExportNotice('Unable to export the slide deck. Check the slide code and try again.');
    } finally {
      flushSync(() => {
        setActiveSlideId(previousSlide.id);
        setCustomCodeType(previousSlide.codeType);
        setCustomCode(previousSlide.code);
      });
      setIsExporting(false);
      window.setTimeout(() => setExportNotice(null), 4000);
    }
  };

  const handleExportSlidesPdf = async () => {
    if (!canvasRef.current || slides.length === 0) return;
    const previousSlide = slides.find((slide) => slide.id === activeSlideId) ?? slides[0];
    const orientation = currentPreset.width > currentPreset.height ? 'landscape' : 'portrait';
    setIsExporting(true);
    setExportNotice(`Preparing PDF page 1 of ${slides.length}…`);

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [currentPreset.width, currentPreset.height],
        hotfixes: ['px_scaling'],
        compress: true,
      });

      for (let index = 0; index < slides.length; index += 1) {
        const slide = slides[index];
        flushSync(() => {
          setActiveSlideId(slide.id);
          setCustomCodeType(slide.codeType);
          setCustomCode(slide.code);
          setExportNotice(`Preparing PDF page ${index + 1} of ${slides.length}…`);
        });
        await waitForSlidePreview();
        if (!canvasRef.current) throw new Error('Slide preview is unavailable.');
        const blob = await renderElementAsPngBlob(canvasRef.current, 2);
        const image = new Uint8Array(await blob.arrayBuffer());
        if (index > 0) {
          pdf.addPage([currentPreset.width, currentPreset.height], orientation);
        }
        pdf.addImage(
          image,
          'PNG',
          0,
          0,
          currentPreset.width,
          currentPreset.height,
          undefined,
          'FAST'
        );
      }

      pdf.save('yuwbrndr-slides.pdf');
      setExportNotice(`${slides.length}-page PDF exported successfully.`);
    } catch (error) {
      console.error('Failed to export slide PDF', error);
      setExportNotice('Unable to export the PDF. Check the slide code and try again.');
    } finally {
      flushSync(() => {
        setActiveSlideId(previousSlide.id);
        setCustomCodeType(previousSlide.codeType);
        setCustomCode(previousSlide.code);
      });
      setIsExporting(false);
      window.setTimeout(() => setExportNotice(null), 4000);
    }
  };

  // Share design via URL hash (stateless, compressed, zero localStorage/IndexedDB)
  const handleShare = async () => {
    if (hasLocalImages) {
      setExportNotice('URL sharing is not available with uploaded images. Use web image URLs instead.');
      setTimeout(() => setExportNotice(null), 4000);
      return;
    }

    try {
      const hashData = await encodeShareUrl({
        t: customCodeType,
        c: customCode,
        p: currentPreset.id,
        th: currentTheme.id,
      });

      const newUrl = `${window.location.origin}${window.location.pathname}#share=${hashData}`;
      if (newUrl.length > MAX_SHARE_URL_LENGTH) {
        throw new ShareUrlError('This design is too large to share as a URL.');
      }

      await copyShareUrl(newUrl);
      window.history.replaceState(null, '', newUrl);
      setCopiedShareLink(true);
      setExportNotice('Share link copied to clipboard!');
      setTimeout(() => setCopiedShareLink(false), 2500);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('Failed to encode/copy share URL', err);
      setExportNotice(
        err instanceof ShareUrlError
          ? err.message
          : 'Unable to copy the share link. Check clipboard permission and try again.'
      );
      setTimeout(() => setExportNotice(null), 4500);
    }
  };

  const isErrorNotice = exportNotice
    ? /not available|unable|too large|invalid|missing|unsupported|cannot|failed/i.test(exportNotice)
    : false;

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
        onShare={handleShare}
        hasLocalImages={hasLocalImages}
        sharedCopied={copiedShareLink}
        documentMode={documentMode}
        onDocumentModeChange={handleDocumentModeChange}
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
        <div
          className={`flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden min-w-0 pb-14 lg:pb-0 ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {documentMode === 'slides' && (
            <SlideStrip
              slides={slides}
              activeSlideId={activeSlideId}
              onSelect={handleSelectSlide}
              onAdd={handleAddSlide}
              onDuplicate={handleDuplicateSlide}
              onDelete={handleDeleteSlide}
              onExport={() => handleExport(2)}
              onCopy={handleCopyImage}
              onExportAll={handleExportSlidesZip}
              onExportPdf={handleExportSlidesPdf}
              isExporting={isExporting}
              copiedImage={copiedImage}
            />
          )}
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
                setCodeType={handleCodeTypeChange}
                code={customCode}
                onChange={handleCodeChange}
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
              className={`h-[calc(100vh-4rem)] pb-14 lg:pb-0 bg-studio-900 shrink-0 flex-col shadow-2xl transition-all duration-200 ease-out border-l border-white/10 ${
                mobileTab === 'code' ? 'flex w-full lg:w-[500px]' : 'hidden lg:flex'
              } ${
                isEditorWide
                  ? 'fixed inset-0 z-50 h-screen w-screen pb-0 lg:relative lg:inset-auto lg:h-[calc(100vh-4rem)] lg:w-[680px] xl:w-[740px]'
                  : 'z-20 lg:w-[500px] xl:w-[580px]'
              }`}
            >
              <FullCodeEditor
                codeType={customCodeType}
                setCodeType={handleCodeTypeChange}
                code={customCode}
                onChange={handleCodeChange}
                onClear={handleClearCode}
                onLoadSample={handleLoadSample}
                dockMode={dockMode}
                onDockModeChange={setDockMode}
                userImage={userImage}
                uploadedAssets={uploadedAssets}
                onInsertImage={handleInsertImageToCode}
                isWide={isEditorWide}
                onToggleWide={() => setIsEditorWide(!isEditorWide)}
                onToggleCollapse={() => {
                  setIsEditorOpen(false);
                  setIsEditorWide(false);
                  setMobileTab('canvas');
                }}
              />
            </div>
          ) : (
            /* Collapsed side tab when editor is hidden (Desktop only) */
            <button
              onClick={() => setIsEditorOpen(true)}
              className="hidden lg:flex h-[calc(100vh-4rem)] w-10 bg-studio-900/90 border-l border-white/10 hover:bg-studio-800 transition-colors flex-col items-center justify-center gap-3 text-slate-400 hover:text-white cursor-pointer py-4 shadow-lg shrink-0"
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

      {/* 4. MOBILE BOTTOM NAVIGATION BAR (< lg) - Hidden when editor is expanded fullscreen on mobile */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-studio-900/95 backdrop-blur-md border-t border-white/10 items-center justify-around px-2 z-40 select-none ${
        mobileTab === 'code' && isEditorWide ? 'hidden' : 'flex'
      }`}>
        <button
          onClick={() => {
            setMobileTab('canvas');
            setIsSidebarOpen(false);
            setIsEditorWide(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors ${
            mobileTab === 'canvas' && !isSidebarOpen
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="text-[10px] font-medium">Canvas</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('code');
            setIsSidebarOpen(false);
            setIsEditorOpen(true);
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors ${
            mobileTab === 'code' && !isSidebarOpen
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span className="text-[10px] font-medium">Code</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors ${
            isSidebarOpen
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-medium">Assets</span>
        </button>

        <button
          onClick={() => handleExport(2)}
          disabled={isExporting}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-medium">{isExporting ? '...' : 'Export'}</span>
        </button>
      </nav>

      {/* Fullscreen IDE Studio Modal with Side Preview (optional) */}
      {dockMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 bg-studio-950 flex flex-col animate-in fade-in duration-200">
          <div className="h-14 px-6 border-b border-white/10 bg-studio-900 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-white tracking-tight">Yuwbrndr Fullscreen Code Studio</span>
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
                setCodeType={handleCodeTypeChange}
                code={customCode}
                onChange={handleCodeChange}
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
        onInsertSnippet={(snippet) => handleCodeChange(customCode ? `${customCode}\n\n${snippet}` : snippet)}
      />

      {/* Vectors, Lucide Icons & Meme Stickers Modal */}
      <StickersModal
        isOpen={isStickersOpen}
        onClose={() => setIsStickersOpen(false)}
        onInsertSnippet={(snippet) => handleCodeChange(customCode ? `${customCode}\n\n${snippet}` : snippet)}
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
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            isErrorNotice
              ? 'border-amber-500/40 bg-studio-900/95 text-amber-300 shadow-amber-500/10'
              : 'border-emerald-500/40 bg-studio-900/95 text-emerald-300 shadow-emerald-500/10'
          }`}
        >
          {exportNotice}
        </div>
      )}
    </div>
  );
}

export default App;
