const fs = require('fs')
const path = require('path')

module.exports = (options) => {
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
    // Note: even if the name of icon component was specified in kebab
    // or camel, it is always passed pre-converted to pascal

    const componentsFolderPath = path.join(iconsFolderPath, 'icon-components')

    // Pre-cleaning of icon-components folder from '.vue' files
    if ( componentCounter === 0 ) {
      componentCounter++

      clearComponentsFolder(componentsFolderPath)
    }

    const nameWithoutPrefixInPascal = getNameWithoutPrefixInPascal(
      { prefix, name }
    )

    if ( !nameWithoutPrefixInPascal ) {
      return null
    }

    svgContent = getSvgContent({ iconsFolderPath, nameWithoutPrefixInPascal })

    if ( !svgContent ) {
      return null
    }

    const componentCode = getComponentCode(svgContent)

    const componentPath = path.join(componentsFolderPath, `${name}.vue`)
    fs.writeFileSync(componentPath, componentCode)

    return `/${componentPath}`
  }
}

const clearComponentsFolder = (componentsFolderPath) => {
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

const getNameWithoutPrefixInPascal = ({ prefix, name }) => {
  const prefixInPascal = kebabToPascal(prefix)

  if ( name.length <= prefixInPascal.length ) {
    return null
  }

  if ( prefixInPascal !== name.slice(0, prefixInPascal.length) ) {
    return null
  }

  return  name.slice(prefixInPascal.length)
}

const getSvgContent = ({ iconsFolderPath, nameWithoutPrefixInPascal }) => {
  let svgContent

  // Icon path with file name in PascalCase
  iconPath = path.join(iconsFolderPath, `${nameWithoutPrefixInPascal}.svg`)

  try { // Search for a file by name in the PascalCase
    svgContent = fs.readFileSync(iconPath, 'utf8')
  } catch(error) { // File in PascalCase not found
    if ( error.code !== 'ENOENT' ) {
      throw error
    }

    const iconPathInCamel = path.join(
      iconsFolderPath,
      `${firstLetterToLowerCase(nameWithoutPrefixInPascal)}.svg`
    )

    try { // Search for a file by name in the camelCase
      svgContent = fs.readFileSync(iconPathInCamel, 'utf8')
    } catch(error) { // File in camelCase not found
      if ( error.code !== 'ENOENT' ) {
        throw error
      }

      const iconPathKebab = path.join(
        iconsFolderPath,
        `${pascalToKebab(nameWithoutPrefixInPascal)}.svg`
      )

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
  // Only the SVG tag is used. Without any titles
  return svgContent.match(/(<svg (.*[\n])*<\/svg>)/ig).join('\n')
}

const getComponentCode = (svgContent) => `
<template>
<!-- This file was created automatically. You should not make changes to it! -->
${svgContent}
</template>
`

const firstLetterToLowerCase = (word) => {
  if ( !word ) {
    return ''
  }

  let word_ = word[0].toLowerCase()

  if ( word.length === 1 ) {
    return word_
  }

  word_ += word.slice(1)

  return word_
}

const pascalToKebab = (camel) => {
  if ( !camel ) {
    return ''
  }

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
  if ( !kebab ) {
    return ''
  }

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
