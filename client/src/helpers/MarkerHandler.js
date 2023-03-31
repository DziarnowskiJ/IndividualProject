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
            graphics.lineStyle(0, Vars.secondary0)

            if (captured === "won") {
                graphics.fillStyle(Vars.success0);
            } else if (captured === "lost") {
                graphics.fillStyle(Vars.danger0);
            } else {
                graphics.fillStyle(Vars.secondary0);
            }

            graphics.strokeRect(marker.x, marker.y, marker.width, marker.height);
            graphics.fillRectShape(marker);
        }
    }
}
