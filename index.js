'use strict';

var SOCKET = 1337;

var Server = require('./modules/server');
var Game = require('./modules/game');

var server = new Server(SOCKET, Game);
server.start();
