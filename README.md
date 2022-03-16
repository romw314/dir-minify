# dir-minify
Minifies all HTML, CSS, and JavaScript files in a directory.

## Installation
```
npm install -g dir-minify
```

## Usage
### CLI
```
minify [INPUT_FOLDER] [OUTPUT_FOLDER]
```

### Code
```js
const dirMinify = require('dir-minify');

// Minify an entire directory
dirMinify.minifyDir('./public', './build');

// Minify a single file
dirMinify.minifyFile('./public/index.html', './build/index.html');
```
