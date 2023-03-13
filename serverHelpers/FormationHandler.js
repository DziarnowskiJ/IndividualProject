var formationHandler = {
    determineFormation: function (cards) {
        let formation = {
            type: 0,
            strength: 0,
        }

        let cardA = {
            domain: cards[0].charAt(0),
            value: parseInt(cards[0].charAt(1))
        }
        let cardB = {
            domain: cards[1].charAt(0),
            value: parseInt(cards[1].charAt(1))
        }
        let cardC = {
            domain: cards[2].charAt(0),
            value: parseInt(cards[2].charAt(1))
        }

        // determin straight (cards in sequence)
        let isStraight = false;
        if (Math.max(cardA.value, cardB.value, cardC.value) - 2 === Math.min(cardA.value, cardB.value, cardC.value) &&
            (cardA.value !== cardB.value &&
                cardA.value !== cardC.value &&
                cardB.value !== cardC.value)) {
            isStraight = true;
        }

        // determin color match (cards in same color)
        let isColor = false;
        if (cardA.domain === cardB.domain && cardA.domain === cardC.domain) {
            isColor = true;
        }

        // determin card formation
        if (isStraight && isColor) {                                // straight-flush (colored sequence)
            formation.type = 5;
        } else if (cardA.value === cardB.value &&                   // three-of-a-kind (same value, different colors)
            cardA.value === cardC.value) {
            formation.type = 4;
        } else if (!isStraight && isColor) {                        // flush (same color, different values)
            formation.type = 3
        } else if (isStraight && !isColor) {                        // straight (sequenced values, different colors)
            formation.type = 2;
        } else {                                                    // card set (random cards)
            formation.type = 1;
        }

        formation.strength = cardA.value + cardB.value + cardC.value;

        return formation
    },

    determinWinningFormation: function (formationA, formationB) {
        let isAWinning = undefined;

        // Check for formationA === formationB (both type and strength are equal)
        // is not needed as according to the game rules formation that is formed 
        // earlier wins (and it is implementd by adding 0.5 to formation's strength value)
        if (formationA.type > formationB.type) {
            isAWinning = true;
        } else if (formationA.type < formationB.type) {
            isAWinning = false;
        } else {
            if (formationA.strength > formationB.strength) {
                isAWinning = true;
            } else if (formationA.strength < formationB.strength) {
                isAWinning = false;
            }
            /**
             * //NOTE: Dependin on implementation uncomment this 
            else {
                if (formationA.createdFirst) {
                    isAWinning = true;
                } else {
                    isAWinning = false;
                }
            }
            */
        }

        return isAWinning
    }
}

module.exports = formationHandler;