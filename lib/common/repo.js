var fs = require('fs-extra'),
    _ = require('underscore'),
    templates = require('./templates'),
    path = require('path'),
    zlib = require('zlib');

/**
*
* Module definitions
*
**/

function Repo(root_dir, storage) {
  this.root_dir = path.resolve(root_dir);
  this.storage = storage;
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

function get_blob_path(key) {
  var blob_path = key.substring(0, 2) + '/' + key.substring(2);
  return blob_path;
}

Repo.prototype.write_blob = function(blob, callback) {
  var blob_path = get_blob_path(blob.key);
  blob_path = path.resolve(this.root_dir + '/objects/' + blob_path);
  var content = zlib.deflate(blob.header + blob.content, function(err, content) {
    fs.outputFile(blob_path, blob.content, function(err) {
      if(err) {
        return callback(err);
      }

      return callback();
    });
  });
}

Repo.prototype.read_blob_from_key = function(key, callback) {
  var blob_path = get_blob_path(key);
  blob_path = path.resolve(this.root_dir + '/objects/' + blob_path);
  var content = zlib.deflate(blob.header + blob.content, function(err, content) {
    fs.outputFile(blob_path, blob.content, function(err) {
      if(err) {
        return callback(err);
      }

      return callback();
    });
  });
}

module.exports = Repo;