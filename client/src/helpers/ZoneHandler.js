const {Vars} = require('../vars.js');

export default class ZoneHandler {
    constructor(scene) {
        // create drop zone for the cards
        this.renderZone = (x, y) => {
            let dropZoneWidth = Vars.cardWidth + 20;
            let dropZoneHeight = (Vars.cardHeight + Vars.dropZoneCardOffset * 4 + Vars.dropZoneYOffset * 2 + 10)
            // TODO: Implement more drop zones
            let dropZone = scene.add.zone(x, y, dropZoneWidth, dropZoneHeight);
            dropZone.setRectangleDropZone(dropZoneWidth, dropZoneHeight);
            dropZone.setData({
                opponentCards: 0,
                playerCards: 0
            })
            return dropZone;
        }
        // create drop zone outline
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff00ff);
            dropZoneOutline.strokeRect(
                dropZone.x - dropZone.input.hitArea.width / 2, 
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height)
        }
    }
}