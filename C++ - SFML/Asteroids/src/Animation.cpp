#include "Animation.h"

// a default constructor is necessary in order to declare the animations hash table in Astro.h
Animation::Animation() :
    rate(0), r(0) {
}

Animation::Animation(const sf::Texture& texture, int x, int y, int w, int h, int count, float rate, float offset) :
    rate(rate), r(0.4f * w) {
    sprite.setTexture(texture);
    for (int i = 0; i < count; i++) // set up the rectangles that define the location of each frame in the texture
        frames.push_back(sf::IntRect(x + i * w, y, w, h));

    sprite.setOrigin(static_cast<float>(w * 0.5), static_cast<float>(h * 0.5 + offset)); // move the origin to the center
    sprite.setTextureRect(frames[0]); // set the sprite to show the first frame
}
