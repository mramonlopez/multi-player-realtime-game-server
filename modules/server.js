var SocketServer = require('websocket').server, 
    Http = require('http'),
    Room = require('./room');

var Server = function(socket, Game) {
	this.activeGames = {},
    this.currentRoom = undefined;
    this.socket = socket;
    this.Game = Game || function() {};

    console.log('>>>>>>>>', Game)
};

Server.prototype.start = function() {
	var http = Http.createServer().listen(this.socket);

	this.server = new SocketServer({httpServer:  http});
	this.server.on('request', this.onRequest.bind(this));
};

Server.prototype.onRequest = function(request) {
	var completed = false,
        connection = request.accept(null, request.origin),
        onMessage = function(message) {
		    if (message.type === 'utf8') {
		        var parsed = JSON.parse(message.utf8Data);

		        if (parsed.type === Room.messages.ROOM_REQUEST) {
		            if (parsed.roomID && parsed.playerIndex) {
		                // Reconnect player
		                var room = this.activeGames[parsed.roomID].room;

		                room.reconectPlayer(parsed.playerIndex);
		            } else {
		                // New player
		                if (!this.currentRoom) {
		                    // New room
		                    var roomID = 'room' + ((new Date()).getTime()).toString();

		                    this.currentRoom = new Room(roomID, this.Game.NUM_OF_PLAYERS);
		                    console.log('Room added:', roomID);
		                }

		                // Add player to room
		                var playerIndex = this.currentRoom.addPlayerConnection(connection);

		                if (this.currentRoom.completed) {
		                	var game = new this.Game(this.currentRoom);

		                    this.activeGames[this.currentRoom.roomID] = game;
		                    game.start();

		                    this.currentRoom = undefined;
		                }
		            }
		        }
		    }
		};

    connection.once('message', onMessage.bind(this));
};

module.exports = Server;