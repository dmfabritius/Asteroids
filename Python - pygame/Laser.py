import math
import Global
from collections import deque
from Entity import *

class Laser(Entity):
  pool = deque()

  @staticmethod
  def spawn(anim, x, y, heading, enemy = False):
    asset = Laser() if len(Laser.pool) == 0 or Laser.pool[0].active else Laser.pool.popleft()
    asset.anim = anim
    asset.x = x
    asset.y = y
    asset.dx = 6 * math.cos(math.radians(-heading))
    asset.dy = 6 * math.sin(math.radians(-heading))
    asset.heading = heading
    asset.active = True
    asset.enemy = enemy

    Laser.pool.append(asset)
    Global.entities.insert(0, asset)

  def update(self):
    super().update()
    if self.x < 0 or self.x > Global.WIDTH or self.y < 0 or self.y > Global.HEIGHT:
      self.active = False # delete the laser pulse when it goes off the screen


  def check_collisions(self):
    if not self.active or self.enemy: return # collisions between enemy laser and ship handled by the ship
    for e in Global.currentEntities:
        self.active = not e.collides_with(self)
        if not self.active: break

  def collides_with(self, other):
    if self.enemy and self.intersects(other):
        self.active = False # enemy laser gets destroyed by collision with ship
        return True
    return False
