const fs = require('fs')
const path = require('path')

const firstLetterToLowerCase = (word) => {
  let Word = word[0].toLowerCase()

  if ( word.length === 1 ) {
    return Word
  }

  for ( let i = 1; i < word.length; i++ ) {
    Word += word[i]
  }

  return Word
}

const pascalToKebab = (camel) => {
  let kebab = camel[0].toLowerCase()

  if ( camel.length === 1 ) {
    return kebab
  }

  for ( let i = 1; i < camel.length; i++ ) {
    if ( camel[i] === camel[i].toUpperCase() ) {
      kebab += '-' + camel[i].toLowerCase()
    } else {
      kebab += camel[i]
    }

  }

  return kebab
}

const kebabToPascal = (kebab) => {
  let pascal = kebab[0].toUpperCase()

  if ( kebab.length === 1 ) {
    return pascal
  }

  let hyphenStep = false

  for ( let i = 1; i < kebab.length; i++ ) {
    if ( kebab[i] === '-' ) {
      hyphenStep = true
    } else if ( hyphenStep ) {
      hyphenStep = false
      pascal += kebab[i].toUpperCase()
    } else {
      pascal += kebab[i].toLowerCase()
    }
  }

  return pascal
}

function customIconsResolver (options){
  const defaultOptions = {
    prefix: 'i',
    iconsFolderPath: 'src/icons',
  }

  const {
    prefix,
    iconsFolderPath,
  } = { ...defaultOptions, ...(options ? options : {}) }

  let componentCounter = 0

  return (name) => {
    // Note: even if the name of icon component was specified in kebab,
    // it is always passed pre-converted to pascal

    const componentsFolderPath = path.join(iconsFolderPath, 'icon-components')

    // Pre-cleaning of tmp-icon-components folder from '.vue' files
    if ( componentCounter === 0 ) {
      componentCounter++

      let files
      let tmpFolderExists = true

      try { // Checking the folder for existence
        files = fs.readdirSync(componentsFolderPath)
      } catch(error) {
        if ( error.code !== 'ENOENT' ) { // The folder does not exist
          throw error
        } else {
          tmpFolderExists = false

          fs.mkdirSync(componentsFolderPath)
        }
      }

      if ( tmpFolderExists ) {
        for (const file of files) {
          if ( !file.includes('.') ) {
            return
          }

          if ( file.slice(file.lastIndexOf('.')) === '.vue' ) {
            fs.unlinkSync(path.join(componentsFolderPath, file))
          }
        }
      }
    }

    let nameWithoutPrefix = name

    if ( prefix ) {
      const prefixInPascal = kebabToPascal(prefix)

      if ( name.length <= prefixInPascal.length ) {
        return null
      }

      if ( prefixInPascal !== name.slice(0, prefixInPascal.length) ) {
        return null
      }

      nameWithoutPrefix = nameWithoutPrefix.slice(prefixInPascal.length)
    }

    // Icon path with file name in PascalCase
    const iconPath = path.join(iconsFolderPath, `${nameWithoutPrefix}.svg`)
    let svgContent

    try { // Search for a file by name in the PascalCase
      svgContent = fs.readFileSync(iconPath, 'utf8')
    } catch(error) { // File in PascalCase not found
      if ( error.code !== 'ENOENT' ) {
        throw error
      }

      const iconPathInCamel = path.join(iconsFolderPath, `${firstLetterToLowerCase(nameWithoutPrefix)}.svg`)

      try { // Search for a file by name in the camelCase
        svgContent = fs.readFileSync(iconPathInCamel, 'utf8')
      } catch(error) { // File in camelCase not found
        if ( error.code !== 'ENOENT' ) {
          throw error
        }

        const iconPathKebab = path.join(iconsFolderPath, `${pascalToKebab(nameWithoutPrefix)}.svg`)

        try { // Search for a file by name in the kebab-case
          svgContent = fs.readFileSync(iconPathKebab, 'utf8')
        } catch(error) { // File in kebab-case not found
          if ( error.code !== 'ENOENT' ) {
            throw error
          }

          return null
        }
      }
    }

    svgContent = svgContent.replace(/(<\?xml [^>]*>\n*)/ig, '')
    svgContent = svgContent.replace(/(<!DOCTYPE [^>]*>\n*)/ig, '')

    const componentCode = `
<template>
<!-- This file was created automatically. You should not make changes to it! -->
${svgContent}
</template>
`

    // const componentPath = `${componentsFolderPath}/${nameWithoutPrefix}.vue`
    const componentPath = path.join(componentsFolderPath, `${nameWithoutPrefix}.vue`)
    fs.writeFileSync(componentPath, componentCode)

    return '/' + componentPath
  }
}

exports.customIconsResolver = customIconsResolver
