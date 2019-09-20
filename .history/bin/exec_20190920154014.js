#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');

var params = {
    url: ""
};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['url'].forEach(function(key) {
        if ( splited[0] === key ) {
            params[key] = splited[1];
        }
    });
});
execRemote(process.argv[2]);