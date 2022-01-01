#include "Astro.h"
#include "Entity.h"
#include "Ship.h"
#include "Saucer.h"
#include "Laser.h"
#include "Asteroid.h"
#include "HighScores.h"

Astro::Astro() {
    window.create(sf::VideoMode(WIDTH, HEIGHT), "Ast*roids! SFML v2.5.1");
    window.setFramerateLimit(60);
    std::thread(HighScores::read).detach();
    load_content();
}

void Astro::load_content() {
    font.loadFromFile("fonts/ocr.ttf");
    spritesheet.loadFromFile("images/spritesheet.png");
    outerspace.loadFromFile("images/outerspace.jpg");
    background.setTexture(outerspace); // the background doesn't need to be animated, so it's just a normal sf::Sprite

    // textures can be re-used for multiple animations; define which parts of each texture to use for each sprite
    animations["asteroid_lg"] = Animation(spritesheet, 0, 384, 80, 80, 16, 0.15f);
    animations["asteroid_md"] = Animation(spritesheet, 0, 464, 60, 60, 16, 0.15f);
    animations["asteroid_sm"] = Animation(spritesheet, 0, 524, 40, 40, 16, 0.15f);
    animations["explosion_asteroid"] = Animation(spritesheet, 0, 0, 192, 192, 32, 0.4f);
    animations["explosion_ship"] = Animation(spritesheet, 0, 192, 192, 192, 32, 0.4f);
    animations["laser"] = Animation(spritesheet, 1540, 384, 32, 48, 8, 0.4f);
    animations["laser_saucer"] = Animation(spritesheet, 1540, 444, 32, 48, 8, 0.4f);
    animations["saucer"] = Animation(spritesheet, 2200, 384, 45, 73, 6, 0.15f);
    animations["ship"] = Animation(spritesheet, 1820, 384, 42, 140, 1, 0, -34);
    animations["ship_thrusting"] = Animation(spritesheet, 1862, 384, 42, 140, 6, 0.25f, -34);

    sounds["bang_lg"].setBuffer(load_soundfile("audio/bang_lg.wav"));
    sounds["bang_md"].setBuffer(load_soundfile("audio/bang_md.wav"));
    sounds["bang_sm"].setBuffer(load_soundfile("audio/bang_sm.wav"));
    sounds["laser"].setBuffer(load_soundfile("audio/laser.wav"));
    sounds["thrust"].setBuffer(load_soundfile("audio/thrust.wav"));
    sounds["thrust"].setLoop(true);
    sounds["saucer"].setBuffer(load_soundfile("audio/saucer.wav"));
    sounds["saucer"].setLoop(true);
    sounds["saucer"].setVolume(15);

    text["highscores"] = sf::Text(HighScores::scores, font, 32);
    text["highscores"].setPosition(460, 80);
    text["begin"] = sf::Text("- Press enter to begin -", font, 32);
    text["begin"].setPosition(400, 550);
    text["score"] = sf::Text("Score: 0", font, 32);
    text["score"].setPosition(20, 20);
    text["congrats"] = sf::Text("You set a new high score!", font, 32);
    text["congrats"].setPosition(420, 150);
    text["name"] = sf::Text("Name: ", font, 32);
    text["name"].setPosition(420, 220);
    text["cursor"] = sf::Text("|", font, 32);
    text["cursor"].setFillColor(sf::Color::Cyan);

    // https://patrickdearteaga.com/arcade-music/
    music.openFromFile("audio/solveThePuzzle.ogg");
    music.setLoop(true);
    music.setVolume(10); // lower volume to 10%
    music.play();
}

sf::SoundBuffer& Astro::load_soundfile(const std::string& filename) {
    sf::SoundBuffer* buffer = new sf::SoundBuffer();
    buffer->loadFromFile(filename);
    return *buffer;
}

void Astro::run() {
    while (window.isOpen()) {
        poll_events();
        handle_keypress();
        update();
        draw();
    }
}

void Astro::init() {
    // this gets called from poll_events() when a key is pressed to advance from READY to PLAYING
    score = 0;
    playerName = "";
    while (!entities.empty()) { // reset/clear the list of active game entities
        entities.front()->active = false;
        entities.pop_front();
    }
    if (ship) delete ship; // if the player restarts the game, it's just easiest to destory/recreate the ship
    ship = new Ship(*this, animations["ship"]);
    entities.push_back(ship);

    if (saucer) delete saucer; // it wouldn't be too difficult to reuse the saucer, but again, this is easiest
    saucer = new Saucer(*this, animations["saucer"]);
    entities.push_back(saucer);

    for (int i = 0; i < 3; i++) // create some initial asteroids
        Asteroid::spawn(*this, animations["asteroid_lg"], 0, randf(HEIGHT));
}

void Astro::poll_events() {
    sf::Event event;
    while (window.pollEvent(event)) {
        if (event.type == sf::Event::Closed)
            window.close();
        else if (gameState == GameState::READY && event.type == sf::Event::KeyReleased) {
            init(); // (re)set game to initial state
            gameState = GameState::PLAYING;
            std::this_thread::sleep_for(std::chrono::milliseconds(333)); // wait for user to release the key
            while (window.pollEvent(event)); // clear the event queue
        }
        else if (gameState == GameState::GAMEOVER && event.type == sf::Event::TextEntered) {
            int u = event.text.unicode;
            if (u == ENTER && playerName.length() != 0) {
                std::thread(HighScores::write, playerName, std::to_string(score)).detach();
                gameState = GameState::READY;
                std::this_thread::sleep_for(std::chrono::milliseconds(333)); // wait for user to release the key
                while (window.pollEvent(event)); // clear the event queue
            }
            else if (u == BACKSPACE && playerName.length() != 0) {
                playerName = playerName.substr(0, playerName.length() - 1);
            }
            else if (u > SPACE && u < EXTENDED && playerName.length() < 10) {
                playerName += static_cast<char>(u);
            }
        }
        else if (gameState == GameState::PLAYING && event.type == sf::Event::KeyReleased) {
            if (event.key.code == sf::Keyboard::Space) {
                Laser::spawn(*this, ship->x, ship->y, ship->heading);
                sounds["laser"].play();
            }
        }
    }
}

void Astro::handle_keypress() {
    if (sf::Keyboard::isKeyPressed(sf::Keyboard::Escape)) window.close();

    if (gameState == GameState::PLAYING) {
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left))  ship->heading -= 3; // rotate clockwise by 3 degrees
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) ship->heading += 3;
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Z)) // lots 'o lasers!!!!
            Laser::spawn(*this, ship->x, ship->y, ship->heading);

        ship->thrusting = sf::Keyboard::isKeyPressed(sf::Keyboard::Up);
    }
}

void Astro::update() {
    if (gameState == GameState::READY) {
        text["highscores"].setString(HighScores::scores);
    }
    else if (gameState == GameState::PLAYING) {
        // throw in another asteroid or an enemy flying saucer occasionally
        if (std::rand() % 900 == 0)
            Asteroid::spawn(*this, animations["asteroid_lg"], 0, randf(HEIGHT));
        if (std::rand() % 400 == 0 && saucer->hidden)
            saucer->show();

        // loop thru a copy of the entities list so we can modify the original list
        currentEntities = std::list<Entity*>(entities);
        for (Entity* e : currentEntities) {
            e->update(); // update the heading, velocity, and/or position of the entity
            e->check_collisions();

            // inactive entities are removed, but they continue to exist in memory as part
            // of their respective asset pools and will be re-used as needed
            if (!e->active) entities.remove(e);
        }

        text["score"].setString("Score: " + std::to_string(score));
    }
    else if (gameState == GameState::GAMEOVER) {
        text["name"].setString("Name: " + playerName);
        float position = text["name"].getGlobalBounds().left + text["name"].getGlobalBounds().width;
        text["cursor"].setPosition(position, 220); // position the cursor after the name
    }
}

void Astro::draw() {
    window.draw(background);
    if (gameState == GameState::READY) {
        window.draw(text["highscores"]);
        window.draw(text["begin"]);
    }
    else if (gameState == GameState::PLAYING || gameState == GameState::GAMEOVER) {
        for (Entity* e : entities) e->draw();
        ship->draw_extra_ships();
        window.draw(text["score"]);
    }

    if (gameState == GameState::GAMEOVER) {
        window.draw(text["congrats"]);
        window.draw(text["name"]);
        if (clock.getElapsedTime().asMilliseconds() % 600 < 300) window.draw(text["cursor"]);
    }
    window.display();
}

// a little global helper function to return a random number as a float
float randf(int n) {
    return static_cast<float>(std::rand() % n); // number between 0 and n-1
}
