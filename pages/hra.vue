<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})
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

const enemies = ref([
  {
    name: 'Goblin',
    hp: 15,
    weapon: { id: 3, name: 'Club', attack: 5 },
    armor: { id: 3, name: 'Leather Armor', defense: 3 }
  },
  {
    name: 'Orc',
    hp: 30,
    weapon: { id: 4, name: 'Axe', attack: 10 },
    armor: { id: 4, name: 'Chainmail', defense: 7 }
  }
])

const updatePlayers = newPlayers => {
  players.value = newPlayers
}
</script>

<style>
@import 'tailwindcss/tailwind.css';
</style>
