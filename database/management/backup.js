#!/usr/bin/env node

'use strict';

var spawn = require('child_process').spawn;

var dbConst = require('./getDbConst.js');

spawn('pg_dump', ['-p', process.env.POSTGRES_PORT, '-h', dbConst.ADDR, '-U', dbConst.USER, '-w'], {stdio: 'inherit'});
