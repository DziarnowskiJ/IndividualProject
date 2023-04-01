var { Vars } = require("../vars.js")

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOver'
        })
    }

    init(status) {
        this.status = status;
    }

    // happens BEFORE the game is created
    preload() {

    }

    // happens WHEN the game is created
    create() {

        // show game over text
        var gameOverText = this.add.text(0, 300, "GAME OVER", Vars.fontStyleLarge);
        gameOverText.x = ((Vars.gameWidth - gameOverText.width) / 2);

        // depending on the parameter passed during creation of this scene 
        // ending message will show different message
        var text = this.add.text(0, 500, '', Vars.fontStyleLarge);

        switch (this.status) {
            case "disconnected":
                text.setText("Other player disconnected!\nSorry")
                break;
            case "won":
                text.setText("Congratulations, you won!");
                text.setColor(Vars.success);
                break;
            case "lost":
                text.setText("You lost! Better luck next time");
                text.setColor(Vars.danger);
                break;
            case "serverFailure":
                text.setText("Sorry, you were disconnected due to server failure")
                break;
        }

        text.x = ((Vars.gameWidth - text.width) / 2);

        // show playAgain message
        var playAgain = this.add.text(0, 800, "[Play Again]", Vars.fontStyleMedium);
        playAgain.x = ((Vars.gameWidth - playAgain.width) / 2);
        playAgain.setInteractive();

        // INTERACTIVITY FOR PLAY AGAIN TEXT
        playAgain.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('Intro');
        })

        playAgain.on('pointerover', () => {
            playAgain.setColor(Vars.hoverColor);
        })

        playAgain.on('pointerout', () => {
            playAgain.setColor(Vars.primary);
        })

    }

    // happens EVERY TICK while the game is runnning
    update() {

    }
}