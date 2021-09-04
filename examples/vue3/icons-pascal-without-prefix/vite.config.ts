import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import customIconsResolver from 'custom-icons-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        customIconsResolver({
          prefix: '',
          iconsFolderPath: 'src/svg-icons',
        }),
      ],
    })
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        file: 'dist/bundle.js',
        format: 'iife',
        dir: null,
      },
    },
  },
})
