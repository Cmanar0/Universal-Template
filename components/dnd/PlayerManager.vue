<template>
  <div>
    <div v-for="(player, index) in players" :key="index" class="m-4 p-4 border bg-white shadow-md rounded-lg">
      <div v-if="editIndex === index">
        <v-text-field v-model="player.name" label="Player Name" />
        <v-text-field v-model="player.hp" label="HP" type="number" />
        <v-text-field v-model="player.maxHP" label="Max HP" type="number" />
        <v-text-field v-model="player.gold" label="Gold" type="number" />
        <v-btn color="success" @click="savePlayer(index)">Save</v-btn>
        <v-btn disabled color="error ml-2" @click="removePlayer(index)">Remove</v-btn>
      </div>
      <div v-else>
        <div class="flex justify-between mb-4">
          <div>
            <div class="flex items-center mb-4">
              <h1 class="text-2xl font-bold">{{ player.name }}</h1>
              <v-btn class="ml-4" color="primary" @click="editIndex = index">Edit</v-btn>
              <v-btn class="ml-4" color="secondary" @click="openRestModal(index)">Rest</v-btn>
              <v-btn class="ml-4" color="warning" @click="openPayModal(index)">Pay</v-btn>
            </div>
            <p class="flex items-center">
              <strong>HP:</strong>
              <span class="ml-2">{{ player.hp }} / {{ player.maxHP }}</span>
            </p>
            <div class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-2 min-w-80">
              <div class="absolute top-0 left-0 h-full bg-green-500" :style="{ width: (player.hp / player.maxHP) * 100 + '%' }"></div>
            </div>
            <p class="flex items-center">
              <strong>Food Healing:</strong>
              <span class="ml-2">{{ foodHealingRemaining(player) + ' / ' + player.maxHP }}</span>
            </p>
            <div class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-2 min-w-80">
              <div
                class="absolute top-0 left-0 h-full bg-red-500"
                :style="{
                  width: (foodHealingRemaining(player) / player.maxHP) * 100 + '%'
                }"
              ></div>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <div class="flex items-center space-x-2">
              <strong>Gold:</strong>
              <span class="text-yellow-600 bg-yellow-100 p-1 rounded">{{ player.gold }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <strong>Weapon:</strong>
              <span class="text-blue-600">{{ player.weapon.name }}</span>
              <span>(Stats: {{ player.weapon.stats }})</span>
            </div>
            <div class="flex items-center space-x-2">
              <strong>Armor:</strong>
              <span class="text-blue-400">{{ player.armor.name }}</span>
              <span>(Stats: {{ player.armor.stats }})</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex space-x-2 mb-2">
        <v-btn color="primary" @click="openModalCreateItem(index)" block>Create ITEM</v-btn>
      </div>
      <div class="flex space-x-2 mb-2">
        <v-btn color="primary" @click="openModalAddItem(index)" block>ADD ITEM</v-btn>
      </div>
      <div class="overflow-x-auto mt-4">
        <table class="min-w-full divide-y divide-gray-200 inventory-table">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-2 whitespace-nowrap text-sm font-medium actions">-</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, iIndex) in player.inventory" :key="iIndex" :class="{ 'bg-gray-100': item.selected }">
              <td class="px-6 py-2 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-6 py-2 whitespace-nowrap" :class="getItemClass(item.type)">
                {{ item.type }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">{{ item.stats }}</td>
              <td class="px-6 py-2 whitespace-nowrap">{{ item.level }}</td>
              <td class="px-6 py-2 whitespace-nowrap">{{ item.value }}</td>
              <td class="px-6 py-2 whitespace-nowrap">{{ item.quantity }}</td>
              <td class="px-6 py-2 whitespace-nowrap text-sm font-medium actions">
                <button
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :class="getItemClass(item.type)"
                  @click="item.type === 'healing' || item.type === 'food' ? useItem(index, iIndex) : selectItem(index, iIndex)"
                >
                  <span class="sr-only">Use</span>
                  <v-icon
                    :class="{
                      'text-white': item.type === 'healing' || item.type === 'food' || item.selected
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
                <button
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 bg-yellow-500"
                  @click="sellItem(index, iIndex)"
                >
                  <span class="sr-only">Sell</span>
                  <v-icon class="text-white">mdi-cash</v-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dialogs -->
    <v-dialog v-model="isModalOpenAddItem" max-width="500px">
      <v-card>
        <v-card-title>Add Item</v-card-title>
        <v-card-text>
          <v-select v-model="selectedPredefinedItem" :items="items" item-title="name" item-value="id" label="Select Predefined Item" dense clearable outlined></v-select>
          <v-text-field v-model.number="newItem.quantity" label="Quantity" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addItem">Add</v-btn>
          <v-btn color="error" @click="isModalOpenAddItem = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isModalOpenCreateItem" max-width="500px">
      <v-card>
        <v-card-title>Create Item</v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.name" label="Item Name" />
          <v-radio-group v-model="newItem.type" label="Type">
            <v-radio label="Healing" value="healing" />
            <v-radio label="Weapon" value="weapon" />
            <v-radio label="Armor" value="armor" />
            <v-radio label="Food" value="food" />
            <v-radio label="Other" value="other" />
          </v-radio-group>
          <v-text-field v-model.number="newItem.stats" label="Stats" v-if="newItem.type !== 'other'" type="number" />
          <v-text-field v-model.number="newItem.level" label="Level" type="number" />
          <v-text-field v-model.number="newItem.value" label="Value" type="number" />
          <v-text-field v-model.number="newItem.quantity" label="Quantity" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createItem">Add</v-btn>
          <v-btn color="error" @click="isModalOpenCreateItem = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isRestModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Rest</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="restHours" label="Enter hours to rest" type="number" min="1" step="1" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="applyRest">Rest</v-btn>
          <v-btn color="error" @click="isRestModalOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isPayModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Pay</v-card-title>
        <v-card-text>
          <p class="mb-4">
            <strong>{{ players[payPlayerIndex]?.name }}'s Gold:</strong>
            <span>{{ players[payPlayerIndex]?.gold }}</span>
          </p>
          <v-text-field v-model.number="payAmount" label="Enter amount to pay" type="number" min="10" step="10" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="applyPay" :disabled="payAmount > players[payPlayerIndex]?.gold">Pay</v-btn>
          <v-btn color="error" @click="closePayModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isSellModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Sell Item</v-card-title>
        <v-card-text>
          <p class="mb-4">
            <strong>{{ players[sellPlayerIndex]?.name }}'s Gold:</strong>
            <span>{{ players[sellPlayerIndex]?.gold }}</span>
          </p>
          <v-slider v-model="sellQuantity" :max="maxSellQuantity" label="Quantity to Sell" thumb-label="always" step="1"></v-slider>
          <v-text-field v-model.number="sellAmount" label="Total Sell Value" type="number" :value="calculateSellAmount()" readonly />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="applySell">Sell</v-btn>
          <v-btn color="error" @click="closeSellModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { addNotification } from '../stores/notificationStore'

const props = defineProps({
  weapons: Array,
  armors: Array,
  players: {
    type: Array,
    required: true,
    default: () => []
  },
  items: Array
})

const emit = defineEmits(['players-updated'])

const isModalOpenCreateItem = ref(false)
const isModalOpenAddItem = ref(false)
const isRestModalOpen = ref(false)
const isPayModalOpen = ref(false)
const isSellModalOpen = ref(false)
const restHours = ref(1)
const payAmount = ref(10)
const sellAmount = ref(0)
const sellQuantity = ref(1)
const maxSellQuantity = ref(1)
const editIndex = ref(null)
const newItem = ref({
  name: '',
  type: 'other',
  stats: 0,
  level: 1,
  value: 10,
  quantity: 1
})
const selectedPredefinedItem = ref(null)
const modalPlayerIndex = ref(null)
const restPlayerIndex = ref(null)
const payPlayerIndex = ref(null)
const sellPlayerIndex = ref(null)
const sellItemIndex = ref(null)

const players = ref([...props.players])

onMounted(() => {
  const storedPlayers = localStorage.getItem('players')
  if (storedPlayers) {
    players.value = JSON.parse(storedPlayers)
  }
})

const saveToLocalStorage = () => {
  localStorage.setItem('players', JSON.stringify(players.value))
}

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
  saveToLocalStorage()
}

const removePlayer = index => {
  players.value.splice(index, 1)
  saveToLocalStorage()
}

const savePlayer = index => {
  editIndex.value = null
  emit('players-updated', players.value)
  saveToLocalStorage()
}

const openModalCreateItem = index => {
  modalPlayerIndex.value = index
  resetNewItem()
  isModalOpenCreateItem.value = true
}

const openModalAddItem = index => {
  modalPlayerIndex.value = index
  resetNewItem()
  isModalOpenAddItem.value = true
}

const resetNewItem = () => {
  newItem.value = {
    name: '',
    type: 'other',
    stats: 0,
    level: 1,
    value: 10,
    quantity: 1
  }
  selectedPredefinedItem.value = null
}

const createItem = () => {
  addItemToInventory()
  isModalOpenCreateItem.value = false
}

const addItem = () => {
  if (selectedPredefinedItem.value) {
    const predefinedItem = props.items.find(item => item.id === selectedPredefinedItem.value)
    newItem.value = { ...predefinedItem, quantity: newItem.value.quantity }
  }
  addItemToInventory()
  isModalOpenAddItem.value = false
}

const addItemToInventory = () => {
  if (modalPlayerIndex.value !== null) {
    if (!players.value[modalPlayerIndex.value].inventory) {
      players.value[modalPlayerIndex.value].inventory = []
    }

    const itemType = newItem.value.type || 'other'
    const newItemWithId = {
      ...newItem.value,
      id: `${itemType.charAt(0).toUpperCase()}${Date.now()}`
    }

    players.value[modalPlayerIndex.value].inventory.push({
      ...newItemWithId,
      quantity: newItem.value.quantity
    })

    emit('players-updated', players.value)
    saveToLocalStorage()
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
    if (item.type !== 'other') {
      player.inventory.forEach(invItem => {
        if (invItem.type === item.type) invItem.selected = false
      })
    }
    item.selected = true
    if (item.type === 'weapon') {
      player.weapon = { ...item }
    } else if (item.type === 'armor') {
      player.armor = { ...item }
    }
  }
  addNotification({
    title: 'Item Used',
    message: `${player.name} selected ${item.name} (${item.type})`,
    color: 'blue'
  })
  emit('players-updated', players.value)
  saveToLocalStorage()
}

const useItem = (playerIndex, itemIndex) => {
  const player = players.value[playerIndex]
  const item = player.inventory[itemIndex]

  if (item.type === 'healing') {
    player.hp = Math.min(player.hp + Number(item.stats), player.maxHP)
    item.quantity -= 1
    if (item.quantity <= 0) {
      player.inventory.splice(itemIndex, 1)
    }
    addNotification({
      title: 'Healing Item Used',
      message: `${player.name} healed for ${item.stats} HP`,
      color: 'green'
    })
  } else if (item.type === 'food') {
    if (!foodHealingTracker.value[player.name]) {
      foodHealingTracker.value[player.name] = 0
    }

    const totalHealing = item.stats * 5
    const maxHealing = player.maxHP - foodHealingTracker.value[player.name]
    const appliedHealing = Math.min(totalHealing, maxHealing)
    foodHealingTracker.value[player.name] += appliedHealing

    player.hp = Math.min(player.hp + Number(item.stats), player.maxHP)
    item.quantity -= 1
    if (item.quantity <= 0) {
      player.inventory.splice(itemIndex, 1)
    }
    addNotification({
      title: 'Food Item Used',
      message: `${player.name} consumed ${item.name} and will heal for ${item.stats} HP 5 times`,
      color: 'red'
    })

    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        if (foodHealingTracker.value[player.name] > 0) {
          const healingAmount = Math.min(Number(item.stats), foodHealingTracker.value[player.name])
          player.hp = Math.min(player.hp + healingAmount, player.maxHP)
          foodHealingTracker.value[player.name] -= healingAmount
          emit('players-updated', players.value)
          saveToLocalStorage()
        }
      }, i * 60000)
    }
  }

  emit('players-updated', players.value)
  saveToLocalStorage()
}

const deleteItem = (playerIndex, itemIndex) => {
  const item = players.value[playerIndex].inventory[itemIndex]

  // Unselect the item if it's selected
  if (item.selected) {
    if (item.type === 'weapon' && players.value[playerIndex].weapon.id === item.id) {
      players.value[playerIndex].weapon = {
        id: null,
        name: '',
        stats: 0,
        type: 'weapon'
      }
    } else if (item.type === 'armor' && players.value[playerIndex].armor.id === item.id) {
      players.value[playerIndex].armor = {
        id: null,
        name: '',
        stats: 0,
        type: 'armor'
      }
    }
  }

  players.value[playerIndex].inventory.splice(itemIndex, 1)
  addNotification({
    title: 'Item Deleted',
    message: `Deleted ${item.name} from inventory`,
    color: 'gray'
  })
  emit('players-updated', players.value)
  saveToLocalStorage()
}

const openRestModal = index => {
  restPlayerIndex.value = index
  isRestModalOpen.value = true
}

const applyRest = () => {
  const player = players.value[restPlayerIndex.value]
  player.hp = Math.min(player.hp + restHours.value * 3, player.maxHP)
  addNotification({
    title: 'Rest',
    message: `${player.name} rested for ${restHours.value} hours and recovered ${restHours.value * 3} HP`,
    color: 'green'
  })
  isRestModalOpen.value = false
  emit('players-updated', players.value)
  saveToLocalStorage()
}

const openPayModal = index => {
  payPlayerIndex.value = index
  isPayModalOpen.value = true
}

const applyPay = () => {
  const player = players.value[payPlayerIndex.value]
  player.gold -= payAmount.value
  addNotification({
    title: 'Pay',
    message: `${player.name} paid ${payAmount.value} gold`,
    color: 'yellow'
  })
  isPayModalOpen.value = false
  payAmount.value = 10 // Reset the pay amount
  emit('players-updated', players.value)
  saveToLocalStorage()
}

const closePayModal = () => {
  isPayModalOpen.value = false
  payAmount.value = 10 // Reset the pay amount
}

const sellItem = (playerIndex, itemIndex) => {
  const item = players.value[playerIndex].inventory[itemIndex]
  if (item.quantity === 1) {
    players.value[playerIndex].gold += item.value
    players.value[playerIndex].inventory.splice(itemIndex, 1)
    addNotification({
      title: 'Item Sold',
      message: `Sold ${item.name} for ${item.value} gold`,
      color: 'yellow'
    })
    emit('players-updated', players.value)
    saveToLocalStorage()
  } else {
    sellPlayerIndex.value = playerIndex
    sellItemIndex.value = itemIndex
    sellQuantity.value = 1
    maxSellQuantity.value = item.quantity
    sellAmount.value = item.value
    isSellModalOpen.value = true
  }
}

const applySell = () => {
  const player = players.value[sellPlayerIndex.value]
  const item = player.inventory[sellItemIndex.value]
  const totalSellValue = sellQuantity.value * item.value

  player.gold += totalSellValue
  item.quantity -= sellQuantity.value

  if (item.quantity <= 0) {
    setTimeout(() => {
      player.inventory.splice(sellItemIndex.value, 1)
    }, 200)
  }

  addNotification({
    title: 'Item Sold',
    message: `Sold ${sellQuantity.value} x ${item.name} for ${totalSellValue} gold`,
    color: 'yellow'
  })

  // Ensure the modal closes after selling items
  isSellModalOpen.value = false
  emit('players-updated', players.value)
  setTimeout(() => {
    saveToLocalStorage()
  }, 250)

  // Reset sell quantity and sell amount after closing the modal
  sellQuantity.value = 1
  sellAmount.value = 0
}

const closeSellModal = () => {
  isSellModalOpen.value = false
  sellQuantity.value = 1
  sellAmount.value = 0
}

const calculateSellAmount = () => {
  const player = players.value[sellPlayerIndex.value]
  const item = player.inventory[sellItemIndex.value]
  return sellQuantity.value * item.value
}

const getItemIcon = type => {
  switch (type) {
    case 'healing':
      return 'mdi-heart-plus'
    case 'weapon':
      return 'mdi-sword-cross'
    case 'armor':
      return 'mdi-shield'
    case 'food':
      return 'mdi-food'
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
    case 'food':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const foodHealingTracker = ref({})

const foodHealingRemaining = player => {
  return foodHealingTracker.value[player.name] || 0
}

watch(players, newPlayers => {
  saveToLocalStorage()
})

watch(props.players, newPlayers => {
  players.value = [...newPlayers]
})

watch(selectedPredefinedItem, newValue => {
  if (newValue) {
    const predefinedItem = props.items.find(item => item.id === newValue)
    newItem.value = { ...predefinedItem, quantity: newItem.value.quantity }
  } else {
    resetNewItem()
  }
})
</script>

<style scoped>
.border {
  border: 1px solid #ddd;
}
.inventory-table th,
.inventory-table td {
  padding: 4px 8px;
}
.inventory-table .actions {
  text-align: right;
}
.actions .v-btn {
  padding: 2px;
  margin: 0 2px;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
}
.v-icon {
  font-size: 12px;
}
.actions .v-btn:hover {
  background-color: #ddd;
}
</style>
