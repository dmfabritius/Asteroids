#pragma once
#include "Entity.h"

class Asteroid : public Entity {
private:
    Asteroid(Astro& astro) : Entity(astro) {}

public:
    static void spawn(Astro& astro, const Animation& anim, float x, float y);
    void update();
    bool collides_with(Entity* e);
};
