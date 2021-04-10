package asteroids;

import java.awt.Graphics2D;
//import java.awt.geom.Ellipse2D;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;

public class Entity {

    public Animation anim; // the texture and animation info
    public float frame = 0; // the current frame of animation
    public float x, y;
    public float dx = 0, dy = 0;
    public float heading = 0; // heading in radians
    public boolean looped = false; // true if animation has looped at least once
    public boolean active = true; // when false, will be deleted by Astro::updateEntities()

    public Entity() {
    }

    public Entity(Animation anim, float x, float y, float heading) {
        this.anim = anim;
        this.x = x;
        this.y = y;
        this.heading = heading;
    }

    public void update() {
        x += dx; // update the position
        y += dy;

        frame += anim.rate; // advance the frame (may not move it fully to the next frame)
        if (frame >= anim.frames.size()) {
            frame = 0; // loop the animation back to the first frame
            looped = true;
        }
    }

    public void draw(Graphics2D g) {
        BufferedImage img = anim.frames.get((int) frame); // the current frame of animation
        AffineTransform tx = new AffineTransform();
        tx.translate(x - anim.cx, y - anim.cy); // center the image on the entity's current position
        tx.rotate(heading + Math.PI * 0.5, anim.cx, anim.cy); // rotate about the center point
        AffineTransformOp op = new AffineTransformOp(tx, AffineTransformOp.TYPE_BILINEAR);
        g.drawImage(img, op, 0, 0);
    }

    public void check_collisions() { // checks for collisions against all other entities
        // @Override in derived classes
    }

    public boolean collides_with(Entity e) { // handles collision with another entity
        // @Override in derived classes
        return false;
    }

    public boolean intersects(Entity other) {
        int x = (int) (this.x - other.x); // x separation
        int y = (int) (this.y - other.y); // y separation
        int r = (int) (this.anim.r + other.anim.r); // sum of the two objects' radii
        return x * x + y * y < r * r; // it's faster if we don't bother taking the square root of both sides
    }

    public void wrap() {
        if (x < 0)
            x = Astro.WIDTH;
        else if (x > Astro.WIDTH)
            x = 0;

        if (y < 0)
            y = Astro.HEIGHT;
        else if (y > Astro.HEIGHT)
            y = 0;
    }
}
