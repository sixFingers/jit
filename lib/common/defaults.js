/**
*
* Repository defaults
*
**/

module.exports.get_default_directories = function() {
  return [
    'branches',
    'hooks',
    'info',
    'objects/info',
    'objects/pack',
    'objects',
    'refs'
  ];
};

module.exports.get_default_files = function() {
  return [
    'HEAD',
    'config',
    'description'
  ];
};