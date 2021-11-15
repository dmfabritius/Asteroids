import Astro from "./Astro";
import Animation from "./Animation";
import Entity from "./Entity";

export default class Explosion extends Entity {
  static spawn(anim: Animation, x: number, y: number) {
    const pool: Explosion[] = [];

    const asset = pool.length === 0 || pool[0].active ? new Explosion() : pool.shift()!;
    asset.anim = anim;
    asset.x = x;
    asset.y = y;
    asset.looped = false;
    asset.active = true;

    pool.push(asset);
    Astro.entities.push(asset);
  }

  update() {
    super.update();
    if (this.looped) this.active = false; // remove when the animation completes
  }
}
