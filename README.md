## Asteroids
A partial clone of the classic Asteroids arcade game created for educational purposes. A nearly identical version of the game using the same object-oriented programming structure was created five times in five different programming languages: C++, C#, Java, Python, and JavaScript. For comparison purposes, four different approaches were used to allow game objects to access variables/data needed throughout the game. The "best" approach depends on a number of different considerations, only some of which are even relevant for such a simple game.

With the exception of the Java version, each language has its own solution file (.sln) and can be opened with Visual Studio 2017/2019. For the Java version, open its root folder in Visual Studio Code or your editor/IDE of choice.

##### Code Organization
With the exception of the JavaScript version, the main entry point for all versions is the very minimal file/class _Program_. This is used to construct an instance of the primary game class, _Astro_, and call its run() method. For the JavaScript version, which uses the _p5.js_ library, _sketch.js_ contains the primary setup() and draw() functions.

##### C++ with SFML v2.5.1

For this version, a reference to the instance of the primary game class is passed as a parameter to the constructor for every other game object. This reference enables the game objects to access the public member variables of the game (e.g., sounds). This approach can get cumbersome in more complex projects, but it works well enough here.

##### C# with Monogame SDK v3.7

For this version, the primary game class is implemented as a simple singleton. All other game objects access the public member variables of the game via the public static _Instance_ property of the _Astro_ class. This approach is probably overly clever, although it is true that only one instance of the _Astro_ class should ever exist. It reduces the number of public static variables (for what that's worth), but adds an extra naming layer when accessing these shared variables.

##### Java with AWT and Swing

For this version, the primary game class contains public static member variables for all the data which needs to be shared with the other game objects. This is a fairly popular approach and is easy to implement, but public static variables can seem awfully similar to global variables, which bothers some people. For this simple game, you could make a good case for this being the best approach.

##### Python with pygame

For this version, the variables needed by all the game objects are simply global variables. I have no idea how to do this in Python without using global variables, or if it's even possible. But for experimenting with machine learning and teaching the computer to play a game, this might offer a convenient starting point. 

##### JavaScript with p5.js

For this version, the variables needed by all the game objects are simply global variables. The p5.js library is a little different than the other game engines/graphics libraries used in the other languages, so the functionality for _Astro_ is a little less object-oriented in this version.
