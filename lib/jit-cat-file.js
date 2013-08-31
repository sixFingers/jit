#!/usr/bin/env node

/**
 * Jit cat-file
 */
var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    storage = require('./storage/filesystem'),
    Repo = require('./common/repo'),
    Blob = require('./common/blob');

program
  .option('-t', 'show object type')
  .option('-s', 'show object size')
  // TODO
  .option('-e', 'exit with zero when there\'s no error')
  .option('-p', 'pretty-print object\'s content')
  // TODO
  .option('--textconv', 'for blob objects, run textconv on object\'s content')
  // TODO
  .option('--batch', 'show info and content of objects fed from the standard input')
  // TODO
  .option('--batch-check', 'show info about objects fed from the standard input')
  .parse(process.argv);

if(program.args.length < 0) {
  program.help();
}

var repo = new Repo('.git', storage);
repo.init(function(err) {
  repo.read_object({key: program.args[0]}, function(err, blob) {
    if(err) {
      console.log(err.message);
    } else {
      if(program.P) {
        console.log(blob.content);
      } else if(program.T) {
        console.log(blob.type);
      } else if(program.S) {
        console.log(blob.size);
      } else {
        program.help();
      }
    }
  });
});