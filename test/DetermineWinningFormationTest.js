const assert = require('assert');
const formationHandler = require("../server/helpers/FormationHandler");

// Those tests assume that DetermineFormationTest was passed succesfully

// same formation, different values
assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["A1", "A2", "A3"]),
        formationHandler.determineFormation(["B2", "B3", "B4"])),
    false);

assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["A2", "A3", "A4"]),
        formationHandler.determineFormation(["B1", "B2", "B3"])),
    true);

assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["F9", "F7", "F8"]),
        formationHandler.determineFormation(["E5", "E6", "E7"])),
    true);

// different formation
assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["A1", "A2", "A3"]),
        formationHandler.determineFormation(["B2", "C2", "D2"])),
    true);

assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["B7", "B2", "B5"]),
        formationHandler.determineFormation(["F3", "B2", "C1"])),
    true);

assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formationHandler.determineFormation(["A1", "A2", "A3"]),
        formationHandler.determineFormation(["E8", "F3", "B4"])),
    true);

// exactly same formations (add 0.5 to formation's sum value to indicate that it was formed first)
let formation1 = formationHandler.determineFormation(["A1", "A2", "A3"]);
formation1.sum += 0.5;
let formation2 = formationHandler.determineFormation(["A1", "A2", "A3"]);
assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formation1,
        formation2),
    true)

formation1 = formationHandler.determineFormation(["A1", "A2", "A3"]);
formation2 = formationHandler.determineFormation(["A1", "A2", "A3"]);
formation2.sum += 0.5;
assert.deepStrictEqual(
    formationHandler.determinWinningFormation(
        formation1,
        formation2),
    false)

// ALL TEST PASSED!
console.log("All determine-winning-formation tests passed!")