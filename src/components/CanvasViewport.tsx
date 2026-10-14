import React, { useState, useEffect, useRef } from 'react';
import { AspectPreset, ColorTheme, ASPECT_PRESETS } from '../types/studio';
import { CustomCodeCanvas } from './templates/custom/CustomCodeCanvas';
import { Info, LayoutTemplate, ChevronRight, ChevronDown, Sparkles, Code2 } from 'lucide-react';

interface Props {
  currentPreset: AspectPreset;
  currentTheme: ColorTheme;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onManualZoom: (newZoom: number) => void;
  fontScale: number;
  onFontScaleChange: (newScale: number) => void;
  autoFit: boolean;
  onToggleAutoFit: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  customCodeType: 'html' | 'canvas';
  customCode: string;
  userImage?: string | null;
  useAsBackground?: boolean;
  onLoadSample: (type: 'html' | 'canvas') => void;
  onTriggerUpload?: () => void;
  onOpenPlatformGuide: () => void;
  onSelectPreset: (preset: AspectPreset) => void;
  onOpenAiPrompt?: () => void;
  onOpenTemplates: () => void;
}

export const CanvasViewport: React.FC<Props> = ({
  currentPreset,
  currentTheme,
  zoom,
  onZoomChange,
  onManualZoom,
  fontScale,
  onFontScaleChange,
  autoFit,
  onToggleAutoFit,
  canvasRef,
  customCodeType,
  customCode,
  userImage,
  useAsBackground,
  onLoadSample,
  onTriggerUpload,
  onOpenPlatformGuide,
  onSelectPreset,
  onOpenAiPrompt,
  onOpenTemplates,
}) => {
  const [showTip, setShowTip] = useState<boolean>(true);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Auto-arrange & Auto-fit calculation based on true available viewport space
  useEffect(() => {
    const calculateFit = () => {
      // Sentinel element is positioned absolutely with inset, immune to flex child expansion
      const targetElement = sentinelRef.current || canvasContainerRef.current;
      if (!targetElement) return;

      const availW = targetElement.clientWidth;
      const availH = targetElement.clientHeight;

      if (availW > 60 && availH > 60) {
        const scaleW = availW / currentPreset.width;
        const scaleH = availH / currentPreset.height;
        // Fit both dimensions completely inside the visible viewport bounds
        const fitScale = Math.min(scaleW, scaleH, 1.0);
        const clampedFit = Math.max(0.15, Math.round(fitScale * 100) / 100);

        if (autoFit) {
          onZoomChange(clampedFit);
        }
      }
    };

    // Immediate calculation + double-check after layout paint
    calculateFit();
    const timer = setTimeout(calculateFit, 50);

    const elementToObserve = sentinelRef.current || canvasContainerRef.current;
    let observer: ResizeObserver | null = null;
    if (elementToObserve) {
      observer = new ResizeObserver(() => {
        calculateFit();
      });
      observer.observe(elementToObserve);
    }

    window.addEventListener('resize', calculateFit);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', calculateFit);
    };
  }, [currentPreset.width, currentPreset.height, showTip, autoFit, onZoomChange]);

  const canvasWidth = Math.round(currentPreset.width * zoom);
  const canvasHeight = Math.round(currentPreset.height * zoom);

  return (
    <section aria-label="Design preview" className="aar-canvas-viewport aar-u-flex-1 aar-u-min-h-0 aar-u-bg-background aar-u-overflow-hidden aar-u-flex aar-u-flex-col aar-u-items-center aar-u-p-3 aar-u-relative aar-u-select-none aar-u-min-w-0">
      {/* Top Floating Platform Info Card */}
      <div className="aar-canvas-card">
        <div className="aar-canvas-card-header aar-u-flex aar-u-items-center aar-u-justify-between aar-u-flex-nowrap">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-min-w-0 aar-u-truncate">
            <span className="aar-u-font-bold aar-u-text-text aar-u-text-xs aar-u-truncate">{currentPreset.name}</span>
            <span className="aar-badge">{currentPreset.aspectRatio}</span>
            <span className="aar-u-font-bold aar-u-text-primary aar-u-text-xs aar-u-shrink-0">{currentPreset.width} × {currentPreset.height} px</span>
            <span className="aar-text-muted aar-u-text-xs aar-u-shrink-0">({Math.round(zoom * 100)}%)</span>
          </div>

          <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-shrink-0">
            {!autoFit && (
              <button
                onClick={onToggleAutoFit}
                className="aar-button"
                data-size="xs"
                title="Fit to Screen"
              >
                Fit
              </button>
            )}
            <button
              onClick={onOpenPlatformGuide}
              className="aar-button aar-u-flex aar-u-items-center aar-u-gap-0.5"
              data-variant="quiet"
              data-size="xs"
            >
              <span className="aar-u-text-primary aar-u-font-semibold">Specs</span>
              <ChevronRight size={12} className="aar-u-text-primary" />
            </button>
          </div>
        </div>

        {/* Platform Optimization Tip inside info card */}
        {showTip && currentPreset.tip && (
          <div className="aar-canvas-card-tip aar-u-flex aar-u-items-center aar-u-justify-between aar-u-flex-nowrap">
            <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-min-w-0 aar-u-truncate">
              <Sparkles size={13} className="aar-u-text-primary aar-u-shrink-0" />
              <span className="aar-text-muted aar-u-text-xs aar-u-truncate">{currentPreset.tip}</span>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="aar-icon-button aar-text-muted aar-u-shrink-0"
              data-variant="quiet"
              data-size="xs"
              title="Dismiss tip"
              aria-label="Dismiss tip"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* The Sacred Altar Viewport */}
      <div
        ref={canvasContainerRef}
        className="aar-u-flex-1 aar-u-w-full aar-u-flex aar-u-items-center aar-u-justify-center aar-u-overflow-auto aar-u-p-4 aar-u-min-h-0 aar-u-min-w-0 aar-u-relative"
      >
        {/* Invisible absolute sentinel for exact layout measurement */}
        <div
          ref={sentinelRef}
          className="aar-u-absolute aar-u-inset-4 aar-u-pointer-events-none aar-u-opacity-0"
        />

        <div
          className="aar-canvas-frame"
          data-fit={autoFit}
          style={{
            '--aar-canvas-frame-width': `${canvasWidth}px`,
            '--aar-canvas-frame-height': `${canvasHeight}px`,
            '--aar-canvas-width': `${currentPreset.width}px`,
            '--aar-canvas-height': `${currentPreset.height}px`,
            '--aar-canvas-ratio': `${currentPreset.width} / ${currentPreset.height}`,
            '--aar-canvas-zoom': zoom,
          } as React.CSSProperties}
        >
          <div className="aar-canvas-preview aar-u-origin-top-left aar-u-overflow-hidden">
            <div ref={canvasRef} className="aar-u-w-full aar-u-h-full aar-u-relative">
              <CustomCodeCanvas
                codeType={customCodeType}
                code={customCode}
                theme={currentTheme}
                width={currentPreset.width}
                height={currentPreset.height}
                userImage={userImage}
                useAsBackground={useAsBackground}
                fontScale={fontScale}
                onPasteSample={onLoadSample}
                onTriggerUpload={onTriggerUpload}
                onOpenAiPrompt={onOpenAiPrompt}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
