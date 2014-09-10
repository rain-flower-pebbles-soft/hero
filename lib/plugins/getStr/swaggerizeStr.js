var _ = require('lodash');

module.exports.swaggerizeStr = function(jsonObj){
  var spaces = '  ';
  var str = {};
  var __apiEntrance__ = "";
  var __swaggerAddEntrance__ = "swagger\n";
  var __swaggerPageShowEntrance__ = "";
  _.forEach(jsonObj,function(key,val){
    __apiEntrance__ += "var "+val+"Api = require('./operations/"+val+"');\n";

    __swaggerAddEntrance__ += ".addGet("+val+"Api.get"+val+"ByIdSpec)\n";
    __swaggerAddEntrance__ += ".addPost("+val+"Api.create"+val+"Spec)\n";
    __swaggerAddEntrance__ += ".addPut("+val+"Api.update"+val+"Spec)\n";
    __swaggerAddEntrance__ += ".addDelete("+val+"Api.delete"+val+"Spec)\n";

    __swaggerPageShowEntrance__ += "swagger.configureDeclaration('"+val+"', {\n";
    __swaggerPageShowEntrance__ += spaces + " description: '"+val+"接口',\n";
    __swaggerPageShowEntrance__ += spaces + " authorizations: ['apiKey],\n";
    __swaggerPageShowEntrance__ += spaces + " protocols: ['http'],\n";
    __swaggerPageShowEntrance__ += spaces + " consumes: ['application/json'],\n";
    __swaggerPageShowEntrance__ += spaces + " produces: ['application/json']\n ";
    __swaggerPageShowEntrance__ +=  "});\n";

  });

  str['__apiEntrance__']  = __apiEntrance__;
  str['__swaggerAddEntrance__']  = __swaggerAddEntrance__;
  str['__swaggerPageShowEntrance__']  = __swaggerPageShowEntrance__;
  return str;
};
