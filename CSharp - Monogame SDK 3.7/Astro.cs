using System.Collections.Generic;
using System.IO;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;

namespace Asteroids {

    public sealed class Astro : Game {

        // For this simple game, implementing Astro as a singleton is an alternative to
        // having its public member variables be static -- both approaches provide an easy
        // way for the entities to reference "global" info. Not sure which is "better,"
        // but it would also be possible to simply create a normal instance of Astro in Program
        // as a global variable and call it a day.
        private static Astro instance = null;
        public static Astro Instance { get => instance ?? (instance = new Astro()); }

        public readonly int WIDTH = 1280;
        public readonly int HEIGHT = 720;
        public readonly Dictionary<string, SoundEffect> sounds = new Dictionary<string, SoundEffect>();
        public readonly Dictionary<string, Animation> animations = new Dictionary<string, Animation>();
        public readonly List<Entity> entities = new List<Entity>();

        public enum GameState { READY, PLAYING, GAMEOVER };
        public GameState gameState = GameState.READY;
        public List<Entity> currentEntities;
        public int score;
        public Ship ship;     // the ship needs to be accessed by the saucer
        public Saucer saucer; // and the saucer needs to be accessed by the ship

        KeyboardState kbState, kbPrevState;
        ButtonState btnState, btnPrevState;
        SpriteBatch spriteBatch;
        SpriteFont font;
        Texture2D spritesheet, background;
        string playerName;

        private Astro() {
            new GraphicsDeviceManager(this) {
                GraphicsProfile = GraphicsProfile.HiDef, // enable support for large textures
                PreferredBackBufferWidth = WIDTH, // window dimensions
                PreferredBackBufferHeight = HEIGHT
            };
            Content.RootDirectory = "Content";
            Window.TextInput += HandleTextInput; // add event handler
        }

        protected override void LoadContent() {
            spriteBatch = new SpriteBatch(GraphicsDevice);
            font = Content.Load<SpriteFont>("OCR");

            System.Uri uri = new System.Uri("audio/background.mp3", System.UriKind.Relative);
            MediaPlayer.IsRepeating = true;
            MediaPlayer.Volume = 0.02f;
            MediaPlayer.Play(Song.FromUri("background", uri));

            sounds["bang_lg"] = LoadSound("bang_lg");
            sounds["bang_md"] = LoadSound("bang_md");
            sounds["bang_sm"] = LoadSound("bang_sm");
            sounds["laser"] = LoadSound("laser");
            sounds["thrust"] = LoadSound("thrust");
            sounds["saucer"] = LoadSound("saucer");

            background = LoadTexture("outerspace.jpg");
            spritesheet = LoadTexture("spritesheet.png");
            animations["asteroid_lg"] = new Animation(spritesheet, 0, 384, 80, 80, 16, 0.15);
            animations["asteroid_md"] = new Animation(spritesheet, 0, 464, 60, 60, 16, 0.15);
            animations["asteroid_sm"] = new Animation(spritesheet, 0, 524, 40, 40, 16, 0.15);
            animations["explosion_asteroid"] = new Animation(spritesheet, 0, 0, 192, 192, 32, 0.4);
            animations["explosion_ship"] = new Animation(spritesheet, 0, 192, 192, 192, 32, 0.4);
            animations["laser"] = new Animation(spritesheet, 1540, 384, 32, 48, 8, 0.4);
            animations["laser_saucer"] = new Animation(spritesheet, 1540, 444, 32, 48, 8, 0.4);
            animations["saucer"] = new Animation(spritesheet, 2200, 384, 45, 73, 6, 0.15);
            animations["ship"] = new Animation(spritesheet, 1820, 384, 42, 140, 1, 0, -34);
            animations["ship_thrusting"] = new Animation(spritesheet, 1862, 384, 42, 140, 6, 0.25, -34);

            HighScores.Instance.ReadWeb();
        }

        SoundEffect LoadSound(string filename) {
            using (FileStream fileStream = new FileStream($"audio/{filename}.wav", FileMode.Open)) {
                return SoundEffect.FromStream(fileStream);
            }
        }

        Texture2D LoadTexture(string filename) {
            using (FileStream fileStream = new FileStream($"images/{filename}", FileMode.Open)) {
                return Texture2D.FromStream(GraphicsDevice, fileStream);
            }
        }

        void InitGame() {
            score = 0;
            playerName = "";
            foreach (Entity e in entities) e.active = false;
            entities.Clear();
            ship = new Ship(WIDTH * 0.5f, HEIGHT * 0.5);
            saucer = new Saucer(); // there is only one saucer, but usually it is hidden
            entities.Add(ship);
            entities.Add(saucer);
            for (int i = 0; i < 3; i++)
                Asteroid.Spawn(animations["asteroid_lg"], 0, Program.random.Next(HEIGHT));
        }

        void HandleTextInput(object sender, TextInputEventArgs e) {
            if (gameState == GameState.READY) {
                InitGame();
                gameState = GameState.PLAYING;
                return;
            }
            if (gameState == GameState.PLAYING) return; // no text input during game play

            if (e.Character == '\r' && playerName.Length > 0) {
                HighScores.Instance.WriteWeb(playerName, score.ToString());
                HighScores.Instance.ReadWeb();
                gameState = GameState.READY;
            }
            else if (e.Character == '\b' && playerName.Length != 0) {
                playerName = playerName.Substring(0, playerName.Length - 1);
            }
            else if ((int)e.Character > 32 && playerName.Length < 10) {
                playerName += e.Character;
            }
        }

        void HandleInput() {
            kbState = Keyboard.GetState();
            if (kbState.IsKeyDown(Keys.Escape)) Exit();
            if (kbState.IsKeyDown(Keys.Space) && kbPrevState.IsKeyUp(Keys.Space)) {
                Laser.Spawn(ship.x, ship.y, ship.heading);
                sounds["laser"].Play();
            }
            if (kbState.IsKeyDown(Keys.Z)) // lots 'o lasers!!!!
                Laser.Spawn(ship.x, ship.y, ship.heading);
            if (kbState.IsKeyDown(Keys.A) || kbState.IsKeyDown(Keys.Left))
                ship.heading -= 0.075;
            if (kbState.IsKeyDown(Keys.D) || kbState.IsKeyDown(Keys.Right))
                ship.heading += 0.075;
            ship.thrusting = (kbState.IsKeyDown(Keys.W) || kbState.IsKeyDown(Keys.Up));
            kbPrevState = kbState;

            btnState = Mouse.GetState().LeftButton;
            if (btnState == ButtonState.Released && btnPrevState == ButtonState.Pressed) {
                Laser.Spawn(ship.x, ship.y, ship.heading);
                sounds["laser"].Play();
            }
            btnPrevState = btnState;
        }

        protected override void Update(GameTime gameTime) {
            if (gameState == GameState.PLAYING) {
                HandleInput();

                if (Program.random.Next() % 750 == 0)
                    Asteroid.Spawn(animations["asteroid_lg"], 0, Program.random.Next(HEIGHT));
                if (Program.random.Next() % 900 == 0 && saucer.hidden) {
                    saucer.Show();
                }

                // loop thru a copy of the entities list so we can modify the original
                currentEntities = new List<Entity>(entities);
                foreach (Entity e in currentEntities) {
                    e.Update();
                    e.CheckCollisions();
                    if (!e.active) entities.Remove(e);
                }
            }
            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime) {
            spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.NonPremultiplied);
            spriteBatch.Draw(background, Vector2.Zero, Color.White);
            if (gameState == GameState.READY) {
                HighScores.Instance.DrawWeb(spriteBatch, font);
                spriteBatch.DrawString(font, "- Press enter to begin -", new Vector2(420, 550), Color.White);
            }
            if (gameState == GameState.PLAYING || gameState == GameState.GAMEOVER) {
                foreach (Entity s in entities) s.Draw(spriteBatch);
                ship.DrawExtraShips(spriteBatch);
                spriteBatch.DrawString(font, $"Score: {score}" , new Vector2(20, 20), Color.White);
            }
            if (gameState == GameState.GAMEOVER) {
                spriteBatch.DrawString(font, "You set a new high score!", new Vector2(420, 150), Color.Wheat);
                spriteBatch.DrawString(font, "Name:", new Vector2(420, 220), Color.White);
                spriteBatch.DrawString(font, playerName, new Vector2(520, 220), Color.White);
                if (gameTime.TotalGameTime.Milliseconds % 500 > 250)
                    spriteBatch.DrawString(font, "|", new Vector2(510 + 20 * playerName.Length, 220), Color.Cyan);
            }
            spriteBatch.End();
            base.Draw(gameTime);
        }
    }
}
