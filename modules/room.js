'use strict';

var MAX_NUM_OF_PLAYERS = 2;

var Room = function(roomID) {
	this.playerConnections = [];
	this.roomID = roomID;
	this.completed = false;
};

Room.prototype.addPlayerConnection = function (connection) {
	var players = this.playerConnections.length,
		playerPosition = -1;


	if (players < MAX_NUM_OF_PLAYERS) {
		playerPosition = players;
		players = this.playerConnections.push(connection);
		console.log('NEW PLAYER IN ROOM', this.roomID, '. TOTAL: ', players);

		if (players < MAX_NUM_OF_PLAYERS) {
			this.sendMessageToAllExcept('NEW PLAYER IN ROOM', playerPosition);
		} else {
			this.completed = true;
			this.sendMessageToAll('ROOM COMPLETED');
		}
	}

	return playerPosition;
};

Room.prototype.reconectPlayer = function (playerIndex, connection) {
	this.playerConnections[playerIndex] = connection;

	this.sendMessageToAllExcept('PLAYER', playerIndex, 'RECONECTED', playerIndex);
};

Room.prototype.sendMessageToPlayer = function (message, player) {
	var conn = this.playerConnections[i];

	if (conn) {
		console.log('MENSSAGE SENT TO ', i, '>>>>', message);
		conn.send(message);
	}
};

Room.prototype.sendMessageToAll = function (message) {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		var conn = this.playerConnections[i];

		console.log('MENSSAGE SENT TO ', i, '>>>>', message);
		conn.send(message);
	}
};

Room.prototype.sendMessageToAllExcept = function (message, player) {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		if (i !== player) {
			var conn = this.playerConnections[i];

			console.log('MENSSAGE SENT TO ', i, '>>>>', message);
			conn.send(message);
		}
	}
};

Room.prototype.startListening = function() {
	for (var i = 0, len = this.playerConnections.length; i < len; i++) {
		var conn = this.playerConnections[i];
		
		conn.on('message', function(message) {
			var player = i;

			console.log('Message received at ROOM', message.utf8Data, 'from player', i);
		});
	}
};

module.exports = Room;