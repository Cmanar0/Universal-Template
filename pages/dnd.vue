<template>
  <v-app>
    <div class="p-4">
      <player-manager
        :weapons="weapons"
        :armors="armors"
        :players="players"
        @players-updated="updatePlayers"
      />
      <battle-simulator
        :players="players"
        :weapons="weapons"
        :armors="armors"
      />
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import PlayerManager from '../components/dnd/PlayerManager.vue'
import BattleSimulator from '../components/dnd/BattleSimulator.vue'

const weapons = ref([
  { id: 1, name: 'Prak', attack: 6 },
  { id: 2, name: 'Stříbrná dýka', attack: 8 }
  // Add other weapons here...
])

const armors = ref([
  { id: 1, name: 'Mystické roucho', defense: 5 },
  { id: 2, name: 'Ledové roucho', defense: 6 }
  // Add other armors here...
])

const players = ref([
  {
    name: 'Player 1',
    hp: 20,
    weapon: { id: 1, name: 'Prak', attack: 6 },
    armor: { id: 1, name: 'Mystické roucho', defense: 5 }
  },
  {
    name: 'Player 2',
    hp: 25,
    weapon: { id: 2, name: 'Stříbrná dýka', attack: 8 },
    armor: { id: 2, name: 'Ledové roucho', defense: 6 }
  }
])

const updatePlayers = newPlayers => {
  players.value = newPlayers
}
</script>

<style>
@import 'tailwindcss/tailwind.css';
</style>
