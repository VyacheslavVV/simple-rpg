import { ref } from 'vue'
import { createRect, doesRectsCollide } from '../utils/geometry.js'
import { canPlaceObject } from '../utils/mapObjects.js'

// TODO: move to constants.js
const MAX_CHALLENGES_COUNT = 5;
const CHALLENGE_SIZE = 60;
const CHALLENGE_TYPES = [
    { icon: '☣️', type: 'pollution', solved_icon: '🌱' },
    { icon: '😡', type: 'anger',     solved_icon: '😌' },
];

export default class Challenges {
  constructor() {
    this.challengesList = ref([]);
  }

  get list() {
    return this.challengesList.value;
  }

  generateChallenges(containerRectSize, occupiedRectList) {
    const containerWidth = containerRectSize.width;
    const containerHeight = containerRectSize.height;

    // отдельная функция?
    const occupiedRects = [ ...occupiedRectList ];
    //

    for (let i = 0; i < MAX_CHALLENGES_COUNT; i++) {
      const x = Math.round(Math.random() * (containerWidth - CHALLENGE_SIZE));
      const y = Math.round(Math.random() * (containerHeight - CHALLENGE_SIZE));

      const collectibleRect = createRect(x, y, CHALLENGE_SIZE, CHALLENGE_SIZE);

      if (!canPlaceObject(occupiedRects, collectibleRect)) {
        continue; // Пропускаем, если место занято
      }

      console.log('place challenge', collectibleRect);
      var randomCollectible = getRandomChallenge();

      this.challengesList.value.push({
        rect: { ...collectibleRect },
        icon: randomCollectible.icon,
        type: randomCollectible.type,
      });

      occupiedRects.push(collectibleRect);
    }
  }
}

function getRandomChallenge() {
  return CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];
}
