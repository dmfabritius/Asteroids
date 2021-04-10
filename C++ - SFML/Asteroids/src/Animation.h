#pragma once
#include "Program.h"

class Animation {
public:
    sf::Sprite sprite;
    std::vector<sf::IntRect> frames;
    float rate; // used to control the rate of animation, generally used to slow it down
    float r; // the radius of the sprite; used during collection detection; 40% of the animations width

    Animation();
    Animation(const sf::Texture& texture, int x, int y, int w, int h, int count, float rate, float offset = 0);
};
