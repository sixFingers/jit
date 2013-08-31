'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    Repo = require('../lib/common/repo'),
    Blob = require('../lib/common/blob'),
    storage = require('../lib/storage/filesystem');

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
    var blob = new Blob(content + '\n');
    test.equal(blob.key, stdout.replace(/[\n]/g, ''));
    test.done();
  });
}

exports.testShaKeyFromFile = function(test) {
  var content = 'hello boys, how are you?';

  exec('touch gist && echo "' + content + '" > gist && git hash-object gist', function(err, stdout, stderr) {
    var file_path = path.resolve('gist');
    fs.readFile(file_path, 'utf8', function(err, data) {
      var repo = new Repo(jit_folder + '/.git', storage);
      repo.init(function(err) {
        repo.write_blob({content: data}, function(err, blob) {
          test.equal(err, null);
          test.equal(blob.key, stdout.replace(/[\n]/g, ''));
          fs.removeSync('gist');
          test.done();
        });
      });
    });
  });
}