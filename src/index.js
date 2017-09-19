const chalk = require("chalk");
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const file = require('html-wiring');
const glob = require('glob');
const fs = require('fs');
const requireUncached = require("require-uncached");

const debug = require("debug")("uba-lint:config-file");

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

function readFile(filePath) {
    return fs.readFileSync(filePath, "utf8").replace(/^\ufeff/, "");
}

function loadJSConfigFile(filePath) {
    debug(`Loading JS config file: ${filePath}`);
    try {
        return requireUncached(filePath);
    } catch (e) {
        debug(`Error reading JavaScript file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}



function lint(type, dir) {

    let eslintCfg = jsEslintCfg;
    let eslintPath = './eslint/js.eslint.js';
    let pathAry = [];
    switch (type) {
        case 'react':
            eslintCfg = reactEslintCfg;
            eslintPath = './eslint/react.eslint.js';
            break;
        case 'vue':
            eslintCfg = vueEslintCfg;
            eslintPath = './eslint/vue.eslint.js';
            break;
    }


    dir.forEach(function (item) {
        fs.exists(item, function (exists) {
            console.log(item, exists);
            if(exists){
                pathAry.push(
                    path.join(process.cwd(), './' + item + '/**/*.js')
                )
            }else{
                debug(`找不到这个目录: ${item}`);
            }

        });
    });

    fs.exists('.eslintrc.js', function (exists) {
        if(exists){
            let content = loadJSConfigFile(path.join(process.cwd(), '.eslintrc.js'));

            if(content.hasOwnProperty('extends')){
                if(Array.isArray(content.extends)){
                    content.extends.push(path.resolve(__dirname, eslintPath));
                }else if (typeof content.extends === 'string') {
                    content.extends = [content.extends];
                    content.extends.push(path.resolve(__dirname, eslintPath));
                }
            }else{
                content.extends = [];
                content.extends.push(path.resolve(__dirname, eslintPath));
            }
            console.log(content);
            eslintCfg = content;
        }

    });

    gulp.src(pathAry)
        .pipe(eslint(eslintCfg))
        .pipe(eslint.format('table'))
        .pipe(eslint.failAfterError());
}

module.exports = {
    plugin: function (options) {
        commands = options.cmd;
        pluginname = options.name;
        if (options.argv.h || options.argv.help) {
            getHelp();
        }
        if (options.argv.v || options.argv.version) {
            getVersion();
        }
        if (options.argv.t || options.argv.type) {
            lint(options.argv.t, options.argv._.slice(1));
        }

        console.log(options.argv);


    }
}
