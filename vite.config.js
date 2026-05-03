import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      sourcemap: false,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    
    // You can now use env variables in your config
    define: {
'_BASE_URL': JSON.stringify(env.VITE_BASE_URL),
'_BASE_FILE_URL': JSON.stringify(env.VITE_URL),
    }
  }
})