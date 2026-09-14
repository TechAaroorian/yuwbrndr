/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#07080b',
          900: '#0d0e15',
          850: '#12141e',
          800: '#181b28',
          700: '#23273a',
          600: '#323750',
          accent: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        meme: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 50px -10px rgba(99, 102, 241, 0.3)',
        'glow-cyan': '0 0 50px -10px rgba(6, 182, 212, 0.3)',
        'glow-rose': '0 0 50px -10px rgba(244, 63, 94, 0.3)',
        'glow-emerald': '0 0 50px -10px rgba(16, 185, 129, 0.3)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
