const chalk = require("chalk");
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const file = require('html-wiring');

const jsEslintCfg = require('../eslint/js.eslintrc');
const reactEslintCfg = require('../eslint/react.eslintrc');
const vueEslintCfg = require('../eslint/vue.eslintrc');


function getHelp() {
  console.log(chalk.green(" Usage : "));
  console.log();
  console.log(chalk.green(" uba install <name>"));
  console.log();
  process.exit(0);
}

function getVersion() {
  console.log(chalk.green(require("../package.json").version));
  process.exit(0);
}

function lint(type, dir) {

        let eslintCfg = jsEslintCfg;
        let pathAry = [];
        switch (type) {
            case 'react':
                eslintCfg = reactEslintCfg;
                break;
            case 'vue':
                eslintCfg = vueEslintCfg;
                break;
        }
        dir.forEach(function(item) {
            pathAry.push(
                path.join(process.cwd(), './'+ item +'/**/*.js')
            )
        })

        gulp.src(pathAry)
            .pipe(eslint(eslintCfg))
            .pipe(eslint.format('table'))
            .pipe(eslint.failAfterError());

}

module.exports = {
  plugin: function(options) {
    commands = options.cmd;
    pluginname = options.name;
    if (options.argv.h || options.argv.help) {
      getHelp();
    }
    if (options.argv.v || options.argv.version) {
      getVersion();
    }
    if(options.argv.t || options.argv.type){
        lint(options.argv.t, options.argv._.slice(1));
    }

    console.log(options.argv);

    console.log(chalk.green("Hello"));



  }
}
