export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initialising";
        this.isMyTurn = false;        

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            if (this.gameState === "Ready") {
                this.updateInfoText();
            }
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
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