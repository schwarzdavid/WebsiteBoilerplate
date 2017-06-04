// TODO: update constants. No strings should be used in functions

const gulp = require('gulp');
const gulp_less = require('gulp-less');
const gulp_uglify = require('gulp-uglify');
const gulp_concat = require('gulp-concat');
const gulp_clean_css = require('gulp-clean-css');
const gulp_htmlmin = require('gulp-htmlmin');
const gulp_inject = require('gulp-inject');
const gulp_main_bower_files = require('main-bower-files');

//************************************************
// CONSTANTS
//************************************************
const LESS_FILES = 'src/less/**/*.less';
const JS_FILES = 'src/js/**/*.js';
const IMG_FILES = 'src/img/**/*.{jpeg,jpg,png}';
const HTML_FILES = 'src/**/*.html';

const DEST_PROD = 'dist';
const DEST_DEV = '.tmp';

//************************************************
// TASK HANDLER FOR HTML
//************************************************
function devBuildHtml() {
	return gulp
		.src(HTML_FILES)
		.pipe(gulp_inject(gulp.src([
			`${DEST_DEV}/vendor/**/*.js`
		], {read: false}), {
			relative: true,
			ignorePath: `../${DEST_DEV}/`,
			starttag: '<!-- inject:vendor -->'
		}))
		.pipe(gulp_inject(gulp.src([
			`${DEST_DEV}/js/**/*.js`,
			`${DEST_DEV}/css/**/*.css`
		], {read: false}), {
			relative: true,
			ignorePath: `../${DEST_DEV}/`
		}))
		.pipe(gulp.dest(DEST_DEV));
}

function prodBuildHtml() {
	return gulp
		.src(HTML_FILES)
		.pipe(gulp_inject(gulp.src([
			`${DEST_PROD}/js/**/*.js`,
			`${DEST_PROD}/css/**/*.css`
		], {read: false}), {
			relative: true,
			ignorePath: `../${DEST_PROD}/`
		}))
		.pipe(gulp_htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(DEST_PROD));
}

//************************************************
// TASK HANDLER FOR JS
//************************************************
function commonBuildJs() {
	return gulp.src(JS_FILES);
}

function devBuildJs() {
	let stream = commonBuildJs();

	return stream
		.pipe(gulp.dest(`${DEST_DEV}/js`));
}

function prodBuildJs() {
	let stream = commonBuildJs();

	return stream
		.pipe(gulp_concat('main.min.js'))
		.pipe(gulp_uglify())
		.pipe(gulp.dest(`${DEST_PROD}/js`));
}

//************************************************
// TASK HANDLER FOR VENDOR
//************************************************
function commonBuildVendor() {
	return gulp.src(gulp_main_bower_files('**/*.js'));
}

function devBuildVendor() {
	let stream = commonBuildVendor();

	return stream
		.pipe(gulp.dest(`${DEST_DEV}/vendor`));
}

function prodBuildVendor() {
	let stream = commonBuildVendor();

	return stream
		.pipe(gulp_concat('vendor.min.js'))
		.pipe(gulp_uglify())
		.pipe(gulp.dest(`${DEST_PROD}/vendor`));
}

//************************************************
// TASK HANDLER FOR LESS/CSS
//************************************************
function commonBuildLess() {
	return gulp
		.src(LESS_FILES)
		.pipe(gulp_less());
}

function devBuildLess() {
	let stream = commonBuildLess();

	return stream
		.pipe(gulp.dest(`${DEST_DEV}/css`));
}

function prodBuildLess() {
	let stream = commonBuildLess();

	return stream
		.pipe(gulp_concat('main.min.css'))
		.pipe(gulp_clean_css({sourceMap: true}))
		.pipe(gulp.dest(`${DEST_PROD}/css`));
}

//************************************************
// WATCHER
//************************************************
function watcherChangeEvent(event) {
	console.log(`File ${event.path} was ${ event.type }, running tasks...`);
}

function serve() {
	let watcher_js;
	watcher_js = gulp.watch(JS_FILES, ['build:dev:js']);
	watcher_js.on('change', watcherChangeEvent);

	let watcher_less;
	watcher_less = gulp.watch(LESS_FILES, ['build:dev:less']);
	watcher_less.on('change', watcherChangeEvent);
}

//************************************************
// DEFINE GULP TASKS
//************************************************
gulp.task('build', ['build:js', 'build:vendor', 'build:less'], prodBuildHtml);
gulp.task('build:js', prodBuildJs);
gulp.task('build:less', prodBuildLess);
gulp.task('build:html', prodBuildHtml);
gulp.task('build:vendor', prodBuildVendor);

gulp.task('build:dev', ['build:dev:js', 'build:dev:vendor', 'build:dev:less'], devBuildHtml);
gulp.task('build:dev:js', devBuildJs);
gulp.task('build:dev:less', devBuildLess);
gulp.task('build:dev:vendor', devBuildVendor);
gulp.task('build:dev:html', devBuildHtml);

gulp.task('serve', ['build:dev'], serve);
gulp.task('default', ['serve']);