var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    crypto = require('crypto');

function Blob(content, type) {
  this.type = type || 'blob';
  this.content = content;
  this.header = this.type + ' ' + Buffer.byteLength(this.content, 'utf8') + "\0";

  var shasum = crypto.createHash('sha1');
  var key = shasum.update(this.header + this.content);
  this.key = shasum.digest('hex');
}

module.exports = Blob;