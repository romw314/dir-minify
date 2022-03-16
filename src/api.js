const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const FormData = require('form-data');
const dirTree = require('directory-tree');

const endpoint = 'https://minifier.org/minify.php';
const endpointHTML = 'https://www.toptal.com/developers/html-minifier/raw';

var inputDir = '';
var outputDir = '';

function writeFile(filePath, content) {
    let directoryName = path.dirname(filePath);
    mkdirp.sync(directoryName);

    fs.writeFile(filePath, content, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

async function minifyData(data, type) {
    let formData;
    if (type === 'html') {
        formData = new FormData();
        formData.append('input', data);
        const response = await fetch(endpointHTML, {
            method: 'POST',
            body: formData
        })
        return await response.text();
    }
    formData = new FormData();
    formData.append('source', data);
    formData.append('type', type);
    const response = await fetch(endpoint, {
        method: 'POST', 
        body: formData
    });
    let responseData = await response.json();
    return responseData['minified'];
}

function copyFile(input, output) {
    let directoryName = path.dirname(output);
    mkdirp.sync(directoryName, function(err) {
        if (err) {
            console.log(err);
        }
    });

    fs.readFile(input, output, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function minifySource(input, output, type) {
    defineIO(input, output);
    if (output === '') {
        output = input.replace(inputDir, outputDir);
    }
    fs.readFile(input, 'utf8', async function(err, contents) {
        const minifedContent = await minifyData(contents, type);
        writeFile(output, minifedContent);
    });
}

function minifyFile(input, output = '') {
    if (!fs.existsSync(input)) {
        console.log('Error: Cannot minify a file that does not exist');
        return;
    }
    let extension = path.extname(input);
    defineIO(input, output);
    if (output === '') {
        output = input.replace(inputDir, outputDir);
    }
    switch (extension) {
        case '.html':
            minifySource(input, output, 'html');
            break;
        case '.css':
            minifySource(input, output, 'css');
            break;
        case '.js':
            minifySource(input, output, 'js');
            break;
        default:
            copyFile(input, output);
    }
}

function minifyDir(input, output = '') {
    if (!fs.existsSync(input)) {
        console.log('Error: Cannot minify a directory that does not exist');
        return;
    }
    defineIO(input, output);
    if (!fs.existsSync(outputDir)) {
        mkdirp.sync(outputDir);
    }
    const tree = dirTree(input, { normalizePath: true });
    inputDir = inputDir.replace('./', '');
    outputDir = outputDir.replace('./', '');
    minifyDirRecursive(tree.children);
}

function minifyDirRecursive(directory) {
    for (let i = 0; i < directory.length; i++) {
        let path = directory[i];
        if (path.children != null && path.children.length != 0) {
            minifyDirRecursive(path.children);
        }
        if (path.type === 'file') {
            minifyFile(path.path);
        }
    }
}

function minify(input, output = '') {
    if (fs.lstatsync(input).isFile()) {
        minifyFile(input, output);
    } else {
        minifyDir(input, output);
    }
}

function defineIO(input, output) {
    if (input !== '' || output !== '') {
        return;
    }

    input = input.replace(/\\/g, '/');
    output = output.replace(/\\/g, '/');
    let inputLastChar = input.charAt(input.length - 1);
    let outputLastChar = output.charAt(output.length - 1);
    if (inputLastChar === '/' || inputLastChar === '\\') {
        input = input.slice(0, -1);
    }
    if (outputLastChar === '/' || inputLastChar === '\\') {
        output = output.slice(0, -1);
    }

    if (fs.lstatsync(input).isFile()) {
        inputDir = path.dirname(input);
    } else {
        inputDir = input;
    }
    if (output === '') {
        outputDir = inputDir + '-minified';
    } else {
        outputDir = output;
    }
}

module.exports.minifySource = minifySource;
module.exports.minifyFile = minifyFile;
module.exports.minifyDir = minifyDir;
module.exports.minify = minify;
