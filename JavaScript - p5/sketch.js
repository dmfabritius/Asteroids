/*
    Partial clone of the classic Asteroids game using animated sprites.
    Demonstrates the use of inheritance and polymorphism in JavaScript.

    Inspired by:
      "Challenge #46: Asteroids" by The Coding Train, https://www.youtube.com/watch?v=hacZU523FyM
      "Let's make 16 games in C++: Asteroids" by FamTrinli, https://www.youtube.com/watch?v=rWaSo2usU4A
*/

// Initialize environment (gets called once when the page is loaded)
function preload() {
    loadContent(); // in Astro.js
}

function setup() {
    createCanvas(1200, 720);
    imageMode(CENTER);
    textFont(font);
    textSize(18);
    fill(80, 255, 80);
    setupSounds();
    createAnimations();
}

// Draw/update/animation loop (gets called by p5 library in an endless loop)
function draw() {
    handleEvents(); // in Game.js
    updateEntities();
    drawEntities();
}

// it's a terrible idea to extend a built-in type, but here's an example of how it can be done
// this finds a given item in an array and removes it
Object.defineProperty(Array.prototype, 'remove', {
    value: function (item) { this.splice(this.indexOf(item), 1); }
});
