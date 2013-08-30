#!/usr/bin/env node

/**
 * Jit Init
 */
var program = require('commander'),
    Repo = require('./common/repo');

program
  // TODO
  .option('-q, --quiet', 'be quiet')
  // TODO
  .option('--bare', 'create a bare repository')
  // TODO
  .option('--template <template-directory>', 'directory from which templates will be used')
  // TODO
  .option('--shared [permissions]', 'specify that the git repository is to be shared amongst several users')
  // TODO
  .option('--separate-git-dir <gitdir>')
  // TODO
  .option('--git-dir <directory>')
  .parse(process.argv);

var repo = new Repo();
repo.init(program, function(err) {
  console.log(repo.root_dir, err);
});
