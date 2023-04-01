const encoder = {
    "1": 2,
    "2": 3,
    "3": 5,
    "4": 7,
    "5": 11,
    "6": 13,
    "7": 17,
    "8": 19,
    "9": 23,
}

const decoder = {
    2: "1",
    3: "2",
    5: "3",
    7: "4",
    11: "5",
    13: "6",
    17: "7",
    19: "8",
    23: "9",
}

const straightValues = [30, 105, 385, 1001, 2431, 4199, 7429, 12673, 20677];
const tripleValues = [8, 27, 125, 343, 1331, 2197, 4913, 6859, 12167];
const domains = ["A", "B", "C", "D", "E", "F"];

function encode(card) {
    let encodedCard = {
        domain: card.charAt(0),
        codeValue: encoder[card.charAt(1)],
        trueValue: parseInt(card.charAt(1))
    }
    return encodedCard
}

function decode(encodedCard) {
    return card = encodedCard.domain + decoder[encodedCard.value]
}

var formationHandler = {
    determineFormation: function (cards) {
        let formation = {
            type: 0,
            sum: 0,
            value: 1,
            cards: cards
        }

        for (let card of cards) {
            formation.value *= encode(card).codeValue;
            formation.sum += encode(card).trueValue;
        }

        let isStraight = straightValues.includes(formation.value);
        let isTriple = tripleValues.includes(formation.value);
        let isColor = (encode(cards[0]).domain === encode(cards[1]).domain
            && encode(cards[0]).domain === encode(cards[2]).domain)

        // determin card formation
        if (isStraight && isColor) {                                // straight-flush (colored sequence)
            formation.type = 5;
        } else if (isTriple) {                                      // three-of-a-kind (same value, different colors)
            formation.type = 4;
        } else if (!isStraight && isColor) {                        // flush (same color, different values)
            formation.type = 3
        } else if (isStraight && !isColor) {                        // straight (sequenced values, different colors)
            formation.type = 2;
        } else {                                                    // card set (random cards)
            formation.type = 1;
        }

        return formation
    },

    determinWinningFormation: function (formationA, formationB) {
        let isAWinning = null;

        // Check for formationA === formationB (both type and sum are equal)
        // is not needed as according to the game rules formation that is formed 
        // earlier wins (and it is implementd by adding 0.5 to formation's sum value)
        if (formationA.type > formationB.type) {
            isAWinning = true;
        } else if (formationA.type < formationB.type) {
            isAWinning = false;
        } else {
            if (formationA.sum > formationB.sum) {
                isAWinning = true;
            } else if (formationA.sum < formationB.sum) {
                isAWinning = false;
            }
        }

        return isAWinning
    },

    // isBeatable: function (checkCards) {
    predictFormation: function (checkCards, cardsPlayed) {
        let cardsNeeded = [];

        if (checkCards.length === 2) {
            let cards = [
                encode(checkCards[0]),
                encode(checkCards[1])
            ]

            let isColor = cards[0].domain === cards[1].domain;

            let neededTowardStraight = [];
            for (let cardValue of straightValues) {
                let codedValue = cardValue / (cards[0].codeValue * cards[1].codeValue);
                if (Number.isInteger(codedValue)) {
                    neededTowardStraight.push(decoder[codedValue])
                }
            }
            neededTowardStraight.sort();
            neededTowardStraight.reverse();

            let neededTowardTriple = 0;
            if (cards[0].trueValue === cards[1].trueValue) {
                neededTowardTriple = cards[0].trueValue;
            }

            // straight-flush   -> first check color, then neededTowards, then if card was played
            if (isColor && neededTowardStraight.length > 0) {
                for (let card of neededTowardStraight) {
                    if (!cardsPlayed.includes(cards[0].domain + card)) {
                        cardsNeeded.push(cards[0].domain + card);
                        return this.determineFormation(checkCards.concat(cardsNeeded));
                    }
                }
            }
            // triple           -> if neededTowardTriple != 0, check all domains and find if one wasn't played
            if (neededTowardTriple !== 0) {
                for (let domain of domains) {
                    if (!cardsPlayed.includes(domain + neededTowardTriple)) {
                        cardsNeeded.push(domain + neededTowardTriple);
                        return this.determineFormation(checkCards.concat(cardsNeeded));
                    }
                }
            }
            // color            -> if isColor === true, find card with highest value in color
            if (isColor) {
                for (let i = 9; i > 0; i--) {
                    if (!cardsPlayed.includes(cards[0].domain + i)) {
                        cardsNeeded.push(cards[0].domain + i);
                        return this.determineFormation(checkCards.concat(cardsNeeded));
                    }
                }
            }
            // straight         -> neededTowards in any color available
            if (neededTowardStraight.length > 0) {
                for (let card of neededTowardStraight) {
                    for (let domain of domains) {
                        if (!cardsPlayed.includes(domain + card)) {
                            cardsNeeded.push(domain + card);
                            return this.determineFormation(checkCards.concat(cardsNeeded));
                        }
                    }
                }
            }
            // card set         -> find highest value card not played (check all 10s, 9s, etc)
            for (let i = 9; i > 0; i--) {
                for (let domain of domains) {
                    if (!cardsPlayed.includes(domain + i)) {
                        cardsNeeded.push(domain + i);
                        return this.determineFormation(checkCards.concat(cardsNeeded));
                    }
                }
            }

        } else if (checkCards.length === 1) {
            cardsToStraight = {
                1: [[3, 2]],
                2: [[4, 3], [3, 1]],
                3: [[5, 4], [4, 2], [2, 1]],
                4: [[6, 5], [5, 3], [3, 2]],
                5: [[7, 6], [6, 4], [4, 3]],
                6: [[8, 7], [7, 5], [5, 4]],
                7: [[9, 8], [8, 6], [6, 5]],
                8: [[9, 7], [7, 6]],
                9: [[8, 7]]
            }

            let card = encode(checkCards[0]);

            // - straight - flush(colored sequence)
            // get highest possible straight in color
            for (let i in cardsToStraight[card.trueValue]) {
                let potentialCardA = card.domain + cardsToStraight[card.trueValue][i][0];
                let potentialCardB = card.domain + cardsToStraight[card.trueValue][i][1]
                if (!cardsPlayed.includes(potentialCardA) &&
                    !cardsPlayed.includes(potentialCardB)) {
                    cardsNeeded = [potentialCardA, potentialCardB];
                    return this.determineFormation(checkCards.concat(cardsNeeded));
                }
            }
            // - three - of - a - kind(same value, different colors)
            // check if > 4 cards of this value were played
            if (cardsNeeded.length === 0) {

                for (let domain of domains) {
                    if (!cardsPlayed.includes(domain + card.trueValue)) {
                        cardsNeeded.push(domain + card.trueValue);
                    }
                }

                if (cardsNeeded.length >= 2) {
                    cardsNeeded = cardsNeeded.slice(0, 2);
                    return this.determineFormation(checkCards.concat(cardsNeeded));
                } else {
                    cardsNeeded = [];
                }
            }
            // - flush(same color, different values)
            // find 2 highest unplayed cards of this color
            if (cardsNeeded.length === 0) {
                for (let i = 9; i > 0; i--) {
                    if (!cardsPlayed.includes(card.domain + i)) {
                        cardsNeeded.push(card.domain + i);
                    }
                }
                if (cardsNeeded.length >= 2) {
                    cardsNeeded = cardsNeeded.slice(0, 2);
                    return this.determineFormation(checkCards.concat(cardsNeeded));
                } else {
                    cardsNeeded = [];
                }
            }
            // - straight(sequenced values, different colors)
            // get highest possible straight
            if (cardsNeeded.length === 0) {
                for (let i in cardsToStraight[card.trueValue]) {
                    let isOne = null;
                    let isTwo = null;
                    for (let domain of domains) {
                        if (!cardsPlayed.includes(domain + cardsToStraight[card.trueValue][i][0])) {
                            isOne = domain + cardsToStraight[card.trueValue][i][0];
                        }
                        if (!cardsPlayed.includes(domain + cardsToStraight[card.trueValue][i][1])) {
                            isTwo = domain + cardsToStraight[card.trueValue][i][1];
                        }
                    }
                    if (isOne && isTwo) {
                        cardsNeeded = [isOne, isTwo];
                        return this.determineFormation(checkCards.concat(cardsNeeded));
                    }
                }
            }
            // - card set(random cards)
            // find 2 highest values of unplayed cards
            if (cardsNeeded.length === 0) {
                let isOne = null;
                let isTwo = null;
                for (let i = 9; i > 0; i--) {
                    for (let domain of domains) {
                        if (!cardsPlayed.includes(domain + i) && !isOne) {
                            isOne = domain + i;
                        } else if (!cardsPlayed.includes(domain + i) && !isTwo) {
                            isTwo = domain + i;
                        }
                    }
                }
                if (isOne && isTwo) {
                    cardsNeeded = [isOne, isTwo];
                    return this.determineFormation(checkCards.concat(cardsNeeded));
                }
            }

        } else if (checkCards.length === 0) {
            // - straight - flush(colored sequence)
            for (let i = 9; i > 2; i--) {
                if (checkCards.length !== 0) break;
                for (let domain of domains) {
                    let cardA = domain + i;
                    let cardB = domain + (i - 1);
                    let cardC = domain + (i - 2);

                    if (!cardsPlayed.includes(cardA) &&
                        !cardsPlayed.includes(cardB) &&
                        !cardsPlayed.includes(cardC)) {
                        cardsNeeded = [cardA, cardB, cardC];
                        return this.determineFormation(cardsNeeded);
                    }
                }
            }


            // - three - of - a - kind(same value, different colors)
            for (let i = 9; i > 0; i--) {
                if (checkCards.length === 3) break;
                for (let domain of domains) {
                    if (!cardsPlayed.includes(domain + i)) {
                        cardsNeeded.push(domain + i);
                    }

                    if (cardsNeeded.length === 3) {
                        cardsNeeded = tripleCandidate;
                        return this.determineFormation(cardsNeeded);
                    } else {
                        cardsNeeded = [];
                    }
                }
            }

            // - flush(same color, different values)
            let highestSoFar = {
                cards: [],
                sum: 0
            }
            for (let domain of domains) {
                let potentialFlush = {
                    cards: [],
                    sum: 0
                }
                for (let j = 9; j > 0; j--) {
                    if (potentialFlush.cards.length === 3) break;
                    if (!cardsPlayed.includes(domain + j)) {
                        potentialFlush.cards.push(domain + j);
                        potentialFlush.sum += j;
                    }
                }
                if (potentialFlush.cards.length === 3 && potentialFlush.sum > highestSoFar.sum) {
                    highestSoFar = potentialFlush;
                }
            }
            if (highestSoFar.cards.length === 3) {
                cardsNeeded = highestSoFar.cards;
                return this.determineFormation(cardsNeeded);
            }

            // - straight(sequenced values, different colors)
            for (let i = 9; i > 2; i--) {
                if (checkCards.length === 3) break;
                let cardA = null;
                let cardB = null;
                let cardC = null;
                for (let domain of domains) {
                    if (!cardA && !cardsPlayed.includes(domain + i)) {
                        cardA = domain + i;
                    }
                    if (!cardB && !cardsPlayed.includes(domain + (i - 1))) {
                        cardB = domain + (i - 1);
                    }
                    if (!cardC && !cardsPlayed.includes(domain + (i - 2))) {
                        cardC = domain + (i - 2);
                    }
                }
                if (!cardA && !cardB && !cardC) {
                    cardsNeeded = [cardA, cardB, cardC];
                    return this.determineFormation(cardsNeeded);
                }
            }
            // - card set(random cards)
            for (let i = 9; i > 0; i--) {
                for (let domain of domains) {
                    if (!cardsPlayed.includes(domain + i)) {
                        cardsNeeded.push(domain + i)
                    }
                    if (cardsNeeded.length === 3) {
                        return this.determineFormation(cardsNeeded);
                    }
                }
            }
        } 
    }
}

module.exports = formationHandler;