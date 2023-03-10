import CardBack from './cards/CardBack';
// TODO: remove those imports
import Bool from './cards/Bool';
import Ping from './cards/Ping';


export default class DeckHandler {
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                // TODO: Remove those cards
                bool: new Bool(scene),
                ping: new Ping(scene)
            }
            let newCard = cards[name];
            return (newCard.render(x, y, type));
        }
    }
}