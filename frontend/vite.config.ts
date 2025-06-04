import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'monaco-editor/esm/vs/language/typescript/ts.worker',
      'monaco-editor/esm/vs/language/json/json.worker',
      'monaco-editor/esm/vs/language/html/html.worker',
      'monaco-editor/esm/vs/language/css/css.worker',
      'monaco-editor/esm/vs/editor/editor.worker',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/teacher': {
        target: 'http://127.0.0.1:8010', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/teacher')
      },
      '/students': {
        target: 'http://127.0.0.1:8020', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/students')
      },
      '/curriculum': {
        target: 'http://127.0.0.1:8030', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/curriculum')
      },
      '/enrollment': {
        target: 'http://127.0.0.1:8040', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/enrollment')
      },
      '/history': {
        target: 'http://127.0.0.1:8050', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/history')
      },
      '/session': {
        target: 'http://127.0.0.1:8050', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/session')
      },
      '/task': {
        target: 'http://127.0.0.1:8050', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/task')
      },
      '/learningAnalytics': {
        target: 'http://127.0.0.1:8060', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/learningAnalytics')
      },
      // '/api/knit': {
      //   target: 'http://localhost:5004', // 后端服务器地址
      //   changeOrigin: true,
      // },
    },
  },
})
