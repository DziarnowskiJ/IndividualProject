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


/* STRAIGHT FLUSH */
// smallest possible, values ascending
assert.deepStrictEqual(
    formationHandler.determineFormation(["A1", "A2", "A3"]),
    formation(5, 6, 30, ["A1", "A2", "A3"]));

// middle cards, mixed order of values
assert.deepStrictEqual(
    formationHandler.determineFormation(["A5", "A3", "A4"]),
    formation(5, 12, 385, ["A5", "A3", "A4"]));

// largers possible, mixed order of values
assert.deepStrictEqual(
    formationHandler.determineFormation(["F8", "F9", "F7"]),
    formation(5, 24, 7429, ["F8", "F9", "F7"]));

/* THREE OF A KIND */
// smallest possible
assert.deepStrictEqual(
    formationHandler.determineFormation(["A1", "B1", "C1"]),
    formation(4, 3, 8, ["A1", "B1", "C1"]));

// middle values
assert.deepStrictEqual(
    formationHandler.determineFormation(["F5", "B5", "C5"]),
    formation(4, 15, 1331, ["F5", "B5", "C5"]));

// highest values
assert.deepStrictEqual(
    formationHandler.determineFormation(["E9", "D9", "C9"]),
    formation(4, 27, 12167, ["E9", "D9", "C9"]));

/* FLUSH */
// smallest possible
assert.deepStrictEqual(
    formationHandler.determineFormation(["A1", "A2", "A4"]),
    formation(3, 7, 42, ["A1", "A2", "A4"]));

// smallest, middle and highest value
assert.deepStrictEqual(
    formationHandler.determineFormation(["B1", "B9", "B4"]),
    formation(3, 14, 322, ["B1", "B9", "B4"]));

// highest values
assert.deepStrictEqual(
    formationHandler.determineFormation(["B8", "B9", "B6"]),
    formation(3, 23, 5681, ["B8", "B9", "B6"]));

/* STRAIGHT */
// smallest possible, values ascending
assert.deepStrictEqual(
    formationHandler.determineFormation(["B1", "C2", "A3"]),
    formation(2, 6, 30, ["B1", "C2", "A3"]));

// middle cards, mixed order of values
assert.deepStrictEqual(
    formationHandler.determineFormation(["F5", "E3", "B4"]),
    formation(2, 12, 385, ["F5", "E3", "B4"]));

// largers possible, mixed order of values
assert.deepStrictEqual(
    formationHandler.determineFormation(["F8", "F9", "C7"]),
    formation(2, 24, 7429, ["F8", "F9", "C7"]));

/* SET */
// smallest possible
assert.deepStrictEqual(
    formationHandler.determineFormation(["B1", "A1", "C2"]),
    formation(1, 4, 12, ["B1", "A1", "C2"]));

// middle cards
assert.deepStrictEqual(
    formationHandler.determineFormation(["F5", "E3", "A8"]),
    formation(1, 16, 1045, ["F5", "E3", "A8"]));

// largers possible
assert.deepStrictEqual(
    formationHandler.determineFormation(["F9", "E9", "C8"]),
    formation(1, 26, 10051, ["F9", "E9", "C8"]));


// ALL TEST PASSED!
console.log("All determine-formation tests passed!")