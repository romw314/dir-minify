# Getting started

<Callout type='warning'>
	Downbyte is not very tested. If it does not work for you, please open an issue on GitHub.
</Callout>

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

