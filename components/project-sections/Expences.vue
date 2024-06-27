<template>
  <div class="tab-card shadow-md mx-1">
    <h1 class="text-2xl pb-6 font-bold">Expences types</h1>
    <p class="pb-4">
      Please define all types of expenses for your business. These might include expenses per product/service sold (if you are selling products or services), one-time expenses such
      as the purchase of office equipment, or recurring expenses.
    </p>
  </div>
  <div class="mt-6">
    <div class="expenses-container flex flex-wrap">
      <div class="cust-card p-6 m-1" style="width: calc(100% - 50px)">
        <expenses-per-product />
      </div>
      <div class="cust-card p-6 m-1" style="width: calc(100% - 50px)">
        <one-time-expenses />
      </div>
      <div class="cust-card p-6 m-1 w-full md:w-auto">
        <recurring-expenses />
      </div>
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
}

@media (min-width: 768px) {
  .expenses-container > :nth-child(1),
  .expenses-container > :nth-child(2) {
    width: 100px;
  }
}
</style>
