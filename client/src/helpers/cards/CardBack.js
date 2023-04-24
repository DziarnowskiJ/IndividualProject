/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary CardBack class. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/helpers/cards/CardBack.js

This class is almost exactly the same, the only difference is that this class
has only one sprite propery, instead of two
*/

import Card from "./Card";

export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = "cardBack";
        this.cardSprite = "back";
    }
}