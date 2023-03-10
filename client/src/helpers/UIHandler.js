import ZoneHandler from "./ZoneHandler";

export default class UIHandler {
    constructor(scene) {

        // Create drop zone
        this.zoneHandler = new ZoneHandler(scene)

        this.buildZones = () => {
            // TODO: Implement more drop zones
            scene.dropZone = this.zoneHandler.renderZone(470, 500);
            this.zoneHandler.renderOutline(scene.dropZone)
        }

        this.buildPlayerAreas = () => {
            // PLAYER AREA
            scene.playerHandArea = scene.add.rectangle(470, 860, 850, 230); // (x-coor, y-coor, width, height)
            scene.playerHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
            // TODO: Remove deck area
            scene.playerDeckArea = scene.add.rectangle(1000, 860, 155, 215);
            scene.playerDeckArea.setStrokeStyle(4, 0x0000FF);

            // OPPONENT AREA
            scene.opponentHandArea = scene.add.rectangle(470, 135, 850, 230); // (x-coor, y-coor, width, height)
            scene.opponentHandArea.setStrokeStyle(4, 0x00FF00); // (width, color)
            // TODO: Remove deck area
            scene.opponentDeckArea = scene.add.rectangle(1000, 135, 155, 215);
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