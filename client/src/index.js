import Phaser from 'phaser';
import Game from './scenes/game.js';
import Intro from './scenes/intro.js';
const {Vars} = require("./vars.js");

const config = {
    type: Phaser.AUTO,
    dom: {
        createContainer: true
    },
    parent: "gameContainer",
    scale: {
        mode: Phaser.Scale.FIT,
        width: Vars.gameWidth,
        height: Vars.gameHeight
    },
    scene: [
        Intro,
        Game  
    ]
};

const game = new Phaser.Game(config);
