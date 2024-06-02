<template>
  <v-app>
    <v-main class="bg">
      <v-row class="mb-32">
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
            :enemy-types="enemyTypes"
            :weapons="weapons"
            :armors="armors"
            :battle-log="battleLog"
            @update-battle-log="updateBattleLog"
          />
        </v-col>
      </v-row>
    </v-main>
    <Notification class="z-index-1100" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import PlayerManager from '../components/dnd/PlayerManager.vue'
import BattleSimulator from '../components/dnd/BattleSimulator.vue'
import Notification from '../components/reusable/Notification.vue'

const weapons = ref([
  { id: 1, name: 'Prak', stats: 6, type: 'weapon', level: 1 },
  { id: 2, name: 'Stříbrná dýka', stats: 8, type: 'weapon', level: 1 }
])

const armors = ref([
  { id: 1, name: 'Mystické roucho', stats: 5, type: 'armor', level: 1 },
  { id: 2, name: 'Ledové roucho', stats: 6, type: 'armor', level: 1 }
])

const players = ref([
  {
    name: 'Player 1',
    hp: 47,
    maxHP: 100,
    gold: 100,
    weapon: {},
    armor: {},
    inventory: [
      { id: 1, name: 'Prak', stats: 6, type: 'weapon' },
      { id: 1, name: 'Mystické roucho', stats: 5, type: 'armor' }
    ]
  },
  {
    name: 'Player 2',
    hp: 60,
    maxHP: 75,
    gold: 150,
    weapon: {},
    armor: {},
    inventory: [
      { id: 2, name: 'Stříbrná dýka', stats: 8, type: 'weapon' },
      { id: 2, name: 'Ledové roucho', stats: 6, type: 'armor' }
    ]
  }
])

const enemies = ref([
  {
    name: 'Wizard',
    hp: 150,
    maxHP: 150,
    gold: 0,
    weapon: { id: 3, name: 'Magical Staff', stats: 30, type: 'weapon' },
    armor: { id: 3, name: 'Wizard cloak Armor', stats: 25, type: 'armor' },
    inventory: []
  }
])

const enemyTypes = ref([
  {
    name: 'Goblin',
    level: 1,
    maxHP: 10,
    weapon: {},
    armor: {}
  },
  {
    name: 'Orc',
    level: 2,
    maxHP: 30,
    weapon: {},
    armor: {}
  }
])

const battleLog = ref([])

const updatePlayers = newPlayers => {
  players.value = newPlayers
}

const updateBattleLog = newLogs => {
  battleLog.value = newLogs
}
</script>

<style>
@import 'tailwindcss/tailwind.css';

.mb-32 {
  margin-bottom: 8rem;
}
.bg {
  background-color: #4f2c1228;
}
</style>
