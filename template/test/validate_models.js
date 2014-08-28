var tv4 = require('tv4');
var _ = require('lodash');

var data = require('../json/data.json');
var schema = require('../json/models.json');
var validate = tv4.validate(data, schema.User);

if (!validate) {
  console.log(tv4.error);
} else {
  console.log('ok')
}
var schema_v4 = require('../meta-schema-04.json')

var schema_validation_results = [];
_.forIn(schema, function (value, key) {
  schema_validation_results.push(tv4.validate(schema[key], schema_v4));
});

console.log(schema_validation_results);

if (_.every(schema_validation_results)) {
  console.log('TRUE');
} else {
  console.log('TRUE');
}