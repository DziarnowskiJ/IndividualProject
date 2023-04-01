import io from 'socket.io-client'
import GameHandler from './GameHandler.js';
const { Vars } = require('../vars.js');

export default class SocketHandler {
    constructor(scene) {
        scene.socket = io('https://dissertation-project.onrender.com');

        // join room on connection with the server
        scene.socket.on('connect', () => {
            scene.socket.emit('join-room', scene.roomCode, scene.roomType);
        })

        // establishes who starts the game
        scene.socket.on('firstTurn', (socketId) => {
            if (scene.socket.id === socketId)
                scene.GameHandler.changeTurn();
        })

        // room error occured (room does not exist or is full)
        // changes scene to RoomError and closes the socket
        scene.socket.on("roomError", (status) => {
            scene.GameHandler.handleRoomError(status);
        })

        // change game state
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
        })

        // changes the turn
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        })

        // distribute cards to the player
        scene.socket.on('dealCards', (socketId, inHand, inDeck) => {
            if (socketId === scene.socket.id) {

                scene.infoText.setText("Waiting for other\nplayer!");

                scene.DeckHandler.playerDeck = inDeck;

                // render player's cards
                for (let i = 0; i < inHand.length; i++) {
                    let card = scene.DeckHandler.playerHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.gameHeight - Vars.cardHeight / 2 - 30, inHand[i], "playerCard"));
                }

                scene.cardsLeftNumber.setText(scene.DeckHandler.playerDeck.length);
            } else {
                // render opponent's cards
                for (let i in inHand) {
                    let card = scene.DeckHandler.opponentHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.cardHeight / 2 + 30, "cardBack", "opponentCard"));
                }
            }
        })

        // get new card to the hand
        scene.socket.on('dealNewCard', (socketId, newCardName, oldCardIndex) => {
            if (socketId === scene.socket.id) {
                scene.DeckHandler.playerHand[oldCardIndex] =
                    scene.DeckHandler.dealCard(120 + (oldCardIndex * 140), Vars.gameHeight - Vars.cardHeight / 2 - 30, newCardName, "playerCard");
                scene.DeckHandler.playerDeck.shift();
                scene.cardsLeftNumber.setText(scene.DeckHandler.playerDeck.length);
            } else {
                scene.DeckHandler.opponentHand.unshift(
                    scene.DeckHandler.dealCard(120, Vars.cardHeight / 2 + 30, "cardBack", "opponentCard"));
            }
        })

        // card was played
        scene.socket.on('cardPlayed', (cardName, socketId, dropZoneName) => {
            // opponent played a card
            if (socketId !== scene.socket.id) {
                let currentZone = scene.dropZones[dropZoneName];
                scene.DeckHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard(
                    currentZone.x,
                    ((currentZone.y - Vars.dropZoneYOffset) - (Vars.dropZoneCardOffset * currentZone.data.values.opponentCards)),
                    cardName, "opponentCard");
                currentZone.data.values.opponentCards++;
            }
            // player played a card
            else {
                let oldCardIndex = scene.DeckHandler.playerHand.indexOf(cardName);
                scene.DeckHandler.playerHand[oldCardIndex] = null;
            }
        })

        // marker was claimed
        scene.socket.on('claimMarker', (socketId, markerId, outcome) => {

            // mark zone as claimed
            scene.dropZones["zone" + markerId.charAt(6)].data.values.isClaimed = true;

            // change marker's color to indicate it was claimed 
            if ((socketId === scene.socket.id && outcome === "won") ||
                (socketId !== scene.socket.id && outcome === "lost")) {
                scene.MarkerHandler.renderMarkerGraphics(scene.markers[markerId], "won");
            } else {
                scene.MarkerHandler.renderMarkerGraphics(scene.markers[markerId], "lost");
            }
        })

        // game ends
        // switch scene to GameOver
        scene.socket.on("gameOver", (socketId, isWinner) => {
            // game ended without a winner (someone disconnected)
            if (!socketId) {
                scene.GameHandler.gameOver("disconnected");
            }
            // player won
            else if ((socketId === scene.socket.id && isWinner) ||
                (socketId !== scene.socket.id && !isWinner)) {
                scene.GameHandler.gameOutcome = "won";
            }
            // player lost
            else if ((socketId !== scene.socket.id && isWinner) ||
                (socketId === scene.socket.id && !isWinner)) {
                scene.GameHandler.gameOutcome = "lost";
            }

            scene.infoText.setText("[Game over]");
            scene.infoText.setInteractive();
        })

        // lost connection to the server
        scene.socket.on("disconnect", () => {
            if (!scene.GameHandler.gameOutcome)
                scene.GameHandler.gameOver("serverFailure");
        })
    }
}