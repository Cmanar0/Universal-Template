<template>
  <div>
    <h2 class="text-2xl mb-4">Battle Simulator</h2>
    <div>
      <v-select
        v-model="selectedPlayer"
        :items="allParticipants"
        item-title="name"
        item-value="id"
        label="Select Player to Add"
        density="comfortable"
        return-object
        persistent-hint
      />
      <v-btn color="primary" @click="addToBattle" :disabled="!selectedPlayer"
        >Add to Battle</v-btn
      >
    </div>
    <div class="mt-4">
      <h3 class="text-xl">Participants in Battle</h3>
      <ul>
        <li v-for="(player, index) in battleParticipants" :key="index">
          <v-btn
            @click="setAsAttacker(index)"
            :color="attackerIndex === index ? 'primary' : 'default'"
          >
            {{ player.name }} (Attacker)
          </v-btn>
          <v-btn
            @click="setAsDefender(index)"
            :color="defenderIndex === index ? 'primary' : 'default'"
          >
            {{ player.name }} (Defender)
          </v-btn>
        </li>
      </ul>
    </div>
    <v-btn
      color="primary"
      @click="simulateAttack"
      :disabled="attackerIndex === null || defenderIndex === null"
    >
      Simulate Attack
    </v-btn>
    <div class="mt-4">
      <h3 class="text-xl">Battle Log</h3>
      <ul>
        <li v-for="log in battleLog" :key="log">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  players: Array,
  weapons: Array,
  armors: Array
})

const selectedPlayer = ref(null)
const battleParticipants = ref([])
const attackerIndex = ref(null)
const defenderIndex = ref(null)
const battleLog = ref([])

const allParticipants = computed(() => {
  return props.players.map((player, index) => ({
    id: index,
    name: player.name,
    hp: player.hp,
    weapon: player.weapon,
    armor: player.armor
  }))
})

const addToBattle = () => {
  if (
    selectedPlayer.value &&
    !battleParticipants.value.includes(selectedPlayer.value)
  ) {
    battleParticipants.value.push(selectedPlayer.value)
    selectedPlayer.value = null
  }
}

const setAsAttacker = index => {
  attackerIndex.value = index
}

const setAsDefender = index => {
  defenderIndex.value = index
}

const simulateAttack = () => {
  if (attackerIndex.value === null || defenderIndex.value === null) return

  const attacker = battleParticipants.value[attackerIndex.value]
  const defender = battleParticipants.value[defenderIndex.value]

  const attackRoll = Math.floor(Math.random() * 6) + 1 + attacker.weapon.attack
  const defenseValue = defender.armor.defense

  if (attackRoll >= defenseValue) {
    const damage = Math.floor(Math.random() * 6) + 1
    defender.hp -= damage
    battleLog.value.push(
      `${attacker.name} attacks ${defender.name} for ${damage} damage!`
    )
  } else {
    battleLog.value.push(
      `${attacker.name} attacks ${defender.name} but misses!`
    )
  }

  if (defender.hp <= 0) {
    battleLog.value.push(`${defender.name} has been defeated!`)
    battleParticipants.value.splice(defenderIndex.value, 1)
    if (defenderIndex.value === attackerIndex.value) {
      attackerIndex.value = null
    }
    defenderIndex.value = null
  }

  // Update original player's HP
  const originalDefender = props.players.find(p => p.name === defender.name)
  if (originalDefender) {
    originalDefender.hp = defender.hp
  }
}

watch(props.players, newPlayers => {
  // Update participants in battle with new players data
  battleParticipants.value = battleParticipants.value.map(participant => {
    const updatedParticipant = newPlayers.find(
      player => player.name === participant.name
    )
    return updatedParticipant ? updatedParticipant : participant
  })
})
</script>

<style scoped></style>
