#pragma once
#include "Program.h"
#include "Animation.h"
class Entity;
class Ship;
class Saucer;

enum class GameState { READY, PLAYING, GAMEOVER };

class Astro {
public:
    const int WIDTH = 1200;
    const int HEIGHT = 800;
    sf::RenderWindow window;
    std::unordered_map<std::string, sf::Text> text;
    std::unordered_map<std::string, sf::Sound> sounds;
    std::unordered_map<std::string, Animation> animations;
    std::list<Entity*> entities;
    std::list<Entity*> currentEntities;
    Ship* ship = nullptr;
    Saucer* saucer = nullptr;
    GameState gameState = GameState::READY;
    int score;

    Astro();
    void run();

private:
    sf::Texture outerspace, spritesheet;
    sf::Sprite background;
    sf::Music music;
    sf::Font font;
    sf::Clock clock;
    std::string playerName;

    void init();
    void load_content();
    sf::SoundBuffer& load_soundfile(const std::string& filename);
    void poll_events();
    void handle_keypress();
    void update();
    void draw();
};

// a little global helper function to return a random number as a float
float randf(int n);
