/* 
Credit where credit is due

Values for all of the color variables (except hoverColor) comes from Bootsrap 5
available at: https://getbootstrap.com/docs/5.3/customize/color/#theme-colors
*/

class Variables {
    constructor() {
        /** COLORS */
        // color in #HEX form
        this.primary = "#0074d9";
        this.secondary = "#adb6bd";
        this.danger = "#dc3545";
        this.success = "#198754";
        this.warning = "#ffc107";
        this.hoverColor = "#FF00FF";

        // colors in 0x form 
        // (required for some Phaser functionality)
        this.primary0 = 0x0074d9;
        this.secondary0 = 0xadb6bd;
        this.danger0 = 0xdc3545;
        this.success0 = 0x198754;
        this.warning0 = 0xffc107;
        this.hoverColor0 = 0xff00ff;

        /** FONTS */
        this.fontStyleLarge = {
            align: "center",
            fontSize: "50px",
            fontFamily: "Trebuchet MS",
            fill: this.primary
        };
        this.fontStyleMedium = {
            align: "center",
            fontSize: "36px",
            fontFamily: "Trebuchet MS",
            fill: this.primary
        };
        this.fontStyleSmall = {
            align: "center",
            fontSize: "26px",
            fontFamily: "Trebuchet MS",
            fill: this.primary
        };


        /** GAME CONTAINER */
        this.gameWidth = 1300;
        this.gameHeight = 1050;

        /** CARD */
        this.cardHeight = 180;
        this.cardWidth = 112.5;

        /** CARD SPRITE
         * (size of card when hoverd over)
         */
        this.largeCardHeight = 270;
        this.largeCardWidth = 225;

        /** DROPZONE */
        this.dropZoneWidth = this.cardWidth + 20;
        this.dropZoneCardOffset = 40;
        this.dropZoneYOffset = 125;
        this.dropZoneHeight = this.cardHeight + this.dropZoneCardOffset * 4 + this.dropZoneYOffset * 2 + 10;

        /** MARKER */
        this.markerWidth = this.cardWidth + 17.5;
        this.markerHeight = this.dropZoneYOffset / 2;

        /** CARD AREA */
        this.cardAreaWidth = 850;
        this.cardAreaHeight = this.cardHeight + 5;

        /** DECK AREA */
        this.deckAreaHeight = this.cardHeight + 5;
        this.deckAreaWidth = this.cardWidth + 5;
    }
};

const Vars = new Variables;
module.exports = {Vars};