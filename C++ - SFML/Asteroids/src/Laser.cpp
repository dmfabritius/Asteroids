#include "Astro.h"
#include "Laser.h"

// since lasers are continually being created and destroyed,
// instead of using a normal public constructor to create them,
// a static method with a reusable pool of assets is used
void Laser::spawn(Astro& astro, float x, float y, float heading, bool enemy) {
    std::queue<Laser*> pool;
    Laser* laser;

    if (pool.size() == 0 || pool.front()->active) {
        laser = new Laser(astro);
    } else {
        laser = pool.front();
        pool.pop();
    }
    laser->anim = (enemy) ? astro.animations["laser_saucer"] : astro.animations["laser"];
    laser->x = x;
    laser->y = y;
    laser->dx = 6 * cos(heading * DEG2RAD);
    laser->dy = 6 * sin(heading * DEG2RAD);
    laser->heading = heading;
    laser->active = true;
    laser->enemy = enemy;

    pool.push(laser);
    astro.entities.push_front(laser);
}

void Laser::update() {
    Entity::update();
    if (x < 0 || x > astro.WIDTH || y < 0 || y > astro.HEIGHT)
        active = false; // delete the laser pulse when it goes off the screen
}

void Laser::check_collisions() {
    if (enemy) return; // collisions between enemy laser and ship handled by the ship

    for (Entity* e : astro.currentEntities) {
        active = active && !e->collides_with(this);
        if (!active) break;
    }
}

bool Laser::collides_with(Entity* e) {
    if (enemy && intersects(e)) {
        active = false; // enemy laser gets destroyed by collision with ship
        return true;
    }
    return false;
}
