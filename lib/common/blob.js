var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    crypto = require('crypto');

function Blob(content, type, length) {
  this.type = type || 'blob';
  this.content = content;
  this.size = length || Buffer.byteLength(this.content, 'utf8');
  this.header = this.type + ' ' + this.size + "\x00";

  var shasum = crypto.createHash('sha1');
  var key = shasum.update(this.header + this.content);
  this.key = shasum.digest('hex');
}

module.exports = Blob;