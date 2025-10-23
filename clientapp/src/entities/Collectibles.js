import { ref } from 'vue'
import { createRect, doesRectsCollide } from '../utils/geometry.js'
import { canPlaceObject } from '../utils/mapObjects.js'
import {
  MAX_COLLECTIBLE_COUNT,
  COLLECTIBLE_SIZE,
  COLLECTIBLE_TYPES
} from './constants.js'

export default class Collectibles {
  constructor() {
    this.collectibleList = ref([]);
  }

  get list() {
    return this.collectibleList.value;
  }

  checkCollectibleCollision(newX, newY, playerRectSize, inventory) {
    const playerRect = createRect(newX, newY, playerRectSize.width, playerRectSize.height);

    let collectibleIndex = null;

    for (const [index, item] of this.collectibleList.value.entries()) {
      if (doesRectsCollide(playerRect, item.rect)) {
        collectibleIndex = index;
        break;
      }
    }

    if (collectibleIndex !== null) {
      this.#pickCollectible(collectibleIndex, inventory)
    }
  }

  #pickCollectible(collectibleIndex, inventory) {
    const collectible = this.collectibleList.value[collectibleIndex];

    this.collectibleList.value = this.collectibleList.value.filter((_, index) => index !== collectibleIndex);

    console.log(`Collectible at index ${collectibleIndex} picked!`);

    inventory.value[collectible.type] += 1;
  }

  generateCollectibles(containerRectSize, occupiedRectList) {
    const containerWidth = containerRectSize.width;
    const containerHeight = containerRectSize.height;

    // отдельная функция?
    const occupiedRects = [ ...occupiedRectList ];
    //

    console.log('occupiedRects', occupiedRects);
    for (let i = 0; i < MAX_COLLECTIBLE_COUNT; i++) {
      const x = Math.round(Math.random() * (containerWidth - COLLECTIBLE_SIZE));
      const y = Math.round(Math.random() * (containerHeight - COLLECTIBLE_SIZE));

      const collectibleRect = createRect(x, y, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE);

      if (!canPlaceObject(occupiedRects, collectibleRect)) {
        continue; // Пропускаем, если место занято
      }

      console.log('place collectible', collectibleRect);
      var randomCollectible = getRandomCollectible();

      this.collectibleList.value.push({
        rect: { ...collectibleRect },
        icon: randomCollectible.icon,
        type: randomCollectible.type,
      });

      occupiedRects.push(collectibleRect);
    }
  }
}

// private

function getRandomCollectible() {
  return COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
}
