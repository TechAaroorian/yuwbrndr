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
import { CodeInspector } from './components/CodeInspector';
import { PlatformResolutionGuide } from './components/PlatformResolutionGuide';
import { ExamplesModal } from './components/ExamplesModal';
import { FontsModal } from './components/FontsModal';
import { StickersModal } from './components/StickersModal';
import { CapabilitiesModal } from './components/CapabilitiesModal';
import { AboutModal } from './components/AboutModal';
import { AiPromptModal } from './components/AiPromptModal';
import { FullCodeEditor } from './components/FullCodeEditor';
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
import { LayoutGuide } from './components/LayoutGuide';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isLayoutGuideOpen, setIsLayoutGuideOpen] = useState(false);

  // Global keyboard shortcuts (Ctrl+B / Cmd+B for sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('yuwbrndr-theme') : null;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });
  const [autoFit, setAutoFit] = useState<boolean>(true); // Auto-arrange & fit canvas size by default
  const [currentPreset, setCurrentPreset] = useState<AspectPreset>(ASPECT_PRESETS[0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    const isDark = appTheme === 'dark' || (appTheme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark ? COLOR_THEMES.midnight : COLOR_THEMES.minimalist;
  });
  const [zoom, setZoom] = useState<number>(0.55);
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yuwbrndr-font-scale");
      const parsed = saved ? parseFloat(saved) : 1.0;
      return isNaN(parsed) || parsed < 0.5 || parsed > 2.0 ? 1.0 : parsed;
    }
    return 1.0;
  });

  const handleFontScaleChange = (newScale: number) => {
    const clamped = Math.max(0.6, Math.min(2.0, Math.round(newScale * 100) / 100));
    setFontScale(clamped);
    if (typeof window !== "undefined") {
      localStorage.setItem("yuwbrndr-font-scale", clamped.toString());
    }
  };

  const handleAppThemeChange = (newTheme: AppTheme) => {
    setAppTheme(newTheme);
    setCurrentTheme((prev) => {
      const isDefault = prev.id === 'midnight' || prev.id === 'minimalist';
      if (!isDefault) return prev;
      const isDark = newTheme === 'dark' || (newTheme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return isDark ? COLOR_THEMES.midnight : COLOR_THEMES.minimalist;
    });
  };

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
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
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

  const handleApplyAiGeneratedCode = (code: string, type: 'html' | 'canvas') => {
    handleCodeTypeChange(type);
    handleCodeChange(code);
    setExportNotice('AI design code applied to canvas!');
    setTimeout(() => setExportNotice(null), 3000);
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
    const currentSlide = slides.find((slide) => slide.id === activeSlideId);
    const sourceCode = currentSlide ? currentSlide.code : customCode;
    const sourceCodeType = currentSlide ? currentSlide.codeType : customCodeType;
    const slide: StudioSlide = {
      id: crypto.randomUUID(),
      name: `Slide ${slides.length + 1}`,
      codeType: sourceCodeType,
      code: sourceCode,
    };
    setSlides((current) => [...current, slide]);
    setActiveSlideId(slide.id);
    setCustomCodeType(sourceCodeType);
    setCustomCode(sourceCode);
    setAutoFit(true);
  };

  const handleCopyPreviousSlide = () => {
    if (slides.length <= 1) return;
    const currentIndex = slides.findIndex((slide) => slide.id === activeSlideId);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    const previousSlide = slides[previousIndex];
    if (!previousSlide) return;
    setCustomCodeType(previousSlide.codeType);
    handleCodeChange(previousSlide.code);
    setExportNotice(`Copied design from ${previousSlide.name}`);
    setTimeout(() => setExportNotice(null), 3000);
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
  };

  // Load selected preset from Examples Gallery
  const handleSelectPreset = (preset: CodePreset) => {
    handleCodeTypeChange(preset.type);
    handleCodeChange(preset.code);
    setIsEditorOpen(true);
    setAutoFit(true);
  };

  // Export Image Handler
  const handleExport = async (scale: 1 | 2 | 4, customFileName?: string) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const defaultBase = documentMode === 'slides'
        ? `yuwbrndr-slide-${Math.max(1, slides.findIndex((slide) => slide.id === activeSlideId) + 1)}`
        : 'yuwbrndr';
      const cleanCustom = customFileName?.trim().replace(/\.png$/i, '');
      const baseName = cleanCustom || defaultBase;
      const fileName = `${baseName}-${scale}x.png`;

      await exportElementAsPng(canvasRef.current, {
        scale,
        fileName,
      });
      setExportNotice(`Exported ${fileName} (${currentPreset.width * scale} × ${currentPreset.height * scale}px)`);
      setTimeout(() => setExportNotice(null), 3000);
    } catch {
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
    <div
      className="aar-root aar-workspace aar-studio"
      data-size="viewport"
      style={{
        '--aar-navigation-width': '20rem',
        '--aar-inspector-width': '28rem',
      } as React.CSSProperties}
      data-theme={appTheme}
      data-density="compact"
    >
      <Header
        documentMode={documentMode}
        onDocumentModeChange={handleDocumentModeChange}
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPresetFormat}
        zoom={zoom}
        onZoomChange={handleManualZoom}
        autoFit={autoFit}
        onToggleAutoFit={() => setAutoFit((prev) => !prev)}
        fontScale={fontScale}
        onFontScaleChange={handleFontScaleChange}
        appTheme={appTheme}
        onAppThemeChange={handleAppThemeChange}
        onExport={handleExport}
        isExporting={isExporting}
        hasDesign={!!customCode.trim()}
        onCopyImage={handleCopyImage}
        copiedImage={copiedImage}
        onShare={handleShare}
        sharedCopied={copiedShareLink}
        hasLocalImages={hasLocalImages}
        onOpenAiPrompt={() => setIsAiPromptOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenCapabilities={() => setIsCapabilitiesOpen(true)}
        onOpenPlatformGuide={() => setIsPlatformGuideOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isEditorOpen={isEditorOpen}
        onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
      />

      <div className="aar-workspace-body aar-studio-body" data-layout="studio">
        {/* 1. LEFT NAVIGATION REGION: Tools, Templates & Assets Sidebar */}
        <aside
          className="aar-workspace-region aar-studio-sidebar"
          data-region="navigation"
          data-collapsed={!isSidebarOpen}
          aria-hidden={!isSidebarOpen}
          aria-label="Templates and assets"
        >
          <Sidebar
            customCodeType={customCodeType}
            onLoadSample={handleLoadSample}
            onOpenExamples={() => setIsExamplesOpen(true)}
            onOpenFonts={() => setIsFontsOpen(true)}
            onOpenStickers={() => setIsStickersOpen(true)}
            onClearCode={handleClearCode}
            currentTheme={currentTheme}
            onSelectTheme={setCurrentTheme}
            userImage={userImage}
            setUserImage={setUserImage}
            useAsBackground={useAsBackground}
            setUseAsBackground={setUseAsBackground}
            onInsertImageToCode={handleInsertImageToCode}
            onOpenAiPrompt={() => setIsAiPromptOpen(true)}
            uploadedAssets={uploadedAssets}
            onAddAssets={handleAddAssets}
            onRemoveAsset={handleRemoveAsset}
            uploadError={uploadError}
            onClearUploadError={() => setUploadError(null)}
          />
        </aside>

        {/* 2. CENTER CONTENT REGION: Canvas Viewport */}
        <main
          className="aar-workspace-region aar-studio-content"
          data-region="content"
          aria-label="Canvas workspace"
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
            onManualZoom={handleManualZoom}
            fontScale={fontScale}
            onFontScaleChange={handleFontScaleChange}
            autoFit={autoFit}
            onToggleAutoFit={() => setAutoFit(true)}
            canvasRef={canvasRef}
            customCodeType={customCodeType}
            customCode={customCode}
            userImage={userImage}
            useAsBackground={useAsBackground}
            onLoadSample={handleLoadSample}
            onOpenPlatformGuide={() => setIsPlatformGuideOpen(true)}
            onOpenAiPrompt={() => setIsAiPromptOpen(true)}
            onTriggerUpload={() => setIsSidebarOpen(true)}
            onSelectPreset={handleSelectPresetFormat}
            onOpenTemplates={() => setIsSidebarOpen(true)}
            onCopyPreviousSlide={documentMode === 'slides' && slides.length > 1 ? handleCopyPreviousSlide : undefined}
          />
        </main>

        {/* 3. RIGHT INSPECTOR REGION: Code Editor */}
        <aside
          className="aar-workspace-region aar-studio-inspector"
          data-region="inspector"
          data-collapsed={!isEditorOpen}
          aria-hidden={!isEditorOpen}
          aria-label="Code editor"
        >
          <FullCodeEditor
            codeType={customCodeType}
            setCodeType={handleCodeTypeChange}
            code={customCode}
            onChange={handleCodeChange}
            onClear={handleClearCode}
            onLoadSample={handleLoadSample}
            userImage={userImage}
            uploadedAssets={uploadedAssets}
            onInsertImage={handleInsertImageToCode}
            onOpenAiPrompt={() => setIsAiPromptOpen(true)}
            onToggleCollapse={() => setIsEditorOpen(false)}
          />
        </aside>
      </div>

      <footer className="aar-statusbar">
        <div className="aar-cluster" data-gap="2">
          <span>{currentPreset.platform}</span>
          <span>·</span>
          <span>{currentPreset.width} × {currentPreset.height} px ({currentPreset.aspectRatio})</span>
          <span>·</span>
          <span>{documentMode === 'slides' ? `${slides.length} slides` : 'Single graphic'}</span>
          <span>·</span>
          <span>Client-side only · Zero tracking</span>
        </div>
        <div className="aar-cluster" data-gap="2">
          <button className="aar-button" data-variant="quiet" onClick={() => setIsPlatformGuideOpen(true)} data-size="sm">
            Resolution Guide
          </button>
          <button className="aar-button" data-variant="quiet" onClick={() => setIsCapabilitiesOpen(true)} data-size="sm">
            Capabilities
          </button>
        </div>
      </footer>
      <LayoutGuide open={isLayoutGuideOpen} onClose={() => setIsLayoutGuideOpen(false)} />

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

      {/* AI Design Code Prompt Generator Modal */}
      <AiPromptModal
        isOpen={isAiPromptOpen}
        onClose={() => setIsAiPromptOpen(false)}
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPresetFormat}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        customCodeType={customCodeType}
        onSelectCodeType={handleCodeTypeChange}
        onApplyGeneratedCode={handleApplyAiGeneratedCode}
      />

      {exportNotice && (
        <div
          role="status"
          className={`aar-u-fixed aar-u-bottom-5 aar-u-left-1-2 aar-u--translate-x-1-2 aar-u-z--70 aar-u-rounded aar-u-border aar-u-px-4 aar-u-py-2.5 aar-u-text-sm aar-u-font-semibold aar-u-animate-in aar-u-fade-in aar-u-slide-in-from-bottom-2 aar-u-duration-200 ${
            isErrorNotice
              ? 'aar-u-border-amber-500-40 aar-u-bg-surface aar-u-text-amber-300'
              : 'aar-u-border-emerald-500-40 aar-u-bg-surface aar-u-text-emerald-300'
          }`}
        >
          {exportNotice}
        </div>
      )}
    </div>
  );
}

export default App;
