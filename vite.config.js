import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Configuración compatible con Vercel
export default defineConfig({
  plugins: [react()],
  root: '.', // la raíz del proyecto
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
})
