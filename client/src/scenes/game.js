import CardHandler from "../helpers/CardHandler";
import DeckHandler from "../helpers/DeckHandler";
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler";
import SocketHandler from "../helpers/SocketHandler";
import UIHandler from "../helpers/UIHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    // happens BEFORE the game is created
    preload() {
        // TODO: Swap for other cards
        this.load.image('spades', 'src/assets/spades.png')
        this.load.image('clubs', 'src/assets/clubs.png')
        this.load.image('diamonds', 'src/assets/diamonds.png')
        this.load.image('hearts', 'src/assets/hearts.png')
        this.load.image('back', 'src/assets/backside.png')
    }

    // happens WHEN the game is created
    create() {
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();
        this.InteractiveHandler = new InteractiveHandler(this);
    }

    // happens in some time interval while the game is runnning
    update() {
       
    }
}