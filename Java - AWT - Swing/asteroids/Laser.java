package asteroids;

import java.util.*;

class Laser extends Entity {

    private boolean enemy;

    private Laser() {
    }

    static public void spawn(float x, float y, float heading, boolean enemy) {
        Queue<Laser> pool = new LinkedList<>();

        Laser asset = (pool.size() == 0 || pool.peek().active) ? new Laser() : pool.remove();
        asset.anim = (enemy) ? Astro.animations.get("laser_saucer") : Astro.animations.get("laser");
        asset.x = x;
        asset.y = y;
        asset.heading = heading;
        asset.dx = 6.0f * (float) Math.cos(heading);
        asset.dy = 6.0f * (float) Math.sin(heading);
        asset.active = true;
        asset.enemy = enemy;

        pool.add(asset);
        Astro.entities.add(0, asset);
    }

    static public void spawn(float x, float y, float heading) {
        spawn(x, y, heading, false);
    }

    public void update() {
        super.update();
        if (x < 0 || x > Astro.WIDTH || y < 0 || y > Astro.HEIGHT)
            active = false; // delete the laser pulse when it goes off the screen
    }

    public void check_collisions() {
        if (enemy)
            return; // collisions between enemy laser and ship handled by the ship

        for (Entity e : Astro.currentEntities) {
            active = active && !e.collides_with(this);
            if (!active)
                break;
        }
    }

    public boolean collides_with(Entity e) {
        if (enemy && !(e instanceof Laser) && intersects(e)) {
            active = false; // enemy laser gets destroyed by collision with ship
            return true;
        }
        return false;
    }
}
