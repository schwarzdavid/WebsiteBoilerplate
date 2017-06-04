const Generator = require('yeoman-generator');
const chalk = require('chalk');
const figlet = require('figlet');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.log(
			chalk.green.bold(
				figlet.textSync('schwarzdavid', {
					horizontalLayout: 'fitted'
				})
			)
		);

		this.log(
			chalk.green(
				' ==========================================================================\n' +
				'                           WEBSITE BOILERPLATE\n' +
				' ==========================================================================\n'
			)
		);
	}

	initializing() {
		this.paths = {};
	}

	prompting() {
		let that = this;

		let buildDirs = [
			{
				type: 'input',
				name: 'srcFolder',
				message: 'Enter your source directory',
				default: 'src'
			},
			{
				type: 'input',
				name: 'tmpFolder',
				message: 'Enter your temp directory',
				default: '.tmp'
			},
			{
				type: 'input',
				name: 'distFolder',
				message: 'Enter your dist directory',
				default: 'dist'
			}
		];

		let assetDirs = [
			{
				type: 'input',
				name: 'imgFolder',
				message: 'Enter your image directory',
				default: 'img'
			},
			{
				type: 'input',
				name: 'jsFolder',
				message: 'Enter your javascript directory',
				default: 'js'
			},
			{
				type: 'input',
				name: 'lessFolder',
				message: 'Enter your less directory',
				default: 'less'
			},
			{
				type: 'input',
				name: 'cssFolder',
				message: 'Enter your css directory',
				default: 'css'
			},
			{
				type: 'input',
				name: 'vendorFolder',
				message: 'Enter your vendor directory',
				default: 'vendor'
			}
		];

		return that.prompt(buildDirs)
			.then(function (answers) {
				that.log(chalk.green('\n==========================================================================\n'));

				that.paths.src = answers.srcFolder;
				that.paths.tmp = answers.tmpFolder;
				that.paths.dist = answers.distFolder;

				return that.prompt(assetDirs);
			})
			.then(function (answers) {
				that.paths.js = answers.jsFolder;
				that.paths.less = answers.lessFolder;
				that.paths.vendor = answers.vendorFolder;
				that.paths.img = answers.imgFolder;
			});
	}

	configuring(){

	}

	default(){

	}

	conflicts(){

	}

	install(){

	}

	end(){

	}
};