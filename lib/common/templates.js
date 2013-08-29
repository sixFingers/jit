var sprintf = require('sprintf').sprintf;


/**
*
* Module definitions
*
**/

module.exports = function(key, options) {
  return keys[key](options);
}

var keys  = {
  'CONFIG_FILE': getConfigFile,
  'HEAD_FILE': getHeadFile
}

function getConfigFile(options) {
  return("[core]\n\
        repositoryformatversion = 0\n\
        filemode = true\n\
        bare = false\n\
        logallrefupdates = true\n\
        ignorecase = true\n\
        precomposeunicode = false");
}

function getHeadFile(options) {
  return sprintf('ref: refs/heads/master');
}
