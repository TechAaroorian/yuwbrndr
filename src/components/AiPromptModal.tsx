import React, { useState, useRef } from 'react';
import {
  Bot,
  X,
  Copy,
  Check,
  Code2,
  Layers,
  Palette,
  Layout,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Shield,
  Link2,
  ListFilter,
  FileText,
  Zap,
  Scale
} from 'lucide-react';
import { AspectPreset, ASPECT_PRESETS, ColorTheme, COLOR_THEMES } from '../types/studio';
import {
  buildYuwbrndrAiPrompt,
  DesignArchetype,
  ARCHETYPE_LABELS,
  PromptIntent,
  detectPromptIntent
} from '../utils/aiPromptGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: AspectPreset;
  onSelectPreset: (preset: AspectPreset) => void;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  customCodeType: 'html' | 'canvas';
  onSelectCodeType: (type: 'html' | 'canvas') => void;
  onApplyGeneratedCode?: (code: string, type: 'html' | 'canvas') => void;
}

const SAMPLE_IDEAS = [
  {
    label: 'Plain Text: Comparison',
    text: 'Promise.all vs Promise.allSettled concurrency guide with fail-fast scenario and visual code snippets',
  },
  {
    label: 'Bullet Points: Benchmark',
    text: `• Next.js 15 Partial Prerendering (PPR)\n• Combines static shell with streaming dynamic holes\n• Cache hit ratio 94% with P99 < 80ms\n• Reduces origin server load by 60%`,
  },
  {
    label: 'Architecture: Pipeline',
    text: 'Event-driven architecture with Kafka: Producer -> Broker topic partition -> Consumer group with dead letter queue',
  },
  {
    label: 'Documentation URL',
    text: 'https://react.dev/reference/react/useActionState',
  },
];

const INTENT_OPTIONS: { id: PromptIntent; label: string }[] = [
  { id: 'auto', label: '⚡ Auto-Detect' },
  { id: 'comparison', label: '⚖️ Comparison' },
  { id: 'architecture', label: '🏗️ Architecture' },
  { id: 'benchmark', label: '📊 Benchmarks' },
  { id: 'release', label: '🚀 Release' },
  { id: 'concept', label: '💡 Concept' },
];

const AiPromptModalDialog: React.FC<Props> = ({
  onClose,
  currentPreset,
  onSelectPreset,
  currentTheme,
  onSelectTheme,
  customCodeType,
  onSelectCodeType,
  onApplyGeneratedCode,
}) => {
  const [selectedEngine, setSelectedEngine] = useState<'html' | 'canvas'>(customCodeType);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentPreset.id);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentTheme.id);
  const [selectedArchetype, setSelectedArchetype] = useState<DesignArchetype>('infographic');
  const [selectedIntent, setSelectedIntent] = useState<PromptIntent>('auto');
  const [instruction, setInstruction] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [testCode, setTestCode] = useState<string>('');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const activePreset = ASPECT_PRESETS.find((p) => p.id === selectedPresetId) || currentPreset;
  const activeTheme = COLOR_THEMES[selectedThemeId] || currentTheme;

  // Real-time intent detection
  const detected = detectPromptIntent(instruction, selectedIntent);
  const isUrl = /https?:\/\/[^\s]+/i.test(instruction.trim());
  const isBullets = /^\s*[-*•]\s+/m.test(instruction.trim());

  const handleGeneratePrompt = () => {
    const prompt = buildYuwbrndrAiPrompt({
      engine: selectedEngine,
      preset: activePreset,
      theme: activeTheme,
      userInstruction: instruction,
      styleArchetype: selectedArchetype,
      intent: selectedIntent,
    });
    setGeneratedPrompt(prompt);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = generatedPrompt;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy AI prompt', error);
    }
  };

  const handleApplyCode = () => {
    if (!testCode.trim() || !onApplyGeneratedCode) return;
    // Extract code from inside code blocks if user pasted full markdown
    let cleanedCode = testCode.trim();
    const codeBlockMatch = cleanedCode.match(/```(?:html|javascript|js)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      cleanedCode = codeBlockMatch[1].trim();
    }

    onSelectPreset(activePreset);
    onSelectTheme(activeTheme);
    onSelectCodeType(selectedEngine);
    onApplyGeneratedCode(cleanedCode, selectedEngine);
    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="aar-u-fixed aar-u-inset-0 aar-u-z--80 aar-u-bg-black-75 aar-u-p-3 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-animate-in aar-u-fade-in aar-u-duration-200 aar-u-select-none"
      onMouseDown={onClose}
    >
      <section
        className="aar-u-w-full aar-u-max-w-5xl aar-u-max-h--90vh aar-u-overflow-hidden aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-surface aar-u-flex aar-u-flex-col aar-u-text-text"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="aar-u-flex aar-u-items-start aar-u-justify-between aar-u-gap-4 aar-u-border-b aar-u-border-border aar-u-bg-surface aar-u-px-5 aar-u-py-4 aar-u-shrink-0">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-3">
            <div className="aar-u-w-10 aar-u-h-10 aar-u-rounded aar-u-bg-surface-subtle aar-u-border aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-center aar-u-text-primary aar-u-shrink-0">
              <Bot className="aar-u-w-5 aar-u-h-5" />
            </div>
            <div>
              <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-flex-wrap">
                <h2 className="aar-u-text-base aar-u-font-bold aar-u-text-text aar-u-tracking-tight">
                  Intent-Driven AI Prompts
                </h2>
                <span className="aar-u-px-2 aar-u-py-0.5 aar-u-text-xs aar-u-font-mono aar-u-font-semibold aar-u-rounded aar-u-bg-indigo-500-20 aar-u-text-primary aar-u-border aar-u-border-indigo-500-30">
                  Design by Code · Design to All
                </span>
                <span className="aar-u-px-2 aar-u-py-0.5 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-rounded aar-u-bg-cyan-500-20 aar-u-text-primary aar-u-border aar-u-border-cyan-500-30">
                  Yuwbrndr Specs
                </span>
              </div>
              <p className="aar-u-text-xs aar-u-text-text-muted aar-u-mt-0.5 aar-u-max-w-2xl">
                Provide plain text, bullet points, or a documentation URL. Yuwbrndr translates that intent into structured code with built-in visual hierarchy, contrast ratios, and safe-zone margins.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="aar-button"
            aria-label="Close modal"
            data-variant="flat"
            data-size="sm"
          >
            <X className="aar-u-w-5 aar-u-h-5" />
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div className="aar-u-p-5 aar-u-space-y-5 aar-u-flex-1 aar-u-overflow-y-auto aar-u-min-h-0">
          {/* Section 1: Intent & Content Input at Top */}
          <div className="aar-u-space-y-3 aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-background aar-u-p-4">
            <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-flex-wrap aar-u-gap-2">
              <label className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-text-text">
                <Lightbulb className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-amber-400" />
                <span>Intent & Content Input</span>
              </label>

              {/* Real-time Format Badge */}
              <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5">
                {isUrl ? (
                  <span className="aar-u-flex aar-u-items-center aar-u-gap-1 aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-text-xs aar-u-font-mono aar-u-bg-surface-subtle aar-u-text-primary aar-u-border aar-u-border-border">
                    <Link2 className="aar-u-w-3 aar-u-h-3" /> URL Mode
                  </span>
                ) : isBullets ? (
                  <span className="aar-u-flex aar-u-items-center aar-u-gap-1 aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-text-xs aar-u-font-mono aar-u-bg-surface-subtle aar-u-text-primary aar-u-border aar-u-border-border">
                    <ListFilter className="aar-u-w-3 aar-u-h-3" /> Bullets Mode
                  </span>
                ) : (
                  <span className="aar-u-flex aar-u-items-center aar-u-gap-1 aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-text-xs aar-u-font-mono aar-u-bg-surface-subtle aar-u-text-text aar-u-border aar-u-border-border">
                    <FileText className="aar-u-w-3 aar-u-h-3" /> Plain Text
                  </span>
                )}
                <span className="aar-u-px-2 aar-u-py-0.5 aar-u-rounded aar-u-text-xs aar-u-font-mono aar-u-font-semibold aar-u-bg-surface-subtle aar-u-text-success aar-u-border aar-u-border-border">
                  {detected.label}
                </span>
              </div>
            </div>

            {/* Intent Selector Bar */}
            <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-flex-wrap">
              <span className="aar-u-text-xs aar-u-font-mono aar-u-text-text-muted aar-u-uppercase aar-u-mr-1">Layout Intent:</span>
              {INTENT_OPTIONS.map((item) => {
                const isActive = selectedIntent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIntent(item.id)}
                    className="aar-button"
                    data-variant={isActive ? 'primary' : 'flat'}
                    data-size="sm"
                    aria-pressed={isActive}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Input Textarea */}
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Paste raw text, bullet points (e.g. • Feature 1 • Metric 2), or a documentation URL..."
              className="aar-textarea"
            />

            {/* Quick Sample Prompts & Guarantees bar */}
            <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-2 aar-u-flex-wrap aar-u-pt-1">
              <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-flex-wrap">
                <span className="aar-u-text-xs aar-u-font-mono aar-u-text-text-muted aar-u-uppercase">Try quick format:</span>
                {SAMPLE_IDEAS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInstruction(sample.text)}
                    className="aar-button"
                    data-variant="flat"
                    data-size="sm"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <div className="aar-u-flex aar-u-items-center aar-u-gap-3 aar-u-text-xs aar-u-text-text-muted aar-u-flex-wrap">
                <div className="aar-u-flex aar-u-items-center aar-u-gap-1">
                  <Zap className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-amber-400 aar-u-shrink-0" />
                  <span>5 Levels</span>
                </div>
                <div className="aar-u-flex aar-u-items-center aar-u-gap-1">
                  <Scale className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-success aar-u-shrink-0" />
                  <span>WCAG 4.5:1+</span>
                </div>
                <div className="aar-u-flex aar-u-items-center aar-u-gap-1">
                  <Shield className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary aar-u-shrink-0" />
                  <span>Safe Zones</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Specifications 2-Column Grid */}
          <div className="aar-u-grid aar-u-grid-cols-1 aar-u-md-grid-cols-2 aar-u-gap-5 aar-u-items-start">
            {/* Left Column: Screen Ratio & Rendering Engine */}
            <div className="aar-u-space-y-4 aar-u-min-w-0">
              {/* Target Screen Ratio */}
              <div>
                <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-mb-2">
                  <label className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-text-text">
                    <Layout className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary" />
                    <span>Target Screen Ratio & Safe Zone</span>
                  </label>
                  <span className="aar-u-text-xs aar-u-font-mono aar-u-text-primary">
                    {activePreset.aspectRatio} · {activePreset.width}×{activePreset.height}px
                  </span>
                </div>

                <div className="aar-u-grid aar-u-grid-cols-2 aar-u-gap-2">
                  {ASPECT_PRESETS.map((p) => {
                    const isSelected = p.id === selectedPresetId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPresetId(p.id)}
                        className={`aar-button aar-u-w-full aar-u-flex aar-u-flex-col aar-u-items-stretch aar-u-text-left aar-u-p-2 aar-u-border aar-u-border-border ${
                          isSelected
                            ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-ring-1 aar-u-ring-indigo-500-50'
                            : 'aar-u-bg-background aar-u-text-text aar-u-hover-bg-surface-subtle'
                        }`}
                        data-size="sm"
                      >
                        <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-1 aar-u-w-full">
                          <span className="aar-u-text-xs aar-u-font-semibold aar-u-truncate">{p.name}</span>
                          <span className="aar-u-text-xs aar-u-font-mono aar-u-px-1.5 aar-u-py-0.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-text-primary aar-u-shrink-0">
                            {p.aspectRatio}
                          </span>
                        </div>
                        <div className="aar-u-text-xs aar-u-text-text-muted aar-u-font-mono aar-u-mt-1">
                          {p.width} × {p.height} px
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Platform Safe Zone Notice */}
                {activePreset.safeZone && (
                  <div className="aar-u-mt-2 aar-u-flex aar-u-items-start aar-u-gap-2 aar-u-p-2.5 aar-u-rounded aar-u-bg-surface-subtle aar-u-border aar-u-border-border aar-u-text-xs aar-u-text-text">
                    <Shield className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary aar-u-shrink-0 aar-u-mt-0.5" />
                    <span className="aar-u-leading-relaxed">
                      <strong className="aar-u-font-semibold aar-u-text-text">Safe-Zone:</strong>{' '}
                      <span className="aar-u-text-text-muted">{activePreset.safeZone}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Rendering Engine: HTML vs Canvas */}
              <div>
                <label className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-text-text aar-u-mb-2">
                  <Code2 className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary" />
                  <span>Rendering Engine</span>
                </label>
                <div className="aar-u-grid aar-u-grid-cols-2 aar-u-gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('html')}
                    className={`aar-button aar-u-w-full aar-u-flex aar-u-flex-col aar-u-items-stretch aar-u-text-left aar-u-p-2.5 aar-u-border aar-u-border-border ${
                      selectedEngine === 'html'
                        ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-ring-1 aar-u-ring-cyan-500-40'
                        : 'aar-u-bg-background aar-u-text-text aar-u-hover-bg-surface-subtle'
                    }`}
                    data-size="sm"
                  >
                    <div className="aar-u-font-bold aar-u-text-xs aar-u-flex aar-u-items-center aar-u-gap-1.5">
                      <span className="aar-u-w-2 aar-u-h-2 aar-u-rounded-full aar-u-bg-cyan-400 aar-u-shrink-0" />
                      <span>HTML + Tailwind CSS</span>
                    </div>
                    <p className="aar-u-text-xs aar-u-text-text-muted aar-u-mt-1 aar-u-leading-snug">
                      UnoCSS Wind4 runtime utilities, flex/grid layouts, inline SVGs.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEngine('canvas')}
                    className={`aar-button aar-u-w-full aar-u-flex aar-u-flex-col aar-u-items-stretch aar-u-text-left aar-u-p-2.5 aar-u-border aar-u-border-border ${
                      selectedEngine === 'canvas'
                        ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-ring-1 aar-u-ring-indigo-500-40'
                        : 'aar-u-bg-background aar-u-text-text aar-u-hover-bg-surface-subtle'
                    }`}
                    data-size="sm"
                  >
                    <div className="aar-u-font-bold aar-u-text-xs aar-u-flex aar-u-items-center aar-u-gap-1.5">
                      <span className="aar-u-w-2 aar-u-h-2 aar-u-rounded-full aar-u-bg-indigo-400 aar-u-shrink-0" />
                      <span>Canvas 2D JS</span>
                    </div>
                    <p className="aar-u-text-xs aar-u-text-text-muted aar-u-mt-1 aar-u-leading-snug">
                      Runs in isolated sandbox via (canvas, ctx, width, height).
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Style Archetype & Color Palette */}
            <div className="aar-u-space-y-4 aar-u-min-w-0">
              {/* Style Archetype */}
              <div>
                <label className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-text-text aar-u-mb-2">
                  <Layers className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary" />
                  <span>Design Layout Archetype</span>
                </label>
                <div className="aar-u-space-y-1.5">
                  {(Object.keys(ARCHETYPE_LABELS) as DesignArchetype[]).map((arch) => {
                    const info = ARCHETYPE_LABELS[arch];
                    const isSelected = selectedArchetype === arch;
                    return (
                      <button
                        key={arch}
                        type="button"
                        onClick={() => setSelectedArchetype(arch)}
                        className={`aar-button aar-u-w-full aar-u-flex aar-u-items-center aar-u-justify-between aar-u-text-left aar-u-p-2 aar-u-border aar-u-border-border ${
                          isSelected
                            ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-font-medium aar-u-ring-1 aar-u-ring-indigo-500-50'
                            : 'aar-u-bg-background aar-u-text-text aar-u-hover-bg-surface-subtle'
                        }`}
                        data-size="sm"
                      >
                        <div className="aar-u-flex-1 aar-u-min-w-0 aar-u-pr-2">
                          <div className="aar-u-font-semibold aar-u-text-xs aar-u-text-text aar-u-truncate">{info.name}</div>
                          <div className="aar-u-text-xs aar-u-text-text-muted aar-u-truncate">
                            {info.description}
                          </div>
                        </div>
                        {isSelected && <Check className="aar-u-w-4 aar-u-h-4 aar-u-text-primary aar-u-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <label className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-text-text aar-u-mb-2">
                  <Palette className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary" />
                  <span>Color Palette</span>
                </label>
                <div className="aar-u-flex aar-u-flex-wrap aar-u-gap-2">
                  {Object.values(COLOR_THEMES).map((th) => {
                    const isSelected = selectedThemeId === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setSelectedThemeId(th.id)}
                        className={`aar-button aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-border aar-u-border-border ${
                          isSelected
                            ? 'aar-u-bg-surface-subtle aar-u-text-text aar-u-ring-1 aar-u-ring-indigo-500-50'
                            : 'aar-u-bg-background aar-u-text-text aar-u-hover-bg-surface-subtle'
                        }`}
                        data-size="sm"
                        aria-pressed={isSelected}
                      >
                        <span
                          className="aar-swatch aar-u-w-3 aar-u-h-3 aar-u-rounded-full aar-u-border aar-u-border-border aar-u-shrink-0"
                          style={{ '--aar-swatch-color': th.primary } as React.CSSProperties}
                        />
                        <span className="aar-u-text-xs aar-u-font-medium">{th.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Generated Output Card */}
          {generatedPrompt && (
            <div
              ref={outputRef}
              className="aar-u-rounded aar-u-border aar-u-border-cyan-500-30 aar-u-bg-background aar-u-p-4 aar-u-space-y-3 aar-u-animate-in aar-u-fade-in aar-u-slide-in-from-bottom-2 aar-u-duration-200"
            >
              <div className="aar-u-flex aar-u-items-center aar-u-justify-between aar-u-border-b aar-u-border-border aar-u-pb-3 aar-u-flex-wrap aar-u-gap-2">
                <div className="aar-u-flex aar-u-items-center aar-u-gap-2">
                  <span className="aar-u-w-2.5 aar-u-h-2.5 aar-u-rounded-full aar-u-bg-emerald-400 aar-u-animate-pulse" />
                  <span className="aar-u-text-xs aar-u-font-mono aar-u-font-bold aar-u-uppercase aar-u-tracking-wider aar-u-text-success">
                    Instruction Prompt Ready for AI
                  </span>
                  <span className="aar-u-text-xs aar-u-font-mono aar-u-text-text-muted">
                    ({activePreset.width}×{activePreset.height} · {selectedEngine.toUpperCase()})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="aar-button aar-u-flex aar-u-items-center aar-u-gap-1.5"
                  data-variant={copied ? 'quiet' : 'primary'}
                  data-size="sm"
                >
                  {copied ? (
                    <>
                      <Check className="aar-u-w-3.5 aar-u-h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="aar-u-w-3.5 aar-u-h-3.5" />
                      <span>Copy Prompt for AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions notice */}
              <p className="aar-u-text-xs aar-u-text-text aar-u-leading-relaxed aar-u-bg-surface-subtle aar-u-p-2 aar-u-rounded aar-u-border aar-u-border-border">
                💡 <strong>How to use:</strong> Copy the text below and paste it into <strong>ChatGPT, Claude, Gemini, Cursor, or v0</strong>. The generated code can be pasted back into Yuwbrndr&apos;s code editor or tested below.
              </p>

              {/* Prompt Text Preview Box */}
              <div className="aar-u-relative">
                <textarea
                  readOnly
                  rows={7}
                  value={generatedPrompt}
                  className="aar-textarea"
                />
              </div>

              {/* Instant Paste & Apply Back Option */}
              <div className="aar-u-pt-2 aar-u-border-t aar-u-border-border aar-u-space-y-2">
                <div className="aar-u-flex aar-u-items-center aar-u-justify-between">
                  <span className="aar-u-text-xs aar-u-font-mono aar-u-text-text aar-u-font-semibold">
                    Paste AI-generated code to test immediately:
                  </span>
                  {appliedNotice && (
                    <span className="aar-u-text-xs aar-u-font-bold aar-u-text-success aar-u-flex aar-u-items-center aar-u-gap-1">
                      <CheckCircle2 className="aar-u-w-3.5 aar-u-h-3.5" /> Applied to Canvas!
                    </span>
                  )}
                </div>
                <div className="aar-u-flex aar-u-gap-2">
                  <input
                    type="text"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    placeholder="Paste AI response code here (or snippet)..."
                    className="aar-input"
                    data-size="sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCode}
                    disabled={!testCode.trim()}
                    className="aar-button aar-u-shrink-0"
                    data-size="sm"
                  >
                    Apply to Canvas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Fixed Generate Text Button at Bottom */}
        <footer className="aar-u-shrink-0 aar-u-border-t aar-u-border-border aar-u-bg-surface aar-u-px-5 aar-u-py-3 aar-u-flex aar-u-items-center aar-u-justify-between aar-u-gap-4 aar-u-z-20">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-xs aar-u-font-mono aar-u-text-text-muted aar-u-flex-wrap">
            <span className="aar-u-font-semibold aar-u-text-text">{activePreset.name}</span>
            <span>({activePreset.aspectRatio})</span>
            <span>·</span>
            <span className="aar-u-uppercase">{selectedEngine}</span>
            <span>·</span>
            <span>{activeTheme.name}</span>
          </div>

          <div className="aar-u-flex aar-u-items-center aar-u-gap-3 aar-u-shrink-0">
            {generatedPrompt && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="aar-button aar-u-flex aar-u-items-center aar-u-gap-1.5"
                data-variant={copied ? 'quiet' : 'flat'}
                data-size="sm"
              >
                {copied ? (
                  <>
                    <Check className="aar-u-w-3.5 aar-u-h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="aar-u-w-3.5 aar-u-h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleGeneratePrompt}
              className="aar-button aar-u-flex aar-u-items-center aar-u-gap-2"
              data-variant="primary"
              data-size="sm"
            >
              <Bot className="aar-u-w-4 aar-u-h-4" />
              <span>Generate Structured Code Instruction</span>
              <ArrowRight className="aar-u-w-4 aar-u-h-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export const AiPromptModal: React.FC<Props> = (props) => {
  if (!props.isOpen) return null;
  return (
    <AiPromptModalDialog
      {...props}
      key={`${props.currentPreset.id}-${props.customCodeType}-${props.currentTheme.id}`}
    />
  );
};

