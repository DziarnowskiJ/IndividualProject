/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary UIHandler class. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/helpers/UIHandler.js

The method of executing the code was copied from the sominator's project. 
First the separate methods are created for rendering specific parts of the UI and 
then one method combines them together.
Additioanlly, 3 methods are almost a direct copy:
- this.buildZones
    --> this project creates 9 zones instead of 1, but the core of the method is similar
- this.buildPlayerAreas
    --> in this project opponentDeckArea was removed
    --> cardBack is rendered on playerDeckArea
    --> all card areas are filled with color, which is not the case in sominator's project
- this.buildGameUI (in sominator's project this.buildUI)
    --> contains additional function that toggle or untoggle game text 
*/

import ZoneHandler from "./ZoneHandler";
const { Vars } = require('../vars.js');

export default class UIHandler {
    constructor(scene) {

        // Create drop zone
        this.zoneHandler = new ZoneHandler(scene);

        // create 9 drop zones and render them on screen
        this.buildZones = () => {
            scene.dropZones = {}
            for (let i = 0; i < 9; i++) {
                scene.dropZones["zone" + i] = this.zoneHandler.renderZone(110 + i * (Vars.cardWidth + 22.5), Vars.gameHeight / 2).setName("zone" + i);
                this.zoneHandler.renderOutline(scene.dropZones["zone" + i]);
            }
        }

        // create 9 markers and render them 
        this.buildMarkers = () => {
            scene.markers = {};
            for (let i = 0; i < 9; i++) {
                scene.markers["marker" + i] = scene.MarkerHandler.renderMarker(45 + i * (Vars.cardWidth + 22.5), Vars.gameHeight / 2 - Vars.dropZoneCardOffset + 10);
                scene.MarkerHandler.renderMarkerGraphics(scene.markers["marker" + i], "");
            }
        }

        this.buildPlayerAreas = () => {
            // PLAYER AREA
            scene.playerHandArea = scene.add.rectangle(
                470, Vars.gameHeight - Vars.cardHeight / 2 - 30,
                Vars.cardAreaWidth, Vars.cardAreaHeight,
                Vars.success0, 0.2); // (x-coor, y-coor, width, height, fillColor, alpha)
            scene.playerHandArea.setStrokeStyle(4, Vars.success0); // (width, color)
            // scene.playerHandArea.fillStyle()

            // PLAYER DECK AREA
            scene.playerDeckArea = scene.add.rectangle(
                1010, Vars.gameHeight - Vars.cardHeight / 2 - 30,
                Vars.deckAreaWidth, Vars.deckAreaHeight,
                Vars.primary0, 0.2); // (x-coor, y-coor, width, height, fillColor, alpha)
            scene.playerDeckArea.setStrokeStyle(4, Vars.primary0);
            scene.deckCard = scene.DeckHandler.dealCard(1010, Vars.gameHeight - Vars.cardHeight / 2 - 30, "cardBack", "playerCard").disableInteractive();

            // OPPONENT AREA
            scene.opponentHandArea = scene.add.rectangle(
                470, Vars.cardHeight / 2 + 30,
                Vars.cardAreaWidth, Vars.cardAreaHeight,
                Vars.danger0, 0.2); // (x-coor, y-coor, width, height, fillColor, alpha)
            scene.opponentHandArea.setStrokeStyle(4, Vars.danger0); // (width, color)

        }

        // Create text for UI
        this.buidGameText = () => {

            // Text starting the game
            // later it indicates whose turn it is 
            scene.infoText = scene.add.text(960, Vars.cardHeight / 2, "[Start the game!]", Vars.fontStyleMedium);
            scene.infoText.setVisible(false);
            scene.infoText.setInteractive();

            // welcoming text when joining random room
            scene.randomRoomText = scene.add.text(0, 450, ["For now all random rooms are full", "Wait for other player to join you!"], Vars.fontStyleLarge)
            centerText(scene.randomRoomText);
            scene.randomRoomText.setVisible(false);

            // welcoming text when creating new room
            scene.roomCodeText = scene.add.text(0, 350, ["You created a new room\n", "Share the room code with another player\n", "Room-code: " + scene.roomCode], Vars.fontStyleLarge);
            centerText(scene.roomCodeText);
            scene.roomCodeText.setVisible(false);

            // text encouraging to click it to copy the room code
            scene.copyText = scene.add.text(0, 700, "[Click to copy code]", Vars.fontStyleSmall);
            centerText(scene.copyText);
            scene.copyText.setVisible(false);
            scene.copyText.setInteractive();

            // text showing how many cards are left
            scene.cardsLeftText = scene.add.text(1090, Vars.gameHeight - Vars.cardHeight / 2 - 80, "Cards left\nin the deck:", Vars.fontStyleMedium);
            scene.cardsLeftText.setVisible(false);
            scene.cardsLeftNumber = scene.add.text(1160, Vars.gameHeight - Vars.cardHeight / 2, "27", Vars.fontStyleMedium);
            scene.cardsLeftNumber.setVisible(false);

        }

        // Evokes game UI building sub-functions
        this.buildGameUI = () => {
            this.buildZones();
            this.buildMarkers();
            this.buildPlayerAreas();

            this.toggleUIText("roomCodeText", false);
            this.toggleUIText("copyText", false);
            this.toggleUIText("randomRoomText", false);

            this.toggleUIText("infoText", true);
            this.toggleUIText("cardsLeftText", true);
            this.toggleUIText("cardsLeftNumber", true);
        }

        /**
         * Builds welcome UI
         * Depending on room type (random | new)
         * it will show different message to the player
         */
        this.buildWelcomeUI = () => {
            this.buidGameText();

            if (scene.roomType === "random") {
                this.toggleUIText("randomRoomText", true);
            } else if (scene.roomType === "new") {
                this.toggleUIText("roomCodeText", true);
                this.toggleUIText("copyText", true);
            }
        }

        /** Function that shows/hides UI text
         * 
         * @param {*} text text to be affected
         * @param {*} state show text [true | false] 
         */
        this.toggleUIText = (text, state) => {
            switch (text) {
                case "infoText":
                    scene.infoText.setVisible(state);
                    break;
                case "randomRoomText":
                    scene.randomRoomText.setVisible(state);
                    break;
                case "roomCodeText":
                    scene.roomCodeText.setVisible(state);
                    break;
                case "copyText":
                    scene.copyText.setVisible(state);
                    break;
                case "cardsLeftText":
                    scene.cardsLeftText.setVisible(state);
                    break;
                case "cardsLeftNumber":
                    scene.cardsLeftNumber.setVisible(state);
                    break;
            }
        }

        /**
         * Change copyText text and center it on screen
         */
        this.codeCopied = () => {
            scene.copyText.setText("Code copied!")
            centerText(scene.copyText);
        }

        this.infoTextBlock = (block) => {
            if (block)
                scene.infoText.setText("You are blocked!\n Opponent's turn");
            else
                scene.infoText.setText("Opponent is blocked!\n Your turn!");
            scene.infoText.x = 940;
        }
    }
}

/** Centralises the text with regard to the whole game screen
 * @param {*} text text to be centered
 */
function centerText(text) {
    text.x = ((Vars.gameWidth - text.width) / 2);
}