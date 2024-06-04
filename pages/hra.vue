<template>
  <v-app>
    <v-main class="bg">
      <v-row class="mb-32">
        <v-col cols="12" md="6">
          <v-row class="mt-4 ml-4">
            <v-col cols="12" class="d-flex justify-left">
              <div class="item-selector">
                <div v-for="item in itemTypes" :key="item.value" :class="['item-box', { active: selectedItemType === item.value }]" @click="selectedItemType = item.value">
                  <v-icon>{{ item.icon }}</v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
          <player-manager :items="allItems" :players="players" @players-updated="updatePlayers" />
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
import { ref, computed, onMounted } from 'vue'
import PlayerManager from '../components/dnd/PlayerManager.vue'
import BattleSimulator from '../components/dnd/BattleSimulator.vue'
import Notification from '../components/reusable/Notification.vue'
import { weapons as weaponItems, armors as armorItems, healingItems as healingItemArray, otherItems as otherItemArray, foodItems as foodItemsArray } from '../items'

const weapons = ref(weaponItems)
const armors = ref(armorItems)
const healingItems = ref(healingItemArray)
const otherItems = ref(otherItemArray)
const foodItems = ref(foodItemsArray)

const selectedItemType = ref('all')

const itemTypes = [
  { value: 'all', icon: 'mdi-hops', color: 'grey' },
  { value: 'weapons', icon: 'mdi-sword-cross', color: 'red' },
  { value: 'armors', icon: 'mdi-shield', color: 'blue' },
  { value: 'healingItems', icon: 'mdi-heart-plus', color: 'green' },
  { value: 'otherItems', icon: 'mdi-shovel', color: 'purple' },
  { value: 'foodItems', icon: 'mdi-food-apple', color: 'orange' }
]

const players = ref([
  {
    name: 'Kaelin',
    hp: 47,
    maxHP: 100,
    gold: 100,
    weapon: {},
    armor: {},
    inventory: []
  },
  {
    name: 'Aerithil',
    hp: 60,
    maxHP: 75,
    gold: 150,
    weapon: {},
    armor: {},
    inventory: []
  },
  {
    name: 'Maelis',
    hp: 120,
    maxHP: 120,
    gold: 250,
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
    inventory: [{ id: 'O3', name: 'Ancient Relic', stats: 0, type: 'other', value: 100 }]
  }
])

const enemyTypes = ref([
  // Level 1
  { name: 'Goblin', level: 1, maxHP: 50, weapon: {}, armor: {} },
  { name: 'Farmář', level: 1, maxHP: 20, weapon: {}, armor: {} },
  { name: 'Bandita', level: 1, maxHP: 60, weapon: {}, armor: {} },
  { name: 'Vlk', level: 1, maxHP: 40, weapon: {}, armor: {} },
  { name: 'Kostlivec', level: 1, maxHP: 50, weapon: {}, armor: {} },
  { name: 'Ghoul', level: 1, maxHP: 60, weapon: {}, armor: {} },

  // Level 2
  { name: 'Ork', level: 2, maxHP: 100, weapon: {}, armor: {} },
  { name: 'Temný elf skaut', level: 2, maxHP: 80, weapon: {}, armor: {} },
  { name: 'Zombie', level: 2, maxHP: 100, weapon: {}, armor: {} },
  { name: 'Obří pavouk', level: 2, maxHP: 80, weapon: {}, armor: {} },
  { name: 'Harpyje', level: 2, maxHP: 90, weapon: {}, armor: {} },
  { name: 'Kultista', level: 2, maxHP: 70, weapon: {}, armor: {} },
  { name: 'Děsivý vlk', level: 2, maxHP: 100, weapon: {}, armor: {} },

  // Level 3
  { name: 'Ogr', level: 3, maxHP: 150, weapon: {}, armor: {} },
  { name: 'Temný elf bojovník', level: 3, maxHP: 120, weapon: {}, armor: {} },
  { name: 'Nekromant', level: 3, maxHP: 120, weapon: {}, armor: {} },
  { name: 'Draugr', level: 3, maxHP: 140, weapon: {}, armor: {} },
  { name: 'Přízrak', level: 3, maxHP: 120, weapon: {}, armor: {} },
  { name: 'Troll', level: 3, maxHP: 180, weapon: {}, armor: {} },
  { name: 'Banshee', level: 3, maxHP: 130, weapon: {}, armor: {} },
  { name: 'Minotaurus', level: 3, maxHP: 160, weapon: {}, armor: {} },
  { name: 'Temný elf vrah', level: 3, maxHP: 130, weapon: {}, armor: {} },
  { name: 'Naga', level: 3, maxHP: 140, weapon: {}, armor: {} },

  // Level 4
  { name: 'Upír', level: 4, maxHP: 200, weapon: {}, armor: {} },
  { name: 'Temný elf mág', level: 4, maxHP: 150, weapon: {}, armor: {} },
  { name: 'Ohňový elementál', level: 4, maxHP: 180, weapon: {}, armor: {} },
  { name: 'Ledový elementál', level: 4, maxHP: 180, weapon: {}, armor: {} },
  { name: 'Lich', level: 4, maxHP: 220, weapon: {}, armor: {} },
  { name: 'Kamenný golem', level: 4, maxHP: 250, weapon: {}, armor: {} },
  { name: 'Písečný červ', level: 4, maxHP: 200, weapon: {}, armor: {} },
  { name: 'Temný rytíř', level: 4, maxHP: 220, weapon: {}, armor: {} },
  { name: 'Dračí mládě', level: 4, maxHP: 180, weapon: {}, armor: {} }
])

const battleLog = ref([])

const allItems = computed(() => {
  switch (selectedItemType.value) {
    case 'weapons':
      return weapons.value
    case 'armors':
      return armors.value
    case 'healingItems':
      return healingItems.value
    case 'otherItems':
      return otherItems.value
    case 'foodItems':
      return foodItems.value
    default:
      return [...weapons.value, ...armors.value, ...healingItems.value, ...otherItems.value, ...foodItems.value]
  }
})

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
  const currentTime = new Date().toLocaleTimeString()
  const player = players.value.find(p => p.name === attacker.name)
  if (player) {
    const goldGained = Math.floor(Math.random() * 50) + 10
    player.gold += goldGained
    battleLog.value.unshift(`<span class="text-gray-500">[${currentTime}]</span>  <span class="text-yellow-500">${attacker.name} gained ${goldGained} gold!</span>`)
    addNotification({
      title: 'Gold Gained',
      message: `${attacker.name} gained ${goldGained} gold!`,
      color: 'yellow'
    })
    // Add defender's weapon to attacker's inventory
    if (defender.weapon && defender.weapon.name) {
      const weaponItem = player.inventory.find(invItem => invItem.id === defender.weapon.id)
      if (weaponItem) {
        weaponItem.quantity = (weaponItem.quantity || 1) + 1
      } else {
        player.inventory.push({ ...defender.weapon, quantity: 1 })
      }
    }

    // Add defender's armor to attacker's inventory
    if (defender.armor && defender.armor.name) {
      const armorItem = player.inventory.find(invItem => invItem.id === defender.armor.id)
      if (armorItem) {
        armorItem.quantity = (armorItem.quantity || 1) + 1
      } else {
        player.inventory.push({ ...defender.armor, quantity: 1 })
      }
    }

    // Add defender's inventory items to attacker's inventory
    if (defender.inventory) {
      defender.inventory.forEach(item => {
        const existingItem = player.inventory.find(invItem => invItem.id === item.id)
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

.item-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.item-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.item-box:hover {
  border-color: #ffffff;
}

.item-box.active {
  background-color: var(--v-theme-background);
  border-color: var(--v-theme-primary);
}

.item-box.active .v-icon {
  color: var(--v-theme-primary);
}
</style>
