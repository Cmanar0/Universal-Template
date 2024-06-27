<template>
  <div class="tab-card shadow-md mx-1">
    <h1 class="text-2xl pb-6 font-bold">EXPENSES</h1>
    <p class="pb-4">
      Please define all types of expenses for your business. These might include expenses per product/service sold (if you are selling products or services), one-time expenses such
      as the purchase of office equipment, or recurring expenses.
    </p>
  </div>
  <div class="mt-6">
    <div class="expenses-container">
      <v-card class="p-6 m-1">
        <expenses-per-product />
      </v-card>
      <v-card class="p-6 m-1">
        <one-time-expenses />
      </v-card>
      <v-card class="p-6 m-1">
        <recurring-expenses />
      </v-card>
    </div>
  </div>
</template>

<script setup>
import ExpensesPerProduct from './expences-types/ExpensesPerProduct.vue'
import OneTimeExpenses from './expences-types/OneTimeExpenses.vue'
import RecurringExpenses from './expences-types/RecurringExpenses.vue'
</script>

<style scoped>
.expenses-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Gap between the components */

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.expenses-container > * {
  flex: 1;
  min-width: 250px; /* Adjust as needed */
}
</style>
