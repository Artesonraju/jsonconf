'use strict';

var config = require('..'),
    should = require('should'),
    events = require('events');

var emitter;

function check(apply, done){
    try {
      apply();
      done();
    } catch(err) {
      done(err);
    }
}

function createValidEmitter(expectedConfig, done){
  emitter.on('configLoaded', function (){
    check(function(){
      for(var prop in expectedConfig){
        if(expectedConfig.hasOwnProperty(prop)){
          config.get(prop).should.eql(expectedConfig[prop]);
        }
      }
      config.get('first').should.eql('first');
    }, done);
  });
  emitter.on('error', function (){
    check(function(){
      should.fail('should not send an error message');
    }, done);
  });
  setTimeout(function () {
    should.fail('should not timeout');
  }, 1000);
}

function createInvalidEmitter(done){
  emitter.on('configLoaded', function (){
    check(function(){
      should.fail('should not send an configLoaded message');
    }, done);
  });
  emitter.on('error', function (err){
    check(function(){
      err.should.be.an.instanceOf(Error);
    }, done);
  });
  setTimeout(function () {
    should.fail('should not timeout');
  }, 1000);
}
  

describe('load configuration', function(){
  beforeEach(function(){
    emitter = new events.EventEmitter();
  });
  describe('valid', function(){
    describe('unique file', function(){
      it('should send a configLoaded event', function(done){
        createValidEmitter({first: 'first'}, done);
        config.load(__dirname + '/fixtures/first.json', emitter);
      });
    });
    describe('multiple', function(){
      it('should send a configLoaded event', function(done){
        createValidEmitter(
          {first: 'first',
           second: 'second',
           both: 'second'}, done);
      config.load(
        [__dirname + '/fixtures/first.json',
         __dirname + '/fixtures/second.json'], emitter);
      });
    });
  });
  describe('invalid', function(){
    describe('unique non existent', function(){
      it('should send an error event', function(done){
        createInvalidEmitter(done);
        config.load(__dirname + '/fixtures/nonexistent.json', emitter);
      });
    });
    describe('multiple and non existent', function(){
      it('should send an error event', function(done){
        createInvalidEmitter(done);
        config.load(
        [__dirname + '/fixtures/first.json',
         __dirname + '/fixtures/nonexistent.json'], emitter);
      });
    });
    describe('unique malformed', function(){
      it('should send an error event', function(done){
        createInvalidEmitter(done);
        config.load(__dirname + '/fixtures/malformed.json', emitter);
      });
    });
    describe('multiple and malformed', function(){
      it('should send an error event', function(done){
        createInvalidEmitter(done);
        config.load(
        [__dirname + '/fixtures/first.json',
         __dirname + '/fixtures/malformed.json'], emitter);
      });
    });
  });
});