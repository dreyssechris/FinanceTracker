import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { // leads to Dev-Server and Backend at http://localhost:5184
        target: 'http://localhost:5184',
        changeOrigin: true,
        secure: false
      }
    }
  }
})