import React, { useRef, useState } from 'react';
import {
  Trash2,
  ImagePlus,
  Upload,
  Check,
  LayoutTemplate,
  FileCode2,
  FolderOpen,
  AlertCircle,
  X,
  Type,
  Smile,
  Sparkles,
} from 'lucide-react';
import { UploadedAsset, ColorTheme, COLOR_THEMES } from '../types/studio';

interface Props {
  customCodeType: 'html' | 'canvas';
  onLoadSample: (type: 'html' | 'canvas') => void;
  onOpenExamples: () => void;
  onOpenFonts?: () => void;
  onOpenStickers?: () => void;
  onClearCode: () => void;
  currentTheme?: ColorTheme;
  onSelectTheme?: (theme: ColorTheme) => void;
  userImage: string | null;
  setUserImage: React.Dispatch<React.SetStateAction<string | null>>;
  useAsBackground: boolean;
  setUseAsBackground: React.Dispatch<React.SetStateAction<boolean>>;
  onInsertImageToCode: (url: string) => void;
  activeTab?: 'templates' | 'assets';
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
  currentTheme,
  onSelectTheme,
  userImage,
  setUserImage,
  useAsBackground,
  setUseAsBackground,
  onInsertImageToCode,
  activeTab,
  uploadedAssets = [],
  onAddAssets,
  onRemoveAsset,
  uploadError,
  onClearUploadError,
  onOpenAiPrompt,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [internalTab, setInternalTab] = useState<'templates' | 'assets'>('templates');
  const currentTab = activeTab ?? internalTab;

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
    <div
      className="aar-u-flex aar-u-flex-col aar-u-h-full aar-u-w-full aar-u-overflow-hidden"
      aria-label={currentTab === 'templates' ? 'Templates and canvas settings' : 'Assets and media'}
    >
      {/* Pane Header matching Pro Studio layout */}
      <div className="aar-pane-header">
        <span>Templates & Assets</span>
      </div>

      <div className="aar-studio-library aar-stack aar-u-flex-1" data-gap="3">
        {/* Hidden File Input for Custom Image Upload (max 2MB, max 5 files) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          className="aar-u-hidden"
        />

        <div className="aar-segmented aar-u-w-full" role="group" aria-label="Sidebar navigation">
          <button
            type="button"
            aria-pressed={currentTab === 'templates'}
            onClick={() => setInternalTab('templates')}
            data-size="sm"
            className="aar-u-flex-1 aar-u-justify-center"
          >
            Templates
          </button>
          <button
            type="button"
            aria-pressed={currentTab === 'assets'}
            onClick={() => setInternalTab('assets')}
            data-size="sm"
            className="aar-u-flex-1 aar-u-justify-center"
          >
            Assets
          </button>
        </div>

        {/* Tab 1: Templates */}
        {currentTab === 'templates' && (
          <div className="aar-stack" data-gap="3">
            <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-font-bold aar-u-text-xs aar-u-font-mono">
              <LayoutTemplate className="aar-u-w-3.5 aar-u-h-3.5 aar-text-muted" />
              <span>TEMPLATES</span>
            </div>

            <button
              onClick={onOpenExamples}
              className="aar-button aar-u-w-full aar-u-flex aar-u-justify-center aar-u-gap-2"
              data-variant="primary"
              data-size="sm"
            >
              <FolderOpen className="aar-u-w-3.5 aar-u-h-3.5" />
              <span>Browse templates</span>
            </button>
            {onOpenAiPrompt && (
              <button
                onClick={onOpenAiPrompt}
                className="aar-button aar-u-w-full aar-u-flex aar-u-justify-center aar-u-gap-2"
                data-variant="ai"
                data-size="sm"
              >
                <Sparkles className="aar-u-w-3.5 aar-u-h-3.5" />
                <span>Generate with AI</span>
              </button>
            )}
            <button
              onClick={() => onLoadSample(customCodeType)}
              className="aar-button aar-u-w-full"
              data-size="sm"
            >
              Start with a sample
            </button>

            {/* Canvas Art Theme Palette */}
            {currentTheme && onSelectTheme && (
              <div className="aar-u-pt-2.5 aar-u-mt-1 aar-stack" data-gap="2">
                <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-text-xs aar-u-font-mono aar-u-text-text-muted">
                  <span className="aar-u-uppercase aar-u-tracking-wider">Canvas Palette</span>
                  <span className="aar-u-text-primary aar-u-font-bold">{currentTheme.name}</span>
                </div>
                <div className="aar-u-grid aar-u-grid-cols-5 aar-u-gap-1.5">
                  {Object.values(COLOR_THEMES).map((th) => (
                    <button
                      key={th.id}
                      onClick={() => onSelectTheme(th)}
                      className={`aar-swatch aar-button aar-u-flex aar-u-justify-center ${
                        th.id === currentTheme.id ? 'aar-u-ring-2 aar-u-scale-105 ' : ''
                      }`}
                      style={{ '--aar-swatch-color': th.primary } as React.CSSProperties}
                      title={th.name}
                      data-size="sm"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Assets */}
        {currentTab === 'assets' && (
          <div className="aar-stack" data-gap="3">
            <div className="aar-u-grid aar-u-grid-cols-2 aar-u-gap-2">
              {onOpenFonts && (
                <button onClick={onOpenFonts} className="aar-button aar-u-flex aar-u-justify-center aar-u-gap-2" data-size="sm">
                  <Type className="aar-u-w-4 aar-u-h-4 aar-u-text-primary" /> Fonts
                </button>
              )}
              {onOpenStickers && (
                <button onClick={onOpenStickers} className="aar-button aar-u-flex aar-u-justify-center aar-u-gap-2" data-size="sm">
                  <Smile className="aar-u-w-4 aar-u-h-4 aar-u-text-amber-400" /> Stickers
                </button>
              )}
            </div>

            {/* CUSTOM ASSET UPLOAD & GALLERY (MAX 2MB, MAX 5 FILES) */}
            <div className="aar-file-intake aar-stack" data-gap="3">
              <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                <label className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-font-bold aar-u-flex aar-u-items-center aar-u-gap-1.5">
                  <ImagePlus className="aar-u-w-3.5 aar-u-h-3.5 aar-text-muted" />
                  <span>IMAGES</span>
                </label>
                <span className="aar-badge">
                  {uploadedAssets.length}/5
                </span>
              </div>

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="aar-u-p-2.5 aar-u-rounded aar-u-bg-rose-950-80 aar-u-text-rose-200 aar-u-text-xs aar-u-flex aar-u-items-start aar-u-gap-2 aar-u-animate-in aar-u-fade-in aar-u-duration-150">
                  <AlertCircle className="aar-u-w-4 aar-u-h-4 aar-u-text-rose-400 aar-u-shrink-0 aar-u-mt-0.5" />
                  <div className="aar-u-flex-1 aar-u-text-sm aar-u-leading-tight">{uploadError}</div>
                  {onClearUploadError && (
                    <button
                      onClick={onClearUploadError}
                      className="aar-button"
                      title="Dismiss error" data-size="sm"
                    >
                      <X className="aar-u-w-3.5 aar-u-h-3.5" />
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
                  role="button" tabIndex={0} aria-label="Upload images"
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInputRef.current?.click(); } }}
                  className="aar-dropzone" data-drag-active={isDragging}
                >
                  <Upload className="aar-u-w-5 aar-u-h-5 aar-u-text-primary aar-u-transition-transform" />
                  <span className="aar-u-text-xs aar-u-font-semibold">
                    Upload Image ({5 - uploadedAssets.length} slot{5 - uploadedAssets.length > 1 ? 's' : ''} left)
                  </span>
                  <span className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono">
                    PNG, JPG, SVG, WebP • Max 2MB
                  </span>
                </div>
              ) : (
                <div className="aar-u-p-2.5 aar-u-rounded aar-u-bg-amber-500-10 aar-u-text-amber-300 aar-u-text-sm aar-u-font-mono aar-u-text-center">
                  Max 5 assets reached. Remove one to upload more.
                </div>
              )}

              {/* Uploaded Assets List */}
              {uploadedAssets.length > 0 && (
                <div className="aar-u-space-y-2 aar-u-pt-1">
                  {uploadedAssets.map((asset) => {
                    const isCurrentBg = userImage === asset.url && useAsBackground;
                    return (
                      <div
                        key={asset.id}
                        className="aar-u-p-2.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-space-y-2 aar-u-transition-all"
                      >
                        <div className="aar-u-flex aar-u-items-center aar-u-gap-2.5">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="aar-u-w-10 aar-u-h-10 aar-u-rounded aar-u-object-cover aar-u-shrink-0 aar-u-bg-black-40"
                          />
                          <div className="aar-u-flex-1 aar-u-min-w-0">
                            <div className="aar-u-text-xs aar-u-font-semibold aar-u-text-text aar-u-truncate" title={asset.name}>
                              {asset.name}
                            </div>
                            <div className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono">
                              {formatSize(asset.size)}
                            </div>
                          </div>
                          {onRemoveAsset && (
                            <button
                              onClick={() => onRemoveAsset(asset.id)}
                              className="aar-button"
                              title="Delete asset" data-size="sm"
                            >
                              <Trash2 className="aar-u-w-3.5 aar-u-h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Quick actions for this asset */}
                        <div className="aar-u-grid aar-u-grid-cols-2 aar-u-gap-1.5 aar-u-pt-1">
                          <button
                            onClick={() => {
                              if (userImage === asset.url && useAsBackground) {
                                setUseAsBackground(false);
                              } else {
                                setUserImage(asset.url);
                                setUseAsBackground(true);
                              }
                            }}
                            className={`aar-button aar-u-flex aar-u-justify-center aar-u-gap-1 ${
                              isCurrentBg
                                ? 'aar-u-bg-emerald-500-20 aar-u-text-emerald-300'
                                : 'aar-u-bg-surface-raised aar-u-text-text aar-u-hover-text-text'
                            }`}
                            title="Toggle as canvas background" data-size="sm"
                          >
                            <Check className={`aar-u-w-3 aar-u-h-3 ${isCurrentBg ? 'aar-u-opacity-100 aar-u-text-emerald-400' : 'aar-u-opacity-30'}`} />
                            <span>{isCurrentBg ? 'Bg: Active' : 'Set Bg'}</span>
                          </button>

                          <button
                            onClick={() => onInsertImageToCode(asset.url)}
                            className="aar-button aar-u-flex aar-u-justify-center aar-u-gap-1" data-variant="primary"
                            title="Inject <img> tag into code" data-size="sm"
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
          </div>
        )}

        {/* Canvas Quick Actions */}
        <div className="aar-u-pt-3 aar-u-mt-auto aar-stack" data-gap="2">
          <label className="aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-text-text-muted aar-u-font-bold aar-u-block">
            Canvas Quick Actions
          </label>
          <div className="aar-u-grid aar-u-grid-cols-2 aar-u-gap-2">
            <button
              onClick={onClearCode}
              className="aar-button aar-u-flex aar-u-justify-center aar-u-gap-1.5"
              title="Clear code to empty canvas"
              data-size="sm"
            >
              <Trash2 className="aar-u-w-3.5 aar-u-h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={() => onLoadSample(customCodeType)}
              className="aar-button aar-u-flex aar-u-justify-center aar-u-gap-1.5"
              data-variant="quiet"
              title="Load starter sample"
              data-size="sm"
            >
              <FileCode2 className="aar-u-w-3.5 aar-u-h-3.5" />
              <span>Load Starter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
