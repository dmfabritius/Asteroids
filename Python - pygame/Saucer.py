import pygame, math, random, Global
from Entity import *
from Laser import *
from Explosion import *

class Saucer(Entity):

  def __init__(self, anim):
    super().__init__(anim, 0, Global.HEIGHT * 0.25 + random.randint(0, Global.HEIGHT / 2), 0)
    self.thrustChannel = pygame.mixer.Channel(pygame.mixer.get_num_channels() - 1)
    if Global.saucer is not None:
      self.active = False
      return

    self.dx = random.randint(2, 4) # move at a random speed, mostly horizontal
    self.dy = random.randint(1, 2)
    if (random.randint(0, 1) == 0):
      self.dx *= -1         # randomly move right to left
      self.x = Global.WIDTH # start on the right-hand side of the screen
    if (random.randint(0, 1) == 0):
      self.dy *= -1 # move up or down

  def update(self):
    super().update()
    if not self.thrustChannel.get_busy():
      self.thrustChannel.play(Global.sounds["saucer"])

    if random.randint(0, 150) == 0:
        heading = math.degrees(math.atan2(Global.ship.x - self.x, self.y - Global.ship.y)) - 90
        Laser.spawn(Global.animations["laser_saucer"], self.x, self.y, -heading, True)

    if self.x < 0 or self.x > Global.WIDTH or self.y < 0 or self.y > Global.HEIGHT:
        self.destroy()

  def collides_with(self, other):
    if self.intersects(other):
        self.destroy()
        Explosion.spawn(Global.animations["explosion_ship"], self.x, self.y)
        Global.sounds["bang_lg"].play()
        return True
    return False

  def destroy(self):
    self.thrustChannel.stop()
    self.active = False
    Global.saucer = None
