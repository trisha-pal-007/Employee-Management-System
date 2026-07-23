import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'react', replacement: resolve(__dirname, 'node_modules/react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules/react-dom') },
      { find: 'react/jsx-runtime', replacement: resolve(__dirname, 'node_modules/react/jsx-runtime') },
      { find: 'react/jsx-dev-runtime', replacement: resolve(__dirname, 'node_modules/react/jsx-dev-runtime') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:44304',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
