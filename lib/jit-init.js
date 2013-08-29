#!/usr/bin/env node

/**
 * Jit Init
 */
var program = require('commander'),
    init = require('./common/init');

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
  .option('directory')
  .parse(process.argv);

init.init_db(program);