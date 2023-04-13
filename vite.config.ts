import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

const disableMinify = Boolean(process.env.DISABLE_MINIFY)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: !disableMinify,
    minify: !disableMinify,
    lib: {
      entry: {
        'snap-slider': 'src/lib/snap-slider.ts',
        'use-snap-slider': 'src/lib/use-snap-slider.ts',
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
