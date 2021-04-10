import pygame, Global

class Entity:

  def __init__(self, anim=None, x=0, y=0, heading=0):
    self.anim = anim
    self.frame = 0  # index of the current frame of animation
    self.x = x
    self.y = y
    self.dx = 0
    self.dy = 0
    self.heading = heading  # in degrees
    self.looped = False  # true if animation has looped at least once
    self.active = True  # when false, will be deleted by Game::update()

  def update(self):
    self.x += self.dx  # update the position
    self.y += self.dy
    self.frame += self.anim.rate  # advance the frame (may not move it fully to the next frame)
    if self.frame >= len(self.anim.frames):
      self.frame = 0  # loop the animation back to the first frame
      self.looped = True

  def draw(self):
    # todo: fix rotating around an off-center point
    image = pygame.transform.rotate(self.anim.frames[int(self.frame)], self.heading - 90)
    rect = image.get_rect(center=(self.x, self.y))  # set the position of the image's center
    return (image, rect)

  def check_collisions(self):
    pass # override in derived classes

  def collides_with(self, other):
    return False # override in derived classes

  def wrap(self):
    if self.x < 0:
      self.x = Global.WIDTH
    elif self.x > Global.WIDTH:
      self.x = 0

    if self.y < 0:
      self.y = Global.HEIGHT
    elif self.y > Global.HEIGHT:
      self.y = 0

  def intersects(self, other):
    x = self.x - other.x  # x separation
    y = self.y - other.y  # y separation
    r = self.anim.r + other.anim.r  # sum of the two objects' radii
    return x * x + y * y < r * r  # it's faster if we don't bother taking the square root of both sides
