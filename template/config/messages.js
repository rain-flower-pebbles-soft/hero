var httpstatus = require('http-status');

module.exports = {
  E2000: {
    code: 2000,
    message: "您的盒子已经成功激活,现在可以使用了."
  },
  E404: {
    code: 404,
    message: "对象不存在"
  },
  E4001: {
    code: 40001,
    message: "设备已激活过了"
  },
  E9001: {
    code: 9001,
    message: "无效的ID"
  },
  E9002: {
    code: 9002,
    message: "无效的设备序列号"
  },
  E5000: "网络连接错误",

  InvalidIndentifier: function (object, res) {
    var message = {
      code: 9001,
      message: '无效的' + object + 'ID,必须为大于0的整数'
    };
    if (!res) {
      return message;
    } else {
      res.json(404, message);
    }
  },
  Invalid: function (object, res) {
    var message = {
      code: 400,
      message: '无效的' + object
    };
    if (!res) {
      return message;
    } else {
      res.json(400,message);
    }
  },
  ListIsEmpty: function (object, res) {
    var message = {
      code: 404,
      message: object + '列表为空'
    };
    if (!res) {
      return message;
    } else {
      res.json(404, message);
    }
  },
  NotFound: function (object, res) {
    var message = {
      code: 404,
      message: object + '不存在'
    };
    if (!res) {
      return message;
    } else {
      res.json(404, message);
    }
  },
  OK: function (res) {
    var message = {
      code: 200,
      message: 'OK'
    };
    if (!res) {
      return message;
    } else {
      res.send(message, 200);
    }
  },
  Created: function(res){
    var message = {
      code: 201,
      message: 'Created'
    };
    if(!res){
      return message;
    }else{
      res.json(201, message);
    }
  },
  /**
   *
   * @param model 模型
   * @param res
   * @returns {{code: number, message: string, responseModel: *}}
   * @constructor
   */
  OK_RESPONSE: function (model, res) {
    var message = {
      code: 200,
      message: 'OK',
      responseModel: model
    };
    if (!res) {
      return message;
    } else {
      res.send(message, 200);
    }
  },
  EXISTS: function (object, res) {
    var message = {
      code: 400,
      message: object + '已存在'
    };
    if (!res) {
      return message;
    } else {
      res.send(message, 400);
    }
  }
};
