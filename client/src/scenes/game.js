import CardHandler from "../helpers/CardHandler";
import DeckHandler from "../helpers/DeckHandler";
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler";
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
        let domains = ["A", "B", "C", "D", "E", "F"];
        for (let i = 0; i < domains.length; i++ ) {
            for (let j = 1; j <= 9; j++) {
                this.load.image(domains[i] + j, 'src/assets/normalDeck/domain' + domains[i] + '/' + domains[i] + " (" + j + ')'+ '.png');
            }
        }
        this.load.image('back', 'src/assets/normalDeck/backside.png');
    }

    // happens WHEN the game is created
    create() {
        this.MarkerHandler = new MarkerHandler(this);
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();
        this.InteractiveHandler = new InteractiveHandler(this);
    }

    // happens EVERY TICK while the game is runnning
    update() {
       
    }
}