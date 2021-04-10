import pygame
 
class Animation:

  def __init__(self, texture, x, y, w, h, count, rate, originOffset = 0):
    self.texture = texture
    self.x = x
    self.y = y
    self.w = w
    self.h = h
    self.r = 0.4 * w
    self.count = count
    self.rate = rate
    self.originOffset = originOffset
    self.frames = [] # an array of images

    for i in range(count):
      # todo: fix rotating around an off-center point -- this quick hack cuts off part of the image
      f = pygame.Surface((w, h + originOffset), pygame.SRCALPHA) # create a new blank frame
      f.blit(texture, (0, 0), (x + i * w, y, w, h)) # copy a frame from the texture
      self.frames.append(f)
