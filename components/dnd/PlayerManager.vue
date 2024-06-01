<template>
  <v-card>
    <v-card-title>Player Manager</v-card-title>
    <v-card-text>
      <div v-if="isEditing">
        <div
          v-for="(player, index) in players"
          :key="index"
          class="mb-4 p-4 border rounded"
        >
          <v-text-field v-model="player.name" label="Player Name" />
          <v-text-field v-model="player.hp" label="HP" type="number" />
          <v-select
            v-model="player.weapon"
            :items="weaponOptions"
            item-title="name"
            item-value="id"
            label="Weapon"
            density="comfortable"
            return-object
            persistent-hint
          />
          <v-select
            v-model="player.armor"
            :items="armorOptions"
            item-title="name"
            item-value="id"
            label="Armor"
            density="comfortable"
            return-object
            persistent-hint
          />
          <v-btn color="error" @click="removePlayer(index)">Remove</v-btn>
        </div>
        <v-btn color="primary" @click="addPlayer">Add Player</v-btn>
        <v-btn color="success" @click="savePlayers">Save Players</v-btn>
      </div>
      <div v-else>
        <div
          v-for="(player, index) in players"
          :key="index"
          class="mb-4 p-4 border rounded"
        >
          <p><strong>Name:</strong> {{ player.name }}</p>
          <p><strong>HP:</strong> {{ player.hp }}</p>
          <p>
            <strong>Weapon:</strong> {{ player.weapon.name }} (Attack:
            {{ player.weapon.attack }})
          </p>
          <p>
            <strong>Armor:</strong> {{ player.armor.name }} (Defense:
            {{ player.armor.defense }})
          </p>
        </div>
        <v-btn color="primary" @click="isEditing = true">Edit Players</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weapons: Array,
  armors: Array,
  players: Array
})

const emit = defineEmits(['players-updated'])

const isEditing = ref(true)
const players = ref([...props.players])

const weaponOptions = props.weapons.map(weapon => ({
  id: weapon.id,
  name: weapon.name,
  attack: weapon.attack
}))
const armorOptions = props.armors.map(armor => ({
  id: armor.id,
  name: armor.name,
  defense: armor.defense
}))

const addPlayer = () => {
  players.value.push({
    name: '',
    hp: 0,
    weapon: null,
    armor: null
  })
}

const removePlayer = index => {
  players.value.splice(index, 1)
}

const savePlayers = () => {
  emit('players-updated', players.value)
  isEditing.value = false
}

watch(props.players, newPlayers => {
  players.value = [...newPlayers]
})
</script>

<style scoped></style>
