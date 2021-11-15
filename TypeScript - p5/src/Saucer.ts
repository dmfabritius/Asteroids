import Astro from "./Astro";
import Animation from "./Animation";
import Entity from "./Entity";
import Explosion from "./Explosion";
import Laser from "./Laser";

export default class Saucer extends Entity {
  constructor(anim: Animation) {
    super(anim, 0, Astro.HEIGHT * 0.25 + Math.random() * Astro.HEIGHT * 0.5, 0);
    Astro.sounds["saucer"].loop();

    this.dx = 2 + Math.random() * 2; // move at a random speed, mostly horizontal
    this.dy = 1 + Math.random();
    if (Math.floor(Math.random() * 2)) {
      this.dx *= -1; // randomly move left instead of right
      this.x = Astro.WIDTH; // start on the right-hand side of the screen
    }
    if (Math.floor(Math.random() * 2)) this.dy *= -1; // move up or down
  }

  update() {
    super.update();
    if (Math.floor(Math.random() * 250) === 0) {
      let heading = Math.atan2(Astro.ship.x - this.x, this.y - Astro.ship.y) - Math.PI * 0.5; // from the saucer back to the ship
      Laser.spawn(Astro.animations["laser_saucer"], this.x, this.y, heading, true);
    }
    if (this.x < 0 || this.x > Astro.WIDTH || this.y < 0 || this.y > Astro.HEIGHT) this.destroy(); // delete the saucer when it goes off the screen
  }

  collision(other: Entity) {
    if (super.hits(other)) {
      this.destroy();
      Astro.score += 50;
      Explosion.spawn(Astro.animations["explosion_ship"], this.x, this.y);
      Astro.sounds["bang_lg"].play();
      return true;
    }
    return false;
  }

  destroy() {
    this.active = false;
    Astro.saucer = null; // clear reference to the saucer in the game
    Astro.sounds["saucer"].stop();
  }
}
