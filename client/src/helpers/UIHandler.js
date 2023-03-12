import ZoneHandler from "./ZoneHandler";
import MarkerHandler from "./MakerHandler";
const { Vars } = require('../vars.js');

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
            // Text that starts the game
            // Before both of the players connect it says:
            // "Waiting for other player",
            // When second one connects it changes to:
            // "Start the game!"
            // Later it accordingly aternates between
            // "Your turn!" and "Opponent's turn"
            scene.dealCards = scene.add.text(960, Vars.cardHeight / 2 + 15, "Waiting for other player");
            scene.dealCards.setFontSize(24);
            scene.dealCards.setFontFamily("Trebuchet MS");
        }

        // Evokes UI building sub-functions
        this.buildUI = () => {
            this.buildZones();
            this.buildMarkers();
            this.buildPlayerAreas();
            this.buidGameText();
        }
    }
}