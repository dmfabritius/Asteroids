import Astro from "./Astro";
import Animation from "./Animation";
import Entity from "./Entity";

export default class Laser extends Entity {
  enemy: boolean = false;

  static spawn(anim: Animation, x: number, y: number, heading: number, enemy: boolean = false) {
    const pool: Laser[] = [];

    const asset = pool.length === 0 || pool[0].active ? new Laser() : pool.shift()!;
    asset.anim = anim;
    asset.x = x;
    asset.y = y;
    asset.heading = heading;
    asset.dx = 6 * Math.cos(heading);
    asset.dy = 6 * Math.sin(heading);
    asset.enemy = enemy;
    asset.active = true;

    pool.push(asset);
    // make lasers first in line to be drawn so they are underneath everything
    Astro.entities.unshift(asset);
  }

  update() {
    super.update();
    // delete the laser pulse when it goes off the screen
    if (this.x < 0 || this.x > Astro.WIDTH || this.y < 0 || this.y > Astro.HEIGHT) this.active = false;
  }

  checkCollisions() {
    if (this.enemy) return; // collisions between enemy laser and ship are handled by the ship

    for (let e of Astro.currentEntities) {
      this.active = !e.collision(this); // the laser pulse stays active unless it hits something
      if (!this.active) break; // once the laser pulse hits something, stop checking for collisions
    }
  }

  collision(other: Entity) {
    if (this.enemy && super.hits(other)) {
      this.active = false; // enemy laser gets destroyed by collision with ship
      return true;
    }
    return false;
  }
}
