var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path');

/**
*
* Module definitions
*
**/

function Repo() {
  this.root_dir = false;
}

function get_default_directories() {
  var directories = [
    'branches',
    'hooks',
    'info',
    'objects/info',
    'objects/pack',
    'objects',
    'refs'
  ];

  return directories;
}

function get_default_files() {
  var files = [
    'HEAD',
    'config',
    'description'
  ];

  return files;
}

function get_root_dir(options) {
  var options = _.defaults(options, {
    bare: false,
    separateGitDir: false,
    gitDir: false
  });
  var root_dir;

  if(options.bare) {
    root_dir = '.';
  } else if(options.separateGitDir) {
    root_dir = './' + options.separateGitDir;
  } else if(options.gitDir) {
    root_dir = './' + options.gitDir + '/.git';
  } else {
    root_dir = './.git';
  }

  return path.resolve(root_dir);
}

function create_directories(root_dir, callback) {
  var directories = get_default_directories();

  function create_dir(dir, callback) {
    dir = path.resolve(root_dir + '/' + dir);

    fs.exists(dir, function(exists) {
      if(exists) {
        return callback(new Error());
      } else {
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
    })
  }

  return create_dir(directories.pop(), callback);
}

function check_directories(root_dir, callback) {
  var directories = get_default_directories();

  function check_dir(dir, callback) {
    dir = path.resolve(root_dir + '/' + dir);
    fs.lstat(dir, function(err, stats) {
      if(err) {
        return callback(err);
      } else {
        if(!stats.isDirectory()) {
          return callback(new Error('Git folder structure is broken.'));
        }

        return callback();
      }
    });
  }

  return check_dir(directories.pop(), callback);
}

function create_files(root_dir, callback) {
  var files = get_default_files();

  function create_file(file, callback) {
    file = path.resolve(root_dir + '/' + file);
    fs.createFile(file, function(err) {
      if(err) {
        return callback(err);
      } else {
        if(files.length > 0) {
          return create_file(files.pop(), callback);
        }

        return callback();
      }
    });
  }

  return create_file(files.pop(), callback);
}

Repo.prototype.init_new = function(options, callback) {
  var self = this,
      root_dir = get_root_dir(options);

  return create_directories(root_dir, function(err) {
    if(err) {
      return callback(err);
    } else {
      self.root_dir = root_dir;
      return create_files(self.root_dir, callback);
    }
  });
}

Repo.prototype.init_from_dir = function(options, callback) {
  var self = this,
      root_dir = get_root_dir(options);

  check_directories(root_dir, function(err) {
    if(err) {
      return callback(err);
    } else {
      self.root_dir = root_dir;
      return callback();
    }
  });
}

Repo.prototype.init = function(options, callback) {
  var self = this,
      root_dir = get_root_dir(options);

  this.init_from_dir(options, function(err) {
    if(err) {
      return self.init_new(options, callback);
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
    process.exit();
  }

  return reinitialize;
}