import { createVuePlugin } from 'vite-plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import customIconsResolver from 'custom-icons-resolver'

export default {
  plugins: [
    createVuePlugin(),
    Components({
      resolvers: [
        customIconsResolver({
          prefix: 'custom-icon',
          iconsFolderPath: 'icons-camel-without-prefix'
        }),
      ],
    }),
  ],
}
