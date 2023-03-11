// TODO: Remove this file
import Card from "./Card";

export default class Bool extends Card {
    constructor(scene) {
        super(scene);
        this.name = "bool";
        this.playerCardSprite = "A1";
        this.opponentCardSprite = "B2";
    }
}