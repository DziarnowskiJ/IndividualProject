export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initialising";
        this.gameOutcome = null;
        this.isMyTurn = false;

        /** Change turn
         * changes the isMyTurn to opposite
         * If the gameState is "Ready", info text is updated
         */
        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            if (this.gameState === "Ready") {
                this.updateInfoText();
            }
        }

        /** Change game state
         * updates the game state
         * on "Initialising" build gameUI
         * on "Ready" updates info text
         * @param {*} gameState - new game state
         */
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            if (gameState === "Initialising")
                scene.UIHandler.buildGameUI();
            else if (gameState === "Ready")
                this.updateInfoText();

        }

        /** Updates infoText to show whose turn it is */
        this.updateInfoText = () => {
            if (this.isMyTurn) {
                scene.infoText.setText("Your turn!")
            }
            else {
                scene.infoText.setText("Opponent's turn")
            }
        }

        /** Finishes the game
         * 
         * @param {*} state ["won" | "lost" | "disconnect"]
         */
        this.gameOver = (state) => {
            this.changeGameScene("GameOver", state);
        }

        this.handleRoomError = (state) => {
            this.changeGameScene("RoomError", state);
        }

        /** Change game scene
         * Closes down socket and switches the scene
         * @param {*} newScene key of the new scene
         * @param {*} sceneData data that will be passed to new scene
         */
        this.changeGameScene = (newScene, sceneData) => {

            // close socket
            scene.socket.removeAllListeners();
            scene.socket.close();

            // switch to new scene
            scene.scene.stop();
            scene.scene.start(newScene, sceneData);
        }
    }
}