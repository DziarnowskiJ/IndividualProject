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
            else if (gameState === "Over")
                scene.socket.close();
        }

        /** Inform player who is blocked */
        this.blockPlayer = (blockPlayer) => {
            scene.UIHandler.infoTextBlock(blockPlayer);
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

        /** Finish the game
         * 
         * @param {*} state ["won" | "lost" | "disconnect"]
         */
        this.gameOver = (state) => {
            this.changeGameScene("GameOver", state);
        }

        /** Switch scene to RoomError
         * 
         * @param {*} state data to be passed to new scene ["noRoom" | "full"]
         */
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