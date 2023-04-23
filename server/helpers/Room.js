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
        for (let domain of domains) {
            for (let j = 1; j <= 9; j++) {
                this.fullDeck.push(domain + j);
            }
        }
        // shuffle the deck
        shuffle(this.fullDeck);

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

    /**
     * Add player to the room
     * @param {*} playerId socketId of the player
     * @returns returns true if the player can join, false otherwise
     */
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

    /**
     * Get player
     * @param {*} id socketId of the player
     * @returns player object 
     */
    getPlayer(id) {
        if (this.playerA.playerId === id) {
            return this.playerA;
        } else if (this.playerB.playerId === id) {
            return this.playerB;
        } else return false;
    }

    /**
     * Get players
     * @returns array of player objects in this room
     */
    getPlayers() {
        return [this.playerA, this.playerB];
    }

    /**
     * Deals cards to the player
     * @param {*} player - player object
     * @returns {inHand, inDeck} - cards of the player
     */
    dealDeck(player) {
        for (let i = 0; i < 27; i++) {
            player.inDeck.push(this.fullDeck.shift());
        }
        for (let i = 0; i < 6; i++) {
            player.inHand.push(player.inDeck.shift());
        }

        return { inHand: player.inHand, inDeck: player.inDeck };
    }

    /**
     * keep track of cards in zones on server's side
     * @param {*} cardName 
     * @param {*} dropZoneName 
     * @param {*} playedByA 
     */
    cardPlayed(cardName, dropZoneName, playedByA) {
        this.cardsPlayed.push(cardName);

        let currentDropZone = this.dropZones[dropZoneName];

        // keep track of cards in zones on server's side
        if (playedByA) {
            currentDropZone.playerACards.push(cardName);
            if (currentDropZone.playerACards.length === 3 &&
                currentDropZone.playerBCards.length < 3) {
                currentDropZone.firstFinishedA = true;
            }
        } else if (!playedByA) {
            currentDropZone.playerBCards.push(cardName);
            if (currentDropZone.playerACards.length < 3 &&
                currentDropZone.playerBCards.length === 3) {
                currentDropZone.firstFinishedA = false;
            }
        }
    }

    /**
     * Checks whether any zone was just claimed 
     * @returns newly claimed zones
     */
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

    /**
     * Checks whether someone won the game
     * @returns ["A" | "B" | null]
     */
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

    /**
     * Sometimeds a player can be deadlocked (cannot play a card in their turn)
     * @param {*} playerId socketId of the player to be checked
     * @returns true if player is blocked, false otherwise
     */
    isPlayerBlocked(playerId) {
        let player = this.getPlayer(playerId);

        let isBlocked = dropZoneHandler.isPlayerBlocked(this.dropZones, player.isPlayerA)
        return isBlocked
    }

    /**
     * 
     * @returns socketId of the blocked player, null if noone is blocked
     */
    getBlockedPlayer() {
        let isABlocked = dropZoneHandler.isPlayerBlocked(this.dropZones, true)
        if (isABlocked)
            return this.playerA.playerId;

        let isBBlocked = dropZoneHandler.isPlayerBlocked(this.dropZones, false)
        if (isBBlocked)
            return this.playerB.playerId;
        
        return null
    }
}

module.exports = Room;