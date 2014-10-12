# jsonconf

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