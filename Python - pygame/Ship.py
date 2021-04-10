import pygame, math, Global
from Entity import *
from Explosion import *

class Ship(Entity):
  maxSpeed = 15

  def __init__(self, anim, x, y):
    super().__init__(anim, x, y, 0)
    self.thrusting = False
    self.thrustChannel = pygame.mixer.Channel(pygame.mixer.get_num_channels() - 1)

  def update(self):
    if self.thrusting:
      self.anim = Global.animations["ship_thrusting"]
      if not self.thrustChannel.get_busy():
        self.thrustChannel.play(Global.sounds["thrust"])
      self.dx += math.cos(math.radians(-self.heading)) * 0.2
      self.dy += math.sin(math.radians(-self.heading)) * 0.2
    else:
      self.anim = Global.animations["ship"]
      self.thrustChannel.stop()
      self.dx *= 0.99
      self.dy *= 0.99

    speed = math.sqrt(self.dx * self.dx + self.dy * self.dy)
    if speed > Ship.maxSpeed:
      self.dx *= Ship.maxSpeed / speed
      self.dy *= Ship.maxSpeed / speed

    super().update()
    super().wrap()  # wrap around the display edges

  def check_collisions(self):
    for e in Global.currentEntities:
      if (e.collides_with(self)):
        Explosion.spawn(Global.animations["explosion_ship"], self.x, self.y)
        Global.sounds["bang_lg"].play()
        self.x = Global.WIDTH * 0.5  # reset the Global.ship to the center of the screen
        self.y = Global.HEIGHT * 0.5
        self.dx = 0
        self.dy = 0
