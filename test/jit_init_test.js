'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    init = require('../lib/common/init');

var git_folder = path.resolve('git-repo');
var jit_folder = path.resolve('jit-repo');

exports.testDefaultDirectoryTree = function(test) {
  exec('git init ' + git_folder, continueTest);

  function continueTest() {
    init.init_db({
      directory: jit_folder
    });

    var git_tree = fs.readdirSync(git_folder + '/.git');
    var jit_tree = fs.readdirSync(jit_folder + '/.git');

    fs.removeSync(git_folder);
    fs.removeSync(jit_folder);

    test.ok(git_tree.join() == jit_tree.join());
    test.done();
  }
}