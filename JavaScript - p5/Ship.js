const MAXSPEED = 15;

class Ship extends Entity {
    constructor(anim, x, y, heading) {
        super(anim, x, y, heading);
        this.thrusting = false;
        this.extraShips = 3;
    }
    update() {
        if (this.thrusting) {
            this.anim = animations["ship_thrusting"];
            sounds["thrust"].play();
            this.dx += Math.cos(this.heading) * 0.2;
            this.dy += Math.sin(this.heading) * 0.2;
        } else {
            this.anim = animations["ship"];
            sounds["thrust"].stop();
            this.dx *= 0.99;
            this.dy *= 0.99;
        }

        let speed = sqrt(this.dx * this.dx + this.dy * this.dy);
        if (speed > MAXSPEED) {
            this.dx *= MAXSPEED / speed;
            this.dy *= MAXSPEED / speed;
        }

        super.update();
        super.wrap();
    }
    checkCollisions() {
        for (let e of currentEntities) {
            if (e.collision(this)) {
                entities.push(new Explosion(animations["explosion_ship"], ship.x, ship.y));
                sounds["bang_lg"].play();
                this.x = width * 0.5; // reset the ship to the center of the screen
                this.y = height * 0.5;
                this.dx = this.dy = 0;

                if (--this.extraShips < 0) {
                    this.active = false;
                    if (saucer) saucer.destroy();
                    gameState = (score > lowestHighScore) ?
                        GameState.GAMEOVER : // prompt for player's name
                        GameState.READY; // show high scores
                }
            }
        }
    }
    drawExtraShips() {
        push();
        let f = animations["ship"].frames[0];
        scale(0.65);
        translate(1600, 100); // set the initial drawing position
        for (let i = 0; i < this.extraShips; i++) {
            translate(60, 0); // draw each ship to the left of the previous one
            image(animations["ship"].texture,
                0, 0, f.w, f.h,      // destination rectange -- where to draw the image
                f.x, f.y, f.w, f.h); // source of the image from within the larger texture
        }
        pop();
    }
}
