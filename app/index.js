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
		this.options = {};
	}

	prompting() {
		return this._askForDefaults();
	}

	_askForDefaults() {
		const questions = [
			{
				type: 'input',
				name: 'name',
				message: 'Enter your site-name',
				default: this.appname,
				validate: function (input) {
					return input.length > 0;
				}
			},
			{
				type: 'input',
				name: 'author',
				message: 'Author',
				default: `${this.user.git.name()} <${this.user.git.email()}>`,
				filter: function (input) {
					return input.replace(/"/g, '\\"');
				}
			},
			{
				type: 'checkbox',
				name: 'dependencies',
				message: 'Install dependencies',
				choices: [
					{
						name: 'Bootstrap 3',
						value: 'bootstrap'
					},
					{
						name: 'jQuery 3.2.1',
						value: 'jquery'
					}
				]
			},
			{
				type: 'confirm',
				name: 'skipInstall',
				message: 'Skip bower & npm install?',
				default: false
			},
			{
				type: 'confirm',
				name: 'skipGit',
				message: 'Skip git initialization?',
				default: false
			}
		];

		return this.prompt(questions).then((answers) => {
			this.options.name = answers.name;
			this.options.author = answers.author;
			this.options.dependencies = answers.dependencies;
			this.options.skipInstall = answers.skipInstall;
			this.options.skipGit = answers.skipGit;
		});
	}

	configuring() {
		this.log(chalk.green('\n ============================= COPY FILES =================================\n'));

		this._writingPackageJson();
		this._writingBowerJson();
		this._writingIndexHtml();

		this._copyStaticFiles();
	}

	_writingPackageJson() {
		this.fs.copyTpl(
			this.templatePath('package.json'),
			this.destinationPath('package.json'),
			{
				name: this.options.name,
				author: this.options.author
			}
		);
	}

	_writingBowerJson(){
		this.fs.copyTpl(
			this.templatePath('bower.json'),
			this.destinationPath('bower.json'),
			{
				name: this.options.name,
				author: this.options.author,
				dependencies: this.options.dependencies
			}
		);
	}

	_writingIndexHtml(){
		this.fs.copyTpl(
			this.templatePath('src/index.html'),
			this.destinationPath('src/index.html'),
			{
				title: this.options.name
			}
		)
	}

	_copyStaticFiles(){
		this.fs.copy(
			this.templatePath('src/img'),
			this.destinationPath('src/img'),
			{
				globOptions: {
					dot: true
				}
			}
		);

		this.fs.copy(
			this.templatePath('src/js'),
			this.destinationPath('src/js'),
			{
				globOptions: {
					dot: true
				}
			}
		);

		this.fs.copy(
			this.templatePath('src/less'),
			this.destinationPath('src/less'),
			{
				globOptions: {
					dot: true
				}
			}
		);

		this.fs.copy(
			this.templatePath('.editorconfig'),
			this.destinationPath('.editorconfig')
		);

		this.fs.copy(
			this.templatePath('.gitignore'),
			this.destinationPath('.gitignore')
		);

		this.fs.copy(
			this.templatePath('gulpfile.js'),
			this.destinationPath('gulpfile.js')
		);

		this.fs.copy(
			this.templatePath('.bowerrc'),
			this.destinationPath('.bowerrc')
		);
	}

	default() {

	}

	conflicts() {

	}

	install() {
		if(!this.options.skipInstall){
			this.log(chalk.green('\n ========================== INSTALL DEPENDENCIES ==========================\n'));

			this.npmInstall();
			this.bowerInstall();
		}
	}

	end() {
		if(!this.options.skipGit) {
			this.spawnCommand('git init');
		}

		this.log(
			chalk.green(
				' ==========================================================================\n' +
				'                                 SUCCESS\n' +
				'                              run "npm serve"\n' +
				' ==========================================================================\n'
			)
		);
	}
};