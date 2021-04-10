#pragma once
#include "Entity.h"

class Explosion : public Entity {
private:
    Explosion(Astro& astro) : Entity(astro) {}

public:
    static void spawn(Astro& astro, const Animation& anim, float x, float y);
    void update();
};
