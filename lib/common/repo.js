var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    Blob = require('./blob'),
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

Repo.prototype.write_blob = function(options, callback) {
  var options = _.defaults(options, {
    type: 'blob',
    content: ''
  });

  var self = this;
  var blob = new Blob(options.content, options.type);

  var blob_file = zlib.deflate(blob.header + blob.content, function(err, buffer) {
    if(err) {
      return callback(err);
    } else {
      var blob_path = self.root_dir + get_blob_path(blob.key);
      self.storage.create_blob(blob_path, buffer, function(err) {
        if(err) {
          callback(err)
        } else {
          callback(null, blob);
        }
      });
    }
  });
}

Repo.prototype.read_object = function(options, callback) {
  var blob_path = this.root_dir + get_blob_path(options.key);
  this.storage.read_object(blob_path, function(err, buffer) {
    if(err) {
      callback(new Error('fatal: Not a valid object name ' + options.key));
    } else {
      var blob_content = zlib.inflate(buffer, function(err, data) {
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
          var blob = new Blob(content, type, length);

          callback(null, blob);
        }
      });
    }
  });
}

function get_blob_path(key) {
  var blob_path = '/objects/' + key.substring(0, 2) + '/' + key.substring(2);
  return blob_path;
}

function get_blob_key(path) {
  var blob_key = path.replace('/', '');
  return blob_key;
}

module.exports = Repo;