# Individual Project
This is my dissertaion project that summarises three years of studying Computer Science at City, University of London. It is a web-based card game for two players that runs on a client-server basis. It uses node.js for deplloyemnt purposes and Phaser 3 as a game engine.

The rules of the game were strongly inspired by one of my favourite card games - Schotten Totten designed by Reiner Knizia. Unfortunatelly, as far as I know, it is not available anywhere online. That's why I have decided to do it myself. It can be accessed [here](https://dissertation-project.onrender.com)!

 ## `Requirements`

For the deployment [Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## `Deployment`
The project requires to have defined following environmental variables:
- serverSocket - URL from which server's messages will come from (default http://localhost:3000)
- clientSocket - URL from which client's messages will come from (default http://localhost:8080)
- port - port of the server (default 3000)
- clientPort - port of the webpack 'client' server (default 8080) - only required for development mode

Preferably, this should be done in .env file in the root directory, however other ways of specifying these variables should also work.

Before starting the project in any mode (development or production), **run `npm install` both in root and client directory**. It is required to install all of project's dependencies.

### *Variables used throughtout the project*
| Variable         | Development mode      | Production mode                           |
|------------------|-----------------------|-------------------------------------------|
| serverSocket     | http://localhost:3000 | https://dissertation-project.onrender.com |
| clientSocket     | http://localhost:8080 | https://dissertation-project.onrender.com |
| PORT             | 3000                  | 10000                                     |
| clientPort       | 8080                  | N/A                                       |

*Note: If serverSocket and clientSocket have specified port number in their URL (like it is in development mode), port and clientPort must have values of those ports*

### `Development mode`
This mode allows to modify code with live changes to the application. 

In client directory run `npm start` --> this starts webpack server that will monitor for code changes

In root directory run `npm run dev` --> this starts the applcation server that will update on code changes

To open the application, in web browser access URL for clientSocket (default http://localhost:8080)

### `Production mode`
This mode is intended for actual deployment purposes. It causes the server to use static files and any change to the code will be visible only after running both functions described below"

In client directory run `npm run build` --> this packs client files into bundle.min.js and prepares deployable files 

In root directory run `npm start` --> this starts the application server and causes it to use static files 

To open the application, in web browser access URL for serverSocket (default http://localhost:3000)

## `Testing`
To ensure the proper behaviour of a major functionality of the application which is automatic marker claim test scripts were developed. To perform these tests run `npm test` in root directory.

## `Credit where credit is due`
All of the code that was either inspired by or copied is referenced at the top of the file in which it was used. 
The reference comments follow the same structure 
- heading "Credit where credit is due" at the top
- source of the code
- information what was copied and any modifications applied

Throughout the project, three major sorces were used:
- Phaser Webpack Template by photonstorm
    - https://github.com/photonstorm/phaser3-project-template
- phaser-2d-multiplayer-2021-update by sominator
    - https://github.com/sominator/phaser-2d-multiplayer-2021-update/blob/main/client/src/index.js
    - https://www.youtube.com/watch?v=9v-VbkUGais&list=PLCbP9KGntfcEDAiseVwYVbrmJdoYajNtw
- Bootstrap 5 by the Bootstrap team
    - https://getbootstrap.com/

## `File structure`
In the project there are 3 major packages:
 - client - holds client-side code
    - assets - graphical elements of the application
    - helpers - hendlers responisble for specific parts of the game
    - scenes - containers for specific parts of the game (game screens)
    - webpack - files required to make the application accessible in web browser
    - index.html - main client's file
 - server - holds server-side code
    - helpers - handlers for specific parts of the server
    - server.js - main server's file
 - test - holds automated tests for the project

File structure for the project is presented below.
```
IndividualProject
├── client
│   ├── src
│   │   ├── assets
│   │   │   ├── cardDeck
│   │   │   │   ├── domainA
│   │   │   │   │   └── A (1-9).png
│   │   │   │   ├── domainB
│   │   │   │   │   └── B (1-9).png
│   │   │   │   ├── domainC
│   │   │   │   │   └── C (1-9).png
│   │   │   │   ├── domainD
│   │   │   │   │   └── D (1-9).png
│   │   │   │   ├── domainE
│   │   │   │   │   └── E (1-9).png
│   │   │   │   ├── domainF
│   │   │   │   │   └── F (1-9).png
│   │   │   │   └── backside.png
│   │   │   └── html 
│   │   │       ├── intro.html
│   │   │       └── htmlAssets
│   │   │           ├── allCards.png
│   │   │           ├── formation.png
│   │   │           └── main.css
│   │   ├── helpers
│   │   │   ├── cards
│   │   │   │   ├── Card.js
│   │   │   │   ├── CardBack.js
│   │   │   │   └── CardFront.js
│   │   │   ├── DeckHandler.js
│   │   │   ├── GameHandler.js
│   │   │   ├── InteractivityHandler
│   │   │   ├── MarerHandler
│   │   │   ├── SocketHandler
│   │   │   ├── UIHandler
│   │   │   └── ZoneHandler
│   │   ├── scenes
│   │   │   ├── game.js
│   │   │   ├── gameOver.js
│   │   │   ├── intro.js
│   │   │   └── roomError.js
│   │   ├── index.js
│   │   └── vars.js
│   ├── webpack
│   │   ├── base.js
│   │   └── prod.js
│   ├── .babelrc
│   ├── index.html
│   ├── LICENSE
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── server
│   ├── server.js
│   └── helpers
│       ├── DropZoneHandler.js
│       ├── FormationHandler.js
│       └── Room.js
├── test
│   ├── DetermineFormationTest.js
│   ├── DetermineWinningFormationTest.js
│   └── PredictFormationTest.js
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
 ```
