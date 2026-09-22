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
    name: '2D Hand-Drawn & Sketch Art (Excalidraw Style)',
    description: 'Organic hand-drawn wobbly borders, Comic Neue typography, sketchy arrows (──▶), and paper-feel 2D ink aesthetic.',
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
    return `You are an expert design engineer writing production-ready design code for **Yuwbrndr** (Philosophy: "Design by Code · Design to All").
Your mission: Translate the user's raw intent into clean, high-impact, professional developer graphics.

### 1. TARGET GRAPHIC SPECIFICATIONS & SAFE-ZONE
- **Platform**: ${preset.platform} (${preset.name})
- **Canvas Resolution**: ${preset.width}px width × ${preset.height}px height
- **Aspect Ratio**: ${preset.aspectRatio}
- **PLATFORM SAFE-ZONE (MANDATORY)**:
  ${safeZoneGuideline}
  - Ensure all critical headlines, code blocks, and badges sit safely within this boundary so social feeds, profile grids, or platform overlays (like YouTube video timestamps) never clip or obstruct the design.
- **Recommended Color Palette**:
  - Primary Accent: ${theme.primary}
  - Secondary Accent: ${theme.secondary}
  - Highlight Accent: ${theme.accent}
  - Canvas Background: ${theme.background}
  - Card/Surface Fill: ${theme.surface}
  - Text Color: ${theme.text}
  - Muted Text: ${theme.muted}

### 2. INTENT TRANSLATION & VISUAL HIERARCHY
- **Detected Intent**: ${detectedIntent.label}
- **Layout Archetype**: ${archetypeInfo.name} (${archetypeInfo.description})
- **Target Layout**: ${detectedIntent.recommendedLayout}
- **Structural Blueprint**: ${detectedIntent.structuralPattern}
- **STRICT 5-LEVEL VISUAL HIERARCHY**:
  - **Level 1 (Eyebrow Tag)**: Uppercase monospace category pill (\`text-[11px] font-mono font-bold uppercase tracking-widest text-[${theme.primary}]\`).
  - **Level 2 (Hero Headline)**: Bold/Extrabold headline (\`text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight\`). Maximum 1-2 lines.
  - **Level 3 (Core Premise / Subheading)**: Single concise sentence under 12-15 words (\`text-sm text-slate-400\`).
  - **Level 4 (Core Visual Body)**:
    ${detectedIntent.hierarchyGuide}
  - **Level 5 (Bottom Takeaway Banner)**: Compact rule of thumb or summary pill at the bottom (\`px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-mono\`).

### 3. MOBILE-FIRST READABILITY & CONTRAST GUARANTEES (WCAG COMPLIANT)
- **CRITICAL MOBILE READABILITY RULE**: When this graphic appears in a mobile social feed (LinkedIn, X, Instagram), it is scaled down 3x. Microscopic text becomes illegible and hurts engagement.
  - **Headlines**: Use \`text-3xl\` to \`text-5xl\` (30px–48px) with bold/extrabold weight.
  - **Section Titles**: Minimum \`text-base\` to \`text-lg\` (16px–18px).
  - **Body & Explanations**: Minimum \`text-sm\` (14px) or \`text-base\` (16px).
  - **Code Tokens & Badges**: Minimum \`text-xs\` (12px) to \`text-sm\` (14px). **NEVER use text-[9px] or text-[10px]**!
  - **Concise Copy**: Keep text lines short and punchy so font sizes can remain comfortably large.
- **Primary Text**: Use pure white (\`text-white\` or \`#ffffff\`) on dark background (\`${theme.background}\`) for guaranteed 16:1+ contrast ratio.
- **Secondary & Body Text**: Use high-readability slate (\`text-slate-200\` or \`text-slate-300\`) exceeding 4.5:1 contrast.
- **2D HAND-DRAWN & SKETCH ART STYLING (IF REQUESTED)**:
  - Apply the organic wobbly border formula to cards: \`style="border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;"\`.
  - Use \`font-['Comic_Neue']\` or \`font-['Space_Grotesk']\` for friendly, hand-sketched technical diagrams.
  - Use 2D comic ink drop shadows: \`shadow-[3px_3px_0px_rgba(255,255,255,0.8)]\` with \`border-2 border-white\`.
- **Monospace Elements**: Use \`font-mono\` for code tokens, numbers, metrics, and badges.

### 4. STRICT YUWBRNDR ENGINE CONSTRAINTS
1. **NO \`<script>\` TAGS**: HTML previews run with scripts disabled for security. Do NOT include any \`<script>\` tags or event handlers.
2. **NO HTML/HEAD/BODY WRAPPERS**: Output ONLY the root container element and its children. Do not write \`<!doctype html>\`, \`<html>\`, \`<head>\`, or \`<body>\`.
3. **ROOT CONTAINER REQUIREMENT**:
   The root element MUST be a single \`<div>\` formatted exactly as:
   \`<div class="w-full h-full p-6 sm:p-8 bg-[${theme.background}] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none border border-white/10" style="background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px;">\`
4. **TAILWIND UTILITY SUPPORT**:
   Powered by UnoCSS Wind4 at runtime. You can freely use standard Tailwind classes and arbitrary utilities (\`bg-[#090b10]\`, \`border-white/10\`, \`grid-cols-2\`, \`gap-4\`, etc.).
5. **ICONS & ASSETS**:
   Use inline \`<svg>\` elements with \`viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"\` or clean Unicode symbols (⚡, 🔒, 📦, 💡). Do not load external CDNs.
6. **AVOID BARE OR EMPTY LAYOUTS (RICH VISUAL CRAFTSMANSHIP)**:
   - Do NOT produce a bare, empty canvas with vast dead space. Fill the canvas with deliberate, high-density developer components:
     - **Terminal & Code Chrome**: Include window header controls (three macOS red/yellow/green dots \`w-2.5 h-2.5 rounded-full\`) or file tabs (\`auth.ts\`, \`schema.prisma\`).
     - **Connected Sequence Pipelines**: Include visual node flow arrows (\`Browser ──[Cookie]──▶ Server ──[SHA-256]──▶ Database\`) with protocol badges.
     - **Mental Models & Visual Analogy Cards**: Feature a key conceptual mental model (e.g. Locker & Key, Cache Stampede, Gateway Guard).
     - **Syntax-Highlighted Tokens**: Color-code code keywords (\`const\`, \`await\`, \`async\`), variables, and strings for instant visual appeal.
     - **Surface Depth**: Use multi-layer card depths (\`bg-slate-900/90 border border-white/10\`, nested code blocks \`bg-black/75 border border-white/10\`).
   - Do NOT use rainbow gradient text or giant neon blur-3xl orbs; use crisp, engineered developer aesthetics (clean grid lines, hairline borders, and semantic status colors like Emerald for secure, Rose for insecure, Cyan for transport).
7. **ZERO OVERFLOW GUARANTEE**:
   - The canvas height is strictly fixed at ${preset.height}px with \`overflow-hidden\`.
   - Content must NEVER exceed ${preset.height}px or push the footer out of view.
   - Use compact vertical spacing (\`gap-3\` to \`gap-4\`, \`my-auto\`, \`p-4\`), concise copy, and tiny code blocks (2-3 lines max).

### 5. USER INPUT & INTENT SPECIFICATION
${isUrlInstruction
  ? `[DOCUMENTATION / REFERENCE LINK DETECTED]:
Reference URL: ${userInstruction.trim()}
INSTRUCTION: Analyze this link's technical domain. Extract the core architectural pattern, 2 contrasting pillars or mechanisms, and formulate an authoritative developer graphic.`
  : isBulletPoints
  ? `[RAW BULLET POINTS DETECTED]:
Input Notes:
${userInstruction.trim()}
INSTRUCTION: Group and synthesize these bullet points into a clean visual hierarchy. Eliminate wordiness, preserve key technical terms, and place them into structured cards.`
  : `[CONCEPT / REQUIREMENT]:
${userInstruction.trim() || 'Create a compelling technical cheatsheet contrasting architectures or highlighting system benchmarks.'}
INSTRUCTION: Structure this concept into an authoritative post cover matching the detected ${detectedIntent.label} layout.`}

### 6. OUTPUT INSTRUCTION
Return ONLY the raw HTML code block starting with the root \`<div class="w-full h-full ...">\`. Do NOT include any conversational introduction, explanations, or wrapper tags.`;
  }

  // Canvas 2D Engine Prompt
  return `You are an expert creative technologist writing pure 2D Canvas JavaScript code for **Yuwbrndr** (Philosophy: "Design by Code · Design to All").

### 1. TARGET GRAPHIC SPECIFICATIONS & SAFE-ZONE
- **Platform**: ${preset.platform} (${preset.name})
- **Canvas Resolution**: ${preset.width}px width × ${preset.height}px height
- **Aspect Ratio**: ${preset.aspectRatio}
- **PLATFORM SAFE-ZONE**:
  ${safeZoneGuideline}
- **Palette**: Primary (${theme.primary}), Secondary (${theme.secondary}), Highlight (${theme.accent}), Background (${theme.background}), Card Surface (${theme.surface}), Text (${theme.text}).

### 2. INTENT TRANSLATION & VISUAL HIERARCHY
- **Detected Intent**: ${detectedIntent.label}
- **Layout Archetype**: ${archetypeInfo.name} (${archetypeInfo.description})
- **Target Structure**: ${detectedIntent.recommendedLayout} (${detectedIntent.structuralPattern})
- **Contrast Guarantee**: Solid white (\`#ffffff\`) for main title, light slate for labels, and ${theme.primary} for accent badges. Ensure sharp readability.

### 3. STRICT YUWBRNDR CANVAS ENGINE CONSTRAINTS
1. **SANDBOX FUNCTION**:
   Your code executes inside: \`new Function('canvas', 'ctx', 'width', 'height', code)\`
   - Bindings: \`canvas\` (HTMLCanvasElement), \`ctx\` (CanvasRenderingContext2D), \`width\` (${preset.width}), \`height\` (${preset.height}).
2. **NO SCRIPT TAGS & NO FUNCTION WRAPPERS**:
   Write the direct executable statements. Do not define \`function()\` wrapper.
3. **NO DOM ACCESS**:
   Draw only via \`ctx\` standard 2D Canvas methods.
4. **AVOID AI THEME CLICHÉS**:
   Use matte engineering backgrounds, crisp geometric layouts, dot/coordinate grids, and high-contrast typography.
5. **DRAWING BEST PRACTICES**:
   - Fill background: \`ctx.fillStyle = '${theme.background}'; ctx.fillRect(0, 0, width, height);\`
   - Subtle dot grid or grid lines: \`ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';\`
   - Rounded cards: \`ctx.roundRect\` with \`ctx.fillStyle = '${theme.surface}'; ctx.fill();\`
   - Typography: \`ctx.font = 'bold 32px system-ui, sans-serif'; ctx.textBaseline = 'middle';\`
   - Stay strictly within width: ${preset.width}px and height: ${preset.height}px (no overflow).

### 4. USER INPUT & INTENT SPECIFICATION
${isUrlInstruction ? `Reference URL: ${userInstruction.trim()}` : `Requirement:\n${userInstruction.trim() || 'Create a geometric isometric diagram, system pipeline, or benchmark chart.'}`}

### 5. OUTPUT INSTRUCTION
Return ONLY the raw JavaScript code inside a single \`\`\`javascript code block with zero preamble.`;
}
