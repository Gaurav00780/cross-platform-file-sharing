import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      events: 'events',
      util: 'util',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
  },
})
