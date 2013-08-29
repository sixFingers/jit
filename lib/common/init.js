var fs = require('fs'),
    templates = require('./templates'),
    path = require('path');


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
  git_dir = path.resolve(dir ? dir + '/.git': '.git');
  var reinitialize = ((dir && !fs.existsSync(dir)) || !dir) && !fs.existsSync(git_dir)

  try {
    if(dir && !fs.existsSync(dir)) {
      if(dir)
        fs.mkdirSync(dir);
    }

    if(!fs.existsSync(git_dir)) {
      fs.mkdirSync(git_dir);
    }
  } catch(e) {
    console.error(e.message);
    process.exit();
  }

  return reinitialize;
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
  var reinitialize = this.create_dir(options.directory);

  if(reinitialize) {
    this.create_default_files();
    this.create_default_folders();
    var message = 'Initialized empty Git repository in ';
  } else {
    var message = 'Reinitialized existing Git repository in ';
  }

  console.log(message + path.resolve('./.git'));
}
