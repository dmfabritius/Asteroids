from Entity import *
from collections import deque

class Explosion(Entity):
  pool = deque()

  @staticmethod
  def spawn(anim, x, y):
    asset = Explosion() if len(Explosion.pool) == 0 or Explosion.pool[0].active else Explosion.pool.popleft()
    asset.anim = anim
    asset.x = x
    asset.y = y
    asset.looped = False
    asset.active = True

    Explosion.pool.append(asset)
    Global.entities.append(asset)

  def update(self):
    super().update()
    if self.looped: self.active = False # remove when the animation completes
