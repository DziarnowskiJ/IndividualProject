const server = require('express')();
const http = require('http').createServer(server);
const shuffle = require('shuffle-array');
const cors = require('cors');

// TODO: uncomment for deployment
// const path = require('path');
// const serveStatic = require("serve-static");

const Room = require('./serverHelpers/Room');

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

// TODO: uncomment for deployment
// server.use(cors());
// server.use(serveStatic(__dirname + "/client/dist"));

let players = {};
let rooms = {};




io.on('connection', function (socket) {
    // NOTE: server console log
    console.log('User connected: ' + socket.id);

    // keep reference of all players
    players[socket.id] = {
        isPlayerA: true,
        roomCode: null
    }

    socket.on("disconnect", () => {
        console.log("DISCONNECTED " + socket.id);
    })

    socket.on('join-room', (roomCode) => {
        // create new room if it does not exist
        if (!rooms[roomCode])
            rooms[roomCode] = new Room(roomCode);

        // check if the room is not full
        // if it is not full, player is added to the room
        // otherwise receives info that room is full
        if (!rooms[roomCode].addPlayer(socket.id)) {
            io.to(socket.id).emit("roomFull");
            return;
        }

        // add player socket channel and keep reference in which room the player is
        socket.join(roomCode);
        players[socket.id].roomCode = roomCode;
        players[socket.id].isPlayerA = getPlayer(socket.id).isPlayerA;

        // NOTE: server console log
        console.log("User ", socket.id, "joined room: ", roomCode);

        // if both players joined the room
        if (rooms[roomCode].readyCheck === 2) {

            console.log(players);

            io.sockets.in(roomCode).emit('changeGameState', 'Initialising');
            io.sockets.in(roomCode).emit('firstTurn', socket.id);
        }
    })

    // distribute cards from player's deck to player's hand (6 cards)
    socket.on('dealCards', function (socketId) {
        let currentRoom = getRoomId(socketId);

        let { inHand, inDeck } = getPlayer(socketId).dealCards();

        io.sockets.in(currentRoom).emit('dealCards', socketId, inHand, inDeck);

        rooms[currentRoom].readyCheck++;

        if (rooms[currentRoom].readyCheck === 4) {
            gameState = 'Ready';
            io.sockets.in(currentRoom).emit('changeGameState', 'Ready');
        }
    });

    // card was played, it is messaged to other player and turn is changed
    socket.on('cardPlayed', function (cardName, socketId, dropZoneName) {
        let currentRoom = getRoomId(socketId);

        // let other player know that the card was played
        io.sockets.in(currentRoom).emit('cardPlayed', cardName, socketId, dropZoneName);

        // update zone in player's room
        rooms[currentRoom].cardPlayed(cardName, dropZoneName, getPlayer(socketId).isPlayerA);

        // check if any zone can be claimed
        let claimedZones = rooms[currentRoom].checkZones();
        for (let i in claimedZones) {

            // NOTE: server console log
            console.log("player" + claimedZones[i] + "claimed marker" + i.charAt(4));

            if ((players[socketId].isPlayerA && claimedZones[i] === "A") ||
                (!players[socketId].isPlayerA && claimedZones[i] === "B")) {
                io.sockets.in(currentRoom).emit('claimMarker', socketId, "marker" + i.charAt(4), "won");
            } else {
                io.sockets.in(currentRoom).emit('claimMarker', socketId, "marker" + i.charAt(4), "lost");
            }

        }

        // remove played card from player's hand
        // and replace it with new cards from player's deck
        let oldCardIndex = getPlayer(socketId).inHand.indexOf(cardName);
        let newCardName = getPlayer(socketId).inDeck.shift();
        getPlayer(socketId).inHand[oldCardIndex] = newCardName;

        if (newCardName !== undefined) {
            io.sockets.in(currentRoom).emit('dealNewCard', socketId, newCardName, oldCardIndex);
        }

        // check if someone won the game
        let gameWinner = rooms[currentRoom].checkWinner();

        // someone won, anounce a winner
        if (gameWinner) {
            // NOTE: server console log
            console.log("player" + gameWinner + " won the game");

            io.sockets.in(currentRoom).emit('changeGameState', 'Over');

            if (gameWinner === "A") {
                io.sockets.in(currentRoom).emit('gameOver', socketId, players[socketId].isPlayerA);
            } else if (gameWinner === "B") {
                io.sockets.in(currentRoom).emit('gameOver', socketId, !players[socketId].isPlayerA);
            }
        }
        // nobody won, change turn
        else {
            io.sockets.in(currentRoom).emit('changeTurn');
        }
    })
})

function getPlayer(socketId) {
    return rooms[players[socketId].roomCode].getPlayer(socketId);
}

function getRoomId(socketId) {
    return players[socketId].roomCode
}


// TODO: swap for deployment
// ---------------------------------------------
http.listen(3000, function () {
    // NOTE: server console log
    console.log("Server started!");
})

// const port = process.env.PORT || 3000;

// http.listen(port, function () {
//     // NOTE: server console log
//     console.log("Server started!");
// })
// ----------------------------------------------