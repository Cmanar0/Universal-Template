<template>
  <div v-if="show" class="dice-roll-overlay">
    <div class="dice-roll-container">
      <div class="dice">
        <div v-for="n in 9" :key="n" :class="getDotClass(n)" class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  onAnimationEnd: Function
})

const diceValue = ref(1)
const randomNumbers = ref([])

const timings = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 850]

watch(
  () => props.show,
  newVal => {
    if (newVal) {
      rollDice()
    }
  }
)

const rollDice = async () => {
  randomNumbers.value = Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * 6) + 1
  )
  console.log('Random Numbers:', randomNumbers.value)

  for (let i = 0; i < randomNumbers.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, timings[i]))
    diceValue.value = randomNumbers.value[i]
    console.log('Current Dice Value:', diceValue.value)
  }

  setTimeout(() => {
    if (typeof props.onAnimationEnd === 'function') {
      props.onAnimationEnd(diceValue.value)
    }
  }, 1000)
}

const getDotClass = dotNumber => {
  const positions = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  }

  return positions[diceValue.value]?.includes(dotNumber) ? 'dot visible' : 'dot'
}
</script>

<style scoped>
.dice-roll-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dice-roll-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dice {
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dot {
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
}

.dot.visible {
  opacity: 1;
}
</style>
