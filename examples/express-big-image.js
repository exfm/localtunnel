"use strict";

var express = require('express'),
    socketio = require('socket.io');

var app = module.exports = express.createServer(),
    io = socketio.listen(7002);

io.configure(function(){
  io.enable('browser client etag');
  io.set('log level', 1);
  io.set('transports', ['websocket', 'xhr-polling']);
});


app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/assets'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(3000, function(){
    console.log('Server listening on 3000');
});

module.exports = app;

var sockets = {};

module.exports.onChange = function(){
    Object.keys(sockets).forEach(function(socketId){
        var socket = sockets[socketId];
        socket.emit('reload', {});
    });
};

io.sockets.on('connection', function(socket){
    sockets[socket.id] = socket;
});

io.sockets.on('disconnect', function(socket){
    delete sockets[socket.id];
});

