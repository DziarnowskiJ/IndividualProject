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

    // distribute cards to the player's deck
    socket.on('dealDeck', function (socketId) {
        for (let i = 0; i < 27; i++) {
            players[socketId].inDeck.push(fullDeck.shift());
        }
        console.log(players);

        if (Object.keys(players).length < 2) return

        io.emit('changeGameState', 'Initialising');
    })

    // distribute cards from player's deck to player's hand (6 cards)
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

    // card was played, it is messaged to other player and turn is changed
    socket.on('cardPlayed', function (cardName, socketId, dropZoneName) {
        io.emit('cardPlayed', cardName, socketId, dropZoneName);

        // print message to the server
        if (players[socketId].isPlayerA) {
            console.log("PlayerA played card: " + cardName);
        } else {
            console.log("PlayerB played card: " + cardName);
        }

        // remove played card from player's hand
        // and replace it with new cards from player's deck
        let oldCardIndex = players[socketId].inHand.indexOf(cardName);
        let newCardName = players[socketId].inDeck.shift();
        players[socketId].inHand[oldCardIndex] = newCardName;

        if (newCardName !== undefined) {
            io.emit('dealNewCard', socketId, newCardName, oldCardIndex);
        }

        // console.log(players);

        io.emit('changeTurn');
    })
})

http.listen(3000, function () {
    console.log("Server started!");
})