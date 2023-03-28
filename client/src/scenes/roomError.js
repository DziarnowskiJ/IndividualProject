var { Vars } = require("../vars.js")

export default class RoomError extends Phaser.Scene {
    constructor() {
        super({
            key: 'RoomError'
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

        let textContent = [
            "Sorry",
            "",
            "The room you are trying to join",
        ]

        switch (this.status) {
            case "noRoom":
                textContent.push("does not exist")
                break;
            case "full":
                textContent.push("is full")
                break;
        }

        var text = this.add.text(0, 300, textContent,
            { color: '#00FFFF', fontFamily: 'Arial', fontSize: '32px', align: "center" })
            text.x = ((Vars.gameWidth - text.width) / 2);

        var playAgain = this.add.text(
            0, 800, "Try Again",
            { color: '#00FFFF', fontFamily: 'Arial', fontSize: '32px' });
        playAgain.x = ((Vars.gameWidth - playAgain.width) / 2);
        playAgain.setInteractive();

        playAgain.on('pointerdown', () => {
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