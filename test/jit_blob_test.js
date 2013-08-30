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

exports.testShaKey = function(test) {
  var content = 'hello boys, how are you?',
      stoud = '';

  exec('echo "' + content + '" | git hash-object --stdin', function(err, stoud, stderr) {
    Blob.hash_object({content: content+"\n"}, function(err, blob) {
      test.equal(err, undefined);
      test.equal(blob.key, stoud.replace(/[\n]/g, ''));
      test.done();
    });
  });
}