export default class Card {
    constructor(scene) {
        this.render = (x, y, type) => {
            let sprite;
            if (type === 'playerCard') {
                sprite = this.playerCardSprite;
            } else {
                sprite = this.opponentCardSprite;
            }

            let card = scene.add.image(x, y, sprite);
            card.setInteractive();
            card.setData({
                "name": this.name,
                "type": type,
                "sprite": sprite
            });

            // card scaling
            if (this.name === 'cardBack') {
                card.setScale(0.35);
            } else {
                card.setScale(1.5);
            }
            
            if (type === "playerCard") {
                scene.input.setDraggable(card);
            }
            return card;
        }
    }
}