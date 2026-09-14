export type StudioMode = 'customCode' | 'infographic' | 'meme' | 'illustration3d' | 'illustrationSvg';

export type InfographicTemplate = 'bento' | 'timeline' | 'comparison' | 'stat-highlight';
export type MemeTemplate = 'dev-terminal' | 'tweet-card' | 'classic' | 'split-vs';
export type ThreeShapeType = 'isometric-cube' | 'geodesic-sphere' | 'torus-knot' | 'cyber-cylinder';
export type SvgTemplate = 'mesh-gradient-card' | 'tech-badge' | 'abstract-wave';

export type PlatformType = 'X / Twitter' | 'LinkedIn' | 'Instagram' | 'Open Graph / Web' | 'YouTube' | 'Dev Article';

export type AspectPreset = {
  id: string;
  platform: PlatformType;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  label: string;
  recommendedScale: 1 | 2 | 4;
  tip: string;
  safeZone?: string;
  bestFor: string;
};

export interface UploadedAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: number;
}

export const ASPECT_PRESETS: AspectPreset[] = [
  {
    id: 'x-post',
    platform: 'X / Twitter',
    name: 'X (Twitter) In-Stream Post',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    label: '1200 × 675 (16:9)',
    recommendedScale: 2,
    tip: 'Export at 2x (2400×1350) to bypass Twitter/X aggressive JPEG compression algorithm and retain crisp vector fonts.',
    safeZone: 'Center 16:9 viewport. No critical text within 30px of outer edges.',
    bestFor: 'Memes, release announcements, tech infographics'
  },
  {
    id: 'linkedin-square',
    platform: 'LinkedIn',
    name: 'LinkedIn Feed Post (Square)',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    label: '1080 × 1080 (1:1)',
    recommendedScale: 2,
    tip: 'LinkedIn compresses images heavily on desktop. 2x (2160×2160) PNG prevents blurry text on high-DPI MacBooks and 4K monitors.',
    safeZone: 'Full square display across both mobile and desktop feed streams.',
    bestFor: 'Bento grids, milestone statistics, comparison cards'
  },
  {
    id: 'linkedin-landscape',
    platform: 'LinkedIn',
    name: 'LinkedIn Landscape Banner',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    label: '1200 × 627 (1.91:1)',
    recommendedScale: 2,
    tip: 'Standard format for LinkedIn shared article links and sponsored content.',
    safeZone: 'Main subject centered; avoid corners.',
    bestFor: 'Case study previews, company news'
  },
  {
    id: 'instagram-portrait',
    platform: 'Instagram',
    name: 'Instagram Portrait Post',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    label: '1080 × 1350 (4:5)',
    recommendedScale: 2,
    tip: '4:5 occupies the maximum vertical screen area in Instagram mobile feeds, maximizing engagement by up to 33%.',
    safeZone: 'Keep core graphic inside center 1080×1080 square so it looks perfect when cropped on your profile grid.',
    bestFor: 'Vertical infographics, developer flowcharts, memes'
  },
  {
    id: 'instagram-square',
    platform: 'Instagram',
    name: 'Instagram Classic Square',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    label: '1080 × 1080 (1:1)',
    recommendedScale: 2,
    tip: '1:1 format maps directly to profile thumbnail grid without any clipping.',
    safeZone: '100% visible on both feed and grid.',
    bestFor: 'Product badges, quick stats, single-panel memes'
  },
  {
    id: 'instagram-story',
    platform: 'Instagram',
    name: 'Instagram / TikTok Story (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    label: '1080 × 1920 (9:16)',
    recommendedScale: 2,
    tip: 'Full-screen mobile vertical. Keep top 200px and bottom 250px clear for profile header and reply bar.',
    safeZone: 'Avoid top 220px (username) and bottom 280px (reply input & buttons).',
    bestFor: 'Step-by-step guides, story highlights, countdowns'
  },
  {
    id: 'og-seo',
    platform: 'Open Graph / Web',
    name: 'Open Graph (SEO Social Card)',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    label: '1200 × 630 (OG Card)',
    recommendedScale: 2,
    tip: 'The universal standard for <meta property="og:image">. Rendered by Slack, Discord, Facebook, WhatsApp, and iMessage.',
    safeZone: 'Center 1000×500 px. Keep key text away from borders.',
    bestFor: 'Website previews, GitHub repo social cards, blog headers'
  },
  {
    id: 'youtube-thumb',
    platform: 'YouTube',
    name: 'YouTube Video Thumbnail',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    label: '1280 × 720 (16:9)',
    recommendedScale: 2,
    tip: 'Must stay under 2MB for YouTube upload. Use high-contrast fonts so text remains readable on mobile search results.',
    safeZone: 'Avoid bottom-right corner where timestamp badge (00:00) overlays.',
    bestFor: 'Tutorial thumbnails, video banners, tech talks'
  },
  {
    id: 'dev-cover',
    platform: 'Dev Article',
    name: 'Dev.to & Hashnode Post Cover',
    width: 1000,
    height: 420,
    aspectRatio: '2.38:1',
    label: '1000 × 420 (Banner)',
    recommendedScale: 2,
    tip: 'Ultra-wide banner optimized for developer blogging platforms with centered title and minimal clutter.',
    safeZone: 'Full width visible on article header.',
    bestFor: 'Coding tutorial banners, technical write-up covers'
  }
];


export type ColorTheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
};

export const COLOR_THEMES: Record<string, ColorTheme> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Indigo',
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#818cf8',
    background: '#090a10',
    surface: '#121422',
    border: 'rgba(99, 102, 241, 0.2)',
    text: '#f8fafc',
    muted: '#94a3b8',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    primary: '#ec4899',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0a0512',
    surface: '#150d24',
    border: 'rgba(236, 72, 153, 0.25)',
    text: '#ffffff',
    muted: '#c084fc',
  },
  emerald: {
    id: 'emerald',
    name: 'Terminal Emerald',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#050c08',
    surface: '#0d1c13',
    border: 'rgba(16, 185, 129, 0.25)',
    text: '#ecfdf5',
    muted: '#6ee7b7',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#fbbf24',
    background: '#0c0a06',
    surface: '#1c160c',
    border: 'rgba(245, 158, 11, 0.25)',
    text: '#fffbeb',
    muted: '#fcd34d',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Pure Monochrome',
    primary: '#ffffff',
    secondary: '#94a3b8',
    accent: '#e2e8f0',
    background: '#000000',
    surface: '#111111',
    border: 'rgba(255, 255, 255, 0.15)',
    text: '#ffffff',
    muted: '#888888',
  },
};

// Infographic Data Model
export interface InfographicData {
  title: string;
  subtitle: string;
  tag: string;
  themeId: string;
  template: InfographicTemplate;
  bentoItems: Array<{
    id: string;
    title: string;
    value: string;
    change: string;
    description: string;
    icon: string;
  }>;
  timelineItems: Array<{
    step: string;
    title: string;
    desc: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  comparison: {
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
  };
  statHighlight: {
    number: string;
    unit: string;
    growth: string;
    metricLabel: string;
    footnote: string;
  };
}

// Meme Data Model
export interface MemeData {
  template: MemeTemplate;
  topText: string;
  bottomText: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  bodyText: string;
  timestamp: string;
  likes: string;
  retweets: string;
  terminalCommand: string;
  terminalOutput: string[];
  splitLeftLabel: string;
  splitRightLabel: string;
  splitLeftText: string;
  splitRightText: string;
  bgImageUrl?: string;
  fontSize: number;
}

// 3D Scene Config
export interface ThreeSceneConfig {
  shape: ThreeShapeType;
  color: string;
  emissiveColor: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  rotationSpeed: number;
  cameraFov: number;
  zoom: number;
  bgType: 'dark' | 'transparent' | 'gradient';
  title: string;
  subtitle: string;
  techBadge: string;
}

// Parametric SVG Config
export interface SvgGraphicConfig {
  template: SvgTemplate;
  title: string;
  subtitle: string;
  badgeText: string;
  color1: string;
  color2: string;
  color3: string;
  complexity: number;
}
