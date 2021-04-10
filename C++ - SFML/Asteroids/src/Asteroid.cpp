#include "Astro.h"
#include "Asteroid.h"
#include "Explosion.h"

// since asteroids are continually being created and destroyed,
// instead of using a normal public constructor to create them,
// a static method with a reusable pool of assets is used
void Asteroid::spawn(Astro& astro, const Animation& anim, float x, float y) {
    std::queue<Asteroid*> pool;
    Asteroid* asteroid;

    if (pool.size() == 0 || pool.front()->active) {
        asteroid = new Asteroid(astro);
    } else {
        asteroid = pool.front();
        pool.pop();
    }
    asteroid->anim = anim;
    asteroid->x = x;
    asteroid->y = y;
    asteroid->dx = 1 + randf(2); // move at a random speed
    asteroid->dy = 1 + randf(2);
    if (std::rand() % 2) asteroid->dx *= -1; // move to the left or right
    if (std::rand() % 2) asteroid->dy *= -1;
    asteroid->heading = randf(360);
    asteroid->active = true;

    pool.push(asteroid);
    astro.entities.push_back(asteroid);
}

void Asteroid::update() {
    Entity::update();
    Entity::wrap();
}

bool Asteroid::collides_with(Entity* e) {
    if (intersects(e)) {
        active = false; // the asteroid gets destroyed
        Explosion::spawn(astro, astro.animations["explosion_asteroid"], x, y);
        if (anim.r > 30) {
            astro.score += 10;
            astro.sounds["bang_lg"].play();
            spawn(astro, astro.animations["asteroid_md"], x, y);
            spawn(astro, astro.animations["asteroid_md"], x, y);
        }
        else if (anim.r > 20) {
            astro.score += 20;
            astro.sounds["bang_md"].play();
            spawn(astro, astro.animations["asteroid_sm"], x, y);
            spawn(astro, astro.animations["asteroid_sm"], x, y);
        }
        else {
            astro.score += 30;
            astro.sounds["bang_sm"].play();
        }
        return true;
    }
    return false;
}
