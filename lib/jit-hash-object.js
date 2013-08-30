#!/usr/bin/env node

/**
 * Jit hash-object
 */
var program = require('commander'),
    Blob = require('./common/blob');

program
  // TODO
  .option('-t <type>', 'object type')
  // TODO
  .option('-w', 'write the object into the object database')
  // TODO
  .option('--stdin', 'read the object from stdin')
  // TODO
  .option('--stdin-paths', 'read file names from stdin')
  // TODO
  .option('--no-filters store file as is without filters')
  // TODO
  .option('--path <file>', 'process file as it were from this path')
  .parse(process.argv);


content = '';

if(program.stdin) {
  process.stdin.on('data', function(chunk) {
    content += chunk;
  })
  process.stdin.on('end', function() {
    run();
  })
} else {
  run();
}

function run() {
  Blob.hash_object({content: content}, function(err, blob) {
    console.log(blob)
  });
}
