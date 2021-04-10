using System;
using Microsoft.Xna.Framework.Audio;

namespace Asteroids {

    public class Saucer : Entity {

        readonly SoundEffectInstance thrustSound;
        public bool hidden = true; // start off with the saucer hidden from view

        public Saucer() :
            base(Astro.Instance.animations["saucer"], 0, -Astro.Instance.WIDTH) {
            thrustSound = Astro.Instance.sounds["saucer"].CreateInstance();
            thrustSound.Volume = 0.1f;
            thrustSound.IsLooped = true;
        }

        public void Show() {
            hidden = false;
            thrustSound.Play();
            x = 0;
            y = Astro.Instance.HEIGHT * 0.25 + Program.random.Next(Astro.Instance.HEIGHT / 2);
            dx = Program.random.Next(2, 4); // move at a random speed, mostly horizontal
            dy = Program.random.Next(1, 2);
            if (Program.random.Next(0, 1) == 0) {
                dx *= -1;        // randomly move right to left
                x = Astro.Instance.WIDTH; // start on the right-hand side of the screen
            }
            if (Program.random.Next(0, 1) == 0) {
                dy *= -1; // move up or down
            }
        }

        public void Hide() {
            thrustSound.Stop();
            x = -Astro.Instance.WIDTH; // hide off-screen
            hidden = true;
        }

        override public void Update() {
            if (hidden) return; // don't do anything if the saucer isn't being shown
            base.Update();
            if (Program.random.Next() % 150 == 0) {
                double heading = Math.Atan2(Astro.Instance.ship.x - x, y - Astro.Instance.ship.y) - Math.PI * 0.5;
                Laser.Spawn(x, y, heading, true);
            }
            if (x < 0 || x > Astro.Instance.WIDTH || y < 0 || y > Astro.Instance.HEIGHT) Hide();
        }

        override public bool CollidesWith(Entity e) {
            if (!hidden && Intersects(e)) {
                Astro.Instance.score += 50;
                Explosion.Spawn(Astro.Instance.animations["explosion_ship"], x, y);
                Astro.Instance.sounds["bang_lg"].Play();
                Hide();
                return true;
            }
            return false;
        }
    }
}
