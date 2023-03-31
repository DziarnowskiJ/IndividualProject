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
        // load all 54 cards (6 domains, 9 cards each)
        let domains = ["A", "B", "C", "D", "E", "F"];
        for (let i = 0; i < domains.length; i++ ) {
            for (let j = 1; j <= 9; j++) {
                this.load.image(domains[i] + j, 'src/assets/cardDeck/domain' + domains[i] + '/' + domains[i] + " (" + j + ')'+ '.png');
            }
        }
        // load backside of card
        this.load.image('back', 'src/assets/cardDeck/backside.png');
    }

    // happens WHEN the game is created
    create() {
        this.MarkerHandler = new MarkerHandler(this);
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildWelcomeUI();
        this.InteractiveHandler = new InteractiveHandler(this);
    }

    // happens EVERY TICK while the game is runnning
    update() {
       
    }
}