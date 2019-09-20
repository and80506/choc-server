#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');

var processArgv = process.argv;
if ( processArgv[2] ) {
    execRemote(processArgv[2].replace('url=', ''));
} else {
    console.error('Got error:  url not exist.')
}