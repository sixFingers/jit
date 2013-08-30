'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    Repo = require('../lib/common/repo');

var git_folder = 'git-repo';
var jit_folder = 'jit-repo';

/**
*
* Verify git and jit agree on folder structure
*
**/

exports.testDefaultDirectoryTree = function(test) {
  exec('git init ' + git_folder, continueTest);

  function continueTest() {
    var repo = new Repo();
    repo.init({gitDir: jit_folder}, function(err) {
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


/**
*
* Verify jit doesn't allow writing git folders if they're already there.
* If they are there, it instantiates a repo from already existing folders.
*
**/

exports.testJitInitLoad = function(test) {
  var repo = new Repo();

  function repo_init(callback) {
    return repo.init_new({gitDir: jit_folder}, callback);
  }

  function repo_load(callback) {
    return repo.init_from_dir({gitDir: jit_folder}, callback);
  }

  repo_init(function(err) {
    test.equal(err, undefined);

    if(!err) {
      repo_load(function(err) {
        test.equal(err, undefined);

        if(!err) {
          repo_init(function(err) {
            test.notEqual(err, undefined);

            fs.removeSync(jit_folder);
            test.done();
          });
        }
      });
    }
  });
}