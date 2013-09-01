'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    Repo = require('../lib/common/repo'),
    storage = require('../lib/storage/filesystem');

var git_folder = 'git-repo';
var jit_folder = 'jit-repo';

/**
*
* Verify git and jit agree on cat-file -p
*
**/

exports.testCatFileContent = function(test) {
  var content = 'hello boys, how are you?';

  exec('git init ' + git_folder, createObject);

  function createObject(err, stdout, stderr) {
    exec('echo "' + content + '" | git hash-object --stdin -w', readObject);
  };

  function readObject(err, stdout, stderr) {
    exec('git cat-file -p ' + stdout, continueTest);
  }

  function continueTest(err, stdout, stderr) {
    var repo = new Repo(jit_folder + '/.git', storage);
    repo.init(function(err) {
      repo.write_object({content: content + '\n'}, function(err, object) {
        test.equal(err, null);
        repo.read_object(object, function(err, object) {
          test.equal(err, null);
          test.ok(object.content == stdout);

          fs.removeSync(git_folder);
          fs.removeSync(jit_folder);

          test.done();
        });
      });
    });
  }
}

exports.testCatFileType = function(test) {
  var content = 'hello boys, how are you?';

  exec('git init ' + git_folder, createObject);

  function createObject(err, stdout, stderr) {
    exec('echo "' + content + '" | git hash-object --stdin -w', readObject);
  };

  function readObject(err, stdout, stderr) {
    exec('git cat-file -t ' + stdout, continueTest);
  }

  function continueTest(err, stdout, stderr) {
    var repo = new Repo(jit_folder + '/.git', storage);
    repo.init(function(err) {
      repo.write_object({content: content + '\n'}, function(err, object) {
        test.equal(err, null);
        repo.read_object(object, function(err, object) {
          test.equal(err, null);
          test.ok(object.type == stdout.replace(/[\n]/g, ''));

          fs.removeSync(git_folder);
          fs.removeSync(jit_folder);

          test.done();
        });
      });
    });
  }
}

exports.testCatFileSize = function(test) {
  var content = 'hello boys, how are you?';

  exec('git init ' + git_folder, createObject);

  function createObject(err, stdout, stderr) {
    exec('echo "' + content + '" | git hash-object --stdin -w', readObject);
  };

  function readObject(err, stdout, stderr) {
    exec('git cat-file -s ' + stdout, continueTest);
  }

  function continueTest(err, stdout, stderr) {
    var repo = new Repo(jit_folder + '/.git', storage);
    repo.init(function(err) {
      repo.write_object({content: content + '\n'}, function(err, object) {
        test.equal(err, null);
        repo.read_object(object, function(err, object) {
          test.equal(err, null);
          test.ok(parseInt(object.size) == parseInt(stdout));

          fs.removeSync(git_folder);
          fs.removeSync(jit_folder);

          test.done();
        });
      });
    });
  }
}