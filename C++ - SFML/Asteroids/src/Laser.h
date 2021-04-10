#pragma once
#include "Entity.h"

class Laser : public Entity {
private:
    bool enemy;
    Laser(Astro& astro) : Entity(astro) {}

public:
    static void spawn(Astro& astro, float x, float y, float heading, bool enemy = false);
    void update();
    void check_collisions(); // see if this laser pulse intersects with any other entity
    bool collides_with(Entity* e); // react to another entity intersecting with this pulse
};
