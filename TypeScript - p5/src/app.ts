/*
    Partial clone of the classic Asteroids game using animated sprites.
    Demonstrates the use of inheritance and polymorphism in JavaScript/TypeScript.

    Inspired by:
      "Challenge #46: Asteroids" by The Coding Train,
      https://www.youtube.com/watch?v=hacZU523FyM
      
      "Let's make 16 games in C++: Asteroids" by FamTrinli,
      https://www.youtube.com/watch?v=rWaSo2usU4A
*/
import P5 from "p5";
import Astro, {
  GameState,
  loadContent,
  setupSounds,
  createAnimations,
  handleEvents,
  updateEntities,
  drawEntities,
} from "./Astro";
import HighScores from "./HighScores";

const sketch = (p5: P5) => {
  p5.preload = () => {
    loadContent(p5); // in Astro.js
  };

  p5.setup = () => {
    p5.createCanvas(Astro.WIDTH, Astro.HEIGHT);
    p5.imageMode(p5.CENTER);
    p5.textFont(Astro.font);
    p5.textSize(18);
    p5.fill(80, 255, 80);
    setupSounds();
    createAnimations();
  };

  p5.keyReleased = () => {
    if (Astro.gameState !== GameState.GAMEOVER) return;

    if (p5.keyCode === p5.ENTER && Astro.playerName.length > 0) {
      HighScores.add(Astro.playerName, Astro.score);
      //HighScores.write(playerName, score);
      Astro.gameState = GameState.READY;
    } else if (p5.keyCode === p5.BACKSPACE && Astro.playerName.length > 0) {
      Astro.playerName = Astro.playerName.substring(0, Astro.playerName.length - 1);
    } else if (p5.keyCode > 32 && p5.keyCode < 128 && Astro.playerName.length < 10) {
      //console.error(`adding key press '${key}'`);
      Astro.playerName += p5.key;
      //console.error(playerName);
    }
  };

  p5.draw = () => {
    handleEvents(p5);
    updateEntities(p5);
    drawEntities(p5);
  };
};

new P5(sketch);
