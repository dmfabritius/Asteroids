using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Graphics;

namespace Asteroids {

    public class Ship : Entity {

        const double MAXSPEED = 12.0;
        readonly SoundEffectInstance thrustSound;
        public bool thrusting = false;
        int extraShips = 3;

        public Ship(double x, double y) :
            base(null, x, y) {
            thrustSound = Astro.Instance.sounds["thrust"].CreateInstance();
            thrustSound.IsLooped = true;
        }

        override public void Update() {
            if (thrusting) {
                anim = Astro.Instance.animations["ship_thrusting"];
                if (thrustSound.State == SoundState.Stopped) thrustSound.Play();
                dx += Math.Cos(heading) * 0.2;
                dy += Math.Sin(heading) * 0.2;
            }
            else {
                anim = Astro.Instance.animations["ship"];
                thrustSound.Stop();
                dx *= 0.99;
                dy *= 0.99;
            }

            double speed = Math.Sqrt(dx * dx + dy * dy);
            if (speed > MAXSPEED) {
                dx *= MAXSPEED / speed;
                dy *= MAXSPEED / speed;
            }

            base.Update();
            base.Wrap();
        }

        override public void CheckCollisions() {
            foreach (Entity e in Astro.Instance.currentEntities) {
                if (e.CollidesWith(this)) {
                    Explosion.Spawn(Astro.Instance.animations["explosion_ship"], x, y);
                    Astro.Instance.sounds["bang_lg"].Play();
                    x = Astro.Instance.WIDTH * 0.5; // reset the ship to the center of the screen
                    y = Astro.Instance.HEIGHT * 0.5;
                    dx = dy = 0; // stop the ship's movement

                    if (--extraShips < 0) {
                        Astro.Instance.saucer.Hide();
                        Astro.Instance.gameState = (Astro.Instance.score > HighScores.Instance.lowestHighScore) ?
                            Astro.GameState.GAMEOVER : // prompt for player's name
                            Astro.GameState.READY; // show high scores
                    }
                }
            }
        }

        public void DrawExtraShips(SpriteBatch spriteBatch) {
            for (int i = 0; i < extraShips; i++) {
                spriteBatch.Draw(
                    Astro.Instance.animations["ship"].texture,
                    new Vector2(20 + 60 * i, 670),
                    Astro.Instance.animations["ship"].frames[0],
                    Color.White, 0, Vector2.Zero, 0.65f, SpriteEffects.None, 0);
            }
        }
    }
}
