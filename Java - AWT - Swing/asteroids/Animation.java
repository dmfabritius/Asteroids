package asteroids;

import java.util.List;
import java.util.ArrayList;
import java.awt.image.BufferedImage;

public class Animation {
    public BufferedImage texture;
    public List<BufferedImage> frames = new ArrayList<BufferedImage>();
    public float cx; // x-axis center of a frame
    public float cy; // y-axis center
    public float rate; // used to control the rate of animation, generally used to slow it down
    public float r; // the radius of the sprite; used during collection detection; 40% of the width

    public Animation(BufferedImage texture, int x, int y, int w, int h, int count, float rate, float originOffset) {
        this.cx = w * 0.5f;
        this.cy = (h * 0.5f) + originOffset;
        this.rate = rate;
        this.r = 0.4f * w;
        for (int i = 0; i < count; i++) // set up the rectangles that define the location of each frame in the texture
            frames.add(texture.getSubimage(x + i * w, y, w, h));
    }

    public Animation(BufferedImage texture, int x, int y, int w, int h, int count, float rate) {
        this(texture, x, y, w, h, count, rate, 0);
    }
}
