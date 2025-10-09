import { ref } from 'vue'
import { createRect, doesRectsCollide } from '../utils/geometry.js'
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

    switch (collectible.type) {
      case 'coin':
        inventory.value.coins += 1;
        break;
      case 'gem':
        inventory.value.gems += 1;
        break;
      case 'sword':
        inventory.value.sword += 1;
        break;
      case 'shield':
        inventory.value.shield += 1;
        break;
    }
  }

  placeCollectibles(playerRectSize, containerRectSize, obstacleList, playerPosition) {
    const containerWidth = containerRectSize.width;
    const containerHeight = containerRectSize.height;

    // отдельная функция?
    const occupiedRects = obstacleList.value.map(obstacle =>
      createRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height));

    occupiedRects.push(
      createRect(playerPosition.value.x, playerPosition.value.y, playerRectSize.width, playerRectSize.height)
    );
    //

    console.log('occupiedRects', occupiedRects);
    for (let i = 0; i < MAX_COLLECTIBLE_COUNT; i++) {
      const x = Math.round(Math.random() * (containerWidth - COLLECTIBLE_SIZE));
      const y = Math.round(Math.random() * (containerHeight - COLLECTIBLE_SIZE));

      const collectibleRect = createRect(x, y, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE);

      if (!canPlaceCollectible(occupiedRects, collectibleRect)) {
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

function canPlaceCollectible(occupiedRects, collectibleRect) {
  for (const obstacle of occupiedRects) {

    if (doesRectsCollide(collectibleRect, obstacle)) {
      return false;
    }
  }

  return true;
}
