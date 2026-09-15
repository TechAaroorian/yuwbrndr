import React, { useRef, useState } from 'react';
import { 
  Trash2, 
  ImagePlus, 
  Upload, 
  Check, 
  Sparkles,
  FolderOpen,
  Lightbulb,
  Code2,
  AlertCircle,
  X,
  PanelLeftClose,
  Type,
  Smile
} from 'lucide-react';
import { CODE_PRESETS, CodePreset } from '../utils/codePresets';
import { UploadedAsset } from '../types/studio';

interface Props {
  customCodeType: 'html' | 'canvas';
  onLoadSample: (type: 'html' | 'canvas') => void;
  onOpenExamples: () => void;
  onOpenFonts?: () => void;
  onOpenStickers?: () => void;
  onSelectPreset: (preset: CodePreset) => void;
  onClearCode: () => void;
  userImage: string | null;
  setUserImage: React.Dispatch<React.SetStateAction<string | null>>;
  useAsBackground: boolean;
  setUseAsBackground: React.Dispatch<React.SetStateAction<boolean>>;
  onInsertImageToCode: (url: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  uploadedAssets?: UploadedAsset[];
  onAddAssets?: (files: FileList | File[]) => void;
  onRemoveAsset?: (id: string) => void;
  uploadError?: string | null;
  onClearUploadError?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  customCodeType,
  onLoadSample,
  onOpenExamples,
  onOpenFonts,
  onOpenStickers,
  onSelectPreset,
  onClearCode,
  userImage,
  setUserImage,
  useAsBackground,
  setUseAsBackground,
  onInsertImageToCode,
  isOpen = true,
  onToggle,
  uploadedAssets = [],
  onAddAssets,
  onRemoveAsset,
  uploadError,
  onClearUploadError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAddAssets) {
      onAddAssets(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onAddAssets) {
      onAddAssets(e.dataTransfer.files);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <aside 
      className={`h-[calc(100vh-4rem)] border-r border-white/10 bg-studio-900/80 backdrop-blur-md flex flex-col shrink-0 select-none transition-all duration-200 ease-out relative ${
        isOpen 
          ? 'w-72 xl:w-80 overflow-y-auto' 
          : 'w-0 overflow-hidden opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      {/* Top Header Row with Collapse Button */}
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-studio-950/40">
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
          Assets & Examples
        </span>
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Collapse Sidebar (Ctrl+B)"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden File Input for Custom Image Upload (max 2MB, max 5 files) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        multiple
        className="hidden"
      />

      <div className="p-4 space-y-4">
        {/* EXAMPLES GALLERY LAUNCHER CARD */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-studio-950 to-studio-950 border border-indigo-500/30 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>CODE EXAMPLES</span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Browse ready-made Infographics, 3D Canvas, SVG, or Memes:
          </p>

          <button
            onClick={onOpenExamples}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-glow-indigo transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open Examples Gallery</span>
          </button>

          {onOpenFonts && (
            <button
              onClick={onOpenFonts}
              className="w-full py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              title="Browse 10 Curated Open-Source Fonts"
            >
              <Type className="w-4 h-4 text-cyan-400" />
              <span>10 Open Fonts Catalog</span>
            </button>
          )}

          {onOpenStickers && (
            <button
              onClick={onOpenStickers}
              className="w-full py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              title="Browse Open-Source Vectors, Lucide Icons & Stickers"
            >
              <Smile className="w-4 h-4 text-amber-400" />
              <span>Vectors & Lucide Stickers</span>
            </button>
          )}

          {/* Quick Example Presets */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => onSelectPreset(CODE_PRESETS[0])}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono text-left flex items-center justify-between transition-colors"
            >
              <span>📊 Promise Cheatsheet</span>
              <span className="text-[10px] text-cyan-400 font-bold">INFO</span>
            </button>
            <button
              onClick={() => onSelectPreset(CODE_PRESETS[1])}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono text-left flex items-center justify-between transition-colors"
            >
              <span>📦 Bento Grid Metrics</span>
              <span className="text-[10px] text-cyan-400 font-bold">BENTO</span>
            </button>
            <button
              onClick={() => onSelectPreset(CODE_PRESETS[3])}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono text-left flex items-center justify-between transition-colors"
            >
              <span>🧊 3D Isometric Cube</span>
              <span className="text-[10px] text-indigo-400 font-bold">CANVAS</span>
            </button>
            <button
              onClick={() => onSelectPreset(CODE_PRESETS[5])}
              className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono text-left flex items-center justify-between transition-colors"
            >
              <span>🎨 Vector Mesh Card</span>
              <span className="text-[10px] text-emerald-400 font-bold">SVG</span>
            </button>
          </div>
        </div>

        {/* CUSTOM ASSET UPLOAD & GALLERY (MAX 2MB, MAX 5 FILES) */}
        <div className="p-4 rounded-2xl bg-studio-900/90 border border-white/10 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5" />
              <span>CUSTOM ASSETS</span>
            </label>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {uploadedAssets.length}/5
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>In-memory RAM</span>
            <span className="text-cyan-400 font-mono font-semibold">Max 2 MB / file</span>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-tight">{uploadError}</div>
              {onClearUploadError && (
                <button
                  onClick={onClearUploadError}
                  className="text-rose-400 hover:text-white p-0.5"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Upload Trigger / Dropzone */}
          {uploadedAssets.length < 5 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-3.5 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-500/20 text-white scale-[0.99]'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-5 h-5 text-indigo-400 transition-transform" />
              <span className="text-xs font-semibold">
                Upload Image ({5 - uploadedAssets.length} slot{5 - uploadedAssets.length > 1 ? 's' : ''} left)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                PNG, JPG, SVG, WebP • Max 2MB
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono text-center">
              Max 5 assets reached. Remove one to upload more.
            </div>
          )}

          {/* Uploaded Assets List */}
          {uploadedAssets.length > 0 && (
            <div className="space-y-2 pt-1">
              {uploadedAssets.map((asset) => {
                const isCurrentBg = userImage === asset.url && useAsBackground;
                return (
                  <div
                    key={asset.id}
                    className="p-2.5 rounded-xl border border-white/10 bg-studio-950/80 space-y-2 shadow-sm hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0 bg-black/40"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-100 truncate" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatSize(asset.size)}
                        </div>
                      </div>
                      {onRemoveAsset && (
                        <button
                          onClick={() => onRemoveAsset(asset.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick actions for this asset */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                      <button
                        onClick={() => {
                          if (userImage === asset.url && useAsBackground) {
                            setUseAsBackground(false);
                          } else {
                            setUserImage(asset.url);
                            setUseAsBackground(true);
                          }
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all border flex items-center justify-center gap-1 ${
                          isCurrentBg
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                        }`}
                        title="Toggle as canvas background"
                      >
                        <Check className={`w-3 h-3 ${isCurrentBg ? 'opacity-100 text-emerald-400' : 'opacity-30'}`} />
                        <span>{isCurrentBg ? 'Bg: Active' : 'Set Bg'}</span>
                      </button>

                      <button
                        onClick={() => onInsertImageToCode(asset.url)}
                        className="px-2 py-1 rounded-lg text-[11px] font-mono font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 transition-all flex items-center justify-center gap-1"
                        title="Inject <img> tag into code"
                      >
                        <span>+ To Code</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Canvas Quick Actions */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
            Canvas Quick Actions
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClearCode}
              className="py-2 px-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              title="Clear code to empty canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={() => onLoadSample(customCodeType)}
              className="py-2 px-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              title="Load starter sample"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Starter</span>
            </button>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="p-3 rounded-xl bg-studio-950 border border-white/10 text-[11px] text-slate-400 leading-relaxed font-sans flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Editor on Right: </span>
            <span>
              Edit HTML, Tailwind CSS, or Canvas JS on the right panel with real-time syntax highlighting, error linting, and instant preview.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
