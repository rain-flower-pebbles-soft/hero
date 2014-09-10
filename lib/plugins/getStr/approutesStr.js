var _ = require('lodash');

module.exports.appStr = function(jsonObj){
  var spaces = '  ';
  var appVal = "";
  _.forEach(jsonObj,function(key,val){
    appVal += "var route_"+val+" = require('./api/"+val+"');\n";
    appVal += "app.get('/"+val+"/pages/:page', route_"+val+".index);\n";
    appVal += "app.resource('"+val+"', route_"+val+");\n";
  });
  return appVal;
};
