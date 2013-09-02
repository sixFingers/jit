var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    GitObject = require('./git_object'),
    zlib = require('zlib');

/**
*
* Module definitions
*
**/

function Repo(root_dir, storage) {
  this.root_dir = path.resolve(root_dir);
  this.storage = storage;
  this.blobs = {};
}

Repo.prototype.get_root_dir = function(dir) {
  var root_dir = dir || '.';

  if(program.args.length > 0) {
    root_dir = program.args[0];
  }

  if(program.separateGitDir) {
    root_dir += '/' + program.separateGitDir;
  }

  if(!program.bare) {
    root_dir += '/.git';
  }

  return root_dir;
}

Repo.prototype.init = function(callback) {
  var self = this;

  // Try to initialize from existing /.git
  this.storage.check_directories(this.root_dir, function(err) {
    if(err) {
      // Create a new /.git and subfolders
      self.storage.create_directories(self.root_dir, function(err) {
        if(err) {
          return callback(err);
        } else {
          // Create git files
          self.storage.create_files(self.root_dir, function(err) {
            if(err) {
              return callback(err);
            } else {
              return callback();
            }
          });
        }
      });
    } else {
      return callback();
    }
  });
}

Repo.prototype.write_object = function(options, callback) {
  var options = _.defaults(options, {
    type: 'blob',
    content: ''
  });

  var self = this;
  var object = new GitObject(options.content, options.type);

  var object_file = zlib.deflate(object.header + object.content, function(err, buffer) {
    if(err) {
      return callback(err);
    } else {
      var object_path = self.root_dir + get_object_path(object.key);
      self.storage.create_object(object_path, buffer, function(err) {
        if(err) {
          callback(err)
        } else {
          callback(null, object);
        }
      });
    }
  });
}

Repo.prototype.read_object = function(options, callback) {
  var object_path = this.root_dir + get_object_path(options.key);
  this.storage.read_object(object_path, function(err, buffer) {
    if(err) {
      callback(new Error('fatal: Not a valid object name ' + options.key));
    } else {
      var object_content = zlib.inflate(buffer, function(err, data) {
        if(err) {
          callback(err);
        } else {
          var b = 0, offset;
          while(data[b] != 0) {
            offset = b + 2;
            b ++;
          }

          var header_data = data.toString('utf8', 0, offset).split(' ');
          var type = header_data[0];
          var length = header_data[1];
          var content = data.toString('utf8', offset);
          var object = new GitObject(content, type, length);

          callback(null, object);
        }
      });
    }
  });
}

Repo.prototype.read_index = function(callback) {
  this.storage.parse_index_file(function(err, index) {
    if(err) {
      callback(err);
    } else {
      callback(null, index);
    }
  });
}

function get_object_path(key) {
  var object_path = '/objects/' + key.substring(0, 2) + '/' + key.substring(2);
  return object_path;
}

function get_object_key(path) {
  var object_key = path.replace('/', '');
  return object_key;
}

module.exports = Repo;