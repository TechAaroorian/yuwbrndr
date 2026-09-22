import React, { useState, useRef } from 'react';
import {
  Sparkles,
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
      className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200 select-none overflow-y-auto"
      onMouseDown={onClose}
    >
      <section
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-studio-900 shadow-2xl flex flex-col text-slate-100"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-studio-900/95 backdrop-blur-md px-5 sm:px-7 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-studio-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Intent-Driven AI Prompts
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Design by Code · Design to All
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Yuwbrndr Specs
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Provide plain text, bullet points, or a documentation URL. Yuwbrndr translates that intent into structured code with built-in visual hierarchy, contrast ratios, and safe-zone margins.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* STEP 1: Core Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Ratio & Engine */}
            <div className="space-y-4">
              {/* Screen Ratio & Platform */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
                    <Layout className="w-3.5 h-3.5 text-indigo-400" />
                    <span>1. Target Screen Ratio & Safe Zone</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {activePreset.aspectRatio} · {activePreset.width}×{activePreset.height}px
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ASPECT_PRESETS.map((p) => {
                    const isSelected = p.id === selectedPresetId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPresetId(p.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-sm ring-1 ring-indigo-500/50'
                            : 'border-white/10 bg-studio-850 text-slate-300 hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold truncate">{p.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 shrink-0">
                            {p.aspectRatio}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {p.width} × {p.height} px
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Platform Safe Zone Notice */}
                {activePreset.safeZone && (
                  <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200">
                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-indigo-300">Safe-Zone:</strong> {activePreset.safeZone}
                    </span>
                  </div>
                )}
              </div>

              {/* Rendering Engine: HTML vs Canvas */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300 mb-2">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Rendering Engine</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('html')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedEngine === 'html'
                        ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-sm ring-1 ring-cyan-500/40'
                        : 'border-white/10 bg-studio-850 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      HTML + Tailwind CSS
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      UnoCSS Wind4 runtime utilities, flex/grid layouts, inline SVGs. (No &lt;script&gt;).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEngine('canvas')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedEngine === 'canvas'
                        ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : 'border-white/10 bg-studio-850 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Canvas 2D JS (Advanced)
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      Runs in isolated sandbox via (canvas, ctx, width, height). Geometric & isometric graphics.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Style Archetype, Theme Palette, and Idea Presets */}
            <div className="space-y-4">
              {/* Style Archetype */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300 mb-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3. Design Layout Archetype</span>
                </label>
                <div className="space-y-1.5">
                  {(Object.keys(ARCHETYPE_LABELS) as DesignArchetype[]).map((arch) => {
                    const info = ARCHETYPE_LABELS[arch];
                    const isSelected = selectedArchetype === arch;
                    return (
                      <button
                        key={arch}
                        type="button"
                        onClick={() => setSelectedArchetype(arch)}
                        className={`w-full p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-500/60 bg-indigo-500/20 text-white font-medium'
                            : 'border-white/10 bg-studio-850 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{info.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[280px]">
                            {info.description}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300 mb-2">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4. Color Palette</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(COLOR_THEMES).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedThemeId(th.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                        selectedThemeId === th.id
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-studio-850 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: th.primary }}
                      />
                      <span>{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Intent Selection & User Input */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-studio-950/60 p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Intent Translation & Input</span>
              </label>

              {/* Real-time Format Badge */}
              <div className="flex items-center gap-1.5">
                {isUrl ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <Link2 className="w-3 h-3" /> URL Mode
                  </span>
                ) : isBullets ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <ListFilter className="w-3 h-3" /> Bullet Points Mode
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 border border-white/15">
                    <FileText className="w-3 h-3" /> Plain Text Mode
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {detected.label}
                </span>
              </div>
            </div>

            {/* Intent Selector Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Layout Intent:</span>
              {INTENT_OPTIONS.map((item) => {
                const isActive = selectedIntent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIntent(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-studio-850 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
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
              className="w-full rounded-xl border border-white/15 bg-studio-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
            />

            {/* Quick Sample Prompts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Try quick format:</span>
              {SAMPLE_IDEAS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(sample.text)}
                  className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Built-in Guarantees Pill Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Visual Hierarchy:</strong> 5 strict levels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Contrast:</strong> WCAG 4.5:1+ guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span><strong>Safe Zones:</strong> Platform overlay proof</span>
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            type="button"
            onClick={handleGeneratePrompt}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Generate Structured Code Instruction for AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* STEP 3: Generated Output Card */}
          {generatedPrompt && (
            <div
              ref={outputRef}
              className="rounded-2xl border border-cyan-500/30 bg-studio-950/80 p-4 sm:p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Instruction Prompt Ready for AI
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({activePreset.width}×{activePreset.height} · {selectedEngine.toUpperCase()})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt for AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions notice */}
              <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/10">
                💡 <strong>How to use:</strong> Copy the text below and paste it into <strong>ChatGPT, Claude, Gemini, Cursor, or v0</strong>. The generated code can be pasted back into Yuwbrndr&apos;s code editor or tested below.
              </p>

              {/* Prompt Text Preview Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={generatedPrompt}
                  className="w-full rounded-xl border border-white/10 bg-studio-900/90 p-3 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none resize-none select-text"
                />
              </div>

              {/* Instant Paste & Apply Back Option */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    Paste AI-generated code to test immediately:
                  </span>
                  {appliedNotice && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied to Canvas!
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    placeholder="Paste AI response code here (or snippet)..."
                    className="flex-1 rounded-lg border border-white/10 bg-studio-900 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCode}
                    disabled={!testCode.trim()}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    Apply to Canvas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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

