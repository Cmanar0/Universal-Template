<template>
  <v-card>
    <v-card-title>Player Manager</v-card-title>
    <v-card-text>
      <div
        v-for="(player, index) in players"
        :key="index"
        class="mb-4 p-4 border rounded"
      >
        <v-row>
          <v-col cols="12" md="6">
            <div v-if="editIndex === index">
              <v-text-field v-model="player.name" label="Player Name" />
              <v-text-field
                v-model.number="player.hp"
                label="HP"
                type="number"
              />
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
              <p><strong>Name:</strong> {{ player.name }}</p>
              <p><strong>HP:</strong> {{ player.hp }} / {{ player.maxHP }}</p>
              <p><strong>Gold:</strong> {{ player.gold }}</p>
              <p>
                <strong>Weapon:</strong> {{ player.weapon.name }} (Stats:
                {{ player.weapon.stats }})
              </p>
              <p>
                <strong>Armor:</strong> {{ player.armor.name }} (Stats:
                {{ player.armor.stats }})
              </p>
              <v-btn color="primary" @click="editIndex = index">Edit</v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h4>Inventory</h4>
            <v-btn color="primary" @click="openModal(index)">Add Item</v-btn>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Stats</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, iIndex) in player.inventory"
                  :key="iIndex"
                  :class="{ selected: item.selected }"
                >
                  <td>{{ item.name }}</td>
                  <td v-if="item.type !== 'other'" :class="item.type">
                    {{ item.type }}
                  </td>
                  <td>{{ item.stats }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>
                    <v-btn
                      icon
                      color="green"
                      @click="
                        item.type === 'healing'
                          ? useHealingItem(index, iIndex)
                          : selectItem(index, iIndex)
                      "
                    >
                      <v-icon>{{ getItemIcon(item.type) }}</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteItem(index, iIndex)">
                      <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
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
  </v-card>
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
}
.selected {
  background-color: #e0e0e0;
}
.weapon {
  color: blue;
}
.armor {
  color: green;
}
.healing {
  color: red;
}
</style>
