class Saucer extends Entity {
    constructor(anim) {
        super(anim, 0, height * 0.25 + random(height * 0.5), 0);
        sounds["saucer"].loop();

        this.dx = 2 + random(2); // move at a random speed, mostly horizontal
        this.dy = 1 + random(1);
        if (floor(random(2))) {
            this.dx *= -1;  // randomly move left instead of right
            this.x = width; // start on the right-hand side of the screen
        }
        if (floor(random(2))) this.dy *= -1; // move up or down
    }

    update() {
        super.update();
        if (floor(random(250)) === 0) {
            let heading = atan2(ship.x - this.x, this.y - ship.y) - PI * 0.5; // from the saucer back to the ship
            entities.unshift(new Laser(animations["laser_saucer"], this.x, this.y, heading, true));
        }
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
            this.destroy(); // delete the saucer when it goes off the screen
    }

    collision(other) {
        if (super.hits(other)) {
            this.destroy();
            score += 50;
            entities.push(new Explosion(animations["explosion_ship"], this.x, this.y));
            sounds["bang_lg"].play();
            return true;
        }
        return false;
    }

    destroy() {
        this.active = false;
        saucer = null; // clear reference to the saucer in the game
        sounds["saucer"].stop();
    }
}
