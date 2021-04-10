using System;
using System.Collections.Generic;

namespace Asteroids {

    public class Asteroid : Entity {

        private Asteroid() { }

        public static void Spawn(Animation anim, double x, double y) {
            Queue<Asteroid> pool = new Queue<Asteroid>();

            Asteroid asteroid = (pool.Count == 0 || pool.Peek().active) ? new Asteroid() : pool.Dequeue();
            asteroid.anim = anim;
            asteroid.x = x;
            asteroid.y = y;
            asteroid.heading = Program.random.NextDouble() * 2 * Math.PI;
            asteroid.dx = Program.random.Next(1, 3); // move at a random speed
            asteroid.dy = Program.random.Next(1, 3);
            if (Program.random.Next(0, 1) == 0) asteroid.dx *= -1; // move to the left or right
            if (Program.random.Next(0, 1) == 0) asteroid.dy *= -1; // move up or down
            asteroid.active = true;

            pool.Enqueue(asteroid);
            Astro.Instance.entities.Add(asteroid);
        }

        override public void Update() {
            base.Update();
            base.Wrap();
        }

        override public bool CollidesWith(Entity e) {
            if (Intersects(e)) {
                active = false; // the asteroid gets destroyed
                Explosion.Spawn(Astro.Instance.animations["explosion_asteroid"], x, y);
                if (anim.r > 30) {
                    Astro.Instance.score += 10;
                    Astro.Instance.sounds["bang_lg"].Play();
                    Spawn(Astro.Instance.animations["asteroid_md"], x, y);
                    Spawn(Astro.Instance.animations["asteroid_md"], x, y);
                }
                else if (anim.r > 20) {
                    Astro.Instance.score += 20;
                    Astro.Instance.sounds["bang_md"].Play();
                    Spawn(Astro.Instance.animations["asteroid_sm"], x, y);
                    Spawn(Astro.Instance.animations["asteroid_sm"], x, y);
                }
                else {
                    Astro.Instance.score += 30;
                    Astro.Instance.sounds["bang_sm"].Play();
                }
                return true;
            }
            return false;
        }
    }
}
