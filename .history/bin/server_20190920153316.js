#!/usr/bin/env node
'use strict';

var path = require("path";)
var createServer = require('../index.js');
var params = {
    port: 8000,
    dir: path.dirname(__filename)
};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['port', 'dir'].forEach(function(key) {
        if ( splited[0] === key ) {
            params[key] = splited[1];
        }
    });
});

createServer(Number(params.port), params.dir);