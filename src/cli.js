#!/usr/bin/env node
const MinifyAPI = require('./api');
const fs = require('fs');
const kleur = require('kleur');
const os = require('os');

const usage = `\
Usage: minify INPUT_FOLDER OUTPUT_FOLDER

Required arguments:
- INPUT_FOLDER: the directory you want minified

Optional arguments:
- OUTPUT_FOLDER: the output directory for your minified files
`;

const minifyCommand = (input, output) => {
	input = input || '';
	if (!input || input === '') {
		console.log(usage);
	} else if (!fs.existsSync(input)) {
		console.error(
			kleur.red('Cannot minify a file/directory that does not exist') + os.EOL
		);
	} else {
		MinifyAPI.minify(input, output);
	}
};

if (process.argv.length === 4) {
	minifyCommand(...process.argv.slice(2));
} else {
	console.log(kleur.red(usage));
}
