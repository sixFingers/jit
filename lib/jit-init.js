#!/usr/bin/env node

/**
 * Jit Init
 */
var program = require('commander');

program
  .option('-q, --quiet', 'be quiet')
  .option('--bare', 'create a bare repository')
  .option('--template <template-directory>', 'directory from which templates will be used')
  .option('--shared [permissions]', 'specify that the git repository is to be shared amongst several users')
  .option('directory')
  .parse(process.argv);