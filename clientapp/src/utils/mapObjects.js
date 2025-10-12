import { doesRectsCollide } from '../utils/geometry.js'


export function canPlaceObject(occupiedRects, objectRect) {
  for (const obstacle of occupiedRects) {

    if (doesRectsCollide(objectRect, obstacle)) {
      return false;
    }
  }

  return true;
}
