const Vars = {
    /** COLORS */
    // colors are copied from Bootstrap 5
    // TODO: reference

    // color in #HEX form
    primary: "#0074d9",
    secondary: "#adb6bd",
    danger: "#dc3545",
    success: "#198754",
    warning: "#ffc107",
    hoverColor: "#FF00FF",
    // F3F9D2
    // E6EBE0


    // colors in 0x form 
    // (required for some Phaser functionality)
    primary0: 0x0074d9,
    secondary0: 0xadb6bd,
    danger0: 0xdc3545,
    success0: 0x198754,
    warning0: 0xffc107,

    /** FONTS */
    fontStyleLarge: {
        align: "center",
        fontSize: "50px",
        fontFamily: "Trebuchet MS",
        fill: "#0074d9"
    }, 
    fontStyleMedium: {
        align: "center",
        fontSize: "36px",
        fontFamily: "Trebuchet MS",
        fill: "#0074d9"
    }, 
    fontStyleSmall: {
        align: "center",
        fontSize: "26px",
        fontFamily: "Trebuchet MS",
        fill: "#0074d9"
    }, 


    /** GAME CONTAINER */
    gameWidth: 1300,
    gameHeight: 1050,

    /** CARD */
    cardHeight: 180,
    cardWidth: 112.5,
    // cardHeight: 200,
    // cardWidth: 125,

    /** CARD SPRITE 
     * (size of card when hoverd over)
     */
    largeCardHeight: 270,
    largeCardWidth: 225,

    /** DROPZONE 
     */
    dropZoneWidth: 132.5,   // cardWidth + 20
    dropZoneHeight: 600,    // cardHeight + dropZoneCardOffset * 4 + dropZoneYOffset * 2 + 10
    dropZoneCardOffset: 40,
    dropZoneYOffset: 125,

    /** MARKER */
    markerWidth: 130,     // cardWidth + 10,
    markerHeight: 62.5      // dropZoneYOffset / 2,
};
module.exports = {Vars};