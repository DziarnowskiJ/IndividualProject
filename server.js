const server = require('express')();
const http = require('http').createServer(server);
const shuffle = require('shuffle-array');
const cors = require('cors');

let players = {};
let readyCheck = 0;
let gameState = 'Initialising';

// create deck full of cards
let fullDeck = [];
let domains = ["A", "B", "C", "D", "E", "F"];
for (let i = 0; i < domains.length; i++) {
    for (let j = 1; j <= 9; j++) {
        fullDeck.push(domains[i] + j);
    }
}
// shiffle the deck
shuffle(fullDeck);


const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

io.on('connection', function (socket) {
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

    // distribute cards to the player
    socket.on('dealDeck', function (socketId) {
        for (let i = 0; i < 27; i++) {
            players[socketId].inDeck.push(fullDeck.shift());
        }
        console.log(players);

        if (Object.keys(players) < 2) return;

        io.emit('changeGameState', 'Initialising');
    })

    socket.on('dealCards', function (socketId) {
        for (let i = 0; i < 6; i++) {          
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

    socket.on('cardPlayed', function (cardName, socketId, dropZoneName) {
        io.emit('cardPlayed', cardName, socketId, dropZoneName);
        io.emit('changeTurn');
    })
})

http.listen(3000, function () {
    console.log("Server started!");
})