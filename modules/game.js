var Game = function(room) {
	this.name = 'Example';
	this.room = room;
	this.room.onmessage = this.onMessage.bind(this);
};

// Shared property
Game.NUM_OF_PLAYERS = 2;

Game.prototype.start = function() {
	var message = {
			type: Game.messages.outgoing.GAME_STARTS,
			payload: 'START!'
		};

	this.room.startListening();

	this.room.sendMessageToAll(message);
};

Game.prototype.onMessage = function(message) {
	consolo.log(message.type);
	}
};

module.exports = Game;
