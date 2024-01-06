# dir-minify
Minifies all HTML, CSS, and JavaScript files in a directory.

This was originally [anon-files/dir-minify](https://github.com/anon-files/dir-minify), but the original is not maintained anymore.

I think that it's a perfect project so I have choosed to continue with it.

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
