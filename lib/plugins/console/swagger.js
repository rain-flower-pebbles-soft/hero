var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');

var appStr = require('../getStr/approutes');
var swaggerOperationStr = require('../getStr/swaggerOperationStr');

module.exports = function(args, callback){
  var models = path.resolve(process.cwd(), 'json');
  fs.readdir(models, function (err, fileName) {
    fileName = fileName.map(function (fileName) {
      return fileName.split('.').slice(0, -1).join('.');
    });
    if (fileName.length == 0) {
      hexo.log.i('no file'.underline.red);
    } else {
      hexo.log.i('start'.underline.red);
      fileName.forEach(function(file){
        if(file != ""){
          createSwagger(file);
        }
      });
    }
  });
};

function createSwagger(filename){
  //TODO 生成api文件 放于目录models/swagger/swaggerize/operations目录下
  //TODO 替换掉 models/swagger/swaggerize.js文件中需要替换的部分(生成完整的api文件)
  //TODO 生成routes文件 放到api/目录下
  //TODO 替换掉 app.js中的相应部分

  var sourceFile = path.join(process.cwd(), 'json',filename+'.json');
  var source = fs.readFileSync(sourceFile,'utf-8');
  var jsonObj = JSON.parse(source);
  var test = {};
  var spaces = '  ';
  _.forEach(jsonObj,function(key,val){
     test[val] = swaggerOperationStr.getStr(val,key);

  });
  writeFile(test);
}

function writeFile(attributes){
  var tables = Object.keys(attributes)
    , self = this;

  async.series([
    function(_callback){
      fs.lstat(path.join(process.cwd(), 'models/swagger/operations'), function(err, stat){
        if (err || !stat.isDirectory()) {
          fs.mkdir(path.join(process.cwd(), 'models/swagger/operations'), _callback);
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
      fs.writeFile(path.join(process.cwd(), 'models/swagger/operations') + '/' + table + '.js', attributes[table], function(err){
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
