#include "Astro.h"
#include "Entity.h"

Entity::Entity(Astro& astro, const Animation& anim, float x, float y, float heading) :
    astro(astro), anim(anim), x(x), y(y), heading(heading) {
}

void Entity::update() {
    x += dx; // update the position with its delta
    y += dy;

    frame += anim.rate; // advance the frame (may not move it fully to the next frame)
    if (frame >= anim.frames.size()) {
        frame = 0; // loop the animation back to the first frame
        looped = true;
    }
    anim.sprite.setTextureRect(anim.frames[static_cast<int>(frame)]); // set the frame of animation (truncated to integer)
}

void Entity::draw() {
    anim.sprite.setPosition(x, y);
    anim.sprite.setRotation(heading + 90); // set the heading in degrees and correct for all animations being designed pointing upwards
    astro.window.draw(anim.sprite);
}

void Entity::check_collisions() {} // checks for collisions with all other entities

bool Entity::collides_with(Entity* e) { return false; } // handles collision with another entity

bool Entity::intersects(Entity* other) {
    float x = this->x - other->x; // x separation
    float y = this->y - other->y; // y separation
    float r = this->anim.r + other->anim.r; // sum of the two objects' radii
    return x * x + y * y < r * r; // it's faster if we don't bother taking the square root of both sides
}

void Entity::wrap() {
    if (x < 0) x = static_cast<float>(astro.WIDTH); else if (x > astro.WIDTH) x = 0;
    if (y < 0) y = static_cast<float>(astro.HEIGHT); else if (y > astro.HEIGHT) y = 0;
}
