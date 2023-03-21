import Phaser from 'phaser';
import Game from './scenes/game.js';
const {Vars} = require("./vars.js");

const config = {
    type: Phaser.AUTO,
    parent: "gameContainer",
    scale: {
        mode: Phaser.Scale.FIT,
        width: Vars.gameWidth,
        height: Vars.gameHeight
    },
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);
