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
      '192.168.0.168',        // Pi-IP
      'financetracker-web',   // Docker-Hostname
      'chrispicloud.dev'      // Domain
    ],
    hmr: {
      protocol: 'ws',
      host: '192.168.0.168',  // dev: Pi-IP; prod: Domain
      port: 5173
    }
  }
})
