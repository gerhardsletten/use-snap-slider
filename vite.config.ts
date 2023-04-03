import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

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
    outDir: "dist",
    sourcemap: false,
    minify: false,
    lib: {
      entry: {
        "snap-slider": "src/lib/snap-slider.ts",
        "use-snap-slider": "src/lib/use-snap-slider.ts",
      },
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      // formats: ["es", "cjs"],
      // name: "createSnapSlider",
    },
    rollupOptions: {
      external: /^react/,
    },
  },
  server: {
    port: 3005,
    open: true,
  },
});
