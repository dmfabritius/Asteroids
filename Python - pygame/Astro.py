import pygame
import random
import Global
from Animation import *
from Entity import *
from Asteroid import *
from Explosion import *
from Laser import *
from Ship import *
from Saucer import *

class Astro:

  def __init__(self):
    pygame.init()
    pygame.display.set_caption("PyAsteroids")
    self.window = pygame.display.set_mode((Global.WIDTH, Global.HEIGHT))
    self.clock = pygame.time.Clock()
    self.load_sounds()
    self.create_animations()
    Global.ship = Ship(Global.animations["ship"], Global.WIDTH * 0.5, Global.HEIGHT * 0.5)
    Global.entities.append(Global.ship)
    for i in range(4): # create some initial asteroids
      Asteroid.spawn(Global.animations["asteroid_lg"], 0, random.randrange(Global.HEIGHT))

  def load_sounds(self):
    pygame.mixer.init()
    pygame.mixer.set_num_channels(24)
    pygame.mixer.music.set_volume(0.2)
    pygame.mixer.music.load("audio\\solveThePuzzle.ogg")
    pygame.mixer.music.play(-1)  # loop the background music
    Global.sounds["bang_lg"] = pygame.mixer.Sound("audio\\bang_lg.wav")
    Global.sounds["bang_md"] = pygame.mixer.Sound("audio\\bang_md.wav")
    Global.sounds["bang_sm"] = pygame.mixer.Sound("audio\\bang_sm.wav")
    Global.sounds["laser"] = pygame.mixer.Sound("audio\\laser.wav")
    Global.sounds["thrust"] = pygame.mixer.Sound("audio\\thrust.wav")
    Global.sounds["saucer"] = pygame.mixer.Sound("audio\\saucer.wav")

  def create_animations(self):
    self.background = pygame.image.load("images\\outerspace.jpg").convert_alpha()
    self.spritesheet = pygame.image.load("images\\spritesheet.png").convert_alpha()

    Global.animations["asteroid_lg"] = Animation(self.spritesheet, 0, 384, 80, 80, 16, 0.15)
    Global.animations["asteroid_md"] = Animation(self.spritesheet, 0, 464, 60, 60, 16, 0.15)
    Global.animations["asteroid_sm"] = Animation(self.spritesheet, 0, 524, 40, 40, 16, 0.15)
    Global.animations["explosion_asteroid"] = Animation(self.spritesheet, 0, 0, 192, 192, 32, 0.4)
    Global.animations["explosion_ship"] = Animation(self.spritesheet, 0, 192, 192, 192, 32, 0.4)
    Global.animations["laser"] = Animation(self.spritesheet, 1540, 384, 32, 48, 8, 0.4)
    Global.animations["laser_saucer"] = Animation(self.spritesheet, 1540, 444, 32, 48, 8, 0.4)
    Global.animations["saucer"] = Animation(self.spritesheet, 2200, 384, 45, 73, 6, 0.15)
    Global.animations["ship"] = Animation(self.spritesheet, 1820, 384, 42, 140, 1, 0, -68)
    Global.animations["ship_thrusting"] = Animation(self.spritesheet, 1862, 384, 42, 140, 6, 0.25, -68)

  def run(self):
    self.running = True
    while self.running:
      self.clock.tick(60)  # limit the game loop to 60 frames per second
      self.handle_events()
      self.update()
      self.draw()
    pygame.quit()

  def handle_events(self):
    pressed = pygame.key.get_pressed()
    if pressed[pygame.K_LEFT] or pressed[pygame.K_a]: Global.ship.heading += 3
    if pressed[pygame.K_RIGHT] or pressed[pygame.K_d]: Global.ship.heading -= 3
    if pressed[pygame.K_z] or pressed[pygame.K_m]:
      Laser.spawn(Global.animations["laser"], Global.ship.x, Global.ship.y, Global.ship.heading)
    Global.ship.thrusting = pressed[pygame.K_UP] or pressed[pygame.K_w]

    for event in pygame.event.get():
      if event.type == pygame.QUIT: self.running = False
      if event.type == pygame.KEYDOWN:
        if event.key == pygame.K_ESCAPE: self.running = False
        elif event.key == pygame.K_SPACE:
          Global.sounds["laser"].play()
          Laser.spawn(Global.animations["laser"], Global.ship.x, Global.ship.y, Global.ship.heading)

      if event.type == pygame.MOUSEBUTTONDOWN:
        if event.button == 1:  # left click
          Global.sounds["laser"].play()
          Laser.spawn(Global.animations["laser"], Global.ship.x, Global.ship.y, Global.ship.heading)

  def update(self):
    if random.randint(0, 600) == 0:  # throw in another asteroid occasionally
      Asteroid.spawn(Global.animations["asteroid_lg"], 0, random.randrange(Global.HEIGHT))
    if random.randint(0, 850) == 0 and Global.saucer is None:  # suddenly an enemy saucer appears!
      Global.saucer = Saucer(Global.animations["saucer"])
      Global.entities.append(Global.saucer)

    # loop thru a copy of the Global.entities list so we can remove items
    Global.currentEntities = Global.entities[:]
    for e in Global.currentEntities:
      e.update()
      e.check_collisions()
      if not e.active: Global.entities.remove(e)

  def draw(self):
    images = []
    images.append((self.background, (0, 0)))
    for e in Global.entities: images.append(e.draw())
    self.window.blits(images)
    pygame.display.flip()
