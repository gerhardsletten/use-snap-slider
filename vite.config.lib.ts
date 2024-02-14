import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib'],
    }),
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    lib: {
      entry: {
        'snap-slider': 'lib/snap-slider.ts',
        'use-snap-slider': 'lib/use-snap-slider.ts',
      },
      fileName: (format, entryName) => {
        const ext = format === 'es' ? '.js' : ''
        return `${entryName}.${format}${ext}`
      },
    },
    rollupOptions: {
      external: /^react/,
    },
  },
  server: {
    port: 3005,
    open: true,
  },
})
