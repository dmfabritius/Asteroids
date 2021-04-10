#include "Astro.h"

// Inspired by the video "Let's make 16 games in C++: Asteroids" by FamTrinli
// https://www.youtube.com/watch?v=rWaSo2usU4A
//

int main() {
    std::srand((unsigned int)time(0)); // seed random number generator

    Astro().run();

    return EXIT_SUCCESS;
}
