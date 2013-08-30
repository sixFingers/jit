var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    crypto = require('crypto');

function Blob() {

}

Blob.prototype.hash_object = function(options, callback) {
  var options = _.defaults(options, {
    type: 'blob',
    write: false,
    content: false
  });

  this.type = options.type;
  this.content = options.content;
  this.header = this.type + ' ' + Buffer.byteLength(this.content, 'utf8') + "\0";
  var shasum = crypto.createHash('sha1');
  var key = shasum.update(this.header + this.content);
  this.key = shasum.digest('hex');

  callback(null);
}

module.exports = Blob;