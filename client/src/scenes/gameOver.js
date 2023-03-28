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

        var gameOverText = this.add.text(0, 300, "GAME OVER",
            { color: '#00FFFF', fontFamily: 'Arial', fontSize: '32px' })
        gameOverText.x = ((Vars.gameWidth - gameOverText.width) / 2);

        var text = this.add.text(0, 500, '',
            { color: '#00FFFF', fontFamily: 'Arial', fontSize: '32px', align: "center" });

        switch (this.status) {
            case "disconnected":
                text.setText("Other player disconnected!\nSorry")
                break;
            case "won":
                text.setText("Congratulations, you won!")
                break;
            case "lost":
                text.setText("You lost! Better luck next time")
                break;
            case "serverFailure":
                text.setText("Sorry, you were disconnected due to server failure")
        }

        text.x = ((Vars.gameWidth - text.width) / 2);

        var playAgain = this.add.text(
            0, 800, "Play Again",
            { color: '#00FFFF', fontFamily: 'Arial', fontSize: '32px' });
        playAgain.x = ((Vars.gameWidth - playAgain.width) / 2);
        playAgain.setInteractive();

        playAgain.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('Intro');
        })

        playAgain.on('pointerover', () => {
            playAgain.setColor('#FF00FF');
        })

        playAgain.on('pointerout', () => {
            playAgain.setColor('#00FFFF');
        })

    }

    // happens EVERY TICK while the game is runnning
    update() {

    }
}