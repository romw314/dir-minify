const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const dirTree = require('directory-tree');
const htmlMin = require('html-minifier');
const cssMin = require('csso');
const jsMin = require('terser');

const _fn = () => {};
const noDebug = {
	log: _fn,
	error: _fn,
	warn: _fn,
	info: _fn,
	time: _fn,
	timeEnd: _fn
};

let inputDir = '';
let outputDir = '';
let _udbg = noDebug;

function writeFile(filePath, content) {
	const directoryName = path.dirname(filePath);
	mkdirp.sync(directoryName);

	fs.writeFileSync(filePath, content);
	_udbg.log('WRITE', arguments);
}

function minifyData(data, type) {
	if (type === 'html') {
		return Promise.resolve(htmlMin.minify(data));
	} else if (type === 'css') {
		return Promise.resolve(cssMin.minify(data).css);
	} else if (type === 'js') {
		return jsMin.minify(data).then(res => res.code);
	} else {
		throw new Error('Invalid type.');
	}
}

function copyFile(input, output) {
	const directoryName = path.dirname(output);
	mkdirp.sync(directoryName);

	fs.writeFileSync(output, fs.readFileSync(input));
	_udbg.log('COPY', arguments);
}

async function minifySource(input, output, type) {
	if (output === '') {
		output = input.replace(inputDir, outputDir);
	}
	const contents = fs.readFileSync(input, 'utf8');
	const minifedContent = await minifyData(contents, type);
	writeFile(output, minifedContent);
}

async function minifyFile(input, output = '') {
	if (!fs.existsSync(input)) {
		_udbg.log('Error: Cannot minify a file that does not exist');
		return;
	}
	const extension = path.extname(input);
	if (output === '') {
		output = input.replace(inputDir, outputDir);
	}
	switch (extension) {
		case '.html':
			await minifySource(input, output, 'html');
			break;
		case '.css':
			await minifySource(input, output, 'css');
			break;
		case '.js':
			await minifySource(input, output, 'js');
			break;
		default:
			copyFile(input, output);
	}
}

function minifyDir(input, output = '') {
	if (!fs.existsSync(input)) {
		_udbg.log('Error: Cannot minify a directory that does not exist');
		return;
	}
	if (!fs.existsSync(outputDir)) {
		mkdirp.sync(outputDir);
	}
	const tree = dirTree(input, { normalizePath: true });
	_udbg.log('tree of', input, 'is', tree);
	inputDir = input.replace('./', '');
	outputDir = output.replace('./', '');
	return minifyDirRecursive(tree.children);
}

async function minifyDirRecursive(directory) {
	_udbg.log('MDR:', directory);
	for (let i = 0; i < directory.length; i++) {
		const path = directory[i];
		if (path.children && path.children.length !== 0) {
			minifyDirRecursive(path.children);
		}
		if (!path.children) {
			_udbg.log('MDR:MF:', path);
			await minifyFile(path.path);
		}
	}
}

function minify(input, output = '', debug = noDebug) {
	inputDir = input;
	outputDir = output;
	if (fs.lstatSync(input).isFile()) {
		return minifyFile(input, output);
	} else {
		return minifyDir(input, output);
	}
}

module.exports.noDebug = noDebug;
module.exports.minifySource = minifySource;
module.exports.minifyFile = minifyFile;
module.exports.minifyDir = minifyDir;
module.exports.minify = minify;
