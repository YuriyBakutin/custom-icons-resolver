# Autotests

## Description

Autotests check if the build of the application is working correctly for different configuration options.

Examples Vue 3 projects in the `examples/vue3` folder are used as set of configuration options to be tested. The fact of adding two custom SVG icons to the page is checked for each example.

There is no need to separately test the build for Vue 2, since the vote-custom-icons-resolver plugin is set as a parameter of the vite-plugin-components module and does not contain code specific to Vue 2.

You can add new projects to the folder, as well as delete them. The test program analyzes the contents of the `examples/vue3` and runs a test for each project automatically. To be used as a test object, each project must meet certain requirements.

## Project requirements in `examples/vue3`

The project code should add two custom SVG icons to the page using a `vite-custom-icons-resolver` plugin. Their number is calculated during the test.

## Tests starting

All commands for preparing for testing and testing itself are run from the root folder of the plugin.

Before running tests, you need to install all dependencies for all projects in folder `examples/vue3` and build them

```bash
npm run installAndBuild:allVue3
```

Testing is started with the command

```bash
npm t
```
