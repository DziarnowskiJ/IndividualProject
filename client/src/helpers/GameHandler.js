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
            // NOTE: client console log
            console.log("isMyTurn = " + this.isMyTurn);

            if (this.gameState === "Ready") {
                this.updateInfoText();
            }
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            // NOTE: client console log
            console.log("gameState = " + this.gameState);

            this.updateInfoText();
        }

        this.updateInfoText = () => {
            if (this.isMyTurn) {
                scene.infoText.setText("Your turn!")
            }
            else {
                scene.infoText.setText("Opponent's turn")
            }
        }

        this.gameOver = (state) => {
            // close socket
            scene.socket.close();
            // stop current scene (prevents problems on server's restart)
            scene.scene.stop('Game');
            // change scene to GameOver
            scene.scene.start("GameOver", state);
        }
    }
}