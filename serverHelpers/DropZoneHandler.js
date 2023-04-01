const formationHandler = require('./FormationHandler');

var dropZoneHandler = {
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
    }
}


module.exports = dropZoneHandler;