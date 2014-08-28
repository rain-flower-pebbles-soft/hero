var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var colors = require('colors');
var _ = require('lodash');

module.exports = function (args, callback) {
  var config = hexo.config;
  var logger = hexo.log;
  var xsd = path.resolve(process.cwd(), 'xsd');
  fs.readdir(xsd, function (err, filenames) {
    filenames = filenames.map(function (filename) {
      return filename.split('.').slice(0, -1).join('.');
    });
    if (filenames.length == 0) {
      hexo.log.i('No xml schema defined. you should define and put it in xsd directory'.underline.red);
    } else {
      hexo.log.i('Generating json schema ...'.underline.red);
      for (var i = 0, len = filenames.length; i < len; i++) {
        translate(filenames[i]);
      }
    }
  });
};

function getWriteableStream(filename, finish_callback) {
  var stream = fs.createWriteStream(filename, {
    flags: 'w',
    encoding: 'utf8'
  });
  if (typeof finish_callback === 'function') {
    stream.on('finish', finish_callback);
  }
  return stream;
}

function translate(model) {
  hexo.log.i("base dir: " + hexo.base_dir);
  var xsd_path = path.join(hexo.base_dir, 'xsd', model + '.xsd');
  var json_schema_path = path.join(hexo.base_dir, 'json', model + '.json');
  var cli = path.join(hexo.core_dir, '.bin/lib/cli.pl')
  var command = "swipl --quiet --nodebug -g 'main,halt' -s " + cli + " -- < " + xsd_path;

  child_process.exec(command, function (err, stdout, stderr) {
    if (err) {
      hexo.log.i('Child process exited with error code', err.code);
      return;
    }
    try {
      var parsed_json = JSON.parse(stdout);
//      console.log(JSON.stringify(parsed_json.definitions, null, 4));
      var models = {};
      _.forIn(parsed_json.definitions, function (value, key) {
        var object = {};
        object['$schema'] = 'http://json-schema.org/draft-04/schema#';
        object['title'] = key;
        object['description'] = key;
        object['type'] = value.type;
        object['properties'] = value.properties;
        object['required'] = value.required;
        models[key] = object;
      });
      var json_models = JSON.stringify(models, null, 4);
      var output_stream = getWriteableStream(json_schema_path, function () {
        hexo.log.i('Json schema ' + model.blue + ' generated.')
      });
      output_stream.write(json_models + "\n");
      output_stream.end();
    } catch (err) {
      hexo.log.i('Generated json schema is not a valid json object'.underline.red);
    }
  });
}

//function capitalize(string) {
//  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//}
//function proccessing(json){
//  var models = [];
//  _.forIn(json.definitions, function(value,key){
//    models[key] = value;
//  });
//  return models;
//}
