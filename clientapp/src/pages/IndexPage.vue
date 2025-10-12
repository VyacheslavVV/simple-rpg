<template>
  <div class="hello">
    <div class="inventory-container">
      <div class="inventory-item">💰: {{inventory.coin}} </div>
      <div class="inventory-item">💎: {{inventory.gem}} </div>
      <div class="inventory-item">🗡️: {{inventory.sword}} </div>
      <div class="inventory-item">🛡️: {{inventory.shield}} </div>
    </div>

    <div
      class="field-container"
      ref="container"
      :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }"
    >
      <!-- <template v-for="row in 10" :key="row">
        <div v-for="col in 10" :key="col" class="field-tile">{{row}}x{{col}}</div>
      </template> -->
      <div
       class="player" ref="player"
       :style="{
          left: playerPosition.x + 'px',
          top: playerPosition.y + 'px',
          width: playerWidth + 'px',
          height: playerHeight + 'px',
       }"
      >🐻</div>

      <div
        v-for="(obstacle, index) in obstacleList"
        :key="index"
        class="obstacle"
        :style="{
          left: obstacle.left + 'px',
          top: obstacle.top + 'px',
          width: (obstacle.right - obstacle.left) + 'px',
          height: (obstacle.bottom - obstacle.top) + 'px'
        }"
      ></div>

      <div
        v-for="(item, index) in collectibles.list"
        :key="index"
        class="collectible"
        :style="{
          left: item.rect.left + 'px',
          top: item.rect.top + 'px',
          width: (item.rect.right - item.rect.left) + 'px',
          height: (item.rect.bottom - item.rect.top) + 'px'
        }"
      >{{item.icon}}</div>

      <div
        v-for="(item, index) in challenges.list"
        :key="index"
        class="challenge"
        :style="{
          left: item.rect.left + 'px',
          top: item.rect.top + 'px',
          width: (item.rect.right - item.rect.left) + 'px',
          height: (item.rect.bottom - item.rect.top) + 'px'
        }"
      >{{item.icon}}</div>
    </div>

  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { createRect, doesRectsCollide } from '../utils/geometry.js';
  import Collectibles from '../collectibles/Collectibles.js';
  import Challenges from '../challenges/Challenges.js';
  
  const containerWidth = 500;
  const containerHeight = 500;
  const playerWidth = 50;
  const playerHeight = 50;

  const container = ref(null);
  const player = ref(null);
  const playerPosition = ref({ x: 0, y: 0 });
  const speed = 5;
  const keysPressed = ref({});
  const containerRectSize = {
    width: containerWidth,
    height: containerHeight,
  };
  const playerRectSize = {
    width: playerWidth,
    height: playerHeight,
  };

  const obstacleList = ref([
    createRect(100, 100, 50, 50),
    createRect(200, 200, 50, 50),
    createRect(300, 300, 50, 50),
  ]);

  console.log('obstacleList', obstacleList.value);

  const inventory = ref({
    coin: 0,
    gem: 0,
    sword: 0,
    shield: 0
  });

  const collectibles = new Collectibles();
  const challenges = new Challenges();

  // Обработчики нажатия клавиш
  function handleKeyDown(e) {
    keysPressed.value[e.key] = true;
  }

  function handleKeyUp(e) {
    keysPressed.value[e.key] = false;
  }

  function checkObstacleCollision(newX, newY) {
    // Границы контейнера
    if (newX < 0 || 
        newY < 0 || 
        newX > containerRectSize.width - playerRectSize.width || 
        newY > containerRectSize.height - playerRectSize.height) {
      return true;
    }

    // Проверка с каждым препятствием
    const playerRect = {
      left: newX,
      top: newY,
      right: newX + playerRectSize.width,
      bottom: newY + playerRectSize.height
    };

    for (const obstacle of obstacleList.value) {
      if (doesRectsCollide(playerRect, obstacle)) {
        return true;
      }
    }

    return false;
  }

  // Анимация движения
  function moveElement() {
    let newX = playerPosition.value.x;
    let newY = playerPosition.value.y;
    //console.log('newX', newX);

    collectibles.checkCollectibleCollision(newX, newY, playerRectSize, inventory);

    if (keysPressed.value.ArrowUp) {
      newY -= speed;
    }
    if (keysPressed.value.ArrowDown) {
      newY += speed;
    }
    if (keysPressed.value.ArrowLeft) {
      newX -= speed;
    }
    if (keysPressed.value.ArrowRight) {
      newX += speed;
    }

     if (!checkObstacleCollision(newX, newY)) {
      playerPosition.value = { x: newX, y: newY };
    } else if (!checkObstacleCollision(newX, playerPosition.value.y)) {
      // Попробуем двигаться только по X
      playerPosition.value.x = newX;
    } else if (!checkObstacleCollision(playerPosition.value.x, newY)) {
      // Попробуем двигаться только по Y
      playerPosition.value.y = newY;
    }

    requestAnimationFrame(moveElement);
  }


// Устанавливаем и удаляем обработчики
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let occupiedRectList = [
      ...obstacleList.value,
      createRect(playerPosition.value.x, playerPosition.value.y, playerRectSize.width, playerRectSize.height),
    ];

    collectibles.generateCollectibles(containerRectSize, occupiedRectList);

    occupiedRectList = occupiedRectList.concat(collectibles.list);

    challenges.generateChallenges(containerRectSize, occupiedRectList);

    moveElement();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
</script>

<script>
//import ApiService from '../components/ApiService.js'

export default {
  name: 'IndexPage',
  data() {
    return {
      message: 'Hello World!'
    }
  },
  created() {

    /*ApiService.get('/api/hello')
      .then(response => {
        this.message = response.data.message
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })*/
  }
}

</script>
