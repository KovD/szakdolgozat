import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),mkcert()],
  base: './',

  server: {
    https: true,
    host: '0.0.0.0',
    port: 5173,
  },
})
