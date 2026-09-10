<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Bills & Subscriptions
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Track your recurring payments
        </p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Bill
      </button>
    </div>

    <div v-if="dueSoon.length > 0" class="card p-4 mb-6 border-l-4 border-orange-500">
      <h3 class="font-semibold text-orange-600 mb-2">Due Soon</h3>
      <div class="space-y-2">
        <div v-for="bill in dueSoon" :key="bill.id" class="flex items-center justify-between">
          <span class="text-gray-800 dark:text-white">{{ bill.name }}</span>
          <span class="font-semibold">{{ formatCurrency(bill.amount) }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="bill in bills"
        :key="bill.id"
        class="card p-4"
        :class="{ 'opacity-60': bill.isPaid }"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ bill.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Due: {{ formatDate(bill.nextDueDate) }}
            </p>
          </div>
          <span
            class="badge"
            :class="bill.isSubscription ? 'badge-warning' : 'badge-neutral'"
          >
            {{ bill.isSubscription ? 'Subscription' : 'Bill' }}
          </span>
        </div>
        
        <p class="text-xl font-bold text-gray-800 dark:text-white mb-3">
          {{ formatCurrency(bill.amount) }}
        </p>

        <div class="flex gap-2">
          <button
            v-if="!bill.isPaid"
            @click="markPaid(bill.id)"
            class="btn btn-primary flex-1 text-sm"
          >
            Mark Paid
          </button>
          <button
            v-else
            @click="markUnpaid(bill.id)"
            class="btn btn-secondary flex-1 text-sm"
          >
            Undo
          </button>
          <button @click="editBill(bill)" class="btn btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteBill(bill.id)" class="btn btn-ghost text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="bills.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No bills yet</h3>
      <p class="empty-state-description">Add your bills and subscriptions to track due dates</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">Add Bill</button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showAddModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ editMode ? 'Edit' : 'Add' }} Bill</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Bill Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Netflix" required />
          </div>

          <div>
            <label class="label">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="input" placeholder="9.99" required />
          </div>

          <div>
            <label class="label">Due Day</label>
            <input v-model.number="form.dueDay" type="number" min="1" max="31" class="input" required />
          </div>

          <div>
            <label class="label">Frequency</label>
            <select v-model="form.frequency" class="input">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One Time</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input v-model="form.isSubscription" type="checkbox" id="isSubscription" class="w-4 h-4" />
            <label for="isSubscription" class="text-sm text-gray-600 dark:text-gray-300">Is Subscription</label>
          </div>

          <div class="flex gap-3">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ editMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useBillStore, type Bill } from '../stores/billStore';

export default defineComponent({
  name: 'BillsView',
  setup() {
    const billStore = useBillStore();
    const showAddModal = ref(false);
    const editMode = ref(false);

    const form = reactive({
      id: null as number | null,
      name: '',
      amount: 0,
      dueDay: 1,
      frequency: 'monthly' as string,
      isSubscription: false
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const editBill = (bill: Bill) => {
      form.id = bill.id;
      form.name = bill.name;
      form.amount = bill.amount;
      form.dueDay = bill.dueDay;
      form.frequency = bill.frequency;
      form.isSubscription = bill.isSubscription;
      editMode.value = true;
      showAddModal.value = true;
    };

    const deleteBill = async (id: number) => {
      if (confirm('Delete this bill?')) {
        await billStore.deleteBill(id);
      }
    };

    const markPaid = async (id: number) => {
      await billStore.markPaid(id);
    };

    const markUnpaid = async (id: number) => {
      await billStore.markUnpaid(id);
    };

    const handleSubmit = async () => {
      if (editMode.value && form.id) {
        await billStore.updateBill(form.id, form);
      } else {
        await billStore.createBill(form);
      }
      closeModal();
    };

    const closeModal = () => {
      showAddModal.value = false;
      editMode.value = false;
      form.id = null;
      form.name = '';
      form.amount = 0;
      form.dueDay = 1;
      form.frequency = 'monthly';
      form.isSubscription = false;
    };

    onMounted(async () => {
      await billStore.fetchBills();
      await billStore.fetchDueSoon();
    });

    return {
      bills: billStore.bills,
      dueSoon: billStore.dueSoon,
      showAddModal,
      editMode,
      form,
      formatCurrency,
      formatDate,
      editBill,
      deleteBill,
      markPaid,
      markUnpaid,
      handleSubmit,
      closeModal
    };
  }
});
</script>