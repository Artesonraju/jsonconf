# jsonconf

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

 Reloadable configuration from json files

## Installation

```sh
$ npm install jsonconf
```

## Example

```js
var config = require('jsonconf');
var events = require('events');

var emitter = new events.EventEmitter();

config.load(
  [__dirname + 'config.json',
   __dirname + 'special-config.json'
  ], emitter);

emitter.on('configLoaded', function (){
  console.log(config.get('attribute'));
});

emitter.on('error', function (err){
  console.log(err);
});
```

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/jsonconf.svg?style=flat-square
[npm-url]: https://npmjs.org/package/jsonconf
[travis-image]: https://img.shields.io/travis/Artesonraju/jsonconf.svg?style=flat-square
[travis-url]: https://travis-ci.org/Artesonraju/jsonconf
[coveralls-image]: https://img.shields.io/coveralls/Artesonraju/jsonconf.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/Artesonraju/jsonconf?branch=master
[david-image]: http://img.shields.io/david/Artesonraju/jsonconf.svg?style=flat-square
[david-url]: https://david-dm.org/Artesonraju/jsonconf
[license-image]: http://img.shields.io/npm/l/jsonconf.svg?style=flat-square
[license-url]: LICENSE