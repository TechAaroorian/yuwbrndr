import React, { useState, useEffect, useRef } from 'react';
import { AspectPreset, ColorTheme } from '../types/studio';
import { CustomCodeCanvas } from './templates/custom/CustomCodeCanvas';
import { Sparkles, ChevronRight, Maximize2, PanelLeftOpen } from 'lucide-react';

interface Props {
  currentPreset: AspectPreset;
  currentTheme: ColorTheme;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
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
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const CanvasViewport: React.FC<Props> = ({
  currentPreset,
  currentTheme,
  zoom,
  onZoomChange,
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
  isSidebarOpen = true,
  onToggleSidebar,
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
  }, [currentPreset.width, currentPreset.height, showTip, autoFit, onZoomChange, isSidebarOpen]);

  const canvasWidth = Math.round(currentPreset.width * zoom);
  const canvasHeight = Math.round(currentPreset.height * zoom);

  return (
    <main className="flex-1 h-[calc(100vh-4rem)] bg-[#0c0f15] overflow-hidden flex flex-col items-center justify-between p-4 relative select-none min-w-0">
      {/* Floating Expand Sidebar Button when sidebar is collapsed */}
      {!isSidebarOpen && onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="absolute left-3 top-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-900/90 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:bg-studio-800 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/40 group active:scale-95"
          title="Expand Left Panel (Ctrl+B)"
        >
          <PanelLeftOpen className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
          <span>Templates & Assets</span>
        </button>
      )}

      {/* Top Floating Platform Info & Resolution Banner */}
      <div className="w-full max-w-2xl z-20 flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg border border-white/10 bg-studio-900 text-xs shrink-0">
        <div className="flex items-center gap-2 truncate">
          <div className="flex items-center gap-1.5 truncate text-[11px]">
            <span className="font-bold text-slate-100 truncate">{currentPreset.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold shrink-0">
              {currentPreset.aspectRatio}
            </span>
            <span className="text-cyan-400 font-bold shrink-0">{currentPreset.width} × {currentPreset.height} px</span>
            <span className="text-slate-500 shrink-0">({Math.round(zoom * 100)}%)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!autoFit && (
            <button
              onClick={onToggleAutoFit}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 text-[11px] font-semibold transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Auto Fit</span>
            </button>
          )}

          <button
            onClick={onOpenPlatformGuide}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Specs</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Platform Optimization Tip Pill */}
      {showTip && currentPreset.tip && (
        <div className="w-full max-w-2xl mt-2 px-3.5 py-1.5 rounded-lg bg-studio-900 border border-white/10 text-[11px] text-slate-400 flex items-center justify-between gap-2 font-sans shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{currentPreset.tip}</span>
          </div>
          <button 
            onClick={() => setShowTip(false)}
            className="text-slate-500 hover:text-slate-300 text-xs font-mono p-0.5 shrink-0"
            title="Dismiss tip"
          >
            ✕
          </button>
        </div>
      )}

      {/* CENTERED SCALED CANVAS CONTAINER WITH EXACT BOUNDING BOX */}
      <div 
        ref={canvasContainerRef}
        className="flex-1 w-full flex items-center justify-center overflow-auto p-4 min-h-0 min-w-0 relative"
      >
        {/* Invisible absolute sentinel for exact layout measurement */}
        <div 
          ref={sentinelRef}
          className="absolute inset-4 pointer-events-none opacity-0"
        />

        <div
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            maxWidth: autoFit ? '100%' : undefined,
            maxHeight: autoFit ? '100%' : undefined,
            aspectRatio: `${currentPreset.width} / ${currentPreset.height}`,
            position: 'relative',
            flexShrink: 0,
            transition: 'width 0.15s ease-out, height 0.15s ease-out',
          }}
        >
          <div 
            className="origin-top-left shadow-2xl rounded-xl overflow-hidden border border-white/15"
            style={{
              transform: `scale(${zoom})`,
              width: `${currentPreset.width}px`,
              height: `${currentPreset.height}px`,
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'transform 0.15s ease-out',
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
                onPasteSample={onLoadSample}
                onTriggerUpload={onTriggerUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
