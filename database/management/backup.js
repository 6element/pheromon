#!/usr/bin/env node

'use strict';

var spawn = require('child_process').spawn;
var parse = require('url').parse;
var url = parse(process.env.DATABASE_URL);

spawn('pg_dump', ['-p', url.port, '-h', url.hostname, '-U', url.auth.username, '-w'], {stdio: 'inherit'});
