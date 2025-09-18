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
    port: 3000,
    host: true,         // 👈 this tells Vite to listen on all hosts
    allowedHosts: true  // 👈 disables the host check entirely
  }

})
