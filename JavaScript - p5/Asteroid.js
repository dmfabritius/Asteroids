class Asteroid extends Entity {
    constructor(anim, x, y) {
        super(anim, x, y, random(TWO_PI));
        this.dx = 0.5 + random(2); // move at a random speed
        this.dy = 0.5 + random(2);
        if (floor(random(2))) this.dx *= -1; // move to the left or right
        if (floor(random(2))) this.dy *= -1;
    }
    update() {
        super.update();
        super.wrap();
    }
    collision(other) {
        if (super.hits(other)) {
            this.active = false; // the asteroid gets destroyed
            entities.push(new Explosion(animations["explosion_asteroid"], this.x, this.y));
            if (this.anim.r > 30) {
                score += 10;
                sounds["bang_lg"].play();
                entities.push(new Asteroid(animations["asteroid_md"], this.x, this.y));
                entities.push(new Asteroid(animations["asteroid_md"], this.x, this.y));
            } else if (this.anim.r > 20) {
                score += 20;
                sounds["bang_md"].play();
                entities.push(new Asteroid(animations["asteroid_sm"], this.x, this.y));
                entities.push(new Asteroid(animations["asteroid_sm"], this.x, this.y));
            } else {
                score += 30;
                sounds["bang_sm"].play();
            }
            return true;
        }
        return false;
    }
}
