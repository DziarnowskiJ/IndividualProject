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
let nextRandomRoomCode = null;


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
        io.sockets.in(getRoomId(socket.id)).emit('gameOver', null, 'disconnected');
        cancelRoom(getRoomId(socket.id));
    })

    socket.on('join-room', (roomCode, roomType) => {

        switch (roomType) {
            case "new":
                rooms[roomCode] = new Room(roomCode);
                joinRoom(roomCode, socket);
                break;
            case "join":
                if (rooms[roomCode]) {
                    joinRoom(roomCode, socket);
                } else {
                    // TODO: implement
                    console.log("ROOM DOES NOT EXIST");
                    io.to(socket.id).emit("roomError", "noRoom");
                }
                break;
            case "random":
                if (nextRandomRoomCode) {
                    joinRoom(nextRandomRoomCode, socket);
                    roomCode = nextRandomRoomCode;
                    nextRandomRoomCode = null;
                } else {
                    rooms[roomCode] = new Room(roomCode);
                    joinRoom(roomCode, socket);
                    nextRandomRoomCode = roomCode;
                }
                break;
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

        if (newCardName) {
            io.sockets.in(currentRoom).emit('dealNewCard', socketId, newCardName, oldCardIndex);
        }

        // check if someone won the game
        let gameWinner = rooms[currentRoom].checkWinner();

        // someone won, anounce a winner
        if (gameWinner) {
            // NOTE: server console log
            console.log("player" + gameWinner + " won the game");

            io.sockets.in(currentRoom).emit('changeGameState', 'Over');

            if ((gameWinner === "A" && players[socketId].isPlayerA) ||
                (gameWinner === "B" && !players[socketId].isPlayerA)) {
                io.sockets.in(currentRoom).emit('gameOver', socketId);
            }
            else if ((gameWinner === "A" && !players[socketId].isPlayerA) ||
                (gameWinner === "B" && players[socketId].isPlayerA)) {
                io.sockets.in(currentRoom).emit('gameOver', socketId);
            }

            cancelRoom(getRoomId(socketId));
        }
        // nobody won, change turn
        else {
            io.sockets.in(currentRoom).emit('changeTurn');
        }
    })
})

function cancelRoom(roomId) {

    // prevent canceling non-existing room
    if (!rooms[roomId])
        return

    // cancel socket room by forcing all sockets from this room to leave
    io.in(roomId).socketsLeave(roomId);
    // remove players from players object
    for (i of rooms[roomId].getPlayers()) {
        if (i) {
            delete players[i.playerId];
        }
    }

    // remove room from rooms object
    delete rooms[roomId];

    // NOTE: server console log
    console.log("ROOM CANCELED: ", roomId);
    console.log("Rooms: ", rooms);
    console.log("Players: ", players);
}

function joinRoom(roomId, socket) {
    // add player socket channel and keep reference in which room the player is
    socket.join(roomId);
    players[socket.id].roomCode = roomId;

    // NOTE: server console log
    console.log("User ", socket.id, "joined room: ", roomId);

    // check if the room is not full
    // if it is not full, player is added to the room
    // otherwise receives info that room is full
    if (!rooms[roomId].addPlayer(socket.id)) {
        io.to(socket.id).emit("roomError", "full");
        return;
    }

    players[socket.id].isPlayerA = getPlayer(socket.id).isPlayerA;


    // if both players joined the room
    if (rooms[roomId].readyCheck === 2) {

        console.log(players);

        io.sockets.in(roomId).emit('changeGameState', 'Initialising');
        io.sockets.in(roomId).emit('firstTurn', socket.id);
    }
}

function getPlayer(socketId) {
    return rooms[players[socketId].roomCode].getPlayer(socketId);
}

function getRoomId(socketId) {
    if (players[socketId])
        return players[socketId].roomCode;
    return null
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