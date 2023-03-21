import io from 'socket.io-client'
const { Vars } = require('../vars.js');

export default class SocketHandler {
    constructor(scene) {
        scene.socket = io('http://localhost:3000');

        scene.socket.on('connect', () => {
            // NOTE: client console log
            console.log("Connected!");
            scene.socket.emit('dealDeck', scene.socket.id);
        })

        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === 'Initialising') {
                scene.DeckHandler.dealCard(1010, Vars.gameHeight - Vars.cardHeight / 2 - 30, "cardBack", "playerCard").disableInteractive();
                scene.dealCards.setText("Start the game!")
                scene.dealCards.setInteractive();
                scene.dealCards.setColor('#00FFFF');
            }
        })

        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                scene.dealCards.setText("Waiting for other player!")
                for (let i = 0; i < cards.length; i++) {
                    let card = scene.GameHandler.playerHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.gameHeight - Vars.cardHeight / 2 - 30, cards[i], "playerCard"));
                }
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.cardHeight / 2 + 30, "cardBack", "opponentCard"));
                }
            }
        })

        scene.socket.on('dealNewCard', (socketId, newCardName, oldCardIndex) => {
            // console.log("PlayerHand:",   scene.GameHandler.playerHand);
            // console.log("PlayerDeck:",   scene.GameHandler.playerDeck);
            // console.log("OpponentHand:", scene.GameHandler.opponentHand);
            // console.log("OpponentDeck:", scene.GameHandler.opponentDeck);

            if (socketId === scene.socket.id) {
                scene.GameHandler.playerHand[oldCardIndex] =
                    scene.DeckHandler.dealCard(120 + (oldCardIndex * 140), Vars.gameHeight - Vars.cardHeight / 2 - 30, newCardName, "playerCard");
            } else {
                scene.GameHandler.opponentHand.unshift(
                    scene.DeckHandler.dealCard(120, Vars.cardHeight / 2 + 30, "cardBack", "opponentCard"));
            }
        })

        scene.socket.on('cardPlayed', (cardName, socketId, dropZoneName) => {
            // opponent played a card
            if (socketId !== scene.socket.id) {
                let currentZone = scene.dropZones[dropZoneName];
                scene.GameHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard(
                    currentZone.x,
                    ((currentZone.y - Vars.dropZoneYOffset) - (Vars.dropZoneCardOffset * currentZone.data.values.opponentCards)),
                    cardName, "opponentCard");
                currentZone.data.values.opponentCards++;
            }
            // player played a card
            else {
                let oldCardIndex = scene.GameHandler.playerHand.indexOf(cardName);
                scene.GameHandler.playerHand[oldCardIndex] = undefined;
            }
        })

        scene.socket.on('claimMarker', (socketId, markerId, outcome) => {
            scene.dropZones["zone" + markerId.charAt(6)].data.values.isClaimed = true;
            if ((socketId === scene.socket.id && outcome === "won") ||
                (socketId !== scene.socket.id && outcome === "lost")) {
                scene.MarkerHandler.renderMarkerGraphics(scene.markers[markerId], "won");
            } else {
                scene.MarkerHandler.renderMarkerGraphics(scene.markers[markerId], "lost");
            }
        })

        scene.socket.on("gameOver", (socketId, isWinner) => {
            if ((isWinner && scene.socket.id === socketId) ||
                ((!isWinner && scene.socket.id !== socketId))) {
                scene.dealCards.setText("You WON!");
                // NOTE: client console log
                console.log("You WON!");
            } else {
                scene.dealCards.setText("You LOST!");
                // NOTE: client console log
                console.log("You LOST!");
            }
        })
    }
}