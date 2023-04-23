# Individual Project
This is my dissertaion project that summarises three years of studying Computer Science at City, University of London. It is a web-based two-player card game that runs on a client-server basis and uses node.js for deployment purposes. 

The rules of the game were strongly inspired by one of my favourite card games - Schotten Totten designed by Reiner Knizia. Unfortunatelly, as far as I know, it is not available anywhere online. That's why I have decided to do it myself. It can be accessed [here](https://dissertation-project.onrender.com)!

 ## `Requirements`

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## `Deployment`
The project requires to have defined environmental variables:
- serverSocket - URL from which server's messages will come from (default http://localhost:3000)
- clientSocket - URL from which client's messages will come from (default http://localhost:8080)
- port - port of the server (default 3000)
- clientPort - port of the webpack 'client' server (default 8080) - only required for development mode

Preferably this should be done in .env file in the root directory, however other ways of specifying those variables should also work.

Before starting the project in any mode (development or production), run `npm install` both in root and client directory. It is required to install all of project's dependencies.

### *Variables used throughtout the project*
| Variable         | Development mode      | Deployment mode                           |
|------------------|-----------------------|-------------------------------------------|
| serverSocket     | http://localhost:3000 | https://dissertation-project.onrender.com |
| clientSocket     | http://localhost:8080 | https://dissertation-project.onrender.com |
| PORT             | 3000                  | 10000                                     |
| clientPort       | 8080                  | N/A                                       |

*Note: If serverSocket and clientSocket have specified port number in their URL (like it is in development mode), port and clientPort must have values of those ports*

### `Development mode`
This mode allows to modify code with live changes to the application. 

In client directory run `npm start`     -- this starts webpack server that will monitor for code changes

In root directory run `npm run dev`     -- this starts the applcation server that will update on code changes

To open the application, in web browser access URL for clientSocket (default http://localhost:8080)

### `Production mode`
This mode is intended for actual deployment purposes. It causes the server to use static files and any change to the code will be visible only after running both functions described below"

In client directory run `npm run build` -- this packs client files into bundle.min.js and prepares deployable files 

In root directory run `npm start`       -- this starts the application server and causes it to use static files 

To open the application, in web browser access URL for serverSocket (default http://localhost:3000)

## `Testing`
To ensure the proper behaviour of a major functionality of the application which is automatic marker claim test scripts were developed. To perform these tests run `npm test` in root directory.

## `File structure`
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
│   ├── .gitignore
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
