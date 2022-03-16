const MinifyAPI = require('./api');
const fs = require('fs');

const usage = `
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
        console.log('Cannot minify a file/directory that does not exist');
    } else {
        MinifyAPI.minify(input, output);
    }
}
