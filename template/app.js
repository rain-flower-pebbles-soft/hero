var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var settings = require('./config/settings');
var resource = require('express-resource');
var namespace = require('express-namespace');
var db = require('./models');
var swaggerize = require('./models/swagger/swaggerize');
var request = require('request');

var app = express();
var app_api = express();

global.app = app;

app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 80);
app.set('view engine', 'html');

app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.logger('short'));
app.use(express.json());
app.use(express.urlencoded());

//api doc
app.use('/v1', app_api);
swaggerize.init(app_api);

app.use(express.methodOverride());
app.use(express.cookieParser('(@*#*SJL9820101!@@#__+!)@I'));
app.use(express.cookieSession());

app.use(express.session({
  secret: "(@*#*SJL9820101!@@#__+!)@I",
  cookie: {
    httpOnly: true
  }
}));
//file upload
app.use(express.bodyParser({
  uploadDir: './uploads',
  limit: '1024mb'
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
//前端页面
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(__dirname));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//添加路由
/*
ex:
 var route_device = require('./api/device');
 app.get('/devices/pages/:page', route_device.index);//分页
 app.resource('devices', route_device);//基本的RESTful框架
 */

__appRoute__;

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
