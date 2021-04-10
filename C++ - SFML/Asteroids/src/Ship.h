#pragma once
#include "Entity.h"

class Ship : public Entity {
public:
    const float MAXSPEED = 15;
    bool thrusting;
    int extraShips;
    sf::Sprite extraShip;

    Ship(Astro& astro, const Animation& anim);
    void update();
    void check_collisions();
    void draw_extra_ships();
};
