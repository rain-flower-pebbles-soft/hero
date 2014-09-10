var sequelize = require('sequelize');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');


module.exports = function(args, callback){
  //TODO 现在只有使用json文件生成model js文件 是否需要加上sequelize-auto使用数据库的方式生成model js
  //console.log(require('optimist').argv);

  var config = hexo.config;
  var logger = hexo.log;

  var jsonDir = path.resolve(process.cwd(), 'json');
  fs.readdir(jsonDir, function (err, fileName) {
    fileName = fileName.map(function (fileName) {
      return fileName.split('.').slice(0, -1).join('.');
    });
    if (fileName.length == 0) {
      hexo.log.i('no file'.underline.red);
    } else {
      hexo.log.i('start'.underline.red);
      for (var i = 0, len = fileName.length; i < len; i++) {
        if(fileName[i] != "" ){
          createFile(fileName[i]);
        }
      }
    }
  });

  hexo.log.i('sequelize plugin');
};

function createFile(filename){
  var sourceFile = path.join(process.cwd(), 'json',filename+'.json');
  var source = fs.readFileSync(sourceFile,'utf-8');
  var jsonObj = JSON.parse(source);
  var test = {};
  //TODO 需要更改写死状态
  var spaces = '  ';

  _.forEach(jsonObj,function(key,val){
    test[val] = "/* mytestfile */\n\n";
    test[val] += "module.exports = function(sequelize, DataTypes) {\n";
    test[val] += spaces + "return sequelize.define('" + val + "', { \n";
    var fields = Object.keys(key.properties);
    fields.forEach(function(field, i){
      test[val] += spaces + spaces + field + ": {\n";
      var fieldAttr = Object.keys(key.properties[field]);
      var defaultVal = key.properties[field].defaultValue;

      if (sequelize.Utils._.isString(defaultVal) && defaultVal.toLowerCase().indexOf('nextval') !== -1 && defaultVal.toLowerCase().indexOf('regclass') !== -1) {
        test[val] += spaces + spaces + spaces + "type: DataTypes.INTEGER,\n";
        test[val] += spaces + spaces + spaces + "primaryKey: true\n";
      } else {
        if (key.properties[field].type === "USER-DEFINED" && !!key.properties[field].special) {
          key.properties[field].type = "ENUM(" + key.properties[field].special.map(function(f){ return "'" + f + "'"; }).join(',') + ")";
        }
        fieldAttr.forEach(function(attr, x){
          if (attr === "special") {
            return true;
          }else if (attr === "allowNull") {
            test[val] += spaces + spaces + spaces + attr + ": " + key.properties[field][attr];
          }else if (attr === "defaultValue") {
            var val_text = defaultVal;
            if (sequelize.Utils._.isString(defaultVal)) {
              val_text = "'" + val_text + "'"
            }
            if(defaultVal === null) {
              return true;
            } else {
              test[val] += spaces + spaces + spaces + attr + ": " + val_text;
            }
          }else if (attr === "type" && key.properties[field][attr].indexOf('ENUM') === 0) {
            test[val] += spaces + spaces + spaces + attr + ": DataTypes." + key.properties[field][attr];
          }else {
            var _attr = (key.properties[field][attr]+"").toLowerCase();
            var valFiled = "'" + key.properties[field][attr] + "'";

            if (_attr === "tinyint(1)" || _attr === "boolean") {
              valFiled = 'DataTypes.BOOLEAN';
            }
            else if (_attr.match(/^(smallint|mediumint|tinyint|int)/)) {
              var length = _attr.match(/\(\d+\)/);
              valFiled = 'DataTypes.INTEGER' + (!!length ? length : '');
            }
            else if (_attr.match(/^bigint/)) {
              valFiled = 'DataTypes.BIGINT';
            }
            else if (_attr.match(/^string|varchar|varying/)) {
              valFiled = 'DataTypes.STRING';
            }
            else if (_attr.match(/text$/)) {
              valFiled = 'DataTypes.TEXT';
            }
            else if (_attr.match(/^(date|time)/)) {
              valFiled = 'DataTypes.DATE';
            }
            else if (_attr.match(/^(float|decimal)/)) {
              valFiled = 'DataTypes.' + _attr.toUpperCase();
            }
            test[val] += spaces + spaces + spaces + attr + ": " + valFiled;
          }
          if ((x+1) < fieldAttr.length && fieldAttr[x+1] !== "special") {
            test[val] += ",";
          }
          test[val] += "\n";
        });
      }
      test[val] += spaces + spaces + "}";
      if ((i+1) < fields.length) {
        test[val] += ",";
      }
      test[val] += "\n";
    });
    test[val] += spaces + "});\n};\n";
  });

  writeFile(test);

}

function writeFile(attributes){
  var tables = Object.keys(attributes)
    , self = this;

  async.series([
    function(_callback){
      fs.lstat(path.join(process.cwd(), 'models'), function(err, stat){
        if (err || !stat.isDirectory()) {
          fs.mkdir(path.join(process.cwd(), 'models'), _callback);
        } else {
          _callback(null);
        }
      })
    }
  ], function(err){
    if (err){
      hexo.log.i(err);
      return ;
    }

    async.each(tables, function(table, _callback){
      fs.writeFile(path.join(process.cwd(), 'models') + '/' + table + '.js', attributes[table], function(err){
        if (err) return _callback(err);
        _callback(null);
      });
    }, function(err){
      if (err){
        hexo.log.i(err);
        return ;
      }
      hexo.log.i('create ok');
    });
  });
}
