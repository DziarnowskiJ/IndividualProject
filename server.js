const server = require('express')();
const http = require('http').createServer(server);
const shuffle = require('shuffle-array');
const cors = require('cors');

const formationHandler = require('./serverHelpers/FormationHandler');

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

let dropZones = {};
for (let i = 0; i < 9; i++) {
    dropZones["zone" + i] = {
        playerACards: [],
        playerBCards: []
    }
}

let markers = {};
for (let i = 0; i < 9; i++) {
    markers["marker" + i] = ""
}


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

        let currentDropZone = dropZones[dropZoneName];

        // print message to the server
        // keep track of cards in zones on server's side
        if (players[socketId].isPlayerA) {
            console.log("PlayerA played card: " + cardName);
            currentDropZone.playerACards.push(cardName);
        } else {
            console.log("PlayerB played card: " + cardName);
            currentDropZone.playerBCards.push(cardName);
        }

        console.log(dropZones);

        if (currentDropZone.playerACards.length === 3 &&
            currentDropZone.playerBCards.length === 3) {
            let isAWinner = formationHandler.determinWinningFormation(
                formationHandler.determineFormation(currentDropZone.playerACards),
                formationHandler.determineFormation(currentDropZone.playerBCards)
            );

            if ((players[socketId].isPlayerA && isAWinner) ||
                (!players[socketId].isPlayerA && !isAWinner)) {
                io.emit('claimMarker', socketId, "marker" + dropZoneName.charAt(4), "won")
            } else {
                io.emit('claimMarker', socketId, "marker" + dropZoneName.charAt(4), "lost")
            }
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

    // TODO: check if this is needed 
    // socket.on('claimMarker', function (socketId, markerId, outcome) {
    //     if ((players[socketId].isPlayerA && outcome === "won") ||
    //         ((players[socketId].isPlayerB && outcome === "lost"))) {
    //         markers[markerId] = "A"
    //     } else {
    //         markers[markerId] = "B"
    //     }
    //     console.log(markers);
    //     io.emit('claimMarker', socketId, markerId, outcome);
    // })
})

http.listen(3000, function () {
    console.log("Server started!");
})