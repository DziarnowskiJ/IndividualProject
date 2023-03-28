var Vars = {
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
    markerWidth: 122.5,     // cardWidth + 10,
    markerHeight: 62.5      // dropZoneYOffset / 2,
};
module.exports = {Vars};