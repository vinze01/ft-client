<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Recurring Transactions
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Auto-generated income and expenses
        </p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Recurring
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in recurring"
        :key="item.id"
        class="card p-4"
        :class="{ 'opacity-50': !item.isActive }"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="badge" :class="item.type === 'income' ? 'badge-success' : 'badge-danger'">
            {{ item.type }}
          </span>
          <span class="badge badge-neutral">{{ item.frequency }}</span>
        </div>
        
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{{ item.description }}</h3>
        <p class="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {{ formatCurrency(item.amount) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Next: {{ formatDate(item.nextExecution) }}
        </p>

        <div class="flex gap-2">
          <button @click="executeNow(item.id)" class="btn btn-primary flex-1 text-sm">Execute</button>
          <button @click="toggleActive(item)" class="btn btn-ghost">
            <svg v-if="item.isActive" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="recurring.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No recurring transactions</h3>
      <p class="empty-state-description">Set up automatic income and expenses</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">Add Recurring</button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showAddModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Add Recurring</h3>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Type</label>
            <select v-model="form.type" class="input">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label class="label">Description</label>
            <input v-model="form.description" type="text" class="input" placeholder="Monthly salary" required />
          </div>
          <div>
            <label class="label">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="input" required />
          </div>
          <div>
            <label class="label">Frequency</label>
            <select v-model="form.frequency" class="input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label class="label">Start Date</label>
            <input v-model="form.startDate" type="date" class="input" required />
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.autoGenerate" type="checkbox" id="autoGenerate" class="w-4 h-4" />
            <label for="autoGenerate" class="text-sm text-gray-600 dark:text-gray-300">Auto-generate transactions</label>
          </div>
          <div class="flex gap-3">
            <button type="button" @click="showAddModal = false" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useRecurringStore, type RecurringTransaction } from '../stores/recurringStore';

export default defineComponent({
  name: 'RecurringView',
  setup() {
    const recurringStore = useRecurringStore();
    const showAddModal = ref(false);

    const form = reactive({
      type: 'expense' as string,
      description: '',
      amount: 0,
      frequency: 'monthly' as string,
      startDate: new Date().toISOString().split('T')[0],
      autoGenerate: true
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const executeNow = async (id: number) => {
      await recurringStore.execute(id);
    };

    const toggleActive = async (item: RecurringTransaction) => {
      await recurringStore.updateRecurring(item.id, { isActive: !item.isActive });
    };

    const handleSubmit = async () => {
      await recurringStore.createRecurring(form);
      showAddModal.value = false;
    };

    onMounted(async () => {
      await recurringStore.fetchRecurring();
    });

    return {
      recurring: recurringStore.recurring,
      showAddModal,
      form,
      formatCurrency,
      formatDate,
      executeNow,
      toggleActive,
      handleSubmit
    };
  }
});
</script>