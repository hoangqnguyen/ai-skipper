import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false, // Don't wipe dist, let popup build handle that or run sequentially
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/content.js'),
      name: 'ContentScript',
      fileName: () => 'assets/content.js',
      formats: ['iife'] // Force IIFE so no "import" statements remain
    },
    rollupOptions: {
      output: {
        extend: true,
      }
    }
  }
})
