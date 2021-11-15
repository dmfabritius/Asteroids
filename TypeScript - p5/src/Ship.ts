import P5 from "p5";
import Astro, { GameState } from "./Astro";
import Animation from "./Animation";
import Entity from "./Entity";
import Explosion from "./Explosion";
import HighScores from "./HighScores";

export default class Ship extends Entity {
  thrusting: boolean;
  extraShips: number;

  constructor(anim: Animation, x: number, y: number, heading: number = 0) {
    super(anim, x, y, heading);
    this.thrusting = false;
    this.extraShips = 3;
  }

  update() {
    if (this.thrusting) {
      this.anim = Astro.animations["ship_thrusting"];
      Astro.sounds["thrust"].play();
      this.dx += Math.cos(this.heading) * 0.2;
      this.dy += Math.sin(this.heading) * 0.2;
    } else {
      this.anim = Astro.animations["ship"];
      Astro.sounds["thrust"].stop();
      this.dx *= 0.99;
      this.dy *= 0.99;
    }

    let speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (speed > Astro.MAXSPEED) {
      this.dx *= Astro.MAXSPEED / speed;
      this.dy *= Astro.MAXSPEED / speed;
    }

    super.update();
    super.wrap();
  }

  checkCollisions() {
    for (let e of Astro.currentEntities) {
      if (e.collision(this)) {
        Astro.entities.push(new Explosion(Astro.animations["explosion_ship"], this.x, this.y));
        Astro.sounds["bang_lg"].play();
        this.x = Astro.WIDTH * 0.5; // reset the ship to the center of the screen
        this.y = Astro.HEIGHT * 0.5;
        this.dx = this.dy = 0;

        if (--this.extraShips < 0) {
          this.active = false;
          if (Astro.saucer) Astro.saucer.destroy();
          Astro.gameState =
            Astro.score > HighScores.lowest
              ? GameState.GAMEOVER // prompt for player's name
              : GameState.READY; // show high scores
        }
      }
    }
  }

  drawExtraShips(p5: P5) {
    p5.push();
    let f = Astro.animations["ship"].frames[0];
    p5.scale(0.65);
    p5.translate(1600, 100); // set the initial drawing position
    for (let i = 0; i < this.extraShips; i++) {
      p5.translate(60, 0); // draw each ship to the left of the previous one
      p5.image(Astro.animations["ship"].texture, 0, 0, f.w, f.h, f.x, f.y, f.w, f.h); // source of the image from within the larger texture
    }
    p5.pop();
  }
}
