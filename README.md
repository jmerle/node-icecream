# node-icecream

[![NPM version](https://img.shields.io/npm/v/node-icecream.svg)](https://www.npmjs.com/package/node-icecream)
[![NPM downloads](https://img.shields.io/npm/dm/node-icecream.svg)](https://www.npmjs.com/package/node-icecream)
[![Build status](https://travis-ci.org/jmerle/node-icecream.svg)](https://travis-ci.org/jmerle/node-icecream)
[![Codecov](https://codecov.io/github/jmerle/node-icecream/coverage.svg?branch=master)](https://codecov.io/github/jmerle/node-icecream?branch=master)
[![License](https://img.shields.io/github/license/jmerle/node-icecream.svg)](https://github.com/jmerle/node-icecream/blob/master/LICENSE)

node-icecream is a Node.js port of the [icecream](https://github.com/gruns/icecream) library for Python.

## Installation

Installing node-icecream is easy:

```
$ yarn add node-icecream
```

Or with npm:

```
$ npm install node-icecream
```

## Usage

Take the following code as an example:

```js
function foo() {
    return 'bar';
}

console.log(`foo(): ${foo()}`);
// > foo(): bar
```

With node-icecream, the above would become:

```js
const ic = require('node-icecream')();

function foo() {
    return 'bar';
}

ic(foo());
// > 🍦 foo(): 'bar'
```

### With arguments

node-icecream will return the argument(s) it is given, so you can easily plug it into existing code.

```js
const ic = require('node-icecream')();

function foo() {
    return 'bar';
}

const result = ic(foo());
// > 🍦 foo(): 'bar'
// result === 'bar'

const results = ic(foo(), foo(), foo());
// > 🍦 foo(): 'bar', foo(): 'bar', foo(): 'bar'
// results === ['bar', 'bar', 'bar']
```

### Without arguments

When not given any arguments, node-icecream will print the filename and the line number where it was called from. The filename shown is relative from the project's root path.

```js
const ic = require('node-icecream')();

function foo() {
    ic();

    // For example purposes only
    if (true) {
        ic();
        return 'bar';
    }

    ic();
    return 'something is wrong';
}

ic(foo());
// > 🍦 index.js:4
// > 🍦 index.js:8
// > 🍦 foo(): 'bar'
```

### With existing logger

node-icecream can easily be used together with an existing logger. The following is an example on how to use node-icecream with the [debug](https://www.npmjs.com/package/debug) package.

```js
const debug = require('debug')('example');
const ic = require('node-icecream')({
    prefix: '',
    outputFunction: debug,
});

function foo() {
    ic();
    return 'bar';
}

ic(foo());
// > example index.js:8 +0ms
// > example foo(): 'bar' +11ms
```

## Options

node-icecream can easily be configured to use a different prefix or print to somewhere else. Configuration is applied when requiring node-icecream:

```js
const ic = require('node-icecream')({ prefix: 'prefix: ' });
```

### Available options

- **prefix** `(default: '🍦 ' on all systems except for Windows, where it is '[ic] ')` is the prefix to use. This can be both a string or a function. If it is a function, it is called every time just before printing. This option can be useful when you need timestamps to be printed.
- **outputFunction** `(default: console.log)` is the function that is called to print the output. By default, it simply uses `console.log()`, but the option makes it easy to log to existing loggers aswell.

## Contributing

Bug reports, feature requests and pull requests are all welcome! Continue reading for some help on getting up and running, or head over to the [issues](https://github.com/jmerle/node-icecream/issues) page to report a bug or request a new feature.

### Getting up and running locally

The following needs to be done to start working on the project:

```bash
# Clone the repository
$ git clone https://github.com/jmerle/node-icecream.git

# cd into the cloned repository
$ cd node-icecream

# Install the necessary dependencies
$ yarn

# Do your thing

# Lint the code for style issues
$ yarn lint

# Run tests
$ yarn test
```

### Pull requests

When starting to work on a new feature, please make sure to work off of the `develop` branch. This branch contains the latest code, so the `master` branch is a direct representation of what you get when installing through npm. Similarly, also send pull requests to the `develop` branch.

## TypeScript

node-icecream comes with TypeScript definitions. The default import syntax can be used, which imports a wrapper around the `ic` function to make configuration possible.

```ts
import ice from 'node-icecream';

const ic = ice({ prefix: '[prefix] ' });

function foo(): string {
    return 'bar';
}

ic(foo());
// > [prefix] foo(): 'bar'
```

## Limitations

- Doesn't work in the REPL.

## License

MIT
