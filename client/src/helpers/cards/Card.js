const {Vars} = require('../../vars.js');

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

            card.displayWidth = Vars.cardWidth;
            card.displayHeight = Vars.cardHeight;
            card.height = Vars.cardWidth;
            card.width = Vars.cardHeight;
            
            if (type === "playerCard") {
                scene.input.setDraggable(card);
            }
            return card;
        }
    }
}