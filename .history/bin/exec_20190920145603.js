#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');
var url = 'http://localhost:8000/index.js';

execRemote(url);