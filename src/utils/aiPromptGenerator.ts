import { AspectPreset, ColorTheme } from '../types/studio';

export type DesignArchetype =
  | 'sketch'
  | 'cheatsheet'
  | 'architecture'
  | 'comparison'
  | 'infographic'
  | 'bento'
  | 'announcement'
  | 'minimalist';

export type PromptIntent =
  | 'auto'
  | 'comparison'
  | 'architecture'
  | 'benchmark'
  | 'release'
  | 'concept';

export interface DetectedIntentInfo {
  intent: PromptIntent;
  label: string;
  recommendedLayout: string;
  hierarchyGuide: string;
  structuralPattern: string;
}

export interface AiPromptOptions {
  engine: 'html' | 'canvas';
  preset: AspectPreset;
  theme: ColorTheme;
  userInstruction: string;
  styleArchetype?: DesignArchetype;
  intent?: PromptIntent;
  includeCodeExample?: boolean;
}

export const ARCHETYPE_LABELS: Record<DesignArchetype, { name: string; description: string }> = {
  sketch: {
    name: '2D Hand-Drawn & Sketch Art (Mixed HTML + Rough.js)',
    description: 'Organic hand-drawn sketchy borders, Rough.js hatched fills & shapes, Comic Neue/Caveat typography, and 2D ink aesthetic.',
  },
  cheatsheet: {
    name: 'Numbered Step-by-Step Cheatsheet (Library Showcase)',
    description: 'Structured 6-step developer guide with numbered color badges, code snippets with file tabs, and live UI preview mockups.',
  },
  architecture: {
    name: 'Technical Architecture & Pipeline',
    description: 'Rich system dataflow diagram with terminal windows, protocol badges, sequence arrows, and code insets.',
  },
  comparison: {
    name: 'Side-by-Side Comparison Matrix',
    description: 'Two-column contrast showing flawed vs secure patterns with syntax code blocks and takeaway banner.',
  },
  infographic: {
    name: 'Technical Infographic / Deep-Dive',
    description: 'Structured technical guide with numbered points, code snippets, mental models, and takeaway banners.',
  },
  bento: {
    name: 'Bento Grid System',
    description: 'Modern multi-tile bento layout highlighting key metrics, latency, security guarantees, and status badges.',
  },
  announcement: {
    name: 'Release / Feature Card',
    description: 'High-impact product update, release notes, or milestone card with version pills and CLI commands.',
  },
  minimalist: {
    name: 'Minimalist & Clean',
    description: 'Understated high-contrast developer layout focusing on bold typography, code tokens, and crisp borders.',
  },
};

export function detectPromptIntent(input: string, explicitIntent: PromptIntent = 'auto'): DetectedIntentInfo {
  const text = input.trim().toLowerCase();
  let resolved: PromptIntent = explicitIntent;

  if (explicitIntent === 'auto') {
    if (/https?:\/\/[^\s]+/i.test(text)) {
      resolved = 'concept';
    } else if (/\b(vs|versus|compare|comparison|difference|against|pros and cons|anti-pattern)\b/i.test(text)) {
      resolved = 'comparison';
    } else if (/\b(architecture|pipeline|flow|lifecycle|diagram|gateway|microservice|layer|routing)\b/i.test(text)) {
      resolved = 'architecture';
    } else if (/\b(benchmark|latency|throughput|p99|rps|metric|speed|stats|performance|qps|sla)\b/i.test(text)) {
      resolved = 'benchmark';
    } else if (/\b(release|v[0-9]+\.|launch|announcement|changelog|new feature|update|milestone)\b/i.test(text)) {
      resolved = 'release';
    } else {
      resolved = 'concept';
    }
  }

  const INTENT_METADATA: Record<PromptIntent, { label: string; recommendedLayout: string; hierarchyGuide: string; structuralPattern: string }> = {
    auto: {
      label: 'Auto-Detect',
      recommendedLayout: 'Clean Structured Layout',
      hierarchyGuide: 'Hero Headline, 2 Structured Content Cards, and Takeaway Footer.',
      structuralPattern: 'Organized sections with clear categorical tags and code callouts.',
    },
    comparison: {
      label: '⚖️ Technical Comparison (X vs Y)',
      recommendedLayout: '2-Column Contrast Matrix',
      hierarchyGuide: 'Level 1: Comparison Title (A vs B) · Level 2: Left Flawed/Alternative Column vs Right Recommended/Modern Column with matching code tokens · Level 3: Bottom "Rule of Thumb" takeaway banner.',
      structuralPattern: 'Side-by-side cards comparing inputs, execution guarantees, trade-offs, and sample code.',
    },
    architecture: {
      label: '🏗️ System Architecture & Dataflow',
      recommendedLayout: 'Linear Dataflow Pipeline',
      hierarchyGuide: 'Level 1: System Purpose Eyebrow & Title · Level 2: 3-4 Connected Flow Nodes with directional arrows (Client ──▶ Gateway ──▶ Service ──▶ DB) · Level 3: Bottom Protocol & SLA guarantee banner.',
      structuralPattern: 'Horizontal or vertical sequence cards with protocol badges (gRPC, HTTPS, WebSocket) and data arrows.',
    },
    benchmark: {
      label: '📊 Performance Benchmarks & Metrics',
      recommendedLayout: 'High-Contrast Bento Grid',
      hierarchyGuide: 'Level 1: Benchmark Scope Title · Level 2: Prominent numeric callouts (e.g. 4.8M req/sec, 1.2ms P99) with comparative progress bars · Level 3: Bottom Hardware & Test Environment Specs.',
      structuralPattern: 'Bento grid tiles with large tabular numbers, unit badges, and percentage deltas.',
    },
    release: {
      label: '🚀 Release Announcement & Changelog',
      recommendedLayout: 'Product Milestone Card',
      hierarchyGuide: 'Level 1: Version Tag Pill (e.g. v2.4.0) & Launch Headline · Level 2: 3 Concise Feature Highlight Cards · Level 3: Terminal install snippet (e.g. npm i package@latest).',
      structuralPattern: 'Bold centered hero title with 3 bulleted feature pills and copy-paste CLI command.',
    },
    concept: {
      label: '💡 Technical Concept & Cheatsheet',
      recommendedLayout: 'Structured Technical Explainer',
      hierarchyGuide: 'Level 1: Clear Concept Headline & Subheading · Level 2: 2-3 Core Principle Cards with minimal code · Level 3: Bottom Summary Banner.',
      structuralPattern: 'Numbered technical takeaway steps, code examples, and takeaway rule of thumb.',
    },
  };

  const meta = INTENT_METADATA[resolved] || INTENT_METADATA.concept;
  return {
    intent: resolved,
    label: meta.label,
    recommendedLayout: meta.recommendedLayout,
    hierarchyGuide: meta.hierarchyGuide,
    structuralPattern: meta.structuralPattern,
  };
}

export function buildYuwbrndrAiPrompt(options: AiPromptOptions): string {
  const {
    engine,
    preset,
    theme,
    userInstruction,
    styleArchetype = 'infographic',
    intent = 'auto',
  } = options;

  const archetypeInfo = ARCHETYPE_LABELS[styleArchetype];
  const detectedIntent = detectPromptIntent(userInstruction, intent);
  const isUrlInstruction = /https?:\/\/[^\s]+/i.test(userInstruction.trim());
  const isBulletPoints = /^\s*[-*•]\s+/m.test(userInstruction.trim());

  // Safe-zone advice specific to platform
  const safeZoneGuideline = preset.safeZone || 'Keep critical elements at least 32px away from canvas boundaries.';

  if (engine === 'html') {
    return `You are an expert developer-designer writing production design code for **Yuwbrndr** (Philosophy: "Design by Code · Design to All").
Your mission: Translate the user's intent into a stunning, professional graphic.

### 1. CANVAS SPECIFICATIONS
- **Target**: ${preset.platform} (${preset.name})
- **Dimensions**: ${preset.width}px width × ${preset.height}px height (${preset.aspectRatio})
- **Platform Safe Zone**: ${safeZoneGuideline}
- **Suggested Theme Mood**: ${theme.name} (e.g. background around ${theme.background}, accents around ${theme.primary}). You have full creative freedom to pick and blend harmonious colors, gradients, and surface tones that best communicate the topic.

### 2. CREATIVE FREEDOM & AESTHETICS
- **Layout & Composition**: You have full freedom over the layout (bento grid, pipeline sequence, comparison matrix, cheatsheet, card flow, or terminal frames). Suggested direction: ${archetypeInfo.name}.
- **Aesthetic Guidance**: Create a rich, high-craft developer feel. Avoid typical AI theme clichés (such as generic over-the-top rainbow text or random floating glowing spheres). Use gradients, shadows, borders, glassmorphism, or hand-drawn rough strokes purposefully.
- **Readability**: Ensure text is sharp, high-contrast, and comfortably readable on mobile feeds (avoid tiny microscopic text; use bold font weights and generous text sizes like text-lg, text-xl, text-2xl). Keep copy clear and punchy.

### 3. RUNTIME & ENGINE CONSTRAINTS
- **Rough.js Hand-Drawn Graphics**: The global \`window.rough\` is loaded and available! For hand-drawn/sketch styles, you can mix HTML typography with Rough.js in two ways:
  1. Declarative SVG: \`<svg data-rough-rect="fill: #fef08a; fillStyle: cross-hatch; roughness: 2; stroke: #1e293b" class="absolute inset-0 w-full h-full -z-10"></svg>\`
  2. Inline Script: \`<svg id="sketch-board" class="absolute inset-0 w-full h-full pointer-events-none"></svg><script>const rc = rough.svg(document.getElementById('sketch-board')); /* draw shapes & appendChild */</script>\`
- **Typography**: Hand-drawn and modern fonts are pre-loaded: Comic Neue (\`font-comic\`), Caveat (\`font-caveat\`), Patrick Hand (\`font-hand\`), JetBrains Mono (\`font-mono\`), and Inter (\`font-sans\`).
- **No <html>/<head>/<body> wrappers**: Return only the root container element and its inner children.
- **Root Element**: Start with a full-bleed root container:
  \`<div class="w-full h-full p-6 sm:p-8 bg-[${theme.background}] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none border border-white/10" style="background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px;">\`
- **Tailwind / UnoCSS Support**: Fully supported with standard and arbitrary utility classes (\`bg-[#...]\`, \`border-white/10\`, \`shadow-...\`, \`grid\`, \`flex\`, etc.).
- **Zero Vertical Overflow**: The canvas is strictly fixed at ${preset.height}px with \`overflow-hidden\`. Ensure all content sits cleanly within this height without clipping the footer.

### 4. USER INTENT
${isUrlInstruction
  ? `Reference URL: ${userInstruction.trim()}\nAnalyze the topic from this link and create a compelling visual breakdown.`
  : isBulletPoints
  ? `User Notes:\n${userInstruction.trim()}\nSynthesize these points into a polished, structured visual layout.`
  : `Topic / Instruction:\n${userInstruction.trim() || 'Create an engaging technical explainer graphic.'}`}

### 5. OUTPUT FORMAT
Return ONLY the raw HTML code inside a single \`\`\`html code block. Do NOT include any conversational introduction, explanations, or wrapper tags.`;
  }

  // Canvas 2D Engine Prompt
  return `You are an expert creative technologist writing pure 2D Canvas JavaScript code for **Yuwbrndr** (Philosophy: "Design by Code · Design to All").
Your mission: Translate the user's intent into a stunning, professional graphic using the HTML5 Canvas 2D API.

### 1. CANVAS SPECIFICATIONS
- **Target**: ${preset.platform} (${preset.name})
- **Dimensions**: ${preset.width}px width × ${preset.height}px height (${preset.aspectRatio})
- **Platform Safe Zone**: ${safeZoneGuideline}
- **Suggested Theme Mood**: ${theme.name} (Primary: ${theme.primary}, Background: ${theme.background}). You have full creative freedom over color palettes, gradients, and visual styling.

### 2. CREATIVE FREEDOM & AESTHETICS
- **Layout & Composition**: You have full freedom over visual structure (geometric layouts, architecture diagrams, charts, or isometric visuals). Suggested direction: ${archetypeInfo.name}.
- **Aesthetic Guidance**: Maintain a polished developer aesthetic. Avoid typical AI theme clichés. Use gradients, shadows, geometric patterns, or hand-drawn sketchy graphics creatively and tastefully.
- **Readability**: Ensure text labels are clear, bold, and high-contrast.

### 3. RUNTIME CONSTRAINTS
- **Execution Context**: Runs inside \`new Function('canvas', 'ctx', 'width', 'height', 'rough', code)\`.
- **Rough.js Support**: \`rough\` is passed into the function! You can draw sketchy hand-drawn graphics using \`const rc = rough.canvas(canvas); rc.rectangle(x, y, w, h, { roughness: 2, fill: '#...', fillStyle: 'cross-hatch' });\`.
- **Pure Canvas 2D**: Standard \`ctx\` methods (fillRect, roundRect, stroke, fillText, createLinearGradient, etc.) are available.
- **Stay Within Canvas**: Strictly respect width: ${preset.width}px and height: ${preset.height}px with no overflow.

### 4. USER INTENT
${isUrlInstruction ? `Reference URL: ${userInstruction.trim()}` : `Requirement:\n${userInstruction.trim() || 'Create an engaging technical visual.'}`}

### 5. OUTPUT FORMAT
Return ONLY the raw JavaScript code inside a single \`\`\`javascript code block with zero preamble.`;
}
