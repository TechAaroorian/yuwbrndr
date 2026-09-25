export interface CodePreset {
  id: string;
  name: string;
  category: 'Infographic' | '3D & Canvas' | 'Vector & SVG' | 'Meme & Social' | 'Starter';
  type: 'html' | 'canvas';
  description: string;
  code: string;
}

export const CODE_PRESETS: CodePreset[] = [
  // ==========================================
  // 1. INFOGRAPHICS & BENCHMARKS
  // ==========================================
  {
    id: 'social-carousel-benchmark',
    name: 'Social Carousel Benchmark (1.4M Posts)',
    category: 'Infographic',
    type: 'html',
    description: 'Verified industry benchmark: multi-slide document carousels deliver 2.56x higher engagement & 3.2x dwell time.',
    code: `<div class="w-full h-full p-10 bg-[#090a12] text-white flex flex-col justify-between relative overflow-hidden font-sans border border-white/10" style="background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px;">
  <!-- Header Eyebrow -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
        📊 INDUSTRY BENCHMARK 2026
      </span>
      <span class="text-xs font-mono text-slate-400">Socialinsider Study (1.4M+ Posts)</span>
    </div>
    <span class="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
      Verified Data
    </span>
  </div>

  <!-- Hero Comparison Title -->
  <div class="my-3">
    <h1 class="text-4xl font-extrabold text-white tracking-tight leading-tight">
      Multi-Slide Carousels vs. Single Images
    </h1>
    <p class="text-base text-slate-400 mt-1">Why document slides dominate technical content feeds</p>
  </div>

  <!-- 3-Column Metrics Grid -->
  <div class="grid grid-cols-3 gap-5 my-2">
    <!-- Card 1: Engagement -->
    <div class="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
      <div>
        <div class="text-xs font-mono uppercase text-indigo-300 font-bold">Avg. Engagement Rate</div>
        <div class="text-5xl font-black text-indigo-400 mt-2 font-mono">5.48%</div>
        <div class="text-xs text-slate-400 mt-1">vs 2.14% for single image posts</div>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span class="text-emerald-400 font-bold">+156% Boost</span>
        <span class="text-slate-500">2.56x Higher</span>
      </div>
    </div>

    <!-- Card 2: Dwell Time -->
    <div class="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl flex flex-col justify-between">
      <div>
        <div class="text-xs font-mono uppercase text-cyan-300 font-bold">Reader Dwell Time</div>
        <div class="text-5xl font-black text-cyan-400 mt-2 font-mono">3.2x</div>
        <div class="text-xs text-slate-400 mt-1">Longer interaction per swipe</div>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span class="text-cyan-300 font-bold">High Retention</span>
        <span class="text-slate-500">Swipe-by-swipe</span>
      </div>
    </div>

    <!-- Card 3: Mobile Reality -->
    <div class="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl flex flex-col justify-between">
      <div>
        <div class="text-xs font-mono uppercase text-amber-300 font-bold">Mobile Feed Share</div>
        <div class="text-5xl font-black text-amber-400 mt-2 font-mono">82%</div>
        <div class="text-xs text-slate-400 mt-1">Readers viewing on phones</div>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span class="text-amber-300 font-bold">Mobile-First</span>
        <span class="text-slate-500">Requires bold text</span>
      </div>
    </div>
  </div>

  <!-- Footer Takeaway -->
  <div class="px-5 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-slate-300">
    <span class="font-semibold text-indigo-200">💡 Takeaway for Developers:</span>
    <span>Turn tutorials into bite-sized 4-6 slide PDF decks to maximize reach and readability.</span>
  </div>
</div>`,
  },
  {
    id: 'promise-cheatsheet',
    name: 'Promise.all vs allSettled',
    category: 'Infographic',
    type: 'html',
    description: 'JavaScript concurrency cheatsheet with large fonts, short-circuit vs wait-all badges.',
    code: `<div
  class="w-full h-full p-8 md:p-10 bg-[#070913] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-white/15 select-none"
  style="
    background-image:
      radial-gradient(circle at 12% 12%, rgba(34,211,238,0.22), transparent 42%),
      radial-gradient(circle at 88% 88%, rgba(168,85,247,0.24), transparent 42%),
      radial-gradient(circle at 50% 50%, rgba(15,23,42,0.6), transparent 70%),
      radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px);
    background-size: auto, auto, auto, 36px 36px;
  "
>
  <!-- Ambient decorative glow orbs -->
  <div class="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>

  <!-- 1. HEADER SECTION -->
  <div class="relative z-10 space-y-3.5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="px-4 py-1.5 text-sm font-mono font-bold tracking-wider uppercase rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          ⚡ JavaScript Concurrency
        </span>
      </div>
      <span class="px-3.5 py-1 text-sm font-mono font-semibold tracking-wide text-slate-300 bg-white/5 border border-white/10 rounded-lg">
        ES6 (2015) vs ES2020
      </span>
    </div>

    <div>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3.5">
        <span class="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">Promise.all</span>
        <span class="text-slate-500 text-3xl font-light">vs</span>
        <span class="text-violet-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]">Promise.allSettled</span>
      </h1>
      <p class="text-lg text-slate-300 mt-1 font-medium">
        Different failure handling. <span class="text-white font-bold underline decoration-cyan-400 decoration-2 underline-offset-4">Different execution guarantees.</span>
      </p>
    </div>

    <!-- EXECUTION SCENARIO BAR -->
    <div class="p-4 rounded-2xl bg-slate-900/90 border border-white/15 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
      <div class="flex items-center gap-3">
        <span class="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">Scenario:</span>
        <span class="text-base font-bold text-slate-100">3 concurrent requests (2 fulfill, 1 rejects)</span>
      </div>
      <div class="flex items-center gap-2.5 text-sm font-mono font-bold">
        <span class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-2 shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> User — fulfilled
        </span>
        <span class="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-2 shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Alerts — rejected
        </span>
        <span class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-2 shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Settings — fulfilled
        </span>
      </div>
    </div>
  </div>

  <!-- 2. COMPARISON COLUMNS -->
  <div class="relative z-10 grid grid-cols-2 gap-6 my-3">
    <!-- LEFT: PROMISE.ALL COLUMN -->
    <div class="p-6 rounded-3xl bg-gradient-to-b from-[#0B1528]/95 via-[#070D18]/95 to-[#070D18]/95 border-2 border-cyan-500/40 flex flex-col justify-between shadow-[0_15px_35px_rgba(6,182,212,0.15)] ring-1 ring-white/10">
      <div class="space-y-4">
        <!-- Title & badge -->
        <div class="flex items-start justify-between gap-3 border-b border-cyan-500/30 pb-3.5">
          <div>
            <span class="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400">
              All Results Required
            </span>
            <h2 class="text-3xl font-black text-white tracking-tight mt-1">Promise.all()</h2>
          </div>
          <span class="px-3 py-1.5 text-sm font-mono font-bold rounded-xl bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm shrink-0">
            ⚡ Fail-fast result
          </span>
        </div>

        <!-- 3 Feature Points -->
        <div class="space-y-3">
          <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-cyan-500/25 text-cyan-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-cyan-500/40">1</span>
            <span class="text-base font-semibold text-slate-100 leading-snug">
              Fulfills only if <strong class="text-cyan-300 font-extrabold">every</strong> single input fulfills
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-rose-500/30 text-rose-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-rose-500/50">2</span>
            <span class="text-base font-semibold text-rose-100 leading-snug">
              Rejects when <strong class="text-rose-400 underline font-extrabold">any</strong> input promise rejects
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-cyan-500/25 text-cyan-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-cyan-500/40">3</span>
            <span class="text-base font-semibold text-slate-200 leading-snug">
              Other operations are <strong class="text-cyan-300 font-semibold">not cancelled</strong> automatically
            </span>
          </div>
        </div>
      </div>

      <!-- Result & Best-for footer -->
      <div class="mt-5 pt-4 border-t border-cyan-500/30 space-y-3">
        <div>
          <span class="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
            Output Returned:
          </span>
          <div class="mt-1.5 px-4 py-2.5 rounded-xl bg-black/80 font-mono text-base font-bold text-rose-400 border border-rose-500/40 shadow-inner">
            Error: "Alerts — rejected"
          </div>
        </div>
        <div class="text-sm font-medium text-slate-200 bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-500/30 leading-relaxed">
          <strong class="text-cyan-300 font-bold">Best For:</strong> Concurrent operations whose results are all required.
        </div>
      </div>
    </div>

    <!-- RIGHT: PROMISE.ALLSETTLED COLUMN -->
    <div class="p-6 rounded-3xl bg-gradient-to-b from-[#170E2B]/95 via-[#0C071A]/95 to-[#0C071A]/95 border-2 border-violet-500/40 flex flex-col justify-between shadow-[0_15px_35px_rgba(139,92,246,0.15)] ring-1 ring-white/10">
      <div class="space-y-4">
        <!-- Title & badge -->
        <div class="flex items-start justify-between gap-3 border-b border-violet-500/30 pb-3.5">
          <div>
            <span class="text-sm font-mono font-bold uppercase tracking-wider text-violet-400">
              Partial Results Useful
            </span>
            <h2 class="text-3xl font-black text-white tracking-tight mt-1">Promise.allSettled()</h2>
          </div>
          <span class="px-3 py-1.5 text-sm font-mono font-bold rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm shrink-0">
            🛡️ Waits for All
          </span>
        </div>

        <!-- 3 Feature Points -->
        <div class="space-y-3">
          <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-violet-500/25 text-violet-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-violet-500/40">1</span>
            <span class="text-base font-semibold text-slate-100 leading-snug">
              Waits until <strong class="text-violet-300 font-extrabold">every</strong> promise either fulfills or rejects
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-emerald-500/50">2</span>
            <span class="text-base font-semibold text-emerald-100 leading-snug">
              <strong class="text-emerald-300 font-extrabold">Never short-circuits:</strong> preserves all outcomes
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3.5">
            <span class="w-9 h-9 rounded-xl bg-violet-500/25 text-violet-300 font-mono font-black text-base flex items-center justify-center shrink-0 border border-violet-500/40">3</span>
            <span class="text-base font-semibold text-slate-200 leading-snug">
              Returns an <strong class="text-violet-300 font-bold">outcome object</strong> for every input
            </span>
          </div>
        </div>
      </div>

      <!-- Result & Best-for footer -->
      <div class="mt-5 pt-4 border-t border-violet-500/30 space-y-3">
        <div>
          <span class="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
            Output Returned:
          </span>
          <div class="mt-1.5 px-4 py-2.5 rounded-xl bg-black/80 font-mono text-base font-bold border border-violet-500/40 shadow-inner space-y-1">
            <div class="text-emerald-400">{ status: 'fulfilled', value }</div>
            <div class="text-rose-400">{ status: 'rejected', reason }</div>
          </div>
        </div>
        <div class="text-sm font-medium text-slate-200 bg-violet-950/30 p-3.5 rounded-xl border border-violet-500/30 leading-relaxed">
          <strong class="text-violet-300 font-bold">Best For:</strong> Independent dashboard widgets, logging, batch imports where partial data is still valuable.
        </div>
      </div>
    </div>
  </div>

  <!-- 3. FOOTER TAKEAWAY BANNER -->
  <div class="relative z-10 p-4 rounded-2xl bg-slate-900/90 border border-white/15 text-center shadow-2xl backdrop-blur-md">
    <p class="text-base sm:text-lg font-semibold text-slate-200">
      💡 <span class="text-white font-bold">Rule of Thumb:</span> Choose <span class="text-cyan-300 font-extrabold underline decoration-cyan-400 underline-offset-4">Promise.all</span> when every result is required, and <span class="text-violet-300 font-extrabold underline decoration-violet-400 underline-offset-4">Promise.allSettled</span> when partial data is valuable.
    </p>
  </div>
</div>`
  },
  {
    id: 'bento-metrics',
    name: 'Bento Grid System Metrics',
    category: 'Infographic',
    type: 'html',
    description: 'Modern Bento Grid architecture card with glowing numbers, SLA badges, and stats.',
    code: `<div class="w-full h-full p-10 bg-[#080a14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-white/10 select-none">
  <!-- Radial Backdrops -->
  <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>

  <!-- Header -->
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div>
      <span class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">DISTRIBUTED CLUSTER V2</span>
      <h1 class="text-3xl font-extrabold text-white mt-2">Core System Benchmarks</h1>
    </div>
    <span class="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 99.999% SLA
    </span>
  </div>

  <!-- Bento Grid -->
  <div class="grid grid-cols-3 gap-4 my-auto">
    <div class="col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between shadow-xl">
      <div class="text-xs font-mono uppercase text-slate-400 font-bold">Throughput Peak</div>
      <div class="text-5xl font-black text-white my-3 tracking-tight">4.8M <span class="text-xl text-blue-400 font-mono font-bold">req/sec</span></div>
      <div class="text-xs text-slate-400">Zero packet drops across 18 regional Kubernetes clusters</div>
    </div>

    <div class="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col justify-between shadow-xl">
      <div class="text-xs font-mono uppercase text-blue-300 font-bold">P99 Latency</div>
      <div class="text-4xl font-extrabold text-blue-400 my-2 font-mono">1.2ms</div>
      <div class="text-xs text-slate-400">Sub-millisecond edge memory</div>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between shadow-xl">
      <div class="text-xs font-mono uppercase text-slate-400 font-bold">Cache Hit Rate</div>
      <div class="text-4xl font-extrabold text-emerald-400 my-2 font-mono">99.7%</div>
      <div class="text-xs text-slate-400">Redis in-memory tier</div>
    </div>

    <div class="col-span-2 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900/90 border border-indigo-500/30 flex items-center justify-between shadow-xl">
      <div>
        <div class="text-xs font-mono uppercase text-indigo-300 font-bold">Failover Protocol</div>
        <div class="text-lg font-bold text-white mt-1">Autonomous Multi-Region Consensus</div>
      </div>
      <span class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">ACTIVE</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-500">
    <span>Platform: Production Environment</span>
    <span>Benchmarked via Apache JMeter</span>
  </div>
</div>`
  },
  {
    id: 'step-timeline',
    name: 'Migration Timeline Flow',
    category: 'Infographic',
    type: 'html',
    description: 'Clean step-by-step horizontal roadmap/timeline infographic with milestone markers.',
    code: `<div class="w-full h-full p-10 bg-[#090a12] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-white/10 select-none">
  <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none"></div>

  <!-- Header -->
  <div class="border-b border-white/10 pb-5">
    <span class="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">ARCHITECTURE ROADMAP</span>
    <h1 class="text-3xl font-extrabold text-white mt-1">Monolith to Event-Driven Microservices</h1>
    <p class="text-sm text-slate-400 mt-1">Four-phase zero-downtime database and service migration strategy</p>
  </div>

  <!-- 4 Step Timeline -->
  <div class="grid grid-cols-4 gap-4 my-auto relative">
    <div class="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 flex flex-col justify-between">
      <div>
        <span class="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 font-mono font-bold text-sm flex items-center justify-center mb-3">01</span>
        <h3 class="font-bold text-white text-base">Strangler Pattern</h3>
        <p class="text-xs text-slate-400 mt-2 leading-relaxed">Place API gateway in front of legacy monolith to intercept new domain routes.</p>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 font-bold">COMPLETE</div>
    </div>

    <div class="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 flex flex-col justify-between">
      <div>
        <span class="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 font-mono font-bold text-sm flex items-center justify-center mb-3">02</span>
        <h3 class="font-bold text-white text-base">CDC Event Stream</h3>
        <p class="text-xs text-slate-400 mt-2 leading-relaxed">Stream Postgres WAL changes into Apache Kafka using Debezium connector.</p>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 font-bold">COMPLETE</div>
    </div>

    <div class="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/60 flex flex-col justify-between shadow-glow-indigo">
      <div>
        <span class="w-8 h-8 rounded-xl bg-violet-500 text-white font-mono font-bold text-sm flex items-center justify-center mb-3">03</span>
        <h3 class="font-bold text-white text-base">Dual-Write Cutover</h3>
        <p class="text-xs text-violet-200 mt-2 leading-relaxed">Route 100% write operations to new microservice with automated parity check.</p>
      </div>
      <div class="mt-4 pt-3 border-t border-violet-500/30 text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> IN PROGRESS
      </div>
    </div>

    <div class="p-5 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col justify-between opacity-75">
      <div>
        <span class="w-8 h-8 rounded-xl bg-white/10 text-slate-400 font-mono font-bold text-sm flex items-center justify-center mb-3">04</span>
        <h3 class="font-bold text-white text-base">Decommissioning</h3>
        <p class="text-xs text-slate-400 mt-2 leading-relaxed">Safely retire legacy database tables and archive historical cold storage.</p>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-500 font-bold">UPCOMING</div>
    </div>
  </div>

  <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
    <span>Target: Q4 2026 Production Cutover</span>
    <span>Zero Downtime SLA</span>
  </div>
</div>`
  },

  // ==========================================
  // 2. 3D & CANVAS GRAPHICS (JS ENGINE)
  // ==========================================
  {
    id: 'isometric-cube-canvas',
    name: '3D Isometric Tech Cube',
    category: '3D & Canvas',
    type: 'canvas',
    description: 'Pure HTML5 2D Canvas code rendering an illuminated 3D isometric cube with depth vectors and emissive lighting.',
    code: `// Canvas 2D Engine: (canvas, ctx, width, height)
ctx.fillStyle = '#06070d';
ctx.fillRect(0, 0, width, height);

// Ambient glow
const rad = ctx.createRadialGradient(width/2, height/2 - 20, 10, width/2, height/2 - 20, 350);
rad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
rad.addColorStop(1, 'transparent');
ctx.fillStyle = rad;
ctx.fillRect(0, 0, width, height);

// Grid background lines
ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 40) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y < height; y += 40) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Draw 3D Isometric Cube
const cx = width / 2;
const cy = height / 2 - 20;
const size = 140;

// Top Face
ctx.fillStyle = '#6366f1';
ctx.beginPath();
ctx.moveTo(cx, cy - size);
ctx.lineTo(cx + size * 0.866, cy - size * 0.5);
ctx.lineTo(cx, cy);
ctx.lineTo(cx - size * 0.866, cy - size * 0.5);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#818cf8';
ctx.lineWidth = 2;
ctx.stroke();

// Left Face
ctx.fillStyle = '#4338ca';
ctx.beginPath();
ctx.moveTo(cx - size * 0.866, cy - size * 0.5);
ctx.lineTo(cx, cy);
ctx.lineTo(cx, cy + size);
ctx.lineTo(cx - size * 0.866, cy + size * 0.5);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#6366f1';
ctx.stroke();

// Right Face
ctx.fillStyle = '#312e81';
ctx.beginPath();
ctx.moveTo(cx, cy);
ctx.lineTo(cx + size * 0.866, cy - size * 0.5);
ctx.lineTo(cx + size * 0.866, cy + size * 0.5);
ctx.lineTo(cx, cy + size);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#4f46e5';
ctx.stroke();

// Glowing Core Badge
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('ISOMETRIC 3D PRIMITIVE', cx, height - 120);

ctx.fillStyle = '#38bdf8';
ctx.font = '14px "JetBrains Mono", monospace';
ctx.fillText('Deterministic Mathematical Vector Render', cx, height - 85);
`
  },
  {
    id: 'geometric-rings-canvas',
    name: 'Concentric Cyber Rings',
    category: '3D & Canvas',
    type: 'canvas',
    description: 'Dynamic concentric tech rings with radar sweep lines and glowing points.',
    code: `// Concentric Tech Rings Canvas
ctx.fillStyle = '#070811';
ctx.fillRect(0, 0, width, height);

const cx = width / 2;
const cy = height / 2;

// Draw Concentric Glowing Rings
for (let i = 1; i <= 6; i++) {
  const radius = i * 45;
  ctx.strokeStyle = \`rgba(34, 211, 238, \${0.7 - i * 0.09})\`;
  ctx.lineWidth = i === 4 ? 3 : 1.5;
  ctx.setLineDash(i % 2 === 0 ? [8, 6] : []);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
ctx.setLineDash([]);

// Crosshairs
ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(cx - 300, cy);
ctx.lineTo(cx + 300, cy);
ctx.moveTo(cx, cy - 300);
ctx.lineTo(cx, cy + 300);
ctx.stroke();

// Title
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 40px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('CYBERNETIC RADAR MESH', cx, 100);

ctx.fillStyle = '#a855f7';
ctx.font = 'bold 14px "JetBrains Mono", monospace';
ctx.fillText('HIGH PRECISION 2D CANVAS GRAPHIC', cx, 140);
`
  },
  {
    id: 'handdrawn-canvas-dashboard',
    name: 'Hand-Drawn Sketch Telemetry (Rough.js Canvas)',
    category: '3D & Canvas',
    type: 'canvas',
    description: 'Sketchy 2D hand-drawn dashboard with hatched fills, organic circle meters, and Comic Neue typography.',
    code: `// 1. Hand-Drawn Sketch Dashboard on 2D Canvas with Rough.js
ctx.fillStyle = '#faf8f5';
ctx.fillRect(0, 0, width, height);

// Draw faint notebook grid
ctx.strokeStyle = 'rgba(15, 23, 42, 0.05)';
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 32) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
}
for (let y = 0; y < height; y += 32) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
}

const rc = rough.canvas(canvas);

// Outer hand-drawn border
rc.rectangle(24, 24, width - 48, height - 48, {
  roughness: 1.5,
  stroke: '#0f172a',
  strokeWidth: 3
});

// Title Section
ctx.fillStyle = '#0f172a';
ctx.font = 'bold 36px "Comic Neue", cursive, sans-serif';
ctx.textAlign = 'left';
ctx.fillText('⚡ System Health & Throughput', 56, 80);

ctx.font = 'bold 16px "Comic Neue", cursive, sans-serif';
ctx.fillStyle = '#475569';
ctx.fillText('Realtime Hand-Drawn Telemetry · Rendered with Rough.js & 2D Canvas', 56, 110);

// Card 1: Traffic Peak (Cross-hatch fill)
rc.rectangle(56, 140, 320, 240, {
  roughness: 2,
  stroke: '#0f172a',
  strokeWidth: 2.5,
  fill: '#fed7aa',
  fillStyle: 'cross-hatch',
  hachureGap: 8
});

ctx.fillStyle = '#0f172a';
ctx.font = 'bold 22px "Comic Neue", cursive, sans-serif';
ctx.fillText('Incoming Traffic', 80, 185);

ctx.font = 'bold 50px "Comic Neue", cursive, sans-serif';
ctx.fillText('14.2k', 80, 250);

ctx.font = 'bold 17px "Comic Neue", cursive, sans-serif';
ctx.fillStyle = '#9a3412';
ctx.fillText('req/sec (Peak Hour)', 80, 285);

// Card 2: Cluster Gauge (Circular Rough shape)
rc.rectangle(400, 140, 360, 240, {
  roughness: 1.8,
  stroke: '#0f172a',
  strokeWidth: 2.5,
  fill: '#bfdbfe',
  fillStyle: 'hachure',
  hachureAngle: 45
});

ctx.fillStyle = '#0f172a';
ctx.font = 'bold 22px "Comic Neue", cursive, sans-serif';
ctx.fillText('Cluster Saturation', 424, 185);

rc.circle(580, 260, 110, {
  roughness: 2.2,
  stroke: '#1e3a8a',
  strokeWidth: 3,
  fill: '#93c5fd',
  fillStyle: 'dots'
});

ctx.fillStyle = '#1e3a8a';
ctx.font = 'bold 30px "Comic Neue", cursive, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('78%', 580, 270);

// Card 3: Cache Hit Ratio (Zigzag fill)
ctx.textAlign = 'left';
rc.rectangle(784, 140, width - 840, 240, {
  roughness: 2.2,
  stroke: '#0f172a',
  strokeWidth: 2.5,
  fill: '#bbf7d0',
  fillStyle: 'zigzag',
  hachureGap: 8
});

ctx.fillStyle = '#0f172a';
ctx.font = 'bold 22px "Comic Neue", cursive, sans-serif';
ctx.fillText('Redis Hit Ratio', 808, 185);

ctx.font = 'bold 50px "Comic Neue", cursive, sans-serif';
ctx.fillText('99.6%', 808, 250);

ctx.font = 'bold 17px "Comic Neue", cursive, sans-serif';
ctx.fillStyle = '#166534';
ctx.fillText('P99 Latency: 0.8ms', 808, 285);

// Bottom Takeaway Banner
rc.rectangle(56, 410, width - 112, 70, {
  roughness: 1.4,
  stroke: '#0f172a',
  strokeWidth: 2.5,
  fill: '#fef08a',
  fillStyle: 'solid'
});

ctx.fillStyle = '#0f172a';
ctx.font = 'bold 19px "Comic Neue", cursive, sans-serif';
ctx.fillText('💡 Note: All systems operational. Zero degraded pods across 12 node pools.', 80, 452);
`
  },

  // ==========================================
  // 3. VECTOR & SVG ILLUSTRATIONS
  // ==========================================
  {
    id: 'mesh-gradient-svg',
    name: 'Multi-Stop Mesh Vector',
    category: 'Vector & SVG',
    type: 'html',
    description: 'Resolution-independent SVG mesh card with multi-stop radial gradients and glassmorphism badge.',
    code: `<div class="w-full h-full p-12 bg-[#060813] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-white/10 select-none">
  <!-- Inline SVG Mesh Background -->
  <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mesh1" cx="20%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#060813" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="mesh2" cx="80%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#060813" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#mesh1)"/>
    <rect width="100%" height="100%" fill="url(#mesh2)"/>
  </svg>

  <div class="relative z-10">
    <span class="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider">
      VECTOR CARD V3
    </span>
  </div>

  <div class="relative z-10 max-w-xl">
    <h1 class="text-5xl font-black tracking-tight text-white leading-tight">
      Infinite Resolution <span class="text-cyan-400">Pure SVG</span> Design
    </h1>
    <p class="text-lg text-slate-300 mt-4 leading-relaxed font-medium">
      Clean scalable graphics without pixelation at any platform DPI or export scale.
    </p>
  </div>

  <div class="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
    <span>100% Client-Side Vector</span>
    <span>Zero External Assets</span>
  </div>
</div>`
  },
  {
    id: 'handdrawn-architecture',
    name: 'Hand-Drawn Architecture (HTML + Rough.js)',
    category: 'Vector & SVG',
    type: 'html',
    description: 'Sketchy 2D hand-drawn system layout with organic puzzle cards, hatched Rough.js fills, directional connectors, and bold Comic Neue typography.',
    code: `<div class="w-full h-full p-8 md:p-10 bg-[#faf8f5] text-slate-800 flex flex-col justify-between relative overflow-hidden font-comic select-none border-4 border-slate-900" style="background-image: radial-gradient(#d1d5db 1.5px, transparent 1.5px); background-size: 24px 24px;">

  <!-- Rough.js Dynamic SVG Canvas Overlay for hand-drawn connectors -->
  <svg id="rough-layer" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 5;"></svg>

  <!-- 1. HEADER SECTION -->
  <div class="relative z-10 flex items-start justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-200 text-amber-950 border-2 border-slate-900 rounded-lg text-xs font-black shadow-[2px_2px_0px_#0f172a] whitespace-nowrap">
        <span>⚡ System Architecture</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-950 mt-1.5 leading-snug tracking-tight">
        Event-Driven Pipeline & Cache
      </h1>
      <p class="text-sm sm:text-base text-slate-700 font-bold mt-1 leading-normal">
        Hand-drawn microservice layout with asynchronous worker queues & edge caching.
      </p>
    </div>
    <div class="hidden sm:flex flex-col items-end gap-1 shrink-0">
      <span class="whitespace-nowrap px-3 py-1 bg-emerald-200 text-emerald-950 border-2 border-slate-900 rounded-md font-black text-xs shadow-[2px_2px_0px_#0f172a]">
        ● 99.99% Reliability
      </span>
      <span class="text-[11px] text-slate-500 font-bold whitespace-nowrap">Updated: Today</span>
    </div>
  </div>

  <!-- 2. PUZZLED / DYNAMIC CARDS LAYOUT (Mixed Sizes & Offsets) -->
  <div class="relative z-10 grid grid-cols-12 gap-5 my-auto">
    <!-- Card 1: API Gateway (col-span-3, tilted -1deg) -->
    <div class="col-span-3 relative p-5 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0f172a] rotate-[-1deg] flex flex-col justify-between">
      <svg data-rough-rect="fill: #fef08a; fillStyle: hachure; roughness: 1.8; stroke: #0f172a; strokeWidth: 2" class="absolute inset-0 w-full h-full -z-10 rounded-2xl"></svg>
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono font-black uppercase px-2 py-0.5 bg-slate-900 text-white rounded">ENTRY</span>
          <span class="text-xs font-bold text-slate-600">Port 443</span>
        </div>
        <h3 class="text-2xl font-black text-slate-950">API Gateway</h3>
        <p class="text-sm font-bold text-slate-700 mt-1">Rate limiting, JWT authentication & TLS termination</p>
      </div>
      <div class="mt-4 pt-2 border-t-2 border-dashed border-slate-400 text-xs font-mono font-bold text-slate-600">
        p99: 1.8ms
      </div>
    </div>

    <!-- Card 2: Event Bus (col-span-5, slightly taller & wider, tilted 0.8deg) -->
    <div class="col-span-5 relative p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[5px_5px_0px_#0f172a] rotate-[0.8deg] flex flex-col justify-between">
      <svg data-rough-rect="fill: #bfdbfe; fillStyle: cross-hatch; roughness: 2; stroke: #0f172a; strokeWidth: 2.5" class="absolute inset-0 w-full h-full -z-10 rounded-2xl"></svg>
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono font-black uppercase px-2 py-0.5 bg-blue-900 text-white rounded">CORE BUS</span>
          <span class="text-xs font-bold text-blue-950 bg-blue-100 px-2 py-0.5 rounded border border-blue-900">Partitioned</span>
        </div>
        <h3 class="text-3xl font-black text-slate-950">Kafka Event Stream</h3>
        <p class="text-base font-bold text-slate-800 mt-1">
          High-throughput immutable log. Ordered consumer groups distribute background tasks without backpressure.
        </p>
      </div>
      <div class="mt-4 flex items-center justify-between text-sm font-mono font-bold text-slate-800">
        <span>⚡ 42,000 msg/sec</span>
        <span>Replication: 3x</span>
      </div>
    </div>

    <!-- Card 3: Storage & Cache (col-span-4, tilted -1.2deg) -->
    <div class="col-span-4 relative p-5 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0f172a] rotate-[-1.2deg] flex flex-col justify-between">
      <svg data-rough-rect="fill: #bbf7d0; fillStyle: zigzag; roughness: 1.6; stroke: #0f172a; strokeWidth: 2" class="absolute inset-0 w-full h-full -z-10 rounded-2xl"></svg>
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono font-black uppercase px-2 py-0.5 bg-emerald-900 text-white rounded">STORAGE</span>
          <span class="text-xs font-bold text-emerald-900">WAL Enabled</span>
        </div>
        <h3 class="text-2xl font-black text-slate-950">Redis + Postgres</h3>
        <p class="text-sm font-bold text-slate-800 mt-1">
          Multi-layer caching with write-through cache eviction and ACID transactions.
        </p>
      </div>
      <div class="mt-4 pt-2 border-t-2 border-dashed border-slate-400 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
        <span>Hit Rate: 99.4%</span>
        <span>Failover: Auto</span>
      </div>
    </div>
  </div>

  <!-- 3. FOOTER TAKEAWAY BANNER -->
  <div class="relative z-10 flex items-center justify-between px-4 py-2.5 bg-amber-100 border-3 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a]">
    <div class="flex items-center gap-2.5">
      <span class="text-xl shrink-0">💡</span>
      <span class="text-xs sm:text-sm font-black text-slate-950 leading-snug">
        Rule of Thumb: Decouple synchronous requests from background workers using an event log.
      </span>
    </div>
    <span class="hidden md:inline-block whitespace-nowrap px-2.5 py-0.5 bg-white border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-800 shrink-0">
      Rough.js + HTML5
    </span>
  </div>
</div>
<script>
  // Draw hand-drawn directional connectors between cards using rough.svg
  const svg = document.getElementById('rough-layer');
  if (svg && window.rough) {
    const rc = window.rough.svg(svg);
    // Draw sketchy connecting arrows across the cards
    const arrow1 = rc.line(260, 240, 310, 240, { stroke: '#0f172a', strokeWidth: 3, roughness: 2 });
    const arrow2 = rc.line(770, 240, 820, 240, { stroke: '#0f172a', strokeWidth: 3, roughness: 2 });
    svg.appendChild(arrow1);
    svg.appendChild(arrow2);
  }
</script>`
  },

  // ==========================================
  // 4. MEMES & SOCIAL
  // ==========================================
  {
    id: 'dev-terminal-meme',
    name: 'Dev Terminal: Deploy on Friday',
    category: 'Meme & Social',
    type: 'html',
    description: 'Realistic macOS/Linux dark hacker terminal meme with syntax highlighted output.',
    code: `<div class="w-full h-full p-10 bg-[#080911] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-white/10 select-none">
  <!-- Glowing Background Accent -->
  <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none"></div>

  <!-- Meme Header -->
  <div class="text-center space-y-1">
    <span class="text-xs font-mono font-bold tracking-widest uppercase text-rose-400">FRIDAY DEPLOYMENT LAW</span>
    <h1 class="text-3xl font-black text-white">ONE DOES NOT SIMPLY MERGE TO MAIN AT 4:59 PM</h1>
  </div>

  <!-- Terminal Window Mockup -->
  <div class="rounded-2xl bg-[#0d101d] border border-white/15 overflow-hidden shadow-2xl my-4">
    <!-- Window Titlebar -->
    <div class="px-4 py-3 bg-[#13172b] border-b border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
      </div>
      <span class="text-xs font-mono text-slate-400 font-semibold">zsh - prod-cluster-east</span>
      <div class="w-12"></div>
    </div>

    <!-- Terminal Body -->
    <div class="p-6 font-mono text-xs md:text-sm space-y-2.5 bg-[#0a0d18]">
      <div class="flex items-center gap-2 text-slate-200">
        <span class="text-emerald-400 font-bold">deployer@prod:~$</span>
        <span class="text-white font-semibold">git push origin main --force</span>
      </div>
      <div class="text-slate-400 pt-2">Counting objects: 100% (42/42), done.</div>
      <div class="text-amber-400 font-bold">remote: [WARNING] Protected branch override executed!</div>
      <div class="text-rose-400 font-bold animate-pulse">remote: [CRITICAL] 42 microservices shutting down simultaneously...</div>
      <div class="text-slate-400">remote: Database locks active. Error rate: 99.8%.</div>
      <div class="text-cyan-400 font-bold pt-2">remote: Have a great weekend! 🎉</div>
    </div>
  </div>

  <!-- Footer Takeaway -->
  <div class="text-center text-xs font-mono text-slate-400">
    Rule #1: Friday deployments are strictly read-only.
  </div>
</div>`
  },
  {
    id: 'tweet-post-card',
    name: 'Verified Dev Post Card',
    category: 'Meme & Social',
    type: 'html',
    description: 'Realistic social post card with author avatar, verified badge, and metrics.',
    code: `<div class="w-full h-full p-12 bg-[#090b14] text-slate-100 flex flex-col justify-center items-center relative overflow-hidden font-sans border border-white/10 select-none">
  <!-- Post Card -->
  <div class="w-full max-w-2xl p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6">
    <!-- Author Row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-mono font-bold text-white text-lg shadow-lg">
          JD
        </div>
        <div>
          <div class="flex items-center gap-1.5 font-bold text-white text-base">
            <span>Senior Staff Engineer</span>
            <span class="text-cyan-400 text-sm">✓</span>
          </div>
          <div class="text-xs text-slate-400 font-mono">@kernel_panic</div>
        </div>
      </div>
      <span class="text-xs font-mono text-slate-500">2h ago</span>
    </div>

    <!-- Post Body -->
    <p class="text-xl text-slate-200 leading-relaxed font-medium">
      "Code passed all 2,000 unit tests locally in Docker container. Merged to main. Production database immediately enters read-only emergency state."
    </p>

    <!-- Metrics -->
    <div class="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-400">
      <span>💬 482 Replies</span>
      <span>🔁 1.4K Retweets</span>
      <span class="text-rose-400 font-bold">❤️ 6.2K Likes</span>
    </div>
  </div>
</div>`
  },
  {
    id: 'it-works-on-my-machine',
    name: 'Meme: "It Works On My Machine"',
    category: 'Meme & Social',
    type: 'html',
    description: 'Hilarious developer meme styled in Comic Neue with comparison cards and funny quotes.',
    code: `<div class="w-full h-full p-8 md:p-10 bg-[#090b14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-comic select-none border border-white/10"
  style="
    background-image:
      radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.15), transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(239, 68, 68, 0.15), transparent 40%),
      radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: auto, auto, 24px 24px;
  ">
  
  <!-- Ambient top glow -->
  <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

  <!-- Meme Rubber Stamp Sticker (Top-Right) -->
  <div class="absolute top-6 right-6 rotate-12 z-20 pointer-events-none select-none">
    <div class="px-4 py-1.5 rounded-xl bg-amber-400 text-black border-2 border-black font-black text-xs uppercase tracking-widest shadow-2xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span>100% LOCALHOST CERTIFIED</span>
    </div>
  </div>

  <!-- Header Badge & Comic Title -->
  <div class="text-center space-y-2 relative z-10">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-500/40 text-amber-300 font-bold text-xs shadow-md">
      <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      <span>OFFICIAL ISO-404 SPECIFICATION</span>
    </div>
    <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
      "IT WORKS ON MY MACHINE"
    </h1>
    <p class="text-base text-amber-200/90 font-bold">
      The gold standard of software verification since 1995.
    </p>
  </div>

  <!-- 2-Column Comparison with Lucide SVGs -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 my-3">
    <!-- Localhost Card -->
    <div class="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-3 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>
          </div>
          <span class="text-lg font-black text-emerald-300">Localhost (My MacBook)</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">0 BUGS</span>
      </div>
      <ul class="space-y-2 text-sm text-slate-200 font-bold">
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg>
          <span>120 FPS ultra-smooth animations</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg>
          <span>Hardcoded database credentials work</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg>
          <span>Node v18.2.1 installed globally in 2022</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg>
          <span>Zero latency (127.0.0.1 is very close)</span>
        </li>
      </ul>
    </div>

    <!-- Production Card -->
    <div class="p-5 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 space-y-3 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 animate-pulse">
            <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          </div>
          <span class="text-lg font-black text-rose-300">Production (Cloud K8s)</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 animate-pulse">FIRE ALERT</span>
      </div>
      <ul class="space-y-2 text-sm text-slate-200 font-bold">
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span>HTTP 502 Bad Gateway Everywhere</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span>Out Of Memory (Exit code 137)</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span>CEO tagging everyone in #general</span>
        </li>
        <li class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span>Postgres DB locked in perpetual panic</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Big Speech Bubble Takeaway with Lucide Vector Package -->
  <div class="relative z-10 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-center shadow-lg">
    <div class="flex items-center justify-center gap-2 text-xl md:text-2xl font-black text-amber-300">
      <svg class="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      <span>Recommended Solution:</span>
    </div>
    <div class="text-lg md:text-xl font-bold text-white mt-1.5 flex items-center justify-center gap-2">
      <svg class="w-5 h-5 text-amber-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <span>"Then we will ship your laptop to the client!"</span>
      <svg class="w-5 h-5 text-cyan-300 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/></svg>
    </div>
  </div>

  <!-- Footer Stamps -->
  <div class="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-bold">
    <span>Verified by: Senior Dev</span>
    <span class="text-amber-400 flex items-center gap-1">
      <span>Written with Comic Neue</span>
      <svg class="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    </span>
    <span>Ticket Closed: Won't Fix</span>
  </div>
</div>`
  },

  // ==========================================
  // 5. STARTERS
  // ==========================================
  {
    id: 'blank-starter',
    name: 'Blank Canvas Template',
    category: 'Starter',
    type: 'html',
    description: 'Minimal dark canvas setup ready for custom Tailwind HTML design.',
    code: `<div class="w-full h-full p-10 bg-[#070912] text-slate-100 flex flex-col justify-center items-center relative overflow-hidden font-sans border border-white/10 select-none">
  <div class="text-center space-y-3">
    <span class="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
      CUSTOM CANVAS
    </span>
    <h1 class="text-4xl font-extrabold text-white">Your Design Here</h1>
    <p class="text-slate-400 text-sm max-w-md mx-auto">
      Paste your Tailwind CSS, HTML markup, or SVG code into the editor to build your graphic.
    </p>
  </div>
</div>`
  }
];
