class Laser extends Entity {
    constructor(anim, x, y, heading, enemy = false) {
        super(anim, x, y, heading);
        this.dx = 6 * Math.cos(heading);
        this.dy = 6 * Math.sin(heading);
        this.enemy = enemy;
    }
    update() {
        super.update();
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
            this.active = false; // delete the laser pulse when it goes off the screen
    }
    checkCollisions() {
        if (this.enemy) return; // collisions between enemy laser and ship are handled by the ship

        for (let e of currentEntities) {
            this.active = !e.collision(this); // the laser pulse stays active unless it hits something
            if (!this.active) break; // once the laser pulse hits something, stop checking for collisions
        }
    }
    collision(other) {
        if (this.enemy && super.hits(other)) {
            this.active = false; // enemy laser gets destroyed by collision with ship
            return true;
        }
        return false;
    }
}
