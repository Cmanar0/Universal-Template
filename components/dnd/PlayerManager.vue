<template>
  <v-card-title>Player Manager</v-card-title>
  <v-card-text>
    <div
      v-for="(player, index) in players"
      :key="index"
      class="mb-4 p-4 border rounded flex flex-col md:flex-row"
    >
      <v-col cols="12" md="4">
        <div v-if="editIndex === index">
          <v-text-field v-model="player.name" label="Player Name" />
          <v-text-field v-model.number="player.hp" label="HP" type="number" />
          <v-text-field
            v-model.number="player.maxHP"
            label="Max HP"
            type="number"
          />
          <v-text-field
            v-model.number="player.gold"
            label="Gold"
            type="number"
          />
          <v-btn color="success" @click="savePlayer(index)">Save</v-btn>
          <v-btn color="error" @click="removePlayer(index)">Remove</v-btn>
        </div>
        <div v-else>
          <h2 class="text-2xl font-bold mb-2">{{ player.name }}</h2>
          <p class="flex items-center">
            <strong>HP:</strong>
            <span class="ml-2">{{ player.hp }} / {{ player.maxHP }}</span>
          </p>
          <div
            class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-2"
          >
            <div
              class="absolute top-0 left-0 h-full bg-green-500"
              :style="{ width: (player.hp / player.maxHP) * 100 + '%' }"
            ></div>
          </div>
          <p>
            <strong>Gold:</strong>
            <span class="ml-2 text-yellow-500">{{ player.gold }}</span>
          </p>
          <p>
            <strong>Weapon:</strong> {{ player.weapon.name }} (Stats:
            {{ player.weapon.stats }})
          </p>
          <p>
            <strong>Armor:</strong> {{ player.armor.name }} (Stats:
            {{ player.armor.stats }})
          </p>
          <v-btn color="primary" class="mt-4" @click="editIndex = index"
            >Edit</v-btn
          >
        </div>
      </v-col>
      <v-col cols="12" md="8">
        <v-btn color="primary" @click="openModal(index)" block>ADD ITEM</v-btn>
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stats
                </th>
                <th
                  class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, iIndex) in player.inventory"
                :key="iIndex"
                :class="{ 'bg-gray-100': item.selected }"
              >
                <td class="px-6 py-2 whitespace-nowrap">{{ item.name }}</td>
                <td
                  class="px-6 py-2 whitespace-nowrap"
                  v-if="item.type !== 'other'"
                  :class="getItemClass(item.type)"
                >
                  {{ item.type }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap" v-else>-</td>
                <td class="px-6 py-2 whitespace-nowrap">{{ item.stats }}</td>
                <td class="px-6 py-2 whitespace-nowrap">
                  {{ item.quantity }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm font-medium">
                  <button
                    class="inline-flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :class="getItemClass(item.type)"
                    @click="
                      item.type === 'healing'
                        ? useHealingItem(index, iIndex)
                        : selectItem(index, iIndex)
                    "
                  >
                    <span class="sr-only">Use</span>
                    <v-icon
                      :class="{
                        'text-white': item.type === 'healing' || item.selected
                      }"
                      >{{ getItemIcon(item.type) }}</v-icon
                    >
                  </button>
                  <button
                    class="inline-flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="deleteItem(index, iIndex)"
                  >
                    <span class="sr-only">Delete</span>
                    <v-icon class="text-red-500">mdi-close</v-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </div>
    <v-dialog v-model="isModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Add Item</v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.name" label="Item Name" />
          <v-radio-group v-model="newItem.type" label="Type">
            <v-radio label="Healing" value="healing" />
            <v-radio label="Weapon" value="weapon" />
            <v-radio label="Armor" value="armor" />
            <v-radio label="Other" value="other" />
          </v-radio-group>
          <v-text-field
            v-model.number="newItem.stats"
            label="Stats"
            v-if="newItem.type !== 'other'"
            type="number"
          />
          <v-text-field
            v-model.number="newItem.quantity"
            label="Quantity"
            type="number"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addItem">Add</v-btn>
          <v-btn color="error" @click="isModalOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card-text>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weapons: Array,
  armors: Array,
  players: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['players-updated'])

const isModalOpen = ref(false)
const editIndex = ref(null)
const newItem = ref({ name: '', type: 'other', stats: 0, quantity: 1 })
const modalPlayerIndex = ref(null)

const players = ref([...props.players])

const addPlayer = () => {
  players.value.push({
    name: '',
    hp: 0,
    maxHP: 0,
    gold: 0,
    weapon: { id: null, name: '', stats: 0, type: 'weapon' },
    armor: { id: null, name: '', stats: 0, type: 'armor' },
    inventory: []
  })
}

const removePlayer = index => {
  players.value.splice(index, 1)
}

const savePlayer = index => {
  editIndex.value = null
  emit('players-updated', players.value)
}

const openModal = index => {
  console.log(`Opening modal for player at index: ${index}`)
  modalPlayerIndex.value = index
  newItem.value = { name: '', type: 'other', stats: 0, quantity: 1 }
  isModalOpen.value = true
}

const addItem = () => {
  console.log(
    `Adding item: ${JSON.stringify(newItem.value)} to player index: ${
      modalPlayerIndex.value
    }`
  )
  if (modalPlayerIndex.value !== null) {
    if (!players.value[modalPlayerIndex.value].inventory) {
      players.value[modalPlayerIndex.value].inventory = []
    }
    players.value[modalPlayerIndex.value].inventory.push({
      ...newItem.value,
      selected: false
    })
    isModalOpen.value = false
    emit('players-updated', players.value)
    console.log(`Updated players: ${JSON.stringify(players.value)}`)
  }
}

const selectItem = (playerIndex, itemIndex) => {
  const player = players.value[playerIndex]
  const item = player.inventory[itemIndex]

  if (item.selected) {
    item.selected = false
    if (item.type === 'weapon' && player.weapon.id === item.id) {
      player.weapon = { id: null, name: '', stats: 0, type: 'weapon' }
    } else if (item.type === 'armor' && player.armor.id === item.id) {
      player.armor = { id: null, name: '', stats: 0, type: 'armor' }
    }
  } else {
    player.inventory.forEach((invItem, iIndex) => {
      if (invItem.type === item.type) invItem.selected = false
    })
    item.selected = true
    if (item.type === 'weapon') {
      player.weapon = { ...item }
    } else if (item.type === 'armor') {
      player.armor = { ...item }
    }
  }
  emit('players-updated', players.value)
  console.log(
    `Updated players after selecting item: ${JSON.stringify(players.value)}`
  )
}

const useHealingItem = (playerIndex, itemIndex) => {
  const player = players.value[playerIndex]
  const item = player.inventory[itemIndex]

  player.hp = Math.min(player.hp + Number(item.stats), player.maxHP)
  item.quantity -= 1
  if (item.quantity <= 0) {
    player.inventory.splice(itemIndex, 1)
  }
  emit('players-updated', players.value)
  console.log(
    `Updated players after using healing item: ${JSON.stringify(players.value)}`
  )
}

const deleteItem = (playerIndex, itemIndex) => {
  players.value[playerIndex].inventory.splice(itemIndex, 1)
  emit('players-updated', players.value)
}

const getItemIcon = type => {
  switch (type) {
    case 'healing':
      return 'mdi-heart-plus'
    case 'weapon':
      return 'mdi-sword'
    case 'armor':
      return 'mdi-shield'
    default:
      return 'mdi-help-circle'
  }
}

const getItemClass = type => {
  switch (type) {
    case 'healing':
      return 'bg-green-500 text-white'
    case 'weapon':
      return 'bg-blue-500 text-white'
    case 'armor':
      return 'bg-blue-300 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

watch(props.players, newPlayers => {
  players.value = [...newPlayers]
})
</script>

<style scoped>
.border {
  border: 1px solid #ddd;
}
.v-row {
  display: flex;
  flex-wrap: wrap;
  margin: -16px;
}
.v-col {
  padding: 16px;
}
.v-btn {
  margin: 4px 0;
}
.v-simple-table {
  margin-top: 16px;
  font-size: 0.875rem; /* Smaller text for table */
}
.selected {
  background-color: #e0e0e0;
}
.weapon {
  color: blue;
}
.armor {
  color: #1e90ff; /* Lighter blue color */
}
.healing {
  color: green;
}
.inventory-table th,
.inventory-table td {
  padding: 4px 8px;
}
.actions .v-btn {
  padding: 2px;
  margin: 0 2px;
  min-width: 24px;
  height: 24px; /* Smaller height for action buttons */
  border-radius: 50%; /* Make the buttons circular */
}
.v-icon {
  font-size: 12px; /* Smaller icons */
}
</style>
