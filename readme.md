# custom-icons-resolver

Resolver for using with the `unplugin-vue-components` npm package is designed to create elementary vue components from custom svg icons.

**Vue 3** and **Vue 2** are supported, because they are supported by the `unplugin-vue-components` npm package.

The same applies to the project's build systems. **Vite**, **Rollup**, **Webpack** and others that `unplugin-vue-components` package supports are supported.

`custom-icons-resolver` contains the necessary declarations to support **TypeScript**.

*Examples of Vue custom component-icon using* `custom-icons-resolver`:

![Vue custom component-icon examples](img/svg-components.png)

## Install

Before installing `custom-icons-resolver`, you must install [*unplugin-vue-components*](https://www.npmjs.com/package/unplugin-vue-components), if it is not already installed.

``` bash
    npm i -D unplugin-vue-components
```

Install the plugin `custom-icons-resolver`

``` bash
    npm i -D custom-icons-resolver
```

## Usage

### Vite

Configure vite.config (js or ts)

Vite + Vue 3 example

``` ts
// vite.config.ts (for Vue 3)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { customIconsResolver } from 'custom-icons-resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        customIconsResolver({
          prefix: 'custom-icon', // 'i' by default
          customIconsFolder: 'src/svg-icons', // 'src/icons' by default
        }),
      ],
    }),
  ],
}
```

Vite + Vue 2 example

``` js
// vite.config.js (for Vue 2)
import { createVuePlugin } from 'vite-plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import { viteCustomIconsResolver } from 'custom-icons-resolver'

export default {
  plugins: [
    createVuePlugin(),
    Components({
      customComponentResolvers: [
        viteCustomIconsResolver({
          prefix: 'custom-icon', // 'i' by default
          iconsFolderPath: 'src/svg-icons', // 'src/icons' by default
        }),
      ],
    }),
  ],
}
```

### Vite, Rollup, Webpack and others project's build systems

For other build systems, `custom-icons-resolver` is used in the same way. It is specified as a resolver in the corresponding field of options of the `unplugin-vue-components` plugin. Information about using `unplugin-vue-components` plugin to a specific build system is available in its [documentation](https://github.com/antfu/unplugin-vue-components/blob/main/README.md).

### Parameters

`viteCustomIconsResolver` has two optional parameters:

* `prefix` has a default value of `'i'`. It can be an empty string.
* `customIconsFolder` specifies the path to the folder where the svg icons files are located, and by default points to `src/icons` folder.

## Requirements for custom svg components

The name of custom svg components  can be in the `PascalCase`, `camelCase` or `kebab-case` and look like this:

* `<prefix-name-of-svg-file />`
* `<prefixNameOfSvgFile>`
* `<PrefixNameOfSvgFile>`

If `prefix` is empty string, the name of the component will be the same as the name of the corresponding svg file, converted to the case (`PascalCase`, `camelCase` or `kebab-case`) in which the component name is specified.

Custom svg components should not be registered and imported in the code of the parent or root component.

## Requirements for svg files

As mentioned above, each custom svg file must be placed in the folder specified via `customIconsFolder` parameter in the `vite.config.js` file or, if this parameter is skipped, in the `src/icons` folder by default.

The name of custom svg file can be in the `PascalCase`, `camelCase` or `kebab-case`, and must correspond to the name of component without a prefix.

### Managing size and color

The svg in the component will be displayed exactly as in the file.

If you need to manage the size or color, you should prepare `svg` document for this.

#### Size

To control icon size using the css `font-size` property you should set the value of the attributes `width` and `height` equal to `1em` in the svg header.

``` xml
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" ...>
```

#### Color

To control the color of the svg icon using css, you need to prepare the svg document in a certain way (this applies only to single-color icons).

1. You should get rid of paths with a non-zero `stroke`. To do this, all paths with a non-zero `stroke` should be converted to shapes. This can easily be done in a vector graphics editor such as [*Inkscape*](https://inkscape.org/).
2. You need to remove all `fill`, both attributes and style parameters in the svg document. In most cases, you can also delete all the `style` attributes. Value of fill svg icon will receive from the parent component.
3. In the header of svg document you should specify the fill="currentColor":

``` xml
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" ...>
```

After these transformations of svg document you can use the css `color` property to control the icon color.

To optimize the resulting svg file (compression, removal of unnecessary information), you can use the [*svgo*](https://github.com/svg/svgo) utility.

## Source of inspiration

The source of inspiration for writing this module, which creates components from custom svg icons, was the technology of [*unplugin-icons*](https://github.com/antfu/unplugin-icons) with [*iconify*](https://icon-sets.iconify.design/) for icon from [Iconify](https://icon-sets.iconify.design/) service.
