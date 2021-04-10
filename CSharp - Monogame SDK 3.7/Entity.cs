using System;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework;

namespace Asteroids {

    public class Entity {

        public Animation anim; // the texture and animation info
        public double frame = 0; // the current frame of animation
        public double x, y;
        public double dx = 0, dy = 0;
        public double heading;
        public bool looped = false; // true if animation has looped at least once
        public bool active = true; // when false, will be deleted by Game::updateEntities()

        public Entity(Animation anim = null, double x = 0, double y = 0, double heading = 0) {
            this.anim = anim;
            this.x = x;
            this.y = y;
            this.heading = heading;
        }

        virtual public void Update() {
            x += dx; // update the position with its delta
            y += dy;

            frame += anim.rate; // advance the frame (may not move it fully to the next frame)
            if (frame >= anim.frames.Count) {
                frame = 0; // loop the animation back to the first frame
                looped = true;
            }
        }

        public void Draw(SpriteBatch spriteBatch) {
            spriteBatch.Draw(anim.texture, new Vector2((float)x, (float)y), anim.frames[(int)frame],
                Color.White, (float)(heading + Math.PI * 0.5), anim.origin, 1.0f, SpriteEffects.None, 0);
        }

        virtual public void CheckCollisions() { } // checks for collisions against all other entities

        virtual public bool CollidesWith(Entity e) { return false; } // handles collision with another entity

        public bool Intersects(Entity other) {
            double x = this.x - other.x; // x separation
            double y = this.y - other.y; // y separation
            double r = this.anim.r + other.anim.r; // sum of the two objects' radii
            return x * x + y * y < r * r; // it's faster if we don't bother taking the square root of both sides
        }

        public void Wrap() {
            if (x < 0) x = Astro.Instance.WIDTH; else if (x > Astro.Instance.WIDTH) x = 0;
            if (y < 0) y = Astro.Instance.HEIGHT; else if (y > Astro.Instance.HEIGHT) y = 0;
        }
    }
}
