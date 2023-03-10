export default class InteractiveHandler {
    constructor(scene) {

        scene.cardPreview = null;

        /**
         *  DEAL CARDS BUTTON INTERACTION 
        */
        scene.dealCards.on('pointerdown', () => {
            scene.socket.emit('dealCards', scene.socket.id);
            scene.dealCards.disableInteractive();
        })

        scene.dealCards.on('pointerover', () => {
            scene.dealCards.setColor('#FF0000');
        })

        scene.dealCards.on('pointerout', () => {
            scene.dealCards.setColor('#FF00FF');
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
                    gameObjects[0].data.values.sprite).setScale(2);
            }
        })

        scene.input.on('pointerout', (event, gameObjects) => {
            if (gameObjects[0].type === 'Image' && gameObjects[0].data.list.name !== 'cardBack') {
                scene.cardPreview.setVisible(false);
            }
        })

        // make dragged card's position equal to the cursor's position
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
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
        // (allow only when game is ready and is my turn)
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
                gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
                gameObject.y = dropZone.y;
                scene.dropZone.data.values.cards++;

                scene.input.setDraggable(gameObject, false);
                scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id);
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}