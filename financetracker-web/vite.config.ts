import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/financetracker',   // !important: Dev & Prod same sub-path
  server: {
    port: 5173,
    // should be enough HMR goes through Caddy reverse proxy
    // If HMR has issues behind proxy, set IP address hard:
    // origin: 'http://192.168.0.168:8080',
    // hmr: { protocol: 'ws', host: '192.168.0.168', port: 8080 },
  },
})