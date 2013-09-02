#!/usr/bin/env node

/**
 * Jit cat-file
 */
var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    storage = require('./storage/filesystem'),
    Repo = require('./common/repo'),
    GitObject = require('./common/git_object');

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
  .option('--show-index', 'show info about objects fed from the standard input')
  .parse(process.argv);

if(program.args.length < 0) {
  program.help();
}

// Hack to show index file, for development only
if(program.showIndex) {
  var repo = new Repo('.git', storage);
  repo.init(function(err) {
    repo.read_index(function(err, index) {
      if(err) {
        console.log(err);
      } else {
        console.log(index);
      }
    })
  });
} else {
  var repo = new Repo('.git', storage);
  repo.init(function(err) {
    repo.read_object({key: program.args[0]}, function(err, object) {
      if(err) {
        console.log(err.message);
      } else {
        if(program.P) {
          console.log(object.content);
        } else if(program.T) {
          console.log(object.type);
        } else if(program.S) {
          console.log(object.size);
        } else {
          program.help();
        }
      }
    });
  });
}