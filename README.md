# Downbyte
Minifies all HTML, CSS, and JavaScript files in a directory.

This was originally [anon-files/dir-minify](https://github.com/anon-files/dir-minify), but the original is not maintained anymore.

I think that it's a perfect project so I have choosed to continue with it.

## Contributing
We accept only PNPM lockfiles in PR's.

Run `pnpm format` before making any commit.

Before publishing, run `pnpm last-check`.

## Installation
```
pnpm install --global downbyte
```
or
```
pnpm install --save-dev downbyte
```
(you can do the same with NPM or Yarn)

## Usage
### CLI
```
minify [INPUT_FOLDER] [OUTPUT_FOLDER]
```

### Code
```js
const dirMinify = require('downbyte');

// Minify an entire directory
dirMinify.minifyDir('./public', './build');

// Minify a single file (not tested)
dirMinify.minifyFile('./public/index.html', './build/index.html');
```
