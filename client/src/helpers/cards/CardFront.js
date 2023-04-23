import Card from "./Card";

export default class CardFront extends Card {
    constructor(scene, name) {
        super(scene);
        this.name = name;
        this.cardSprite = name;
    }
}