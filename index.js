'use strict';

var fs = require('fs');
var assert = require('assert');
var events = require('events');
var util = require('util');
var async = require('async');

function readAndParse(filePath, callback) {
    fs.readFile(filePath, 'utf8',function(err, data){
      var res;
      if(!err){
        try{
          res = JSON.parse(data);
        } catch(error){
          err = error;
        }
      }
      callback(err, res);
    });
}

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

    async.map(filePaths, readAndParse, function(err, objs) {
      if(err){
        eventEmitter.emit('error', err);
      } else {
        var result = {};
        objs.map(function (obj){
          for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
              result[prop] = obj[prop];
            }
          }
        });
        console.log(result);
        obj = result;
        eventEmitter.emit('configLoaded', self);
      }
    });
  };
}

util.inherits(Config, events.EventEmitter);

module.exports = new Config();