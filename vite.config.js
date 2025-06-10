import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  // cho phép vite sử dụng process.env.BUILD_MODE (hoặc các biến khác), mặc định thì không
  define: {
    // 'process.env': process.env,
    'process.env.BUILD_MODE': JSON.stringify(process.env.BUILD_MODE)
  },
  plugins: [react(), svgr()],
  base: '/',
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
