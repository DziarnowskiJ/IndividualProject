import CardBack from './cards/CardBack';
import CardFront from './cards/CardFront';


export default class DeckHandler {
    constructor(scene) {
        this.playerDeck = [];
        this.opponentDeck = [];
        this.playerHand = [];
        this.opponentHand = [];

        
        /** render a card on screen
         * 
         * @param {*} x x-location of card
         * @param {*} y y-location of card
         * @param {*} name [cardBack | cardFront] 
         * @param {*} type type of the cards (domain and value)
         * @returns 
         */
        this.dealCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                cardFront: new CardFront(scene, name),
            }
            let newCard;
            if (name === "cardBack") {
                newCard = cards["cardBack"];
            } else {
                newCard = cards["cardFront"];
            }
            return (newCard.render(x, y, type));
        }
    }
}