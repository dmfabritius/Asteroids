#pragma once
#include "Entity.h"

class Saucer : public Entity {
public:
    bool hidden;

    Saucer(Astro& astro, const Animation& anim);
    void show();
    void hide();
    void update();
    bool collides_with(Entity* e);
};
