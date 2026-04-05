import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/todo/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: { index: resolve(__dirname, 'index-react.html') },
      output: { entryFileNames: 'assets/[name]-[hash].js' },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
