'use strict';

var Room = function(roomID, NUM_OF_PLAYERS) {
	this.playerConnections = [];
	this.roomID = roomID;
	this.NUM_OF_PLAYERS = NUM_OF_PLAYERS;
	this.completed = false;
	this.onmessage = function() {};
};

Room.messages = {
	ROOM_REQUEST: 'ROOM_REQUEST',
	ROOM_RESPONSE: 'ROOM_RESPONSE'
};

Room.prototype.addPlayerConnection = function (connection) {
	var players = this.playerConnections.length,
		playerPosition = -1;

	if (players < this.NUM_OF_PLAYERS) {
		playerPosition = players;
		players = this.playerConnections.push(connection);
		console.log('NEW PLAYER IN ROOM', this.roomID, '. TOTAL: ', players);

		// Notify to client
        var response = {
            type: Room.messages.ROOM_RESPONSE,
            payload: {
                roomID: this.roomID,
            	playerIndex: playerPosition	                    	
            }
        }

        this.sendMessageToPlayer(response, playerPosition);

        console.log('><>>>', players, this.NUM_OF_PLAYERS);
		if (players >= this.NUM_OF_PLAYERS) {
			this.completed = true;
		}
	}

	return playerPosition;
};

Room.prototype.reconectPlayer = function (playerIndex, connection) {
	this.playerConnections[playerIndex] = connection;

	this.sendMessageToAllExcept('PLAYER', playerIndex, 'RECONECTED', playerIndex);
};

Room.prototype.sendMessageToPlayer = function (message, player) {
	var conn = this.playerConnections[player];

	if (conn) {
		console.log('MENSSAGE SENT TO ', player, '>>>>', message);
		conn.send(JSON.stringify(message));
	}
};

Room.prototype.sendMessageToAll = function (message) {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		var conn = this.playerConnections[i];

		console.log('MENSSAGE SENT TO ', i, '>>>>', message);
		conn.send(JSON.stringify(message));
	}
};

Room.prototype.sendMessageToAllExcept = function (message, player) {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		if (i !== player) {
			var conn = this.playerConnections[i];

			console.log('MENSSAGE SENT TO ', i, '>>>>', message);
			conn.send(JSON.stringify(message));
		}
	}
};

Room.prototype.startListening = function() {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		var conn = this.playerConnections[i];
		
		conn.on('message', function(msg) {
			var player = i;

			if (msg.type === 'utf8') {
		        var message = JSON.parse(msg.utf8Data);

		        this.onmessage(player, message);
		    }

			console.log('Message received at ROOM', message.utf8Data, 'from player', i);
		});
	}
};

module.exports = Room;