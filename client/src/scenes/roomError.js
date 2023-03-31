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

        var text = this.add.text(0, 300, textContent, Vars.fontStyleLarge)
            text.x = ((Vars.gameWidth - text.width) / 2);

        var playAgain = this.add.text(0, 800, "[Try Again]", Vars.fontStyleMedium);
        playAgain.x = ((Vars.gameWidth - playAgain.width) / 2);
        playAgain.setInteractive();

        playAgain.on('pointerup', () => {
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