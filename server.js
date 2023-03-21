// import DropZoneHandler from './serverHelpers/DropZoneHandler';

const server = require('express')();
const http = require('http').createServer(server);
const shuffle = require('shuffle-array');
const cors = require('cors');

const formationHandler = require('./serverHelpers/FormationHandler');
const dropZoneHandler = require('./serverHelpers/DropZoneHandler');

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
// shuffle the deck
// shuffle(fullDeck);

let dropZones = {};
for (let i = 0; i < 9; i++) {
    dropZones["zone" + i] = {
        playerACards: [],
        playerBCards: [],
        firstFinishedA: undefined,
        claimed: undefined
    }
}

let cardsPlayed = [];

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

io.on('connection', function (socket) {
    // NOTE: server console log
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
        // NOTE: server console log
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
        // NOTE: server console log
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

        cardsPlayed.push(cardName);

        let currentDropZone = dropZones[dropZoneName];

        // print message to the server
        // keep track of cards in zones on server's side
        if (players[socketId].isPlayerA) {
            // NOTE: server console log
            console.log("PlayerA played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerACards.push(cardName);

            if (currentDropZone.playerACards.length === 3 &&
                currentDropZone.playerBCards.length < 3) {
                currentDropZone.firstFinishedA = true;
            }

        } else {
            // NOTE: server console log
            console.log("PlayerB played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerBCards.push(cardName);

            if (currentDropZone.playerACards.length < 3 &&
                currentDropZone.playerBCards.length === 3) {
                currentDropZone.firstFinishedA = false;
            }

        }

        let claimedByA = 0;
        let claimedByB = 0;

        let adjacentThreeA = 0;
        let adjacentThreeB = 0;

        for (let i in dropZones) {

            let outcome = dropZoneHandler.checkZone(dropZones[i], cardsPlayed);

            if (outcome.winner !== undefined) {
                // NOTE: server console log
                console.log("\n" + outcome.textA);
                // NOTE: server console log
                console.log(outcome.textB);
                if ((players[socketId].isPlayerA && outcome.winner === "A") ||
                    (!players[socketId].isPlayerA && outcome.winner === "B")) {
                    io.emit('claimMarker', socketId, "marker" + i.charAt(4), "won")
                } else {
                    io.emit('claimMarker', socketId, "marker" + i.charAt(4), "lost")
                }

                // NOTE: server console log
                console.log(i + " claimed by player" + outcome.winner + " \n");
                dropZones[i].claimed = outcome.winner;
            }

            if (dropZones[i].claimed === "A") {
                claimedByA++;
                adjacentThreeA++;
                adjacentThreeB = 0;
            } else if (dropZones[i].claimed === "B") {
                claimedByB++;
                adjacentThreeB++;
                adjacentThreeA = 0;
            } else if (dropZones[i].claimed === undefined) {
                adjacentThreeA = 0;
                adjacentThreeB = 0;
            }

            if (claimedByA === 5 || adjacentThreeA === 3) {
                // NOTE: server console log
                console.log("playerA won the game");
                io.emit('changeGameState', 'Over');
                io.emit('gameOver', socketId, players[socketId].isPlayerA)
                break;
            } else if (claimedByB === 5 || adjacentThreeB === 3) {
                // NOTE: server console log
                console.log("playerB won the game");
                io.emit('changeGameState', 'Over');
                io.emit('gameOver', socketId, !players[socketId].isPlayerA)
                break;
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

        io.emit('changeTurn');
    })
})

http.listen(3000, function () {
    // NOTE: server console log
    console.log("Server started!");
})