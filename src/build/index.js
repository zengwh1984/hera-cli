const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const inquirer = require('inquirer')
const { buildJS, copy, boxLog } = require('../utils')

const { tmpDistDir } = require('../config')

/**
 * Build and zip app
 * @param {Object} options
 */
function runBuild (options) {
  // check where user store their wxapp
  if (fs.existsSync('config.json')) {
    let content = fs.readFileSync('config.json', { encoding: 'utf8' })
    options.appDir = JSON.parse(content).dir
  } else if (fs.existsSync('dist')) {
    options.appDir = 'dist'
  } else {
    boxLog(
      chalk.yellow('cd to your project\n') +
        'or create config.json manually, fill it with: {"dir": "path/to/wxapp"}'
    )
    return
  }
  buildJS(options)
    .then(({ options, rootPath }) => {
      console.log('rootPath:' + rootPath)
      const appSrc = `../../${tmpDistDir}/app/app.zip`
      const appDist = `./demoapp.zip`
      return copy(appSrc, appDist).then(() => ({ options, rootPath }))
    })
    .catch(err => {
      console.log(chalk.red(err))
      process.exit(1)
    })
}

module.exports = runBuild
