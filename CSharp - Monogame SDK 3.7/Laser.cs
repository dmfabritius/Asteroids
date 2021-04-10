using System;
using System.Collections.Generic;

namespace Asteroids {

    public class Laser : Entity {

        bool enemy;

        private Laser() { }

        public static void Spawn(double x, double y, double heading, bool enemy = false) {
            Queue<Laser> pool = new Queue<Laser>();

            Laser laser = (pool.Count == 0 || pool.Peek().active) ? new Laser() : pool.Dequeue();
            laser.anim = (enemy) ? Astro.Instance.animations["laser_saucer"] : Astro.Instance.animations["laser"];
            laser.x = x;
            laser.y = y;
            laser.heading = heading;
            laser.enemy = enemy;
            laser.dx = 6 * Math.Cos(heading);
            laser.dy = 6 * Math.Sin(heading);
            laser.active = true;

            pool.Enqueue(laser);
            Astro.Instance.entities.Insert(0, laser);
        }

        override public void Update() {
            base.Update();
            if (x < 0 || x > Astro.Instance.WIDTH || y < 0 || y > Astro.Instance.HEIGHT)
                active = false; // delete the laser pulse when it goes off the screen
        }

        override public void CheckCollisions() {
            if (enemy) return; // collisions between enemy laser and ship handled by the ship

            foreach (Entity e in Astro.Instance.currentEntities) {
                active = active && !e.CollidesWith(this);
                if (!active) break;
            }
        }

        public override bool CollidesWith(Entity e) {
            if (enemy && e.GetType() != typeof(Laser) && Intersects(e)) {
                active = false; // enemy laser gets destroyed by collision with ship
                return true;
            }
            return false;
        }
    }
}
