export interface StickerItem {
  id: string;
  name: string;
  category: 'lucide' | 'tech' | 'stamps';
  tags: string[];
  svgHtml: string;
}

export const STICKERS_CATALOG: StickerItem[] = [
  // ==========================================
  // 1. LUCIDE CORE DEVELOPER VECTORS
  // ==========================================
  {
    id: 'lucide-terminal',
    name: 'Terminal / CLI',
    category: 'lucide',
    tags: ['code', 'cli', 'console', 'bash'],
    svgHtml: `<svg class="w-6 h-6 text-emerald-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  },
  {
    id: 'lucide-bug',
    name: 'Bug / Debug',
    category: 'lucide',
    tags: ['bug', 'issue', 'error', 'defect'],
    svgHtml: `<svg class="w-6 h-6 text-rose-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1 2"/><path d="m14 4-1 2"/></svg>`,
  },
  {
    id: 'lucide-database',
    name: 'Database / Storage',
    category: 'lucide',
    tags: ['sql', 'postgres', 'storage', 'data'],
    svgHtml: `<svg class="w-6 h-6 text-cyan-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
  },
  {
    id: 'lucide-flame',
    name: 'Fire / Flame',
    category: 'lucide',
    tags: ['fire', 'hot', 'prod', 'alert'],
    svgHtml: `<svg class="w-6 h-6 text-amber-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },
  {
    id: 'lucide-cpu',
    name: 'CPU / Microchip',
    category: 'lucide',
    tags: ['chip', 'processor', 'hardware', 'perf'],
    svgHtml: `<svg class="w-6 h-6 text-indigo-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  },
  {
    id: 'lucide-rocket',
    name: 'Rocket / Deploy',
    category: 'lucide',
    tags: ['ship', 'launch', 'deploy', 'fast'],
    svgHtml: `<svg class="w-6 h-6 text-violet-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  },
  {
    id: 'lucide-shield-check',
    name: 'Shield Verified',
    category: 'lucide',
    tags: ['security', 'verified', 'safe', 'auth'],
    svgHtml: `<svg class="w-6 h-6 text-emerald-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    id: 'lucide-git-branch',
    name: 'Git Branch',
    category: 'lucide',
    tags: ['git', 'branch', 'vcs', 'merge'],
    svgHtml: `<svg class="w-6 h-6 text-cyan-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  },
  {
    id: 'lucide-zap',
    name: 'Lightning / Fast',
    category: 'lucide',
    tags: ['fast', 'speed', 'instant', 'power'],
    svgHtml: `<svg class="w-6 h-6 text-amber-300 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
  {
    id: 'lucide-coffee',
    name: 'Coffee / Fuel',
    category: 'lucide',
    tags: ['coffee', 'caffeine', 'developer', 'energy'],
    svgHtml: `<svg class="w-6 h-6 text-amber-200 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 2v2"/><path d="M17 12h1a2 2 0 0 1 0 4h-1"/></svg>`,
  },
  {
    id: 'lucide-lock',
    name: 'Lock / Protected',
    category: 'lucide',
    tags: ['security', 'lock', 'protected', 'auth'],
    svgHtml: `<svg class="w-6 h-6 text-indigo-300 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    id: 'lucide-server',
    name: 'Server Rack',
    category: 'lucide',
    tags: ['server', 'backend', 'cloud', 'host'],
    svgHtml: `<svg class="w-6 h-6 text-slate-200 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  },

  // ==========================================
  // 2. OPEN SOURCE TECH VECTORS & BADGES
  // ==========================================
  {
    id: 'tech-docker',
    name: 'Docker Whale Badge',
    category: 'tech',
    tags: ['docker', 'container', 'devops', 'whale'],
    svgHtml: `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs"><svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.79 9.89c-.567-.803-1.61-1.34-2.73-1.385-.304-.012-.614.02-.917.098a4.93 4.93 0 00-.518-1.577c-.422-.782-1.077-1.39-1.895-1.76-.088-.04-.181-.03-.257.025a.3.3 0 00-.1.246c.162 1.39.02 2.766-.412 4.07-.3.9-.76 1.74-1.36 2.49H1.14c-.63 0-1.14.51-1.14 1.14 0 4.19 2.78 8.01 6.91 9.49a15.7 15.7 0 005.15.86c6.26 0 11.66-4.52 11.94-10.82.01-.25.04-.5.09-.74.1-.48.4-.76.7-.91z"/></svg><span>Docker</span></div>`,
  },
  {
    id: 'tech-react',
    name: 'React Atomic Vector',
    category: 'tech',
    tags: ['react', 'frontend', 'ui', 'atom'],
    svgHtml: `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs"><svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg><span>React</span></div>`,
  },
  {
    id: 'tech-kubernetes',
    name: 'Kubernetes Helm Badge',
    category: 'tech',
    tags: ['k8s', 'kubernetes', 'cloud', 'helm'],
    svgHtml: `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs"><svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="4.2" y1="7.5" x2="9.4" y2="10.5"/><line x1="14.6" y1="13.5" x2="19.8" y2="16.5"/><line x1="4.2" y1="16.5" x2="9.4" y2="13.5"/><line x1="14.6" y1="10.5" x2="19.8" y2="7.5"/></svg><span>Kubernetes</span></div>`,
  },
  {
    id: 'tech-github',
    name: 'GitHub Octocat Badge',
    category: 'tech',
    tags: ['github', 'git', 'repo', 'code'],
    svgHtml: `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-bold text-xs"><svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg><span>GitHub</span></div>`,
  },

  // ==========================================
  // 3. MEME & RUBBER STAMP STICKERS
  // ==========================================
  {
    id: 'stamp-works-on-my-machine',
    name: 'Stamp: "Works On My Machine"',
    category: 'stamps',
    tags: ['stamp', 'meme', 'localhost', 'verified'],
    svgHtml: `<div class="inline-block -rotate-6 px-4 py-2 rounded-xl bg-amber-400 text-black border-4 border-black font-black text-sm uppercase tracking-widest shadow-2xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] select-none">★ WORKS ON MY MACHINE ★</div>`,
  },
  {
    id: 'stamp-tested-in-prod',
    name: 'Stamp: "Tested in Production"',
    category: 'stamps',
    tags: ['stamp', 'hazard', 'danger', 'production'],
    svgHtml: `<div class="inline-block rotate-3 px-4 py-2 rounded-xl bg-rose-600 text-white border-4 border-rose-300 font-black text-sm uppercase tracking-widest shadow-2xl drop-shadow-[0_8px_16px_rgba(244,63,94,0.6)] select-none">🔥 TESTED IN PROD 🔥</div>`,
  },
  {
    id: 'stamp-iso-certified',
    name: 'Badge: "Certified 100% Bug-Free"',
    category: 'stamps',
    tags: ['stamp', 'iso', 'verified', 'gold'],
    svgHtml: `<div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/30 to-amber-600/20 border-2 border-amber-400/60 text-amber-200 font-bold text-xs uppercase tracking-wider shadow-lg"><svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg><span>CERTIFIED BUG-FREE*</span></div>`,
  },
  {
    id: 'stamp-do-not-touch',
    name: 'Tape: "DO NOT TOUCH (It Works)"',
    category: 'stamps',
    tags: ['tape', 'warning', 'hazard', 'legacy'],
    svgHtml: `<div class="inline-block rotate-2 px-5 py-2 rounded-md bg-yellow-400 text-black border-2 border-dashed border-black font-mono font-black text-xs uppercase tracking-wider shadow-xl">⚠️ DO NOT TOUCH (It somehow works) ⚠️</div>`,
  },
  {
    id: 'stamp-senior-approved',
    name: 'Stamp: "LGTM 👍 (Did Not Read)"',
    category: 'stamps',
    tags: ['stamp', 'lgtm', 'pr', 'review'],
    svgHtml: `<div class="inline-block -rotate-3 px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-lg border-2 border-emerald-300">✓ LGTM (Did not read PR)</div>`,
  },
];
