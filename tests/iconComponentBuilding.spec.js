const util = require('util')
global.TextDecoder = util.TextDecoder
global.TextEncoder = util.TextEncoder
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

const casesFolderPath = path.join(__dirname, 'casesBuilding')
const configCaseNames = fs.readdirSync(casesFolderPath)

const domPreparation = (htmlPath) => {
  return new Promise((resolve, reject) => {
    JSDOM.fromFile(htmlPath, { resources: 'usable', runScripts: 'dangerously' })
      .then((dom) => {
        const document = dom.window.document

        setTimeout(() => {
          resolve(document)
        }, 100)
      })
      .catch((e) => reject(e))
  })
}

const scanTestingProjectNames = async () => {
  describe('Building for different configuration cases', () => {
    for (const configCaseName of configCaseNames) {
      console.log('configCaseName: ', configCaseName)

      if (configCaseName === 'readme.md') {
        continue
      }

      const htmlPath = path.join(
        casesFolderPath,
        configCaseName,
        'dist',
        'index.html',
      )

      const rightHtml = `
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>custom-icons-resolver-test</title>
    <script src="./bundle.js" defer></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`

      fs.writeFileSync(htmlPath, rightHtml)

      test(`${configCaseName} build`, async () => {
        const document = await domPreparation(htmlPath)

        expect(document.getElementsByTagName('svg').length).toBe(2)
      })
    }
  })
}

scanTestingProjectNames()
