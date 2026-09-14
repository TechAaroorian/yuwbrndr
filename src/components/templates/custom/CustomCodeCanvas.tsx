import React, { useEffect, useRef, useState } from 'react';
import { ColorTheme } from '../../../types/studio';
import { Code2, AlertTriangle, Sparkles, Terminal, Copy } from 'lucide-react';

interface Props {
  codeType: 'html' | 'canvas';
  code: string;
  theme: ColorTheme;
  width: number;
  height: number;
  userImage?: string | null;
  useAsBackground?: boolean;
  onPasteSample?: (type: 'html' | 'canvas') => void;
  onTriggerUpload?: () => void;
}

export const CustomCodeCanvas: React.FC<Props> = ({
  codeType,
  code,
  theme,
  width,
  height,
  userImage,
  useAsBackground = false,
  onPasteSample,
  onTriggerUpload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Execute Canvas code whenever code, width, or height changes
  useEffect(() => {
    if (codeType !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setRenderError(null);

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    if (!code || code.trim() === '') return;

    try {
      // Safely evaluate user canvas script with context bindings
      const executeCanvasCode = new Function('canvas', 'ctx', 'width', 'height', code);
      executeCanvasCode(canvas, ctx, width, height);
    } catch (err: any) {
      console.error('Custom Canvas script execution error:', err);
      setRenderError(err?.message || 'Error executing canvas script');
    }
  }, [codeType, code, width, height]);

  const isEmpty = !code || code.trim() === '';

  // Background style if user enabled background image
  const backgroundStyle: React.CSSProperties = useAsBackground && userImage
    ? {
        backgroundImage: `url(${userImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: theme.background,
      }
    : {
        backgroundColor: theme.background,
      };

  // Empty State View
  if (isEmpty) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-8 md:p-14 select-none relative overflow-hidden"
        style={backgroundStyle}
      >
        {/* Scrim overlay if background image is active */}
        {useAsBackground && userImage && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
        )}

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Ambient glow */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: theme.primary }}
        />

        {/* Dashed placeholder container */}
        <div className="relative z-10 max-w-lg w-full p-8 md:p-10 rounded-3xl border-2 border-dashed border-white/15 bg-studio-900/80 backdrop-blur-md flex flex-col items-center text-center shadow-xl">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-glow-indigo"
            style={{ 
              backgroundColor: `${theme.primary}20`, 
              borderColor: `${theme.primary}50`,
              color: theme.accent 
            }}
          >
            <Code2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2">
            {userImage ? 'Image Loaded as Background' : 'Canvas is Empty'}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
            {userImage
              ? 'Your custom image is loaded. Type or paste HTML & Tailwind CSS to overlay headings, badges, or memes on top.'
              : 'Paste your raw HTML & Tailwind CSS or HTML5 Canvas JavaScript in the left sidebar, or upload your own image below.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
            {onTriggerUpload && !userImage && (
              <button
                onClick={onTriggerUpload}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Upload Your Image</span>
              </button>
            )}
            {onPasteSample && (
              <button
                onClick={() => onPasteSample('html')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-all border border-white/10 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={backgroundStyle}
    >
      {useAsBackground && userImage && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}
      {codeType === 'html' ? (
        <div 
          className="w-full h-full relative overflow-hidden z-10"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      ) : (
        <div className="w-full h-full relative flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full object-contain"
          />
          {renderError && (
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold">Execution Error: </span>
                {renderError}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
