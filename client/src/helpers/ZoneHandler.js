/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary ZoneHandler class. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/helpers/ZoneHandler.js

Original code creates a dropZone  and renders its outline.
This one extends it by adding more data to the dropZone and filling the shape with color
*/

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
        // renders dropZone graphics on screen
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, Vars.warning0);
            dropZoneOutline.fillStyle(Vars.warning0, 0.2);
            // fill the shape
            dropZoneOutline.fillRect(
                dropZone.x - dropZone.input.hitArea.width / 2, 
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height
            );
            // create outline
            dropZoneOutline.strokeRect(
                dropZone.x - dropZone.input.hitArea.width / 2, 
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height)
        }
    }
}