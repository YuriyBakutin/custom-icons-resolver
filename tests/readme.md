# Autotests

## Description

Autotests check if the build of the application is working correctly for different configuration options.

You can add new projects to this folder, as well as delete them. The test program analyzes the contents of the `casesBuilding` folder and runs a test for each project automatically. To be used as a test object, each project must meet certain requirements.

## Project requirements in `examples/vue3`

The project code should add two custom SVG icons to the page using a `custom-icons-resolver` plugin. Their number is calculated during the test.

## Tests starting

The command to start tests is run from the root folder of the package.

Testing is started with the command

```bash
npm t
```
