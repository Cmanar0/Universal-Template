<template>
  <v-card-text>
    <v-row class="align-center">
      <v-col cols="9">
        <v-select
          v-model="selectedParticipant"
          :items="allParticipants"
          item-title="name"
          item-value="id"
          label="Select Participant to Add"
          density="comfortable"
          return-object
          persistent-hint
        />
      </v-col>
      <v-col cols="3">
        <v-btn
          color="primary"
          @click="addToBattle"
          :disabled="!selectedParticipant"
          >Add to Battle</v-btn
        >
      </v-col>
    </v-row>
    <v-btn
      color="red darken-3"
      class="attack-button my-4"
      @click="simulateAttack"
      :disabled="attackerIndex === null || defenderIndex === null"
      block
    >
      ATTACK
    </v-btn>
    <div class="mt-4">
      <h3 class="text-xl text-center mb-4">Participants in Battle</h3>
      <v-row>
        <v-col
          v-for="(participant, index) in battleParticipants"
          :key="index"
          cols="12"
          md="6"
        >
          <v-card class="mb-4 relative">
            <v-btn
              icon
              small
              class="remove-btn"
              @click="removeParticipant(index)"
            >
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
            <v-card-title>{{ participant.name }}</v-card-title>
            <v-card-text>
              <p>
                <strong>HP:</strong> {{ participant.hp }} /
                {{ participant.maxHP }}
              </p>
              <p>
                <strong>Weapon:</strong>
                {{ participant.weapon.name }} (Stats:
                {{ participant.weapon.stats }})
              </p>
              <p>
                <strong>Armor:</strong> {{ participant.armor.name }} (Stats:
                {{ participant.armor.stats }})
              </p>
              <v-row class="mt-2">
                <v-col>
                  <v-btn
                    class="attacker-btn"
                    @click="setAsAttacker(index)"
                    :class="{ selected: attackerIndex === index }"
                  >
                    <img
                      src="../../assets/sword.png"
                      alt="Attacker"
                      class="icon-img"
                    />
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    class="defender-btn"
                    @click="setAsDefender(index)"
                    :class="{ selected: defenderIndex === index }"
                  >
                    <img
                      src="../../assets/shield.png"
                      alt="Defender"
                      class="icon-img"
                    />
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <battle-log :logs="battleLog"></battle-log>
  </v-card-text>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BattleLog from './BattleLog.vue'
import { addNotification } from '../../stores/notificationStore'

const props = defineProps({
  players: Array,
  enemies: Array,
  weapons: Array,
  armors: Array
})

const selectedParticipant = ref(null)
const battleParticipants = ref([])
const attackerIndex = ref(null)
const defenderIndex = ref(null)
const battleLog = ref([])

const allParticipants = computed(() => {
  const allEntities = [...props.players, ...props.enemies]
  return allEntities.map((entity, index) => ({
    id: index,
    name: entity.name,
    hp: entity.hp,
    maxHP: entity.maxHP,
    gold: entity.gold,
    weapon: entity.weapon,
    armor: entity.armor
  }))
})

const addToBattle = () => {
  if (selectedParticipant.value) {
    const newParticipant = { ...selectedParticipant.value }
    battleParticipants.value.push(newParticipant)
    selectedParticipant.value = null
  }
}

const removeParticipant = index => {
  const removed = battleParticipants.value.splice(index, 1)
  battleLog.value.unshift(
    `<span class="text-red-600">${removed[0].name} has run away from the battle!</span>`
  )
  addNotification({
    title: 'Participant Run Away',
    message: `${removed[0].name} has run away from the battle!`,
    color: 'gray'
  })
  if (index === attackerIndex.value) {
    attackerIndex.value = null
  }
  if (index === defenderIndex.value) {
    defenderIndex.value = null
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

  if (attacker.name === defender.name) {
    battleLog.value.unshift(
      `<span class="text-red-600">${attacker.name} cannot attack themselves!</span>`
    )
    addNotification({
      title: 'Invalid Attack',
      message: `${attacker.name} cannot attack themselves!`,
      color: 'red'
    })
    return
  }

  const diceRoll = Math.floor(Math.random() * 6) + 1
  const totalAttack = diceRoll + attacker.weapon.stats
  const totalDefense = defender.armor.stats
  const damage = totalAttack >= totalDefense ? totalAttack - totalDefense : 0

  defender.hp -= damage

  battleLog.value.unshift(
    `<span class="text-blue-500">${attacker.name} rolls a dice: ${diceRoll}</span> + 
    <span class="text-red-500">${attacker.weapon.name} attack: ${attacker.weapon.stats}</span> = 
    <span class="text-green-500">Total attack: ${totalAttack}</span> - 
    <span class="text-orange-500">${defender.name}'s ${defender.armor.name} defense: ${defender.armor.stats}</span> = 
    <span class="text-purple-500">Damage dealt: ${damage}</span>`
  )

  addNotification({
    title: 'Attack',
    message: `${attacker.name} attacked ${defender.name} dealing ${damage} damage`,
    color: 'red'
  })

  if (defender.hp <= 0) {
    battleLog.value.unshift(
      `<span class="text-red-600">${defender.name} has been defeated!</span>`
    )
    addNotification({
      title: 'Defeat',
      message: `${defender.name} has been defeated!`,
      color: 'red'
    })

    if (attacker.name !== defender.name) {
      const goldGained = Math.floor(Math.random() * 50) + 10
      attacker.gold += goldGained
      battleLog.value.unshift(
        `<span class="text-yellow-500">${attacker.name} gained ${goldGained} gold!</span>`
      )
      addNotification({
        title: 'Gold Gained',
        message: `${attacker.name} gained ${goldGained} gold!`,
        color: 'yellow'
      })
    }

    battleParticipants.value.splice(defenderIndex.value, 1)
    if (defenderIndex.value === attackerIndex.value) {
      attackerIndex.value = null
    }
    defenderIndex.value = null
  }

  // Update original player's HP and gold
  const originalDefender = props.players.find(p => p.name === defender.name)
  if (originalDefender) {
    originalDefender.hp = defender.hp
  }
  const originalAttacker = props.players.find(p => p.name === attacker.name)
  if (originalAttacker) {
    originalAttacker.gold = attacker.gold
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

<style scoped>
.battle-simulator {
  min-height: 360px;
}

.attack-button {
  font-weight: bold;
  font-size: 1.5rem;
  width: 100%;
  height: 60px;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.icon-img {
  width: 24px;
  height: 24px;
}

.attacker-btn,
.defender-btn {
  width: 100%;
  height: 48px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
}

.attacker-btn.selected {
  background-color: #2196f3;
  border-color: #2196f3;
}
.defender-btn.selected {
  background-color: #f32121;
  border-color: #f32121;
}
.attacker-btn img,
.defender-btn img {
  filter: invert(0);
}

.attacker-btn.selected img,
.defender-btn.selected img {
  filter: invert(1);
}

.v-row .v-col {
  display: flex;
  justify-content: center;
}
</style>
