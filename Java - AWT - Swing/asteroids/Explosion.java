package asteroids;

import java.util.*;

class Explosion extends Entity {

    private Explosion() {
    }

    static public void spawn(Animation anim, float x, float y) {
        Queue<Explosion> pool = new LinkedList<>();

        Explosion asset = (pool.size() == 0 || pool.peek().active) ? new Explosion() : pool.remove();
        asset.anim = anim;
        asset.x = x;
        asset.y = y;
        asset.looped = false;
        asset.active = true;

        pool.add(asset);
        Astro.entities.add(asset);
    }

    public void update() {
        super.update();
        if (looped)
            active = false; // remove when the animation completes
    }
}
