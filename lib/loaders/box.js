var fs = require('graceful-fs'),
  async = require('async'),
  util = require('../util'),
  file = util.file2;


module.exports = function (callback) {
  if (!hexo.env.init) return callback();
  async.parallel([
    function (next) {
      fs.exists(hexo.xsd_directory, function (exist) {
        if (!exist) {
          hexo.log.d('Creating xml schema directory ' + hexo.xsd_directory);
          file.mkdirs(hexo.xsd_directory, next);
        } else {
          next();
        }
      });
    },
    function (next) {
      fs.exists(hexo.json_scheme_output, function (exist) {
        if (!exist) {
          file.mkdirs(hexo.json_scheme_output, next);
          hexo.log.d('Creating json schema directory ' + hexo.json_scheme_output);
        } else {
          next();
        }
      });
    },
  ], callback);
};