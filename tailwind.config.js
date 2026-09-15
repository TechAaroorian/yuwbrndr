/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'font-comic',
    'font-arcade',
    'font-bebas',
    'font-meme',
    'font-inter',
    'font-jakarta',
    'font-outfit',
    'font-space',
    'font-syne',
    'font-mono',
    'font-jetbrains',
    'font-fira',
    'font-playfair',
    'font-cinzel',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#090b10',
          900: '#11141b',
          850: '#171b24',
          800: '#1d222d',
          700: '#2a303d',
          600: '#3b4352',
          accent: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
        fira: ['"Fira Code"', 'monospace'],
        playfair: ['"Playfair Display"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        bebas: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        meme: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        comic: ['"Comic Neue"', 'cursive', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 8px 24px rgba(0, 0, 0, 0.24)',
        'glow-cyan': '0 8px 24px rgba(0, 0, 0, 0.24)',
        'glow-rose': '0 8px 24px rgba(0, 0, 0, 0.24)',
        'glow-emerald': '0 8px 24px rgba(0, 0, 0, 0.24)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
