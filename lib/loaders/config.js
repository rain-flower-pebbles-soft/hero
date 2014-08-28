var path = require('path'),
  fs = require('graceful-fs'),
  async = require('async'),
  _ = require('lodash'),
  HexoError = require('../error'),
  util = require('../util'),
  file = util.file2;

var defaults = {
  // XML Schema Directory
  xsd_directory: 'schema/xsd',
  // JSON Schema Directory
  json_scheme_output: 'schema/json_schema_output',
  // Database Configuration
  db_type: 'mysql',
  db_host: 'localhost',
  db_port: 3306,
  db_database: 'hero',
  db_username: 'root',
  db_password: 'root'
};

// 把所有参数作为路径片段连接起来
var joinPath = function () {
  var str = path.join.apply(this, arguments);
  if (str[str.length - 1] !== path.sep) str += path.sep;
  return str;
};

module.exports = function (callback) {
  var baseDir = hexo.base_dir;
  var configPath = hexo.configfile;

  /**
   * Configuration.
   *
   * @property config
   * @type Object
   * @for Hexo
   */

  hexo.config = {};

  async.series([
    function (next) {
      fs.exists(configPath, function (exist) {
        if (exist) {
          next();
        } else {
          callback();
        }
      });
    },
    function (next) {
      hexo.render.render({path: configPath}, function (err, result) {
        if (err) return next(HexoError.wrap(err, 'Config file load failed'));

        var config = hexo.config = _.extend(defaults, result);
        hexo.log.d('setting hexo.env.init = true')
        hexo.env.init = true;

        // 添加文件系统路径'/'
        if (_.last(config.root) !== '/') {
          config.root += '/';
        }
        // 去除URL最后的'/'
        if (_.last(config.url) === '/') {
          config.url = config.url.substring(0, config.url.length - 1);
        }

        var baseDir = hexo.base_dir;

        /**
         * The path of public directory.
         *
         * @property public_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('xsd_directory', joinPath(baseDir, config.xsd_directory));

        /**
         * The path of source directory.
         *
         * @property source_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('json_scheme_output', joinPath(baseDir, config.json_scheme_output));

        /**
         * The path of plugin directory.
         *
         * @property plugin_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('plugin_dir', joinPath(baseDir, 'node_modules'));

        /**
         * The path of script directory.
         *
         * @property script_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('script_dir', joinPath(baseDir, 'scripts'));

        /**
         * The path of scaffold directory.
         *
         * @property scaffold_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('scaffold_dir', joinPath(baseDir, 'scaffolds'));

        /**
         * The path of theme directory.
         *
         * @property theme_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('theme_dir', function () {
          return joinPath(baseDir, 'themes', config.theme);
        });

        /**
         * The path of theme script directory.
         *
         * @property theme_script_dir
         * @type String
         * @for Hexo
         */

        hexo.constant('theme_script_dir', function () {
          return joinPath(hexo.theme_dir, 'scripts');
        });

        next();
      });
    }
  ], function (err) {
    if (err) return callback(err);

    hexo.log.d('Config file loaded from %s', configPath);
    callback();
  });
};
