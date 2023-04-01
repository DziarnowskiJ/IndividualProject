import Phaser from 'phaser';
import Game from './scenes/game.js';
import Intro from './scenes/intro.js';
import GameOver from './scenes/gameOver.js';
import RoomError from './scenes/roomError.js';
const {Vars} = require("./vars.js");

const config = {
    type: Phaser.AUTO,
    // center the game window horizontally
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    dom: {
        createContainer: true
    },
    // set html parent container
    parent: "gameContainer",
    // game dimentions
    scale: {
        mode: Phaser.Scale.FIT,
        width: Vars.gameWidth,
        height: Vars.gameHeight
    },
    // game scenes
    scene: [
        Intro,
        Game,
        GameOver, 
        RoomError,
    ]
};

const game = new Phaser.Game(config);
