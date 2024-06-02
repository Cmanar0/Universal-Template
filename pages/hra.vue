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
            :healing-items="healingItems"
            :other-items="otherItems"
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
import {
  weapons as weaponItems,
  armors as armorItems,
  healingItems as healingItemArray,
  otherItems as otherItemArray,
  foodItems as foodItemsArray
} from '../items'

const weapons = ref(weaponItems)
const armors = ref(armorItems)
const healingItems = ref(healingItemArray)
const otherItems = ref(otherItemArray)
const foodItems = ref(foodItemsArray)

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
  ...otherItems.value,
  ...foodItems.value
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
