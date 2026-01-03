import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/financetracker/',

  plugins: [react()],

  server: {
    host: true,               // binds 0.0.0.0 in Container
    strictPort: true,
    // explicit Hosts instead of true (more stable and secure)
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '192.168.0.168',          // Pi-IP
      'financetracker-web',     // Docker-Hostname
      'financetracker-web-dev', // Docker-Hostname Dev
      'chrispicloud.dev',       // Domain
      'dev.chrispicloud.dev'    // Dev-Domain
    ],
    hmr: {
      protocol: 'wss',
      host: 'dev.chrispicloud.dev',
      port: 5173,
      clientPort: 443,        // Port used by client to connect to HMR WebSocket
      path: '/financetracker' // subpath for HMR WebSocket without trailing slash
    },

    // localhost only: http://localhost:5173/api -> http://api:8080
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/api/, ''),
      },
    },


  }
})