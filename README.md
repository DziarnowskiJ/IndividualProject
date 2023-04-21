# Individual Project
This is my dissertaion project that summarises three years of studying Computer Science at City, University of London. It is a web-based two-player card game that runs on a client-server basis and uses node.js for deployment purposes. 

The rules of the game were strongly inspired by one of my favourite card games - Schotten Totten designed by Reiner Knizia. Unfortunatelly, as far as I know, it is not available anywhere online. That's why I have decided to do it myself. It can be accessed [here](https://dissertation-project.onrender.com)!

 ## `Requirements`

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.
## `DEPLOYMENT`
The project requires to have defined two environmental variables:
- clientSocket - URL from which client's messages will come from
- serverSocket - URL from which server's messages will come from

*For development purposes clientSocket="http://localhost:8080", serverSocket="http://localhost:3000" were used.*

*For deployment on Render.com "https://dissertation-project.onrender.com" was set for both variables*

Preferably this should be done in .env file, however other ways of specifying those variables should also work.

Before starting the project in any mode (development or production), run `npm install` both in root and client directory. It is required to install all of project's dependencies.
### `Development mode`
This mode allows to modify code with live changes to the application. 

In client directory run `npm start`     -- this starts webpack server that will monitor for code changes
In root directory run `npm run dev`     -- this starts the applcation server that will update on code changes

### `Production mode`
This mode is intended for actual deployment purposes. It causes the server to use static files and any change to the code will be visible only after running both functions described below"

In client directory run `npm run build` -- this packs client files into bundle.min.js and prepares deployable files 
In root directory run `npm start`       -- this starts the application server and causes it to use static files 
