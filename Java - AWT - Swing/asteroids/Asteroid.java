package asteroids;

import java.util.*;

class Asteroid extends Entity {

    private Asteroid() {
    }

    static public void spawn(Animation anim, float x, float y) {
        Queue<Asteroid> pool = new LinkedList<>();

        Asteroid asset = (pool.size() == 0 || pool.peek().active) ? new Asteroid() : pool.remove();
        asset.anim = anim;
        asset.x = x;
        asset.y = y;
        asset.heading = Astro.random(360);
        asset.dx = 1.0f + Astro.random(2); // move at a random speed
        asset.dy = 1.0f + Astro.random(2);
        if ((int) Astro.random(2) == 0)
            asset.dx *= -1; // move to the left or right
        if ((int) Astro.random(2) == 0)
            asset.dy *= -1; // move up or down
        asset.active = true;

        pool.add(asset);
        Astro.entities.add(0, asset);
    }

    public void update() {
        super.update();
        super.wrap();
    }

    public boolean collides_with(Entity e) {
        if (intersects(e)) {
            active = false; // the asteroid gets destroyed
            Explosion.spawn(Astro.animations.get("explosion_asteroid"), x, y);
            if (anim.r > 30) {
                Astro.play(Astro.sounds.get("bang_lg"));
                Asteroid.spawn(Astro.animations.get("asteroid_md"), x, y);
                Asteroid.spawn(Astro.animations.get("asteroid_md"), x, y);
            } else if (anim.r > 20) {
                Astro.play(Astro.sounds.get("bang_md"));
                Asteroid.spawn(Astro.animations.get("asteroid_sm"), x, y);
                Asteroid.spawn(Astro.animations.get("asteroid_sm"), x, y);
            } else {
                Astro.play(Astro.sounds.get("bang_sm"));
            }
            return true;
        }
        return false;
    }
}
