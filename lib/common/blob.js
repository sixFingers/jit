var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    crypto = require('crypto'),
    shasum = crypto.createHash('sha1');

var Blob = function(type, content) {
  this.content = content;
  this.header = type + ' ' + Buffer.byteLength(content, 'utf8') + "\0";
  var key = shasum.update(this.header + this.content);
  this.key = shasum.digest('hex');
}

module.exports.hash_object = function(options, callback) {
  var options = _.defaults(options, {
    type: 'blob',
    write: false,
    content: false
  });

  var blob = new Blob(options.type, options.content);
  callback(null, blob);
}