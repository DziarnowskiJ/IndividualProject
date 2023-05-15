/* 
Credit where credit is due

Method generateString comes from article "JavaScript Program to Generate Random String" form Programiz
available at: https://www.programiz.com/javascript/examples/generate-random-strings

It was slightly modified - few charactes were removed from the characters variable
in order to prevent user's confusion over similar characters
*/

var { Vars } = require("../vars.js")

export default class Intro extends Phaser.Scene {
    constructor() {
        super({
            key: 'Intro'
        })
    }

    // happens BEFORE the game is created
    preload() {

        // load html with buttons and input field
        this.load.html('introPage', './src/assets/html/intro.html');

    }

    // happens WHEN the game is created
    create() {

        // create join text message
        let joinText = this.add.text(0, 700, 'Choose type of room', Vars.fontStyleMedium);
        joinText.x = ((Vars.gameWidth - joinText.width) / 2);

        // show loaded html in game
        var element = this.add.dom(Vars.gameWidth / 2, 600).createFromCache('introPage');
        element.setPerspective(600);
        element.setScale(2);

        element.addListener('click');

        let data = {
            roomCode: null,
            roomType: null,
            deckType: "normal"
        };

        var roomCodeInput = Phaser.DOM.GetTarget('roomCode')

        // determin room type and room code depending on the button pressed
        element.on('click', function (event) {
            if (event.target.id === 'randomBtn') {
                setVisible(roomCodeInput, false);
                setWarning(roomCodeInput, false);

                data.roomCode = generateString(8);
                data.roomType = "random";
            } else if (event.target.id === 'createBtn') {
                setVisible(roomCodeInput, false);
                setWarning(roomCodeInput, false);

                data.roomCode = generateString(8);
                data.roomType = "new";
            } else if (event.target.id === 'joinBtn') {
                setVisible(roomCodeInput, true);
                setWarning(roomCodeInput, false);
                roomCodeInput.value = null;
                roomCodeInput.placeholder = "Room code";

                data.roomCode = roomCodeInput.value;
                data.roomType = "join";
            }

            // change text to joinn room
            if (data.roomType) {
                joinText.setText("[Join room!]").setInteractive();
                joinText.x = ((Vars.gameWidth - joinText.width) / 2);
            }
        });

        // make html slide from the bottom
        this.tweens.add({
            targets: element,
            y: 400,
            duration: 2000,
            ease: 'Power3'
        });

        // INTERACTIVITY FOR joinText
        joinText.on('pointerup', () => {
            if (data.roomType === "join") {
                let joinRoomCode = roomCodeInput.value;
                if (joinRoomCode && joinRoomCode !== "") {
                    data.roomCode = joinRoomCode;
                } else {
                    // in the room code for joinRoom was not given alert the player
                    setWarning(roomCodeInput, true);
                    roomCodeInput.placeholder = "Enter room code!";
                }
            }
            // switch game scene to Game
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
        // NOTE: comment before actual deployment
        // instantly connect to random room
        // !!! only for dev
        // !!! only for two clients
        // let data = {
        //     roomCode: 1,
        //     roomType: "random",
        //     deckType: "normal"
        // };
        // this.scene.stop();
        // this.scene.start("Game", data);
    }
}

/**
 * Change opacity of HTML object
 * @param {*} object HTML object
 * @param {*} isVisible 
 */
function setVisible(object, isVisible) {
    if (isVisible) {
        object.style.opacity = 1;
    } else {
        object.style.opacity = 0;
    }
}

/**
 * Add and remove necessary classes such that the HTML 
 * object will indicate a warning 
 * @param {*} object HTML object 
 * @param {*} isWarning 
 */
function setWarning(object, isWarning) {
    if (isWarning) {
        object.classList.remove("valid");
        object.classList.remove("border-primary");
        object.classList.remove("text-primary");

        object.classList.add("is-invalid");
        object.classList.add("warning");
        object.classList.add("border-danger");
        object.classList.add("text-danger");
    } else {
        object.classList.remove("warning");
        object.classList.remove("border-danger");
        object.classList.remove("text-danger");
        object.classList.remove("is-invalid");

        object.classList.add("valid");
        object.classList.add("border-primary");
        object.classList.add("text-primary");
    }
}

// Generate random strings

// declare all characters
const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
// Note: Characters 'O', '0', 'I' and 'l' were intentionally removed
// because they migh be hard to differentiate depending on the font type

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}