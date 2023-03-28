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

        var text = this.add.text(0, 800, 'Choose type of room', { color: 'white', fontFamily: 'Arial', fontSize: '32px ' });
        text.x = ((Vars.gameWidth - text.width) / 2);

        var element = this.add.dom(Vars.gameWidth / 2, 600).createFromCache('introPage');
        element.setPerspective(600);

        element.style = "width: 100%";
        // element.scale

        element.addListener('click');

        let data = {
            roomCode: null,
            roomType: null
        };

        var createRoomDiv = Phaser.DOM.GetTarget('createRoom');
        var randomRoomDiv = Phaser.DOM.GetTarget('randomRoom');
        var joinRoomDiv = Phaser.DOM.GetTarget('joinRoom');

        var roomCodeInput = Phaser.DOM.GetTarget('roomCode')

        element.on('click', function (event) {
            if (event.target.name === 'randomBtn') {
                createRoomDiv.style = "background-color: bisque";
                randomRoomDiv.style = "background-color: red";
                joinRoomDiv.style = "background-color: bisque";

                data.roomCode = generateString(8);
                data.roomType = "random";

            } else if (event.target.name === 'createBtn') {

                createRoomDiv.style = "background-color: red";
                randomRoomDiv.style = "background-color: bisque";
                joinRoomDiv.style = "background-color: bisque";

                data.roomCode = generateString(8);
                data.roomType = "new";

            } else if (event.target.name === 'joinBtn') {
                createRoomDiv.style = "background-color: bisque";
                randomRoomDiv.style = "background-color: bisque";
                joinRoomDiv.style = "background-color: red";

                data.roomCode = roomCodeInput.value;
                data.roomType = "join";
            }

            if (data != undefined) {
                text.setText("Join room!").setInteractive();
                text.x = ((Vars.gameWidth - text.width) / 2);
            }
        });

        this.tweens.add({
            targets: element,
            y: 400,
            duration: 2000,
            ease: 'Power3'
        });

        // text.input.on('pointerup', function (pointer) {
        this.input.on('pointerup', function (pointer) {
            if (data.roomCode && data.roomType) {
                this.scene.stop();
                this.scene.start('Game', data);
            } else if (data.roomType === "join" && !data.roomCode) {
                roomCodeInput.style = "border: solid 2px red;";
                roomCodeInput.placeholder = "Enter room code!"
            }
        }, this);
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
