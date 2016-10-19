# homedir-polyfill [![NPM version](https://img.shields.io/npm/v/homedir-polyfill.svg?style=flat)](https://www.npmjs.com/package/homedir-polyfill) [![NPM downloads](https://img.shields.io/npm/dm/homedir-polyfill.svg?style=flat)](https://npmjs.org/package/homedir-polyfill) [![Linux Build Status](https://img.shields.io/travis/doowb/homedir-polyfill.svg?style=flat&label=Travis)](https://travis-ci.org/doowb/homedir-polyfill) [![Windows Build Status](https://img.shields.io/appveyor/ci/doowb/homedir-polyfill.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/doowb/homedir-polyfill)

> Node.js os.homedir polyfill for node versions 0.10 and before.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save homedir-polyfill
```

## Usage

```js
var homedir = require('homedir-polyfill');
console.log(homedir());
//=> /Users/doowb
```

## Reasoning

This library is a polyfill for the [node.js os.homedir](https://nodejs.org/api/os.html#os_os_homedir) method found in modern versions of node.js.

This implementation tries to follow the implementation found in `libuv` by finding the current user using the `process.geteuid()` method and the `/etc/passwd` file. This should usually work in a linux environment, but will also fallback to looking at user specific environment variables to build the user's home directory if neccessary.

Since `/etc/passwd` is not available on windows platforms, this implementation will use environment variables to find the home directory.

In modern versions of node.js, [os.homedir](https://nodejs.org/api/os.html#os_os_homedir) is used.

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for avice on opening issues, pull requests, and coding standards.

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

### License

Copyright © 2016, [Brian Woodward](https://github.com/doowb).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.2.0, on October 19, 2016._