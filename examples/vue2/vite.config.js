import { createVuePlugin } from 'vite-plugin-vue2'
import Components from 'vite-plugin-components'
import { viteCustomIconsResolver } from 'vite-custom-icons-resolver'

export default {
  plugins: [
    createVuePlugin(),
    Components({
      customComponentResolvers: [
        viteCustomIconsResolver({
          prefix: 'custom-icon',
          iconsFolderPath: 'icons-camel-without-prefix'
        }),
      ],
    }),
  ],
}
