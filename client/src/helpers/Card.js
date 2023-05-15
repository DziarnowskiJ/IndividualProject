import { Vars } from "../vars";

export default class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y, scene.deckType + name)
        this.scene = scene;
        this.name = name;

        this.setDefaultSize();
    }

    updateTexture() {
        this.setTexture(this.scene.deckType + this.name);
    }

    setDefaultSize() {
        this.displayWidth = Vars.cardWidth;
        this.displayHeight = Vars.cardHeight;
        this.height = Vars.cardHeight;
        this.width = Vars.cardWidth;
    }
}