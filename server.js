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
// shuffle the deck
// shuffle(fullDeck);

let dropZones = {};
for (let i = 0; i < 9; i++) {
    dropZones["zone" + i] = {
        playerACards: [],
        playerBCards: [],
        firstFinishedA: undefined,
        claimed: false
    }
}

let markers = {};
for (let i = 0; i < 9; i++) {
    markers["marker" + i] = ""
}

let cardsPlayed = [];


const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

io.on('connection', function (socket) {
    console.log('User connected: ' + socket.id);

    // FORMATION TESTING
    // forms3 = [
    //     // straight flush
    //     ["A1", "A2", "A3"],
    //     ["A3", "A2", "A1"],
    //     ["A3", "A1", "A2"],
    //     // triple
    //     ["A4", "B4", "C4"],
    //     ["A9", "F9", "C9"],
    //     // color
    //     ["A1", "A3", "A4"],
    //     ["B2", "D2", "E2"],
    //     // straight
    //     ["A1", "B2", "C3"],
    //     ["F6", "A4", "B5"],
    //     // random
    //     ["A1", "F8", "C2"]
    // ]

    // for (let i in forms) {
    //     console.log(forms3[i], formationHandler.determineFormation(forms3[i]))
    // }

    // forms2 = [
    //     // straight flush
    //     ["A1", "A2"],
    //     ["A3", "A2"],
    //     ["A3", "A1"],
    //     // triple
    //     ["A4", "B4"],
    //     ["A9", "F9"],
    //     // color
    //     ["A1", "A3"],
    //     ["B2", "B8"],
    //     // straight
    //     ["A1", "B2"],
    //     ["F6", "A4"],
    //     // random
    //     ["A1", "F8"],
    //     ["B3", "C9"],
    //     ["F6", "A2"]
    // ]

    // for (let i in forms2) {
    //     console.log(forms2[i], formationHandler.isBeatable(["F7", "A2", "A9"], forms2[i], ['C8',
    //         'B7',
    //         'D8',
    //         'C6',
    //         'A8',
    //         'C1',
    //         'B1',
    //         'D9',
    //         'C9',
    //         'F4',
    //         'E2',
    //         'A3',
    //         'E4',
    //         'F5',
    //         'E5',
    //         'C3',
    //         'E7',
    //         'C7',
    //         'E6',
    //         'D7',
    //         'A7',
    //         'D5',
    //         'B3',
    //         'F3',
    //         'C4',
    //         'B9',
    //         'F7']));
    // }

    // forms1 = [
    //     // straight flush
    //     ["A1"],
    //     ["A3"],
    //     ["A3"],
    //     // triple
    //     ["A4"],
    //     ["A9"],
    //     // color
    //     ["A1"],
    //     ["B2"],
    //     // straight
    //     ["A1"],
    //     ["F6"],
    //     // random
    //     ["A1"],
    //     ["B3"],
    //     ["F6"]
    // ]

    // for (let i in forms1) {
    //     console.log(forms1[i], formationHandler.isBeatable(["F7", "A2", "A9"], forms1[i], ['C8',
    //         'B7',
    //         'D8',
    //         'C6',
    //         'A8',
    //         'C1',
    //         'B1',
    //         'D9',
    //         'C9',
    //         'F4',
    //         'E2',
    //         'A3',
    //         'E4',
    //         'F5',
    //         'E5',
    //         'C3',
    //         'E7',
    //         'C7',
    //         'E6',
    //         'D7',
    //         'A7',
    //         'D5',
    //         'B3',
    //         'F3',
    //         'C4',
    //         'B9',
    //         'F7']));
    // }

    // console.log(formationHandler.isBeatable(["F7", "A2", "A9"], [], ['C8',
    //     'B7',
    //     'D8',
    //     'C6',
    //     'A8',
    //     'C1',
    //     'B1',
    //     'D9',
    //     'C9',
    //     'F4',
    //     'E2',
    //     'A3',
    //     'E4',
    //     'F5',
    //     'E5',
    //     'C3',
    //     'E7',
    //     'C7',
    //     'E6',
    //     'D7',
    //     'A7',
    //     'D5',
    //     'B3',
    //     'F3',
    //     'C4',
    //     'B9',
    //     'F7']));

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

        cardsPlayed.push(cardName);

        let currentDropZone = dropZones[dropZoneName];

        // print message to the server
        // keep track of cards in zones on server's side
        if (players[socketId].isPlayerA) {
            console.log("PlayerA played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerACards.push(cardName);

            if (currentDropZone.playerACards.length === 3 &&
                currentDropZone.playerBCards.length < 3) {
                currentDropZone.firstFinishedA = true;
            }

        } else {
            console.log("PlayerB played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerBCards.push(cardName);

            if (currentDropZone.playerACards.length < 3 &&
                currentDropZone.playerBCards.length === 3) {
                currentDropZone.firstFinishedA = false;
            }

        }

        // console.log(dropZones);

        for (let i in dropZones) {
            // console.log(i);
            // console.log(dropZones[i]);
            if (!dropZones[i].claimed && dropZones[i].firstFinishedA !== undefined) {

                let formationA;
                let formationB;

                let cardsA = dropZones[i].playerACards;
                let cardsB = dropZones[i].playerBCards;

                // Both players finished
                if (cardsA.length === 3 &&
                    cardsB.length === 3) {

                    formationA = formationHandler.determineFormation(cardsA);
                    formationB = formationHandler.determineFormation(cardsB);

                    if (dropZones[i].firstFinishedA) {
                        formationA.sum += 0.5;
                    } else {
                        formationB.sum += 0.5;
                    }

                    let isAWinner = formationHandler.determinWinningFormation(
                        formationA,
                        formationB
                    );

                    if ((players[socketId].isPlayerA && isAWinner) ||
                        (!players[socketId].isPlayerA && !isAWinner)) {
                        io.emit('claimMarker', socketId, "marker" + i.charAt(4), "won")
                        console.log(i + " claimed by playerA\n")
                    } else {
                        io.emit('claimMarker', socketId, "marker" + i.charAt(4), "lost")
                        console.log(i + " claimed by playerB\n")
                    }

                    console.log("\n" + "playerA's formation = " + cardsA + "\n" +
                        "playerB's formation = " + cardsB);

                    dropZones[i].claimed = true;
                }
                // A finished, B did NOT
                else if (cardsA.length === 3 &&
                    cardsB.length < 3) {

                    formationA = formationHandler.determineFormation(cardsA);
                    formationB = formationHandler.predictFormation(cardsB, cardsPlayed);

                    formationA.sum += 0.5;

                    let willAWin = formationHandler.determinWinningFormation(
                        formationA,
                        formationB
                    )

                    if (willAWin) {
                        console.log("\n" + "playerA's formation = " + formationA.cards + "\n" +
                        "playerB's strongest possible formation = " + formationB.cards);

                        if ((players[socketId].isPlayerA && willAWin) ||
                            (!players[socketId].isPlayerA && !willAWin)) {
                            io.emit('claimMarker', socketId, "marker" + i.charAt(4), "won");
                            console.log(i + " claimed by playerA\n")
                        } else {
                            io.emit('claimMarker', socketId, "marker" + i.charAt(4), "lost")
                            console.log(i + " claimed by playerB\n")
                        }

                        dropZones[i].claimed = true;
                    }

                }
                // B finished, A did NOT
                else if (cardsA.length < 3 &&
                    cardsB.length === 3) {

                    formationA = formationHandler.predictFormation(cardsA, cardsPlayed);
                    formationB = formationHandler.determineFormation(cardsB);

                    formationB.sum += 0.5;

                    let willBWin = formationHandler.determinWinningFormation(
                        formationB,
                        formationA
                    )

                    if (willBWin) {
                        console.log("\n" + "playerA's strongest possible formation = " + formationA.cards + "\n" +
                        "playerB's formation = " + formationB.cards);

                        if ((!players[socketId].isPlayerA && willBWin) ||
                            (players[socketId].isPlayerA && !willBWin)) {
                            io.emit('claimMarker', socketId, "marker" + i.charAt(4), "won")
                            console.log(i + " claimed by playerA\n")
                        } else {
                            io.emit('claimMarker', socketId, "marker" + i.charAt(4), "lost")
                            console.log(i + " claimed by playerB\n")
                        }

                        dropZones[i].claimed = true;
                    }
                }
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