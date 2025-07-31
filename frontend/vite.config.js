import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // maplibre-gl only provides a prebuilt bundle which can confuse
    // Vite's dependency optimizer during import analysis.
    // Excluding it prevents "Failed to resolve import" errors.
    exclude: ['maplibre-gl'],
  },
  server: {
    port: 5173,
  },
})
