using System.Collections.Generic;

namespace Asteroids {

    public class Explosion : Entity {

        private Explosion() { }

        public static void Spawn(Animation anim, double x, double y) {
            Queue<Explosion> pool = new Queue<Explosion>();

            Explosion explosion = (pool.Count == 0 || pool.Peek().active) ? new Explosion() : pool.Dequeue();
            explosion.anim = anim;
            explosion.frame = 0;
            explosion.x = x;
            explosion.y = y;
            explosion.looped = false;
            explosion.active = true;

            pool.Enqueue(explosion);
            Astro.Instance.entities.Add(explosion);
        }

        override public void Update() {
            base.Update();
            if (looped) active = false; // remove when the animation completes
        }
    }
}
