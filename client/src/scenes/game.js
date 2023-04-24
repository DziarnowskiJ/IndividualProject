/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary game.js file. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/scenes/game.js

Method create() is almost exactly the same, 
it differes only by creation of additional handler (MarkerHandler)
*/

import DeckHandler from "../helpers/DeckHandler";
import GameHandler from "../helpers/GameHandler"
import InteractivityHandler from "../helpers/InteractivityHandler";
import SocketHandler from "../helpers/SocketHandler";
import UIHandler from "../helpers/UIHandler";
import MarkerHandler from "../helpers/MarkerHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    init(data) {
        this.roomCode = data.roomCode;
        this.roomType = data.roomType;
    }

    // happens BEFORE the game is created
    preload() {
        // load all 54 cards (6 domains, 9 cards each)
        let domains = ["A", "B", "C", "D", "E", "F"];
        for (let domain of domains) {
            for (let j = 1; j <= 9; j++) {
                this.load.image(domain + j, 'src/assets/cardDeck/domain' + domain + '/' + domain + " (" + j + ')'+ '.png');
            }
        }
        // load backside of card
        this.load.image('back', 'src/assets/cardDeck/backside.png');
    }

    // happens WHEN the game is created
    create() {
        this.MarkerHandler = new MarkerHandler(this);
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildWelcomeUI();
        this.InteractivityHandler = new InteractivityHandler(this);
    }

    // happens EVERY TICK while the game is runnning
    update() {
       
    }
}