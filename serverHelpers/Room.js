const shuffle = require('shuffle-array');
const dropZoneHandler = require('./DropZoneHandler');

class Room {
    constructor(roomCode) {
        this.roomCode = roomCode;
        this.playerA = null;
        this.playerB = null;

        this.cardsPlayed = [];
        this.gameState = "Initialising";
        this.readyCheck = 0;

        this.fullDeck = [];
        this.dropZones = {};

        // populate fullDeck
        let domains = ["A", "B", "C", "D", "E", "F"];
        for (let i = 0; i < domains.length; i++) {
            for (let j = 1; j <= 9; j++) {
                this.fullDeck.push(domains[i] + j);
            }
        }
        // shuffle the deck
        // shuffle(fullDeck);

        // populate dropZones
        for (let i = 0; i < 9; i++) {
            this.dropZones["zone" + i] = {
                playerACards: [],
                playerBCards: [],
                firstFinishedA: null,
                claimed: null
            }
        }

    }

    addPlayer(playerId) {
        if (this.readyCheck === 0) {
            this.playerA = {
                playerId: playerId,
                inDeck: [],
                inHand: [],
                isPlayerA: true,
                dealCards: () => { return this.dealDeck(this.playerA) }
            }
        }
        else if (this.readyCheck === 1) {
            this.playerB = {
                playerId: playerId,
                inDeck: [],
                inHand: [],
                isPlayerA: false,
                dealCards: () => { return this.dealDeck(this.playerB) }
            }
        }
        else return false;

        this.readyCheck++;
        return true;
    }

    getPlayer(id) {
        if (this.playerA.playerId === id) {
            return this.playerA;
        } else if (this.playerB.playerId === id) {
            return this.playerB;
        } else return false;
    }

    dealDeck(player) {
        for (let i = 0; i < 27; i++) {
            player.inDeck.push(this.fullDeck.shift());
        }
        for (let i = 0; i < 6; i++) {
            player.inHand.push(player.inDeck.shift());
        }

        // NOTE: server console log
        // console.log(player.inDeck);
        // console.log(player.inHand);
        return { inHand: player.inHand, inDeck: player.inDeck };
    }

    cardPlayed(cardName, dropZoneName, playedByA) {
        this.cardsPlayed.push(cardName);

        let currentDropZone = this.dropZones[dropZoneName];

        // keep track of cards in zones on server's side
        if (playedByA) {
            // NOTE: server console log
            console.log("PlayerA played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerACards.push(cardName);
            if (currentDropZone.playerACards.length === 3 &&
                currentDropZone.playerBCards.length < 3) {
                currentDropZone.firstFinishedA = true;
            }
        } else if (!playedByA) {
            // NOTE: server console log
            console.log("PlayerB played card " + cardName + " in " + dropZoneName);
            currentDropZone.playerBCards.push(cardName);
            if (currentDropZone.playerACards.length < 3 &&
                currentDropZone.playerBCards.length === 3) {
                currentDropZone.firstFinishedA = false;
            }
        } else {
            // NOTE: server error log
            console.log("ERROR! --> Room.js/cardPlayed")
        }
    }

    checkZones() {
        let newlyClaimedZones = {};
        for (let i in this.dropZones) {
            if (!this.dropZones[i].claimed) {
                let outcome = dropZoneHandler.checkZone(this.dropZones[i], this.cardsPlayed);
                if (outcome.winner) {
                    this.dropZones[i].claimed = outcome.winner;
                    newlyClaimedZones[i] = outcome.winner;
                }
            }
        }

        return newlyClaimedZones;
    }

    checkWinner() {

        let claimedByA = 0;
        let claimedByB = 0;

        let adjacentThreeA = 0;
        let adjacentThreeB = 0;

        for (let i in this.dropZones) {

            if (this.dropZones[i].claimed === "A") {
                claimedByA++;
                adjacentThreeA++;
                adjacentThreeB = 0;
            } else if (this.dropZones[i].claimed === "B") {
                claimedByB++;
                adjacentThreeB++;
                adjacentThreeA = 0;
            } else if (!this.dropZones[i].claimed) {
                adjacentThreeA = 0;
                adjacentThreeB = 0;
            }

            if (claimedByA === 5 || adjacentThreeA === 3) {
                return "A"
            } else if (claimedByB === 5 || adjacentThreeB === 3) {
                return "B"
            } 
        }

        return null
    }
}

module.exports = Room;