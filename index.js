'use strict';

var SocketServer = require('websocket').server, 
    Http = require('http');

var Room = require('./modules/room');

var server = new SocketServer({
    httpServer: Http.createServer().listen(1337)
});

var activeRooms = {},
    currentRoom = undefined;

var MESSAGE_TYPES = {
    'roomRequest': 'roomRequest',
    'roomResponse': 'roomResponse',
}


server.on('request', function(request) {
    var completed = false,
        connection = request.accept(null, request.origin);

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var parsed = JSON.parse(message.utf8Data);

                if (parsed.type === MESSAGE_TYPES.roomRequest) {
                    if (parsed.roomID && parsed.playerIndex) {
                        // Reconnect player
                        var room = activeRooms[parsed.roomID];

                        room.reconectPlayer(parsed.playerIndex);
                    } else {
                        // New player
                        if (!currentRoom) {
                            // New room
                            var roomID = 'room' + ((new Date()).getTime()).toString();

                            currentRoom = new Room(roomID);
                            console.log('Room added:', roomID);
                        }

                        // Add player to room
                        var playerIndex = currentRoom.addPlayerConnection(connection);

                        // Notify to client
                        var response = {
                            type: MESSAGE_TYPES.roomResponse,
                            roomID: currentRoom.roomID,
                            playerIndex: playerIndex
                        }

                        connection.send(JSON.stringify(response));

                        if (currentRoom.completed) {
                            activeRooms[currentRoom.roomID] = currentRoom;

                            currentRoom = undefined;
                        }
                    }
                }

                console.log('Received Message: ' + message.utf8Data);
            }
        });


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    
}); 