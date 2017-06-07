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

	it('fills bower.json with correct dependencies', () => {
		assert.JSONFileContent('bower.json', {
			dependencies: {
				bootstrap: '~3.3.7'
			}
		});
	});

	it('injects valid name and author into bower.json', () => {
		assert.JSONFileContent('bower.json', {
			name: 'generator-test',
			authors: ['test <test@example.com>']
		});
	});

	it('injects valid name and author into package.json', () => {
		assert.JSONFileContent('package.json', {
			name: 'generator-test',
			author: 'test <test@example.com>'
		});
	});
});