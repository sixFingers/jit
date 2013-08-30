#!/usr/bin/env node

/**
 * Jit Init
 */
var program = require('commander'),
    Repo = require('./common/repo');

program
  // TODO
  .option('-q, --quiet', 'be quiet')
  .option('--bare', 'create a bare repository')
  // TODO
  .option('--template <template-directory>', 'directory from which templates will be used')
  // TODO
  .option('--shared [permissions]', 'specify that the git repository is to be shared amongst several users')
  .option('--separate-git-dir <gitdir>')
  .option('--git-dir <directory>', 'create a repository in the given directory')
  .parse(process.argv);

var repo = new Repo();
repo.init(program, function(err) {
  console.log(repo.root_dir, err);
});
