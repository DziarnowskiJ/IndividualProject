import ZoneHandler from "./ZoneHandler";
const {Vars} = require('../vars.js');

export default class UIHandler {
    constructor(scene) {

        // Create drop zone
        this.zoneHandler = new ZoneHandler(scene)

        this.buildZones = () => {
            // TODO: Implement more drop zones
            scene.dropZone = this.zoneHandler.renderZone(470, Vars.gameHeight/2);
            this.zoneHandler.renderOutline(scene.dropZone)
        }

        this.buildPlayerAreas = () => {
            // PLAYER AREA
            scene.playerHandArea = scene.add.rectangle(
                470, 
                Vars.gameHeight - Vars.cardHeight/2 - 30, 
                850, 
                Vars.cardHeight+5); // (x-coor, y-coor, width, height)
            scene.playerHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
            // TODO: Remove deck area
            scene.playerDeckArea = scene.add.rectangle(
                1000, 
                Vars.gameHeight - Vars.cardHeight/2 - 30,
                 Vars.cardWidth + 5, 
                 Vars.cardHeight + 5);    // 1000, 860, 155, 250
            scene.playerDeckArea.setStrokeStyle(4, 0x0000FF);

            // OPPONENT AREA
            scene.opponentHandArea = scene.add.rectangle(
                470, 
                Vars.cardHeight/2 + 30, 
                850, 
                Vars.cardHeight+5); // (x-coor, y-coor, width, height)
            scene.opponentHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
            // TODO: Remove deck area
            scene.opponentDeckArea = scene.add.rectangle(
                1000, 
                Vars.cardHeight/2 + 30, 
                Vars.cardWidth + 5, 
                Vars.cardHeight + 5);
            scene.opponentDeckArea.setStrokeStyle(4, 0x0000FF);
        }

        // Create text for UI
        this.buidGameText = () => {
            // Deal cards text
            scene.dealCards = scene.add.text(960, 445, "Deal cards");
            scene.dealCards.setFontSize(24);
            scene.dealCards.setFontFamily("Trebuchet MS");
        }

        // Evokes UI building sub-functions
        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerAreas();
            this.buidGameText();
        }
    }
}