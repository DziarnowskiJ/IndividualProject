const { Vars } = require('../vars.js');
export default class InteractiveHandler {
    constructor(scene) {

        scene.cardPreview = null;

        /**
         *  DEAL CARDS BUTTON INTERACTION 
        */
        scene.infoText.on('pointerdown', () => {
            scene.socket.emit('dealCards', scene.socket.id);
            scene.infoText.disableInteractive();
        })

        scene.infoText.on('pointerover', () => {
            scene.infoText.setColor('#FF00FF');
        })

        scene.infoText.on('pointerout', () => {
            scene.infoText.setColor('#00FFFF');
        })

        /** 
         * CARD INTERACTION 
        */
        scene.input.on('pointerover', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            if (gameObjects[0].type === 'Image' && gameObjects[0].data.list.name !== 'cardBack') {
                scene.cardPreview = scene.add.image(
                    // pointer.worldX, pointer.worldY, 
                    gameObjects[0].x, gameObjects[0].y,
                    gameObjects[0].data.values.sprite).setScale(0.5);
            }
        })

        scene.input.on('pointerout', (event, gameObjects) => {
            if (gameObjects[0].type === 'Image' && gameObjects[0].data.list.name !== 'cardBack') {
                scene.cardPreview.setVisible(false);
            }
        })

        // make dragged card's position equal to the cursor's position
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (scene.GameHandler.gameState === "Ready") {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        })

        // make dragged card be on top of everything and set tint to it
        scene.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xff69b4);
            scene.children.bringToTop(gameObject);
            scene.cardPreview.setVisible(false);
        })

        // finish card draging
        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setTint();
            // if card is not dropped in drop zone send it back to where it started
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        // drop card in drop zone 
        // (allow only when game is ready, is my turn, and there are no more than 3 cards in the zone)
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if (scene.GameHandler.isMyTurn &&
                scene.GameHandler.gameState === "Ready" &&
                dropZone.data.values.playerCards < 3 &&
                !dropZone.data.values.isClaimed) {
                gameObject.x = dropZone.x;
                gameObject.y = (dropZone.y + Vars.dropZoneYOffset) + (dropZone.data.values.playerCards * Vars.dropZoneCardOffset);
                dropZone.data.values.playerCards++;

                scene.input.setDraggable(gameObject, false);
                scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id, dropZone.name);
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}