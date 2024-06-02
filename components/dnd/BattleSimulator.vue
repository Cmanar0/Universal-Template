<template>
  <v-card-text>
    <v-card class="p-4">
      <v-row class="align-center">
        <v-col cols="9">
          <v-select
            v-model="selectedParticipant"
            :items="filteredParticipants"
            :search-input.sync="search"
            item-title="name"
            item-value="name"
            label="Select Participant to Add"
            density="comfortable"
            return-object
            persistent-hint
            clearable
            outlined
          ></v-select>
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
      <v-row class="align-center my-4">
        <v-col cols="3">
          <v-text-field
            v-model.number="inputNumber"
            label="Dice Roll"
            type="number"
            :min="1"
            :max="6"
            :disabled="attackerIndex === null || defenderIndex === null"
          />
        </v-col>
        <v-col cols="9">
          <v-btn
            color="red darken-3"
            class="attack-button"
            @click="simulateAttack"
            :disabled="
              attackerIndex === null ||
              defenderIndex === null ||
              inputNumber === null
            "
            block
          >
            ATTACK
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
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
            <v-card-title>
              {{ participant.name }}
              <span v-if="participant.level">
                (Level: {{ participant.level }})</span
              >
            </v-card-title>
            <v-card-text>
              <p>
                <strong>HP:</strong> {{ participant.hp }} /
                {{ participant.maxHP }} ({{
                  (participant.hp / participant.maxHP) * 100
                }}%)
              </p>
              <div
                class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-2 min-w-80"
              >
                <div
                  class="absolute top-0 left-0 h-full bg-green-500"
                  :style="{
                    width: (participant.hp / participant.maxHP) * 100 + '%'
                  }"
                ></div>
              </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import BattleLog from './BattleLog.vue'
import { addNotification } from '../../stores/notificationStore'

const props = defineProps({
  players: Array,
  enemies: Array,
  enemyTypes: Array,
  weapons: Array,
  armors: Array,
  healingItems: Array,
  otherItems: Array
})

const emit = defineEmits(['participant-defeated']) // New emit for defeated participant

const selectedParticipant = ref(null)
const battleParticipants = ref([])
const attackerIndex = ref(null)
const defenderIndex = ref(null)
const battleLog = ref([])
const inputNumber = ref(null)
const search = ref('')

const allParticipants = computed(() => {
  const allEntities = [...props.players, ...props.enemies, ...props.enemyTypes]
  return allEntities.map((entity, index) => ({
    id: index,
    name: entity.name,
    hp: entity.hp,
    maxHP: entity.maxHP,
    gold: entity.gold,
    weapon: entity.weapon,
    armor: entity.armor,
    level: entity.level // Ensure level is included
  }))
})

const filteredParticipants = computed(() => {
  if (!search.value) {
    return allParticipants.value
  }
  return allParticipants.value.filter(participant =>
    participant.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const addToBattle = () => {
  if (selectedParticipant.value) {
    const newParticipant = { ...selectedParticipant.value }

    // Only adjust attributes if the participant is an enemy type
    if (
      props.enemyTypes.some(enemyType => enemyType.name === newParticipant.name)
    ) {
      const enemyType = props.enemyTypes.find(
        enemyType => enemyType.name === newParticipant.name
      )
      const level = enemyType.level

      // Assign random weapon and armor based on level
      const availableWeapons = props.weapons.filter(
        weapon => weapon.level <= level
      )
      const availableArmors = props.armors.filter(armor => armor.level <= level)

      if (availableWeapons.length > 0) {
        newParticipant.weapon =
          availableWeapons[Math.floor(Math.random() * availableWeapons.length)]
      }
      if (availableArmors.length > 0) {
        newParticipant.armor =
          availableArmors[Math.floor(Math.random() * availableArmors.length)]
      }

      // Adjust HP
      const hpAdjustmentFactor = Math.random() * 0.4 + 0.8
      newParticipant.maxHP = Math.round(
        newParticipant.maxHP * hpAdjustmentFactor
      )
      newParticipant.hp = Math.round(
        newParticipant.maxHP * (Math.random() * 0.5 + 0.5)
      )

      // Add random items to inventory
      newParticipant.inventory = newParticipant.inventory || []

      // Add healing items of the same or lower level
      const availableHealingItems = props.healingItems.filter(
        item => item.level <= level
      )
      if (
        Math.floor(Math.random() * 10) + 1 > 5 &&
        availableHealingItems.length > 0
      ) {
        const healingItem =
          availableHealingItems[
            Math.floor(Math.random() * availableHealingItems.length)
          ]
        newParticipant.inventory.push(healingItem)
        console.log(
          `${newParticipant.name} received healing item: ${healingItem.name}`
        )
      }

      // Add other items of the same or lower level (attempt twice)
      const availableOtherItems = props.otherItems.filter(
        item => item.level <= level
      )
      for (let i = 0; i < 2; i++) {
        if (
          Math.floor(Math.random() * 10) + 1 > 5 &&
          availableOtherItems.length > 0
        ) {
          const otherItem =
            availableOtherItems[
              Math.floor(Math.random() * availableOtherItems.length)
            ]
          newParticipant.inventory.push(otherItem)
          console.log(
            `${newParticipant.name} received other item: ${otherItem.name}`
          )
        }
      }
    }

    battleParticipants.value.push(newParticipant)
    selectedParticipant.value = null
    search.value = ''
    console.log(newParticipant) // Log the participant to see added items
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
  if (
    attackerIndex.value === null ||
    defenderIndex.value === null ||
    inputNumber.value === null
  )
    return

  const attacker = battleParticipants.value[attackerIndex.value]
  const defender = battleParticipants.value[defenderIndex.value]

  const diceRoll = inputNumber.value
  const totalAttack = diceRoll + attacker.weapon.stats
  const totalDefense = defender.armor.stats
  const damage = totalAttack >= totalDefense ? totalAttack - totalDefense : 0

  defender.hp -= damage

  const currentTime = new Date().toLocaleTimeString()

  battleLog.value.unshift(
    `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-blue-500">${attacker.name} used input: ${diceRoll}</span> + 
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
      `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-red-600">${defender.name} has been defeated!</span>`
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
        `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-yellow-500">${attacker.name} gained ${goldGained} gold!</span>`
      )
      addNotification({
        title: 'Gold Gained',
        message: `${attacker.name} gained ${goldGained} gold!`,
        color: 'yellow'
      })

      if (defender.weapon) {
        battleLog.value.unshift(
          `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-green-500">${attacker.name} received ${defender.weapon.name}!</span>`
        )
      }
      if (defender.armor) {
        battleLog.value.unshift(
          `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-green-500">${attacker.name} received ${defender.armor.name}!</span>`
        )
      }
      if (defender.inventory && defender.inventory.length > 0) {
        defender.inventory.forEach(item => {
          battleLog.value.unshift(
            `<span class="text-gray-500">[${currentTime}]</span>  <span class="text-green-500">${attacker.name} received ${item.name}!</span>`
          )
        })
      }
    }

    // Emit event to transfer items and remove participant
    emit('participant-defeated', { attacker, defender })

    // Remove the defeated defender from the battle participants
    const removed = battleParticipants.value.splice(defenderIndex.value, 1)

    // Reset indices if necessary
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

  // Clear the input field
  inputNumber.value = null
}

watch(
  () => props.players,
  newPlayers => {
    const updatedParticipants = battleParticipants.value.map(participant => {
      const updatedParticipant = newPlayers.find(
        player => player.name === participant.name
      )
      return updatedParticipant ? updatedParticipant : participant
    })
    battleParticipants.value = updatedParticipants
  },
  { deep: true }
)

onMounted(() => {
  if (
    props.players.length > 0 ||
    props.enemies.length > 0 ||
    props.enemyTypes.length > 0
  ) {
    selectedParticipant.value = allParticipants.value[0]
  }
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
