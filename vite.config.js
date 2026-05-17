import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const blockedDevPaths = [
  '/_old_site',
  '/articles',
  '/assets',
  '/scripts',
  '/README.md',
]

function blockRepoOnlyDevAssets() {
  return {
    name: 'block-repo-only-dev-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0] ?? ''

        if (blockedDevPaths.some((blocked) => path === blocked || path.startsWith(`${blocked}/`))) {
          res.statusCode = 404
          res.end('Not found')
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [blockRepoOnlyDevAssets(), react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
