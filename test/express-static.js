var http = require('http');
var url = require('url');
var assert = require('assert');

var localtunnel_server = require('../').server();
var localtunnel_client = require('../').client;

var request = require('request');

var express = require('express');

var app = express();
app.use(express.static(__dirname + '/../examples/assets'));

// True: Use localtunnel.me
// False: Start localinstance of localtunnel server.
var use_remote_server = true;

function start_localtunnel_server(cb){
    if(use_remote_server){
        return cb('http://localtunnel.me');
    }
    localtunnel_server.listen(7000, function() {
        cb('http://localhost:7000');
    });
}

test('setup local http server', function(done) {
    start_localtunnel_server(function(host) {
        app.listen(7001, function(){
            var client = localtunnel_client.connect({
                host: host,
                port: 7001,
                'subdomain': 'test'
            });
            client.on('url', function(url) {
                console.log('got url from client: ', url);
                var opts = {'url': url + '/big-image.png', 'encoding': 'binary'};
                request.get(opts, function(err, res){
                    if(err) throw err;
                    console.log('Headers', res.headers);
                    console.log('Body Length', res.body.length);
                    assert(res.headers['content-length'] == res.body.length,
                        'Body should have same length as content length header');
                    done();
                });
            });

            client.on('error', function(err) {
                console.error(err);
                done(err);
            });
        });
    });
});