import random
import Global
from collections import deque
from Entity import *
from Explosion import *

class Asteroid(Entity):
  pool = deque()

  @staticmethod
  def spawn(anim, x, y):
    asset = Asteroid() if len(Asteroid.pool) == 0 or Asteroid.pool[0].active else Asteroid.pool.popleft()
    asset.anim = anim
    asset.x = x
    asset.y = y
    asset.dx = random.randint(1, 3) # move at a random speed
    asset.dy = random.randint(1, 3)
    if random.randint(0, 1) == 0: asset.dx *= -1 # move to the left or right
    if random.randint(0, 1) == 0: asset.dy *= -1
    asset.heading = random.randint(0, 360)
    asset.active = True

    Asteroid.pool.append(asset)
    Global.entities.append(asset)

  def update(self):
    super().update()
    super().wrap() # wrap around the display edges


  def collides_with(self, other):
    if self.intersects(other):
      self.active = False
      Explosion.spawn(Global.animations["explosion_asteroid"], self.x, self.y)
      if self.anim.r > 30:
        Global.sounds["bang_lg"].play()
        Asteroid.spawn(Global.animations["asteroid_md"], self.x, self.y)
        Asteroid.spawn(Global.animations["asteroid_md"], self.x, self.y)
      elif (self.anim.r > 20):
        Global.sounds["bang_md"].play()
        Asteroid.spawn(Global.animations["asteroid_sm"], self.x, self.y)
        Asteroid.spawn(Global.animations["asteroid_sm"], self.x, self.y)
      else:
        Global.sounds["bang_sm"].play()
      return True
    else:
      return False
