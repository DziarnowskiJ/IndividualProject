/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary Card class. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/helpers/cards/Card.js

This class is almost exactly the same, differences
- simplified sprite variable
    --> in sominator's project based on card type the sprite takes different values
        here it is always this.cardSprite
- card internal variables (displlayWidth, width, displayHeght, height) are set
*/

const { Vars } = require('../../vars.js');

export default class Card {
    constructor(scene) {
        /**
         * Render a card
         * @param {*} x - x-coordinate
         * @param {*} y - y-coordinate
         * @returns card
         */
        this.render = (x, y, type) => {
            let sprite = this.cardSprite;

            let card = scene.add.image(x, y, sprite);
            card.setInteractive();
            card.setData({
                "name": this.name,
                "type": type,
                "sprite": sprite
            });

            card.displayWidth = Vars.cardWidth;
            card.displayHeight = Vars.cardHeight;
            card.height = Vars.cardHeight;
            card.width = Vars.cardWidth;

            if (type === "playerCard") {
                scene.input.setDraggable(card);
            }
            return card;
        }
    }
}