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
                850, Vars.cardHeight + 5, 
                Vars.success0, 0.2); // (x-coor, y-coor, width, height, fillColor, alpha)
            scene.playerHandArea.setStrokeStyle(4, Vars.success0); // (width, color)
            // scene.playerHandArea.fillStyle()

            // PLAYER DECK AREA
            scene.playerDeckArea = scene.add.rectangle(
                1010, Vars.gameHeight - Vars.cardHeight / 2 - 30,
                Vars.cardWidth + 5, Vars.cardHeight + 5, 
                Vars.primary0, 0.2); // (x-coor, y-coor, width, height, fillColor, alpha)
            scene.playerDeckArea.setStrokeStyle(4, Vars.primary0);
            scene.DeckHandler.dealCard(1010, Vars.gameHeight - Vars.cardHeight / 2 - 30, "cardBack", "playerCard").disableInteractive();

            // OPPONENT AREA
            scene.opponentHandArea = scene.add.rectangle(
                470, Vars.cardHeight / 2 + 30,
                850, Vars.cardHeight + 5, 
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
            scene.cardsLeftText = scene.add.text(1100, Vars.gameHeight - Vars.cardHeight / 2 - 60, "Cards left:", Vars.fontStyleMedium);
            scene.cardsLeftText.setVisible(false);
            scene.cardsLeftNumber = scene.add.text(1100, Vars.gameHeight - Vars.cardHeight / 2, "27", Vars.fontStyleMedium);
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

        this.buildWelcomeUI = () => {
            this.buidGameText();

            if (scene.roomType === "random") {
                this.toggleUIText("randomRoomText", true);
            } else if (scene.roomType === "new") {
                this.toggleUIText("roomCodeText", true);
                this.toggleUIText("copyText", true);
            }
        }

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

        this.codeCopied = () => {
            scene.copyText.setText("Code copied!")
            centerText(scene.copyText);
        }
    }
}

function centerText(text) {
    text.x = ((Vars.gameWidth - text.width) / 2);
}