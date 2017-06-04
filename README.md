# Website generator for Yeoman

[![NPM version](https://badge.fury.io/js/generator-schwarzdavid-website.svg)](https://www.npmjs.com/package/generator-schwarzdavid-website)

> Generates a scaffold for a modern html 5 website with a working build system using gulp

![](screenshot.png)

## Install

In order to use this generator properly, you need to have `NodeJS`, `Npm` and `Git` installed aswell as `bower`, `yo` 
and `gulp-cli`. Make sure you have all those dependencies installed by running `npm i -g yo gulp-cli bower`. If you 
already have those installed, you wont install them twice when you run this command.

When you have all dependencies installed, you can run `npm i -g generator-schwarzdavid-website` to install the package.

Now go to your empty project directory and run `yo schwarzdavid-website`. The boilerplate will be created in the 
directory you are currently in. A git project will be initialized and all dependency installed.

All you have to do is to run `gulp serve` to build your website and start working.

Enjoy!

## Features

* Automatic less to css compilation
* Minify all css and js files
* Autodetect bower dependencies and inject them into html
* Separate tasks for developing and production
* Automatic optimization of all _.jpg_ and _.png_ files

## Commands

* `gulp serve` Runs `gulp build:dev` and add a watcher to all relevant files. Whenever one of 
those files change, the build will be updated.
* `gulp build:dev` Builds your website to the _.tmp_-directory but keeps all of your files unminified
* `gulp build:dev:less` Creates css-files from your less-files
* `gulp build:dev:js` Builds only javascript-files
* `gulp build:dev:html` Builds _index.html_. Basically it only injects newly added files to the html-file.
* `gulp build:dev:img` Injects all js-files into _.tmp_-folder
* `gulp build:dev:vendor` Injects all js-files from bower dependencies into _.tmp_-folder
* `gulp build` Builds your website to the _dist_-directory, ready for production
* `gulp build:less` Compiles your less-files to css, concats them and outputs a minified _main.min.css_ file
* `gulp build:js` Concats and minifies all js-files and outputs _main.min.js_
* `gulp build:html` Injects all files into _index.html_, minifies the code and remove comments
* `gulp build:img` Basically the same as `gulp build:dev:img` does
* `gulp build:vendor` Concats and minifies all bower dependencies into _vendor.min.js_

## Todos

* [ ] Add JSLint to `gulp build:dev:js`
* [ ] Start Webserver at `gulp serve`
* [ ] Handle all html-files - not only _index.html_