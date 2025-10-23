import { createRect } from '../utils/geometry.js';

export class PositionComponent {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getRect() {
    return createRect(this.x, this.y, this.width, this.height);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
