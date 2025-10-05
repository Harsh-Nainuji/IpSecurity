import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://markerapi.com",
        changeOrigin: true,
        secure: false, // 👈 allows self-signed/strict SSL APIs
        rewrite: (path) => path.replace(/^\/api/, ""), // removes /api prefix
      },
    }
  }
})
