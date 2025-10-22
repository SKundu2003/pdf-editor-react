import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src')
    }
  },
  server: {
    port: 5000,
    host: '0.0.0.0',    // 👈 this tells Vite to listen on all hosts
    strictPort: true    // 👈 fail if port 5000 is not available
  }

})
