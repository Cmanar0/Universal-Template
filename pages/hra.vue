<template>
  <v-app>
    <v-main class="bg">
      <v-row class="mb-32">
        <v-col cols="12" md="6">
          <player-manager
            :items="allItems"
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
            @participant-defeated="handleParticipantDefeated"
          />
        </v-col>
      </v-row>
    </v-main>
    <Notification class="z-index-1100" />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import PlayerManager from '../components/dnd/PlayerManager.vue'
import BattleSimulator from '../components/dnd/BattleSimulator.vue'
import Notification from '../components/reusable/Notification.vue'

const weapons = ref([
  { id: 'W1', name: 'Prak', stats: 6, type: 'weapon', level: 1 },
  { id: 'W2', name: 'Stříbrná dýka', stats: 8, type: 'weapon', level: 1 },
  { id: 'W3', name: 'Zlatá dýka', stats: 10, type: 'weapon', level: 2 },
  { id: 'W4', name: 'Long Sword', stats: 12, type: 'weapon', level: 3 },
  { id: 'W5', name: 'Battle Axe', stats: 15, type: 'weapon', level: 3 }
])

const armors = ref([
  { id: 'A1', name: 'Mystické roucho', stats: 5, type: 'armor', level: 1 },
  { id: 'A2', name: 'Ledové roucho', stats: 6, type: 'armor', level: 1 },
  { id: 'A3', name: 'Kovové roucho', stats: 8, type: 'armor', level: 2 },
  { id: 'A4', name: 'Chainmail', stats: 10, type: 'armor', level: 3 },
  { id: 'A5', name: 'Plate Armor', stats: 12, type: 'armor', level: 3 }
])

const healingItems = ref([
  { id: 'H1', name: 'Minor Healing Potion', stats: 10, type: 'healing' },
  { id: 'H2', name: 'Major Healing Potion', stats: 20, type: 'healing' },
  { id: 'H3', name: 'Elixir of Life', stats: 50, type: 'healing' }
])

const otherItems = ref([
  { id: 'O1', name: 'Gold Coin', stats: 1, type: 'other', value: 10 },
  { id: 'O2', name: 'Silver Coin', stats: 1, type: 'other', value: 5 },
  { id: 'O3', name: 'Ancient Relic', stats: 0, type: 'other', value: 100 }
])

const players = ref([
  {
    name: 'Player 1',
    hp: 47,
    maxHP: 100,
    gold: 100,
    weapon: {},
    armor: {},
    inventory: []
  },
  {
    name: 'Player 2',
    hp: 60,
    maxHP: 75,
    gold: 150,
    weapon: {},
    armor: {},
    inventory: []
  }
])

const enemies = ref([
  {
    name: 'Wizard',
    hp: 150,
    maxHP: 150,
    gold: 0,
    weapon: { id: 'W6', name: 'Magical Staff', stats: 30, type: 'weapon' },
    armor: { id: 'A6', name: 'Wizard cloak Armor', stats: 25, type: 'armor' },
    inventory: [
      { id: 'O3', name: 'Ancient Relic', stats: 0, type: 'other', value: 100 }
    ]
  }
])

const enemyTypes = ref([
  {
    name: 'Goblin',
    level: 1,
    maxHP: 5,
    weapon: {},
    armor: {}
  },
  {
    name: 'Orc',
    level: 2,
    maxHP: 10,
    weapon: {},
    armor: {}
  }
])

const battleLog = ref([])

const allItems = computed(() => [
  ...weapons.value,
  ...armors.value,
  ...healingItems.value,
  ...otherItems.value
])

const updatePlayers = newPlayers => {
  players.value = newPlayers
  savePlayersToLocalStorage()
}

const updateBattleLog = newLogs => {
  battleLog.value = newLogs
}

const savePlayersToLocalStorage = () => {
  localStorage.setItem('players', JSON.stringify(players.value))
}

const handleParticipantDefeated = ({ attacker, defender }) => {
  const player = players.value.find(p => p.name === attacker.name)
  if (player) {
    // Add defender's weapon to attacker's inventory
    if (defender.weapon && defender.weapon.name) {
      const weaponItem = player.inventory.find(
        invItem => invItem.id === defender.weapon.id
      )
      if (weaponItem) {
        weaponItem.quantity = (weaponItem.quantity || 1) + 1
      } else {
        player.inventory.push({ ...defender.weapon, quantity: 1 })
      }
    }

    // Add defender's armor to attacker's inventory
    if (defender.armor && defender.armor.name) {
      const armorItem = player.inventory.find(
        invItem => invItem.id === defender.armor.id
      )
      if (armorItem) {
        armorItem.quantity = (armorItem.quantity || 1) + 1
      } else {
        player.inventory.push({ ...defender.armor, quantity: 1 })
      }
    }

    // Add defender's inventory items to attacker's inventory
    if (defender.inventory) {
      defender.inventory.forEach(item => {
        const existingItem = player.inventory.find(
          invItem => invItem.id === item.id
        )
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1
        } else {
          player.inventory.push({ ...item, quantity: 1 })
        }
      })
    }

    updatePlayers([...players.value]) // Trigger update
  }
}

onMounted(() => {
  const storedPlayers = localStorage.getItem('players')
  if (storedPlayers) {
    players.value = JSON.parse(storedPlayers)
  }
})
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
