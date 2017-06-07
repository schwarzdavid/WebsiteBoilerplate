const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('schwarzdavid-website', () => {
	before( () => {
		return helpers.run(path.join(__dirname, '../app')).withPrompts({
			name: 'generator-test',
			author: 'test <test@example.com>',
			dependencies: ['bootstrap','jquery'],
			skipInstall: true,
			skipGit: true
		});
	});

	it('create files', () => {
		const expectedFiles = [
			'.gitignore',
			'.bowerrc',
			'.editorconfig',
			'package.json',
			'gulpfile.js',
			'bower.json',
			'src/index.html',
			'src/img/.gitkeep',
			'src/js/main.js',
			'src/less/main.less'
		];

		assert.file(expectedFiles);
	});

	it('fills bower.json with correct information', () => {
		assert.JSONFileContent('bower.json', {
			name: 'generator-test',
			authors: ['test <test@example.com>'],
			dependencies: {
				bootstrap: '~3.3.7'
			}
		});
	});
});