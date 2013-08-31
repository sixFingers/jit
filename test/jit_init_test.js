'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    Repo = require('../lib/common/repo'),
    storage = require('../lib/storage/filesystem');

var git_folder = 'git-repo';
var jit_folder = 'jit-repo/.git';

/**
*
* Verify git and jit agree on folder structure
*
**/

exports.testDefaultDirectoryTree = function(test) {
  exec('git init ' + git_folder, continueTest);

  function continueTest() {
    var repo = new Repo(jit_folder, storage);
    repo.init(function(err) {
      var git_tree = fs.readdirSync(git_folder + '/.git');
      var jit_tree = fs.readdirSync(repo.root_dir);

      fs.removeSync(git_folder);
      fs.removeSync(jit_folder);

      test.equal(err, undefined);
      test.ok(git_tree.join() == jit_tree.join());
      test.done();
    });
  }
}
