#!/usr/bin/env node

/**
 * Jit hash-object
 */
var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    storage = require('./storage/filesystem'),
    Repo = require('./common/repo'),
    GitObject = require('./common/git_object');

program
  // TODO
  .option('-t <type>', 'object type')
  // TODO
  .option('-w', 'write the object into the object database')
  .option('--stdin', 'read the object from stdin')
  // TODO
  .option('--stdin-paths', 'read file names from stdin')
  // TODO
  .option('--no-filters store file as is without filters')
  // TODO
  .option('--path <file>', 'process file as it were from this path')
  .parse(process.argv);


var content = '',
    type = program.T ? program.T: 'blob';

if(program.stdin) {
  process.stdin.on('data', function(chunk) {
    content += chunk;
  });
  process.stdin.on('end', function() {
    run();
  });
} else if(program.args.length > 0) {
  var file_path = path.resolve(program.args[0]);
  fs.readFile(file_path, 'utf8', function(err, data) {
    content = data;
    run();
  });
}
else {
  run();
}

function run() {
  if(program.W) {
    var repo = new Repo('.git', storage);
    repo.init(function(err) {
      repo.write_object({content: content}, function(err, object) {
        if(err) {
          console.log(err.message);
        } else {
          console.log(object.key);
        }
      });
    });
  } else {
    var object = new GitObject(content, type);
    console.log(object.key);
  }
}
