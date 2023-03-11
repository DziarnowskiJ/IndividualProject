// TODO: Remove this file
import Card from "./Card";

export default class Ping extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ping";
        this.playerCardSprite = "C8";
        this.opponentCardSprite = "F9";
    }
}