#include "Astro.h"
#include "Ship.h"
#include "Saucer.h"
#include "Explosion.h"
#include "HighScores.h"

Ship::Ship(Astro& astro, const Animation& anim) :
    Entity(astro, anim, astro.WIDTH * 0.5f, astro.HEIGHT * 0.5f, 0),
    thrusting(false),
    extraShips(3) {
    extraShip = astro.animations["ship"].sprite;
    extraShip.setTextureRect(astro.animations["ship"].frames[0]);
    extraShip.setRotation(0);
    extraShip.setScale(0.65f, 0.65f);
}

void Ship::update() {
    if (thrusting) {
        anim = astro.animations["ship_thrusting"];
        if (astro.sounds["thrust"].getStatus() == sf::Sound::Stopped)
            astro.sounds["thrust"].play(); // play when thrusting, but not if it's already playing
        dx += cos(heading * DEG2RAD) * 0.2f;
        dy += sin(heading * DEG2RAD) * 0.2f;
    }
    else {
        anim = astro.animations["ship"];
        astro.sounds["thrust"].stop();
        dx *= 0.99f;
        dy *= 0.99f;
    }

    float speed = sqrt(dx * dx + dy * dy);
    if (speed > MAXSPEED) {
        dx *= MAXSPEED / speed;
        dy *= MAXSPEED / speed;
    }

    Entity::update();
    Entity::wrap();
}

void Ship::check_collisions() {
    for (Entity* e : astro.currentEntities) {
        if (e->active && e->collides_with(this)) {
            Explosion::spawn(astro, astro.animations["explosion_ship"], x, y);
            astro.sounds["bang_lg"].play();
            x = astro.WIDTH * 0.5f; // reset the ship to the center of the screen
            y = astro.HEIGHT * 0.5f;
            dx = dy = 0;

            if (--extraShips < 0) {
                HighScores::scores = "Loading...";
                astro.saucer->hide();
                astro.gameState = (astro.score > HighScores::lowestHighScore) ?
                    GameState::GAMEOVER : // prompt for player's name
                    GameState::READY; // show high scores
            }
        }
    }
}

void Ship::draw_extra_ships() {
    for (int i = 0; i < extraShips; i++) {
        extraShip.setPosition(1000 + 40.0f * i, 60.0f);
        astro.window.draw(extraShip);
    }
}
