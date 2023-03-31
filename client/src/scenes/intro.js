var { Vars } = require("../vars.js")

export default class Intro extends Phaser.Scene {
    constructor() {
        super({
            key: 'Intro'
        })
    }

    // happens BEFORE the game is created
    preload() {

        this.load.html('introPage', './src/assets/html/intro.html');

    }

    // happens WHEN the game is created
    create() {

        let joinText = this.add.text(0, 700, 'Choose type of room', Vars.fontStyleMedium);
        joinText.x = ((Vars.gameWidth - joinText.width) / 2);

        var element = this.add.dom(Vars.gameWidth / 2, 600).createFromCache('introPage');
        element.setPerspective(600);
        element.setScale(2);

        element.addListener('click');

        let data = {
            roomCode: null,
            roomType: null
        };

        var roomCodeInput = Phaser.DOM.GetTarget('roomCode')

        element.on('click', function (event) {
            if (event.target.id === 'randomBtn') {
                data.roomCode = generateString(8);
                data.roomType = "random";
                roomCodeInput.style.opacity = 0;
                roomCodeInput.classList.remove("inputWarning");
            } else if (event.target.id === 'createBtn') {
                data.roomCode = generateString(8);
                data.roomType = "new";
                roomCodeInput.style.opacity = 0;
                roomCodeInput.classList.remove("inputWarning");
            } else if (event.target.id === 'joinBtn') {
                roomCodeInput.style.opacity = 1;
                data.roomCode = roomCodeInput.value;
                data.roomType = "join";
            }
            
            if (data != undefined) {
                joinText.setText("[Join room!]").setInteractive();
                joinText.x = ((Vars.gameWidth - joinText.width) / 2);
            }
        });

        this.tweens.add({
            targets: element,
            y: 400,
            duration: 2000,
            ease: 'Power3'
        });

        joinText.on('pointerup', () => {
            if (data.roomType === "join") {
                let joinRoomCode = roomCodeInput.value;
                if (joinRoomCode && joinRoomCode !== "") {
                    data.roomCode = joinRoomCode;
                } else {
                    roomCodeInput.classList.add("inputWarning");
                    roomCodeInput.placeholder = "Enter room code!";
                }
            }
            if (data.roomCode && data.roomType) {
                this.scene.stop();
                this.scene.start('Game', data);
            }
        })

        joinText.on('pointerover', () => {
            joinText.setColor(Vars.hoverColor);
        })

        joinText.on('pointerout', () => {
            joinText.setColor(Vars.primary);
        })

    }

    // happens EVERY TICK while the game is runnning
    update() {

    }
}


// TODO: ADD SOURCE https://www.programiz.com/javascript/examples/generate-random-strings

// program to generate random strings

// declare all characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
