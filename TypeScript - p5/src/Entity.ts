import P5 from "p5";
import Astro from "./Astro";
import Animation from "./Animation";

export default class Entity {
  anim: Animation;
  frame: number;
  x: number;
  y: number;
  heading: number;
  dx: number;
  dy: number;
  looped: boolean;
  active: boolean;

  constructor(anim: Animation = Astro.animations[0], x: number = 0, y: number = 0, heading: number = 0) {
    this.anim = anim; // an Animation() object
    this.frame = 0; // the current frame of animation
    this.x = x; // the position
    this.y = y;
    this.heading = heading;
    this.dx = 0; // the change in position
    this.dy = 0;
    this.looped = false; // true if animation has looped at least once
    this.active = true; // when false, will be deleted by Game::updateEntities()
  }

  update() {
    this.x += this.dx; // update the position
    this.y += this.dy;

    this.frame += this.anim.rate; // advance the frame (may not move it fully to the next frame)
    if (this.frame >= this.anim.frames.length) {
      this.frame = 0; // loop the animation back to the first frame
      this.looped = true; // flag to indicate that we've gone all the way thru the animation sequence
    }
  }

  draw(p5: P5) {
    p5.push();
    p5.translate(this.x, this.y); // set the origin for where we're drawing
    p5.rotate(this.heading + Math.PI * 0.5);
    const f = this.anim.frames[Math.floor(this.frame)]; // destination rectange -- where to draw the image
    p5.image(this.anim.texture, 0, this.anim.offset, f.w, f.h, f.x, f.y, f.w, f.h); // source of the image from within the larger texture
    p5.pop();
  }

  // entities can optionally check for collisions with all other entities
  checkCollisions() {}

  // entities can optionally handle a collision with another entity
  collision(other: Entity) {
    return false;
  }

  hits(other: Entity) {
    let x = this.x - other.x; // x separation
    let y = this.y - other.y; // y separation
    let r = this.anim.r + other.anim.r; // sum of the two objects' radii
    return x * x + y * y < r * r; // it's faster if we don't bother taking the square root of both sides
  }

  wrap() {
    if (this.x < 0) this.x = Astro.WIDTH;
    else if (this.x > Astro.WIDTH) this.x = 0;
    if (this.y < 0) this.y = Astro.HEIGHT;
    else if (this.y > Astro.HEIGHT) this.y = 0;
  }
}
