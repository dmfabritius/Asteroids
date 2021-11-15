// The Coding Train: Working with Data and APIs in JavaScript
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X
import P5 from "p5";

export default class HighScores {
  static readonly apiUrl = "http://localhost:3000/v1/highscores";
  static data = [
    { name: "Player0", score: 60 },
    { name: "Player1", score: 50 },
    { name: "Player2", score: 40 },
    { name: "Player3", score: 30 },
    { name: "Player4", score: 20 },
    { name: "Player5", score: 10 },
    { name: "Player6", score: 10 },
    { name: "Player7", score: 10 },
    { name: "Player8", score: 10 },
    { name: "Player9", score: 10 },
  ];
  static lowest = 10;

  static add(name: string, score: number) {
    HighScores.data.push({ name, score });
    HighScores.data.sort((a, b) => b.score - a.score); // sort descending by score
    HighScores.data = HighScores.data.splice(0, 10); // limit list to 10 high scores
    HighScores.lowest = HighScores.data[HighScores.data.length - 1].score;
  }

  static async read() {
    //const response = await fetch(HighSchores.apiUrl);
    //HighSchores.data = await response.json();
    //HighSchores.lowest = highScoreData[highScoreData.length - 1].score;
  }

  static async write(name: string, score: number) {
    //const options = {
    //    method: "POST",
    //    headers: { "Content-Type": "application/json" },
    //    body: JSON.stringify({ name, score })
    //};
    //const response = await fetch(HighSchores.apiUrl, options);
  }

  static draw(p5: P5) {
    p5.text("High Scores", 455, 110);
    let y = 200;
    for (let s of HighScores.data) {
      p5.text(`${s.name.padEnd(10, " ")} ${s.score.toString().padStart(6, " ")}`, 400, y);
      y += 30;
    }
  }
}
