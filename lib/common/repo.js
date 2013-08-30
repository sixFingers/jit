var fs = require('fs-extra'),
    _ = require('underscore'),
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

function Repo() {
  this.root_dir = false;
}

// Find and opens a repo
function open(options) {

}

function is_valid_path(path) {

}

function get_root_dir(options) {
  var options = _.defaults(options, {
    bare: false,
    separateGitDir: false
  });
  var root_dir;

  if(options.bare) {
    root_dir = '.';
  } else if(options.separateGitDir) {
    root_dir = './' + options.separateGitDir;
  } else if(options.args.length > 0) {
    root_dir = './' + options.args[0] + '/.git';
  } else {
    root_dir = './.git';
  }

  return path.resolve(root_dir);
}

function create_directories(root_dir, callback) {
  var directories = ['objects', 'refs'];

  function create_dir(dir, callback) {
    dir = path.resolve(root_dir + '/' + dir);
    fs.mkdirs(dir, function(err) {
      if(err) {
        return callback(err);
      } else {
        if(directories.length > 0) {
          return create_dir(directories.pop(), callback);
        }

        return callback();
      }
    });
  }

  return create_dir(directories.pop(), callback);
}

Repo.prototype.init = function(options, callback) {
  var self = this,
      root_dir = get_root_dir(options);

  create_directories(root_dir, function(err) {
    if(err) {
      return callback(err);
    } else {
      self.root_dir = root_dir;
      return callback();
    }
  });
}

module.exports = Repo;

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
