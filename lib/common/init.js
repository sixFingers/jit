var fs = require('fs'),
    templates = require('./templates');


/**
*
* Script execution variables
*
**/

var git_dir;


/**
*
* Module definitions
*
**/

module.exports.create_dir = function(dir) {
  git_dir = dir ? dir + '/.git': '.git';

  try {
    if(dir)
      fs.mkdirSync(dir);
    fs.mkdirSync(git_dir);
  } catch(err) {
    console.error(err.message);
  }
}

module.exports.create_default_files = function() {
  try {
    fs.writeFileSync(git_dir + '/HEAD', templates('HEAD_FILE'));
    fs.writeFileSync(git_dir + '/config', templates('CONFIG_FILE'));
    fs.writeFileSync(git_dir + '/description');
  } catch(err) {
    console.error(err.message);
  }
}

module.exports.create_default_folders = function() {
  try {
    fs.mkdirSync(git_dir + '/hooks');
    fs.mkdirSync(git_dir + '/objects');
    fs.mkdirSync(git_dir + '/branches');
    fs.mkdirSync(git_dir + '/info');
    fs.mkdirSync(git_dir + '/refs');
  } catch(err) {
    console.error(err.message);
  }
}

module.exports.init_db = function(options) {
  this.create_dir(options.directory);
  this.create_default_files();
  this.create_default_folders();
}