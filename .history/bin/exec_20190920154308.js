#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');

var params = {
    url: ""
};
var processArgv = process.argv;
if ( processArgv[2] ) {
    execRemote(processArgv[2])
}
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    if ( splited[0] === 'url' ) {
        params[key] = splited[1];
        execRemote(splited[1]);
    }
});