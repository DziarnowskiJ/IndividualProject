import Phaser from 'phaser';
import Game from './scenes/game.js';
import Intro from './scenes/intro.js';
import GameOver from './scenes/gameOver.js';
import RoomError from './scenes/roomError.js';
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
        Game,
        GameOver, 
        RoomError,
    ]
};

const game = new Phaser.Game(config);
