// The Coding Train: Working with Data and APIs in JavaScript
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X


const apiUrl = "http://localhost:3000/v1/highscores";
let highScoreData = [
    { name: "Player0", score: 60 },
    { name: "Player1", score: 50 },
    { name: "Player2", score: 40 },
    { name: "Player3", score: 30 },
    { name: "Player4", score: 20 },
    { name: "Player5", score: 10 },
    { name: "Player6", score: 10 },
    { name: "Player7", score: 10 },
    { name: "Player8", score: 10 },
    { name: "Player9", score: 10 }
];
let lowestHighScore = 10;

function addHighScore(name, score) {
    highScoreData.push({ name, score });
    highScoreData.sort((a, b) => b.score - a.score); // sort descending by score
    highScoreData = highScoreData.splice(0, 10); // limit list to 10 high scores
    lowestHighScore = highScoreData[highScoreData.length - 1].score;
}

async function readHighScores() {
    //const response = await fetch(apiUrl);
    //highScoreData = await response.json();
    //lowestHighScore = highScoreData[highScoreData.length - 1].score;
}
async function writeHighScore(name, score) {
    //const options = {
    //    method: "POST",
    //    headers: { "content-type": "application/json" },
    //    body: JSON.stringify({ name, score })
    //};
    //const response = await fetch(apiUrl, options);
}
function drawHighScores() {
    text("High Scores", 455, 110);
    let y = 200;
    for (let s of highScoreData) {
        text(`${s.name.padEnd(10, ' ') } ${s.score.toString().padStart(6, ' ') }`, 400, y);
        y += 30;
    }
}
