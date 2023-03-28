const { Vars } = require('../vars.js');

export default class MarkerHandler {
    constructor(scene) {
        this.renderMarker = (x, y) => {
            let markerWidth = Vars.markerWidth;
            let markerHeight = Vars.markerHeight;

            let marker = new Phaser.Geom.Rectangle(x, y, markerWidth, markerHeight);          

            return marker
        }
        
        this.renderMarkerGraphics = (marker, captured) => {
            let graphics = scene.add.graphics();
            graphics.lineStyle(2, 0xFFFFFF)

            if (captured === "won") {
                graphics.fillStyle(0x00FF00);
            } else if (captured === "lost") {
                graphics.fillStyle(0xFF0000);
            } else {
                graphics.fillStyle(0x444444);
            }

            graphics.strokeRect(marker.x, marker.y, marker.width, marker.height);
            graphics.fillRectShape(marker);
        }
    }
}
