import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // raíz del proyecto
  build: {
    outDir: 'dist',
    rollupOptions: {
      // ✅ indicar que el punto de entrada es el index.html raíz
      input: resolve(__dirname, 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
