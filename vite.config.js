import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    node3: {}
  },
  resolve: {
    alias: [
      { find: '*.node', replacement: path.resolve(__dirname, './empty') },
      { find: 'mapbox-gl', replacement: 'maplibre-gl' },
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  }
})
