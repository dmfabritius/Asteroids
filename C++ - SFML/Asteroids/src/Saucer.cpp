#include "Astro.h"
#include "Saucer.h"
#include "Ship.h"
#include "Laser.h"
#include "Explosion.h"

Saucer::Saucer(Astro& astro, const Animation& anim) :
    Entity(astro, anim, 0, static_cast<float>(-astro.HEIGHT), 0), hidden(true) {}

void Saucer::show() {
    hidden = false;
    x = 0;
    y = randf(astro.HEIGHT);
    astro.sounds["saucer"].play();
    dx = 2 + randf(3); // move at a random speed
    dy = 1 + randf(2);
    if (std::rand() % 2) {
        dx *= -1;        // randomly move right to left
        x = static_cast<float>(astro.WIDTH); // start on the right-hand side of the screen
    }
    if (std::rand() % 2) dy *= -1; // move up or down
}

void Saucer::hide() {
    astro.sounds["saucer"].stop();
    x = static_cast<float>(-astro.WIDTH);
    hidden = true;
}

void Saucer::update() {
    if (hidden) return; // don't do anything if the saucer isn't being shown
    Entity::update();
    if (std::rand() % 150 == 0) {
        float heading = atan2(astro.ship->x - x, y - astro.ship->y) / DEG2RAD - 90;
        Laser::spawn(astro, x, y, heading, true);
    }
    if (x < 0 || x > astro.WIDTH || y < 0 || y > astro.HEIGHT) hide();
}

bool Saucer::collides_with(Entity* e) {
    if (!hidden && intersects(e)) {
        astro.score += 50;
        Explosion::spawn(astro, astro.animations["explosion_ship"], x, y);
        astro.sounds["bang_lg"].play();
        hide();
        return true;
    }
    return false;
}
