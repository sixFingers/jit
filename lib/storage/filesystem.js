var fs = require('fs-extra'),
    _ = require('underscore'),
    defaults = require('../common/defaults'),
    path = require('path'),
    zlib = require('zlib'),
    bitparser = require('bitparser');


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

module.exports.create_object = function(path, buffer, callback) {
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

module.exports.read_object = function(path, callback) {
  fs.readFile(path, function(err, data) {
    callback(err, data);
  });
}

module.exports.parse_index_file = function(callback) {
  file = fs.readFile('.git/index', function(err, data) {
    if(err) {
      callback(err);
    } else {
      parser = bitparser(data);

      var index = {
        signature: parser.getBuffer(4).toString('utf8'),
        version: parser.getBuffer(4).readUInt32BE(0),
        entries_count: parser.getBuffer(4).readUInt32BE(0),
        entries: [],
        tree: {}
      }

      var entries = index.entries_count;
      while(entries --) {
        var entry = {}
        entry.ctime_seconds = parser.getBuffer(4).readUInt32BE(0),
        entry.ctime_nanoseconds = parser.getBuffer(4).readUInt32BE(0),
        entry.mtime_seconds = parser.getBuffer(4).readUInt32BE(0),
        entry.mtime_nanoseconds = parser.getBuffer(4).readUInt32BE(0),
        entry.dev = parser.getBuffer(4).readUInt32BE(0),
        entry.ino = parser.getBuffer(4).readUInt32BE(0)

        parser.skipBits(16);

        type = function() {
          var type = '', i = 4;
          while(i--) {
            type += parser.read1Bit();
          }
          return type;
        }();
        entry.type = type;

        parser.skipBits(3);

        chmod = function() {
          var chmod = '', i = 3;
          while(i--) {
            var _chmod = '', ii = 3;
            while(ii--) {
              _chmod += parser.read1Bit();
            };
            chmod += parseInt(_chmod, 2);
          }
          return chmod;
        }();
        entry.chmod = chmod;

        entry.uid = parser.getBuffer(4).readUInt32BE(0);
        entry.gid = parser.getBuffer(4).readUInt32BE(0);
        entry.size = parser.getBuffer(4).readUInt32BE(0);
        entry.sha1 = parser.getBuffer(20).toString('hex');
        entry.assume_valid = parser.read1Bit();
        entry.extended = parser.read1Bit();
        entry.stage = [parser.read1Bit(), parser.read1Bit()];
        entry.name_length = parser.readBits(12);
        entry.path = parser.getBuffer(entry.name_length).toString('utf8');

        index.entries.push(entry);

        while(parser.getBuffer(1)[0] == 0) {}
        parser.skipBits(-8);
      }

      index.tree.signature = parser.getBuffer(4).toString('utf8');
      index.tree.path_component = parser.getBuffer(4).readUInt32BE(0);
      null_terminated = parser.getBuffer(1);
      index.tree.entries_count = parser.getBuffer(2).toString('ascii');
      space = parser.getBuffer(1);
      index.tree.subtrees = parser.getBuffer(1).toString('ascii');
      newline = parser.getBuffer(1);
      index.tree.object_name = parser.getBuffer(20).toString('hex');
      return callback(null, index);
    }
  });
}