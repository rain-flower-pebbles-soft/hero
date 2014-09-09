var swaggerize = require('swaggerize');
var fs = require('fs');
var db = require('../../models');
//var lib = require('../../modules/common/lib');
var url = require("url");
var swagger = require('swagger-node-express');
var cors = require('cors');
var messages = require('../../config/messages');
var settings = require('../../config/settings');


module.exports.init = function (app) {
  // 扩展错误消息
  swagger.errors.InvalidInput = function (field, res) {
    if (!res) {
      return {
        "code": 405,
        "message": field + ' 无效输入'
      };
    } else {
      res.send({
        "code": 405,
        "message": field + ' 无效输入'
      }, 405);
    }
  };
  // 501 Not Implemented
  swagger.errors.NotImplemented = function (field, res) {

  };
  // 403 Forbidden
  swagger.errors.Forbidden = function (field, res) {

  };
  // 304 Not Modified
  // 对比客户端提交的JSON对象和数据库查询出来的JSON对象,如果相同返回 304
  //
  swagger.errors.NotModified = function () {

  };
  // 模型扩展定义
  //TODO 暂时不知道是用来干什么的,先不写

  var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
      if (origin === undefined) {
        callback(null, false);
      } else {
        // change wordnik.com to your allowed domain.
        var match2 = origin.match("^(.*)?localhost(\:[0-9]+)?");
        var allowed = (match2 !== null && match2.length > 0);
        callback(null, allowed);
      }
    }
  };
  app.use(cors(corsOptions));

  swagger.setApiInfo({
    'title':'my project API服务接口(alpha)',
    'description':'',
    'termsOfServiceUrl':'',
    'contact':'',
    'license':'Apache 2.0',
    'licenseUrl':'http://www.apache.org/licenses/LICENSE-2.0.html'
  });

  //api 入口程序

  /**
   * ex:var useApi  = require('./operations/user');
   */

  __apiEntrance__;

  swagger.setAppHandler(app);

  //swagger 加载api入口程序
  /**
   * ex: 基本的增删改查
   * swagger.addGet(userApi.getUserByIdSpec)
   *        .addPost(userApi.createUserSpec)
   *        .addPut(userApi.updateUserSpec)
   *        .addDelete(userApi.deleteUserSpec)
   */
 __swaggerAddEntrance__;

  swagger.setHeaders = function (res) {
    res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
    res.header("Content-Type", "application/json; charset=utf-8");
  };


  //swagger 页面显示信息
  /**
   * ex:
   * swagger.configureDeclaration('users', {
        description: '用户接口',
        authorizations: ["apiKey"],
        protocols: ["http"],
        consumes: ['application/json'],
        produces: ['application/json']
    });
   */
  __swaggerPageShowEntrance__;

  // API 路径
  swagger.configureSwaggerPaths("", "/docs", "");

  swagger.configure("http://"+settings.express.host+":"+settings.express.port, "1.0");
};
