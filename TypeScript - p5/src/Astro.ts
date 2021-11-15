import P5 from "p5";
//HACK: for p5@1.3.1, need to modify p5/lib/addons/p5.sound.js and add 'import p5 from "p5";' to the top
import "p5/lib/addons/p5.sound";
import Animation from "./Animation";
import Asteroid from "./Asteroid";
import Entity from "./Entity";
import HighScores from "./HighScores";
import Laser from "./Laser";
import Saucer from "./Saucer";
import Ship from "./Ship";

export enum GameState {
  READY,
  PLAYING,
  GAMEOVER,
}

export default class Astro {
  static readonly WIDTH = 1200;
  static readonly HEIGHT = 720;
  static readonly MAXSPEED = 15;
  static readonly SPACEBAR = 32;
  static readonly LOWER_Z = 90;
  static readonly NEW_ASTEROID_FREQUENCY = 800; // the odds of a new asteroid appearing are 1 in 800
  static readonly NEW_SAUCER_FREQUENCY = 900;
  static playerName = "";
  static score = 0;
  static prevKeyIsDown: Record<any, boolean> = { SPACEBAR: false }; // initialize previous state of the keys (we only care about spacebar)
  static sounds: Record<string, P5.SoundFile> = {};
  static animations: Record<string, Animation> = {};
  static entities: Entity[] = []; // all the active game objects= ship; saucer; asteroids; lasers; explosions
  static currentEntities: Entity[] = []; // a copy used to loop; since the real entities array is modified during the loop
  static gameState = GameState.READY;
  static spritesheet: P5.Image;
  static background: P5.Image;
  static font: P5.Font;
  static ship: Ship; // the ship and saucer objects need references to each other
  static saucer: Saucer | null = null;
}

export function loadContent(p5: P5) {
  // assets sourced from original FamTrinli project files
  // additional assets from https://opengameart.org
  Astro.spritesheet = p5.loadImage("images/spritesheet.png");
  Astro.background = p5.loadImage("images/outerspace.jpg");
  Astro.font = p5.loadFont("fonts/arcade_i.ttf"); // https://www.dafont.com/arcade-ya.font

  //HACK: for p5@1.3.1, need to cast p5 as a SoundFile to access loadSound()
  const loadSound = (path: string) => (p5 as unknown as P5.SoundFile).loadSound(path);
  Astro.sounds["bang_lg"] = loadSound("audio/bang_lg.wav");
  Astro.sounds["bang_md"] = loadSound("audio/bang_md.wav");
  Astro.sounds["bang_sm"] = loadSound("audio/bang_sm.wav");
  Astro.sounds["laser"] = loadSound("audio/laser.wav");
  Astro.sounds["thrust"] = loadSound("audio/thrust.wav");
  Astro.sounds["saucer"] = loadSound("audio/saucer.wav");
  // https://patrickdearteaga.com/arcade-music/
  Astro.sounds["background"] = loadSound("audio/solveThePuzzle.ogg");
}

export function setupSounds() {
  Astro.sounds["thrust"].playMode("untilDone");
  Astro.sounds["saucer"].setVolume(0.1);
  Astro.sounds["background"].setVolume(0.05);
  Astro.sounds["background"].loop();
}

export function createAnimations() {
  // textures can be re-used for multiple animations; define which parts of each texture to use for each sprite
  Astro.animations["asteroid_lg"] = new Animation(Astro.spritesheet, 0, 384, 80, 80, 16, 0.15);
  Astro.animations["asteroid_md"] = new Animation(Astro.spritesheet, 0, 464, 60, 60, 16, 0.15);
  Astro.animations["asteroid_sm"] = new Animation(Astro.spritesheet, 0, 524, 40, 40, 16, 0.15);
  Astro.animations["explosion_asteroid"] = new Animation(Astro.spritesheet, 0, 0, 192, 192, 32, 0.4);
  Astro.animations["explosion_ship"] = new Animation(Astro.spritesheet, 0, 192, 192, 192, 32, 0.4);
  Astro.animations["laser"] = new Animation(Astro.spritesheet, 1540, 384, 32, 48, 8, 0.4);
  Astro.animations["laser_saucer"] = new Animation(Astro.spritesheet, 1540, 444, 32, 48, 8, 0.4);
  Astro.animations["saucer"] = new Animation(Astro.spritesheet, 2200, 384, 45, 73, 6, 0.15);
  Astro.animations["ship"] = new Animation(Astro.spritesheet, 1820, 384, 42, 140, 1, 0, 34);
  Astro.animations["ship_thrusting"] = new Animation(Astro.spritesheet, 1862, 384, 42, 140, 6, 0.25, 34);
}

function initGame() {
  Astro.score = 0;
  Astro.playerName = "";
  Astro.entities.splice(0); // clear the entities array
  Astro.ship = new Ship(Astro.animations["ship"], Astro.WIDTH * 0.5, Astro.HEIGHT * 0.5);
  Astro.entities.push(Astro.ship);
  // create some initial asteroids
  for (let i = 0; i < 3; i++) Asteroid.spawn(Astro.animations["asteroid_lg"], 0, Math.random() * Astro.HEIGHT);
}

function readyEvents(p5: P5) {
  if (p5.keyIsPressed) {
    initGame();
    Astro.gameState = GameState.PLAYING;
  }
}

function playingEvents(p5: P5) {
  if (p5.keyIsDown(Astro.SPACEBAR) && !Astro.prevKeyIsDown[Astro.SPACEBAR]) {
    // only fire when the spacebar changes state
    Laser.spawn(Astro.animations["laser"], Astro.ship.x, Astro.ship.y, Astro.ship.heading);
    Astro.sounds["laser"].play();
  }
  Astro.prevKeyIsDown[Astro.SPACEBAR] = p5.keyIsDown(Astro.SPACEBAR);

  Astro.ship.thrusting = p5.keyIsDown(p5.UP_ARROW);
  if (p5.keyIsDown(p5.LEFT_ARROW)) Astro.ship.heading -= 0.08; // rotate clockwise
  if (p5.keyIsDown(p5.RIGHT_ARROW)) Astro.ship.heading += 0.08;
  if (p5.keyIsDown(Astro.LOWER_Z))
    Laser.spawn(Astro.animations["laser"], Astro.ship.x, Astro.ship.y, Astro.ship.heading); // lots 'o lasers!!!!
}

function gameoverEvents() {
  // we just use the keyRelased() function to handle gameover events
}

export function handleEvents(p5: P5) {
  switch (Astro.gameState) {
    case GameState.READY:
      readyEvents(p5);
      break;
    case GameState.PLAYING:
      playingEvents(p5);
      break;
    case GameState.GAMEOVER:
      gameoverEvents();
      break;
  }
  if (p5.keyIsDown(p5.ESCAPE)) {
    Astro.sounds["background"].stop();
    Astro.sounds["saucer"].stop();
    p5.noLoop();
  }
}

export function updateEntities(p5: P5) {
  if (Astro.gameState !== GameState.PLAYING) return; // only update entities during game play

  if (Math.floor(Math.random() * Astro.NEW_ASTEROID_FREQUENCY) === 0)
    // throw in another asteroid occasionally
    Asteroid.spawn(Astro.animations["asteroid_lg"], 0, Math.random() * Astro.HEIGHT);

  if (Math.floor(Math.random() * Astro.NEW_SAUCER_FREQUENCY) === 0 && Astro.saucer === null) {
    // throw in a flying saucer occasionally
    Astro.saucer = new Saucer(Astro.animations["saucer"]); // we need a global reference
    Astro.entities.push(Astro.saucer);
  }

  // loop thru a copy of the entities list so we can modify the original
  Astro.currentEntities = [...Astro.entities]; // make a copy of the entities array
  for (let e of Astro.currentEntities) {
    e.update(); // update the heading, velocity, and/or position of the entity
    e.checkCollisions();
    if (!e.active) Astro.entities.splice(Astro.entities.indexOf(e), 1); // remove inactive entity
  }
}

export function drawEntities(p5: P5) {
  p5.image(Astro.background, Astro.WIDTH * 0.5, Astro.HEIGHT * 0.5); // draw background image centered on the canvas

  if (Astro.gameState === GameState.READY) {
    HighScores.draw(p5);
    p5.text("- Press enter to play -", 340, 570);
  }

  if (Astro.gameState === GameState.PLAYING || Astro.gameState === GameState.GAMEOVER) {
    for (let e of Astro.entities) e.draw(p5);
    Astro.ship.drawExtraShips(p5);
    p5.text("Score:" + Astro.score, 20, 40);
  }

  if (Astro.gameState === GameState.GAMEOVER) {
    p5.text("You set a new high score!", 420, 150);
    p5.text(`Name: ${Astro.playerName}`, 420, 220);
    if (new Date().getMilliseconds() % 500 > 250)
      // "blink" the cursor every quarter second or so
      p5.text("*", 528 + 18 * Astro.playerName.length, 220);
  }
}
