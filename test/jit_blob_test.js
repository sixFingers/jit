'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    Blob = require('../lib/common/blob');

var git_folder = 'git-repo';
var jit_folder = 'jit-repo';

/**
*
* Test that git and jit agree on setting blob keys.
* Pay attention: blob content created on jit needs to ALWAYS have a \n
* at the end when reading from stdin but setting it from js
* (stdin always present a newline char at the end).
*
**/

exports.testShaKeyFromStdin = function(test) {
  var content = 'hello boys, how are you?';

  exec('echo "' + content + '" | git hash-object --stdin', function(err, stdout, stderr) {
    var blob = new Blob();
    blob.hash_object({content: content + '\n'}, function(err) {
      test.equal(err, undefined);
      test.equal(blob.key, stdout.replace(/[\n]/g, ''));
      test.done();
    });
  });
}

exports.testShaKeyFromFile = function(test) {
  var content = 'hello boys, how are you?';

  exec('touch gist && echo "' + content + '" > gist && git hash-object gist', function(err, stdout, stderr) {
    var file_path = path.resolve('gist');
    fs.readFile(file_path, 'utf8', function(err, data) {
      var blob = new Blob();
      blob.hash_object({content: data}, function(err) {
        test.equal(err, undefined);
        test.equal(blob.key, stdout.replace(/[\n]/g, ''));
        fs.removeSync('gist');
        test.done();
      });
    });
  });
}