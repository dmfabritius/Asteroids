class Animation {
    constructor(texture, x, y, w, h, count, rate, offset = 0) {
        this.texture = texture; // the source texture/image/spritesheet
        this.frames = []; // a collection of rectangles that define each frame's location in the texture
        this.rate = rate; // used to control the rate of animation, generally used to slow it down
        this.r = 0.42 * w; // the radius of the sprite; used during collision detection; 42% of the sprite's width
        this.offset = offset; // used to offset the sprite's origin away from its exact center

        // set up the rectangles that define the location of each frame in the texture
        // this works when the sprite's frames are all in a single row
        for (let i = 0; i < count; i++)
            this.frames.push({ x: x + i * w, y: y, w: w, h: h });
    }
}