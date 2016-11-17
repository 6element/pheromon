'use strict';

var mosca = require('mosca');

var debug = require('../tools/debug');
var parse = require('url').parse;

var redisUrl = parse(process.env.REDIS_URL);
var redisSettings = {
  host: redisUrl.hostname,
  port: redisUrl.port,
  db: redisUrl.pathname.slice(1) || 0,
  password: (redisUrl.auth || {}).password
};

var pubsubsettings = Object.assign({
    type: 'redis',
    redis: require('redis'),
    return_buffers: true
}, redisSettings);

var moscaSettings = {
    port: parseInt(parse(process.env.BROKER_URL).port, 10),
    backend: pubsubsettings,
    persistence: Object.assign({
        factory: mosca.persistence.Redis
    }, redisSettings)
};

module.exports = function(authToken){

    return new Promise(function(resolve, reject){

        var server = new mosca.Server(moscaSettings);

        server.on('clientConnected', function(client) {
            debug('Client', client.id, 'connected');
        });

        server.on('clientDisconnected', function(client) {
            debug('Client', client.id, 'disconnected');
        });

        server.on('published', function(packet, client) {
            if (!client)
                client = {id: 'broker'};
            debug('Client', client.id);
            debug('published', packet.topic);
        });

        server.on('delivered', function(packet, client) {
            if (!client)
                client = {id: 'broker'};
            debug('Client', client.id);
            debug('received', packet.topic);
        });

        server.on('subscribed', function(topic, client) {
            debug('Client', client.id, 'subscribed to', topic);
        });

        server.on('unsubscribed', function(topic, client) {
            debug('Client', client.id, 'unsubscribed to', topic);
        });

        server.on('ready', function(){
            server.authenticate = function (client, username, token, callback) {
                var authorized;
                try {
                    authorized = (token.toString() === authToken);
                }
                catch(err) {
                    console.log('Error in broker authenticator:', err);
                    authorized = false;
                    callback(err);
                }

                if (authorized)
                    callback(null, authorized);
            };
            resolve(server);
        });

        setTimeout(function(){
            reject('error: couldn\'t spawn mqttServer');
        }, 3000);

    });
};
