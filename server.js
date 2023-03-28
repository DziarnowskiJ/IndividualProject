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
    console.log('User connected:', socket.id);

    // keep reference of all players
    players[socket.id] = {
        isPlayerA: null,
        roomCode: null
    }

    // player disconnects
    socket.on("disconnect", () => {
        // NOTE: console log
        // console.log("Player", socket.id, "disconnected from room", getRoomId(socket.id));

        // inform other player 
        io.sockets.in(getRoomId(socket.id)).emit('gameOver', null, 'disconnected');
        // cancel the room
        cancelRoom(getRoomId(socket.id));
    })

    // player tries to join a room
    socket.on('join-room', (roomCode, roomType) => {
        switch (roomType) {
            case "new":
                // create new room and keep instance of it
                rooms[roomCode] = new Room(roomCode);
                joinRoom(roomCode, socket);
                break;
            case "join":
                if (rooms[roomCode]) {
                    joinRoom(roomCode, socket);
                } else {
                    // NOTE: console log
                    // console.log("Player", socket.id, "tried to join non-existing room", roomCode);

                    // inform player that the room does not exist
                    io.to(socket.id).emit("roomError", "noRoom");
                }
                break;
            case "random":
                if (nextRandomRoomCode) {
                    // join open random room 
                    joinRoom(nextRandomRoomCode, socket);
                    roomCode = nextRandomRoomCode;
                    nextRandomRoomCode = null;
                } else {
                    // each random room is occupied, create new room and join it
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

        // get player's hand and deck cards
        // .dealCards() function assigns cards to the player on server side
        let { inHand, inDeck } = getPlayer(socketId).dealCards();

        // inform player of its cards
        io.sockets.in(currentRoom).emit('dealCards', socketId, inHand, inDeck);

        // increase readyCheck for player's room
        // 0 = no players in room
        // 1 = 1 player in room
        // 2 = 2 players in room
        // 3 = 2 players in room, 1 have cards
        // 4 = 2 players in room, 2 have cards
        rooms[currentRoom].readyCheck++;

        // if both players have cards start the game and inform players
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
            // player won the marker
            if ((players[socketId].isPlayerA && claimedZones[i] === "A") ||
                (!players[socketId].isPlayerA && claimedZones[i] === "B")) {
                io.sockets.in(currentRoom).emit('claimMarker', socketId, "marker" + i.charAt(4), "won");
            }
            // player lost the marker
            else if ((!players[socketId].isPlayerA && claimedZones[i] === "A") ||
                (players[socketId].isPlayerA && claimedZones[i] === "B")) {
                io.sockets.in(currentRoom).emit('claimMarker', socketId, "marker" + i.charAt(4), "lost");
            }
        }

        // remove played card from player's hand
        // and replace it with new cards from player's deck
        let oldCardIndex = getPlayer(socketId).inHand.indexOf(cardName);
        let newCardName = getPlayer(socketId).inDeck.shift();
        getPlayer(socketId).inHand[oldCardIndex] = newCardName;

        // inform player about his new card
        if (newCardName) {
            io.sockets.in(currentRoom).emit('dealNewCard', socketId, newCardName, oldCardIndex);
        }

        // check if someone won the game
        let gameWinner = rooms[currentRoom].checkWinner();

        // someone won, anounce a winner
        if (gameWinner) {
            // finish the game
            io.sockets.in(currentRoom).emit('changeGameState', 'Over');

            //  inform players who won
            if ((gameWinner === "A" && players[socketId].isPlayerA) ||
                (gameWinner === "B" && !players[socketId].isPlayerA)) {
                io.sockets.in(currentRoom).emit('gameOver', socketId, "won");
            }
            else if ((gameWinner === "A" && !players[socketId].isPlayerA) ||
                (gameWinner === "B" && players[socketId].isPlayerA)) {
                io.sockets.in(currentRoom).emit('gameOver', socketId, "lost");
            }

            // cancel room as it is no longer needed
            cancelRoom(getRoomId(socketId));
        }
        // nobody won, change turn
        else {
            io.sockets.in(currentRoom).emit('changeTurn');
        }
    })
})

/** Cancel the room
 * removes players from the room
 * removes player's sockets from room's channel
 * removes room's record
 * @param {*} roomId room to be canceled
 * @returns 
 */
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
}

/** Join the room
 * Adds player to the room and allocated socket channel 
 * @param {*} roomId room to be joined
 * @param {*} socket socket of the player that joins the room
 * @returns 
 */
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

/**
 * @param {*} socketId id of a player 
 * @returns player object from a Room object
 */
function getPlayer(socketId) {
    return rooms[players[socketId].roomCode].getPlayer(socketId);
}

/**
 * @param {*} socketId socket id of the player
 * @returns id of a room the player is in if the player exists, null if doesn't
 */
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