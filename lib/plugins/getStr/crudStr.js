module.exports.getStr = function(val,key){
  var spaces = '  ';
  var str = "";
  str = "/* apifile */\n\n";
  str += "var db = require('../models');\n";
  str += "var sequelize_helper = require('../helpers/sequelize_helper');\n";
  str += "var messages = require('../config/messages');\n";
  str += "var validator = require('validator');\n";

  str += "\n/*list*/\n\n";
  str += "exports.index = function (req, res) {\n";
  str += spaces+"sequelize_helper.paginate(db, db."+val+", req, res);\n";
  str += "}\n";

  str += "\n/*show*/\n\n";
  str += "exports.show = function (req, res) {\n";
  str += spaces+"if (validator.isNumeric(req.params.id)) {\n";
  str += spaces+spaces+"var id = parseInt(req.params.id);\n";
  str += spaces+spaces+"if (id > 0) {\n";
  str += spaces+spaces+spaces+"db."+val+".find(id).success(function (obj) {\n";
  str += spaces+spaces+spaces+spaces+" if (obj) {\n";
  str += spaces+spaces+spaces+spaces+spaces+" messages.OK_RESPONSE(obj, res);\n";
  str += spaces+spaces+spaces+spaces+"}else{\n";
  str += spaces+spaces+spaces+spaces+spaces+" messages.NotFound('"+key.title+"', res)\n";
  str += spaces+spaces+spaces+spaces+"}\n";
  str += spaces+spaces+spaces+"});\n";
  str += spaces+spaces+"}else {\n";
  str += spaces+spaces+spaces+"res.json(messages.E9001);\n";
  str += spaces+spaces+"}\n";
  str += spaces+"}\n";
  str += "}\n";

  str += "\n/*edit*/\n\n";
  str += "exports.edit = function (req, res) {\n";
  str += spaces+"if (validator.isNumeric(req.params.id)) {\n";
  str += spaces+spaces+"var id = parseInt(req.params.id);\n";
  str += spaces+spaces+"if (id > 0) {\n";
  str += spaces+spaces+spaces+"db."+val+".find(id).success(function (obj) {\n";
  str += spaces+spaces+spaces+spaces+"res.json({\n";
  str += spaces+spaces+spaces+spaces+spaces+"status: 'OK',\n";
  str += spaces+spaces+spaces+spaces+spaces+" result: {\n";
  str += spaces+spaces+spaces+spaces+spaces+spaces+" item: obj.dataValues\n";
  str += spaces+spaces+spaces+spaces+spaces+" }\n";
  str += spaces+spaces+spaces+spaces+"});\n";
  str += spaces+spaces+spaces+"});\n";
  str += spaces+spaces+"}else {\n";
  str += spaces+spaces+spaces+" res.json({\n";
  str += spaces+spaces+spaces+spaces+"  status: 'error',\n";
  str += spaces+spaces+spaces+spaces+"  msg: 'Invalid "+val+" id, must be greater than or equal to 0'\n";
  str += spaces+spaces+spaces+" });\n";
  str += spaces+spaces+"}\n";
  str += spaces+"}\n";
  str += "}\n";

  str += "\n/*update*/\n\n";
  str += "exports.update = function (req, res) {\n";
  str += "}\n";

  str += "\n/*destroy*/\n\n";
  str += "exports.destroy = function (req, res) {\n";
  str += "}\n";
  return str;
};
