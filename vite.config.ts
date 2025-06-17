import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    // proxy: {
    //   '/ifconfig': {
    //     target: 'https://ifconfig.co',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/ifconfig/, '/json'),
    //   },
    // },
  },
  base: '/MiniMeteo/'
})

