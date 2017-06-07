//************************************************
// LOAD DEPENDENCIES
//************************************************
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

//************************************************
// LOAD GULP PLUGINS
//************************************************
const gulp = require('gulp');
const gulp_babel = require('gulp-bable');
const gulp_clean_css = require('gulp-clean-css');
const gulp_concat = require('gulp-concat');
const gulp_copy = require('gulp-copy');
const gulp_htmlmin = require('gulp-htmlmin');
const gulp_if = require('gulp-if');
const gulp_inject = require('gulp-inject');
const gulp_imagemin = require('gulp-imagemin');
const gulp_less = require('gulp-less');
const gulp_main_bower_files = require('main-bower-files');
const gulp_options = require('gulp-options');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_uglify = require('gulp-uglify');

//************************************************
// CONSTANTS
//************************************************

// base folders
const SOURCE_FOLDER = 'src';
const PROD_FOLDER = 'dist';
const DEV_FOLDER = '.tmp';

// source files
const LESS_FILES = `${SOURCE_FOLDER}/less/**/*.less`;
const JS_FILES = `${SOURCE_FOLDER}/js/**/*.js`;
const IMG_FILES = `${SOURCE_FOLDER}/img/**/*.{jpeg,jpg,png}`;
const HTML_FILES = `${SOURCE_FOLDER}/**/*.html`;
const VENDOR_FILES = '**/*.js';
const OTHER_FILES = [`${SOURCE_FOLDER}/**/*`, `!*.{html, jpeg, jpg, png, js, less}`];

// dest folders for production
const DEST_PROD_IMG = `${PROD_FOLDER}/img`;
const DEST_PROD_JS = `${PROD_FOLDER}/js`;
const DEST_PROD_VENDOR = `${PROD_FOLDER}/js`;
const DEST_PROD_CSS = `${PROD_FOLDER}/css`;
const DEST_PROD_HTML = `${PROD_FOLDER}`;

// dest folders for development
const DEST_DEV_IMG = `${DEV_FOLDER}/img`;
const DEST_DEV_JS = `${DEV_FOLDER}/js`;
const DEST_DEV_VENDOR = `${DEV_FOLDER}/vendor`;
const DEST_DEV_CSS = `${DEV_FOLDER}/css`;
const DEST_DEV_HTML = `${DEV_FOLDER}`;

// dest filenames for production
const DEST_JS_MIN_NAME = 'main.min.js';
const DEST_VENDOR_MIN_NAME = 'vendor.min.js';
const DEST_CSS_MIN_NAME = 'main.min.css';

//************************************************
// VARIABLES
//************************************************
// default options with all paths specified
let options = {
	src: {
		less: LESS_FILES,
		js: JS_FILES,
		img: IMG_FILES,
		html: HTML_FILES,
		other: OTHER_FILES,
		vendor: VENDOR_FILES,
		base: SOURCE_FOLDER
	},
	dest: {
		css: DEST_PROD_CSS,
		js: DEST_PROD_JS,
		img: DEST_PROD_IMG,
		html: DEST_PROD_HTML,
		base: PROD_FOLDER,
		vendor: DEST_PROD_VENDOR
	},
	files: {
		jsMin: DEST_JS_MIN_NAME,
		vendorMin: DEST_VENDOR_MIN_NAME,
		cssMin: DEST_CSS_MIN_NAME,
		bowerJson: 'bower.json'
	}
};

// option overrides for devMode
let devOptionOverrides = {
	dest: {
		css: DEST_DEV_CSS,
		js: DEST_DEV_JS,
		img: DEST_DEV_IMG,
		html: DEST_DEV_HTML,
		base: DEV_FOLDER,
		vendor: DEST_DEV_VENDOR
	}
};

// True if devMode is enabled
let devMode = false;

//************************************************
// INIZIALIZATION
//************************************************
function init() {
	// Determinate if dev mode is enabled
	devMode = gulp_options.has('dev');

	// Update default settings if devMode is enabled
	if (devMode) {
		_.merge(options, devOptionOverrides);
	}

	// Show welcome banner
	console.log(
		chalk.green(
			'\n=================================================\n' +
			'             SCHWARZDAVID BUILD TOOL\n' +
			'=================================================\n'
		)
	);
}
init();

//************************************************
// TASK HANDLER FOR IMAGES
//************************************************
function buildImg() {
	return gulp.src(options.src.img)
		.pipe(gulp_if(!devMode, gulp_imagemin()))
		.pipe(gulp.dest(options.dest.img));
}

//************************************************
// TASK HANDLER FOR HTML
//************************************************
function buildHtml() {
	const gulpInjectDefaultOptions = {
		relative: true,
		ignorePath: `../${options.dest.base}/`
	};

	const gulpInjectVendorOptions = _.merge({}, gulpInjectDefaultOptions, {
		starttag: '<!-- inject:vendor -->'
	});

	const htmlMinOptions = {
		collapseWhitespace: true,
		removeComments: true
	};

	return gulp.src(options.src.html)
		.pipe(gulp_inject(
			gulp.src([
				`${options.dest.js}/**/*.js`,
				`${options.dest.css}/**/*.css`
			], {read: false}),
			gulpInjectDefaultOptions
		))

		// Only if develop mode
		.pipe(gulp_if(devMode, gulp_inject(gulp.src(gulp_main_bower_files(options.src.vendor), {read: false}), gulpInjectVendorOptions)))

		// Only for production
		.pipe(gulp_if(!devMode, gulp_htmlmin(htmlMinOptions)))

		.pipe(gulp.dest(options.dest.base));
}

//************************************************
// TASK HANDLER FOR JS
//************************************************
function buildJs() {
	return gulp
		.src(options.src.js)
		.pipe(gulp_babel())

		// For production only
		.pipe(gulp_if(!devMode, gulp_sourcemaps.init()))
		.pipe(gulp_if(!devMode, gulp_uglify()))
		.pipe(gulp_if(!devMode, gulp_concat(options.files.jsMin)))
		.pipe(gulp_if(!devMode, gulp_sourcemaps.write()))

		.pipe(gulp.dest(options.dest.js));
}

//************************************************
// TASK HANDLER FOR VENDOR
//************************************************
function buildVendor() {
	return gulp
		.src(gulp_main_bower_files(options.src.vendor))

		// For production only
		.pipe(gulp_if(!devMode, gulp_concat(options.files.vendorMin)))
		.pipe(gulp_if(!devMode, gulp_uglify()))

		.pipe(gulp.dest(options.dest.vendor));
}

//************************************************
// TASK HANDLER FOR LESS/CSS
//************************************************
function buildLess() {
	return gulp
		.src(options.src.less)
		.pipe(gulp_less())

		// For production only
		.pipe(gulp_if(!devMode, gulp_sourcemaps.init()))
		.pipe(gulp_if(!devMode, gulp_concat(options.files.cssMin)))
		.pipe(gulp_if(!devMode, gulp_clean_css()))
		.pipe(gulp_if(!devMode, gulp_sourcemaps.write()))

		.pipe(gulp.dest(options.dest.css));
}

//************************************************
// WATCHER
//************************************************
function watcherChangeEvent(event) {
	console.log(`File ${event.path} was ${ event.type }, running tasks...`);
}

function serve() {
	let watcher_js;
	watcher_js = gulp.watch(options.src.js, ['build:js']);
	watcher_js.on('change', watcherChangeEvent);

	let watcher_less;
	watcher_less = gulp.watch(options.src.less, ['build:less']);
	watcher_less.on('change', watcherChangeEvent);

	let watcher_html;
	watcher_html = gulp.watch(options.src.html, ['build:html']);
	watcher_html.on('change', watcherChangeEvent);

	let watcher_vendor;
	watcher_vendor = gulp.watch(options.files.bowerJson, ['build:vendor']);
	watcher_vendor.on('change', watcherChangeEvent);

	let watcher_img;
	watcher_img = gulp.watch(IMG_FILES, ['build:img']);
	watcher_img.on('change', watcherChangeEvent);
}

//************************************************
// DEFINE GULP TASKS
//************************************************
gulp.task('build', ['build:js', 'build:vendor', 'build:less', 'build:img'], buildHtml);
gulp.task('build:js', buildJs);
gulp.task('build:less', buildLess);
gulp.task('build:html', buildHtml);
gulp.task('build:vendor', buildVendor);
gulp.task('build:img', buildImg);

gulp.task('serve', ['build'], serve);
gulp.task('default', ['serve']);