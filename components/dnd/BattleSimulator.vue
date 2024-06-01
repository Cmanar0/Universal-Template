<template>
  <v-card class="battle-simulator">
    <v-card-title>Battle Simulator</v-card-title>
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
      <div class="mt-7">
        <h3 class="text-xl mb-3">Participants in Battle</h3>
        <v-row>
          <v-col
            v-for="(participant, index) in battleParticipants"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card class="mb-4 bg-gray-100 relative">
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
                <p><strong>HP:</strong> {{ participant.hp }}</p>
                <p>
                  <strong>Weapon:</strong>
                  {{ participant.weapon.name }} (Attack:
                  {{ participant.weapon.attack }})
                </p>
                <p>
                  <strong>Armor:</strong> {{ participant.armor.name }} (Defense:
                  {{ participant.armor.defense }})
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
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BattleLog from './BattleLog.vue'

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
  battleLog.value.push(
    `<span class="text-red-600">${removed[0].name} has run away from the battle!</span>`
  )
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

  const diceRoll = Math.floor(Math.random() * 6) + 1
  const totalAttack = diceRoll + attacker.weapon.attack
  const totalDefense = defender.armor.defense
  const damage = totalAttack >= totalDefense ? totalAttack - totalDefense : 0

  defender.hp -= damage
  battleLog.value.push(
    `<span class="text-blue-500">${attacker.name} rolls a dice: ${diceRoll}</span> + 
    <span class="text-red-500">${attacker.weapon.name} attack: ${attacker.weapon.attack}</span> = 
    <span class="text-green-500">Total attack: ${totalAttack}</span> - 
    <span class="text-orange-500">${defender.name}'s ${defender.armor.name} defense: ${defender.armor.defense}</span> = 
    <span class="text-purple-500">Damage dealt: ${damage}</span>`
  )

  if (defender.hp <= 0) {
    battleLog.value.push(
      `<span class="text-red-600">${defender.name} has been defeated!</span>`
    )
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

.attacker-btn.selected,
.defender-btn.selected {
  background-color: #2196f3;
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
