#include "HighScores.h"

// there are lots of ways this could be implemented, but this seemed like fun

std::string HighScores::host = "localhost:3000";
std::string HighScores::apiUrl = "api/v1/scores?apikey=210caa35ecb9&action=";
int HighScores::lowestHighScore;
std::string HighScores::scores;

void HighScores::read() {
    lowestHighScore = 0;
    scores = "Loading...";
    sf::Http http(host);
    sf::Http::Request request(apiUrl + "read");
    sf::Http::Response response = http.sendRequest(request, sf::milliseconds(200));
    if (response.getStatus() == sf::Http::Response::Ok)
        parse(response.getBody());
    else
        //std::cout << "Warning: unable to load high scores\n";
        parse("Cherno,5230;David,2480;Alice,2470;Bob,1980");
}

void HighScores::parse(const std::string& scoreData) {
    int numScores = 0;
    unsigned int prev = 0, pos = 0, len = scoreData.length();
    std::ostringstream stream;
    stream << " - HIGH SCORES -\n\n";
    while (pos < len && prev < len) {
        pos = scoreData.find(';', prev);
        if (pos == std::string::npos) pos = len; // if semicolon not found, set pos to end of scoreData
        std::string token = scoreData.substr(prev, pos - prev);
        if (!token.empty()) {
            unsigned int pos = token.find(",");
            stream << std::setw(10) << std::left << token.substr(0, pos) << ' '
                << std::setw(6) << std::right << token.substr(pos + 1) << '\n';
            lowestHighScore = atoi(token.substr(pos + 1).c_str());
            numScores++;
        }
        prev = pos + 1;
    }
    if (numScores < 10) lowestHighScore = 0;

    scores = stream.str();
}

void HighScores::write(const std::string& name, const std::string& score) {
    sf::Http http(host);
    std::string url = apiUrl + "write&name=" + name + "&score=" + score;
    sf::Http::Request request(url);
    sf::Http::Response response = http.sendRequest(request, sf::milliseconds(200));
    if (response.getStatus() != sf::Http::Response::Ok)
        std::cout << "Warning: unable to save score" << std::endl;
    read(); // reload a new sorted top-10 list
}
