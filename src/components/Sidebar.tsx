import React, { useRef, useState } from 'react';
import { 
  Trash2, 
  ImagePlus, 
  Upload, 
  Check,
  Sparkles,
  FolderOpen,
  AlertCircle,
  X,
  PanelLeftClose,
  Type,
  Smile
} from 'lucide-react';
import { UploadedAsset } from '../types/studio';

interface Props {
  customCodeType: 'html' | 'canvas';
  onLoadSample: (type: 'html' | 'canvas') => void;
  onOpenExamples: () => void;
  onOpenFonts?: () => void;
  onOpenStickers?: () => void;
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
  onOpenAiPrompt?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  customCodeType,
  onLoadSample,
  onOpenExamples,
  onOpenFonts,
  onOpenStickers,
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
  onOpenAiPrompt,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'assets'>('templates');

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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`h-full lg:h-[calc(100vh-4rem)] border-r border-white/10 bg-studio-900/95 backdrop-blur-md flex flex-col shrink-0 select-none transition-all duration-200 ease-out z-40 ${
          isOpen 
            ? 'fixed inset-y-0 left-0 w-80 max-w-[85vw] lg:relative lg:w-72 xl:w-80 lg:inset-auto overflow-y-auto shadow-2xl lg:shadow-none' 
            : 'w-0 overflow-hidden opacity-0 border-r-0 pointer-events-none hidden lg:flex'
        }`}
      >
      {/* Top Header Row with Collapse Button */}
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-studio-950/40">
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
          Templates & Assets
        </span>
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Panel"
            aria-label="Close Panel"
          >
            <X className="w-4 h-4 lg:hidden" />
            <PanelLeftClose className="w-4 h-4 hidden lg:block" />
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
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-studio-950 p-1">
          <button onClick={() => setActiveTab('templates')} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'templates' ? 'bg-studio-700 text-white' : 'text-slate-400 hover:text-white'}`}>Templates</button>
          <button onClick={() => setActiveTab('assets')} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'assets' ? 'bg-studio-700 text-white' : 'text-slate-400 hover:text-white'}`}>Assets</button>
        </div>

        {activeTab === 'templates' && <div className="p-3 rounded-xl bg-studio-850 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>TEMPLATES</span>
          </div>

          <button
            onClick={onOpenExamples}
            className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Browse templates</span>
          </button>
          {onOpenAiPrompt && (
            <button
              onClick={onOpenAiPrompt}
              className="w-full py-2.5 px-3 rounded-lg border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Generate with AI</span>
            </button>
          )}
          <button onClick={() => onLoadSample(customCodeType)} className="w-full py-2 px-3 rounded-lg border border-white/10 bg-studio-800 hover:bg-studio-700 text-xs font-semibold transition-colors">Start with a sample</button>
        </div>}

        {activeTab === 'assets' && <><div className="grid grid-cols-2 gap-2">
          {onOpenFonts && (
            <button onClick={onOpenFonts} className="py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" /> Fonts
            </button>
          )}
          {onOpenStickers && (
            <button onClick={onOpenStickers} className="py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2">
              <Smile className="w-4 h-4 text-amber-400" /> Stickers
            </button>
          )}
        </div>

        {/* CUSTOM ASSET UPLOAD & GALLERY (MAX 2MB, MAX 5 FILES) */}
        <div className="p-4 rounded-xl bg-studio-850 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5" />
              <span>IMAGES</span>
            </label>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {uploadedAssets.length}/5
            </span>
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
        </div></>}

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

      </div>
    </aside>
  </>
  );
};
