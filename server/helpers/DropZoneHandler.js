const formationHandler = require('./FormationHandler');

var dropZoneHandler = {
    /**
     * Checks whether someone claimed a marker in the zone
     * @param {*} zone zone to be checked
     * @param {*} cardsPlayed used cards
     * @returns outcome {winner, textA, textB}
     */
    checkZone: function (zone, cardsPlayed) {
        let outcome = {
            winner: null,
            textA: "playerA's formation",
            textB: "playerB's formation"
        }

        if (!zone.claimed && zone.firstFinishedA !== null) {

            let formationA;
            let formationB;

            let cardsA = zone.playerACards;
            let cardsB = zone.playerBCards;

            // Both players finished
            if (cardsA.length === 3 &&
                cardsB.length === 3) {

                formationA = formationHandler.determineFormation(cardsA);
                formationB = formationHandler.determineFormation(cardsB);

                if (zone.firstFinishedA) {
                    formationA.sum += 0.5;
                } else {
                    formationB.sum += 0.5;
                }

                let isAWinner = formationHandler.determinWinningFormation(
                    formationA,
                    formationB
                );

                // evaluation
                if (isAWinner) {
                    outcome.winner = "A";
                } else {
                    outcome.winner = "B";
                }

                outcome.textA += ": " + formationA.cards;
                outcome.textB += ": " + formationB.cards;

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
                    outcome.winner = "A";
                    outcome.textA += ": " + formationA.cards;
                    outcome.textB += " (potential): " + formationB.cards;
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
                    outcome.winner = "B";
                    outcome.textA += " (potential): " + formationA.cards;
                    outcome.textB += ": " + formationB.cards;
                }
            }
        }

        return outcome
    },


    /** Check whether player is blocked
     * There can be situation when it is player's turn
     * but the player cannot play a card 
     * (in unclaimed zones player already played 3 cards and all other zones are claimed)
     * @param {*} zones - all dropZones (dropZones object)
     * @param {*} isPlayerA 
     * @returns true if player is blocked, false otherwise
     */
    isPlayerBlocked: function (zones, isPlayerA) {
        let player;

        if (isPlayerA) {
            player = "playerACards";
        } else {
            player = "playerBCards";
        }

        for (let zone in zones) {
            if (!zones[zone].claimed && zones[zone][player].length < 3)
                return false
        }

        return true
    }
}

module.exports = dropZoneHandler;