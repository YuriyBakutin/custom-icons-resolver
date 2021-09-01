import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import { viteCustomIconsResolver } from 'vite-custom-icons-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteComponents({
      globalComponentsDeclaration: true,
      customComponentResolvers: [
        viteCustomIconsResolver(),
      ],
    }),
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
