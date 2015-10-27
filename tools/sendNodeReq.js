'use strict';

var request = require('request');

module.exports = function (method, url, data){
    return new Promise(function(resolve, reject){

        var headers;

        if (data !== undefined && typeof data !== 'string' /* && !(data instanceof FormData)*/){
            headers = {'Content-Type': 'application/json;charset=UTF-8'};
            data = JSON.stringify(data);
        }

        switch(method){
            case 'GET':
                request.get({
                    url: url
                }, function(error, response, body){
                    if (!error) {
                        if(response.statusCode < 400)
                            resolve(JSON.parse(body));
                        else {
                            reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                        }
                    }
                    else {
                        reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                    }
                });
                break;

            case 'POST':
                request.post({
                    url: url,
                    headers: headers,
                    body: data
                }, function(error, response, body){
                    if (!error) {
                        if(response.statusCode < 400)
                            resolve(JSON.parse(body));
                        else {
                            reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                        }
                    }
                    else {
                        reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                    }    
                });
                break;

            case 'DELETE':
                request.del({
                    url: url
                }, function(error, response, body){
                    if (!error) {
                        if(response.statusCode < 400)
                            resolve(JSON.parse(body));
                        else {
                            reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                        }
                    }
                    else {
                        reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                    }
                });
                break;

            default :
                reject(new Error('HTTP request method unknown'));
                break;

        }
    });
};
