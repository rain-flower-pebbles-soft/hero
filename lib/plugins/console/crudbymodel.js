var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');

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
         createCURDAPI(file);
      });
    }
  });
};
function createCURDAPI(filename){
  var sourceFile = path.join(process.cwd(), 'json',filename+'.json');
  var source = fs.readFileSync(sourceFile,'utf-8');
  var jsonObj = JSON.parse(source);
  var test = {};
  var spaces = '  ';

  _.forEach(jsonObj,function(key,val){
    test[val] = "/* apifile */\n\n";
    test[val] += "var db = require('../models');\n";
    test[val] += "var sequelize_helper = require('../helpers/sequelize_helper');\n";
    test[val] += "var messages = require('../config/messages');\n";
    test[val] += "var validator = require('validator');\n";

    test[val] += "\n/*list*/\n\n";
    test[val] += "exports.index = function (req, res) {\n";
    test[val] += spaces+"sequelize_helper.paginate(db, db."+val+", req, res);\n";
    test[val] += "}\n";

    test[val] += "\n/*show*/\n\n";
    test[val] += "exports.show = function (req, res) {\n";
    test[val] += spaces+"if (validator.isNumeric(req.params.id)) {\n";
    test[val] += spaces+spaces+"var id = parseInt(req.params.id);\n";
    test[val] += spaces+spaces+"if (id > 0) {\n";
    test[val] += spaces+spaces+spaces+"db."+val+".find(id).success(function (obj) {\n";
    test[val] += spaces+spaces+spaces+spaces+" if (obj) {\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+" messages.OK_RESPONSE(obj, res);\n";
    test[val] += spaces+spaces+spaces+spaces+"}else{\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+" messages.NotFound('"+key.title+"', res)\n";
    test[val] += spaces+spaces+spaces+spaces+"}\n";
    test[val] += spaces+spaces+spaces+"});\n";
    test[val] += spaces+spaces+"}else {\n";
    test[val] += spaces+spaces+spaces+"res.json(messages.E9001);\n";
    test[val] += spaces+spaces+"}\n";
    test[val] += spaces+"}\n";
    test[val] += "}\n";

    test[val] += "\n/*edit*/\n\n";
    test[val] += "exports.edit = function (req, res) {\n";
    test[val] += spaces+"if (validator.isNumeric(req.params.id)) {\n";
    test[val] += spaces+spaces+"var id = parseInt(req.params.id);\n";
    test[val] += spaces+spaces+"if (id > 0) {\n";
    test[val] += spaces+spaces+spaces+"db."+val+".find(id).success(function (obj) {\n";
    test[val] += spaces+spaces+spaces+spaces+"res.json({\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+"status: 'OK',\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+" result: {\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+spaces+" item: obj.dataValues\n";
    test[val] += spaces+spaces+spaces+spaces+spaces+" }\n";
    test[val] += spaces+spaces+spaces+spaces+"});\n";
    test[val] += spaces+spaces+spaces+"});\n";
    test[val] += spaces+spaces+"}else {\n";
    test[val] += spaces+spaces+spaces+" res.json({\n";
    test[val] += spaces+spaces+spaces+spaces+"  status: 'error',\n";
    test[val] += spaces+spaces+spaces+spaces+"  msg: 'Invalid "+val+" id, must be greater than or equal to 0'\n";
    test[val] += spaces+spaces+spaces+" });\n";
    test[val] += spaces+spaces+"}\n";
    test[val] += spaces+"}\n";
    test[val] += "}\n";

    test[val] += "\n/*update*/\n\n";
    test[val] += "exports.update = function (req, res) {\n";
    test[val] += "}\n";

    test[val] += "\n/*destroy*/\n\n";
    test[val] += "exports.destroy = function (req, res) {\n";
    test[val] += "}\n";



  });

  writeFile(test);
}

function writeFile(attributes){
  var tables = Object.keys(attributes)
    , self = this;

  async.series([
    function(_callback){
      fs.lstat(path.join(process.cwd(), 'api'), function(err, stat){
        if (err || !stat.isDirectory()) {
          fs.mkdir(path.join(process.cwd(), 'api'), _callback);
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
      fs.writeFile(path.join(process.cwd(), 'api') + '/' + table + '.js', attributes[table], function(err){
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
