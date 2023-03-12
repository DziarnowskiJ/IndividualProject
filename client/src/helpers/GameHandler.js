export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initialising";
        this.isMyTurn = false;

        // TODO: Possibly convert to one deck
        // altetnatively split the full deck between two players 
        // since eventually they will play the same number of cards it should not matter
        this.playerDeck = [];
        this.opponentDeck = [];
        this.playerHand = [];
        this.opponentHand = [];

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            console.log("isMyTurn = " + this.isMyTurn);

            if (this.gameState === "Ready") {
                this.updateDealCardsText();
            }
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            console.log("gameState = " + this.gameState)

            this.updateDealCardsText();
        }

        this.updateDealCardsText = () => {
            if (this.isMyTurn) {
                scene.dealCards.setText("Your turn!")
            }
            else {
                scene.dealCards.setText("Opponent's turn")
            }
        }
    }
}