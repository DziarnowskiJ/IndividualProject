/* 
Credit where credit is due

The following code was inspierd by project developed by sominator,
`phaser-2d-multiplayer-2021-update`, particulary InteractiveHandler class. 
available at: https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/helpers/InteractiveHandler.js

Methods in CARD INTERACTION section are almost a direct copy, following changes were made:
- scene.input.on('drop', (pointer, gameObject, dropZone) 
    --> there are additional conditions that are required to drop a card
    --> coordinates of the card are 'swapped', y value changes depending on the number of cards instead of the x as it was in sominator's project
- scene.input.on('pointerover', (event, gameObjects)
    --> cardPreview shows in the middle of the original card instead of the pointer's location
- scene.input.on('drag', (pointer, gameObject, dragX, dragY)
    --> cardPreview is removed when drag happens to suport touch screen users
*/

import Card from './Card.js';

const { Vars } = require('../vars.js');
export default class InteractivityHandler {
    constructor(scene) {

        /**
         *  INFO_TEXT INTERACTION 
        */
        scene.infoText.on('pointerdown', () => {
            if (scene.GameHandler.gameState === "Initialising") {
                scene.socket.emit('dealCards', scene.socket.id);
                scene.infoText.disableInteractive();
            } else if (scene.GameHandler.gameState === "Over") {
                scene.GameHandler.gameOver(scene.GameHandler.gameOutcome)
            }
        })

        scene.infoText.on('pointerover', () => {
            scene.infoText.setColor(Vars.hoverColor);
        })

        scene.infoText.on('pointerout', () => {
            scene.infoText.setColor(Vars.primary);
        })

        /** 
         * CHANGE CARD GRAPHICS INTERACTIONS
        */
        scene.changeCards.on('pointerdown', () => {
            scene.DeckHandler.changeCardGraphics();
        })

        scene.changeCards.on('pointerover', () => {
            scene.changeCards.setColor(Vars.hoverColor);
        })

        scene.changeCards.on('pointerout', () => {
            scene.changeCards.setColor(Vars.primary);
        })

        /**
         * COPY CODE INTERACTION
        */
        scene.copyText.on('pointerdown', () => {
            // copy room code to clipboard
            navigator.clipboard.writeText(scene.roomCode);
            scene.UIHandler.codeCopied();
        })

        scene.copyText.on('pointerover', () => {
            scene.copyText.setColor(Vars.hoverColor);
        })

        scene.copyText.on('pointerout', () => {
            scene.copyText.setColor(Vars.primary);
        })

        /** 
         * CARD INTERACTION 
        */
        scene.cardPreview = null;

        // show bigger version of the card when player hvers over it
        scene.input.on('pointerover', (event, gameObjects) => {
            if (gameObjects[0] instanceof Card && gameObjects[0].name !== 'back') {
                console.log(scene.deckType + gameObjects[0].name);
                scene.cardPreview = scene.add.image(
                    // pointer.worldX, pointer.worldY, 
                    gameObjects[0].x, gameObjects[0].y,
                    // scale of the image
                    scene.deckType + gameObjects[0].name).setScale(0.9);
            }
        })

        // cancel showing bigger card when player no longer hovers over it
        scene.input.on('pointerout', (event, gameObjects) => {
            if (gameObjects[0] instanceof Card && gameObjects[0].name !== 'back') {
                scene.cardPreview.setVisible(false);
            }
        })

        // make dragged card's position equal to the cursor's position
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (scene.GameHandler.gameState === "Ready") {
                gameObject.x = dragX;
                gameObject.y = dragY;

                // required for proper touch screen interraction
                // without this bigger version of the card would still
                // be visible, even when dragging
                if (scene.cardPreview)
                    scene.cardPreview.setVisible(false);
            }
        })

        // make dragged card be on top of everything and set tint to it
        scene.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(Vars.secondary0);
            scene.children.bringToTop(gameObject);
            if (scene.cardPreview)
                scene.cardPreview.setVisible(false);
        })

        // finish card draging
        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            // remove tint
            gameObject.setTint();
            // if card is not dropped in drop zone send it back to where it started
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        // drop card in drop zone 
        // allowed only in specific conditions:
        // - game is ready
        // - is my turn
        // - player played less then 3 cards to this zone 
        // - zone is unclaimed
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            // check whether card can be placed in zone
            let canBePlayed = scene.GameHandler.isMyTurn &&
                scene.GameHandler.gameState === "Ready" &&
                dropZone.data.values.playerCards < 3 &&
                !dropZone.data.values.isClaimed

            if (canBePlayed) {
                // drop card in designated place in drop zone
                gameObject.x = dropZone.x;
                gameObject.y = (dropZone.y + Vars.dropZoneYOffset) + (dropZone.data.values.playerCards * Vars.dropZoneCardOffset);
                dropZone.data.values.playerCards++;

                // lock the card in place (prevent dragging it again)
                scene.input.setDraggable(gameObject, false);
                // inform server which card and where it was played
                scene.socket.emit('cardPlayed', gameObject.name, scene.socket.id, dropZone.name);
            }
            // card cannot be played -> put it back to previous position
            else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}