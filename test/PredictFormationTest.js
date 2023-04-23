const assert = require('assert');
const formationHandler = require("../server/helpers/FormationHandler");


/*
Card values:        Formation types:

+------+-------+    +-----------------+------+        
| Card | Value |    |    Formation    | Type |    
+------+-------+    +-----------------+------+    
| 1    | 2     |    | Straight flush  |  5   |    
+------+-------+    +-----------------+------+    
| 2    | 3     |    | Three of a kind |  4   |    
+------+-------+    +-----------------+------+    
| 3    | 5     |    | Flush           |  3   |    
+------+-------+    +-----------------+------+    
| 4    | 7     |    | Straight        |  2   |    
+------+-------+    +-----------------+------+    
| 5    | 11    |    | Set             |  1   |    
+------+-------+    +-----------------+------+
| 6    | 13    |    
+------+-------+
| 7    | 17    |
+------+-------+
| 8    | 19    |
+------+-------+
| 9    | 23    |
+------+-------+

formation {
    type:  type (int)
    sum:   card value multiply
    value: card name sum
    cards: []
}
*/

function formation(type, sum, value, cards) {
    return {
        type: type,
        sum: sum,
        value: value,
        cards: cards
    }
};

let cardsPlayed = [];
// blocks all straights 
let blockedStraights = ["A9", "B9", "C9", "D9", "E9", "F9",
    "A6", "B6", "C6", "D6", "E6", "F6",
    "A3", "B3", "C3", "D3", "E3", "F3"];
let blockedA = ["A9", "A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1"]
let blockedB = ["B9", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1"]
let blockedC = ["C9", "C8", "C7", "C6", "C5", "C4", "C3", "C2", "C1"]
let blockedD = ["D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "D1"]
let blockedE = ["E9", "E8", "E7", "E6", "E5", "E4", "E3", "E2", "E1"]
let blockedF = ["F9", "F8", "F7", "F6", "F5", "F4", "F3", "F2", "F1"]
let blocckedAll = blockedA
    .concat(blockedB)
    .concat(blockedC)
    .concat(blockedD)
    .concat(blockedE)
    .concat(blockedF);

/* STRAIGHT FLUSH */
// two cards
cardsPlayed = ["A9", "A8"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A9", "A8"], cardsPlayed),
    formationHandler.determineFormation(["A9", "A8", "A7"]));

cardsPlayed = ["A1", "A2"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A1", "A2"], cardsPlayed),
    formationHandler.determineFormation(["A1", "A2", "A3"]));

cardsPlayed = ["A3", "A1"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A3", "A1"], cardsPlayed),
    formationHandler.determineFormation(["A3", "A1", "A2"]));

// one card
cardsPlayed = ["A1"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A1"], cardsPlayed),
    formationHandler.determineFormation(["A1", "A3", "A2"]));

cardsPlayed = ["A3"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A3"], cardsPlayed),
    formationHandler.determineFormation(["A3", "A5", "A4"]));

cardsPlayed = ["A9"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A9"], cardsPlayed),
    formationHandler.determineFormation(["A9", "A8", "A7"]));

cardsPlayed = ["A8"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A8"], cardsPlayed),
    formationHandler.determineFormation(["A8", "A9", "A7"]));

// no cards
cardsPlayed = [];
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["A9", "A8", "A7"]));

cardsPlayed = ["A9"];
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["B9", "B8", "B7"]));

cardsPlayed = ["A9", "B9", "C9", "D9", "E9", "F9"];
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["A8", "A7", "A6"]));


/* THREE OF A KIND */
// two cards
cardsPlayed = blockedStraights.slice();
cardsPlayed.push("A2")
cardsPlayed.push("D2");
assert.deepStrictEqual(
    formationHandler.predictFormation(["A2", "D2"], cardsPlayed),
    formationHandler.determineFormation(["A2", "D2", "B2"]));

cardsPlayed = blockedStraights.slice();
cardsPlayed.push("B8");
cardsPlayed.push("D8");
assert.deepStrictEqual(
    formationHandler.predictFormation(["B8", "D8"], cardsPlayed),
    formationHandler.determineFormation(["B8", "D8", "A8"]));


cardsPlayed = blockedStraights.slice();
cardsPlayed.push("B5");
cardsPlayed.push("F5");
assert.deepStrictEqual(
    formationHandler.predictFormation(["F5", "B5"], cardsPlayed),
    formationHandler.determineFormation(["F5", "B5", "A5"]));

// one card
cardsPlayed = blockedStraights.slice();
cardsPlayed.push("B8");
assert.deepStrictEqual(
    formationHandler.predictFormation(["B8"], cardsPlayed),
    formationHandler.determineFormation(["B8", "A8", "C8"]));

cardsPlayed = blockedStraights.slice();
cardsPlayed.push("F1");
cardsPlayed.push("B1");
assert.deepStrictEqual(
    formationHandler.predictFormation(["F1"], cardsPlayed),
    formationHandler.determineFormation(["F1", "A1", "C1"]));

// no cards
cardsPlayed = blockedStraights.slice();
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["A8", "B8", "C8"]));

cardsPlayed = blockedStraights.slice();
cardsPlayed = cardsPlayed.concat(["A8", "B8", "C8", "D8"]);
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["A7", "B7", "C7"]));

/* FLUSH */
// two cards
cardsPlayed = ["A9", "A8", "A7"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A9", "A8"], cardsPlayed),
    formationHandler.determineFormation(["A9", "A8", "A6"]));

cardsPlayed = ["A9", "A8", "A7", "A6", "A5", "A2"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["A2", "A8"], cardsPlayed),
    formationHandler.determineFormation(["A2", "A8", "A4"]));

// one card
cardsPlayed = ["A9", "A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1",
    "B9", "B8", "B7", "B6", "B4",
    "C6", "D6", "E6"];
assert.deepStrictEqual(
    formationHandler.predictFormation(["B6"], cardsPlayed),
    formationHandler.determineFormation(["B6", "B5", "B3"]));

/* STRAIGHT */
// two cards
cardsPlayed = blockedStraights.slice();
cardsPlayed = cardsPlayed.filter(function (e) { return e !== 'A6' });
cardsPlayed = cardsPlayed.concat(blockedC);
assert.deepStrictEqual(
    formationHandler.predictFormation(["C8", "C7"], cardsPlayed),
    formationHandler.determineFormation(["C8", "C7", "A6"]));

cardsPlayed = blockedStraights.slice();
cardsPlayed = cardsPlayed.concat(blockedC);
assert.deepStrictEqual(
    formationHandler.predictFormation(["C7", "C6"], cardsPlayed),
    formationHandler.determineFormation(["C7", "C6", "A8"]));

cardsPlayed = blockedStraights.slice();
cardsPlayed = cardsPlayed.concat(blockedC);
cardsPlayed.push("A8");
assert.deepStrictEqual(
    formationHandler.predictFormation(["C7", "C6"], cardsPlayed),
    formationHandler.determineFormation(["C7", "C6", "B8"]));

// one card
// cardsPlayed = blockedStraights.slice();
cardsPlayed = [];
cardsPlayed = cardsPlayed.concat(blockedE)
    .concat(blockedA)
    .concat(blockedB)
    .concat(["C7", "C8", "D7"]);
// cardsPlayed = cardsPlayed.filter(function (e) { return e !== 'C6' });
assert.deepStrictEqual(
    formationHandler.predictFormation(["E7"], cardsPlayed),
    formationHandler.determineFormation(["E7", "C9", "D8"]));

cardsPlayed = [];
cardsPlayed = cardsPlayed.concat(blockedB)
    .concat(blockedA)
    .concat(blockedE)
    .concat("C4", "D4");
assert.deepStrictEqual(
    formationHandler.predictFormation(["B4"], cardsPlayed),
    formationHandler.determineFormation(["B4", "C6", "C5"]));

// no cards
cardsPlayed = [];
cardsPlayed = cardsPlayed.concat(blockedA)
    .concat(blockedB)
    .concat(blockedC);
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["D9", "D8", "D7"]));

cardsPlayed = [];
cardsPlayed = cardsPlayed.concat(blockedA)
    .concat(blockedB)
    .concat(blockedC)
    .concat(["D7", "E8", "F8"]);
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["E7", "E6", "E5"]));

/* SET */
cardsPlayed = blocckedAll.slice();
cardsPlayed = cardsPlayed.filter(function (e) { return e !== "B7"});
cardsPlayed = cardsPlayed.filter(function (e) { return e !== "F1"});
cardsPlayed = cardsPlayed.filter(function (e) { return e !== "C2"});
assert.deepStrictEqual(
    formationHandler.predictFormation([], cardsPlayed),
    formationHandler.determineFormation(["B7", "C2", "F1"]));
    
// ALL TEST PASSED!
console.log("All predict-formation tests passed!")