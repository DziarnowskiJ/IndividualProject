// TODO: Remove this file
import Card from "./Card";

export default class Ping extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ping";
        this.playerCardSprite = "clubs";
        this.opponentCardSprite = "clubs";
    }
}