#pragma once
#include "Animation.h"

class Entity {
protected:
    Entity(Astro& astro) : astro(astro) {}

public:
    Astro& astro; // a reference to the game's public member variables
    Animation anim; // the texture, sprite, and animation info
    float frame = 0; // the current frame of animation
    float x = 0, y = 0, heading = 0; // the position and heading (in degrees, because that's what SFML uses)
    float dx = 0, dy = 0; // the change in position
    bool looped = false; // true if animation has looped at least once
    bool active = true; // will only be updated/drawn when active

    Entity(Astro& astro, const Animation& anim, float x = 0, float y = 0, float heading = 0);
    virtual void update();
    void draw();
    virtual void check_collisions();
    virtual bool collides_with(Entity* e);
    bool intersects(Entity* other);
    void wrap();
};