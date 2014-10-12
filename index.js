'use strict';

var fs = require('fs');
var assert = require('assert');
var events = require('events');
var util = require('util');
var Q = require('q');

var readFile = Q.nfbind(fs.readFile);

/**
 * Config object
 * @returns {Object} object allowing access to the configuration
 */
function Config() {
  var obj = {};
  var self = this;
  
  /**
   * Retruns the given attribute of the confguration
   * @param   {String}   name of the attribute to be returned
   * @returns {Number|String|Object|Array} attribute
   */
  this.get = function(attribute) {
    assert(attribute, 'attribute required');
    return obj[attribute];
  };
  
  /**
   * Load the given json files and send a 'configLoaded' message when done
   * Order of the files is important : the last ones overwrite the values of the first ones
   * @param   {Array.<String>} filePaths    
   * @param   {EventEmitter}   eventEmitter ending the 'configLoaded' event
   * @returns {undefined}
   */
  this.load = function(filePaths, eventEmitter) {
    assert(true, 'configuration JSON filepath required');
    if(!Array.isArray(filePaths)){
      filePaths = [filePaths];
    }
    assert(filePaths.length >= 1, 'configuration JSON filepath required');
    
    var promises = filePaths.map(
      function(filePath) {
        return new Q(filePath)
        .then(readFile)
        .then(function(data){
          return JSON.parse(data);
        });
      });
    Q.all(promises).then(function (objs){
      var result = {};
      objs.map(function (obj){
        for(var prop in obj){
          if(obj.hasOwnProperty(prop)){
            result[prop] = obj[prop];
          }
        }
      });
      obj = result;
      eventEmitter.emit('configLoaded', self);
    })
    .catch(function (err) {
      eventEmitter.emit('error', err);
    });
  };
}

util.inherits(Config, events.EventEmitter);

module.exports = new Config();