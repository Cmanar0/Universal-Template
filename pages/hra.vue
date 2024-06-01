<template>
  <v-app>
    <v-main>
      <v-row class="mb-32">
        <!-- Added margin-bottom to avoid overlapping -->
        <v-col cols="12" md="6">
          <player-manager
            :weapons="weapons"
            :armors="armors"
            :players="players"
            @players-updated="updatePlayers"
          />
        </v-col>
        <v-col cols="12" md="6">
          <battle-simulator
            :players="players"
            :enemies="enemies"
            :weapons="weapons"
            :armors="armors"
          />
        </v-col>
      </v-row>
      <!-- <battle-log :logs="battleLog" /> -->
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import PlayerManager from '../components/dnd/PlayerManager.vue'
import BattleSimulator from '../components/dnd/BattleSimulator.vue'
import BattleLog from '../components/dnd/BattleLog.vue'

const weapons = ref([
  { id: 1, name: 'Prak', stats: 6, type: 'weapon' },
  { id: 2, name: 'Stříbrná dýka', stats: 8, type: 'weapon' }
  // Add other weapons here...
])

const armors = ref([
  { id: 1, name: 'Mystické roucho', stats: 5, type: 'armor' },
  { id: 2, name: 'Ledové roucho', stats: 6, type: 'armor' }
  // Add other armors here...
])

const players = ref([
  {
    name: 'Player 1',
    hp: 47,
    maxHP: 100,
    gold: 100,
    weapon: { id: 1, name: 'Prak', stats: 6, type: 'weapon' },
    armor: { id: 1, name: 'Mystické roucho', stats: 5, type: 'armor' },
    inventory: []
  },
  {
    name: 'Player 2',
    hp: 60,
    maxHP: 75,
    gold: 150,
    weapon: { id: 2, name: 'Stříbrná dýka', stats: 8, type: 'weapon' },
    armor: { id: 2, name: 'Ledové roucho', stats: 6, type: 'armor' },
    inventory: []
  }
])

const enemies = ref([
  {
    name: 'Goblin',
    hp: 15,
    maxHP: 15,
    gold: 0,
    weapon: { id: 3, name: 'Club', stats: 5, type: 'weapon' },
    armor: { id: 3, name: 'Leather Armor', stats: 3, type: 'armor' },
    inventory: []
  },
  {
    name: 'Orc',
    hp: 30,
    maxHP: 30,
    gold: 0,
    weapon: { id: 4, name: 'Axe', stats: 10, type: 'weapon' },
    armor: { id: 4, name: 'Chainmail', stats: 7, type: 'armor' },
    inventory: []
  }
])

const battleLog = ref([])

const updatePlayers = newPlayers => {
  players.value = newPlayers
}
</script>

<style>
@import 'tailwindcss/tailwind.css';

.mb-32 {
  margin-bottom: 8rem;
}
</style>
