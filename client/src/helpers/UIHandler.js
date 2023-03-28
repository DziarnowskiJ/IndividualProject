import ZoneHandler from "./ZoneHandler";
const { Vars } = require('../vars.js');

// TODO: before other player joins put only info text with room code + copy
// later build UI with start the game text in top rigth corner
export default class UIHandler {
    constructor(scene) {

        // Create drop zone
        this.zoneHandler = new ZoneHandler(scene);

        // create 9 drop zones and render them on screen
        this.buildZones = () => {
            scene.dropZones = {}
            for (let i = 0; i < 9; i++) {
                scene.dropZones["zone" + i] = this.zoneHandler.renderZone(110 + i * (Vars.cardWidth + 25), Vars.gameHeight / 2).setName("zone" + i);
                this.zoneHandler.renderOutline(scene.dropZones["zone" + i]);
            }
        }

        // create 9 markers and render them 
        this.buildMarkers = () => {
            scene.markers = {};
            for (let i = 0; i < 9; i++) {
                scene.markers["marker" + i] = scene.MarkerHandler.renderMarker(48 + i * (Vars.cardWidth + 25), Vars.gameHeight / 2 - Vars.dropZoneCardOffset + 10);
                scene.MarkerHandler.renderMarkerGraphics(scene.markers["marker" + i], "");
            }
        }

        this.buildPlayerAreas = () => {
            // PLAYER AREA
            scene.playerHandArea = scene.add.rectangle(
                470,
                Vars.gameHeight - Vars.cardHeight / 2 - 30,
                850,
                Vars.cardHeight + 5); // (x-coor, y-coor, width, height)
            scene.playerHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
            // TODO: Remove deck area / Show how many cards are left
            scene.DeckHandler.dealCard(1010, Vars.gameHeight - Vars.cardHeight / 2 - 30, "cardBack", "playerCard").disableInteractive();
            scene.playerDeckArea = scene.add.rectangle(
                1010,
                Vars.gameHeight - Vars.cardHeight / 2 - 30,
                Vars.cardWidth + 5,
                Vars.cardHeight + 5);    // 1000, 860, 155, 250
            scene.playerDeckArea.setStrokeStyle(4, 0x0000FF);

            // OPPONENT AREA
            scene.opponentHandArea = scene.add.rectangle(
                470,
                Vars.cardHeight / 2 + 30,
                850,
                Vars.cardHeight + 5); // (x-coor, y-coor, width, height)
            scene.opponentHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
        }

        // Create text for UI
        this.buidGameText = () => {

            scene.infoText = scene.add.text(960, Vars.cardHeight / 2, "Start the game!", { align: "center" });
            scene.infoText.setFontSize(30);
            scene.infoText.setFontFamily("Trebuchet MS");
            scene.infoText.setInteractive();
            scene.infoText.setColor('#00FFFF');
            scene.infoText.setVisible(false);


            scene.randomRoomText = scene.add.text(0, 450, ["For now all random rooms are full", "Wait for other player to join you!"], { align: "center" })
            scene.randomRoomText.setFontSize(36);
            scene.randomRoomText.setFontFamily("Trebuchet MS");
            scene.randomRoomText.x = ((Vars.gameWidth - scene.randomRoomText.width) / 2);
            scene.randomRoomText.setVisible(false);

            scene.roomCodeText = scene.add.text(0, 450, ("Room-code:\n" + scene.roomCode), { align: "center" });
            scene.roomCodeText.setFontSize(36);
            scene.roomCodeText.setFontFamily("Trebuchet MS");
            scene.roomCodeText.x = ((Vars.gameWidth - scene.roomCodeText.width) / 2);
            scene.roomCodeText.setVisible(false);


            scene.copyText = scene.add.text(960, Vars.cardHeight / 2 + 70, "[Click to copy code]", { align: "center" });
            scene.copyText.setFontSize(20);
            scene.copyText.setFontFamily("Trebuchet MS");
            scene.copyText.setInteractive();
            scene.copyText.setVisible(false);
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
            }
        }
    }
}