import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@techaaroorian-ui/aar-craft': path.resolve(import.meta.dirname, '../techaaroorian-ui/packages/aar-craft/dist/tailwind-v3.css'),
    },
  },
})
