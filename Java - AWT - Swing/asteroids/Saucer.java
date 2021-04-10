package asteroids;

public class Saucer extends Entity {

    public Saucer() {
        super(Astro.animations.get("saucer"), 0, Astro.HEIGHT * 0.25f + Astro.random(Astro.HEIGHT / 2), 0);
        if (Astro.saucer != null) {
            active = false; // make sure we only have one saucer at a time
            return;
        }

        dx = 2f + Astro.random(2); // move at a random speed, mostly horizontal
        dy = 1f + Astro.random(1);
        if (Astro.random(1) > 0.5f) {
            dx *= -1; // randomly move right to left
            x = Astro.WIDTH; // start on the right-hand side of the screen
        }
        if (Astro.random(1) > 0.5f)
            dy *= -1; // move up or down
    }

    public void update() {
        super.update();

        if (!Astro.sounds.get("saucer").isActive())
            Astro.play(Astro.sounds.get("saucer"));

        if ((int) Astro.random(150) == 0) {
            float heading = (float) (Math.atan2(Astro.ship.x - x, y - Astro.ship.y) - Math.PI * 0.5);
            Laser.spawn(x, y, heading, true);
        }
        if (x < 0 || x > Astro.WIDTH || y < 0 || y > Astro.HEIGHT)
            destroy();
    }

    public boolean collides_with(Entity e) {
        if (intersects(e)) {
            destroy();
            Explosion.spawn(Astro.animations.get("explosion_ship"), x, y);
            Astro.play(Astro.sounds.get("bang_lg"));
            return true;
        }
        return false;
    }

    public void destroy() {
        Astro.saucer = null;
        active = false;
    }
}
