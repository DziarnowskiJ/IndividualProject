export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initialising";
        this.isMyTurn = false;

        // TODO: Possibly convert to one deck
        // TODO: move to deck handler
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

            if (gameState === "Initialising")
                scene.UIHandler.buildGameUI();
            else if (gameState === "Ready")
                this.updateInfoText();
                
        }

        // TODO: find middle point and center the text
        this.updateInfoText = () => {
            if (this.isMyTurn) {
                scene.infoText.setText("Your turn!")
            }
            else {
                scene.infoText.setText("Opponent's turn")
            }
        }

        this.gameOver = (state) => {
            this.changeGameScene("GameOver", state, true);
        }

        this.handleRoomError = (state) => {
            this.changeGameScene("RoomError", state, true);
        }

        this.changeGameScene = (newScene, sceneData, closeSocket) => {

            // close socket
            if (closeSocket) {
                scene.socket.removeAllListeners();
                scene.socket.close();
            }

            // switch to new scene
            scene.scene.stop();
            scene.scene.start(newScene, sceneData);
        }
    }
}