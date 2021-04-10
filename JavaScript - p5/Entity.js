class Entity {
    constructor(anim, x, y, heading) {
        this.anim = anim; // an Animation() object
        this.frame = 0; // the current frame of animation
        this.x = (!x) ? 0 : x; // the position
        this.y = (!y) ? 0 : y;
        this.heading = (!heading) ? 0 : heading;
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
    draw() {
        push();
        translate(this.x, this.y ); // set the origin for where we're drawing
        rotate(this.heading + PI * 0.5);
        let f = this.anim.frames[floor(this.frame)];
        image(this.anim.texture,
            0, this.anim.offset, f.w, f.h, // destination rectange -- where to draw the image
            f.x, f.y, f.w, f.h);           // source of the image from within the larger texture
        pop();
    }
    checkCollisions() { } // entities can optionally check for collisions with all other entities
    collision(other) { return false; } // entities can optionally handle a collision with another entity
    hits(other) {
        let x = this.x - other.x; // x separation
        let y = this.y - other.y; // y separation
        let r = this.anim.r + other.anim.r; // sum of the two objects' radii
        return x * x + y * y < r * r; // it's faster if we don't bother taking the square root of both sides
    }
    wrap() {
        if (this.x < 0) this.x = width; else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; else if (this.y > height) this.y = 0;
    }
}