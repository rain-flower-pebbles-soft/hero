#!/usr/bin/env node

var args = require('minimist')(process.argv.slice(2));
var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var init = require('../lib/init');
var cwd = process.cwd();
var lastCwd = cwd;

async.doUntil(
    function (next) {
        // 配置文件
        var configFile = path.join(cwd, 'config.yml');

        fs.exists(configFile, function (exist) {
            if (exist) {
                // 初始化
                init(cwd, args);
            } else {
                lastCwd = cwd;
                cwd = path.dirname(cwd);
                next();
            }
        });
    },
    function () {
        return cwd === lastCwd;
    },
    function () {
        init(process.cwd(), args);
    }
);