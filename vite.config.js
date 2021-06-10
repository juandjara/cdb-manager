import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    // fix for compiling deck.gl with esbuild
    node3: {}
  },
  resolve: {
    alias: [
      // fix for compiling deck.gl with esbuild
      { find: '*.node', replacement: path.resolve(__dirname, './empty') },
      // replacement for all the libs that use mapbox-gl
      { find: 'mapbox-gl', replacement: 'maplibre-gl' },
      // this allows us to use absolute imports like '@/components/Button'
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  }
})
