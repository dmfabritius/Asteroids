package asteroids;

class Ship extends Entity {
    private static final float MAXSPEED = 15.0f;
    public boolean thrusting = false;

    public Ship(float x, float y) {
        super(null, x, y, 0);
    }

    public void update() {
        if (thrusting) {
            anim = Astro.animations.get("ship_thrusting");
            if (!Astro.sounds.get("thrust").isActive())
                Astro.play(Astro.sounds.get("thrust"));
            dx += (float) Math.cos(heading) * 0.2f;
            dy += (float) Math.sin(heading) * 0.2f;
        } else {
            anim = Astro.animations.get("ship");
            dx *= 0.99f;
            dy *= 0.99f;
        }

        float speed = (float) Math.sqrt(dx * dx + dy * dy);
        if (speed > Ship.MAXSPEED) {
            dx *= Ship.MAXSPEED / speed;
            dy *= Ship.MAXSPEED / speed;
        }

        super.update();
        super.wrap();
    }

    public void check_collisions() {
        for (Entity e : Astro.currentEntities) {
            if (e.collides_with(this)) {
                Explosion.spawn(Astro.animations.get("explosion_ship"), x, y);
                Astro.play(Astro.sounds.get("bang_lg"));
                x = Astro.WIDTH * 0.5f; // reset the ship to the center of the screen
                y = Astro.HEIGHT * 0.5f;
                dx = dy = 0; // stop the ship's movement
            }
        }
    }
}
