import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@radix-ui/react-dialog'],
  },
  server: {
    proxy: {
      '/tasks': {
        target: process.env.VITE_TEST_BACKEND,
        changeOrigin: true,
        secure: false, // Disable for self-signed certificates
      },
    },
  },
})
