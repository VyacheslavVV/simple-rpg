export function createRect(x, y, width, height) {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

export function doesRectsCollide(rect1, rect2) {
  return rect1.right > rect2.left &&
         rect1.left < rect2.right &&
         rect1.bottom > rect2.top &&
         rect1.top < rect2.bottom;
}
