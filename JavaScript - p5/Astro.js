const SPACEBAR = 32;
const LOWER_Z = 90;
const prevKeyIsDown = { SPACEBAR: false }; // initialize previous state of the keys (we only care about spacebar)

const sounds = {};
const animations = {};
const entities = []; // all the active game objects: ship, saucer, asteroids, lasers, explosions
let currentEntities = []; // a copy used to loop, since the real entities array is modified during the loop
let spritesheet, background; // we only need two textures/images
let font;
let ship, saucer = null; // the ship and saucer objects need references to each other, so they are globals
let playerName, score;

const GameState = { READY: 0, PLAYING: 1, GAMEOVER: 2 };
Object.freeze(GameState); // make GameState more or less like an enum
let gameState = GameState.READY;

function loadContent() {
    // assets sourced from original FamTrinli project files
    // additional assets from https://opengameart.org
    spritesheet = loadImage("images/spritesheet.png");
    background = loadImage("images/outerspace.jpg");
    font = loadFont("fonts/arcade_i.ttf"); // https://www.dafont.com/arcade-ya.font

    soundFormats("wav", "ogg");
    sounds["bang_lg"] = loadSound("audio/bang_lg.wav");
    sounds["bang_md"] = loadSound("audio/bang_md.wav");
    sounds["bang_sm"] = loadSound("audio/bang_sm.wav");
    sounds["laser"] = loadSound("audio/laser.wav");
    sounds["thrust"] = loadSound("audio/thrust.wav");
    sounds["saucer"] = loadSound("audio/saucer.wav");
    sounds["background"] = loadSound("audio/solveThePuzzle.ogg"); // https://patrickdearteaga.com/arcade-music/
}
function setupSounds() {
    sounds["thrust"].playMode("untilDone");
    sounds["saucer"].setVolume(0.1);
    sounds["background"].setVolume(0.05);
    sounds["background"].loop();
}

function createAnimations() {
    // textures can be re-used for multiple animations; define which parts of each texture to use for each sprite
    animations["asteroid_lg"] = new Animation(spritesheet, 0, 384, 80, 80, 16, 0.15);
    animations["asteroid_md"] = new Animation(spritesheet, 0, 464, 60, 60, 16, 0.15);
    animations["asteroid_sm"] = new Animation(spritesheet, 0, 524, 40, 40, 16, 0.15);
    animations["explosion_asteroid"] = new Animation(spritesheet, 0, 0, 192, 192, 32, 0.4);
    animations["explosion_ship"] = new Animation(spritesheet, 0, 192, 192, 192, 32, 0.4);
    animations["laser"] = new Animation(spritesheet, 1540, 384, 32, 48, 8, 0.4);
    animations["laser_saucer"] = new Animation(spritesheet, 1540, 444, 32, 48, 8, 0.4);
    animations["saucer"] = new Animation(spritesheet, 2200, 384, 45, 73, 6, 0.15);
    animations["ship"] = new Animation(spritesheet, 1820, 384, 42, 140, 1, 0, 34);
    animations["ship_thrusting"] = new Animation(spritesheet, 1862, 384, 42, 140, 6, 0.25, 34);
}
function initGame() {
    score = 0;
    playerName = "";
    entities.splice(0); // clear the entities array
    ship = new Ship(animations["ship"], width * 0.5, height * 0.5);
    entities.push(ship);
    for (i = 0; i < 3; i++) // create some initial asteroids
        entities.push(new Asteroid(animations["asteroid_lg"], 0, random(height)));
}
function readyEvents() {
    if (keyIsPressed) {
        initGame();
        gameState = GameState.PLAYING;
    }
}
function playingEvents() {
    if (keyIsDown(SPACEBAR) && !prevKeyIsDown[SPACEBAR]) { // only fire when the spacebar changes state
        entities.unshift(new Laser(animations["laser"], ship.x, ship.y, ship.heading));
        sounds["laser"].play();
    }
    prevKeyIsDown[SPACEBAR] = keyIsDown(SPACEBAR);

    ship.thrusting = keyIsDown(UP_ARROW);
    if (keyIsDown(LEFT_ARROW)) ship.heading -= 0.08; // rotate clockwise
    if (keyIsDown(RIGHT_ARROW)) ship.heading += 0.08;
    if (keyIsDown(LOWER_Z))
        entities.unshift(new Laser(animations["laser"], ship.x, ship.y, ship.heading)); // lots 'o lasers!!!!
}
function gameoverEvents() {
    // we just use the keyRelased() function to handle gameover events
}
function keyReleased() {
    if (gameState !== GameState.GAMEOVER) return;

    if (keyCode === ENTER && playerName.length > 0) {
        addHighScore(playerName, score);
        //writeHighScore(playerName, score);
        gameState = GameState.READY;
    }
    else if (keyCode === BACKSPACE && playerName.length > 0) {
        playerName = playerName.substring(0, playerName.length - 1);
    }
    else if (keyCode > 32 && keyCode < 128 && playerName.length < 10) {
        //console.error(`adding key press '${key}'`);
        playerName += key;
        //console.error(playerName);
    }
}
function handleEvents() {
    switch (gameState) {
        case GameState.READY: readyEvents(); break;
        case GameState.PLAYING: playingEvents(); break;
        case GameState.GAMEOVER: gameoverEvents(); break;
    }
    if (keyIsDown(ESCAPE)) {
        sounds["background"].stop();
        sounds["saucer"].stop();
        noLoop();
    }
}
function updateEntities() {
    if (gameState !== GameState.PLAYING) return; // only update entities during game play

    if (floor(random(800)) === 0) // throw in another asteroid occasionally
        entities.push(new Asteroid(animations["asteroid_lg"], 0, random(height)));

    if (floor(random(900)) === 0 && saucer === null) { // throw in a flying saucer occasionally
        saucer = new Saucer(animations["saucer"]); // we need a global reference
        entities.push(saucer);
    }

    // loop thru a copy of the entities list so we can modify the original
    currentEntities = [...entities]; // make a copy of the entities array
    for (let e of currentEntities) {
        e.update(); // update the heading, velocity, and/or position of the entity
        e.checkCollisions();
        if (!e.active) entities.remove(e); // remove inactive entity (see sketch.js for remove() function)
    }
}
function drawEntities() {
    image(background, width * 0.5, height * 0.5); // draw background image centered on the canvas

    if (gameState === GameState.READY) {
        drawHighScores();
        text("- Press enter to play -", 340, 570);
    }

    if (gameState === GameState.PLAYING || gameState === GameState.GAMEOVER) {
        for (let e of entities) e.draw();
        ship.drawExtraShips();
        text("Score:" + score, 20, 40);
    }

    if (gameState === GameState.GAMEOVER) {
        text("You set a new high score!", 420, 150);
        text(`Name: ${playerName}`, 420, 220);
        if (new Date().getMilliseconds() % 500 > 250) // "blink" the cursor every quarter second or so
            text("*", 528 + 18 * playerName.length, 220);
    }
}
