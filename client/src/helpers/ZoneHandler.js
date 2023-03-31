const {Vars} = require('../vars.js');

export default class ZoneHandler {
    constructor(scene) {
        // create drop zone for the cards
        this.renderZone = (x, y) => {
            let dropZoneWidth = Vars.dropZoneWidth;
            let dropZoneHeight = Vars.dropZoneHeight;
            let dropZone = scene.add.zone(x, y, dropZoneWidth, dropZoneHeight);
            dropZone.setRectangleDropZone(dropZoneWidth, dropZoneHeight);
            dropZone.setData({
                opponentCards: 0,
                playerCards: 0,
                isClaimed: false
            });
            return dropZone;
        }
        // create drop zone outline
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, Vars.warning0);
            dropZoneOutline.fillStyle(Vars.warning0, 0.2);
            dropZoneOutline.fillRect(
                dropZone.x - dropZone.input.hitArea.width / 2, 
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height
            );
            dropZoneOutline.strokeRect(
                dropZone.x - dropZone.input.hitArea.width / 2, 
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height)
        }
    }
}