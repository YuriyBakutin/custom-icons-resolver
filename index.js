const fs = require('fs')

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

function viteCustomIconsResolver (options){
  const defaultOptions = {
    prefix: 'i',
    iconsFolderPath: 'src/icons',
  }

  const {
    prefix,
    iconsFolderPath,
  } = { ...defaultOptions, ...options }

  return (name) => {
    // Note: even if the name of icon component was specified in kebab, it is always passed pre-converted to pascal

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
    const iconPath = `${iconsFolderPath}/${nameWithoutPrefix}.svg`
    let svgContent

    try { // Search for a file by name in the PascalCase
      svgContent = fs.readFileSync(iconPath, 'utf8')
    } catch(error) { // File in PascalCase not found
      if ( error.code !== 'ENOENT' ) {
        console.error('custom-icons-resolver error:', error)
        return null
      }

      const iconPathInCamel = `${iconsFolderPath}/${firstLetterToLowerCase(nameWithoutPrefix)}.svg`

      try { // Search for a file by name in the camelCase
        svgContent = fs.readFileSync(iconPathInCamel, 'utf8')
      } catch(error) { // File in camelCase not found
        if ( error.code !== 'ENOENT' ) {
          console.error('custom-icons-resolver error:', error)
          return null
        }

        const iconPathKebab = `${iconsFolderPath}/${pascalToKebab(nameWithoutPrefix)}.svg`

        try { // Search for a file by name in the kebab-case
          svgContent = fs.readFileSync(iconPathKebab, 'utf8')
        } catch(error) { // File in kebab-case not found
          if ( error.code !== 'ENOENT' ) {
            console.error('custom-icons-resolver error:', error)
          }

          return null
        }
      }
    }

    const componentCode = `
<template>
${svgContent}
</template>
`
    const tmpFolderPath = __dirname + '/tmp-icon-components'
    const componentPath = `${tmpFolderPath}/${nameWithoutPrefix}.vue`

    try {
      fs.writeFileSync(componentPath, componentCode)
    } catch ( error ) {
      console.error('custom-icons-resolver error:', error)
      return null
    }

    return componentPath
  }
}

exports.viteCustomIconsResolver = viteCustomIconsResolver
