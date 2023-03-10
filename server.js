const server = require('express')();
const http = require('http').createServer(server);
const shuffle = require('shuffle-array');
const cors = require('cors');

let players = {};
let readyCheck = 0;
let gameState = 'Initialising';

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    console.log('User connected: ' + socket.id);

    players[socket.id] = {
        inDeck: [],
        inHand: [],
        isPlayerA: false
    }

    if (Object.keys(players).length < 2) {
        players[socket.id].isPlayerA = true;
        io.emit('firstTurn');
    }

    socket.on('dealDeck', function (socketId) {
        // TODO: add more cards here
        players[socketId].inDeck = shuffle(["bool", "ping"])
        console.log(players);

        if (Object.keys(players) < 2) return;
        
        io.emit('changeGameState', 'Initialising');
    })

    socket.on('dealCards', function(socketId) {
        for (let i = 0; i < 6; i++) {
            // happens if player runs out of cards in his deck
            if (players[socketId].inDeck.length == 0) {
                players[socketId].inDeck = shuffle(["bool", "ping"])
            }
            // take card from the players deck and add it to his hand
            players[socketId].inHand.push(players[socketId].inDeck.shift());
        }
        console.log(players);

        io.emit('dealCards', socketId, players[socketId].inHand);
        readyCheck++;
        if (readyCheck >= 2) {
            gameState = 'Ready';
            io.emit('changeGameState', 'Ready');
        }
    });

    socket.on('cardPlayed', function(cardName, socketId) {
        io.emit('cardPlayed', cardName, socketId);
        io.emit('changeTurn');
    })
})

http.listen(3000, function() {
    console.log("Server started!");
})