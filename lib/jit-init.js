#!/usr/bin/env node

/**
 * Jit Init
 */
var program = require('commander'),
    storage = require('./storage/filesystem'),
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
  .option('<directory>', 'create a repository in the given directory')
  .parse(process.argv);

function get_root_dir() {
  var root_dir = '.';

  if(program.args.length > 0) {
    root_dir = program.args[0];
  }

  if(program.separateGitDir) {
    root_dir += '/' + program.separateGitDir;
  }

  if(!program.bare) {
    root_dir += '/.git';
  }

  return root_dir;
}

var repo = new Repo(get_root_dir(), storage);

repo.init(function(err) {
  console.log(repo.root_dir, err);
});
