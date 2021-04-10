class Explosion extends Entity {
    constructor(anim, x, y) {
        super(anim, x, y);
    }
    update() {
        super.update();
        if (this.looped) this.active = false; // remove when the animation completes
    }
}
