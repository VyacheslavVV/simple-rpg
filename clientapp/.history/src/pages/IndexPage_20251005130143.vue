<template>
  <div class="hello">
    <div class="inventory-container">
      <div class="inventory-item">💰: {{inventory.coins}} </div>
      <div class="inventory-item">💎: 0</div>
      <div class="inventory-item">🗡️: 0</div>
      <div class="inventory-item">🛡️: 0</div>
    </div>

    <div class="field-container" ref="container">
      <!-- <template v-for="row in 10" :key="row">
        <div v-for="col in 10" :key="col" class="field-tile">{{row}}x{{col}}</div>
      </template> -->
      <div
       class="player" ref="player"
       :style="{ left: position.x + 'px', top: position.y + 'px' }"
      >🐻</div>

      <div
        v-for="(obstacle, index) in obstacleList"
        :key="index"
        class="obstacle"
        :style="{
          left: obstacle.x + 'px',
          top: obstacle.y + 'px',
          width: obstacle.width + 'px',
          height: obstacle.height + 'px'
        }"
      ></div>

      <div
        v-for="(item, index) in collectibleList"
        :key="index"
        class="collectible"
        :style="{
          left: item.x + 'px',
          top: item.y + 'px',
          width: item.width + 'px',
          height: item.height + 'px'
        }"
      >{{item.icon}}</div>
    </div>

  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  const container = ref(null);
  const player = ref(null);
  const position = ref({ x: 0, y: 0 });
  const speed = 5;
  const keysPressed = ref({});
  let containerRectSize = { width: 0, height: 0 };
  let playerRectSize = { width: 0, height: 0 };

  const obstacleList = ref([
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
    { x: 300, y: 300, width: 50, height: 50 }
  ]);

  const collectibleList = ref([]);
  const inventory = ref({
    coins: 0,
    gems: 0,
    sword: 0,
    shield: 0
  });

  function updateObjectSizes() {
    if (container.value) {
      containerRectSize = {
        width: container.value.offsetWidth,
        height: container.value.offsetHeight
      };
    }
  
    if (player.value) {
      playerRectSize = {
        width: player.value.offsetWidth,
        height: player.value.offsetHeight
      };
    }
  }

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
      const obstacleRect = {
        left: obstacle.x,
        top: obstacle.y,
        right: obstacle.x + obstacle.width,
        bottom: obstacle.y + obstacle.height
      };

      if (playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top &&
          playerRect.top < obstacleRect.bottom) {
        return true;
      }
    }

    return false;
  }

  function checkCollectibleCollision(newX, newY) {

    const playerRect = {
      left: newX,
      top: newY,
      right: newX + playerRectSize.width,
      bottom: newY + playerRectSize.height
    };

    let collectibleIndex = null;

    for (const [index, item] of collectibleList.value.entries()) {
      const collectibleRect = {
        left: item.x,
        top: item.y,
        right: item.x + item.width,
        bottom: item.y + item.height
      };

      if (playerRect.right > collectibleRect.left &&
          playerRect.left < collectibleRect.right &&
          playerRect.bottom > collectibleRect.top &&
          playerRect.top < collectibleRect.bottom) {
        collectibleIndex = index;
        break;
      }
    }

    if (collectibleIndex !== null) {
      pickCollectible(collectibleIndex)
    }
  }

  function pickCollectible(collectibleIndex) {
    const collectible = collectibleList.value[collectibleIndex];

    collectibleList.value = collectibleList.value.filter((_, index) => index !== collectibleIndex);

    // Здесь можно добавить логику для увеличения счета или других действий при сборе предмета
    console.log(`Collectible at index ${collectibleIndex} picked!`);
  }

  // Анимация движения
  function moveElement() {
    let newX = position.value.x;
    let newY = position.value.y;
    //console.log('newX', newX);

    checkCollectibleCollision(newX, newY);

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
      position.value = { x: newX, y: newY };
    } else if (!checkObstacleCollision(newX, position.value.y)) {
      // Попробуем двигаться только по X
      position.value.x = newX;
    } else if (!checkObstacleCollision(position.value.x, newY)) {
      // Попробуем двигаться только по Y
      position.value.y = newY;
    }

    requestAnimationFrame(moveElement);
  }

  function placeCollectibles() {
    const containerWidth = containerRectSize.width;
    const containerHeight = containerRectSize.height;

    // отдельная функция?
    const occupiedRects = obstacleList.value.map(obstacle => ({
      left: obstacle.x,
      top: obstacle.y,
      right: obstacle.x + obstacle.width,
      bottom: obstacle.y + obstacle.height
    }));

    occupiedRects.push(
      {
        left: position.value.x,
        top: position.value.y,
        right: position.value.x + playerRectSize.width,
        bottom: position.value.y + playerRectSize.height
      }
    );
    //

    console.log('occupiedRects', occupiedRects);
    for (let i = 0; i < 5; i++) {
      const x = Math.round(Math.random() * (containerWidth - 24));
      const y = Math.round(Math.random() * (containerHeight - 24));

      const collectibleRect = {
        left: x,
        top: y,
        right: x + 24,
        bottom: y + 24
      };

      if (!canPlaceCollectible(occupiedRects, collectibleRect)) {
        continue; // Пропускаем, если место занято
      }

      console.log('place collectible', collectibleRect);
      var random
      collectibleList.value.push({
        x: x,
        y: y,
        width: 24,
        height: 24,
        icon: '💰'
      });

      occupiedRects.push({
          left: x,
          top: y,
          right: x + 24,
          bottom: y + 24
      });
    }
  }

  function getRandomCollectible() {
    const collectibles = [
      { icon: '💰', type: 'coin' },
      { icon: '💎', type: 'gem' },
      { icon: '🗡️', type: 'sword' },
      { icon: '🛡️', type: 'shield' }
    ];

    return collectibles[Math.floor(Math.random() * collectibles.length)];
  }

  function canPlaceCollectible(occupiedRects, collectibleRect) {
    for (const obstacle of occupiedRects) {

      if (collectibleRect.right > obstacle.left &&
          collectibleRect.left < obstacle.right &&
          collectibleRect.bottom > obstacle.top &&
          collectibleRect.top < obstacle.bottom) {
        return false;
      }
    }

    return true;
  }

// Устанавливаем и удаляем обработчики
  onMounted(() => {
    updateObjectSizes();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', updateObjectSizes);

    placeCollectibles();

    moveElement();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', updateObjectSizes);
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
