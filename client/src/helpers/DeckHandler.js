import CardBack from './cards/CardBack';
import CardFront from './cards/CardFront';
import Card from './Card';

// export default class DeckHandler {
//     constructor(scene) {
//         this.scene = scene;
//         this.playerDeck = [];
//         this.opponentDeck = [];
//         this.playerHand = [];
//         this.opponentHand = [];

//         /** render a card on screen
//          * 
//          * @param {*} x x-location of card
//          * @param {*} y y-location of card
//          * @param {*} name [cardBack | cardFront] 
//          * @param {*} type type of the cards (domain and value)
//          * @returns 
//          */
//         this.dealCard = (x, y, name, type) => {
//             let newCard;
//             if (name === "cardBack") {
//                 newCard = new CardBack(scene);
//             } else {
//                 newCard = new CardFront(scene, name);
//             }
//             return (newCard.render(x, y, type));
//         }
//     }
// }

export default class DeckHandler {
    constructor(scene) {
        this.scene = scene;
        this.playerDeck = [];
        this.opponentDeck = [];
        this.playerHand = [];
        this.opponentHand = [];

        /** render a card on screen
         * 
         * @param {*} x x-location of card
         * @param {*} y y-location of card
         * @param {*} name - card name (Domain and Value | "cardBack") 
         * @param {*} isDraggable - (true | false) - rendered card can be dragged
         * @returns 
         */
        this.dealCard = (x, y, name, isDraggable) => {
            let newCard;
            if (name === "cardBack") {
                newCard = new Card(this.scene, x, y, "back");
            } else {
                newCard = new Card(this.scene, x, y, name);
                newCard.setInteractive(scene.input.makePixelPerfect());
                if (isDraggable)
                    this.scene.input.setDraggable(newCard);
            }
            this.scene.add.existing(newCard)

            return newCard;
        }

        this.changeCardGraphics = () => {
            if (scene.deckType === "normal") {
                scene.deckType = "my"
            } else {
                scene.deckType = "normal"
            }
            let myCards = scene.children.list.filter(x => x instanceof Card);
            for (let card of myCards) {
                card.updateTexture()
            }
        }
    }
}