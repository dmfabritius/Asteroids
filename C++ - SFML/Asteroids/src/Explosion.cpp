#include "Astro.h"
#include "Explosion.h"

// since explosions are continually being created and destroyed,
// instead of using a normal public constructor to create them,
// a static method with a reusable pool of assets is used
void Explosion::spawn(Astro& astro, const Animation& anim, float x, float y) {
    std::queue<Explosion*> pool;
    Explosion* explosion;

    if (pool.size() == 0 || pool.front()->active) {
        explosion = new Explosion(astro);
    } else {
        explosion = pool.front();
        pool.pop();
    }
    explosion->anim = anim;
    explosion->frame = 0;
    explosion->x = x;
    explosion->y = y;
    explosion->looped = false;
    explosion->active = true;

    pool.push(explosion);
    astro.entities.push_back(explosion);
}

void Explosion::update() {
    Entity::update();
    if (looped) active = false; // remove when the animation completes
}