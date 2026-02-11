import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TR.dev/',
  build: {
    outDir: 'dist',
  },
  server: {
    watch: {
      ignored: ['**/\_old_site/**']
    }
  }
})
