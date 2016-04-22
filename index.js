'use strict';

var SocketServer = require('websocket').server, 
    Http = require('http');

var Room = require('./modules/room');

var server = new SocketServer({
    httpServer: Http.createServer().listen(1337)
});

var activeRooms = [],
    currentRoom = undefined;


server.on('request', function(request) {
    var completed = false,
        newConnection = request.accept(null, request.origin);

    if (!currentRoom) {
        var roomID = (new Date()).getTime();

        currentRoom = new Room(roomID);
    }

    completed = currentRoom.addPlayerConnection(newConnection);

    if (completed) {
        activeRooms.push(completed);

        currentRoom = undefined;
    }
}); 