export default class ZoneHandler {
    constructor(scene) {
        // create drop zone for the cards
        this.renderZone = (x, y) => {
            // TODO: Implement more drop zones
            let dropZone = scene.add.zone(x, y, 850, 230).setRectangleDropZone(850, 230)
            dropZone.setData({
                cards: 0
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