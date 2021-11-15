import Astro from "./Astro";
import Animation from "./Animation";
import Entity from "./Entity";
import Explosion from "./Explosion";

export default class Asteroid extends Entity {
  static spawn(anim: Animation, x: number, y: number) {
    const pool: Asteroid[] = [];

    const asset = pool.length === 0 || pool[0].active ? new Asteroid() : pool.shift()!;
    asset.anim = anim;
    asset.x = x;
    asset.y = y;
    asset.heading = Math.random() * Math.PI * 2;
    asset.dx = 0.5 + Math.random() * 2; // move at a Math.random speed
    asset.dy = 0.5 + Math.random() * 2;
    if (Math.floor(Math.random() * 2)) asset.dx *= -1; // move to the left or right
    if (Math.floor(Math.random() * 2)) asset.dy *= -1;
    asset.active = true;

    pool.push(asset);
    Astro.entities.push(asset);
  }

  update() {
    super.update();
    super.wrap();
  }

  collision(other: Entity) {
    if (super.hits(other)) {
      this.active = false; // the asteroid gets destroyed
      Explosion.spawn(Astro.animations["explosion_asteroid"], this.x, this.y);
      if (this.anim.r > 30) {
        Astro.score += 10;
        Astro.sounds["bang_lg"].play();
        Asteroid.spawn(Astro.animations["asteroid_md"], this.x, this.y);
        Asteroid.spawn(Astro.animations["asteroid_md"], this.x, this.y);
      } else if (this.anim.r > 20) {
        Astro.score += 20;
        Astro.sounds["bang_md"].play();
        Asteroid.spawn(Astro.animations["asteroid_sm"], this.x, this.y);
        Asteroid.spawn(Astro.animations["asteroid_sm"], this.x, this.y);
      } else {
        Astro.score += 30;
        Astro.sounds["bang_sm"].play();
      }
      return true;
    }
    return false;
  }
}
