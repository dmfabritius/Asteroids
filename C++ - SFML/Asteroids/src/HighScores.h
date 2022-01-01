#pragma once
#include "Program.h"

class HighScores {
public:
  static std::string host;
  static std::string apiUrl;
  static int lowestHighScore;
    static std::string scores;
    static void read();
    static void write(const std::string& name, const std::string& score);

private:
    static void parse(const std::string& response);
};
