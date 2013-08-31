var fs = require('fs-extra'),
    _ = require('underscore'),
    defaults = require('../common/defaults'),
    path = require('path'),
    zlib = require('zlib');


module.exports.check_directories = function(root_dir, callback) {
  var directories = defaults.get_default_directories(),
      error = new Error('fatal: Not a git repository');

  function check_dir(dir, callback) {
    dir = path.resolve(root_dir + '/' + dir);
    fs.lstat(dir, function(err, stats) {
      if(err) {
        return callback(error);
      } else {
        if(!stats.isDirectory()) {
          return callback(error);
        }

        return callback();
      }
    });
  }

  return check_dir(directories.pop(), callback);
}

module.exports.create_directories = function(root_dir, callback) {
  var directories = defaults.get_default_directories(),
      error = new Error('fatal: Could not initialize, one or more folders or files already exist');

  function create_dir(dir, callback) {
    dir = path.resolve(root_dir + '/' + dir);

    fs.exists(dir, function(exists) {
      if(exists) {
        return callback(error);
      } else {
        fs.mkdirs(dir, function(err) {
          if(err) {
            return callback(error);
          } else {
            if(directories.length > 0) {
              return create_dir(directories.pop(), callback);
            }

            return callback();
          }
        });
      }
    });
  }

  return create_dir(directories.pop(), callback);
}

module.exports.create_files = function(root_dir, callback) {
  var files = defaults.get_default_files();

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

module.exports.create_blob = function(path, buffer, callback) {
  fs.createFile(path, function(err) {
    if(err) {
      return callback(err);
    } else {
      fs.open(path, 'w', function(err, fd) {
        if(err) {
          // File already exists
          return callback();
        } else {
          fs.write(fd, buffer, 0, buffer.length, 0, function(err, written) {
            if(err) {
              return callback(err);
            } else {
              return callback();
            }
          });
        }
      });
    }
  });
}
