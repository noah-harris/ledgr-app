import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    watch: {
      // network share doesn't send file change events, so poll instead
      usePolling: true,
      interval: 500,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
})