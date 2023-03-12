import io from 'socket.io-client'
const {Vars} = require('../vars.js');

export default class SocketHandler {
    constructor(scene) {
        scene.socket = io('http://localhost:3000');

        scene.socket.on('connect', () => {
            console.log("Connected!");
            scene.socket.emit('dealDeck', scene.socket.id);
        })

        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === 'Initialising') {
                scene.DeckHandler.dealCard(1010, Vars.gameHeight - Vars.cardHeight/2 - 30, "cardBack", "playerCard").disableInteractive();
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
                for (let i = 0; i < cards.length; i++) {
                    let card = scene.GameHandler.playerHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.gameHeight - Vars.cardHeight/2 - 30, cards[i], "playerCard"));
                }
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(
                        scene.DeckHandler.dealCard(120 + (i * 140), Vars.cardHeight/2 + 30, "cardBack", "opponentCard"));
                }
            }
        })

        scene.socket.on('cardPlayed', (cardName, socketId, dropZoneName) => {
            if (socketId !== scene.socket.id) {
                let currentZone = scene.dropZones[dropZoneName];
                scene.GameHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard(
                    currentZone.x, 
                    ((currentZone.y - Vars.dropZoneYOffset) - (Vars.dropZoneCardOffset * currentZone.data.values.opponentCards)), 
                    cardName, "opponentCard");
                currentZone.data.values.opponentCards++;
            }
        })
    }
}