using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework;
using System.Collections.Generic;

namespace Asteroids {
    public class Animation {
        public readonly Texture2D texture;
        public readonly Vector2 origin;
        public readonly List<Rectangle> frames = new List<Rectangle>();
        public readonly double rate; // used to control the rate of animation, generally used to slow it down
        public readonly double r; // the radius of the sprite; used during collection detection; 40% of the sprites width

        public Animation(Texture2D texture, int x, int y, int w, int h, int count, double rate, double originOffset = 0) {
            this.texture = texture;
            origin = new Vector2((float)(w * 0.5), (float)(h * 0.5 + originOffset)); // move the origin to the center
            r = 0.4 * w;
            this.rate = rate;
            for (int i = 0; i < count; i++) // set up the rectangles that define the location of each frame in the texture
                frames.Add(new Rectangle(x + i * w, y, w, h));
        }
    }
}
